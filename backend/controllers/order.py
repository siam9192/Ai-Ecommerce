from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from controllers.auth import auth_guard
from database import get_db
from models.users import UserRole
from schemas.order import DeliveryAddress, ToolDirectOrderPayload, ToolFilterOrderPayload
from schemas.utils import AuthUser, PaginationQuery
from services.order import OrderService


router = APIRouter(prefix="/orders", tags=["Orders"])


@router.get("/{order_id}")
def get_order(
    order_id: int,
    current_user: AuthUser = Depends(
        auth_guard([UserRole.CUSTOMER, UserRole.ADMIN])
    ),
    db: Session = Depends(get_db),
):
    return OrderService.get_order(order_id, current_user, db)


@router.get("")
def get_orders(
    payload: ToolFilterOrderPayload = Depends(),
    pagination_query: PaginationQuery = Depends(),
    current_user: AuthUser = Depends(
        auth_guard([UserRole.CUSTOMER, UserRole.ADMIN])
    ),
    db: Session = Depends(get_db),
):
    return OrderService.get_orders(current_user, payload, pagination_query, db)


@router.post("/cart")
def create_order(
    delivery_address: DeliveryAddress,
    current_user: AuthUser = Depends(auth_guard([UserRole.CUSTOMER])),
    db: Session = Depends(get_db),
):
    return OrderService.create_order(current_user.id, delivery_address.model_dump(), db)


@router.post("/direct")
def direct_order(
    customer_id: int,
    payload: ToolDirectOrderPayload,
    current_user: AuthUser = Depends(auth_guard([UserRole.CUSTOMER])),
    db: Session = Depends(get_db),
):
    return OrderService.direct_order(customer_id, payload, db)
