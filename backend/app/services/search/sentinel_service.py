import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from uuid import UUID
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.models.writer_watchlist import WriterWatchlist
from app.models.alert import Alert
from app.models.work import Work
from app.services.search.mlc_client import mlc_client
from app.services.search.sacem_client import sacem_client
from app.services.search.distributor_scanner import distributor_scanner

logger = logging.getLogger(__name__)

class SentinelService:
    """Orchestrator for automated scraping and repeated monitoring of writers/handlers across societies and distributors."""

    async def scan_writer_handler(self, handler_id: UUID, db: AsyncSession) -> Dict[str, Any]:
        result = await db.execute(select(WriterWatchlist).where(WriterWatchlist.id == handler_id))
        handler = result.scalar_one_or_none()
        if not handler:
            return {"error": "Handler not found"}

        mlc_works: List[Dict[str, Any]] = []
        sacem_works: List[Dict[str, Any]] = []
        all_discovered_works: List[Dict[str, Any]] = []

        # 1. SCAN THE MLC (USA Mechanical Licensing Collective)
        ip_id = handler.mlc_ip_id
        if not ip_id:
            # Try searching by IPI number first, then legal name, then display name
            search_terms = []
            if handler.ipi_number:
                search_terms.append(handler.ipi_number)
            if handler.legal_name:
                search_terms.append(handler.legal_name)
            search_terms.append(handler.name)

            for term in search_terms:
                writers = await mlc_client.search_writers(term)
                if writers:
                    # Pick first exact or best match
                    best = writers[0]
                    ip_id = best.get("ip_id")
                    handler.mlc_ip_id = ip_id
                    if not handler.ipi_number and best.get("ipi_number"):
                        handler.ipi_number = best.get("ipi_number")
                    break

        if ip_id:
            mlc_works = await mlc_client.get_writer_works(ip_id, size=100)
            all_discovered_works.extend(mlc_works)

        # 2. SCAN SACEM DE PARIS & SDRM (French & European collective)
        sacem_query_name = handler.legal_name or handler.name
        sacem_works = await sacem_client.search_works_by_writer(sacem_query_name, handler.ipi_number)
        all_discovered_works.extend(sacem_works)

        # 3. SCAN DISTROKID & DIGITAL STREAMING DISTRIBUTION CREDITS
        # Verify DSP credits for registered works
        dsp_checks = []
        sample_works = all_discovered_works[:5] if all_discovered_works else []
        for w in sample_works:
            w_title = w.get("title", "")
            if w_title:
                aliases = handler.aliases if handler.aliases else [handler.name]
                check = await distributor_scanner.verify_lyricist_credits(w_title, aliases)
                dsp_checks.append(check)

        # 4. DIFF AGAINST PREVIOUS KNOWN WORKS TO IDENTIFY NEW REGISTRATIONS
        previous_known = handler.known_works or []
        previous_song_codes = {w.get("song_code") for w in previous_known if w.get("song_code")}
        previous_titles = {w.get("title", "").strip().upper() for w in previous_known if w.get("title")}

        new_works = []
        alerts_created = 0

        # We need a work_id reference for Alert table (foreign key required)
        work_res = await db.execute(select(Work).where(Work.user_id == handler.user_id))
        user_work = work_res.scalars().first()
        if not user_work:
            import uuid
            user_work = Work(
                id=uuid.uuid4(),
                user_id=handler.user_id,
                title=f"{handler.name} Repertoire",
                title_ar=f"مصنفات {handler.name}",
                work_type="composition",
                lyricist=handler.legal_name or handler.name,
                monitoring_enabled=True
            )
            db.add(user_work)
            await db.flush()

        for w in all_discovered_works:
            song_code = w.get("song_code")
            title = w.get("title", "").strip().upper()

            is_new = False
            if song_code and song_code not in previous_song_codes:
                is_new = True
            elif not song_code and title and title not in previous_titles:
                is_new = True

            if is_new:
                new_works.append(w)
                if user_work:
                    # Create Alert in database
                    source_society = w.get("source", "The MLC / Collective Society")
                    writers_names = ", ".join([wr.get("full_name") or wr.get("name", "") for wr in w.get("writers", [])])
                    pubs_names = ", ".join([p.get("publisher_name") or p.get("name", "") for p in w.get("publishers", [])])

                    alert = Alert(
                        user_id=handler.user_id,
                        work_id=user_work.id,
                        severity="high",
                        match_type="new_registration",
                        confidence=1.0,
                        platform=source_society,
                        infringing_url="https://portal.themlc.com/search",
                        evidence_data={
                            "event": "new_work_registered",
                            "work_title": w.get("title"),
                            "song_code": song_code,
                            "iswc": w.get("iswc"),
                            "writers": writers_names,
                            "publishers": pubs_names,
                            "total_known_shares": w.get("total_known_shares", 100),
                            "detected_via": "Writer Sentinel Scraper",
                            "writer_handler": handler.name
                        },
                        status="new"
                    )
                    db.add(alert)
                    alerts_created += 1

        # 5. DEDUPLICATE & UPDATE SNAPSHOT
        seen_keys = set()
        deduped_works = []
        for w in all_discovered_works:
            key = (w.get("song_code") or w.get("title", "")).strip().upper()
            if key and key not in seen_keys:
                seen_keys.add(key)
                deduped_works.append(w)

        handler.known_works = deduped_works
        handler.mlc_works_count = len(mlc_works)
        handler.sacem_works_count = len(sacem_works)
        handler.works_count = len(deduped_works)
        handler.last_scanned_at = datetime.now(timezone.utc)

        await db.commit()
        await db.refresh(handler)

        return {
            "handler_id": handler.id,
            "handler_name": handler.name,
            "total_found_works": len(deduped_works),
            "mlc_works_found": len(mlc_works),
            "sacem_works_found": len(sacem_works),
            "dsp_tracks_found": len(dsp_checks),
            "new_works_detected": len(new_works),
            "alerts_created": alerts_created,
            "message": f"Scan completed. Found {len(deduped_works)} works ({len(mlc_works)} in The MLC, {len(sacem_works)} in SACEM/SDRM). {len(new_works)} new registrations flagged.",
            "works": deduped_works
        }

sentinel_service = SentinelService()
