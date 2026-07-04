# Performance & Optimization

## Latency Reduction
- **Streaming Responses:** Use SSE (Server-Sent Events) to stream the AI's response to the frontend in real-time.
- **Batching:** When a 100-question RFP is uploaded, process questions concurrently in batches of 10-20 using Celery/Redis workers to dramatically reduce total processing time.
- **Caching:** Cache identical questions (e.g., standard SOC2 questions) in Redis. If a question is a 95% semantic match to a cached Q&A pair, serve the cached answer immediately.

## Cost & Token Optimization
- **Context Pruning:** Use a reranker model (e.g., Cohere Rerank) to narrow down the top 10 vector DB results to the top 3 most relevant chunks before sending them to the LLM.
- **Prompt Optimization:** Keep system prompts concise and structured. Use JSON mode to guarantee structured outputs without requiring the LLM to write extra explanation text.

## Scalability
- **Horizontal Scaling:** Both FastAPI (backend) and Next.js (frontend) can scale horizontally in Cloud Run/ECS based on CPU utilization and request queues.
- **Database Indexing:** Use proper B-tree indices on PostgreSQL foreign keys and GIN indices for full-text search fallback.
