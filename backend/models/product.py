from datetime import datetime

import enum

from sqlalchemy import Boolean, CheckConstraint, Column, DateTime, Enum, Float, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from database import Base


class ProductStatus(str, enum.Enum):
    RUNNING = "running"
    PAUSED = "paused"


class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(200), nullable=False)
    description = Column(String(5000), nullable=False)
    slug = Column(String, nullable=False, unique=True)
    regular_price = Column(Float, nullable=False)
    main_price = Column(Float, nullable=False)
    category = Column(String(100), nullable=False)

    available_stock = Column(Integer, default=0, nullable=False)
    rating = Column(Integer, default=0)
    status = Column(Enum(ProductStatus),
                    default=ProductStatus.RUNNING, nullable=False)
    is_deleted = Column(Boolean, default=False, nullable=False)

    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    images = relationship(
        "ProductImages", back_populates="product", cascade="all, delete-orphan")
    reviews = relationship(
        "Review", back_populates="product", cascade="all, delete-orphan")
    order_items = relationship("OrderItems", back_populates="product")
    cart_items = relationship("CartItem", back_populates="product")
    wishlist_items = relationship("WishlistItem", back_populates="product")

    __table_args__ = (
        CheckConstraint(
            "regular_price > main_price",
            name="check_regular_price_greater_than_main"
        ),
        CheckConstraint(
            "rating >= 0 AND rating <= 5",
            name="check_rating_range"
        ),
    )


class ProductImages(Base):
    __tablename__ = "product_images"

    id = Column(Integer, primary_key=True, autoincrement=True)
    image_url = Column(String, nullable=False)
    product_id = Column(Integer, ForeignKey("products.id"), nullable=False)

    product = relationship("Product", back_populates="images")


ProductImage = ProductImages
