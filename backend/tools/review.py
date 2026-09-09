from sqlalchemy.orm import Session
from models import Product, Review, User
from schemas.review import AddReviewPayload, UpdateReviewPayload


class ReviewTools:
    def find_review_by_id(review_id: int, db: Session):
        return db.query(Review).filter(Review.id == review_id).first()

    def find_reviews_by_product(product_id: int, db: Session, limit: int | None = None):
        query = db.query(Review).filter(Review.product_id == product_id)
        query = query.order_by(Review.created_at.desc())
        if limit is not None:
            query = query.limit(limit)
        return query.all()

    def find_reviews_by_user(user_id: int, db: Session, limit: int | None = None):
        query = db.query(Review).filter(Review.user_id == user_id)
        query = query.order_by(Review.created_at.desc())
        if limit is not None:
            query = query.limit(limit)
        return query.all()

    def add_review(user_id: int, payload: AddReviewPayload, db: Session):
        product = db.query(Product).filter(
            Product.id == payload.product_id).first()
        if product is None:
            raise ValueError("Product not found")

        existing = (
            db.query(Review)
            .filter(Review.user_id == user_id, Review.product_id == payload.product_id)
            .first()
        )
        if existing is not None:
            raise ValueError("User already reviewed this product")

        review = Review(
            user_id=user_id,
            product_id=payload.product_id,
            rating=payload.rating,
            comment=payload.comment,
        )
        db.add(review)
        db.commit()
        db.refresh(review)
        return review

    def update_review(review_id: int, payload: UpdateReviewPayload, db: Session):
        review = db.query(Review).filter(Review.id == review_id).first()
        if review is None:
            return None

        if payload.rating is not None:
            review.rating = payload.rating
        if payload.comment is not None:
            review.comment = payload.comment

        db.commit()
        db.refresh(review)
        return review

    def delete_review(review_id: int, db: Session):
        review = db.query(Review).filter(Review.id == review_id).first()
        if review is None:
            return False

        db.delete(review)
        db.commit()
        return True
