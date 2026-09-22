from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.controllers.auth import auth_guard
from app.database import get_db
from app.schemas.product import AddProductPayload, FindProductsPayload, UpdateProductPayload
from app.models.users import UserRole
from app.schemas.utils import AuthUser, PaginationQuery
from app.services.product import ProductsService
from app.controllers.auth import get_optional_current_user

router = APIRouter(prefix="/products", tags=["Products"])


@router.get("")
def find_products(
    payload: FindProductsPayload = Depends(),
    pagination_query: PaginationQuery = Depends(),
    db: Session = Depends(get_db),
    current_user: AuthUser = Depends(
        get_optional_current_user
    ),
):
    return ProductsService.find_products(payload, pagination_query, db, current_user)


@router.get("/featured")
def find_featured_products(
    pagination_query: PaginationQuery = Depends(),
    db: Session = Depends(get_db),
    current_user: AuthUser = Depends(get_optional_current_user),
):
    return ProductsService.find_featured_products(
        pagination_query, db, current_user
    )


@router.get("/slug/{slug}")
def find_product_by_slug(
    slug: str,
    db: Session = Depends(get_db),
    current_user: AuthUser = Depends(
      get_optional_current_user
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


@router.put("/{product_id}")
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
