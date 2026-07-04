from typing import List
from pydantic import BaseModel, Field


class RFPQuestion(BaseModel):
    id: str = Field(..., description="Unique identifier for the question")
    question_text: str = Field(..., description="The text of the RFP question")
    category: str | None = Field(
        None, description="Category of the question (e.g., Security, Pricing)"
    )


class RFPAnswer(BaseModel):
    question_id: str
    answer_text: str
    confidence_score: str = Field(..., description="High, Medium, or Low")
    sources_cited: List[str] = Field(default_factory=list)
    needs_review: bool = Field(default=False)
