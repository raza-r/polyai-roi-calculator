"""Application configuration"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    # App
    APP_NAME: str = "CalcForge"
    APP_VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"  # development, staging, production
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "postgresql://localhost/calcforge"

    # Security
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    # Email (Resend)
    RESEND_API_KEY: str = ""
    FROM_EMAIL: str = "noreply@calcforge.app"

    # Stripe
    STRIPE_SECRET_KEY: str = ""
    STRIPE_PUBLISHABLE_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60

    # File Upload
    MAX_UPLOAD_SIZE_MB: int = 5
    ALLOWED_IMAGE_TYPES: list[str] = ["image/jpeg", "image/png", "image/svg+xml"]

    # Frontend URL
    FRONTEND_URL: str = "http://localhost:5173"

    # Monitoring
    SENTRY_DSN: str = ""

    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()
