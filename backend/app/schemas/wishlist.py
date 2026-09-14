from pydantic import BaseModel, Field


class AddWishlistItemPayload(BaseModel):
    product_id: int = Field(..., gt=0,
                            description="Product to add to wishlist")


class RemoveWishlistItemPayload(BaseModel):
    product_id: int = Field(..., gt=0,
                            description="Product to remove from wishlist")
