from collections.abc import Callable
from datetime import date, datetime
from decimal import Decimal
from enum import Enum
from typing import Any
from langchain.tools import tool
from sqlalchemy.inspection import inspect
from database import SessionLocal
from schemas.cart import AddCartItemPayload, UpdateCartItemPayload
from schemas.product import AddProductPayload, ToolFindProductsPayload, UpdateProductPayload
from schemas.review import AddReviewPayload, UpdateReviewPayload
from schemas.wishlist import AddWishlistItemPayload, RemoveWishlistItemPayload
from tools.cart import CartTools
from tools.product import ProductTool
from tools.review import ReviewTools
from tools.wishlist import WishlistTools
from schemas.response import AIFinalResponse

def _json_value(value: Any) -> Any:
    if isinstance(value, (datetime, date)):
        return value.isoformat()
    if isinstance(value, (Decimal, Enum)):
        return value.value
    return value


def _serialize(value: Any) -> Any:
    if value is None or isinstance(value, (str, int, float, bool)):
        return value
    if isinstance(value, list):
        return [_serialize(item) for item in value]
    if isinstance(value, tuple):
        return [_serialize(item) for item in value]
    try:
        mapper = inspect(value).mapper
    except (TypeError, AttributeError):
        return _json_value(value)
    return {
        column.key: _json_value(getattr(value, column.key))
        for column in mapper.columns
    }


def _run(operation: Callable[..., Any], *args: Any) -> Any:
    db = SessionLocal()
    try:
        return _serialize(operation(*args, db))
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


@tool
def get_cart(user_id: int) -> Any:
    """Get every item in a user's shopping cart."""
    return _run(CartTools.get_cart, user_id)


@tool
def get_cart_item(user_id: int, product_id: int) -> Any:
    """Get one product from a user's shopping cart."""
    return _run(CartTools.get_cart_item, user_id, product_id)


@tool
def add_cart_item(payload: AddCartItemPayload) -> Any:
    """Add a product to a user's cart or increase its quantity."""
    return _run(CartTools.add_item, payload)


@tool
def update_cart_item(user_id: int, product_id: int, payload: UpdateCartItemPayload) -> Any:
    """Set the quantity of a product in a user's cart."""
    return _run(CartTools.update_item, user_id, product_id, payload)


@tool
def remove_cart_item(user_id: int, product_id: int) -> bool:
    """Remove one product from a user's cart."""
    return _run(CartTools.remove_item, user_id, product_id)


@tool
def clear_cart(user_id: int) -> bool:
    """Remove every item from a user's cart."""
    return _run(CartTools.clear_cart, user_id)


@tool
def find_product_by_id(product_id: int) -> Any:
    """Find one product by its ID."""
    return _run(ProductTool.find_product_by_id, product_id)


@tool
def find_products(payload: ToolFindProductsPayload) -> Any:
    """Search products by text, category, price, stock, or a combination of filters."""
    return _run(ProductTool.find_products, payload)


@tool
def add_product(payload: AddProductPayload) -> Any:
    """Create a product in the catalog."""
    return _run(ProductTool.add_product, payload)


@tool
def update_product(product_id: int, payload: UpdateProductPayload) -> Any:
    """Update an existing catalog product."""
    return _run(ProductTool.update_product, product_id, payload)


@tool
def find_review_by_id(review_id: int) -> Any:
    """Find one review by its ID."""
    return _run(ReviewTools.find_review_by_id, review_id)


@tool
def find_reviews_by_product(product_id: int, limit: int | None = None) -> Any:
    """List recent reviews for a product."""
    return _run(ReviewTools.find_reviews_by_product, product_id, limit)


@tool
def find_reviews_by_user(user_id: int, limit: int | None = None) -> Any:
    """List recent reviews written by a user."""
    return _run(ReviewTools.find_reviews_by_user, user_id, limit)


@tool
def add_review(payload: AddReviewPayload) -> Any:
    """Add a review for a product on behalf of a user."""
    return _run(ReviewTools.add_review, payload)


@tool
def update_review(review_id: int, payload: UpdateReviewPayload) -> Any:
    """Update a review's rating or comment."""
    return _run(ReviewTools.update_review, review_id, payload)


@tool
def delete_review(review_id: int) -> bool:
    """Delete a review by its ID."""
    return _run(ReviewTools.delete_review, review_id)


@tool
def get_wishlist(user_id: int) -> Any:
    """Get every item in a user's wishlist."""
    return _run(WishlistTools.get_wishlist, user_id)


@tool
def get_wishlist_item(user_id: int, product_id: int) -> Any:
    """Check whether a product is in a user's wishlist."""
    return _run(WishlistTools.get_wishlist_item, user_id, product_id)


@tool
def add_wishlist_item(payload: AddWishlistItemPayload) -> Any:
    """Add a product to a user's wishlist."""
    return _run(WishlistTools.add_item, payload)


@tool
def remove_wishlist_item(payload: RemoveWishlistItemPayload) -> bool:
    """Remove a product from a user's wishlist."""
    return _run(WishlistTools.remove_item, payload)


@tool
def clear_wishlist(user_id: int) -> bool:
    """Remove every item from a user's wishlist."""
    return _run(WishlistTools.clear_wishlist, user_id)


@tool 
def final_response(response:AIFinalResponse)->AIFinalResponse:
    """Final response after all the process"""
    return response

AI_TOOLS = [
    get_cart,
    get_cart_item,
    add_cart_item,
    update_cart_item,
    remove_cart_item,
    clear_cart,
    find_product_by_id,
    find_products,
    add_product,
    update_product,
    find_review_by_id,
    find_reviews_by_product,
    find_reviews_by_user,
    add_review,
    update_review,
    delete_review,
    get_wishlist,
    get_wishlist_item,
    add_wishlist_item,
    remove_wishlist_item,
    clear_wishlist,
    final_response
]
