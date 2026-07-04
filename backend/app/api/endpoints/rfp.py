from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlalchemy.orm import Session
from app.schemas.rfp import RFPQuestion, RFPAnswer
from app.agent.engine import RFPResponseAgent
from app.db.session import get_db
from app.db.models import RFPResponse

router = APIRouter()
agent = RFPResponseAgent()


def save_answer_to_db(db: Session, question: RFPQuestion, answer: RFPAnswer):
    db_response = RFPResponse(
        question_id=question.id,
        question_text=question.question_text,
        answer_text=answer.answer_text,
        confidence_score=answer.confidence_score,
        source_cited=answer.sources_cited[0] if answer.sources_cited else None,
        needs_review=answer.needs_review,
    )
    db.add(db_response)
    db.commit()
    db.refresh(db_response)
    return db_response


@router.post("/answer", response_model=RFPAnswer)
def answer_rfp_question(question: RFPQuestion, db: Session = Depends(get_db)):
    """
    Process a single RFP question through the AI Agent and store in DB.
    """
    try:
        answer = agent.answer_question(question)
        save_answer_to_db(db, question, answer)
        return answer
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/answer-batch", response_model=List[RFPAnswer])
def answer_rfp_batch(
    questions: List[RFPQuestion], db: Session = Depends(get_db)
):
    """
    Process a batch of RFP questions and store in DB.
    """
    answers = []
    for q in questions:
        ans = agent.answer_question(q)
        save_answer_to_db(db, q, ans)
        answers.append(ans)
    return answers
