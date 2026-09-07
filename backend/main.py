from fastapi import FastAPI

from controllers.auth import router as auth_router
from controllers.cart import router as cart_router
from controllers.order import router as order_router
from controllers.product import router as product_router
from controllers.review import router as review_router
from controllers.wishlist import router as wishlist_router
from controllers.users import router as users_router


app = FastAPI(title="E-Commerce API", version="1.0.0")

app.include_router(product_router)
app.include_router(order_router)
app.include_router(cart_router)
app.include_router(wishlist_router)
app.include_router(review_router)
app.include_router(auth_router)
app.include_router(users_router)
