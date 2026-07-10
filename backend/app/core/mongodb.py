from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings
from typing import Optional
import asyncio
import ssl

class MongoDB:
    client: Optional[AsyncIOMotorClient] = None
    db = None
    _connected: bool = False

mongo = MongoDB()

async def connect_to_mongo():
    """Create MongoDB Atlas connection"""
    try:
        # Connection options for Atlas - quick timeout
        mongo.client = AsyncIOMotorClient(
            settings.MONGODB_URL,
            tls=True,
            tlsAllowInvalidCertificates=False,
            serverSelectionTimeoutMS=3000,
            connectTimeoutMS=5000,
            retryWrites=True,
            w='majority',
        )
        
        # Test the connection with timeout
        try:
            await asyncio.wait_for(mongo.client.admin.command('ping'), timeout=5.0)
            mongo.db = mongo.client[settings.MONGODB_DB_NAME]
            mongo._connected = True
            print("[OK] Connected to MongoDB Atlas")
        except asyncio.TimeoutError:
            print("[WARN] MongoDB Atlas timeout - continuing without MongoDB")
            mongo._connected = False
        except Exception as e:
            print("[WARN] MongoDB Atlas not available: " + str(e)[:80])
            mongo._connected = False
        
    except Exception as e:
        print("[WARN] MongoDB Atlas init failed: " + str(e)[:80])
        mongo._connected = False

async def close_mongo_connection():
    """Close MongoDB connection"""
    if mongo.client:
        mongo.client.close()
        mongo._connected = False
        print("Disconnected from MongoDB Atlas")

def get_mongo_db():
    """Get MongoDB database instance"""
    if not mongo._connected:
        print("Warning: MongoDB not connected")
    return mongo.db

def is_mongo_connected() -> bool:
    """Check if MongoDB is connected"""
    return mongo._connected

async def get_mongo_health() -> dict:
    """Get MongoDB health status"""
    try:
        if mongo.client:
            await mongo.client.admin.command('ping')
            return {
                "status": "healthy",
                "connected": True,
                "database": settings.MONGODB_DB_NAME,
                "cluster": "cluster0.i04fqcu.mongodb.net"
            }
    except Exception as e:
        return {
            "status": "unhealthy",
            "connected": False,
            "error": str(e)
        }
    return {
        "status": "disconnected",
        "connected": False
    }
