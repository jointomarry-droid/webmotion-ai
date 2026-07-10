from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
import time
from datetime import datetime

router = APIRouter()

# Admin credentials (in production: use hashed passwords in database)
ADMIN_CREDENTIALS = {
    "username": "admin",
    "password": "admin123"
}

class AdminLogin(BaseModel):
    username: str
    password: str

class SystemSettings(BaseModel):
    maintenance_mode: bool = False
    new_registrations: bool = True
    ai_generation: bool = True

# In-memory stats (use database in production)
_system_stats = {
    "total_users": 1247,
    "active_users": 89,
    "total_projects": 3456,
    "api_calls_today": 12847,
    "storage_used": "45.2 GB",
    "start_time": time.time(),
}

@router.post("/login")
async def admin_login(credentials: AdminLogin):
    """Admin login"""
    if (credentials.username == ADMIN_CREDENTIALS["username"] and 
        credentials.password == ADMIN_CREDENTIALS["password"]):
        return {
            "success": True,
            "token": "admin_authenticated",
            "message": "Login successful"
        }
    raise HTTPException(status_code=401, detail="Invalid credentials")

@router.get("/stats")
async def get_admin_stats():
    """Get system statistics"""
    uptime_seconds = time.time() - _system_stats["start_time"]
    days = int(uptime_seconds // 86400)
    hours = int((uptime_seconds % 86400) // 3600)
    minutes = int((uptime_seconds % 3600) // 60)
    
    return {
        "totalUsers": _system_stats["total_users"],
        "activeUsers": _system_stats["active_users"],
        "totalProjects": _system_stats["total_projects"],
        "apiCallsToday": _system_stats["api_calls_today"],
        "storageUsed": _system_stats["storage_used"],
        "uptime": f"{days}d {hours}h {minutes}m",
        "cpuUsage": 34,
        "memoryUsage": 67,
    }

@router.get("/users")
async def get_users():
    """Get all users (admin only)"""
    # In production: fetch from database
    return {
        "users": [
            {"id": 1, "name": "John Doe", "email": "john@example.com", "plan": "Pro", "status": "active"},
            {"id": 2, "name": "Jane Smith", "email": "jane@example.com", "plan": "Starter", "status": "active"},
            {"id": 3, "name": "Bob Wilson", "email": "bob@example.com", "plan": "Free", "status": "inactive"},
        ],
        "total": 3
    }

@router.get("/health")
async def system_health():
    """Get system health status"""
    return {
        "services": [
            {"name": "PostgreSQL", "status": "healthy", "latency": "2ms"},
            {"name": "Redis", "status": "healthy", "latency": "1ms"},
            {"name": "MongoDB", "status": "healthy", "latency": "3ms"},
            {"name": "AI Service", "status": "healthy", "latency": "150ms"},
        ],
        "overall": "healthy"
    }

@router.get("/analytics")
async def get_analytics():
    """Get analytics data"""
    return {
        "apiUptime": 98.5,
        "avgResponseTime": 2.3,
        "monthlyRevenue": 4567,
        "dailyRequests": [1200, 1350, 1100, 1450, 1300, 1500, 12847],
        "topEndpoints": [
            {"path": "/api/v1/ai/generate", "calls": 5234},
            {"path": "/api/v1/projects", "calls": 3456},
            {"path": "/api/v1/templates", "calls": 2345},
        ]
    }

@router.put("/settings")
async def update_system_settings(settings: SystemSettings):
    """Update system settings"""
    # In production: save to database
    return {"success": True, "message": "Settings updated"}
