from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.core.config import settings
from app.api.v1 import auth, templates, projects, ai, deploy, billing, settings as settings_api, admin
from app.core.database import engine, Base
from app.core.mongodb import connect_to_mongo, close_mongo_connection

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup - try to connect to databases
    print("[STARTUP] Initializing " + settings.APP_NAME)
    
    # Try MongoDB (optional)
    await connect_to_mongo()
    
    # Try PostgreSQL (optional - app works without it)
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("[OK] PostgreSQL connected")
    except Exception as e:
        print("[WARN] PostgreSQL not available: " + str(e)[:80])
        print("[INFO] Running in limited mode - some features may be unavailable")
    
    print("[STARTUP] Application ready")
    yield
    
    # Shutdown
    await engine.dispose()
    await close_mongo_connection()
    print("[SHUTDOWN] Application stopped")

app = FastAPI(
    title="WebMotion.ai API",
    description="AI-Powered Animation Prompt Engineering Platform",
    version="0.1.0",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API Routes
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(templates.router, prefix="/api/v1/templates", tags=["Templates"])
app.include_router(projects.router, prefix="/api/v1/projects", tags=["Projects"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["AI"])
app.include_router(deploy.router, prefix="/api/v1/deploy", tags=["Deployment"])
app.include_router(billing.router, prefix="/api/v1/billing", tags=["Billing"])
app.include_router(settings_api.router, prefix="/api/v1/settings", tags=["Settings"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])

@app.get("/")
async def root():
    return {
        "name": "WebMotion.ai API",
        "version": "0.1.0",
        "status": "running",
        "docs": "/docs",
    }

@app.get("/health")
async def health():
    from app.core.mongodb import get_mongo_health, is_mongo_connected
    mongo_health = await get_mongo_health()
    return {
        "status": "healthy",
        "services": {
            "api": "healthy",
            "mongodb": mongo_health,
        }
    }

@app.get("/health/simple")
async def health_simple():
    return {"status": "healthy"}
