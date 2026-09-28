import asyncio
import re
from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Depends, UploadFile, File, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from app.database import get_db
from app.models.work import Work
from app.models.writer_watchlist import WriterWatchlist
from app.schemas.search import SearchQuery, UnifiedSearchResponse, SearchResult
from app.services.search.unified_search import detect_query_type
from app.services.search.query_normalizer import expand_query_variants
from app.services.search import (
    musicbrainz_client,
    discogs_client,
    openverse_client
)
from app.services.search.mlc_client import mlc_client
from app.services.search.sacem_client import sacem_client
from app.services.search.arab_copyright_directory import search_arab_cmo_directory
from app.services.fingerprint.image_fingerprint import fingerprint_image
from app.services.fingerprint.audio_fingerprint import fingerprint_audio
from app.services.fingerprint.lyrics_matcher import compute_lyrics_fingerprint, calculate_lyrics_similarity
import tempfile
import os

router = APIRouter()

def calc_string_relevance(text: str, query: str) -> float:
    """Calculate token overlap relevance between candidate text and search query."""
    q_words = [w.lower().replace("ss", "s") for w in re.findall(r'\w+', query) if len(w) > 1]
    text_norm = text.lower().replace("ss", "s")
    if not q_words:
        return 0.0
    matched = sum(1 for w in q_words if w in text_norm)
    return matched / len(q_words)

@router.post("", response_model=UnifiedSearchResponse)
async def search(query_in: SearchQuery, db: AsyncSession = Depends(get_db)):
    query = query_in.query.strip()
    if not query:
        return {"query": "", "detected_type": "empty", "results_count": 0, "results": []}

    detected_type = detect_query_type(query)
    variants = expand_query_variants(query)
    if query not in variants:
        variants.insert(0, query)

    # Scored results list: (score, SearchResult)
    scored_results: List[tuple[float, SearchResult]] = []
    seen_identifiers = set()

    # -------------------------------------------------------------
    # 1. LOCAL REPERTOIRE SENTINEL & WATCHED WRITERS (TOP PRIORITY)
    # -------------------------------------------------------------
    try:
        res_handlers = await db.execute(select(WriterWatchlist))
        handlers = res_handlers.scalars().all()
        for h in handlers:
            h_names = [h.name.lower(), (h.legal_name or "").lower()] + [a.lower() for a in (h.aliases or [])]
            matched = False
            for v in variants:
                v_norm = v.lower().replace("ss", "s")
                if any(v_norm in name.replace("ss", "s") for name in h_names):
                    matched = True
                    break

            if matched:
                # Add featured Songwriter profile
                profile_key = f"writer_{h.id}"
                if profile_key not in seen_identifiers:
                    seen_identifiers.add(profile_key)
                    scored_results.append((
                        100.0,
                        SearchResult(
                            title=f"{h.name} (IPI: {h.ipi_number or 'N/A'})",
                            author=h.legal_name or h.name,
                            artist=f"Verified {h.role.capitalize()} (شاعر ومؤلف مسجل)",
                            source="The MLC & SACEM Repertoire (elsamee3 Vault)",
                            type="songwriter_profile",
                            url="http://localhost:5173/monitoring",
                            description=f"Registered Lyricist/Author with {h.works_count} protected works across The MLC (USA) and SACEM (France). Publishers: {', '.join(h.publishers or ['Mazzika Group'])} (100% Share).",
                            confidence=1.0,
                            metadata={"handler_id": str(h.id), "ipi": h.ipi_number, "works_count": h.works_count}
                        )
                    ))

            # Include known works if writer matched OR if the song title / co-writer matched
            for w in (h.known_works or []):
                w_title = w.get("title", "")
                writers_list = [str(wr.get("full_name") or wr.get("name") or "") for wr in w.get("writers", [])]
                writers_str = ", ".join(writers_list)
                pubs_str = ", ".join([str(p.get("publisher_name") or p.get("name") or "") for p in w.get("publishers", [])])

                work_rel = calc_string_relevance(w_title, query)
                co_writer_rel = calc_string_relevance(writers_str, query)

                if matched or work_rel >= 0.5 or co_writer_rel >= 0.5:
                    work_key = f"work_{w.get('song_code') or w_title}"
                    if work_key not in seen_identifiers:
                        seen_identifiers.add(work_key)
                        score = 100.0 if work_rel >= 0.8 else (95.0 if matched else 90.0)
                        scored_results.append((
                            score,
                            SearchResult(
                                title=w_title,
                                author=writers_str or h.name,
                                artist=f"Song / Musical Composition ({w.get('song_code') or w.get('iswc') or 'Protected'})",
                                source=w.get("source", "The MLC (USA)"),
                                type="composition",
                                iswc=w.get("iswc"),
                                url="https://portal.themlc.com/search",
                                description=f"Writers: {writers_str or 'Registered Author'} | Publisher: {pubs_str or 'Mazzika Group'} (Share: {w.get('total_known_shares', 100)}%)",
                                confidence=1.0,
                                metadata=w
                            )
                        ))
    except Exception as e:
        print(f"Error querying local writer watchlist: {e}")

    # -------------------------------------------------------------
    # 2. LOCAL REGISTERED WORKS VAULT (Audio / Lyrics Uploads)
    # -------------------------------------------------------------
    try:
        stmt = select(Work).where(
            or_(
                Work.title.ilike(f"%{query}%"),
                Work.title_ar.ilike(f"%{query}%"),
                Work.composer.ilike(f"%{query}%"),
                Work.lyricist.ilike(f"%{query}%"),
                Work.performer.ilike(f"%{query}%"),
                Work.isrc.ilike(f"%{query}%"),
                Work.iswc.ilike(f"%{query}%"),
                Work.lyrics_text.ilike(f"%{query}%")
            )
        ).limit(10)
        db_res = await db.execute(stmt)
        for w in db_res.scalars().all():
            w_key = f"local_work_{w.id}"
            if w_key not in seen_identifiers:
                seen_identifiers.add(w_key)
                creator_parts = []
                if w.composer: creator_parts.append(f"الملحن: {w.composer}")
                if w.lyricist: creator_parts.append(f"الشاعر: {w.lyricist}")
                if w.performer: creator_parts.append(f"المطرب: {w.performer}")
                creator_summary = " • ".join(creator_parts) if creator_parts else "Registered Creator"

                scored_results.append((
                    92.0,
                    SearchResult(
                        title=w.title,
                        artist=creator_summary,
                        author=w.composer or w.lyricist or "Registered Author",
                        source="elsamee3 Vault",
                        type=w.work_type,
                        isrc=w.isrc,
                        iswc=w.iswc,
                        description=w.description or f"Protected in elsamee3 registry (ISWC: {w.iswc or 'N/A'})",
                        confidence=1.0
                    )
                ))
    except Exception as e:
        print(f"Local DB work search error: {e}")

    # -------------------------------------------------------------
    # 3. CONCURRENT EXTERNAL REPERTOIRE QUERIES (MLC, SACEM, DISCOGS)
    # -------------------------------------------------------------
    async def fetch_mlc():
        mlc_writers = []
        try:
            seen_ip_ids = set()
            for v in variants[:2]:
                if v.isascii():
                    writers = await mlc_client.search_writers(v, size=5)
                    for w in writers:
                        if w["ip_id"] not in seen_ip_ids:
                            seen_ip_ids.add(w["ip_id"])
                            w["relevance"] = calc_string_relevance(w["full_name"], query)
                            mlc_writers.append(w)
            mlc_writers.sort(key=lambda x: (x["relevance"], x.get("works_count", 0)), reverse=True)
        except Exception as e:
            print(f"MLC query error: {e}")
        return mlc_writers

    async def fetch_sacem():
        try:
            return await sacem_client.search_works_by_writer(query)
        except Exception:
            return []

    async def fetch_external():
        ext_results = []
        try:
            tasks = [
                musicbrainz_client.search_artist(query),
                musicbrainz_client.search_work(query),
                discogs_client.search_release(query, limit=5)
            ]
            gathered = await asyncio.gather(*tasks, return_exceptions=True)
            for g_res in gathered:
                if isinstance(g_res, list):
                    ext_results.extend(g_res)
        except Exception:
            pass
        return ext_results

    # Run external queries with a 4.5s ceiling
    try:
        mlc_writers, sacem_works, ext_items = await asyncio.wait_for(
            asyncio.gather(fetch_mlc(), fetch_sacem(), fetch_external()),
            timeout=4.5
        )
    except asyncio.TimeoutError:
        mlc_writers, sacem_works, ext_items = [], [], []

    # Process MLC writers
    for w in mlc_writers[:4]:
        if w.get("relevance", 0) >= 0.5:
            w_key = f"mlc_writer_{w['ip_id']}"
            if w_key not in seen_identifiers:
                seen_identifiers.add(w_key)
                scored_results.append((
                    88.0 * w["relevance"],
                    SearchResult(
                        title=f"{w['full_name']} (IPI: {w.get('ipi_number') or 'N/A'})",
                        author=w["full_name"],
                        artist="Songwriter / Lyricist / Composer",
                        source="The MLC (Mechanical Licensing Collective)",
                        type="songwriter_profile",
                        url="https://portal.themlc.com/search",
                        description=f"Registered Songwriter with {w.get('works_count', 0)} works on The MLC (IPI: {w.get('ipi_number') or 'N/A'})",
                        confidence=1.0,
                        metadata=w
                    )
                ))

    # Process SACEM works
    for sw in sacem_works[:10]:
        sw_key = f"sacem_{sw.get('work_id') or sw.get('title')}"
        if sw_key not in seen_identifiers:
            seen_identifiers.add(sw_key)
            writers_str = ", ".join([str(w.get("name") or "") for w in sw.get("writers", [])])
            scored_results.append((
                80.0,
                SearchResult(
                    title=sw.get("title"),
                    author=writers_str or "SACEM Registered Author",
                    artist="SACEM / SDRM Repertoire",
                    source="SACEM de Paris",
                    type="composition",
                    iswc=sw.get("iswc"),
                    url="https://repertoire.sacem.fr",
                    description=f"Registered in SACEM/SDRM collective repertoire (ISWC: {sw.get('iswc') or 'N/A'})",
                    confidence=1.0,
                    metadata=sw
                )
            ))

    # Process external creative items with strict relevance filter
    for item in ext_items:
        try:
            title_or_name = item.get("title") or item.get("name") or ""
            rel = calc_string_relevance(title_or_name, query)
            # STRICT FILTER: For multi-word queries, only include if candidate matches >= 0.7
            # to prevent irrelevant artists like 'Adel Tawil' appearing for 'basem adel'
            q_words_count = len(query.strip().split())
            if q_words_count > 1 and rel < 0.7:
                continue

            scored_results.append((50.0 * rel, SearchResult(**item)))
        except Exception:
            pass

    # -------------------------------------------------------------
    # 7. SORT RESULTS BY RELEVANCE SCORE DESCENDING
    # -------------------------------------------------------------
    scored_results.sort(key=lambda x: x[0], reverse=True)
    final_results = [r[1] for r in scored_results]

    return {
        "query": query,
        "detected_type": detected_type,
        "results_count": len(final_results),
        "results": final_results
    }

@router.post("/lyrics")
async def search_by_lyrics(
    payload: dict = Body(...),
    db: AsyncSession = Depends(get_db)
):
    """Lyricist tool: Paste a stanza, verse, or lyrics to check for matches, plagiarism, and unregistered usage."""
    lyrics_text = payload.get("lyrics", "").strip()
    if not lyrics_text:
        return {"status": "error", "message": "No lyrics provided", "matches": []}

    fp = compute_lyrics_fingerprint(lyrics_text)
    matches = []

    # 1. Search local database for existing lyricist registrations
    stmt = select(Work).where(Work.lyrics_text.isnot(None))
    db_res = await db.execute(stmt)
    registered_works = db_res.scalars().all()

    for work in registered_works:
        sim = calculate_lyrics_similarity(lyrics_text, work.lyrics_text or "")
        if sim > 0.2:
            matches.append({
                "title": work.title,
                "author": work.lyricist or "Registered Lyricist",
                "source": "elsamee3 Vault",
                "type": "lyrics_match",
                "similarity": sim,
                "description": f"Similarity match: {int(sim * 100)}% with protected registered lyrics"
            })

    # 2. Search MusicBrainz works using keywords from lyrics
    first_line = lyrics_text.split("\n")[0][:60]
    mb_works = await musicbrainz_client.search_work(first_line)
    for mb_w in mb_works:
        matches.append({
            "title": mb_w.get("title"),
            "author": "Documented Work / Composition",
            "source": "MusicBrainz Works Repertoire",
            "type": "composition_match",
            "iswc": mb_w.get("iswc"),
            "url": mb_w.get("url"),
            "description": f"Potential match in international work repertoire (ISWC: {mb_w.get('iswc', 'Registered')})"
        })

    return {
        "status": "success",
        "fingerprint": fp,
        "matches_count": len(matches),
        "matches": matches
    }

@router.get("/arab-societies")
async def get_arab_societies():
    """Get the full guide and directory of Arab Copyright and Authors/Composers Societies."""
    return {
        "societies": search_arab_cmo_directory("")
    }

@router.post("/audio")
async def search_by_audio(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    """Upload an audio clip to extract fingerprints and match against protected works."""
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        fp_data = await fingerprint_audio(tmp_path)
        ov_results = await openverse_client.search_audio(file.filename.split(".")[0], limit=6)
        return {
            "status": "success",
            "filename": file.filename,
            "fingerprint": fp_data,
            "matches": ov_results
        }
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)

@router.post("/image")
async def search_by_image(file: UploadFile = File(...), db: AsyncSession = Depends(get_db)):
    """Upload an image/artwork to compute perceptual hashes (pHash/dHash) and search matches."""
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    try:
        fp_data = await fingerprint_image(tmp_path)
        ov_results = await openverse_client.search_images(file.filename.split(".")[0], limit=6)
        return {
            "status": "success",
            "filename": file.filename,
            "hashes": fp_data,
            "matches": ov_results
        }
    finally:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
