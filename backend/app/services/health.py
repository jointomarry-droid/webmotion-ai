from typing import Dict, Any
import time
import asyncio
from datetime import datetime

class HealthMonitor:
    def __init__(self):
        self.start_time = time.time()
        self.metrics = {
            "requests_total": 0,
            "requests_success": 0,
            "requests_error": 0,
            "ai_calls_total": 0,
            "ai_calls_success": 0,
        }
        self.services = {}
    
    def record_request(self, success: bool = True):
        """Record an API request"""
        self.metrics["requests_total"] += 1
        if success:
            self.metrics["requests_success"] += 1
        else:
            self.metrics["requests_error"] += 1
    
    def record_ai_call(self, success: bool = True):
        """Record an AI API call"""
        self.metrics["ai_calls_total"] += 1
        if success:
            self.metrics["ai_calls_success"] += 1
    
    def update_service_status(self, service_name: str, status: str, latency_ms: float = 0):
        """Update service health status"""
        self.services[service_name] = {
            "status": status,
            "latency_ms": latency_ms,
            "last_checked": datetime.utcnow().isoformat(),
        }
    
    def get_uptime(self) -> str:
        """Get formatted uptime string"""
        uptime_seconds = time.time() - self.start_time
        days = int(uptime_seconds // 86400)
        hours = int((uptime_seconds % 86400) // 3600)
        minutes = int((uptime_seconds % 3600) // 60)
        return f"{days}d {hours}h {minutes}m"
    
    def get_health_report(self) -> Dict[str, Any]:
        """Get complete health report"""
        return {
            "uptime": self.get_uptime(),
            "metrics": self.metrics,
            "services": self.services,
            "overall_status": self._calculate_overall_status(),
        }
    
    def _calculate_overall_status(self) -> str:
        """Calculate overall system status"""
        if not self.services:
            return "unknown"
        
        statuses = [s["status"] for s in self.services.values()]
        if all(s == "healthy" for s in statuses):
            return "healthy"
        elif any(s == "unhealthy" for s in statuses):
            return "unhealthy"
        else:
            return "degraded"

# Global health monitor instance
health_monitor = HealthMonitor()
