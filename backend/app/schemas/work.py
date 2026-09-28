from pydantic import BaseModel
from uuid import UUID
from typing import Optional, List, Dict, Any
from datetime import datetime

class WorkBase(BaseModel):
    title: str
    title_ar: Optional[str] = None
    work_type: str
    description: Optional[str] = None
    description_ar: Optional[str] = None
    isrc: Optional[str] = None
    iswc: Optional[str] = None
    monitoring_enabled: bool = True
    monitoring_frequency: int = 24

class WorkCreate(WorkBase):
    pass

class WorkUpdate(BaseModel):
    title: Optional[str] = None
    title_ar: Optional[str] = None
    description: Optional[str] = None
    description_ar: Optional[str] = None
    isrc: Optional[str] = None
    iswc: Optional[str] = None
    monitoring_enabled: Optional[bool] = None
    monitoring_frequency: Optional[int] = None

class WorkResponse(WorkBase):
    id: UUID
    user_id: UUID
    metadata_json: Optional[Dict[str, Any]] = None
    duration_seconds: Optional[float] = None
    width: Optional[int] = None
    height: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class WorkListResponse(BaseModel):
    items: List[WorkResponse]
    total: int
