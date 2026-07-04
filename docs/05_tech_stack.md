# Tech Stack Selection

## Frontend
- **React + Next.js (App Router):** Industry standard for enterprise web apps. Excellent performance, SEO, and developer ecosystem.
- **Tailwind CSS + Shadcn UI:** For rapid, accessible, and highly customizable enterprise-grade UI components.
- **React Query:** For efficient data fetching and caching on the client.

## Backend
- **Python + FastAPI:** Python is the undisputed king of the AI/ML ecosystem. FastAPI provides high performance, automatic OpenAPI documentation, and native async support.
- **Celery + Redis:** For asynchronous background task processing. RFP answering can take minutes; it must not block the main API thread.

## AI & Data
- **LangChain / LangGraph:** For orchestrating the agent workflow and tool calling.
- **OpenAI API (GPT-4o) / Google Gemini 1.5 Pro:** Best-in-class reasoning for complex agentic workflows. Enterprise agreement ensures zero data retention.
- **Pinecone:** Serverless, highly scalable vector database. Eliminates the need to manage infrastructure for embeddings.

## Database
- **PostgreSQL:** The most robust, enterprise-ready relational database. Supports JSON fields for flexible metadata storage.

## Deployment & DevOps
- **Docker:** Containerization ensures consistency across environments.
- **GitHub Actions:** CI/CD for automated linting, testing, and deployment.
- **Google Cloud Platform (GCP) / Cloud Run:** Fully managed serverless execution for the FastAPI backend and Next.js frontend, scaling automatically based on traffic.
