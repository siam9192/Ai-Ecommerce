from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from controllers.auth import auth_guard
from database import get_db
from schemas.product import AddProductPayload, FindProductsPayload, UpdateProductPayload
from models.users import UserRole
from schemas.utils import AuthUser, PaginationQuery
from services.product import ProductsService


router = APIRouter(prefix="/products", tags=["Products"])


@router.get("")
def find_products(
    payload: FindProductsPayload = Depends(),
    pagination_query: PaginationQuery = Depends(),
    db: Session = Depends(get_db),
    current_user: AuthUser = Depends(
        auth_guard([UserRole.CUSTOMER, UserRole.ADMIN])
    ),
):
    return ProductsService.find_products(payload, pagination_query, db, current_user)


@router.get("/slug/{slug}")
def find_product_by_slug(
    slug: str,
    db: Session = Depends(get_db),
    current_user: AuthUser = Depends(
        auth_guard([UserRole.CUSTOMER, UserRole.ADMIN])
    ),
):
    return ProductsService.find_product_by_slug(slug, db, current_user)


@router.post("")
def add_product(
    payload: AddProductPayload,
    current_user: AuthUser = Depends(auth_guard([UserRole.ADMIN])),
    db: Session = Depends(get_db),
):
    return ProductsService.add_product(payload, db)


@router.patch("/{product_id}")
def update_product(
    product_id: int,
    payload: UpdateProductPayload,
    current_user: AuthUser = Depends(auth_guard([UserRole.ADMIN])),
    db: Session = Depends(get_db),
):
    return ProductsService.update_product(product_id, payload, db)


@router.delete("/{product_id}")
def delete_product(
    product_id: int,
    current_user: AuthUser = Depends(auth_guard([UserRole.ADMIN])),
    db: Session = Depends(get_db),
):
    return ProductsService.soft_delete_product(product_id, db)
