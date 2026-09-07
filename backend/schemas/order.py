from pydantic import BaseModel, Field
from typing import Optional
from models.order import OrderStatus
from datetime import datetime


class DeliveryAddress(BaseModel):
    street: str = Field(
        description="Street address, house number, road name, or other detailed location information."
    )
    city: str = Field(
        description="City or town where the order should be delivered."
    )
    state: str = Field(
        description="State, division, or administrative region where the order should be delivered."
    )


class ToolDirectOrderPayload(BaseModel):
    product_id: int = Field(
        description="The unique ID of the product the customer wants to order."
    )
    delivery_address: DeliveryAddress = Field(
        description="The customer's complete delivery address where the order should be delivered."
    )
    quantity: int = Field(
        description="The number of units of the product the customer wants to purchase. Must be a positive integer.",
        gt=0,
    )


class ToolFilterOrderPayload(BaseModel):
    product_ids: Optional[list[int]] = Field(
        default=None,
        description="List of product IDs. Returns orders that contain at least one of these products."
    )

    min_total_price: Optional[float] = Field(
        default=None,
        ge=0,
        description="Minimum total price of the order."
    )

    max_total_price: Optional[float] = Field(
        default=None,
        ge=0,
        description="Maximum total price of the order."
    )

    customer_id: Optional[int] = Field(
        default=None,
        description="Unique ID of the customer who placed the order."
    )
    status: Optional[OrderStatus] = Field(
        default=None,
        description="Filter orders by their current status. Only orders matching the specified status will be returned."
    )
    order_id: Optional[int] = Field(
        default=None,
        description="Unique ID of the order to retrieve."
    )
