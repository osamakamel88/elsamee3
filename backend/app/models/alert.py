import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base

class Alert(Base):
    __tablename__ = "alerts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    work_id = Column(UUID(as_uuid=True), ForeignKey("works.id", ondelete="CASCADE"), nullable=False)
    severity = Column(String, nullable=False) # high, medium, low, noise
    match_type = Column(String, nullable=False) # exact_copy, modified, potential_derivative
    confidence = Column(Float, nullable=False)
    platform = Column(String, nullable=False)
    infringing_url = Column(String, nullable=False)
    evidence_data = Column(JSON, nullable=True)
    fingerprint_layers_matched = Column(JSON, nullable=True)
    status = Column(String, default="new") # new, reviewed, actioned, dismissed, false_positive
    detected_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    reviewed_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User")
    work = relationship("Work")
