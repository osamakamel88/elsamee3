import httpx
from typing import List, Dict, Any

BASE_URL = "https://huggingface.co/api"
HEADERS = {"User-Agent": "elsamee3/1.0 (contact@elsamee3.com)"}

async def search_models(query: str, limit: int = 10) -> List[Dict[str, Any]]:
    """Search Hugging Face Hub for models related to the query (e.g. voice models, LoRAs, style models)."""
    try:
        async with httpx.AsyncClient(verify=False, timeout=10.0) as client:
            response = await client.get(
                f"{BASE_URL}/models",
                params={"search": query, "limit": limit, "full": "false"},
                headers=HEADERS
            )
            if response.status_code == 200:
                data = response.json()
                results = []
                for item in data:
                    model_id = item.get("id", "")
                    results.append({
                        "id": model_id,
                        "title": model_id,
                        "type": "ai_model",
                        "pipeline_tag": item.get("pipeline_tag", "AI Model"),
                        "author": model_id.split("/")[0] if "/" in model_id else "Community",
                        "downloads": item.get("downloads", 0),
                        "likes": item.get("likes", 0),
                        "url": f"https://huggingface.co/{model_id}",
                        "source": "Hugging Face Models",
                        "description": f"AI model indexed on Hugging Face (Pipeline: {item.get('pipeline_tag', 'custom')})"
                    })
                return results
    except Exception as e:
        print(f"Error querying Hugging Face models: {e}")
    return []

async def search_datasets(query: str, limit: int = 10) -> List[Dict[str, Any]]:
    """Search Hugging Face Hub for datasets to check if an artist's works or names are in training sets."""
    try:
        async with httpx.AsyncClient(verify=False, timeout=10.0) as client:
            response = await client.get(
                f"{BASE_URL}/datasets",
                params={"search": query, "limit": limit, "full": "false"},
                headers=HEADERS
            )
            if response.status_code == 200:
                data = response.json()
                results = []
                for item in data:
                    dataset_id = item.get("id", "")
                    results.append({
                        "id": dataset_id,
                        "title": dataset_id,
                        "type": "ai_dataset",
                        "author": dataset_id.split("/")[0] if "/" in dataset_id else "Community",
                        "downloads": item.get("downloads", 0),
                        "likes": item.get("likes", 0),
                        "url": f"https://huggingface.co/datasets/{dataset_id}",
                        "source": "Hugging Face Datasets",
                        "description": "Training dataset indexed on Hugging Face"
                    })
                return results
    except Exception as e:
        print(f"Error querying Hugging Face datasets: {e}")
    return []
