from pydantic import BaseModel
from uuid import UUID
from typing import Optional
from datetime import datetime

class TakedownBase(BaseModel):
    alert_id: UUID
    platform: str
    infringing_url: str
    notice_type: str

class TakedownCreate(TakedownBase):
    pass

class TakedownUpdate(BaseModel):
    status: str
    platform_takedown_url: Optional[str] = None

class TakedownResponse(TakedownBase):
    id: UUID
    user_id: UUID
    work_id: UUID
    notice_text: str
    notice_pdf_path: Optional[str] = None
    status: str
    platform_takedown_url: Optional[str] = None
    created_at: datetime
    sent_at: Optional[datetime] = None
    resolved_at: Optional[datetime] = None

    class Config:
        from_attributes = True
