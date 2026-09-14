from fastapi import APIRouter, Depends
from app.controllers.auth import auth_guard, get_optional_current_user
from app.models.users import UserRole
from app.schemas.ai import AIAskPayload
from app.schemas.response import AIFinalResponse
from app.schemas.utils import AuthUser
from app.services.ai import AIService


router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/ask", response_model=AIFinalResponse)
def ask_ai(
    payload: AIAskPayload,
    current_user: AuthUser = Depends(
        get_optional_current_user
    ),
):
    return AIService.ask(current_user, payload)
