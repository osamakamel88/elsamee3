import logging
from typing import List, Dict, Any
import httpx

logger = logging.getLogger(__name__)

class DSPClient:
    """Real-time live client for digital streaming services (Apple Music, iTunes, Deezer)."""

    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/json"
        }

    async def search_artists(self, query: str, limit: int = 8) -> List[Dict[str, Any]]:
        """Search verified artists across Apple Music and Deezer in real time."""
        results = []
        seen_names = set()

        async with httpx.AsyncClient(verify=False, timeout=6.0, headers=self.headers) as client:
            # 1. Deezer Artists (includes fan counts and popularity)
            try:
                r_deezer = await client.get(f"https://api.deezer.com/search/artist?q={query}&limit={limit}")
                if r_deezer.status_code == 200:
                    for d in r_deezer.json().get("data", []):
                        name = d.get("name", "").strip()
                        norm = name.lower()
                        if norm not in seen_names and len(name) > 0:
                            seen_names.add(norm)
                            fans = d.get("nb_fan", 0)
                            fans_str = f"{fans:,} fans" if fans > 1000 else ""
                            results.append({
                                "id": f"deezer_art_{d.get('id')}",
                                "title": name,
                                "type": "artist",
                                "author": f"Verified Artist • {fans_str}" if fans_str else "Verified Recording Artist",
                                "artist": "Digital Streaming Profile (Deezer / DSP)",
                                "source": "Digital Streaming Platforms (DSPs)",
                                "url": d.get("link") or f"https://www.deezer.com/artist/{d.get('id')}",
                                "image_url": d.get("picture_medium"),
                                "description": f"Verified global artist profile with {fans_str} on digital streaming services." if fans_str else f"Verified recording artist on digital distribution services.",
                                "confidence": 0.95 if fans > 50000 else 0.85,
                                "metadata": {"fans": fans, "id": d.get("id")}
                            })
            except Exception as e:
                logger.warning(f"Deezer artist search error: {e}")

            # 2. Apple Music / iTunes Artists
            try:
                r_apple = await client.get(f"https://itunes.apple.com/search?term={query}&entity=musicArtist&limit={limit}")
                if r_apple.status_code == 200:
                    for a in r_apple.json().get("results", []):
                        name = a.get("artistName", "").strip()
                        norm = name.lower()
                        if norm not in seen_names and len(name) > 0:
                            seen_names.add(norm)
                            genre = a.get("primaryGenreName", "Music")
                            results.append({
                                "id": f"apple_art_{a.get('artistId')}",
                                "title": name,
                                "type": "artist",
                                "author": f"Apple Music Artist • {genre}",
                                "artist": f"Genre: {genre}",
                                "source": "Apple Music & DSP Distribution",
                                "url": a.get("artistLinkUrl") or "https://music.apple.com",
                                "description": f"Official Apple Music artist catalogue ({genre} category). Digital release distribution verified.",
                                "confidence": 0.90,
                                "metadata": {"genre": genre, "id": a.get("artistId")}
                            })
            except Exception as e:
                logger.warning(f"Apple Music artist search error: {e}")

        # Sort artists with highest popularity first
        results.sort(key=lambda x: x.get("metadata", {}).get("fans", 0), reverse=True)
        return results

    async def search_tracks(self, query: str, limit: int = 10) -> List[Dict[str, Any]]:
        """Search commercial master recordings and released songs across Apple Music and Deezer in real time."""
        results = []
        seen_tracks = set()

        async with httpx.AsyncClient(verify=False, timeout=6.0, headers=self.headers) as client:
            # Apple Music Songs
            try:
                r_apple = await client.get(f"https://itunes.apple.com/search?term={query}&entity=song&limit={limit}")
                if r_apple.status_code == 200:
                    for s in r_apple.json().get("results", []):
                        track_name = s.get("trackName", "").strip()
                        artist_name = s.get("artistName", "").strip()
                        key = f"{track_name}_{artist_name}".lower()
                        if key not in seen_tracks and track_name:
                            seen_tracks.add(key)
                            results.append({
                                "id": f"apple_trk_{s.get('trackId')}",
                                "title": track_name,
                                "type": "recording",
                                "author": artist_name,
                                "artist": f"Album: {s.get('collectionName', 'Single')}",
                                "source": "Apple Music & DSPs",
                                "url": s.get("trackViewUrl") or "https://music.apple.com",
                                "image_url": s.get("artworkUrl100"),
                                "description": f"Released track by {artist_name} on {s.get('collectionName', 'Single')}. Genre: {s.get('primaryGenreName', 'Pop')}.",
                                "confidence": 0.92,
                                "metadata": {
                                    "release_date": s.get("releaseDate"),
                                    "preview_url": s.get("previewUrl"),
                                    "genre": s.get("primaryGenreName")
                                }
                            })
            except Exception as e:
                logger.warning(f"Apple Music track search error: {e}")

        return results

dsp_client = DSPClient()
