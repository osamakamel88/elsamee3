from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/elsamee3"
    REDIS_URL: str = "redis://localhost:6379/0"
    SECRET_KEY: str = "supersecretkey_change_in_production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    ACOUSTID_API_KEY: Optional[str] = None
    MUSICBRAINZ_APP: Optional[str] = "elsamee3/0.1.0"
    TINEYE_API_KEY: Optional[str] = None
    GOOGLE_VISION_API_KEY: Optional[str] = None
    YOUTUBE_API_KEY: Optional[str] = None

    model_config = SettingsConfigDict(env_file=".env")

settings = Settings()
