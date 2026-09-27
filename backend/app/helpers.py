from app.schemas.utils import PaginationQuery
import json
from pathlib import Path
from app.schemas.users import RegisterPayload
from app.schemas.product import AddProductPayload
from app.database import SessionLocal
from app.models import User, Product


def generate_slug(name: str):
    raw_slug = "-".join(part for part in name.lower().strip().split() if part)
    return raw_slug or "product"


def calculate_pagination(query: PaginationQuery) -> PaginationQuery:
    page = query.page or 1
    limit = query.limit or 10

    query.page = page
    query.limit = limit
    query.skip = (page - 1) * limit
    return query


def get_json(path: str):
    with open(path, "r") as file:
        data = json.load(file)
        file.close()
        return data


def init_users():
    from app.services.users import UserService

    db = SessionLocal()
    try:
        users_count = db.query(User).count()
        if users_count == 0:
            user_payloads = get_json(
                Path(__file__).resolve().parent / "JSON_DATA" / "users.json")
            user_payloads = [
                RegisterPayload(
                    email=user["email"],
                    password=user["password"],
                    full_name=user["full_name"],
                    role=user.get("role"),
                )
                for user in user_payloads
            ]
            print("Init users started")
            for payload in user_payloads:
                response = UserService.register(payload=payload, db=db)
                print(f"Registered user-{response.data['id']}")

            print("Init users completed")

    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


def init_products():
    from app.services.product import ProductsService

    db = SessionLocal()
    try:
        products_count = db.query(Product).count()
        if products_count == 0:
            product_payloads = get_json(
                Path(__file__).resolve().parent / "JSON_DATA" / "products.json")
            product_payloads = [
                AddProductPayload(
                    name=product["name"],
                    description=product["description"],
                    regular_price=product["regular_price"],
                    main_price=product["main_price"],
                    images=product.get("images", []),
                    category=product["category"],
                    available_stock=product.get("available_stock", 0),
                    status=product.get("status"),
                )
                for product in product_payloads
            ]
            print("Init products started")
            for payload in product_payloads:
                response = ProductsService.add_product(payload=payload, db=db)
                print(f"Created product-{response.data['id']}")

            print("Init products completed")

    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
