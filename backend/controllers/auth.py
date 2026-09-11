from typing import Optional
import jwt
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from config import get_settings
from database import get_db
from models.users import User, UserStatus
from schemas.users import LoginPayload, RegisterPayload
from schemas.utils import AuthUser
from services.users import UserService
from models.users import UserRole

router = APIRouter(prefix="/auth", tags=["Authentication"])
bearer = HTTPBearer(auto_error=False)


def auth_guard(allowed_roles: list[UserRole]):
    def get_current_user(
        credentials: HTTPAuthorizationCredentials = Depends(bearer),
        db: Session = Depends(get_db),
    ) -> AuthUser:
        if credentials is None or credentials.scheme.lower() != "bearer":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Authentication required",
            )
        try:
            settings = get_settings()
            payload = jwt.decode(
                credentials.credentials,
                settings.secret_key,
                algorithms=[settings.algorithm],
            )
            user_id = int(payload["sub"])
        except (jwt.PyJWTError, KeyError, TypeError, ValueError):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
            )

        user = db.query(User).filter(
            User.id == user_id,
            User.is_deleted.is_(False),
        ).first()
        if user is None or user.status != UserStatus.ACTIVE:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User is unavailable",
            )
        if user.role not in allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Insufficient permissions",
            )

        return AuthUser(id=user.id, role=user.role)

    return get_current_user


get_current_user = auth_guard([UserRole.CUSTOMER, UserRole.ADMIN])
get_current_admin = auth_guard([UserRole.ADMIN])


def get_optional_current_user(
        credentials: HTTPAuthorizationCredentials = Depends(bearer),
        db: Session = Depends(get_db)
) -> Optional[AuthUser]:
    if credentials is None:
        return None
    return get_current_user(credentials, db)


@router.post("/register", status_code=status.HTTP_201_CREATED)
def register(payload: RegisterPayload, db: Session = Depends(get_db)):
    return UserService.register(payload, db)


@router.post("/login")
def login(payload: LoginPayload, db: Session = Depends(get_db)):
    return UserService.authenticate(payload, db)


@router.get("/me")
def get_me(current_user=Depends(get_current_user), db: Session = Depends(get_db)):

    return UserService.get_me(current_user, db)
