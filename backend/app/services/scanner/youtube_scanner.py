import httpx
from app.config import settings

async def search_videos(query: str, max_results: int = 10) -> list:
    if not settings.YOUTUBE_API_KEY:
        return []
        
    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": query,
        "maxResults": max_results,
        "type": "video",
        "key": settings.YOUTUBE_API_KEY
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(url, params=params)
        if response.status_code == 200:
            return response.json().get("items", [])
        return []
