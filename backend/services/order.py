from sqlalchemy.orm import Session, selectinload
from models import CartItem, Order, OrderItems, Product
from fastapi import HTTPException, status
from schemas.order import ToolDirectOrderPayload, ToolFilterOrderPayload
from schemas.utils import AuthUser, PaginationQuery
from models.users import UserRole
from schemas.utils import Response, Meta
from schemas.response import OrderResponse, OrderItemResponse, ProductResponseItem


class OrderService:
    @staticmethod
    def get_order(order_id: int, current_user: AuthUser, db: Session):
        query = (db.query(Order)
                 .options(selectinload(Order.customer), selectinload(Order.items).selectinload(OrderItems.product).selectinload(Product.images)).first(Order.id == order_id)
                 )

        # Customers can only see their own orders
        if current_user.role == UserRole.CUSTOMER:
            query = query.filter(Order.customer_id == current_user.id)

        order = query.first()

        if order is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Order not found")

        order = OrderResponse(
            id=order.id,
            customer_id=order.customer_id,
            customer=(
                {
                    "id": order.customer.id,
                    "name": order.customer.full_name,
                    "profile_picture": order.customer.profile_picture,
                }
                if order.customer is not None
                else None
            ),
            total_price=order.total_price,
            delivery_address=order.delivery_address,
            items=[
                OrderItemResponse(
                    id=order_item.id,
                    product_id=order_item.product_id,
                    quantity=order_item.quantity,
                    per_price=order_item.per_price,
                    product=ProductResponseItem(
                        id=order_item.product.id,
                        name=order_item.product.name,
                        images=[
                            image.image_url for image in order_item.product.images],
                    ),
                )
                for order_item in order.items
            ],
            status=order.status,
            created_at=order.created_at,
            updated_at=order.updated_at
        )

        return Response(
            success=True,
            status_code=status.HTTP_200_OK,
            message="Order retrieved successfully",
            data=order,
        )

    @staticmethod
    def get_orders(
        current_user: AuthUser,
        payload: ToolFilterOrderPayload,
        pagination_query: PaginationQuery,
        db: Session,
    ):
        query = (
            db.query(Order)
            .options(
                selectinload(Order.customer),
                selectinload(Order.items)
                .selectinload(OrderItems.product)
                .selectinload(Product.images),
            )
        )

        # Customers can only see their own orders
        if current_user.role == UserRole.CUSTOMER:
            query = query.filter(Order.customer_id == current_user.id)

        # Filter by order ID
        if payload.order_id is not None:
            query = query.filter(Order.id == payload.order_id)

        # Filter by customer
        if payload.customer_id is not None:
            query = query.filter(Order.customer_id == payload.customer_id)

        # Filter by status
        if payload.status is not None:
            query = query.filter(Order.status == payload.status)

        # Filter by product IDs
        if payload.product_ids:
            query = query.join(Order.items).filter(
                OrderItems.product_id.in_(payload.product_ids)
            ).distinct()

        # Price range
        if payload.min_total_price is not None:
            query = query.filter(Order.total_price >= payload.min_total_price)

        if payload.max_total_price is not None:
            query = query.filter(Order.total_price <= payload.max_total_price)

        page = max(pagination_query.page or 1, 1)
        limit = max(pagination_query.limit or 10, 1)
        skip = (page - 1) * limit
        sort_by = pagination_query.sort_by
        sort_order = (pagination_query.sort_order or "asc").lower()

        # Total count before pagination
        count = query.count()

        # Sorting
        sort_column = None

        if sort_by:
            sort_column = getattr(Order, sort_by, None)

        if sort_column is not None:
            if sort_order == "desc":
                query = query.order_by(sort_column.desc())
            else:
                query = query.order_by(sort_column.asc())
        else:
            query = query.order_by(Order.created_at.desc())

        # Pagination + eager loading
        orders = (
            query.limit(limit)
            .offset(skip)
            .all()
        )

        orders = [
            OrderResponse(
                id=order.id,
                customer_id=order.customer_id,
                customer=(
                    {
                        "id": order.customer.id,
                        "name": order.customer.full_name,
                        "profile_picture": order.customer.profile_picture,
                    }
                    if order.customer is not None
                    else None
                ),
                total_price=order.total_price,
                delivery_address=order.delivery_address,
                items=[
                    __OrderItems(
                        id=order_item.id,
                        product_id=order_item.product_id,
                        quantity=order_item.quantity,
                        per_price=order_item.per_price,
                        product=__Product(
                            id=order_item.product.id,
                            name=order_item.product.name,
                            images=[
                                image.image_url for image in order_item.product.images],
                        ),
                    )
                    for order_item in order.items
                ],
                status=order.status,
                created_at=order.created_at,
                updated_at=order.updated_at
            )
            for order in orders
        ]

        return Response(
            success=True,
            status_code=status.HTTP_200_OK,
            message="Orders retrieved successfully",
            data=orders,
            meta=Meta(
                page=page,
                skip=skip,
                limit=limit,
                total=count
            )
        )

    @staticmethod
    def create_order(customer_id: int, delivery_address: dict, db: Session):
        cart_items = (
            db.query(CartItem)
            .options(selectinload(CartItem.product))
            .filter(CartItem.user_id == customer_id)
            .all()
        )
        if not cart_items:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Cart is empty")

        order_items = []
        total_price = 0.0
        for cart_item in cart_items:
            product = cart_item.product
            if product is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
            if product.available_stock < cart_item.quantity:
                raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                    detail=f"Insufficient stock for product {product.id}")

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
        return Response(
            success=True,
            status_code=status.HTTP_200_OK,
            message="Orders created successfully",
            data=order,
        )

    @staticmethod
    def direct_order(customer_id: int, payload: ToolDirectOrderPayload, db: Session):
        product = db.query(Product).filter(
            Product.id == payload.product_id).first()

        if product is None:
            return "Product not found"
        if product.available_stock < payload.quantity:

            return "Stock not available"
        price = float(product.main_price)
        total_price += price * payload.quantity
        product.available_stock -= payload.quantity

        order_item = OrderItems(
            product_id=product.id,
            quantity=payload.quantity,
            per_price=price,
        )
        order = Order(
            customer_id=customer_id,
            total_price=total_price,
            delivery_address=payload.delivery_address,
            items=[order_item],
        )

        db.add(order)
        db.commit()
        db.refresh(order)
        return {
            "order_id": order.id
        }
