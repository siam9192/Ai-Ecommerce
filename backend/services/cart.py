from sqlalchemy.orm import Session
from fastapi import HTTPException,status
from models import CartItem, Product, User
from schemas.cart import AddCartItemPayload, UpdateCartItemPayload


class CartService:
    @staticmethod
    def get_cart(user_id: int, db: Session):
        return (
            db.query(CartItem)
            .filter(CartItem.user_id == user_id)
            .order_by(CartItem.created_at.desc())
            .all()
        )

    @staticmethod
    def get_cart_item(user_id: int, product_id: int, db: Session):
        return (
            db.query(CartItem)
            .filter(CartItem.user_id == user_id, CartItem.product_id == product_id)
            .first()
        )

    @staticmethod
    def add_item(payload: AddCartItemPayload, db: Session):
    
        if db.query(Product).filter(Product.id == payload.product_id).first() is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Product not found")

        item = CartService.get_cart_item(
            payload.user_id, payload.product_id, db)
        if item is None:
            item = CartItem(
                user_id=payload.user_id,
                product_id=payload.product_id,
                quantity=payload.quantity,
            )
            db.add(item)
        else:
            item.quantity += payload.quantity

        db.commit()
        db.refresh(item)
        return item

    @staticmethod
    def update_item(user_id: int, product_id: int, payload: UpdateCartItemPayload, db: Session):
        item = CartService.get_cart_item(user_id, product_id, db)
        if item is None:
            return None
        if payload.quantity is not None:
            item.quantity = payload.quantity
        db.commit()
        db.refresh(item)
        return item

    @staticmethod
    def remove_item(user_id: int, product_id: int, db: Session):
        item = CartService.get_cart_item(user_id, product_id, db)
        if item is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,detail="Item not found")
        db.delete(item)
        db.commit()
        return True

    @staticmethod
    def clear_cart(user_id: int, db: Session):
        deleted = db.query(CartItem).filter(
            CartItem.user_id == user_id).delete()
        db.commit()
        return deleted > 0
