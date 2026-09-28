import sys
import os
import traceback

# Ensure VERCEL environment variable is set for serverless filesystem handling
os.environ["VERCEL"] = "1"

backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

try:
    from app.main import app
except Exception as e:
    from fastapi import FastAPI
    from fastapi.responses import JSONResponse
    app = FastAPI()
    err_tb = traceback.format_exc()
    @app.api_route("/{full_path:path}", methods=["GET", "POST", "PUT", "DELETE"])
    async def debug_catch(full_path: str):
        return JSONResponse(
            status_code=500,
            content={"error": "FastAPI Startup Failed", "message": str(e), "traceback": err_tb}
        )
