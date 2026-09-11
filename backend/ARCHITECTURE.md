# Backend Structure

- `main.py`: FastAPI application entry point and middleware setup.
- `controllers/`: HTTP routers, dependencies, and request/response wiring.
- `services/`: Application use cases and transaction boundaries.
- `schemas/`: Pydantic request, response, and shared validation models.
- `models/`: SQLAlchemy entities and relationships.
- `tools/`: Database-backed operations exposed to the AI agent.
- `agent/`: LLM setup, prompt execution, and AI tool orchestration.
- `rag/`: Retrieval-augmented generation components.
- `JSON_DATA/`: Seed or fixture data.
- `chroma_db/`: Local Chroma persistence; do not commit generated runtime data.

Keep controllers thin, put business rules in services, and keep direct database operations in services or `tools/` rather than in routers.
