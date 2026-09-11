from sqlalchemy.orm import Session
from fastapi import status
from models import Product, Review, User
from schemas.review import AddReviewPayload, UpdateReviewPayload
from schemas.utils import AuthUser, Response
from agent.main import llm
from models.review import ReviewReactionType
from models.users import UserRole
from pydantic import BaseModel, Field
from langchain_core.prompts import ChatPromptTemplate


class ReviewAnalysis(BaseModel):
    reaction_type: ReviewReactionType = Field(
        description="The customer's reaction type classified from the review"
    )
    reasoning: str = Field(
        description="A short explanation of why this reaction type was chosen"
    )


class ReviewService:
    @staticmethod
    def find_review_by_id(review_id: int, db: Session):
        review = ReviewService._find_review_by_id(review_id, db)
        return Response(
            success=review is not None,
            status_code=status.HTTP_200_OK if review is not None else status.HTTP_404_NOT_FOUND,
            message="Review retrieved successfully" if review is not None else "Review not found",
            data=review,
        )

    @staticmethod
    def _find_review_by_id(review_id: int, db: Session):
        return db.query(Review).filter(Review.id == review_id).first()

    @staticmethod
    def find_reviews_by_product(product_id: int, db: Session, limit: int | None = None):
        query = db.query(Review).filter(Review.product_id == product_id)
        if limit is not None:
            query = query.limit(limit)
        reviews = query.order_by(Review.created_at.desc()).all()
        return Response(
            success=True,
            status_code=status.HTTP_200_OK,
            message="Product reviews retrieved successfully",
            data=reviews,
        )

    @staticmethod
    def find_reviews_by_user(user_id: int, db: Session, limit: int | None = None):
        query = db.query(Review).filter(Review.user_id == user_id)
        if limit is not None:
            query = query.limit(limit)
        reviews = query.order_by(Review.created_at.desc()).all()
        return Response(
            success=True,
            status_code=status.HTTP_200_OK,
            message="User reviews retrieved successfully",
            data=reviews,
        )

    @staticmethod
    def add_review(user_id: int, payload: AddReviewPayload, db: Session):
        if db.query(Product).filter(Product.id == payload.product_id).first() is None:
            raise ValueError("Product not found")
        if db.query(User).filter(User.id == user_id).first() is None:
            raise ValueError("User not found")
        if (
            db.query(Review)
            .filter(Review.user_id == user_id, Review.product_id == payload.product_id)
            .first()
            is not None
        ):
            raise ValueError("User already reviewed this product")

        structured_llm = llm.with_structured_output(ReviewAnalysis)

        prompt = ChatPromptTemplate.from_messages([
            ("system", "You are an expert customer feedback analyzer. Categorize the customer's reaction."),
            ("human", """Analyze this customer review and classify the reaction type.
            
            Review Details:
            "comment": {comment}
            "rating": {rating}
            """)
        ])

        analyzer_chain = prompt | structured_llm
        output = analyzer_chain.invoke({
            "comment": payload.comment,
            "rating": payload.rating
        })
        review = Review(
            user_id=user_id,
            product_id=payload.product_id,
            rating=payload.rating,
            comment=payload.comment,
            reaction_type=output.reaction_type
        )
        db.add(review)
        db.commit()
        db.refresh(review)

        return Response(
            success=True,
            status_code=status.HTTP_200_OK,
            message="Review added successfully",
            data=review,
        )

    @staticmethod
    def update_review(
        review_id: int,
        payload: UpdateReviewPayload,
        current_user: AuthUser,
        db: Session,
    ):
        review = ReviewService._find_review_by_id(review_id, db)
        if review is None:
            return Response(
                success=False,
                status_code=status.HTTP_404_NOT_FOUND,
                message="Review not found",
                data=None,
            )
        if current_user.role != UserRole.ADMIN and review.user_id != current_user.id:
            return Response(
                success=False,
                status_code=status.HTTP_403_FORBIDDEN,
                message="You do not have permission to update this review",
                data=None,
            )
        if payload.rating is not None:
            review.rating = payload.rating
        if payload.comment is not None:
            review.comment = payload.comment
        db.commit()
        db.refresh(review)
        return Response(
            success=True,
            status_code=status.HTTP_200_OK,
            message="Review updated successfully",
            data=review,
        )

    @staticmethod
    def delete_review(review_id: int, current_user: AuthUser, db: Session):
        review = ReviewService._find_review_by_id(review_id, db)
        if review is None:
            return Response(
                success=False,
                status_code=status.HTTP_404_NOT_FOUND,
                message="Review not found",
                data=False,
            )
        if current_user.role != UserRole.ADMIN and review.user_id != current_user.id:
            return Response(
                success=False,
                status_code=status.HTTP_403_FORBIDDEN,
                message="You do not have permission to delete this review",
                data=False,
            )
        db.delete(review)
        db.commit()
        return Response(
            success=True,
            status_code=status.HTTP_200_OK,
            message="Review deleted successfully",
            data=True,
        )
