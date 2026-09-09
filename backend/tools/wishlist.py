from sqlalchemy.orm import Session

from models import Product, User, WishlistItem
from schemas.wishlist import AddWishlistItemPayload, RemoveWishlistItemPayload


class WishlistTools:
    @staticmethod
    def get_wishlist(user_id: int, db: Session):
        return db.query(WishlistItem).filter(WishlistItem.user_id == user_id).order_by(WishlistItem.created_at.desc()).all()

    @staticmethod
    def get_wishlist_item(user_id: int, product_id: int, db: Session):
        return (
            db.query(WishlistItem)
            .filter(WishlistItem.user_id == user_id, WishlistItem.product_id == product_id)
            .first()
        )

    @staticmethod
    def add_item(user_id: int, payload: AddWishlistItemPayload, db: Session):
        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            raise ValueError("User not found")

        product = db.query(Product).filter(
            Product.id == payload.product_id).first()
        if product is None:
            raise ValueError("Product not found")

        existing = WishlistTools.get_wishlist_item(
            user_id, payload.product_id, db)
        if existing is not None:
            return existing

        wishlist_item = WishlistItem(
            user_id=user_id,
            product_id=payload.product_id,
        )
        db.add(wishlist_item)
        db.commit()
        db.refresh(wishlist_item)
        return wishlist_item

    @staticmethod
    def remove_item(user_id: int, payload: RemoveWishlistItemPayload, db: Session):
        wishlist_item = WishlistTools.get_wishlist_item(
            user_id, payload.product_id, db)
        if wishlist_item is None:
            return False

        db.delete(wishlist_item)
        db.commit()
        return True

    @staticmethod
    def clear_wishlist(user_id: int, db: Session):
        deleted = db.query(WishlistItem).filter(
            WishlistItem.user_id == user_id).delete()
        db.commit()
        return deleted > 0
