from schemas.utils import PaginationQuery
import json
from schemas.users import RegisterPayload
from services.users import UserService
from database import SessionLocal
from models import User


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
    db = SessionLocal()
    try:
        users_count = db.query(User).count()
        if users_count == 0:
            user_payloads = get_json("./JSON_DATA/users.json")
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
