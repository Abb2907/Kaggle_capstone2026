from typing import List
import chromadb

from app.schemas.rfp import RFPQuestion, RFPAnswer


class RFPResponseAgent:
    """
    Core AI Agent for answering RFP questions using RAG via ChromaDB.
    """

    def __init__(self):
        # Initialize an ephemeral ChromaDB client for demonstration
        self.chroma_client = chromadb.EphemeralClient()
        self.collection_name = "rfp_knowledge_base"

        # Check if collection exists, if not create and populate
        try:
            self.collection = self.chroma_client.get_collection(
                name=self.collection_name
            )
        except Exception:
            self.collection = self.chroma_client.create_collection(
                name=self.collection_name
            )
            self._seed_database()

    def _seed_database(self):
        """Seed the ChromaDB collection with initial knowledge."""
        documents = [
            "Our platform supports SAML 2.0 based Single Sign-On (SSO) "
            "integrating with Okta, Azure AD, and Ping Identity.",
            "We are SOC 2 Type II compliant. The audit was conducted "
            "by a top-tier firm and the report is available under NDA.",
            "All data is encrypted at rest using AES-256 and in "
            "transit using TLS 1.3.",
        ]
        metadatas = [
            {
                "source": "Security_Whitepaper_v2.pdf",
                "category": "Authentication",
            },
            {"source": "Compliance_Report_2025.pdf", "category": "Compliance"},
            {"source": "Security_Whitepaper_v2.pdf", "category": "Encryption"},
        ]
        ids = ["doc_sso", "doc_soc2", "doc_encryption"]

        self.collection.add(documents=documents, metadatas=metadatas, ids=ids)

    def _retrieve_context(self, question_text: str) -> tuple[str, List[str]]:
        """Retrieve relevant context and sources from ChromaDB."""
        results = self.collection.query(
            query_texts=[question_text], n_results=1
        )

        context = ""
        sources = []
        if (
            results["documents"]
            and len(results["documents"][0]) > 0
            and results["distances"]
            and results["distances"][0][0] < 1.5
        ):
            context = results["documents"][0][0]
            sources.append(
                results["metadatas"][0][0].get("source", "Unknown Source")
            )

        return context, sources

    def answer_question(self, question: RFPQuestion) -> RFPAnswer:
        """
        Takes a single RFP question, retrieves context from Chroma,
        and synthesizes an answer.
        """
        # 1. Retrieve Context
        context, sources = self._retrieve_context(question.question_text)

        # 2. Synthesize Answer & Calculate Confidence
        if context:
            # Simulated LLM generation based on context
            answer_text = f"Based on retrieved context: {context}"
            confidence = "High"
            needs_review = False
        else:
            answer_text = (
                "Information not found in the knowledge base. "
                "Please consult an SME."
            )
            confidence = "Low"
            needs_review = True
            sources = []

        return RFPAnswer(
            question_id=question.id,
            answer_text=answer_text,
            confidence_score=confidence,
            sources_cited=sources,
            needs_review=needs_review,
        )
