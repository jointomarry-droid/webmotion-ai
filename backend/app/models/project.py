from sqlalchemy import Column, String, Text, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    template_id = Column(UUID(as_uuid=True), ForeignKey("templates.id", ondelete="SET NULL"), nullable=True)
    generated_code = Column(Text, nullable=True)
    deployment_url = Column(String(500), nullable=True)
    deployment_status = Column(String(20), default="draft", nullable=False)
    settings = Column(JSONB, default={}, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="projects")
    template = relationship("Template")
    deployments = relationship("Deployment", back_populates="project", lazy="dynamic")
    ai_chats = relationship("AIChat", back_populates="project", lazy="dynamic")

    def __repr__(self):
        return f"<Project {self.name}>"


class Deployment(Base):
    __tablename__ = "deployments"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    project_id = Column(UUID(as_uuid=True), ForeignKey("projects.id", ondelete="CASCADE"), nullable=False)
    provider = Column(String(20), nullable=False)  # vercel, github, netlify
    repository_url = Column(String(500), nullable=True)
    deployment_url = Column(String(500), nullable=True)
    status = Column(String(20), default="pending", nullable=False)
    logs = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    project = relationship("Project", back_populates="deployments")

    def __repr__(self):
        return f"<Deployment {self.provider} - {self.status}>"
