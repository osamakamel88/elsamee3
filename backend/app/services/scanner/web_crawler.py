import httpx
from bs4 import BeautifulSoup
from urllib.parse import urljoin

async def scan_url(url: str) -> dict:
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(url, timeout=10.0)
            if response.status_code == 200:
                html = response.text
                media = extract_media_from_page(html, url)
                return {
                    "url": url,
                    "media": media,
                    "text_length": len(html)
                }
        except:
            pass
    return {"url": url, "media": [], "text_length": 0}

def extract_media_from_page(html: str, base_url: str) -> list:
    soup = BeautifulSoup(html, "html.parser")
    media = []
    for img in soup.find_all("img"):
        src = img.get("src")
        if src:
            media.append(urljoin(base_url, src))
    for audio in soup.find_all("audio"):
        src = audio.get("src")
        if src:
            media.append(urljoin(base_url, src))
    return media
