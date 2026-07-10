from sqlalchemy import Column, String, Boolean, Integer, DateTime
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, nullable=False, index=True)
    name = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    subscription_tier = Column(String, default="free", nullable=False)
    ai_credits = Column(Integer, default=100, nullable=False)
    lifetime_deal = Column(Boolean, default=False, nullable=False)
    stripe_customer_id = Column(String, nullable=True, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    templates = relationship("Template", back_populates="creator", lazy="dynamic")
    projects = relationship("Project", back_populates="user", lazy="dynamic")
    transactions = relationship("Transaction", back_populates="user", lazy="dynamic")

    def __repr__(self):
        return f"<User {self.email}>"
