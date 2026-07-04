
from app.agent.engine import RFPResponseAgent
from app.schemas.rfp import RFPQuestion


def test_agent_high_confidence():
    agent = RFPResponseAgent()
    q = RFPQuestion(id="q1", question_text="Do you support SSO?")
    ans = agent.answer_question(q)

    assert ans.question_id == "q1"
    assert ans.confidence_score == "High"
    assert not ans.needs_review
    assert "SAML 2.0" in ans.answer_text


def test_agent_low_confidence():
    agent = RFPResponseAgent()
    q = RFPQuestion(id="q2", question_text="Do you have data centers in Mars?")
    ans = agent.answer_question(q)

    assert ans.question_id == "q2"
    assert ans.confidence_score == "Low"
    assert ans.needs_review
    assert "Information not found" in ans.answer_text
