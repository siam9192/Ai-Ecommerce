import enum
from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, Enum, Integer, String, CheckConstraint
from sqlalchemy.orm import relationship

from database import Base


class UserStatus(str, enum.Enum):
    ACTIVE = "active"
    BLOCKED = "blocked"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, autoincrement=True)
    email = Column(String, unique=True, nullable=False)
    hashed_password = Column(String, nullable=True)
    google_id = Column(String, nullable=True)
    full_name = Column(String(50), nullable=False)
    profile_picture = Column(String, nullable=True)
    status = Column(Enum(UserStatus),
                    default=UserStatus.ACTIVE, nullable=False)
    is_deleted = Column(Boolean, default=False, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
    )
    last_login = Column(DateTime)

    orders = relationship("Order", back_populates="customer",
                          cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="user",
                           cascade="all, delete-orphan")
    cart_items = relationship(
        "CartItem", back_populates="user", cascade="all, delete-orphan")
    wishlist_items = relationship(
        "WishlistItem", back_populates="user", cascade="all, delete-orphan")

    __table_args__ = (
        CheckConstraint(
            """
        (hashed_password IS NULL AND google_id IS NOT NULL)
        OR
        (hashed_password IS NOT NULL AND google_id IS NULL)
        """,
            name="check_auth_method"
        ),
    )
