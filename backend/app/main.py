import logging

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from starlette.middleware.gzip import GZipMiddleware

from app.config import get_settings
from app.controllers.auth import router as auth_router
from app.controllers.ai import router as ai_router
from app.controllers.cart import router as cart_router
from app.controllers.order import router as order_router
from app.controllers.product import router as product_router
from app.controllers.review import router as review_router
from app.controllers.wishlist import router as wishlist_router
from app.controllers.users import router as users_router
from app.database import engine
from app.helpers import init_users
from app.models import Base
import socket

logger = logging.getLogger(__name__)
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


def error_response(status_code: int, message: str, data=None) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={
            "message": message,
            "success": False,
            "status_code": status_code,
            "data": data,
        },
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return error_response(exc.status_code, str(exc.detail))


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request, exc: RequestValidationError
):
    return error_response(
        status.HTTP_422_UNPROCESSABLE_ENTITY,
        "Request validation failed",
        exc.errors(),
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    print(str(exc))
    logger.exception(
        "Unhandled exception while processing %s", request.url.path)
    return error_response(
        status.HTTP_500_INTERNAL_SERVER_ERROR,
        "Internal server error",
    )


@app.on_event("startup")
def startup():
    Base.metadata.create_all(bind=engine)
    init_users()


@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok",
            "host": socket.gethostname()
            }


app.include_router(prefix=api_prefix, router=product_router)
app.include_router(prefix=api_prefix, router=order_router)
app.include_router(prefix=api_prefix, router=cart_router)
app.include_router(prefix=api_prefix, router=wishlist_router)
app.include_router(prefix=api_prefix, router=review_router)
app.include_router(prefix=api_prefix, router=auth_router)
app.include_router(prefix=api_prefix, router=users_router)
app.include_router(prefix=api_prefix, router=ai_router)
