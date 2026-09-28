import asyncio
from fastapi import APIRouter, Depends, UploadFile, File, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_
from app.database import get_db
from app.models.work import Work
from app.schemas.search import SearchQuery, UnifiedSearchResponse, SearchResult
from app.services.search.unified_search import detect_query_type
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

@router.post("", response_model=UnifiedSearchResponse)
async def search(query_in: SearchQuery, db: AsyncSession = Depends(get_db)):
    query = query_in.query.strip()
    if not query:
        return {"query": "", "detected_type": "empty", "results_count": 0, "results": []}

    detected_type = detect_query_type(query)
    results = []

    # 1. Search Arab Copyright Societies, Author & Composer Registries
    arab_cmo_results = search_arab_cmo_directory(query)
    for cmo in arab_cmo_results:
        results.append(SearchResult(
            title=cmo["title"],
            author=cmo["author"],
            artist=cmo["country"],
            source=cmo["source"],
            type="arab_cmo",
            url=cmo["url"],
            description=cmo["description"],
            metadata={"services": cmo.get("services"), "guide": cmo.get("registration_guide")}
        ))

    # 2. Search local registered works in elsamee3 vault (supports composer, lyricist, performer)
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
                Work.lyrics_text.ilike(f"%{query}%"),
                Work.description.ilike(f"%{query}%")
            )
        ).limit(10)
        db_res = await db.execute(stmt)
        for w in db_res.scalars().all():
            creator_parts = []
            if w.composer: creator_parts.append(f"الملحن: {w.composer}")
            if w.lyricist: creator_parts.append(f"الشاعر: {w.lyricist}")
            if w.performer: creator_parts.append(f"المطرب: {w.performer}")
            creator_summary = " • ".join(creator_parts) if creator_parts else "Registered Creator"

            results.append(SearchResult(
                title=w.title,
                artist=creator_summary,
                author=w.composer or w.lyricist or "Registered Author",
                source="elsamee3 Vault",
                type=w.work_type,
                isrc=w.isrc,
                iswc=w.iswc,
                description=w.description or f"Protected in elsamee3 registry (ISWC: {w.iswc or 'N/A'})",
                confidence=1.0
            ))
    except Exception as e:
        print(f"Local DB search error: {e}")

    # 3. Targeted identifier lookup if ISRC or ISWC detected
    if detected_type == "isrc":
        mb_isrc = await musicbrainz_client.lookup_by_isrc(query)
        for r in mb_isrc:
            results.append(SearchResult(**r))
    elif detected_type == "iswc":
        mb_iswc = await musicbrainz_client.lookup_by_iswc(query)
        for r in mb_iswc:
            results.append(SearchResult(**r))
    else:
        # 4. Query global creative databases for Composers, Lyricists, Works & Recordings
        tasks = [
            musicbrainz_client.search_artist(query),
            musicbrainz_client.search_recording(query),
            musicbrainz_client.search_work(query),
            discogs_client.search_artist(query, limit=6),
            discogs_client.search_release(query, limit=6),
            openverse_client.search_images(query, limit=6),
            openverse_client.search_audio(query, limit=4),
            mlc_client.search_writers(query, size=5),
            sacem_client.search_works_by_writer(query)
        ]
        
        gathered = await asyncio.gather(*tasks, return_exceptions=True)
        for g_res in gathered:
            if isinstance(g_res, list):
                for item in g_res:
                    try:
                        # Handle MLC writer item
                        if "ip_id" in item and "works_count" in item:
                            results.append(SearchResult(
                                title=f"{item.get('full_name')} (IPI: {item.get('ipi_number') or 'N/A'})",
                                author=item.get('full_name'),
                                artist="Songwriter / Lyricist / Composer",
                                source="The MLC (Mechanical Licensing Collective)",
                                type="songwriter_profile",
                                url="https://portal.themlc.com/search",
                                description=f"Registered Songwriter with {item.get('works_count')} works on The MLC (IPI: {item.get('ipi_number') or 'N/A'})",
                                confidence=1.0
                            ))
                        # Handle SACEM work item
                        elif item.get("source") == "SACEM / CISAC Repertoire":
                            writers_str = ", ".join([w.get("name") for w in item.get("writers", [])])
                            results.append(SearchResult(
                                title=item.get("title"),
                                author=writers_str or "SACEM Registered Author",
                                artist="SACEM / SDRM Repertoire",
                                source="SACEM de Paris",
                                type="composition",
                                iswc=item.get("iswc"),
                                url=f"https://repertoire.sacem.fr",
                                description=f"Registered in SACEM/SDRM collective repertoire (ISWC: {item.get('iswc') or 'N/A'})",
                                confidence=1.0
                            ))
                        else:
                            results.append(SearchResult(**item))
                    except Exception as e:
                        print(f"Result mapping error: {e}")

    return {
        "query": query,
        "detected_type": detected_type,
        "results_count": len(results),
        "results": results
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
