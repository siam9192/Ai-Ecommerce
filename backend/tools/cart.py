from sqlalchemy.orm import Session

from models import CartItem, Product, User
from schemas.cart import AddCartItemPayload, UpdateCartItemPayload


class CartTools:

    def get_cart(user_id: int, db: Session):
        return db.query(CartItem).filter(CartItem.user_id == user_id).order_by(CartItem.created_at.desc()).all()

    def get_cart_item(user_id: int, product_id: int, db: Session):
        return (
            db.query(CartItem)
            .filter(CartItem.user_id == user_id, CartItem.product_id == product_id)
            .first()
        )

    def add_item(user_id: int, payload: AddCartItemPayload, db: Session):
        user = db.query(User).filter(User.id == user_id).first()
        if user is None:
            raise ValueError("User not found")

        product = db.query(Product).filter(
            Product.id == payload.product_id).first()
        if product is None:
            raise ValueError("Product not found")

        existing = CartTools.get_cart_item(user_id, payload.product_id, db)
        if existing is not None:
            existing.quantity += payload.quantity
            db.commit()
            db.refresh(existing)
            return existing

        cart_item = CartItem(
            user_id=user_id,
            product_id=payload.product_id,
            quantity=payload.quantity,
        )
        db.add(cart_item)
        db.commit()
        db.refresh(cart_item)
        return cart_item

    def update_item(user_id: int, product_id: int, payload: UpdateCartItemPayload, db: Session):
        cart_item = CartTools.get_cart_item(user_id, product_id, db)
        if cart_item is None:
            return None

        if payload.quantity is not None:
            cart_item.quantity = payload.quantity

        db.commit()
        db.refresh(cart_item)
        return cart_item

    def remove_item(user_id: int, product_id: int, db: Session):
        cart_item = CartTools.get_cart_item(user_id, product_id, db)
        if cart_item is None:
            return False

        db.delete(cart_item)
        db.commit()
        return True

    def clear_cart(user_id: int, db: Session):
        deleted = db.query(CartItem).filter(
            CartItem.user_id == user_id).delete()
        db.commit()
        return deleted > 0
