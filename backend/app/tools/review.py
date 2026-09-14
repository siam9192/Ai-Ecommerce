from collections import Counter

from langchain_core.prompts import ChatPromptTemplate
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session
from app.agent.main import llm
from app.models import Order, OrderItem, Product, Review
from app.models.review import ReviewReactionType
from app.schemas.review import AddReviewPayload, UpdateReviewPayload


class ReviewAnalysis(BaseModel):
    reaction_type: ReviewReactionType = Field(
        description="The customer's reaction type classified from the review"
    )
    reasoning: str = Field(
        description="A short explanation of why this reaction type was chosen"
    )


class ReviewTools:
    @staticmethod
    def analyze_reviews(product_id: int | None, db: Session):
        query = db.query(Review)
        if product_id is not None:
            query = query.filter(Review.product_id == product_id)

        reviews = query.all()
        rating_distribution = Counter(str(review.rating) for review in reviews)
        reaction_distribution = Counter(
            review.reaction_type.value
            for review in reviews
            if review.reaction_type is not None
        )
        return {
            "product_id": product_id,
            "review_count": len(reviews),
            "average_rating": (
                sum(review.rating for review in reviews) / len(reviews)
                if reviews else 0.0
            ),
            "rating_distribution": dict(sorted(rating_distribution.items())),
            "reaction_distribution": dict(reaction_distribution),
            "comment_count": sum(1 for review in reviews if review.comment),
        }

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

        has_order = (
            db.query(OrderItem)
            .join(Order, Order.id == OrderItem.order_id)
            .filter(
                Order.customer_id == user_id,
                OrderItem.product_id == payload.product_id,
            )
            .first()
            is not None
        )

        structured_llm = llm.with_structured_output(ReviewAnalysis)
        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are an expert customer feedback analyzer. Categorize the customer's reaction."),
            ("human", """Analyze this customer review and classify the reaction type.

            Review Details:
            "comment": {comment}
            "rating": {rating}
            """),
        ])

        analyzer_chain = prompt | structured_llm
        output = analyzer_chain.invoke({
            "comment": payload.comment,
            "rating": payload.rating,
        })
        review = Review(
            user_id=user_id,
            product_id=payload.product_id,
            rating=payload.rating,
            comment=payload.comment,
            reaction_type=output.reaction_type,
            is_verified=has_order,
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
