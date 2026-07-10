from sqlalchemy import Column, String, Text, Boolean, Integer, Float, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, ARRAY, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base

class Template(Base):
    __tablename__ = "templates"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    creator_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    category = Column(String(50), nullable=False, index=True)
    subcategory = Column(String(100), nullable=True)
    prompt_content = Column(Text, nullable=False)
    code_output = Column(Text, nullable=True)
    preview_image = Column(String(500), nullable=True)
    preview_video = Column(String(500), nullable=True)
    tags = Column(ARRAY(String), default=[], nullable=False)
    is_premium = Column(Boolean, default=False, nullable=False)
    price = Column(Float, default=0, nullable=False)
    downloads = Column(Integer, default=0, nullable=False)
    rating = Column(Float, default=0, nullable=False)
    rating_count = Column(Integer, default=0, nullable=False)
    status = Column(String(20), default="draft", nullable=False, index=True)
    extra_data = Column(JSONB, default={}, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    creator = relationship("User", back_populates="templates")
    reviews = relationship("TemplateReview", back_populates="template", lazy="dynamic")

    def __repr__(self):
        return f"<Template {self.title}>"


class TemplateReview(Base):
    __tablename__ = "template_reviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    template_id = Column(UUID(as_uuid=True), ForeignKey("templates.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    rating = Column(Integer, nullable=False)  # 1-5
    comment = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    template = relationship("Template", back_populates="reviews")
    user = relationship("User")

    def __repr__(self):
        return f"<TemplateReview {self.rating}>"
