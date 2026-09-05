from sqlalchemy.orm import Session, selectinload

from models import CartItem, Order, OrderItems


class OrderService:
    @staticmethod
    def get_order(order_id: int, customer_id: int, db: Session):
        return (
            db.query(Order)
            .options(selectinload(Order.items).selectinload(OrderItems.product))
            .filter(Order.id == order_id, Order.customer_id == customer_id)
            .first()
        )

    @staticmethod
    def get_orders(customer_id: int, db: Session):
        return (
            db.query(Order)
            .options(selectinload(Order.items).selectinload(OrderItems.product))
            .filter(Order.customer_id == customer_id)
            .order_by(Order.created_at.desc())
            .all()
        )

    @staticmethod
    def create_order(customer_id: int, delivery_address: dict | None, db: Session):
        cart_items = (
            db.query(CartItem)
            .options(selectinload(CartItem.product))
            .filter(CartItem.user_id == customer_id)
            .all()
        )
        if not cart_items:
            raise ValueError("Cart is empty")

        order_items = []
        total_price = 0.0
        for cart_item in cart_items:
            product = cart_item.product
            if product is None:
                raise ValueError("Product not found")
            if product.available_stock < cart_item.quantity:
                raise ValueError(
                    f"Insufficient stock for product {product.id}")

            price = float(product.main_price)
            total_price += price * cart_item.quantity
            product.available_stock -= cart_item.quantity
            order_items.append(
                OrderItems(
                    product_id=product.id,
                    quantity=cart_item.quantity,
                    per_price=price,
                )
            )

        order = Order(
            customer_id=customer_id,
            total_price=total_price,
            delivery_address=delivery_address,
            items=order_items,
        )
        db.add(order)
        for cart_item in cart_items:
            db.delete(cart_item)
        db.commit()
        db.refresh(order)
        return order
