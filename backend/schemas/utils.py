from pydantic import BaseModel, Field
from typing import Optional, TypeVar, Generic, Any
from models.users import UserRole

class PaginationQuery (BaseModel):
    limit: Optional[int] = Field(default=10, description="Data limit")
    page: Optional[int] = Field(default=1, description="Data limit")
    sort_order: Optional[str] = Field(
        default="asc", description="Must be asc or desc")
    sort_by: Optional[str] = Field(description="Sort field name")
    skip: Optional[int] = Field(description="How many data to skip")


T = TypeVar("T")


class Meta(BaseModel):
    skip: int
    limit: int
    page: int
    total: int


class Response(BaseModel, Generic[T]):
    message:Optional[str]
    success: bool
    status_code: int
    data: T
    meta: Optional[Meta]


class AuthUser (BaseModel):
    id:str
    role:UserRole