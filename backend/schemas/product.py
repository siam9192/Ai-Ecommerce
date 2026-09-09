from typing import List, Optional

from pydantic import BaseModel, Field

from models.product import ProductStatus


class ToolFindProductsPayload(BaseModel):
    max_main_price: Optional[float] = Field(
        default=None,
        ge=0,
        description="Find products whose main/current price is less than or equal to this amount.",
    )
    min_main_price: Optional[float] = Field(
        default=None,
        ge=0,
        description="Find products whose main/current price is greater than or equal to this amount.",
    )
    min_regular_price: Optional[float] = Field(
        default=None,
        ge=0,
        description="Find products whose regular/original price is greater than or equal to this amount.",
    )
    max_regular_price: Optional[float] = Field(
        default=None,
        ge=0,
        description="Find products whose regular/original price is less than or equal to this amount.",
    )
    main_price: Optional[float] = Field(
        default=None,
        ge=0,
        description="Find products with an exact main/current price matching this amount.",
    )
    regular_price: Optional[float] = Field(
        default=None,
        ge=0,
        description="Find products with an exact regular price matching this amount.",
    )
    name: Optional[str] = Field(
        default=None,
        description="Find products with an exact or closely matching product name.",
    )
    name_contains: Optional[str] = Field(
        default=None,
        description="Find products whose name contains this text. Use this for partial product-name searches.",
    )
    description_contains: Optional[str] = Field(
        default=None,
        description="Find products whose description contains or matches this text.",
    )
    category_name: Optional[str] = Field(
        default=None,
        description="Filter products by category. Use the category provided or implied by the user.",
    )
    keyword: Optional[str] = Field(
        default=None,
        description="Search for products related to this keyword or concept. Use this for general product searches when an exact name is not provided.",
    )
    in_stock: Optional[bool] = Field(
        default=None,
        description="Filter products by availability. Set to true for products currently in stock and false for products that are out of stock.",
    )
    limit: Optional[int] = Field(
        default=None, ge=1, description="Filter products limit")
    ids:Optional[list[int]] = Field(
        default=None, ge=1, description="Products ids for filter directly")


class FindProductsPayload(BaseModel):
    max_price: Optional[float] = Field(
        default=None,
        ge=0,
        description="Find products whose main/current price is less than or equal to this amount.",
    )
    min_price: Optional[float] = Field(
        default=None,
        ge=0,
        description="Find products whose main/current price is greater than or equal to this amount.",
    )
    category_name: Optional[str] = Field(
        default=None,
        description="Filter products by category. Use the category provided or implied by the user.",
    )
    keyword: Optional[str] = Field(
        default=None,
        description="Search for products related to this keyword or concept. Use this for general product searches when an exact name is not provided.",
    )
    in_stock: Optional[bool] = Field(
        default=None,
        description="Filter products by availability. Set to true for products currently in stock and false for products that are out of stock.",
    )
   
    

     
    


class AddProductPayload(BaseModel):
    name: str = Field(min_length=1, max_length=200, description="Product name")
    description: str = Field(
        min_length=1, max_length=5000, description="Product description")
    regular_price: float = Field(ge=0, description="Product initial price")
    main_price: float = Field(
        ge=0, description="Product main or current price")
    images: List[str] = Field(default_factory=list,
                              description="Product images url")
    category: str = Field(min_length=1, description="Product category name")
    available_stock: int = Field(
        default=0, ge=0, description="Product current available stock")
    status: Optional[ProductStatus] = Field(
        default=None, description="Product current status")


class UpdateProductPayload(BaseModel):
    name: Optional[str] = Field(
        default=None, min_length=1, max_length=200, description="Product name")
    description: Optional[str] = Field(
        default=None, min_length=1, max_length=5000, description="Product description")
    regular_price: Optional[float] = Field(
        default=None, ge=0, description="Product initial price")
    main_price: Optional[float] = Field(
        default=None, ge=0, description="Product main or current price")
    images: Optional[List[str]] = Field(
        default=None, description="Product images url")
    category: Optional[str] = Field(
        default=None, min_length=1, description="Product category name")
    available_stock: Optional[int] = Field(
        default=None, ge=0, description="Product current available stock")
    status: Optional[ProductStatus] = Field(
        default=None, description="Product current status")
