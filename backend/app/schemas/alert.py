from pydantic import BaseModel
from uuid import UUID
from typing import Optional, List, Dict, Any
from datetime import datetime

class AlertBase(BaseModel):
    severity: str
    match_type: str
    confidence: float
    platform: str
    infringing_url: str
    status: str

class AlertUpdate(BaseModel):
    status: str

class AlertResponse(AlertBase):
    id: UUID
    user_id: UUID
    work_id: UUID
    evidence_data: Optional[Dict[str, Any]] = None
    fingerprint_layers_matched: Optional[List[Dict[str, Any]]] = None
    detected_at: datetime
    reviewed_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class AlertListResponse(BaseModel):
    items: List[AlertResponse]
    total: int
