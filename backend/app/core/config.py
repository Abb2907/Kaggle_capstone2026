import os
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    PROJECT_NAME: str = "Automated RFP Response Agent API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY", "super-secret-development-key-change-in-production"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8

    # LLM Settings
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")

    # Vector DB
    PINECONE_API_KEY: str = os.getenv("PINECONE_API_KEY", "")
    PINECONE_ENVIRONMENT: str = os.getenv("PINECONE_ENVIRONMENT", "")
    PINECONE_INDEX_NAME: str = os.getenv(
        "PINECONE_INDEX_NAME", "rfp-knowledge-base"
    )

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL", "sqlite:///./sql_app.db"
    )


settings = Settings()
