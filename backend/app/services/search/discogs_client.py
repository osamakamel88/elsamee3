import httpx
from typing import List, Dict, Any

BASE_URL = "https://api.discogs.com"
HEADERS = {"User-Agent": "elsamee3/1.0 (contact@elsamee3.com)"}

async def search_artist(name: str, limit: int = 10) -> List[Dict[str, Any]]:
    """Search Discogs for artists and discographies."""
    try:
        async with httpx.AsyncClient(verify=False, timeout=8.0) as client:
            response = await client.get(
                f"{BASE_URL}/database/search",
                params={"q": name, "type": "artist", "per_page": limit},
                headers=HEADERS
            )
            if response.status_code == 200:
                results = []
                for item in response.json().get("results", []):
                    results.append({
                        "id": str(item.get("id")),
                        "title": item.get("title", ""),
                        "type": "artist",
                        "author": "Discogs Artist Entry",
                        "url": f"https://www.discogs.com{item.get('uri', '')}",
                        "thumbnail": item.get("thumb") or item.get("cover_image"),
                        "source": "Discogs Repertoire",
                        "description": f"Documented musical artist profile on Discogs catalog"
                    })
                return results
    except Exception as e:
        print(f"Error querying Discogs artist: {e}")
    return []

async def search_release(title: str, artist: str = None, limit: int = 10) -> List[Dict[str, Any]]:
    """Search Discogs for physical and digital releases, labels, and albums."""
    params = {"q": title, "type": "release", "per_page": limit}
    if artist:
        params["artist"] = artist
    try:
        async with httpx.AsyncClient(verify=False, timeout=8.0) as client:
            response = await client.get(f"{BASE_URL}/database/search", params=params, headers=HEADERS)
            if response.status_code == 200:
                results = []
                for item in response.json().get("results", []):
                    results.append({
                        "id": str(item.get("id")),
                        "title": item.get("title", ""),
                        "type": "release",
                        "author": ", ".join(item.get("label", [])) if item.get("label") else "Independent Label",
                        "url": f"https://www.discogs.com{item.get('uri', '')}",
                        "thumbnail": item.get("thumb") or item.get("cover_image"),
                        "source": "Discogs Releases",
                        "description": f"Documented release (Year: {item.get('year', 'N/A')}, Format: {', '.join(item.get('format', []))})"
                    })
                return results
    except Exception as e:
        print(f"Error querying Discogs release: {e}")
    return []
