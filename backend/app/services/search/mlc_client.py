import logging
from typing import List, Dict, Any, Optional
import httpx

logger = logging.getLogger(__name__)

MLC_API_BASE = "https://api.ptl.themlc.com/api2v/public"

ROLE_CODE_MAP = {
    1: "Composer",
    2: "Author / Lyricist",
    3: "Composer / Author",
    4: "Arranger",
    11: "Author / Lyricist",
    12: "Composer",
    13: "Composer / Author",
}

class MLCClient:
    """Client for The Mechanical Licensing Collective (The MLC) Public Search API."""

    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json",
            "Origin": "https://portal.themlc.com",
            "Referer": "https://portal.themlc.com/search"
        }

    async def search_writers(self, query: str, page: int = 0, size: int = 10) -> List[Dict[str, Any]]:
        """Search writers by name or IPI number in The MLC database."""
        clean_q = query.strip()
        is_ipi = clean_q.isdigit()

        payload = {"ipiNameNumber": clean_q} if is_ipi else {"fullName": clean_q}

        url = f"{MLC_API_BASE}/search/writers?page={page}&size={size}"
        try:
            async with httpx.AsyncClient(verify=False, timeout=15.0) as client:
                res = await client.post(url, json=payload, headers=self.headers)
                if res.status_code == 200:
                    data = res.json()
                    writers = data.get("content", [])
                    formatted = []
                    for w in writers:
                        formatted.append({
                            "ip_id": w.get("ipId"),
                            "first_name": w.get("firstName", ""),
                            "last_name": w.get("lastName", ""),
                            "full_name": f"{w.get('firstName', '')} {w.get('lastName', '')}".strip(),
                            "ipi_number": w.get("ipiNumber"),
                            "works_count": w.get("worksCount", 0),
                            "last_updated": w.get("lastUpdated")
                        })
                    return formatted
                else:
                    logger.warning(f"MLC search writers returned status {res.status_code}: {res.text[:200]}")
                    return []
        except Exception as e:
            logger.error(f"Error querying MLC search_writers: {e}")
            return []

    async def get_writer_works(self, writer_ip_id: int, page: int = 0, size: int = 100) -> List[Dict[str, Any]]:
        """Fetch all registered musical works for a specific writer ipId from The MLC."""
        url = f"{MLC_API_BASE}/search/works?page={page}&size={size}"
        payload = {"writerIpIds": [writer_ip_id]}

        try:
            async with httpx.AsyncClient(verify=False, timeout=20.0) as client:
                res = await client.post(url, json=payload, headers=self.headers)
                if res.status_code == 200:
                    data = res.json()
                    works_raw = data.get("content", [])
                    works = []
                    for w in works_raw:
                        # Extract writers
                        writers_list = []
                        for wr in w.get("writers", []):
                            r_code = wr.get("roleCode")
                            role_str = ROLE_CODE_MAP.get(r_code, f"Role {r_code}" if r_code else "Writer")
                            writers_list.append({
                                "ip_id": wr.get("ipId"),
                                "full_name": wr.get("fullName"),
                                "ipi_number": wr.get("ipiNumber"),
                                "role_code": r_code,
                                "role_name": role_str,
                                "writer_share": wr.get("writerShare")
                            })

                        # Extract publishers
                        publishers_list = []
                        for pub in w.get("originalPublishers", []):
                            publishers_list.append({
                                "ip_id": pub.get("ipId"),
                                "publisher_name": pub.get("publisherName"),
                                "ipi_number": pub.get("ipiNumber"),
                                "publisher_share": pub.get("publisherShare"),
                                "publisher_number": pub.get("hfaPublisherNumber")
                            })

                        # Build standard work representation
                        works.append({
                            "source": "The MLC (USA)",
                            "mlc_id": w.get("id"),
                            "title": w.get("title"),
                            "song_code": w.get("songCode"),
                            "iswc": w.get("iswc"),
                            "duration": w.get("duration"),
                            "writers": writers_list,
                            "publishers": publishers_list,
                            "total_known_shares": w.get("totalKnownShares", 0),
                            "is_complete": w.get("isComplete", True),
                            "matched_recordings_count": w.get("matchedRecordings", {}).get("count", 0)
                        })
                    return works
                else:
                    logger.warning(f"MLC get_writer_works returned status {res.status_code}: {res.text[:200]}")
                    return []
        except Exception as e:
            logger.error(f"Error querying MLC get_writer_works: {e}")
            return []

    async def search_by_title_and_writer(self, title: str, writer_name: Optional[str] = None) -> List[Dict[str, Any]]:
        """Search works by resolving writer first or searching writer repertoire."""
        results = []
        if writer_name:
            writers = await self.search_writers(writer_name)
            for w in writers[:3]:
                if w.get("ip_id"):
                    works = await self.get_writer_works(w["ip_id"])
                    # Filter by title if needed
                    clean_title = title.strip().upper()
                    matched = [x for x in works if clean_title in x.get("title", "").upper()]
                    results.extend(matched if matched else works)
        return results

mlc_client = MLCClient()
