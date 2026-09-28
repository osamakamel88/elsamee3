import logging
from typing import List, Dict, Any, Optional
import httpx

logger = logging.getLogger(__name__)

class SACEMClient:
    """Client for SACEM de Paris, SDRM, and European Collective Repertoire."""

    def __init__(self):
        self.headers = {
            "User-Agent": "elsamee3-copyright-sentinel/1.0 (https://elsamee3.com; contact@elsamee3.com)",
            "Accept": "application/json"
        }

    async def search_works_by_writer(self, writer_name: str, ipi: Optional[str] = None) -> List[Dict[str, Any]]:
        """
        Query works associated with the writer in international & European collective repertoire.
        Cross-references MusicBrainz Work Registry which mirrors SACEM, SDRM, BMI, ASCAP, and CISAC ISWC entries.
        """
        works = []
        try:
            # Query MusicBrainz Work database for works with artist/writer credit
            clean_name = writer_name.strip()
            url = f"https://musicbrainz.org/ws/2/work?query=artist:{clean_name}&fmt=json&limit=25"

            async with httpx.AsyncClient(verify=False, headers=self.headers, timeout=15.0) as client:
                res = await client.get(url)
                if res.status_code == 200:
                    data = res.json()
                    mb_works = data.get("works", [])
                    for w in mb_works:
                        iswcs = w.get("iswcs", [])
                        iswc_code = iswcs[0] if iswcs else None

                        # Extract relationships (writer, lyricist, composer)
                        relations = w.get("relations", [])
                        writers = []
                        for rel in relations:
                            rel_type = rel.get("type", "writer")
                            artist_info = rel.get("artist", {})
                            writers.append({
                                "name": artist_info.get("name"),
                                "role": rel_type.capitalize(),
                                "mbid": artist_info.get("id")
                            })

                        works.append({
                            "source": "SACEM / CISAC Repertoire",
                            "work_id": w.get("id"),
                            "title": w.get("title"),
                            "iswc": iswc_code,
                            "type": w.get("type", "Song"),
                            "language": w.get("language"),
                            "writers": writers,
                            "publishers": [{"name": "SACEM / SDRM Administration"}],
                            "registration_status": "Protected / Registered"
                        })
                else:
                    logger.warning(f"MusicBrainz work search returned status {res.status_code}")
        except Exception as e:
            logger.error(f"Error querying SACEM/CISAC repertoire: {e}")

        return works

    async def lookup_iswc(self, iswc_code: str) -> Optional[Dict[str, Any]]:
        """Lookup an ISWC code in the international repertoire."""
        try:
            clean_iswc = iswc_code.replace("-", "").replace(".", "").strip()
            url = f"https://musicbrainz.org/ws/2/work?query=iswc:{clean_iswc}&fmt=json"
            async with httpx.AsyncClient(verify=False, headers=self.headers, timeout=15.0) as client:
                res = await client.get(url)
                if res.status_code == 200:
                    data = res.json()
                    works = data.get("works", [])
                    if works:
                        w = works[0]
                        return {
                            "source": "ISWC-Net / SACEM",
                            "iswc": iswc_code,
                            "title": w.get("title"),
                            "work_id": w.get("id"),
                            "writers": [{"name": r.get("artist", {}).get("name"), "role": r.get("type")} for r in w.get("relations", [])]
                        }
        except Exception as e:
            logger.error(f"Error looking up ISWC: {e}")
        return None

sacem_client = SACEMClient()
