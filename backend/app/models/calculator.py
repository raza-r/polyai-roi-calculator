"""Calculator model"""
import uuid
from sqlalchemy import Column, String, Text, Integer, DateTime, ForeignKey, JSON, UniqueConstraint
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class Calculator(Base):
    """Calculator configuration model"""
    __tablename__ = "calculators"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Organization relationship
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)

    # Basic info
    name = Column(String(255), nullable=False)
    slug = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String(50), default="draft")  # draft, published, archived

    # Configuration (full calculator config in JSON)
    config = Column(JSON, nullable=False)

    # Creator
    created_by = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)

    # Analytics
    views_count = Column(Integer, default=0)
    completions_count = Column(Integer, default=0)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    published_at = Column(DateTime(timezone=True), nullable=True)

    # Constraints
    __table_args__ = (
        UniqueConstraint('organization_id', 'slug', name='uix_org_slug'),
    )

    # Relationships
    organization = relationship("Organization", back_populates="calculators")
    creator = relationship("User", foreign_keys=[created_by], back_populates="created_calculators")
    sessions = relationship("CalculatorSession", back_populates="calculator", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Calculator {self.name} ({self.slug})>"
