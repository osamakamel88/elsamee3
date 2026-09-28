import sys
import os

os.environ["VERCEL"] = "1"

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.main import app
from app.api.search import router as search_router

# Ensure search routes match at root, /search, and /api/search
app.include_router(search_router)
