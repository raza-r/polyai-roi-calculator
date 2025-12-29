"""Organization model"""
import uuid
from sqlalchemy import Column, String, Boolean, DateTime, JSON
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class Organization(Base):
    """Organization (tenant) model"""
    __tablename__ = "organizations"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    name = Column(String(255), nullable=False)
    slug = Column(String(100), unique=True, nullable=False, index=True)
    domain = Column(String(255), nullable=True)  # Custom domain

    # Subscription
    subscription_tier = Column(String(50), default="free")  # free, starter, pro, enterprise
    subscription_status = Column(String(50), default="trial")  # trial, active, canceled, past_due
    stripe_customer_id = Column(String(255), nullable=True)
    trial_ends_at = Column(DateTime(timezone=True), nullable=True)

    # Settings
    settings = Column(JSON, default={})

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationships
    users = relationship("User", back_populates="organization", cascade="all, delete-orphan")
    calculators = relationship("Calculator", back_populates="organization", cascade="all, delete-orphan")
    api_keys = relationship("APIKey", back_populates="organization", cascade="all, delete-orphan")
    audit_logs = relationship("AuditLog", back_populates="organization", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Organization {self.name} ({self.slug})>"
