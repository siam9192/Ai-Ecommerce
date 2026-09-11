from sqlalchemy import or_
from sqlalchemy.orm import Session, selectinload
from models import Product, ProductImages
from models import CartItem, WishlistItem
from models.product import ProductStatus
from schemas.product import AddProductPayload, ToolFindProductsPayload, UpdateProductPayload
from schemas.response import ProductResponse
from helpers import generate_slug


class ProductTool:

    @staticmethod
    def analyze_products(category: str | None, db: Session):
        query = db.query(Product).filter(Product.is_deleted.is_(False))
        if category is not None:
            query = query.filter(Product.category == category)

        products = query.all()
        inventory_units = sum(product.available_stock for product in products)
        inventory_value = sum(
            float(product.main_price) * product.available_stock
            for product in products
        )
        active_products = sum(
            1 for product in products if product.status == ProductStatus.ACTIVE
        )
        return {
            "category": category,
            "product_count": len(products),
            "active_product_count": active_products,
            "inactive_product_count": len(products) - active_products,
            "inventory_units": inventory_units,
            "inventory_value": inventory_value,
            "average_main_price": (
                sum(float(product.main_price)
                    for product in products) / len(products)
                if products else 0.0
            ),
            "out_of_stock_count": sum(
                1 for product in products if product.available_stock == 0
            ),
        }

    def find_product_by_id(product_id: int, db: Session):
        return db.query(Product).filter(Product.id == product_id).first()

    def find_products(user_id: int, payload: ToolFindProductsPayload, db: Session):
        query = db.query(Product).filter(
            Product.is_deleted.is_(False),
            Product.status == ProductStatus.ACTIVE,
        )

        if payload.ids:
            query = query.filter(Product.id.in_(payload.ids))

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

        products = query.options(selectinload(Product.images)).all()
        product_ids = [product.id for product in products]
        cart_item_product_ids = {
            product_id
            for (product_id,) in db.query(CartItem.product_id).filter(
                CartItem.user_id == user_id,
                CartItem.product_id.in_(product_ids),
            ).all()
        }
        wishlist_product_ids = {
            product_id
            for (product_id,) in db.query(WishlistItem.product_id).filter(
                WishlistItem.user_id == user_id,
                WishlistItem.product_id.in_(product_ids),
            ).all()
        }

        return [
            ProductResponse(
                id=product.id,
                name=product.name,
                description=product.description,
                regular_price=product.regular_price,
                main_price=product.main_price,
                images=[image.image_url for image in product.images],
                available_stock=product.available_stock,
                status=product.status,
                created_at=product.created_at,
                updated_at=product.updated_at,
                wish_listed=product.id in wishlist_product_ids,
                cart_item_listed=product.id in cart_item_product_ids,
            )
            for product in products
        ]

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
        return product

    def update_product(product_id: int, payload: UpdateProductPayload, db: Session):
        product = db.query(Product).filter(Product.id == product_id).first()
        if product is None:
            return "Product not found"

        if payload.name is not None:
            product.name = payload.name.strip()
            slug = generate_slug(payload.name)
            counter = 2
            while db.query(Product).filter(
                Product.slug == slug,
                Product.id != product.id,
            ).first() is not None:
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

        regular_price = (
            payload.regular_price
            if payload.regular_price is not None
            else product.regular_price
        )
        main_price = (
            payload.main_price
            if payload.main_price is not None
            else product.main_price
        )
        if regular_price <= main_price:
            raise ValueError("Regular price must be greater than main price")

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

        product.is_deleted = True
        db.commit()
        return True
