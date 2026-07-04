# Enterprise Security Architecture

## Authentication & Authorization
- **Authentication:** JWT-based authentication via Auth0/Supabase.
- **RBAC:** Strict Role-Based Access Control.
  - *Admin:* Can configure integrations and manage all users.
  - *Bid Manager:* Can upload RFPs and assign questions.
  - *SME:* Can only view and edit assigned questions.
  - *Sales Engineer:* Can generate responses and export RFPs.

## Data Security
- **Encryption at Rest:** All PostgreSQL data and S3 objects encrypted using AES-256.
- **Encryption in Transit:** Enforce TLS 1.3 for all API and web traffic.
- **Secrets Management:** Environment variables and API keys stored securely in GCP Secret Manager / AWS Secrets Manager. Never hardcoded in the repository.

## Threat Prevention (OWASP Top 10)
- **Input Validation:** Strict Pydantic validation on all FastAPI endpoints.
- **SQL Injection:** Prevented by using SQLAlchemy ORM and parameterized queries.
- **XSS Prevention:** Next.js automatically escapes values, preventing Cross-Site Scripting.
- **CSRF Protection:** Implemented via secure cookies and standard token verification.
- **Rate Limiting:** IP-based rate limiting via Redis to prevent brute force and DDoS.

## Audit & Compliance
- **Audit Logging:** Every action (RFP upload, question answered, manual edit) is logged with a timestamp, user ID, and action description for compliance and troubleshooting.
- **PII Detection:** Ensure uploaded RFPs are scanned for PII before processing; optionally redact sensitive client info.
