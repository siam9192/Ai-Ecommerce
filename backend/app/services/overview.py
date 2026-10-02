from sqlalchemy.orm import Session
from sqlalchemy import select, func
from app.models import User, Order, Product
from app.models.product import ProductStatus
from app.models.order import OrderStatus
from app.models.users import UserRole
from app.schemas.utils import Response
from fastapi import status


class OverviewService:

    @staticmethod
    def get_admin_overview(db: Session):
        products_count = db.query(Product).count()

        products_active = db.query(Product).filter(
            Product.status == ProductStatus.ACTIVE
        ).count()

        products_in_stock = db.query(Product).filter(
            Product.available_stock > 0
        ).count()

        orders_count = db.query(Order).count()

        total_revenue = db.execute(
            select(func.sum(Order.total_price))
        ).scalar() or 0

        customers_count = db.query(User).filter(
            User.role == UserRole.CUSTOMER
        ).count()

        pending_orders = db.query(Order).filter(
            Order.status == OrderStatus.PENDING
        ).count()

        total_revenue = db.execute(
            select(func.sum(Order.total_price))
            .where(Order.status == OrderStatus.DELIVERED)
        ).scalar() or 0

        return Response(
            success=True,
            status_code=status.HTTP_200_OK,
            message="Admin overview retrieved successfully",
            data={
                "total_revenue": total_revenue,
                "products_count": products_count,
                "products_active": products_active,
                "products_in_stock": products_in_stock,
                "orders_count": orders_count,
                "total_revenue": total_revenue,
                "customers_count": customers_count,
                "pending_orders": pending_orders,
            }
        )

    @staticmethod
    def get_orders_overview(db: Session):
        total_orders = db.query(Order).count()

        pending_orders = db.query(Order).filter(
            Order.status == OrderStatus.PENDING
        ).count()

        completed_orders = db.query(Order).filter(
            Order.status == OrderStatus.DELIVERED
        ).count()

      
        total_revenue = db.execute(
            select(func.sum(Order.total_price))
            .where(Order.status == OrderStatus.DELIVERED)
        ).scalar() or 0

        return Response(
            success=True,
            status_code=status.HTTP_200_OK,
            message="Orders overview retrieved successfully",
            data={
                "total_orders": total_orders,
                "pending_orders": pending_orders,
                "completed_orders": completed_orders,
                "cancelled_orders": 0,
                "total_revenue": total_revenue,
            }
        )
