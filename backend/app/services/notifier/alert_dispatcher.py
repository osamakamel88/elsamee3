from app.models.alert import Alert
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

async def create_alert(work_id: str, match_data: dict, db: AsyncSession) -> Alert:
    alert = Alert(
        user_id=match_data['user_id'],
        work_id=work_id,
        severity=match_data['severity'],
        match_type=match_data['match_type'],
        confidence=match_data['confidence'],
        platform=match_data['platform'],
        infringing_url=match_data['infringing_url']
    )
    db.add(alert)
    await db.commit()
    await db.refresh(alert)
    return alert

async def dispatch_notification(alert: Alert, user, channel='in_app') -> bool:
    # Here you would integrate with an email provider like SendGrid or AWS SES
    print(f"Dispatched {channel} alert {alert.id} to {user.email}")
    return True

async def get_user_alerts(user_id: str, filters: dict, db: AsyncSession) -> list:
    query = select(Alert).where(Alert.user_id == user_id)
    if 'status' in filters:
        query = query.where(Alert.status == filters['status'])
    if 'severity' in filters:
        query = query.where(Alert.severity == filters['severity'])
    result = await db.execute(query)
    return result.scalars().all()
