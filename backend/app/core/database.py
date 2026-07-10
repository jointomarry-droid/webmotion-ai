from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.core.config import settings

# Create engine with resilient settings
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=5,
    connect_args={
        "timeout": 5,
        "command_timeout": 5,
    }
)

async_session = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)

class Base(DeclarativeBase):
    pass

async def get_db() -> AsyncSession:
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()

async def check_db_connection() -> dict:
    """Check database connection status"""
    try:
        async with engine.begin() as conn:
            await conn.execute("SELECT 1")
        return {"status": "healthy", "connected": True}
    except Exception as e:
        return {"status": "unhealthy", "connected": False, "error": str(e)[:100]}
