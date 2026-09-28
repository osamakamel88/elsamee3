import httpx

BASE_URL = "https://api.openverse.org/v1/"

async def search_images(query: str, license_type: str = None) -> list:
    params = {"q": query}
    if license_type:
        params["license"] = license_type
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}images/", params=params)
        if response.status_code == 200:
            return response.json().get("results", [])
        return []

async def search_audio(query: str, license_type: str = None) -> list:
    params = {"q": query}
    if license_type:
        params["license"] = license_type
    async with httpx.AsyncClient() as client:
        response = await client.get(f"{BASE_URL}audio/", params=params)
        if response.status_code == 200:
            return response.json().get("results", [])
        return []
