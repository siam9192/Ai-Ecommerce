import os
from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    # App
    app_name: str = "E-Commerce API"
    app_version: str = "1.0.0"
    debug: bool = False

    # Database
    database_url: str = "sqlite:///./ecommerce.db"

    # Security
    secret_key: str = "76357jhdhjvccsdadnkjbcdpomnulkjjdl;l"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 2000
    refresh_token_expire_days: int = 7

    # Email
    smtp_server: str = "smtp.gmail.com"
    smtp_port: int = 587
    email_from: str = "noreply@ecommerce.com"
    email_password: str = ""

    # Redis
    redis_url: str = "redis://localhost:6379/0"

    #API Keys
    gemini_api_key:str = ""

    # CORS
    allowed_origins: list[str] = [
        "http://localhost:3000", "http://localhost:8080"]

    # Pagination
    default_page_size: int = 20
    max_page_size: int = 100

    model_config = SettingsConfigDict(env_file=".env", case_sensitive=False)


@lru_cache
def get_settings():
    return Settings()
