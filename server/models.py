from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.sql import func
from database import Base

class AnalysisHistory(Base):
    __tablename__ = "analysis_history"

    id = Column(Integer, primary_key=True, index=True)
    video_id = Column(String, index=True)
    title = Column(String)
    thumbnail = Column(String)
    channel_title = Column(String)
    language = Column(String, default="en")
    analysis_json = Column(JSON) # Stores the full analysis result
    created_at = Column(DateTime(timezone=True), server_default=func.now())
