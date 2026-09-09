from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from controllers.auth import auth_guard
from database import get_db
from models.users import UserRole
from schemas.wishlist import AddWishlistItemPayload, RemoveWishlistItemPayload
from schemas.utils import AuthUser
from services.wishlist import WishlistService


router = APIRouter(prefix="/wishlist", tags=["Wishlist"])


@router.get("")
def get_wishlist(
    current_user: AuthUser = Depends(auth_guard([UserRole.CUSTOMER])),
    db: Session = Depends(get_db),
):
    return WishlistService.get_wishlist(current_user.id, db)


@router.get("/items/{product_id}")
def get_wishlist_item(
    product_id: int,
    current_user: AuthUser = Depends(auth_guard([UserRole.CUSTOMER])),
    db: Session = Depends(get_db),
):
    return WishlistService.get_wishlist_item(current_user.id, product_id, db)


@router.post("/items")
def add_wishlist_item(
    payload: AddWishlistItemPayload,
    current_user: AuthUser = Depends(auth_guard([UserRole.CUSTOMER])),
    db: Session = Depends(get_db),
):
    return WishlistService.add_item(current_user.id, payload, db)


@router.delete("/items")
def remove_wishlist_item(
    payload: RemoveWishlistItemPayload,
    current_user: AuthUser = Depends(auth_guard([UserRole.CUSTOMER])),
    db: Session = Depends(get_db),
):
    return WishlistService.remove_item(current_user.id, payload, db)


@router.delete("")
def clear_wishlist(
    current_user: AuthUser = Depends(auth_guard([UserRole.CUSTOMER])),
    db: Session = Depends(get_db),
):
    return WishlistService.clear_wishlist(current_user.id, db)
