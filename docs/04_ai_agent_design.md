# AI Agent Design

## Goals
The agent must autonomously read a parsed RFP question, determine if it needs clarification, search the vector database, synthesize an accurate answer based *only* on the retrieved context, assign a confidence score, and format the output.

## Capabilities
- **Semantic Search:** Querying the Vector DB.
- **Document Summarization:** Extracting relevant info from long contexts.
- **Tool Calling:** Using specific tools (e.g., `search_knowledge_base`, `fetch_document_chunk`).
- **Confidence Scoring:** Self-evaluating its answer against the retrieved context.

## Limitations
- The agent **cannot** invent features or compliance capabilities. If the answer is not in the knowledge base, it must explicitly state "Information not found" and assign a Low confidence score.

## Tools
1. `search_knowledge_base(query: str, tags: list[str]) -> list[Document]`
2. `get_full_document(doc_id: str) -> str`
3. `flag_for_sme_review(question_id: str, reason: str)`

## Reasoning Strategy (Plan-and-Solve)
For each question:
1. **Plan:** Deconstruct the question. (e.g., "Does your platform support SAML SSO and what IdPs are supported?")
2. **Search:** Query the Vector DB for "SAML SSO supported IdPs".
3. **Evaluate Context:** Does the retrieved context contain the answer?
   - If YES -> Generate answer.
   - If NO -> Try one more rewritten query. If still NO -> Output "Not Found", Confidence: Low.
4. **Draft:** Write the response matching the required format (Yes/No, Short Answer, Long Essay).
5. **Self-Correct:** Review the drafted answer against the context to prevent hallucination.

## Context Management
- A maximum of top-K (e.g., 5) chunks are provided to the LLM to prevent context window overflow and reduce costs.
- Chat history is irrelevant for batch RFP answering; context is stateless per question.

## Error Recovery & Retry Strategy
- If the LLM API times out, implement exponential backoff (e.g., Tenacity library).
- If the LLM returns invalid JSON (for structured output), use a fallback retry parser.

## Human-in-the-Loop Workflow
- All generated answers are held in a "Draft" state.
- Users can accept, edit, or reject the answer.
- Edits made by humans are automatically fed back into the Vector DB as a "Canonical Q&A" to improve future performance.
