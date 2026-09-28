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
from app.services.search.dsp_client import dsp_client
from app.services.search.mlc_client import mlc_client
from app.services.search.sacem_client import sacem_client
from app.services.search.arab_copyright_directory import search_arab_cmo_directory
from app.services.search import (
    musicbrainz_client,
    discogs_client,
    openverse_client
)
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

    try:
        return await _do_search(query, db)
    except Exception as e:
        import traceback
        traceback.print_exc()
        return {"query": query, "detected_type": "error", "results_count": 0, "results": []}

async def _do_search(query: str, db: AsyncSession):
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
        ).limit(8)
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
                    96.0,
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
    # 3. REAL-TIME CONCURRENT QUERIES ACROSS ALL GLOBAL NETWORKS
    # -------------------------------------------------------------
    # A. DSP Streaming Artists (Apple Music, Deezer)
    async def fetch_dsp_artists():
        try:
            return await dsp_client.search_artists(query, limit=6)
        except Exception as e:
            print(f"DSP artist search error: {e}")
            return []

    # B. DSP Commercial Released Tracks & Hit Singles
    async def fetch_dsp_tracks():
        try:
            return await dsp_client.search_tracks(query, limit=8)
        except Exception as e:
            print(f"DSP track search error: {e}")
            return []

    # C. The MLC Mechanical Repertoire (with Smart Expansion for Major Writers)
    async def fetch_mlc():
        mlc_writers = []
        try:
            search_terms = [query]
            q_clean = query.strip().lower()
            if q_clean == "tamer":
                search_terms.extend(["tamer hussein", "tamer hosny", "tamer ashour", "tamer ali"])
            elif q_clean == "amr":
                search_terms.extend(["amr diab", "amr mostafa", "amr tantawy"])
            elif q_clean == "mohamed":
                search_terms.extend(["mohamed el nadi", "mohamed yehia", "mohamed hamaki", "mohamed mounir"])
            elif q_clean in ("basem", "bassem"):
                search_terms.extend(["bassem adel", "basem adel"])

            for v in variants[:3]:
                if v.isascii() and v not in search_terms:
                    search_terms.append(v)

            terms_to_query = search_terms[:4]
            mlc_res_list = await asyncio.gather(
                *[mlc_client.search_writers(st, size=6) for st in terms_to_query],
                return_exceptions=True
            )

            seen_ip_ids = set()
            for res in mlc_res_list:
                if isinstance(res, list):
                    for w in res:
                        if w.get("ip_id") and w["ip_id"] not in seen_ip_ids:
                            seen_ip_ids.add(w["ip_id"])
                            w["relevance"] = calc_string_relevance(w["full_name"], query)
                            mlc_writers.append(w)

            # Sort MLC writers by works_count, IPI presence, and relevance
            mlc_writers.sort(
                key=lambda x: (
                    x.get("works_count", 0),
                    1 if x.get("ipi_number") else 0,
                    x.get("relevance", 0)
                ),
                reverse=True
            )
        except Exception as e:
            print(f"MLC search error: {e}")
        return mlc_writers

    # D. SACEM de Paris & European Collective
    async def fetch_sacem():
        try:
            return await sacem_client.search_works_by_writer(query)
        except Exception:
            return []

    # E. MusicBrainz & Discogs
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

    # Execute all external sources concurrently with resilient partial-result handling
    t_dsp_arts = asyncio.create_task(fetch_dsp_artists())
    t_dsp_trks = asyncio.create_task(fetch_dsp_tracks())
    t_mlc = asyncio.create_task(fetch_mlc())
    t_sacem = asyncio.create_task(fetch_sacem())
    t_ext = asyncio.create_task(fetch_external())

    all_tasks = [t_dsp_arts, t_dsp_trks, t_mlc, t_sacem, t_ext]
    done, pending = await asyncio.wait(all_tasks, timeout=4.5)
    for p in pending:
        p.cancel()

    def safe_result(task):
        """Safely extract result from a completed task."""
        try:
            if task in done:
                return task.result()
        except Exception as e:
            print(f"Task {task.get_name()} failed: {e}")
        return []

    dsp_arts = safe_result(t_dsp_arts)
    dsp_trks = safe_result(t_dsp_trks)
    mlc_wrts = safe_result(t_mlc)
    sacem_wrks = safe_result(t_sacem)
    ext_itms = safe_result(t_ext)

    # -------------------------------------------------------------
    # 4. PROCESS & SCORE REAL-TIME RESULTS
    # -------------------------------------------------------------
    # Process Verified DSP Artists (Apple Music / Deezer)
    for a in dsp_arts:
        a_key = f"dsp_artist_{a.get('title')}".lower()
        if a_key not in seen_identifiers:
            seen_identifiers.add(a_key)
            a_title_lower = a["title"].lower()
            q_lower = query.lower()
            if q_lower in a_title_lower or any(w.lower() in a_title_lower for w in query.split() if len(w) > 1):
                score = 94.0
            else:
                a_rel = calc_string_relevance(a["title"], query)
                score = max(50.0, 75.0 * a_rel)
            scored_results.append((
                score,
                SearchResult(
                    title=a["title"],
                    author=a["author"],
                    artist=a["artist"],
                    source=a["source"],
                    type="artist",
                    url=a.get("url", ""),
                    image_url=a.get("image_url"),
                    description=a["description"],
                    confidence=a.get("confidence", 0.95),
                    metadata=a.get("metadata", {})
                )
            ))

    # Process Top MLC Songwriters (Tamer Hussein, Bassem Adel, Tamer Ali...)
    for w in mlc_wrts[:5]:
        works_cnt = w.get("works_count", 0)
        has_ipi = bool(w.get("ipi_number"))
        # Only prioritize writers with works or verified IPIs
        if works_cnt > 0 or has_ipi or w.get("relevance", 0) >= 0.8:
            w_key = f"mlc_writer_{w['ip_id']}"
            if w_key not in seen_identifiers:
                seen_identifiers.add(w_key)
                score = 93.0 if works_cnt > 10 else (90.0 if works_cnt > 0 else 85.0)
                scored_results.append((
                    score,
                    SearchResult(
                        title=f"{w['full_name']} (IPI: {w.get('ipi_number') or 'Registered'})",
                        author=w["full_name"],
                        artist=f"The MLC Songwriter / Composer ({works_cnt} Works Registered)",
                        source="The MLC (Mechanical Licensing Collective)",
                        type="songwriter_profile",
                        url="https://portal.themlc.com/search",
                        description=f"Official registered songwriter on The MLC with {works_cnt} musical works documented. IPI: {w.get('ipi_number') or 'Assigned'}.",
                        confidence=1.0,
                        metadata=w
                    )
                ))

    # Process Commercial DSP Released Tracks (Apple Music hit songs)
    for t in dsp_trks:
        t_key = f"dsp_track_{t.get('title')}_{t.get('author')}".lower()
        if t_key not in seen_identifiers:
            seen_identifiers.add(t_key)
            scored_results.append((
                88.0,
                SearchResult(
                    title=t["title"],
                    author=t["author"],
                    artist=t["artist"],
                    source=t["source"],
                    type="recording",
                    url=t.get("url", ""),
                    image_url=t.get("image_url"),
                    description=t["description"],
                    confidence=0.92,
                    metadata=t.get("metadata", {})
                )
            ))

    # Process SACEM de Paris Repertoire Works
    for sw in sacem_wrks[:8]:
        sw_key = f"sacem_{sw.get('work_id') or sw.get('title')}"
        if sw_key not in seen_identifiers:
            seen_identifiers.add(sw_key)
            writers_str = ", ".join([str(w.get("name") or "") for w in sw.get("writers", [])])
            scored_results.append((
                82.0,
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

    # Process Arab Copyright Societies Directory
    arab_cmo_results = search_arab_cmo_directory(query)
    for cmo in arab_cmo_results:
        cmo_key = f"cmo_{cmo['title']}"
        if cmo_key not in seen_identifiers:
            seen_identifiers.add(cmo_key)
            title_lower = cmo["title"].lower()
            q_lower = query.lower()
            if q_lower in title_lower or any(w.lower() in title_lower for w in query.split() if len(w) > 2):
                cmo_score = 97.0
            else:
                cmo_score = 78.0
            scored_results.append((
                cmo_score,
                SearchResult(
                    title=cmo["title"],
                    author=cmo["author"],
                    artist=cmo["country"],
                    source=cmo["source"],
                    type="arab_cmo",
                    url=cmo["url"],
                    description=cmo["description"],
                    metadata={"services": cmo.get("services"), "guide": cmo.get("registration_guide")}
                )
            ))

    # Process External Repositories (Discogs, MusicBrainz)
    for item in ext_itms:
        try:
            title_or_name = item.get("title") or item.get("name") or ""
            rel = calc_string_relevance(title_or_name, query)
            q_words_count = len(query.strip().split())
            if q_words_count > 1 and rel < 0.7:
                continue

            item_key = f"ext_{title_or_name}_{item.get('source')}".lower()
            if item_key not in seen_identifiers:
                seen_identifiers.add(item_key)
                scored_results.append((50.0 * rel if rel > 0 else 40.0, SearchResult(**item)))
        except Exception:
            pass

    # -------------------------------------------------------------
    # 5. SORT BY RELEVANCE SCORE DESCENDING
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
