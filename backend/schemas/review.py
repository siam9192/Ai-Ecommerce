from typing import Optional

from pydantic import BaseModel, Field


class AddReviewPayload(BaseModel):
    product_id: int = Field(..., gt=0, description="Product being reviewed")
    rating: int = Field(..., ge=1, le=5,
                        description="Review rating from 1 to 5")
    comment: Optional[str] = Field(
        default=None, max_length=2000, description="Optional review comment")


class UpdateReviewPayload(BaseModel):
    rating: Optional[int] = Field(
        default=None, ge=1, le=5, description="Updated review rating")
    comment: Optional[str] = Field(
        default=None, max_length=2000, description="Updated review comment")
