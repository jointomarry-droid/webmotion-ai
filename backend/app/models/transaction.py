from sqlalchemy import Column, String, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    type = Column(String(30), nullable=False)  # subscription, credit_purchase, template_purchase, refund
    amount = Column(Float, nullable=False)
    currency = Column(String(3), default="USD", nullable=False)
    stripe_payment_id = Column(String(255), nullable=True)
    status = Column(String(20), default="pending", nullable=False)  # pending, completed, failed, refunded
    extra_data = Column(JSONB, default={}, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="transactions")

    def __repr__(self):
        return f"<Transaction {self.type} - {self.amount} {self.currency}>"
