from fastapi import APIRouter, Depends

from controllers.auth import auth_guard
from models.users import UserRole
from schemas.ai import AIAskPayload
from schemas.response import AIFinalResponse
from schemas.utils import AuthUser
from services.ai import AIService


router = APIRouter(prefix="/ai", tags=["AI"])


@router.post("/ask", response_model=AIFinalResponse)
def ask_ai(
    payload: AIAskPayload,
    current_user: AuthUser = Depends(
        auth_guard([UserRole.CUSTOMER, UserRole.ADMIN])
    ),
):
    return AIService.ask(current_user, payload)
