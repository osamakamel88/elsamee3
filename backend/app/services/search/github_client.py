import httpx
from typing import List, Dict, Any

BASE_URL = "https://api.github.com"
HEADERS = {
    "User-Agent": "elsamee3/1.0 (contact@elsamee3.com)",
    "Accept": "application/vnd.github.v3+json"
}

async def search_repositories(query: str, limit: int = 10) -> List[Dict[str, Any]]:
    """Search GitHub public repositories for mentions of an artist, work title, or leaked audio/visual packages."""
    try:
        async with httpx.AsyncClient(verify=False, timeout=10.0) as client:
            response = await client.get(
                f"{BASE_URL}/search/repositories",
                params={"q": query, "per_page": limit, "sort": "stars"},
                headers=HEADERS
            )
            if response.status_code == 200:
                data = response.json()
                items = data.get("items", [])
                results = []
                for item in items:
                    results.append({
                        "id": str(item.get("id")),
                        "title": item.get("full_name", ""),
                        "type": "code_repository",
                        "author": item.get("owner", {}).get("login", ""),
                        "stars": item.get("stargazers_count", 0),
                        "forks": item.get("forks_count", 0),
                        "url": item.get("html_url", ""),
                        "source": "GitHub Repositories",
                        "description": item.get("description") or "GitHub public repository",
                        "topics": item.get("topics", [])
                    })
                return results
    except Exception as e:
        print(f"Error querying GitHub repositories: {e}")
    return []
