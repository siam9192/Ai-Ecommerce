from typing import Optional, TypeVar, Generic, Any
from fastapi.encoders import jsonable_encoder
from pydantic import BaseModel, Field, field_serializer
from app.models.users import UserRole


class PaginationQuery (BaseModel):
    limit: Optional[int] = Field(default=10, description="Data limit")
    page: Optional[int] = Field(default=1, description="Data limit")
    sort_order: Optional[str] = Field(
        default="asc", description="Must be asc or desc")
    sort_by: Optional[str] = Field(default=None, description="Sort field name")
    skip: Optional[int] = Field(
        default=None, description="How many data to skip")


T = TypeVar("T")


class Meta(BaseModel):
    skip: int
    limit: int
    page: int
    total: int


class Response(BaseModel, Generic[T]):
    message: Optional[str] = None
    success: bool
    status_code: int
    data: T
    meta: Optional[Meta] = None

    @field_serializer("data", mode="plain")
    def serialize_data(self, data: T) -> Any:
        return jsonable_encoder(data)


class AuthUser (BaseModel):
    id: int
    role: UserRole
