from app.schemas.utils import AuthUser
from app.schemas.ai import AIAskPayload
import app.agent.run as agent


class AIService:
    @staticmethod
    def ask(current_user: AuthUser | None, payload: AIAskPayload):
        return agent.ask(
            payload.message,
            payload.client_state,
            payload.chat_history,
            current_user,
        )
