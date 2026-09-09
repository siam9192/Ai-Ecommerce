from schemas.product import AddProductPayload, UpdateProductPayload, ProductStatus, FindProductsPayload
from schemas.utils import PaginationQuery, Response, Meta
from models import Product, ProductImages, CartItem, WishlistItem
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import or_
from helpers import generate_slug, calculate_pagination
from schemas.response import ProductResponse
from schemas.utils import AuthUser
from fastapi import status
from typing import Optional
from models.users import UserRole


class ProductsService:

    def add_product(payload: AddProductPayload, db: Session):
        slug = generate_slug(payload.name)
        counter = 2
        while db.query(Product).filter(Product.slug == slug).first() is not None:
            slug = generate_slug(f"{payload.name} {counter}")
            counter += 1

        product = Product(
            name=payload.name,
            description=payload.description,
            slug=slug,
            regular_price=payload.regular_price,
            main_price=payload.main_price,
            category=payload.category,
            available_stock=payload.available_stock,
            status=payload.status or ProductStatus.ACTIVE,
        )

        db.add(product)
        db.flush()

        image_objects = [
            ProductImages(product_id=product.id, image_url=image_url)
            for image_url in payload.images
        ]

        if image_objects:
            db.add_all(image_objects)

        db.commit()
        db.refresh(product)
        return Response(
            success=True,
            status_code=status.HTTP_200_OK,
            message="Product created successfully",
            data=product
        )

    def update_product(product_id: int, payload: UpdateProductPayload, db: Session):
        product = db.query(Product).filter(Product.id == product_id).first()
        if product is None:
            return None

        if payload.name is not None:
            product.name = payload.name.strip()
            slug = generate_slug(payload.name)
            counter = 2
            while db.query(Product).filter(Product.slug == slug).first() is not None:
                slug = generate_slug(f"{payload.name} {counter}")
                counter += 1
            product.slug = slug

        if payload.description is not None:
            product.description = payload.description

        if payload.regular_price is not None:
            product.regular_price = payload.regular_price

        if payload.main_price is not None:
            product.main_price = payload.main_price

        if payload.category is not None:
            product.category = payload.category

        if payload.available_stock is not None:
            product.available_stock = payload.available_stock

        if payload.status is not None:
            product.status = payload.status

        if payload.images is not None:
            db.query(ProductImages).filter(
                ProductImages.product_id == product.id).delete()
            product.images = [
                ProductImages(product_id=product.id, image_url=image_url)
                for image_url in payload.images
            ]

        db.commit()
        db.refresh(product)
        return Response(
            data=product,
            success=True,
            status_code=status.HTTP_200_OK,
            message="Product updated successfully"
        )

    def soft_delete_product(product_id: int, db: Session):
        product = db.query(Product).filter(Product.id == product_id).first()
        if product is None:
            return "Product not found"

        db.query(Product).filter(Product.id == product_id).delete()

        return Response(
            data=True,
            success=True,
            status_code=status.HTTP_200_OK,
            message="Product deleted successfully"
        )

    def find_products(payload: FindProductsPayload, pagination_query: PaginationQuery, db: Session, current_user: Optional[AuthUser] = None):
        query = db.query(Product).filter(Product.is_deleted == False)

        if payload.keyword:
            keyword_pattern = f"%{payload.keyword}%"
            query = query.filter(
                or_(
                    Product.name.ilike(keyword_pattern),
                    Product.description.ilike(keyword_pattern),
                    Product.category.ilike(keyword_pattern),
                )
            )

            if payload.min_price is not None:
                query = query.filter(Product.main_price >=
                                     payload.min_price)
            if payload.max_price is not None:
                query = query.filter(Product.main_price <=
                                     payload.max_price)
        if current_user is not None and current_user.role == UserRole.CUSTOMER:
            query = query.filter(Product.status == ProductStatus.ACTIVE)

        limit, skip, sort_by, sort_order, page = calculate_pagination(
            pagination_query)
        query = query.limit(limit).offset(skip)
        count = query.count()

        sort_column = getattr(Product, sort_by, None) if sort_by else None
        if sort_column:
            if sort_order == "desc":
                query = query.order_by(sort_column.desc())
            else:
                query = query.order_by(sort_column.asc())
        products = (
            query
            .options(selectinload(Product.images))
            .all()
        )

        cart_items_products_id = set()
        wishlist_items_products_id = set()
        if current_user is not None and current_user.role == UserRole.CUSTOMER:
            product_ids = [product.id for product in products]
            cart_items_products_id = {
                product_id
                for (product_id,) in db.query(CartItem.product_id).filter(
                    CartItem.user_id == current_user.id,
                    CartItem.product_id.in_(product_ids),
                ).all()
            }
            wishlist_items_products_id = {
                product_id
                for (product_id,) in db.query(WishlistItem.product_id).filter(
                    WishlistItem.user_id == current_user.id,
                    WishlistItem.product_id.in_(product_ids),
                ).all()
            }

        product_result = [
            ProductResponse(
                id=product.id,
                name=product.name,
                description=product.description[:100],
                regular_price=product.regular_price,
                main_price=product.main_price,
                images=[image.image_url for image in product.images],
                available_stock=product.available_stock,
                status=product.status,
                created_at=product.created_at,
                updated_at=product.updated_at,
                wish_listed=product.id in wishlist_items_products_id,
                cart_item_listed=product.id in cart_items_products_id
            )
            for product in products
        ]
        result = Response(
            status_code=status.HTTP_200_OK,
            success=True,
            message="Products retrieved successfully",
            data=product_result,
            meta=Meta(
                page=page,
                skip=skip,
                limit=limit,
                total=count,
            ),
        )
        return result

    def find_product_by_slug(slug: str, db: Session, current_user: AuthUser = None):
        query = db.query(Product).filter(
            Product.slug == slug, Product.is_deleted == False)

        if current_user is not None and current_user.role == UserRole.CUSTOMER:
            query = query.filter(Product.status == ProductStatus.ACTIVE)

        product = query.first()

        if product is None or product.is_deleted:
            return "Product is not found"

        wish_listed = False
        cart_item_listed = False
        if current_user is not None and current_user.role == UserRole.CUSTOMER:
            wish_listed = db.query(WishlistItem.id).filter(
                WishlistItem.user_id == current_user.id,
                WishlistItem.product_id == product.id,
            ).first() is not None
            cart_item_listed = db.query(CartItem.id).filter(
                CartItem.user_id == current_user.id,
                CartItem.product_id == product.id,
            ).first() is not None

        product = ProductResponse(id=product.id,
                                  name=product.name,
                                  description=product.description,
                                  regular_price=product.regular_price,
                                  main_price=product.main_price,
                                  images=[
                                      image.image_url for image in product.images],
                                  available_stock=product.available_stock,
                                  status=product.status,
                                  created_at=product.created_at,
                                  updated_at=product.updated_at,
                                  wish_listed=wish_listed,
                                  cart_item_listed=cart_item_listed)

        return Response(
            data=product,
            success=True,
            status_code=status.HTTP_200_OK,
            message="Product retrieved successfully"
        )
