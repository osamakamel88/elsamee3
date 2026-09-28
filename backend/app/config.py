import os
import tempfile
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

def _get_database_url() -> str:
    # On Vercel / serverless runtimes the root fs is read-only; use /tmp
    if os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"):
        tmp_db = os.path.join(tempfile.gettempdir(), "elsamee3.db")
        return f"sqlite+aiosqlite:///{tmp_db}"
    return "sqlite+aiosqlite:///./elsamee3.db"

class Settings(BaseSettings):
    DATABASE_URL: str = _get_database_url()
    REDIS_URL: str = "redis://localhost:6379/0"
    SECRET_KEY: str = "supersecretkey_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    ACOUSTID_API_KEY: Optional[str] = None
    MUSICBRAINZ_APP: Optional[str] = "elsamee3/0.1.0"
    TINEYE_API_KEY: Optional[str] = None
    GOOGLE_VISION_API_KEY: Optional[str] = None
    YOUTUBE_API_KEY: Optional[str] = None

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
