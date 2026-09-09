from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from controllers.auth import auth_guard
from database import get_db
from models.users import UserRole
from schemas.review import AddReviewPayload, UpdateReviewPayload
from schemas.utils import AuthUser
from services.review import ReviewService


router = APIRouter(prefix="/reviews", tags=["Reviews"])


@router.get("/{review_id}")
def find_review(review_id: int, db: Session = Depends(get_db)):
    return ReviewService.find_review_by_id(review_id, db)


@router.get("/product/{product_id}")
def find_product_reviews(
    product_id: int,
    limit: int | None = None,
    db: Session = Depends(get_db),
):
    return ReviewService.find_reviews_by_product(product_id, db, limit)


@router.get("/user/{user_id}")
def find_user_reviews(
    user_id: int,
    limit: int | None = None,
    db: Session = Depends(get_db),
):
    return ReviewService.find_reviews_by_user(user_id, db, limit)


@router.post("")
def add_review(
    payload: AddReviewPayload,
    current_user: AuthUser = Depends(auth_guard([UserRole.CUSTOMER])),
    db: Session = Depends(get_db),
):
    return ReviewService.add_review(current_user.id, payload, db)


@router.patch("/{review_id}")
def update_review(
    review_id: int,
    payload: UpdateReviewPayload,
    current_user: AuthUser = Depends(
        auth_guard([UserRole.CUSTOMER, UserRole.ADMIN])
    ),
    db: Session = Depends(get_db),
):
    return ReviewService.update_review(review_id, payload, db)


@router.delete("/{review_id}")
def delete_review(
    review_id: int,
    current_user: AuthUser = Depends(
        auth_guard([UserRole.CUSTOMER, UserRole.ADMIN])
    ),
    db: Session = Depends(get_db),
):
    return ReviewService.delete_review(review_id, db)
