import httpx
from app.config import settings

BASE_URL = "https://musicbrainz.org/ws/2/"
HEADERS = {"User-Agent": settings.MUSICBRAINZ_APP, "Accept": "application/json"}

async def search_artist(name: str) -> list:
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}artist", params={"query": name}, headers=HEADERS)
        if response.status_code == 200:
            return response.json().get("artists", [])
        return []

async def search_recording(title: str, artist: str = None) -> list:
    query = f'"{title}"'
    if artist:
        query += f' AND artist:"{artist}"'
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}recording", params={"query": query}, headers=HEADERS)
        if response.status_code == 200:
            return response.json().get("recordings", [])
        return []

async def search_work(title: str) -> list:
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}work", params={"query": title}, headers=HEADERS)
        if response.status_code == 200:
            return response.json().get("works", [])
        return []

async def lookup_by_isrc(isrc: str) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}isrc/{isrc}", params={"inc": "recordings"}, headers=HEADERS)
        if response.status_code == 200:
            return response.json()
        return {}

async def lookup_by_iswc(iswc: str) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}iswc/{iswc}", headers=HEADERS)
        if response.status_code == 200:
            return response.json()
        return {}

async def get_artist_works(artist_mbid: str) -> list:
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}work", params={"artist": artist_mbid}, headers=HEADERS)
        if response.status_code == 200:
            return response.json().get("works", [])
        return []
