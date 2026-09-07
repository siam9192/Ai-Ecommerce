from sqlalchemy.orm import Session
from fastapi import status

from models import Product, User, WishlistItem
from schemas.wishlist import AddWishlistItemPayload, RemoveWishlistItemPayload
from schemas.utils import Response


class WishlistService:
    @staticmethod
    def get_wishlist(user_id: int, db: Session):
        wishlist = (
            db.query(WishlistItem)
            .filter(WishlistItem.user_id == user_id)
            .order_by(WishlistItem.created_at.desc())
            .all()
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
    def add_item(payload: AddWishlistItemPayload, db: Session):
        if db.query(User).filter(User.id == payload.user_id).first() is None:
            raise ValueError("User not found")
        if db.query(Product).filter(Product.id == payload.product_id).first() is None:
            raise ValueError("Product not found")

        item = (
            db.query(WishlistItem)
            .filter(
                WishlistItem.user_id == payload.user_id,
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

        item = WishlistItem(user_id=payload.user_id,
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
    def remove_item(payload: RemoveWishlistItemPayload, db: Session):
        item_response = WishlistService.get_wishlist_item(
            payload.user_id, payload.product_id, db)
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
