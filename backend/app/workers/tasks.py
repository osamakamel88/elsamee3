from .celery_app import celery_app
import time
import asyncio
import logging

logger = logging.getLogger(__name__)

@celery_app.task
def scan_work_on_platforms(work_id: str):
    time.sleep(5)
    return f"Scan completed for work {work_id}"

@celery_app.task
def scheduled_monitoring_scan():
    return "Scheduled scan completed"

@celery_app.task
def process_fingerprint(work_id: str, file_path: str):
    time.sleep(2)
    return f"Fingerprint processed for {work_id}"

@celery_app.task
def scheduled_handler_sentinel_scan():
    """Periodic task to scan watched lyricist/composer handlers across The MLC, SACEM, and DSPs."""
    from app.database import AsyncSessionLocal
    from app.models.writer_watchlist import WriterWatchlist
    from app.services.search.sentinel_service import sentinel_service
    from sqlalchemy.future import select

    async def _run():
        async with AsyncSessionLocal() as db:
            res = await db.execute(select(WriterWatchlist).where(WriterWatchlist.monitoring_enabled == True))
            handlers = res.scalars().all()
            for h in handlers:
                try:
                    await sentinel_service.scan_writer_handler(h.id, db)
                except Exception as e:
                    logger.error(f"Error in scheduled sentinel scan for {h.name}: {e}")

    asyncio.run(_run())
    return "Sentinel scan completed"
