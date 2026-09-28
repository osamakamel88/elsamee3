from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User
from app.api.deps import get_current_user
from app.schemas.search import SearchQuery, UnifiedSearchResponse
from app.services.search.unified_search import detect_query_type
from app.services.search.musicbrainz_client import search_artist, search_recording, lookup_by_isrc

router = APIRouter()

@router.post("", response_model=UnifiedSearchResponse)
async def search(query_in: SearchQuery, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    query = query_in.query
    detected_type = detect_query_type(query)
    
    results = []
    if detected_type == "isrc":
        mb_result = await lookup_by_isrc(query)
        if mb_result:
            results.append({"title": mb_result.get("title", "Unknown"), "source": "MusicBrainz", "external_id": query})
    else:
        mb_results = await search_recording(query)
        for r in mb_results[:5]:
            results.append({
                "title": r.get("title", ""),
                "source": "MusicBrainz",
                "external_id": r.get("id", "")
            })
            
    return {
        "query": query,
        "detected_type": detected_type,
        "results": results
    }
