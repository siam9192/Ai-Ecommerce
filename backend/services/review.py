from sqlalchemy.orm import Session

from models import Product, Review, User
from schemas.review import AddReviewPayload, UpdateReviewPayload


class ReviewService:
    @staticmethod
    def find_review_by_id(review_id: int, db: Session):
        return db.query(Review).filter(Review.id == review_id).first()

    @staticmethod
    def find_reviews_by_product(product_id: int, db: Session, limit: int | None = None):
        query = db.query(Review).filter(Review.product_id == product_id)
        if limit is not None:
            query = query.limit(limit)
        return query.order_by(Review.created_at.desc()).all()

    @staticmethod
    def find_reviews_by_user(user_id: int, db: Session, limit: int | None = None):
        query = db.query(Review).filter(Review.user_id == user_id)
        if limit is not None:
            query = query.limit(limit)
        return query.order_by(Review.created_at.desc()).all()

    @staticmethod
    def add_review(payload: AddReviewPayload, db: Session):
        if db.query(Product).filter(Product.id == payload.product_id).first() is None:
            raise ValueError("Product not found")
        if db.query(User).filter(User.id == payload.user_id).first() is None:
            raise ValueError("User not found")
        if (
            db.query(Review)
            .filter(Review.user_id == payload.user_id, Review.product_id == payload.product_id)
            .first()
            is not None
        ):
            raise ValueError("User already reviewed this product")

        review = Review(
            user_id=payload.user_id,
            product_id=payload.product_id,
            rating=payload.rating,
            comment=payload.comment,
        )
        db.add(review)
        db.commit()
        db.refresh(review)
        return review

    @staticmethod
    def update_review(review_id: int, payload: UpdateReviewPayload, db: Session):
        review = ReviewService.find_review_by_id(review_id, db)
        if review is None:
            return None
        if payload.rating is not None:
            review.rating = payload.rating
        if payload.comment is not None:
            review.comment = payload.comment
        db.commit()
        db.refresh(review)
        return review

    @staticmethod
    def delete_review(review_id: int, db: Session):
        review = ReviewService.find_review_by_id(review_id, db)
        if review is None:
            return False
        db.delete(review)
        db.commit()
        return True
