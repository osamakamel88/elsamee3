from http.server import BaseHTTPRequestHandler
import json
import asyncio
import os
import sys
import uuid
from datetime import datetime, timezone

# Ensure VERCEL environment variable is active
os.environ["VERCEL"] = "1"

# Ensure backend directory is in sys.path
backend_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend"))
if backend_dir not in sys.path:
    sys.path.insert(0, backend_dir)

from app.database import engine, Base, AsyncSessionLocal
from app.models.user import User
from app.services.auth_service import (
    hash_password,
    verify_password,
    create_access_token,
    decode_access_token
)
from sqlalchemy.future import select

# Persistent fallback file for user accounts across serverless cold starts
DATA_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "backend", "app", "data"))
os.makedirs(DATA_DIR, exist_ok=True)
USERS_BACKUP_FILE = os.path.join(DATA_DIR, "registered_users.json")
TMP_BACKUP_FILE = os.path.join(os.environ.get("TMPDIR", "/tmp"), "elsamee3_users.json")

_db_ready = False

def _load_backup_users() -> dict:
    for path in [USERS_BACKUP_FILE, TMP_BACKUP_FILE]:
        if os.path.exists(path):
            try:
                with open(path, "r", encoding="utf-8") as f:
                    return json.load(f)
            except Exception:
                pass
    return {}

def _save_backup_user(user_dict: dict):
    users = _load_backup_users()
    users[user_dict["email"].lower()] = user_dict
    for path in [USERS_BACKUP_FILE, TMP_BACKUP_FILE]:
        try:
            with open(path, "w", encoding="utf-8") as f:
                json.dump(users, f, ensure_ascii=False, indent=2)
        except Exception:
            pass

async def _init_auth_db():
    global _db_ready
    if not _db_ready:
        try:
            async with engine.begin() as conn:
                await conn.run_sync(Base.metadata.create_all)
            
            # Sync any backup users to SQL database
            backups = _load_backup_users()
            if backups:
                async with AsyncSessionLocal() as session:
                    for email, udata in backups.items():
                        res = await session.execute(select(User).where(User.email == email))
                        if not res.scalars().first():
                            uid = uuid.UUID(udata["id"]) if "id" in udata and udata["id"] else uuid.uuid4()
                            u = User(
                                id=uid,
                                email=udata["email"],
                                username=udata.get("username", email.split("@")[0]),
                                hashed_password=udata["hashed_password"],
                                full_name=udata.get("full_name", ""),
                                country=udata.get("country", "EG"),
                                language=udata.get("language", "ar"),
                                artist_type=udata.get("artist_type", "musician")
                            )
                            session.add(u)
                    await session.commit()
            _db_ready = True
        except Exception as e:
            print(f"Auth DB Init notice: {e}")

class handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def _send_json(self, data, status_code=200):
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(data, default=str, ensure_ascii=False).encode('utf-8'))

    def do_GET(self):
        req_path = (self.path + " " + self.headers.get('x-matched-path', '') + " " + self.headers.get('x-forwarded-uri', '')).lower()
        
        # 1. GET /api/auth/me (Current User Profile)
        if "me" in req_path:
            auth_header = self.headers.get('Authorization', '')
            if not auth_header.startswith("Bearer "):
                self._send_json({"error": "Unauthorized", "detail": "Missing or invalid authorization token"}, 401)
                return

            token = auth_header[7:].strip()
            payload = decode_access_token(token)
            if not payload or "sub" not in payload:
                self._send_json({"error": "Unauthorized", "detail": "Invalid or expired token"}, 401)
                return

            user_id = payload["sub"]
            user_email = payload.get("email", "").lower()

            async def get_me():
                await _init_auth_db()
                async with AsyncSessionLocal() as session:
                    # Query by ID or email
                    res = await session.execute(select(User).where((User.id == user_id) | (User.email == user_email)))
                    u = res.scalars().first()
                    if u:
                        return {
                            "id": str(u.id),
                            "email": u.email,
                            "username": u.username,
                            "fullName": u.full_name,
                            "full_name": u.full_name,
                            "country": u.country,
                            "artistType": u.artist_type,
                            "artist_type": u.artist_type,
                            "language": u.language,
                            "is_active": u.is_active,
                            "created_at": str(u.created_at)
                        }
                    
                    # Fallback check
                    backups = _load_backup_users()
                    if user_email in backups:
                        b = backups[user_email]
                        return {
                            "id": b["id"],
                            "email": b["email"],
                            "username": b.get("username", user_email.split("@")[0]),
                            "fullName": b.get("full_name", ""),
                            "full_name": b.get("full_name", ""),
                            "country": b.get("country", "EG"),
                            "artistType": b.get("artist_type", "musician"),
                            "artist_type": b.get("artist_type", "musician"),
                            "language": b.get("language", "ar"),
                            "is_active": True,
                            "created_at": b.get("created_at")
                        }
                    return None

            user_data = asyncio.run(get_me())
            if user_data:
                self._send_json(user_data)
            else:
                self._send_json({"error": "Not Found", "detail": "User not found in registry"}, 404)
            return

        # 2. GET /api/auth/users (Summary of registered artists)
        if "users" in req_path:
            async def get_all_users():
                await _init_auth_db()
                users_list = []
                async with AsyncSessionLocal() as session:
                    res = await session.execute(select(User))
                    for u in res.scalars().all():
                        users_list.append({
                            "id": str(u.id),
                            "email": u.email,
                            "fullName": u.full_name,
                            "artistType": u.artist_type,
                            "country": u.country,
                            "created_at": str(u.created_at)
                        })
                return users_list

            users_list = asyncio.run(get_all_users())
            self._send_json({
                "status": "success",
                "registered_artists_count": len(users_list),
                "users": users_list
            })
            return

        # Default info endpoint
        self._send_json({
            "status": "online",
            "service": "elsamee3 User Registration & Auth Vault",
            "endpoints": ["POST /api/auth/register", "POST /api/auth/login", "GET /api/auth/me", "GET /api/auth/users"],
            "version": "1.0.0"
        })

    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            body_bytes = self.rfile.read(content_length) if content_length > 0 else b'{}'
            body_str = body_bytes.decode('utf-8', errors='ignore')
            payload = json.loads(body_str) if body_str else {}

            req_path = (self.path + " " + self.headers.get('x-matched-path', '') + " " + self.headers.get('x-forwarded-uri', '')).lower()
            is_register = "register" in req_path or payload.get("action") == "register" or "fullName" in payload or "full_name" in payload

            # -------------------------------------------------------------
            # CASE A: SIGNUP / REGISTRATION (/api/auth/register)
            # -------------------------------------------------------------
            if is_register:
                email = payload.get("email", "").strip().lower()
                password = payload.get("password", "")
                full_name = payload.get("fullName") or payload.get("full_name") or payload.get("name") or "Artist"
                artist_type = payload.get("artistType") or payload.get("artist_type") or "musician"
                country = payload.get("country") or "EG"
                language = payload.get("language") or "ar"
                username = payload.get("username") or email.split("@")[0] or f"artist_{uuid.uuid4().hex[:6]}"

                if not email or "@" not in email:
                    self._send_json({"error": "Validation Error", "detail": "يرجى إدخال بريد إلكتروني صحيح / Valid email required"}, 400)
                    return

                if not password or len(password) < 6:
                    self._send_json({"error": "Validation Error", "detail": "كلمة المرور يجب أن تكون 6 أحرف على الأقل / Password must be at least 6 characters"}, 400)
                    return

                async def process_register():
                    await _init_auth_db()
                    async with AsyncSessionLocal() as session:
                        # 1. Check duplicate email in SQL
                        res = await session.execute(select(User).where(User.email == email))
                        if res.scalars().first():
                            return None, "البريد الإلكتروني مسجل مسبقاً، يمكنك تسجيل الدخول مباشرة / Email already registered"

                        # 2. Check duplicate in backup vault
                        backups = _load_backup_users()
                        if email in backups:
                            return None, "البريد الإلكتروني مسجل مسبقاً / Email already registered"

                        # 3. Hash password and insert
                        hashed = hash_password(password)
                        user_id = uuid.uuid4()
                        new_user = User(
                            id=user_id,
                            email=email,
                            username=username,
                            hashed_password=hashed,
                            full_name=full_name,
                            country=country,
                            language=language,
                            artist_type=artist_type
                        )
                        session.add(new_user)
                        await session.commit()
                        await session.refresh(new_user)

                        # 4. Save to persistent backup registry
                        user_dict = {
                            "id": str(user_id),
                            "email": email,
                            "username": username,
                            "hashed_password": hashed,
                            "full_name": full_name,
                            "country": country,
                            "artist_type": artist_type,
                            "language": language,
                            "created_at": datetime.now(timezone.utc).isoformat()
                        }
                        _save_backup_user(user_dict)

                        token = create_access_token({"sub": str(user_id), "email": email})
                        return {
                            "status": "success",
                            "message": "تم إنشاء الحساب بنجاح وتسجيله في قاعدة بيانات السميع / Account successfully created",
                            "access_token": token,
                            "token_type": "bearer",
                            "user": {
                                "id": str(user_id),
                                "email": email,
                                "username": username,
                                "fullName": full_name,
                                "full_name": full_name,
                                "artistType": artist_type,
                                "artist_type": artist_type,
                                "country": country,
                                "language": language
                            }
                        }, None

                result, err_msg = asyncio.run(process_register())
                if err_msg:
                    self._send_json({"error": "Conflict", "detail": err_msg}, 400)
                else:
                    self._send_json(result, 201)
                return

            # -------------------------------------------------------------
            # CASE B: LOGIN (/api/auth/login)
            # -------------------------------------------------------------
            email = payload.get("email", "").strip().lower()
            password = payload.get("password", "")

            if not email or not password:
                self._send_json({"error": "Validation Error", "detail": "يرجى كتابة البريد وكلمة المرور / Email and password required"}, 400)
                return

            async def process_login():
                await _init_auth_db()
                async with AsyncSessionLocal() as session:
                    res = await session.execute(select(User).where(User.email == email))
                    u = res.scalars().first()
                    
                    found_user_dict = None
                    if u:
                        if verify_password(password, u.hashed_password):
                            found_user_dict = {
                                "id": str(u.id),
                                "email": u.email,
                                "username": u.username,
                                "fullName": u.full_name,
                                "full_name": u.full_name,
                                "artistType": u.artist_type,
                                "artist_type": u.artist_type,
                                "country": u.country
                            }
                    else:
                        # Check fallback registry
                        backups = _load_backup_users()
                        if email in backups:
                            b = backups[email]
                            if verify_password(password, b["hashed_password"]):
                                found_user_dict = {
                                    "id": b["id"],
                                    "email": b["email"],
                                    "username": b.get("username", email.split("@")[0]),
                                    "fullName": b.get("full_name", ""),
                                    "full_name": b.get("full_name", ""),
                                    "artistType": b.get("artist_type", "musician"),
                                    "artist_type": b.get("artist_type", "musician"),
                                    "country": b.get("country", "EG")
                                }

                    if found_user_dict:
                        token = create_access_token({"sub": found_user_dict["id"], "email": email})
                        return {
                            "status": "success",
                            "access_token": token,
                            "token_type": "bearer",
                            "user": found_user_dict
                        }, None
                    else:
                        return None, "البريد الإلكتروني أو كلمة المرور غير صحيحة / Invalid credentials"

            result, err_msg = asyncio.run(process_login())
            if err_msg:
                self._send_json({"error": "Unauthorized", "detail": err_msg}, 401)
            else:
                self._send_json(result, 200)

        except Exception as e:
            import traceback
            err = traceback.format_exc()
            self._send_json({
                "status": "error",
                "message": str(e),
                "traceback": err
            }, 500)
