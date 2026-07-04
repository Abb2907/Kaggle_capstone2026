# Observability & Monitoring

## Structured Logging
- **Format:** JSON logs for all services, including `trace_id`, `user_id`, `action`, and `latency`.
- **Aggregation:** Forward logs to Datadog or ELK stack.

## Tracing
- **Distributed Tracing:** Use OpenTelemetry to trace requests from the Next.js frontend, through the FastAPI backend, to the LLM API calls and Vector DB queries. This is critical for debugging slow agent reasoning steps.
- **LLM Observability:** Use LangSmith or Phoenix to log and trace individual agent steps, prompts, and tool calls.

## Dashboards & Alerts
- **System Health:** Dashboard for CPU/Memory of containers, Postgres connection pool stats, and Redis queue length.
- **Business Health:** Dashboard showing RFP completion rates, average confidence scores, and API cost per day.
- **Alerting:** PagerDuty integration for P1 alerts (e.g., LLM API error rate > 5%, Postgres CPU > 80%).
