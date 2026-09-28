from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.database import engine, Base
from app.api import api_router
from app.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Auto-create tables gracefully
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
    except Exception as e:
        print(f"Database initialization warning (non-fatal): {e}")
    yield
    try:
        await engine.dispose()
    except Exception:
        pass

app = FastAPI(
    title="elsamee3 API",
    description="Backend API for the elsamee3 copyright detection platform (السميع)",
    version="0.1.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Support both /api/path and /path for Vercel and direct proxy compatibility
app.include_router(api_router, prefix="/api")
app.include_router(api_router)

# Mount React Frontend SPA for local or container runs (Vercel serves frontend via CDN)
import os
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

if not os.environ.get("VERCEL"):
    static_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static")
    if not os.path.exists(static_dir):
        # Mono-repo fallback: ../frontend/dist
        static_dir = os.path.abspath(os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "frontend", "dist"))

    if os.path.exists(static_dir) and os.path.exists(os.path.join(static_dir, "index.html")):
        assets_dir = os.path.join(static_dir, "assets")
        if os.path.exists(assets_dir):
            app.mount("/assets", StaticFiles(directory=assets_dir), name="assets")

        @app.get("/{full_path:path}")
        async def serve_spa(full_path: str):
            if full_path in ("docs", "redoc", "openapi.json") or full_path.startswith("api"):
                return None
            file_path = os.path.join(static_dir, full_path)
            if full_path and os.path.exists(file_path) and os.path.isfile(file_path):
                return FileResponse(file_path)
            return FileResponse(os.path.join(static_dir, "index.html"))
    else:
        @app.get("/")
        async def root():
            return {
                "name": "elsamee3 API (السميع)",
                "status": "online",
                "docs": "/docs",
                "message": "Copyright Guardian API for Musicians, Composers & Lyricists"
            }
else:
    @app.get("/")
    async def vercel_root():
        return {
            "name": "elsamee3 API (السميع)",
            "status": "online",
            "docs": "/docs",
            "platform": "Vercel Serverless"
        }
