import httpx
from app.config import settings

BASE_URL = "https://api.acoustid.org/v2/lookup"

async def lookup_fingerprint(fingerprint: str, duration: int) -> list:
    if not settings.ACOUSTID_API_KEY:
        return []
    params = {
        "client": settings.ACOUSTID_API_KEY,
        "meta": "recordingids",
        "duration": duration,
        "fingerprint": fingerprint
    }
    async with httpx.AsyncClient() as client:
        response = await client.get(BASE_URL, params=params)
        if response.status_code == 200:
            return response.json().get("results", [])
        return []
