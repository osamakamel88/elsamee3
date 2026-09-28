import httpx
from typing import List, Dict, Any

BASE_URL = "https://api.openverse.org/v1"
HEADERS = {"User-Agent": "elsamee3/1.0 (contact@elsamee3.com)"}

async def search_images(query: str, limit: int = 10) -> List[Dict[str, Any]]:
    """Search Openverse for Creative Commons and public domain images/artworks."""
    try:
        async with httpx.AsyncClient(verify=False, timeout=10.0) as client:
            response = await client.get(
                f"{BASE_URL}/images/",
                params={"q": query, "page_size": limit},
                headers=HEADERS
            )
            if response.status_code == 200:
                results = []
                for item in response.json().get("results", []):
                    results.append({
                        "id": item.get("id"),
                        "title": item.get("title") or "Untitled Artwork",
                        "type": "visual_artwork",
                        "author": item.get("creator") or "Unknown Artist",
                        "url": item.get("foreign_landing_url") or item.get("url"),
                        "thumbnail": item.get("thumbnail"),
                        "license": item.get("license"),
                        "source": f"Openverse ({item.get('source', 'CC')})",
                        "description": f"Visual art/image by {item.get('creator', 'Unknown')} (License: {item.get('license', 'CC')})"
                    })
                return results
    except Exception as e:
        print(f"Error querying Openverse images: {e}")
    return []

async def search_audio(query: str, limit: int = 10) -> List[Dict[str, Any]]:
    """Search Openverse for Creative Commons and public domain audio tracks."""
    try:
        async with httpx.AsyncClient(verify=False, timeout=10.0) as client:
            response = await client.get(
                f"{BASE_URL}/audio/",
                params={"q": query, "page_size": limit},
                headers=HEADERS
            )
            if response.status_code == 200:
                results = []
                for item in response.json().get("results", []):
                    results.append({
                        "id": item.get("id"),
                        "title": item.get("title") or "Untitled Audio",
                        "type": "audio",
                        "author": item.get("creator") or "Unknown Creator",
                        "url": item.get("foreign_landing_url") or item.get("url"),
                        "thumbnail": item.get("thumbnail"),
                        "license": item.get("license"),
                        "source": f"Openverse Audio ({item.get('source', 'CC')})",
                        "description": f"Audio track by {item.get('creator', 'Unknown')} (License: {item.get('license', 'CC')})"
                    })
                return results
    except Exception as e:
        print(f"Error querying Openverse audio: {e}")
    return []
