from http.server import BaseHTTPRequestHandler
import json
import asyncio
import os
import sys

# Ensure VERCEL environment variable is active
os.environ["VERCEL"] = "1"

# Ensure backend directory is in sys.path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

_db_initialized = False

async def _init_db_if_needed():
    global _db_initialized
    if not _db_initialized:
        try:
            from app.database import engine, Base
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
            _db_initialized = True
        except Exception as e:
            print(f"Serverless DB init notice: {e}")

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps({
            "status": "online",
            "endpoint": "/api/search",
            "methods": ["POST", "OPTIONS", "GET"],
            "description": "elsamee3 Real-time Copyright Search Engine"
        }).encode('utf-8'))

    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body_bytes = self.rfile.read(content_length) if content_length > 0 else b'{}'
            body_str = body_bytes.decode('utf-8')
            payload = json.loads(body_str) if body_str else {}
            query_str = payload.get("query", "").strip()

            from app.api.search import search as search_func
            from app.schemas.search import SearchQuery
            from app.database import AsyncSessionLocal

            async def execute():
                await _init_db_if_needed()
                async with AsyncSessionLocal() as session:
                    return await search_func(SearchQuery(query=query_str), session)

            res = asyncio.run(execute())

            # Serialize Pydantic models to JSON
            if hasattr(res, "model_dump"):
                out_data = res.model_dump()
            elif isinstance(res, dict):
                out_data = dict(res)
                if "results" in out_data:
                    out_data["results"] = [
                        r.model_dump() if hasattr(r, "model_dump") else r
                        for r in out_data["results"]
                    ]
            else:
                out_data = res

            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(out_data, default=str).encode('utf-8'))

        except Exception as e:
            import traceback
            err = traceback.format_exc()
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({
                "error": "Search execution failed",
                "message": str(e),
                "traceback": err
            }).encode('utf-8'))
