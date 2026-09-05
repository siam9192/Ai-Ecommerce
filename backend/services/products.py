from schemas.product import AddProductPayload, UpdateProductPayload, ProductStatus, FindProductsPayload
from schemas.utils import PaginationQuery, Response, Meta
from models import Product, ProductImages
from sqlalchemy.orm import Session, selectinload
from sqlalchemy import or_
from helpers import generate_slug
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
            status=payload.status or ProductStatus.RUNNING,
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
        return product

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
        return product

    def soft_delete_product(product_id: int, db: Session):
        product = db.query(Product).filter(Product.id == product_id).first()
        if product is None:
            return "Product not found"

        db.query(Product).filter(Product.id == product_id).delete()

        return True

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
        if current_user is not None or current_user.role == UserRole.CUSTOMER:
            query.filter(Product.status == ProductStatus.ACTIVE)

        limit, skip, sort_by, sort_order, page = pagination_query
        query = query.limit(limit).offset(skip)
        count = query.count()

        if sort_by:
            sort_column = getattr(Product, sort_by, None)

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
        product_result = [
            ProductResponse(
                id=product.id,
                name=product.name,
                description=product.description[0, 100],
                regular_price=product.regular_price,
                main_price=product.main_price,
                images=[image.image_url for image in product.images],
                available_stock=product.available_stock,
                status=product.status,
                created_at=product.created_at,
                updated_at=product.updated_at,
            )
            for product in products
        ]
        result = Response(
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
        product = db.query(Product).filter(
            Product.slug == slug, Product.is_deleted == False).first()

        if current_user is not None or current_user.role == UserRole.CUSTOMER:
            product.filter(Product.status == ProductStatus.ACTIVE)

        if product is None or product.is_deleted:
            return "Product is not found"

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
                                  updated_at=product.updated_at,)

        return Response(
            data=product,
            success=True,
            status_code=status.HTTP_200_OK
        )
