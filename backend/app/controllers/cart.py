from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.controllers.auth import auth_guard
from app.database import get_db
from app.models.users import UserRole
from app.schemas.cart import AddCartItemPayload, UpdateCartItemPayload
from app.schemas.utils import AuthUser
from app.services.cart import CartService


router = APIRouter(prefix="/cart", tags=["Cart"])


@router.get("")
def get_cart(
    current_user: AuthUser = Depends(auth_guard([UserRole.CUSTOMER])),
    db: Session = Depends(get_db),
):
    return CartService.get_cart(current_user.id, db)


@router.get("/items/{product_id}")
def get_cart_item(
    product_id: int,
    current_user: AuthUser = Depends(auth_guard([UserRole.CUSTOMER])),
    db: Session = Depends(get_db),
):
    return CartService.get_cart_item(current_user.id, product_id, db)


@router.post("/items")
def add_cart_item(
    payload: AddCartItemPayload,
    current_user: AuthUser = Depends(auth_guard([UserRole.CUSTOMER])),
    db: Session = Depends(get_db),
):
    return CartService.add_item(current_user.id, payload, db)


@router.patch("/items/{product_id}")
def update_cart_item(
    product_id: int,
    payload: UpdateCartItemPayload,
    current_user: AuthUser = Depends(auth_guard([UserRole.CUSTOMER])),
    db: Session = Depends(get_db),
):
    return CartService.update_item(current_user.id, product_id, payload, db)


@router.delete("/items/{product_id}")
def remove_cart_item(
    product_id: int,
    current_user: AuthUser = Depends(auth_guard([UserRole.CUSTOMER])),
    db: Session = Depends(get_db),
):
    return CartService.remove_item(current_user.id, product_id, db)


@router.delete("")
def clear_cart(
    current_user: AuthUser = Depends(auth_guard([UserRole.CUSTOMER])),
    db: Session = Depends(get_db),
):
    return CartService.clear_cart(current_user.id, db)
