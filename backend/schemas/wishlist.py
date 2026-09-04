from pydantic import BaseModel, Field


class AddWishlistItemPayload(BaseModel):
    user_id: int = Field(..., gt=0,
                         description="User who owns the wishlist item")
    product_id: int = Field(..., gt=0,
                            description="Product to add to wishlist")


class RemoveWishlistItemPayload(BaseModel):
    user_id: int = Field(..., gt=0,
                         description="User owning the wishlist item")
    product_id: int = Field(..., gt=0,
                            description="Product to remove from wishlist")
