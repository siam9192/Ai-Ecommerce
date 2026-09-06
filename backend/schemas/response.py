from typing import Literal, Optional
from pydantic import BaseModel, Field
from typing import Literal, Optional, Any
from pydantic import BaseModel, Field
from models.product import ProductStatus
from datetime import datetime


class AIActions(BaseModel):
    client_navigate_to: Optional[str] = Field(
        default=None,
        description="Route the client should navigate to, if required."
    )

    product_search_results: list[Any] = Field(
        default_factory=list,
        description="Products returned from a product search."
    )

    client_logout: bool = Field(
        default=False,
        description="Whether the client should log out."
    )

    cart_update: bool = Field(
        default=False,
        description="Whether the cart was successfully updated."
    )

    product_update: bool = Field(
        default=False,
        description="Whether a product was successfully updated."
    )

    review_update: bool = Field(
        default=False,
        description="Whether a review was successfully updated."
    )

    user_update: bool = Field(
        default=False,
        description="Whether a user was successfully updated."
    )


class AIFinalResponse(BaseModel):
    """Final response that will be shown directly to the user."""

    message: str = Field(
        description="Concise, natural-language response to show to the user."
    )

    status: Literal["success", "error", "partial", "info"] = Field(
        description="Overall result of the requested operation."
    )

    summary: Optional[str] = Field(
        default=None,
        description="Short summary of what was done."
    )

    actions: AIActions = Field(
        default_factory=AIActions,
        description="Actions that the frontend/client should perform."
    )


class ProductResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    regular_price: int
    main_price: int
    images: list[str]
    available_stock: int
    status: ProductStatus
    created_at: datetime
    updated_at: datetime
    wish_listed: Optional[bool]
    cart_item_listed: Optional[bool]


class __Customer(BaseModel):
    id: int
    name: str
    profile_picture: Optional[str]


class __Product(BaseModel):
    id: int
    name: str
    images: list[str]


class __OrderItems(BaseModel):
    id: int
    product_id: int
    product: __Product
    quantity: int
    per_price: float


class OrderResponse(BaseModel):
    id: int
    customer_id: int
    total_price: float
    delivery_address: dict
    status: str
    created_at: datetime
    updated_at: datetime
    customer: Optional[__Customer]
    items: list[__OrderItems]
