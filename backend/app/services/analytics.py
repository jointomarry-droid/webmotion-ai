from typing import Dict, Any, List
from datetime import datetime, timedelta
import json

class AnalyticsTracker:
    def __init__(self):
        self.events: List[Dict[str, Any]] = []
        self.daily_stats = {}
    
    def track_event(self, event_type: str, user_id: str = None, metadata: Dict = None):
        """Track an analytics event"""
        event = {
            "type": event_type,
            "user_id": user_id,
            "timestamp": datetime.utcnow().isoformat(),
            "metadata": metadata or {},
        }
        self.events.append(event)
        
        # Update daily stats
        today = datetime.utcnow().strftime("%Y-%m-%d")
        if today not in self.daily_stats:
            self.daily_stats[today] = {
                "total_events": 0,
                "ai_generations": 0,
                "deployments": 0,
                "new_users": 0,
            }
        self.daily_stats[today]["total_events"] += 1
        
        if event_type == "ai_generation":
            self.daily_stats[today]["ai_generations"] += 1
        elif event_type == "deployment":
            self.daily_stats[today]["deployments"] += 1
        elif event_type == "new_user":
            self.daily_stats[today]["new_users"] += 1
    
    def get_daily_stats(self, days: int = 7) -> List[Dict]:
        """Get daily statistics for the last N days"""
        stats = []
        for i in range(days):
            date = (datetime.utcnow() - timedelta(days=i)).strftime("%Y-%m-%d")
            stats.append({
                "date": date,
                "stats": self.daily_stats.get(date, {
                    "total_events": 0,
                    "ai_generations": 0,
                    "deployments": 0,
                    "new_users": 0,
                })
            })
        return list(reversed(stats))
    
    def get_user_stats(self, user_id: str) -> Dict:
        """Get stats for a specific user"""
        user_events = [e for e in self.events if e.get("user_id") == user_id]
        return {
            "total_events": len(user_events),
            "ai_generations": len([e for e in user_events if e["type"] == "ai_generation"]),
            "deployments": len([e for e in user_events if e["type"] == "deployment"]),
        }
    
    def get_summary(self) -> Dict[str, Any]:
        """Get analytics summary"""
        today = datetime.utcnow().strftime("%Y-%m-%d")
        today_stats = self.daily_stats.get(today, {})
        
        return {
            "today": today_stats,
            "total_events": len(self.events),
            "unique_users": len(set(e.get("user_id") for e in self.events if e.get("user_id"))),
        }

# Global analytics tracker instance
analytics_tracker = AnalyticsTracker()
