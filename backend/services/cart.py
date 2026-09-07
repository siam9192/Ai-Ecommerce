from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models import CartItem, Product, User
from schemas.cart import AddCartItemPayload, UpdateCartItemPayload
from schemas.utils import Response


class CartService:
    @staticmethod
    def get_cart(user_id: int, db: Session):
        cart = (
            db.query(CartItem)
            .filter(CartItem.user_id == user_id)
            .order_by(CartItem.created_at.desc())
            .all()
        )
        return Response(
            success=True,
            status_code=status.HTTP_200_OK,
            message="Cart retrieved successfully",
            data=cart,
        )

    @staticmethod
    def get_cart_item(user_id: int, product_id: int, db: Session):
        item = (
            db.query(CartItem)
            .filter(CartItem.user_id == user_id, CartItem.product_id == product_id)
            .first()
        )
        return Response(
            success=item is not None,
            status_code=status.HTTP_200_OK if item is not None else status.HTTP_404_NOT_FOUND,
            message="Cart item retrieved successfully" if item is not None else "Cart item not found",
            data=item,
        )

    @staticmethod
    def add_item(user_id:int,payload: AddCartItemPayload, db: Session):

        if db.query(Product).filter(Product.id == payload.product_id).first() is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")

        item = (
            db.query(CartItem)
            .filter(
                CartItem.user_id == user_id,
                CartItem.product_id == payload.product_id,
            )
            .first()
        )
        if item is None:
            item = CartItem(
                user_id=user_id,
                product_id=payload.product_id,
                quantity=payload.quantity,
            )
            db.add(item)
        else:
            item.quantity += payload.quantity

        db.commit()
        db.refresh(item)
        return Response(
            success=True,
            status_code=status.HTTP_200_OK,
            message="Cart item added successfully",
            data=item,
        )

    @staticmethod
    def update_item(user_id: int, product_id: int, payload: UpdateCartItemPayload, db: Session):
        item_response = CartService.get_cart_item(user_id, product_id, db)
        item = item_response.data
        if item is None:
            return Response(
                success=False,
                status_code=status.HTTP_404_NOT_FOUND,
                message="Cart item not found",
                data=None,
            )
        if payload.quantity is not None:
            item.quantity = payload.quantity
        db.commit()
        db.refresh(item)
        return Response(
            success=True,
            status_code=status.HTTP_200_OK,
            message="Cart item updated successfully",
            data=item,
        )

    @staticmethod
    def remove_item(user_id: int, product_id: int, db: Session):
        item_response = CartService.get_cart_item(user_id, product_id, db)
        item = item_response.data
        if item is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
        db.delete(item)
        db.commit()
        return Response(
            success=True,
            status_code=status.HTTP_200_OK,
            message="Cart item removed successfully",
            data=True,
        )

    @staticmethod
    def clear_cart(user_id: int, db: Session):
        deleted = db.query(CartItem).filter(
            CartItem.user_id == user_id).delete()
        db.commit()
        return Response(
            success=True,
            status_code=status.HTTP_200_OK,
            message="Cart cleared successfully",
            data=deleted > 0,
        )
