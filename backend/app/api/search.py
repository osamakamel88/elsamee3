import asyncio
from fastapi import APIRouter, Depends, UploadFile, File
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
from app.services.fingerprint.image_fingerprint import fingerprint_image
from app.services.fingerprint.audio_fingerprint import fingerprint_audio
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

    # 1. Search local registered works in elsamee3 vault
    try:
        stmt = select(Work).where(
            or_(
                Work.title.ilike(f"%{query}%"),
                Work.title_ar.ilike(f"%{query}%"),
                Work.isrc.ilike(f"%{query}%"),
                Work.iswc.ilike(f"%{query}%"),
                Work.description.ilike(f"%{query}%")
            )
        ).limit(10)
        db_res = await db.execute(stmt)
        for w in db_res.scalars().all():
            results.append(SearchResult(
                title=w.title,
                artist="Protected Artist",
                author="Registered Creator",
                source="elsamee3 Vault",
                type=w.work_type,
                isrc=w.isrc,
                iswc=w.iswc,
                description=w.description or f"Protected {w.work_type} in elsamee3 registry",
                confidence=1.0
            ))
    except Exception as e:
        print(f"Local DB search error: {e}")

    # 2. Targeted identifier lookup if ISRC or ISWC detected
    if detected_type == "isrc":
        mb_isrc = await musicbrainz_client.lookup_by_isrc(query)
        for r in mb_isrc:
            results.append(SearchResult(**r))
    elif detected_type == "iswc":
        mb_iswc = await musicbrainz_client.lookup_by_iswc(query)
        for r in mb_iswc:
            results.append(SearchResult(**r))
    else:
        # 3. Query creative music & visual arts databases in parallel
        # Note: HuggingFace & Git models remain exclusively in the backend engine
        tasks = [
            musicbrainz_client.search_artist(query),
            musicbrainz_client.search_recording(query),
            musicbrainz_client.search_work(query),
            discogs_client.search_artist(query, limit=6),
            discogs_client.search_release(query, limit=6),
            openverse_client.search_images(query, limit=8),
            openverse_client.search_audio(query, limit=6)
        ]
        
        gathered = await asyncio.gather(*tasks, return_exceptions=True)
        for g_res in gathered:
            if isinstance(g_res, list):
                for item in g_res:
                    try:
                        results.append(SearchResult(**item))
                    except Exception as e:
                        print(f"Result mapping error: {e}")

    return {
        "query": query,
        "detected_type": detected_type,
        "results_count": len(results),
        "results": results
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
