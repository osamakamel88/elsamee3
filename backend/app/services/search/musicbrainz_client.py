import httpx
from typing import List, Dict, Any
from app.config import settings

BASE_URL = "https://musicbrainz.org/ws/2/"
HEADERS = {"User-Agent": settings.MUSICBRAINZ_APP or "elsamee3/1.0 (contact@elsamee3.com)", "Accept": "application/json"}

async def search_artist(name: str) -> List[Dict[str, Any]]:
    """Search MusicBrainz for artists by name or aliases."""
    try:
        async with httpx.AsyncClient(verify=False, timeout=10.0) as client:
            response = await client.get(f"{BASE_URL}artist", params={"query": name, "fmt": "json"}, headers=HEADERS)
            if response.status_code == 200:
                artists = response.json().get("artists", [])
                results = []
                for a in artists[:10]:
                    results.append({
                        "id": a.get("id"),
                        "title": a.get("name"),
                        "type": "artist",
                        "author": a.get("disambiguation") or a.get("type", "Artist"),
                        "country": a.get("country", ""),
                        "url": f"https://musicbrainz.org/artist/{a.get('id')}",
                        "source": "MusicBrainz Artists",
                        "description": f"Artist profile: {a.get('name')} ({a.get('type', 'Person/Group')}, {a.get('country', 'Global')})",
                        "iswc": "",
                        "isrc": ""
                    })
                return results
    except Exception as e:
        print(f"Error querying MusicBrainz artists: {e}")
    return []

async def search_recording(title: str, artist: str = None) -> List[Dict[str, Any]]:
    """Search MusicBrainz for sound recordings."""
    query = title
    if artist:
        query = f'{title} AND artist:{artist}'
    try:
        async with httpx.AsyncClient(verify=False, timeout=10.0) as client:
            response = await client.get(f"{BASE_URL}recording", params={"query": query, "fmt": "json"}, headers=HEADERS)
            if response.status_code == 200:
                recordings = response.json().get("recordings", [])
                results = []
                for r in recordings[:10]:
                    artist_credit = ", ".join([ac.get("name", "") for ac in r.get("artist-credit", []) if isinstance(ac, dict)])
                    isrcs = [isrc.get("id") for isrc in r.get("isrcs", [])] if "isrcs" in r else []
                    results.append({
                        "id": r.get("id"),
                        "title": r.get("title"),
                        "type": "recording",
                        "author": artist_credit or "Unknown Artist",
                        "length_ms": r.get("length"),
                        "isrc": isrcs[0] if isrcs else "",
                        "url": f"https://musicbrainz.org/recording/{r.get('id')}",
                        "source": "MusicBrainz Recordings",
                        "description": f"Master sound recording by {artist_credit}" if artist_credit else "Sound recording"
                    })
                return results
    except Exception as e:
        print(f"Error querying MusicBrainz recordings: {e}")
    return []

async def search_work(title: str) -> List[Dict[str, Any]]:
    """Search MusicBrainz for underlying musical compositions / works."""
    try:
        async with httpx.AsyncClient(verify=False, timeout=10.0) as client:
            response = await client.get(f"{BASE_URL}work", params={"query": title, "fmt": "json"}, headers=HEADERS)
            if response.status_code == 200:
                works = response.json().get("works", [])
                results = []
                for w in works[:10]:
                    iswcs = w.get("iswcs", [])
                    results.append({
                        "id": w.get("id"),
                        "title": w.get("title"),
                        "type": "work",
                        "author": w.get("type", "Composition"),
                        "iswc": iswcs[0] if iswcs else "",
                        "url": f"https://musicbrainz.org/work/{w.get('id')}",
                        "source": "MusicBrainz Works",
                        "description": f"Musical work / composition (ISWC: {iswcs[0] if iswcs else 'Unassigned'})"
                    })
                return results
    except Exception as e:
        print(f"Error querying MusicBrainz works: {e}")
    return []

async def lookup_by_isrc(isrc: str) -> List[Dict[str, Any]]:
    """Lookup recordings directly by ISRC."""
    try:
        async with httpx.AsyncClient(verify=False, timeout=10.0) as client:
            response = await client.get(f"{BASE_URL}isrc/{isrc}", params={"inc": "recordings", "fmt": "json"}, headers=HEADERS)
            if response.status_code == 200:
                data = response.json()
                recordings = data.get("recordings", [])
                results = []
                for r in recordings:
                    results.append({
                        "id": r.get("id"),
                        "title": r.get("title"),
                        "type": "recording",
                        "isrc": isrc,
                        "url": f"https://musicbrainz.org/recording/{r.get('id')}",
                        "source": "MusicBrainz ISRC",
                        "description": f"Official registered sound recording matching ISRC {isrc}"
                    })
                return results
    except Exception as e:
        print(f"Error lookup by ISRC: {e}")
    return []

async def lookup_by_iswc(iswc: str) -> List[Dict[str, Any]]:
    """Lookup works directly by ISWC."""
    try:
        async with httpx.AsyncClient(verify=False, timeout=10.0) as client:
            response = await client.get(f"{BASE_URL}iswc/{iswc}", params={"fmt": "json"}, headers=HEADERS)
            if response.status_code == 200:
                data = response.json()
                works = data.get("works", [])
                results = []
                for w in works:
                    results.append({
                        "id": w.get("id"),
                        "title": w.get("title"),
                        "type": "work",
                        "iswc": iswc,
                        "url": f"https://musicbrainz.org/work/{w.get('id')}",
                        "source": "MusicBrainz ISWC",
                        "description": f"Official registered composition matching ISWC {iswc}"
                    })
                return results
    except Exception as e:
        print(f"Error lookup by ISWC: {e}")
    return []
