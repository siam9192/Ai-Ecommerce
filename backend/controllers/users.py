from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from controllers.auth import auth_guard
from database import get_db
from models.users import UserRole
from schemas.users import FindUsersPayload, UpdateUserPayload
from schemas.utils import AuthUser, PaginationQuery
from services.users import UserService


router = APIRouter(prefix="/users", tags=["Users"])


@router.get("")
def users_find(
    payload: FindUsersPayload = Depends(),
    pagination_query: PaginationQuery = Depends(),
    current_user: AuthUser = Depends(auth_guard([UserRole.ADMIN])),
    db: Session = Depends(get_db),
):
    return UserService.users_find(payload, pagination_query, db)


@router.get("/me")
def get_me(
    current_user: AuthUser = Depends(
        auth_guard([UserRole.CUSTOMER, UserRole.ADMIN])
    ),
    db: Session = Depends(get_db),
):
    return UserService.get_by_id(current_user.id, db)


@router.patch("/me")
def update_me(
    payload: UpdateUserPayload,
    current_user: AuthUser = Depends(
        auth_guard([UserRole.CUSTOMER, UserRole.ADMIN])
    ),
    db: Session = Depends(get_db),
):
    return UserService.update(current_user.id, payload, db)


@router.delete("/me")
def delete_me(
    current_user: AuthUser = Depends(
        auth_guard([UserRole.CUSTOMER, UserRole.ADMIN])
    ),
    db: Session = Depends(get_db),
):
    return UserService.delete(current_user.id, db)
