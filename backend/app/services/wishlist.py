from sqlalchemy.orm import Session, selectinload
from fastapi import status

from app.models import CartItem, Product, User, WishlistItem
from app.models.product import ProductStatus
from app.schemas.response import ProductResponse
from app.schemas.wishlist import (
    AddWishlistItemPayload,
    RemoveWishlistItemPayload,
    WishlistItemWithProductResponse,
)
from app.schemas.utils import Response


class WishlistService:
    @staticmethod
    def get_wishlist(user_id: int, db: Session):
        wishlist_items = (
            db.query(WishlistItem)
            .join(WishlistItem.product)
            .filter(
                WishlistItem.user_id == user_id,
                Product.is_deleted.is_(False),
                Product.status == ProductStatus.ACTIVE,
            )
            .order_by(WishlistItem.created_at.desc())
            .options(
                selectinload(WishlistItem.product).selectinload(Product.images)
            )
            .all()
        )
        product_ids = [item.product.id for item in wishlist_items]
        cart_product_ids = set()
        if product_ids:
            cart_product_ids = {
                product_id
                for (product_id,) in db.query(CartItem.product_id)
                .filter(
                    CartItem.user_id == user_id,
                    CartItem.product_id.in_(product_ids),
                )
                .all()
            }

        wishlist = []
        for item in wishlist_items:
            product = item.product
            wishlist.append(
                WishlistItemWithProductResponse(
                    id=item.id,
                    user_id=item.user_id,
                    product_id=product.id,
                    created_at=item.created_at,
                    updated_at=item.updated_at,
                    product=ProductResponse(
                        id=product.id,
                        name=product.name,
                        slug=product.slug,
                        description=product.description[:100],
                        category=product.category,
                        regular_price=product.regular_price,
                        main_price=product.main_price,
                        images=[image.image_url for image in product.images],
                        available_stock=product.available_stock,
                        status=product.status,
                        created_at=product.created_at,
                        updated_at=product.updated_at,
                        wish_listed=True,
                        cart_item_listed=product.id in cart_product_ids,
                    ),
                )
            )
        return Response(
            success=True,
            status_code=status.HTTP_200_OK,
            message="Wishlist retrieved successfully",
            data=wishlist,
        )

    @staticmethod
    def get_wishlist_item(user_id: int, product_id: int, db: Session):
        item = (
            db.query(WishlistItem)
            .filter(WishlistItem.user_id == user_id, WishlistItem.product_id == product_id)
            .first()
        )
        return Response(
            success=item is not None,
            status_code=status.HTTP_200_OK if item is not None else status.HTTP_404_NOT_FOUND,
            message="Wishlist item retrieved successfully" if item is not None else "Wishlist item not found",
            data=item,
        )

    @staticmethod
    def add_item(user_id: int, payload: AddWishlistItemPayload, db: Session):
        if db.query(User).filter(User.id == user_id).first() is None:
            raise ValueError("User not found")
        if db.query(Product).filter(Product.id == payload.product_id).first() is None:
            raise ValueError("Product not found")

        item = (
            db.query(WishlistItem)
            .filter(
                WishlistItem.user_id == user_id,
                WishlistItem.product_id == payload.product_id,
            )
            .first()
        )
        if item is not None:
            return Response(
                success=True,
                status_code=status.HTTP_200_OK,
                message="Product is already in the wishlist",
                data=item,
            )

        item = WishlistItem(user_id=user_id,
                            product_id=payload.product_id)
        db.add(item)
        db.commit()
        db.refresh(item)
        return Response(
            success=True,
            status_code=status.HTTP_200_OK,
            message="Wishlist item added successfully",
            data=item,
        )

    @staticmethod
    def remove_item(user_id: int, payload: RemoveWishlistItemPayload, db: Session):
        item_response = WishlistService.get_wishlist_item(
            user_id, payload.product_id, db)
        if item_response.data is None:
            return Response(
                success=False,
                status_code=status.HTTP_404_NOT_FOUND,
                message="Wishlist item not found",
                data=False,
            )
        db.delete(item_response.data)
        db.commit()
        return Response(
            success=True,
            status_code=status.HTTP_200_OK,
            message="Wishlist item removed successfully",
            data=True,
        )

    @staticmethod
    def clear_wishlist(user_id: int, db: Session):
        deleted = db.query(WishlistItem).filter(
            WishlistItem.user_id == user_id).delete()
        db.commit()
        return Response(
            success=True,
            status_code=status.HTTP_200_OK,
            message="Wishlist cleared successfully",
            data=deleted > 0,
        )
