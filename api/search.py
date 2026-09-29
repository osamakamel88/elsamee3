from http.server import BaseHTTPRequestHandler
import json
import asyncio
import os
import sys
import tempfile
import email
from email.policy import default

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
            from app.database import engine, Base, AsyncSessionLocal
            from app.models.writer_watchlist import WriterWatchlist
            from app.models.user import User
            from sqlalchemy.future import select
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)

            async with AsyncSessionLocal() as session:
                existing = await session.execute(select(WriterWatchlist).limit(1))
                if not existing.scalar_one_or_none():
                    user_res = await session.execute(select(User).limit(1))
                    user = user_res.scalar_one_or_none()
                    if not user:
                        user = User(
                            username="elsamee3_admin",
                            email="admin@elsamee3.com",
                            hashed_password="hashed_placeholder",
                            full_name="السميع (elsamee3)",
                            country="EG"
                        )
                        session.add(user)
                        await session.commit()
                        await session.refresh(user)

                    handler_obj = WriterWatchlist(
                        user_id=user.id,
                        name="Demo Repertoire Writer (نموذج مؤلف معتمد)",
                        legal_name="DEMO REGISTERED AUTHOR",
                        ipi_number="00883594582",
                        role="lyricist",
                        aliases=["Demo Writer", "مؤلف تجريبي"],
                        publishers=["SDRM", "SACEM", "The MLC"],
                        mlc_ip_id=17589818,
                        monitoring_enabled=True,
                        monitoring_frequency_hours=12,
                        works_count=38,
                        mlc_works_count=38
                    )
                    session.add(handler_obj)
                    await session.commit()
            _db_initialized = True
        except Exception as e:
            print(f"Serverless DB init notice: {e}")


def _extract_multipart_file(content_type: str, body_bytes: bytes) -> tuple[str, bytes]:
    """Extracts uploaded file bytes and filename from multipart/form-data."""
    header = f"Content-Type: {content_type}\r\n\r\n".encode('latin1')
    msg = email.message_from_bytes(header + body_bytes, policy=default)
    
    for part in msg.iter_parts():
        fn = part.get_filename()
        if fn:
            payload = part.get_payload(decode=True)
            return fn, payload
    
    # Fallback to single payload if not found
    return "uploaded_file.bin", body_bytes


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
            "features": ["text_search", "lyrics_fingerprint", "audio_fingerprint", "image_fingerprint"],
            "description": "elsamee3 Real-time Copyright Search & Fingerprint Engine"
        }).encode('utf-8'))

    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            content_type = self.headers.get('Content-Type', '')
            body_bytes = self.rfile.read(content_length) if content_length > 0 else b'{}'
            req_path = (self.path + " " + self.headers.get('x-matched-path', '') + " " + self.headers.get('x-forwarded-uri', '')).lower()
            is_multipart = "multipart/form-data" in content_type.lower()

            # -------------------------------------------------------------
            # CASE 1: MULTIPART UPLOADS (AUDIO / IMAGE)
            # -------------------------------------------------------------
            if is_multipart:
                filename, file_content = _extract_multipart_file(content_type, body_bytes)
                suffix = os.path.splitext(filename)[1].lower() or ".bin"
                is_img = "image" in req_path or suffix in ['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.gif', '.svg', '.tiff']
                
                # AUDIO PROCESSING
                if not is_img:
                    audio_suffix = suffix if suffix in ['.mp3', '.wav', '.ogg', '.m4a', '.flac', '.aac', '.wma', '.opus'] else ".mp3"
                    with tempfile.NamedTemporaryFile(delete=False, suffix=audio_suffix) as tmp:
                        tmp.write(file_content)
                        tmp_path = tmp.name

                    try:
                        from app.services.fingerprint.audio_fingerprint import fingerprint_audio
                        from app.services.search import openverse_client
                        from app.services.search.dsp_client import dsp_client

                        fp_data = fingerprint_audio(tmp_path)
                        
                        clean_name = os.path.splitext(filename)[0]
                        # Remove timestamps / hashes
                        clean_words = [w for w in clean_name.replace('-', ' ').replace('_', ' ').split() if len(w) > 2 and not w.isdigit()]
                        search_kw = " ".join(clean_words[:3]) if clean_words else "Music"

                        async def run_audio_matches():
                            ov_res = await openverse_client.search_audio(search_kw, limit=5)
                            dsp_res = await dsp_client.search_tracks(search_kw, limit=3)
                            return (ov_res or []) + (dsp_res or [])

                        matches = asyncio.run(run_audio_matches())

                        out = {
                            "status": "success",
                            "filename": filename,
                            "fingerprint": fp_data,
                            "matches_count": len(matches),
                            "matches": matches
                        }
                        self._send_json(out)
                        return
                    finally:
                        if os.path.exists(tmp_path):
                            try:
                                os.remove(tmp_path)
                            except Exception:
                                pass

                # IMAGE PROCESSING
                else:
                    img_suffix = suffix if suffix in ['.png', '.jpg', '.jpeg', '.webp', '.bmp', '.gif'] else ".png"
                    with tempfile.NamedTemporaryFile(delete=False, suffix=img_suffix) as tmp:
                        tmp.write(file_content)
                        tmp_path = tmp.name

                    try:
                        from app.services.fingerprint.image_fingerprint import fingerprint_image
                        from app.services.search import openverse_client

                        fp_data = fingerprint_image(tmp_path)
                        clean_name = os.path.splitext(filename)[0]

                        async def run_img_matches():
                            return await openverse_client.search_images(clean_name, limit=6)

                        matches = asyncio.run(run_img_matches())

                        out = {
                            "status": "success",
                            "filename": filename,
                            "hashes": fp_data,
                            "matches_count": len(matches),
                            "matches": matches
                        }
                        self._send_json(out)
                        return
                    finally:
                        if os.path.exists(tmp_path):
                            try:
                                os.remove(tmp_path)
                            except Exception:
                                pass

            # -------------------------------------------------------------
            # CASE 2: JSON REQUESTS (LYRICS OR UNIFIED SEARCH)
            # -------------------------------------------------------------
            body_str = body_bytes.decode('utf-8', errors='ignore')
            payload = json.loads(body_str) if body_str else {}

            # SUBCASE 2A: LYRICS SEARCH (/api/search/lyrics or payload has 'lyrics')
            if "lyrics" in req_path or "lyrics" in payload:
                from app.api.search import search_by_lyrics
                from app.database import AsyncSessionLocal

                async def run_lyrics():
                    await _init_db_if_needed()
                    async with AsyncSessionLocal() as session:
                        return await search_by_lyrics(payload, session)

                res = asyncio.run(run_lyrics())
                self._send_json(res)
                return

            # SUBCASE 2B: UNIFIED TEXT SEARCH (/api/search)
            query_str = payload.get("query", "").strip()

            from app.api.search import search as search_func
            from app.schemas.search import SearchQuery
            from app.database import AsyncSessionLocal

            async def execute():
                await _init_db_if_needed()
                async with AsyncSessionLocal() as session:
                    return await search_func(SearchQuery(query=query_str), session)

            res = asyncio.run(execute())

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

            self._send_json(out_data)

        except Exception as e:
            import traceback
            err = traceback.format_exc()
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps({
                "status": "error",
                "message": str(e),
                "traceback": err,
                "matches": []
            }).encode('utf-8'))

    def _send_json(self, data):
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data, default=str).encode('utf-8'))
