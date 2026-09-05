from sqlalchemy import or_
from sqlalchemy.orm import Session
from models import Product, ProductImages
from models.product import ProductStatus
from schemas.product import AddProductPayload, ToolFindProductsPayload, UpdateProductPayload
from helpers import generate_slug


class ProductTool:

    def find_product_by_id(product_id: int, db: Session):
        return db.query(Product).filter(Product.id == product_id).first()

    def find_products(payload: ToolFindProductsPayload, db: Session):
        query = db.query(Product)

        if payload.name:
            query = query.filter(Product.name == payload.name)
        elif payload.name_contains:
            query = query.filter(Product.name.ilike(
                f"%{payload.name_contains}%"))

        if payload.description_contains:
            query = query.filter(Product.description.ilike(
                f"%{payload.description_contains}%"))

        if payload.category_name:
            query = query.filter(Product.category == payload.category_name)

        if payload.keyword:
            keyword_pattern = f"%{payload.keyword}%"
            query = query.filter(
                or_(
                    Product.name.ilike(keyword_pattern),
                    Product.description.ilike(keyword_pattern),
                    Product.category.ilike(keyword_pattern),
                )
            )

        if payload.regular_price is not None:
            query = query.filter(Product.regular_price ==
                                 payload.regular_price)
        else:
            if payload.min_regular_price is not None:
                query = query.filter(
                    Product.regular_price >= payload.min_regular_price)
            if payload.max_regular_price is not None:
                query = query.filter(
                    Product.regular_price <= payload.max_regular_price)

        if payload.main_price is not None:
            query = query.filter(Product.main_price == payload.main_price)
        else:
            if payload.min_main_price is not None:
                query = query.filter(Product.main_price >=
                                     payload.min_main_price)
            if payload.max_main_price is not None:
                query = query.filter(Product.main_price <=
                                     payload.max_main_price)

        if payload.in_stock is not None:
            if payload.in_stock:
                query = query.filter(Product.available_stock > 0)
            else:
                query = query.filter(Product.available_stock == 0)

        if payload.limit is not None:
            query = query.limit(payload.limit)

        return query.all()

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
            return "Product not found"

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
