from sqlalchemy.orm import Session

from models import Product, User, WishlistItem
from schemas.wishlist import AddWishlistItemPayload, RemoveWishlistItemPayload


class WishlistService:
    @staticmethod
    def get_wishlist(user_id: int, db: Session):
        return (
            db.query(WishlistItem)
            .filter(WishlistItem.user_id == user_id)
            .order_by(WishlistItem.created_at.desc())
            .all()
        )

    @staticmethod
    def get_wishlist_item(user_id: int, product_id: int, db: Session):
        return (
            db.query(WishlistItem)
            .filter(WishlistItem.user_id == user_id, WishlistItem.product_id == product_id)
            .first()
        )

    @staticmethod
    def add_item(payload: AddWishlistItemPayload, db: Session):
        if db.query(User).filter(User.id == payload.user_id).first() is None:
            raise ValueError("User not found")
        if db.query(Product).filter(Product.id == payload.product_id).first() is None:
            raise ValueError("Product not found")

        item = WishlistService.get_wishlist_item(
            payload.user_id, payload.product_id, db)
        if item is not None:
            return item

        item = WishlistItem(user_id=payload.user_id,
                            product_id=payload.product_id)
        db.add(item)
        db.commit()
        db.refresh(item)
        return item

    @staticmethod
    def remove_item(payload: RemoveWishlistItemPayload, db: Session):
        item = WishlistService.get_wishlist_item(
            payload.user_id, payload.product_id, db)
        if item is None:
            return False
        db.delete(item)
        db.commit()
        return True

    @staticmethod
    def clear_wishlist(user_id: int, db: Session):
        deleted = db.query(WishlistItem).filter(
            WishlistItem.user_id == user_id).delete()
        db.commit()
        return deleted > 0
