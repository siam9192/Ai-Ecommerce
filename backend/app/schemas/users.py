from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models.users import UserRole, UserStatus


class RegisterPayload(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)
    full_name: str = Field(min_length=1, max_length=50)
    role: Optional[UserRole] = Field(default=UserRole.CUSTOMER)


class LoginPayload(BaseModel):
    email: EmailStr
    password: str


class UpdateUserPayload(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(default=None, min_length=1, max_length=50)
    profile_picture: Optional[str] = None


class FindUsersPayload(BaseModel):
    email: Optional[EmailStr] = None


class ToolFindUsersPayload(BaseModel):
    search: Optional[str] = Field(
        default=None,
        min_length=1,
        max_length=100,
        description="Search customer names or emails",
    )
    email: Optional[EmailStr] = None
    status: Optional[UserStatus] = None
    limit: int = Field(default=20, ge=1, le=100)


class ToolUpdateUserPayload(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(default=None, min_length=1, max_length=50)
    status: Optional[UserStatus] = None


class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    full_name: str
    profile_picture: Optional[str] = None
    role: UserRole
    status: UserStatus
    created_at: datetime
    updated_at: datetime
