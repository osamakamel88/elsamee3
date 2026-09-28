from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from app.config import settings
from typing import AsyncGenerator

import os
import tempfile

def _resolve_engine_url() -> str:
    url = settings.DATABASE_URL
    is_serverless = bool(os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME"))
    if is_serverless:
        tmp_db = os.path.join(tempfile.gettempdir(), "elsamee3.db")
        return f"sqlite+aiosqlite:///{tmp_db}"
    if url.startswith("postgresql"):
        try:
            import asyncpg
        except ImportError:
            tmp_db = os.path.join(tempfile.gettempdir(), "elsamee3.db")
            return f"sqlite+aiosqlite:///{tmp_db}"
    return url

db_url = _resolve_engine_url()
engine = create_async_engine(db_url, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
