from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.models.user import User
from app.api.deps import get_current_user
from sqlalchemy.future import select
from app.models.scan_job import ScanJob

router = APIRouter()

@router.get("/jobs")
async def list_scan_jobs(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ScanJob).where(ScanJob.user_id == current_user.id))
    return result.scalars().all()

@router.post("/scan")
async def trigger_scan(work_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    # Trigger celery task here
    return {"status": "scan initiated for work " + work_id}
