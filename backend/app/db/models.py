from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.sql import func
from app.db.session import Base


class RFPResponse(Base):
    __tablename__ = "rfp_responses"

    id = Column(Integer, primary_key=True, index=True)
    question_id = Column(String, index=True)
    question_text = Column(String)
    answer_text = Column(String)
    confidence_score = Column(String)
    source_cited = Column(String, nullable=True)
    needs_review = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
