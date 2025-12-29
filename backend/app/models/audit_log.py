"""Audit Log model"""
import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, JSON
from sqlalchemy.dialects.postgresql import UUID, INET
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class AuditLog(Base):
    """Audit log for tracking changes"""
    __tablename__ = "audit_logs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Organization relationship
    organization_id = Column(UUID(as_uuid=True), ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False)

    # User (optional, may be null for system actions)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)

    # Action details
    action = Column(String(100), nullable=False)  # created_calculator, updated_config, etc.
    resource_type = Column(String(50), nullable=True)  # calculator, organization, user
    resource_id = Column(UUID(as_uuid=True), nullable=True)

    # Changes
    changes = Column(JSON, nullable=True)

    # Tracking
    ip_address = Column(INET, nullable=True)

    # Timestamp
    created_at = Column(DateTime(timezone=True), server_default=func.now(), index=True)

    # Relationships
    organization = relationship("Organization", back_populates="audit_logs")

    def __repr__(self):
        return f"<AuditLog {self.action} on {self.resource_type}>"
