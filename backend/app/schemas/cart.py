from typing import Optional

from pydantic import BaseModel, Field


class AddCartItemPayload(BaseModel):
    product_id: int = Field(..., gt=0, description="Product to add to cart")
    quantity: int = Field(default=1, ge=1, description="Quantity to add")


class UpdateCartItemPayload(BaseModel):
    quantity: Optional[int] = Field(
        default=None, ge=1, description="Updated cart quantity")
