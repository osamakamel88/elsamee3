import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base

class WriterWatchlist(Base):
    __tablename__ = "writer_watchlist"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String, nullable=False) # e.g. "Bassem Adel" / "باسم عادل"
    legal_name = Column(String, nullable=True) # e.g. "BASSEM ADEL EL SAID HASSAN"
    ipi_number = Column(String, nullable=True, index=True) # e.g. "00883594582"
    role = Column(String, default="lyricist") # lyricist, composer, author_composer
    aliases = Column(JSON, default=list) # ["باسم عادل", "Bassem Adel", "BASSEM ADEL EL SAID HASSAN"]
    publishers = Column(JSON, default=list) # ["Mazzika Group", "S D R M"]
    
    # Society IDs & stats
    mlc_ip_id = Column(Integer, nullable=True) # e.g. 17589818
    mlc_works_count = Column(Integer, default=0)
    sacem_works_count = Column(Integer, default=0)
    distrokid_tracks_count = Column(Integer, default=0)
    works_count = Column(Integer, default=0)
    
    # Snapshot of detected registered works
    known_works = Column(JSON, default=list)
    
    last_scanned_at = Column(DateTime(timezone=True), nullable=True)
    monitoring_enabled = Column(Boolean, default=True)
    monitoring_frequency_hours = Column(Integer, default=12)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User")
