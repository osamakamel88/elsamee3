import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, JSON, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from app.database import Base

class Work(Base):
    __tablename__ = "works"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = Column(String, nullable=False)
    title_ar = Column(String, nullable=True)
    work_type = Column(String, nullable=False) # audio, image, lyrics, composition
    composer = Column(String, nullable=True) # الملحن
    lyricist = Column(String, nullable=True) # الشاعر / كاتب الكلمات
    performer = Column(String, nullable=True) # المطرب / المؤدي
    arranger = Column(String, nullable=True) # الموزع الموسيقي
    lyrics_text = Column(Text, nullable=True) # نص الكلمات الكامل
    description = Column(String, nullable=True)
    description_ar = Column(String, nullable=True)
    isrc = Column(String, nullable=True, index=True) # Recording ID
    iswc = Column(String, nullable=True, index=True) # Musical Composition ID
    metadata_json = Column(JSON, nullable=True)
    file_path = Column(String, nullable=True)
    file_hash = Column(String, nullable=True)
    duration_seconds = Column(Float, nullable=True)
    width = Column(Integer, nullable=True)
    height = Column(Integer, nullable=True)
    monitoring_enabled = Column(Boolean, default=True)
    monitoring_frequency = Column(Integer, default=24) # hours
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    user = relationship("User")
