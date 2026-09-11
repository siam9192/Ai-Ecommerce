from datetime import datetime, timedelta, timezone

import jwt
from fastapi import HTTPException, status
from pwdlib import PasswordHash
from sqlalchemy.orm import Session

from config import get_settings
from models.users import User, UserRole, UserStatus
from schemas.users import LoginPayload, RegisterPayload, UpdateUserPayload
from schemas.utils import Response, AuthUser


password_hash = PasswordHash.recommended()


def _user_response(user: User) -> dict:
    return {
        "id": user.id,
        "email": user.email,
        "full_name": user.full_name,
        "profile_picture": user.profile_picture,
        "role": user.role,
        "status": user.status,
        "created_at": user.created_at,
        "updated_at": user.updated_at,
    }


def _response(message: str, data, code: int = status.HTTP_200_OK):
    return Response(message=message, success=True, status_code=code, data=data)


class UserService:
    @staticmethod
    def register(payload: RegisterPayload, db: Session):
        email = str(payload.email).lower()
        if db.query(User).filter(User.email == email, User.is_deleted.is_(False)).first():
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT, detail="Email is already registered")

        user = User(
            email=email,
            hashed_password=password_hash.hash(payload.password),
            full_name=payload.full_name.strip(),
            role=payload.role,
            status=UserStatus.ACTIVE,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return _response("User registered successfully", _user_response(user), status.HTTP_201_CREATED)

    @staticmethod
    def authenticate(payload: LoginPayload, db: Session):
        email = str(payload.email).lower()
        user = db.query(User).filter(User.email == email,
                                     User.is_deleted.is_(False)).first()
        if user is None or not user.hashed_password or not password_hash.verify(payload.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
        if user.status != UserStatus.ACTIVE:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN, detail="User account is blocked")

        user.last_login = datetime.now(timezone.utc).replace(tzinfo=None)
        db.commit()
        db.refresh(user)
        settings = get_settings()
        expires = datetime.now(
            timezone.utc) + timedelta(minutes=settings.access_token_expire_minutes)
        token = jwt.encode(
            {"sub": str(user.id), "role": user.role.value, "exp": expires},
            settings.secret_key,
            algorithm=settings.algorithm,
        )
        return _response("Login successful", {"access_token": token, "token_type": "bearer", "user": _user_response(user)})

    @staticmethod
    def get_by_id(user_id: int, db: Session) -> User:
        user = db.query(User).filter(User.id == user_id,
                                     User.is_deleted.is_(False)).first()
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        return user

    @staticmethod
    def update(user_id: int, payload: UpdateUserPayload, db: Session):
        user = UserService.get_by_id(user_id, db)
        values = payload.model_dump(exclude_unset=True)
        if "email" in values:
            email = str(values["email"]).lower()
            existing = db.query(User).filter(
                User.email == email, User.id != user_id, User.is_deleted.is_(False)).first()
            if existing:
                raise HTTPException(
                    status_code=status.HTTP_409_CONFLICT, detail="Email is already registered")
            user.email = email
        if "full_name" in values:
            user.full_name = values["full_name"].strip()
        if "profile_picture" in values:
            user.profile_picture = values["profile_picture"]
        db.commit()
        db.refresh(user)
        return _response("User updated successfully", _user_response(user))

    @staticmethod
    def delete(user_id: int, db: Session):
        user = UserService.get_by_id(user_id, db)
        user.is_deleted = True
        db.commit()
        return _response("User deleted successfully", True)

    @staticmethod
    def get_me(current_user: AuthUser, db: Session):
        user = db.query(User).filter(User.id == current_user.id).first()
        user.hashed_password == ""
        return _response("Current user retrieved successfully", _user_response(user))
