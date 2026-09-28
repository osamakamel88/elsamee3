import httpx
from app.config import settings

BASE_URL = "https://api.discogs.com/"
HEADERS = {"User-Agent": "elsamee3/0.1.0"}

async def search_artist(name: str) -> list:
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}database/search", params={"q": name, "type": "artist"}, headers=HEADERS)
        if response.status_code == 200:
            return response.json().get("results", [])
        return []

async def search_release(title: str, artist: str = None) -> list:
    params = {"q": title, "type": "release"}
    if artist:
        params["artist"] = artist
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}database/search", params=params, headers=HEADERS)
        if response.status_code == 200:
            return response.json().get("results", [])
        return []

async def get_artist_releases(artist_id: str) -> list:
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}artists/{artist_id}/releases", headers=HEADERS)
        if response.status_code == 200:
            return response.json().get("releases", [])
        return []
