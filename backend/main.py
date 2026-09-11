from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.gzip import GZipMiddleware

from config import get_settings
from controllers.auth import router as auth_router
from controllers.ai import router as ai_router
from controllers.cart import router as cart_router
from controllers.order import router as order_router
from controllers.product import router as product_router
from controllers.review import router as review_router
from controllers.wishlist import router as wishlist_router
from controllers.users import router as users_router
from database import engine
from helpers import init_users
from models import Base
settings = get_settings()
api_prefix = "/api/v1"

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    debug=settings.debug,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    init_users()


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok"}


app.include_router(prefix=api_prefix, router=product_router)
app.include_router(prefix=api_prefix, router=order_router)
app.include_router(prefix=api_prefix, router=cart_router)
app.include_router(prefix=api_prefix, router=wishlist_router)
app.include_router(prefix=api_prefix, router=review_router)
app.include_router(prefix=api_prefix, router=auth_router)
app.include_router(prefix=api_prefix, router=users_router)
app.include_router(prefix=api_prefix, router=ai_router)
