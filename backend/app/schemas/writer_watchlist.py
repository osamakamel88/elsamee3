from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from datetime import datetime
from uuid import UUID

class WriterWatchlistCreate(BaseModel):
    name: str # Display name, e.g. "Bassem Adel"
    legal_name: Optional[str] = None # e.g. "BASSEM ADEL EL SAID HASSAN"
    ipi_number: Optional[str] = None # e.g. "00883594582"
    role: Optional[str] = "lyricist" # lyricist, composer, author_composer
    aliases: Optional[List[str]] = []
    publishers: Optional[List[str]] = []
    monitoring_enabled: Optional[bool] = True
    monitoring_frequency_hours: Optional[int] = 12

class WriterWatchlistUpdate(BaseModel):
    name: Optional[str] = None
    legal_name: Optional[str] = None
    ipi_number: Optional[str] = None
    role: Optional[str] = None
    aliases: Optional[List[str]] = None
    publishers: Optional[List[str]] = None
    monitoring_enabled: Optional[bool] = None
    monitoring_frequency_hours: Optional[int] = None

class WriterWatchlistResponse(BaseModel):
    id: UUID
    user_id: UUID
    name: str
    legal_name: Optional[str] = None
    ipi_number: Optional[str] = None
    role: str
    aliases: List[str]
    publishers: List[str]
    mlc_ip_id: Optional[int] = None
    mlc_works_count: int = 0
    sacem_works_count: int = 0
    distrokid_tracks_count: int = 0
    works_count: int = 0
    known_works: List[Dict[str, Any]] = []
    last_scanned_at: Optional[datetime] = None
    monitoring_enabled: bool = True
    monitoring_frequency_hours: int = 12
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class ScanResultResponse(BaseModel):
    handler_id: UUID
    handler_name: str
    total_found_works: int
    mlc_works_found: int
    sacem_works_found: int
    dsp_tracks_found: int
    new_works_detected: int
    alerts_created: int
    message: str
    works: List[Dict[str, Any]]
