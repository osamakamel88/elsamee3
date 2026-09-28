import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base

class Takedown(Base):
    __tablename__ = "takedowns"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    alert_id = Column(UUID(as_uuid=True), ForeignKey("alerts.id", ondelete="CASCADE"), nullable=False)
    work_id = Column(UUID(as_uuid=True), ForeignKey("works.id", ondelete="CASCADE"), nullable=False)
    platform = Column(String, nullable=False)
    infringing_url = Column(String, nullable=False)
    notice_type = Column(String, nullable=False) # dmca, eu_article17
    notice_text = Column(String, nullable=False)
    notice_pdf_path = Column(String, nullable=True)
    status = Column(String, default="draft") # draft, sent, acknowledged, resolved, disputed, withdrawn
    platform_takedown_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    sent_at = Column(DateTime(timezone=True), nullable=True)
    resolved_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User")
    alert = relationship("Alert")
    work = relationship("Work")
