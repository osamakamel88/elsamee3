from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models.user import User
from app.models.takedown import Takedown
from app.schemas.takedown import TakedownCreate, TakedownResponse, TakedownUpdate
from app.api.deps import get_current_user
from app.services.takedown.dmca_generator import generate_dmca_notice
from app.models.alert import Alert
from app.models.work import Work
import uuid

router = APIRouter()

@router.post("", response_model=TakedownResponse)
async def create_takedown(takedown_in: TakedownCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    alert_result = await db.execute(select(Alert).where(Alert.id == takedown_in.alert_id))
    alert = alert_result.scalars().first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
        
    work_result = await db.execute(select(Work).where(Work.id == alert.work_id))
    work = work_result.scalars().first()
    
    notice_text = generate_dmca_notice(alert, current_user, work)
    
    takedown = Takedown(
        user_id=current_user.id,
        alert_id=alert.id,
        work_id=work.id,
        platform=takedown_in.platform,
        infringing_url=takedown_in.infringing_url,
        notice_type=takedown_in.notice_type,
        notice_text=notice_text
    )
    db.add(takedown)
    await db.commit()
    await db.refresh(takedown)
    return takedown

@router.get("", response_model=list[TakedownResponse])
async def list_takedowns(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Takedown).where(Takedown.user_id == current_user.id))
    return result.scalars().all()
