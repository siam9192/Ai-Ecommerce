from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from models.users import UserRole, UserStatus


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
