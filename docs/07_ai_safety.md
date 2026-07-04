# AI Safety & LLM Security

## Prompt Injection Protection
- **System Prompt Isolation:** User inputs (RFP questions) are strictly separated from system instructions.
- **Input Sanitization:** Validate question inputs to detect and reject prompt injection attempts (e.g., "Ignore all previous instructions...").

## Safeguarding Outputs
- **Hallucination Mitigation:** The agent is strictly instructed to only answer based on retrieved context. If context is missing, it must output a fallback message ("Information not found").
- **Citations:** Every generated claim must include a citation to the specific source document/chunk in the vector DB.

## Data Privacy
- **Zero Data Retention:** Enterprise agreements with LLM providers (OpenAI/Google) guarantee that customer RFP data is not used to train future foundation models.
- **Tenant Isolation:** Vector databases are logically partitioned by `tenant_id` to ensure one organization cannot retrieve another organization's knowledge base.

## Abuse Prevention
- **Token Limits:** Hard limits on the max tokens per request to prevent cost exhaustion attacks.
- **Monitoring:** Track LLM API responses for toxic, harmful, or out-of-bounds content.
