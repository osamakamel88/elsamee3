from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import get_db
from app.models.user import User
from app.models.alert import Alert
from app.schemas.alert import AlertResponse, AlertListResponse, AlertUpdate
from app.api.deps import get_current_user
import uuid

router = APIRouter()

@router.get("", response_model=AlertListResponse)
async def list_alerts(skip: int = 0, limit: int = 100, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Alert).where(Alert.user_id == current_user.id).offset(skip).limit(limit))
    alerts = result.scalars().all()
    count_result = await db.execute(select(Alert).where(Alert.user_id == current_user.id))
    return {"items": alerts, "total": len(count_result.scalars().all())}

@router.put("/{alert_id}", response_model=AlertResponse)
async def update_alert(alert_id: uuid.UUID, alert_in: AlertUpdate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Alert).where(Alert.id == alert_id, Alert.user_id == current_user.id))
    alert = result.scalars().first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
    alert.status = alert_in.status
    await db.commit()
    await db.refresh(alert)
    return alert
