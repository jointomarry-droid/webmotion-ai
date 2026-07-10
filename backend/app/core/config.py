from pydantic_settings import BaseSettings
from typing import List
import os

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "WebMotion.ai"
    APP_VERSION: str = "0.1.0"
    APP_URL: str = "http://localhost:3000"
    DEBUG: bool = False
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:3001",
        "https://webmotion.ai",
        "https://hmewyvjrsqdcfmdpvwmo.vercel.app",
    ]
    
    # Database (PostgreSQL)
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/webmotion"
    
    # MongoDB Atlas
    MONGODB_URL: str = "mongodb+srv://jointomarry:JointoMarry@1427@cluster0.i04fqcu.mongodb.net/?appName=Cluster0"
    MONGODB_DB_NAME: str = "webmotion"
    
    # Supabase
    SUPABASE_URL: str = "https://hmewyvjrsqdcfmdpvwmo.supabase.co"
    SUPABASE_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    SUPABASE_PROJECT_ID: str = "hmewyvjrsqdcfmdpvwmo"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379"
    
    # JWT
    JWT_SECRET_KEY: str = "webmotion-super-secret-key-2024"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # AI Providers
    OPENAI_API_KEY: str = ""
    ANTHROPIC_API_KEY: str = ""
    GEMINI_API_KEY: str = ""
    
    # Stripe
    STRIPE_SECRET_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""
    
    # GitHub (for deployment)
    GITHUB_TOKEN: str = ""
    
    # Vercel (for deployment)
    VERCEL_TOKEN: str = ""
    
    # Admin credentials
    ADMIN_USERNAME: str = "admin"
    ADMIN_PASSWORD: str = "admin123"
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
