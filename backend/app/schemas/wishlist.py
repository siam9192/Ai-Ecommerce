from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.response import ProductResponse


class AddWishlistItemPayload(BaseModel):
    product_id: int = Field(..., gt=0,
                            description="Product to add to wishlist")


class RemoveWishlistItemPayload(BaseModel):
    product_id: int = Field(..., gt=0,
                            description="Product to remove from wishlist")


class WishlistItemWithProductResponse(BaseModel):
    id: int
    user_id: int
    product_id: int
    created_at: datetime
    updated_at: datetime
    product: ProductResponse
