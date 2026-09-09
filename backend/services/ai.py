from schemas.utils import AuthUser
from schemas.ai import AIAskPayload
import agent.run as agent


class AIService:
    @staticmethod
    def ask(current_user: AuthUser, payload: AIAskPayload):
        return agent.ask(
            payload.message,
            payload.client_state,
            payload.chat_history,
            current_user,
        )

  