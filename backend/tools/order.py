from sqlalchemy.orm import Session, selectinload

from models import CartItem, Order, OrderItems, Product
from models.order import OrderStatus
from schemas.order import ToolDirectOrderPayload, ToolFilterOrderPayload


class OrderTools:
    @staticmethod
    def analyze_orders(
        customer_id: int | None,
        product_id: int | None,
        db: Session,
    ):
        query = db.query(Order).options(selectinload(Order.items))
        if customer_id is not None:
            query = query.filter(Order.customer_id == customer_id)
        if product_id is not None:
            query = query.join(Order.items).filter(
                OrderItems.product_id == product_id
            ).distinct()

        orders = query.all()
        orders_by_status = {}
        total_items = 0
        for order in orders:
            status = order.status.value if isinstance(
                order.status, OrderStatus) else order.status
            orders_by_status[status] = orders_by_status.get(status, 0) + 1
            total_items += sum(item.quantity for item in order.items)

        total_revenue = sum(float(order.total_price) for order in orders)
        return {
            "customer_id": customer_id,
            "product_id": product_id,
            "order_count": len(orders),
            "total_revenue": total_revenue,
            "average_order_value": total_revenue / len(orders) if orders else 0.0,
            "total_items": total_items,
            "orders_by_status": orders_by_status,
        }

    @staticmethod
    def get_order(order_id: int, db: Session, customer_id: int | None = None):
        query = db.query(Order).options(
            selectinload(Order.items).selectinload(OrderItems.product)
        ).filter(Order.id == order_id)
        if customer_id is not None:
            query = query.filter(Order.customer_id == customer_id)
        return query.first()

    @staticmethod
    def get_orders(
        payload: ToolFilterOrderPayload,
        db: Session,
        customer_id: int | None = None,
    ):
        query = db.query(Order).options(
            selectinload(Order.items).selectinload(OrderItems.product)
        )
        if customer_id is not None:
            query = query.filter(Order.customer_id == customer_id)
        if payload.order_id is not None:
            query = query.filter(Order.id == payload.order_id)
        if payload.customer_id is not None and customer_id is None:
            query = query.filter(Order.customer_id == payload.customer_id)
        if payload.status is not None:
            query = query.filter(Order.status == payload.status)
        if payload.product_ids:
            query = query.join(Order.items).filter(
                OrderItems.product_id.in_(payload.product_ids)
            ).distinct()
        if payload.min_total_price is not None:
            query = query.filter(Order.total_price >= payload.min_total_price)
        if payload.max_total_price is not None:
            query = query.filter(Order.total_price <= payload.max_total_price)
        return query.order_by(Order.created_at.desc()).all()

    @staticmethod
    def create_order(customer_id: int, delivery_address: dict, db: Session):
        cart_items = db.query(CartItem).options(
            selectinload(CartItem.product)
        ).filter(CartItem.user_id == customer_id).all()
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
            order_items.append(OrderItems(
                product_id=product.id,
                quantity=cart_item.quantity,
                per_price=price,
            ))

        order = Order(
            customer_id=customer_id,
            total_price=total_price,
            delivery_address=delivery_address,
            status=OrderStatus.PENDING,
            items=order_items,
        )
        db.add(order)
        for cart_item in cart_items:
            db.delete(cart_item)
        db.commit()
        db.refresh(order)
        return order

    @staticmethod
    def direct_order(
        customer_id: int,
        payload: ToolDirectOrderPayload,
        db: Session,
    ):
        product = db.query(Product).filter(
            Product.id == payload.product_id
        ).first()
        if product is None:
            raise ValueError("Product not found")
        if product.available_stock < payload.quantity:
            raise ValueError("Stock not available")

        price = float(product.main_price)
        product.available_stock -= payload.quantity
        order = Order(
            customer_id=customer_id,
            total_price=price * payload.quantity,
            delivery_address=payload.delivery_address.model_dump(),
            status=OrderStatus.PENDING,
            items=[OrderItems(
                product_id=product.id,
                quantity=payload.quantity,
                per_price=price,
            )],
        )
        db.add(order)
        db.commit()
        db.refresh(order)
        return order
