"""Calculator Session model"""
import uuid
from sqlalchemy import Column, String, Boolean, DateTime, ForeignKey, JSON, Text
from sqlalchemy.dialects.postgresql import UUID, INET
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base


class CalculatorSession(Base):
    """Calculator session (analytics) model"""
    __tablename__ = "calculator_sessions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Calculator relationship
    calculator_id = Column(UUID(as_uuid=True), ForeignKey("calculators.id", ondelete="CASCADE"), nullable=False)

    # Session tracking
    session_token = Column(String(255), unique=True, nullable=False, index=True)

    # Data
    inputs = Column(JSON, nullable=True)  # User inputs
    results = Column(JSON, nullable=True)  # Calculation results

    # Lead information (if captured)
    lead_email = Column(String(255), nullable=True)
    lead_name = Column(String(255), nullable=True)
    lead_company = Column(String(255), nullable=True)

    # Tracking
    ip_address = Column(INET, nullable=True)
    user_agent = Column(Text, nullable=True)
    referrer = Column(Text, nullable=True)

    # Status
    completed = Column(Boolean, default=False)
    exported = Column(Boolean, default=False)

    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    completed_at = Column(DateTime(timezone=True), nullable=True)

    # Relationships
    calculator = relationship("Calculator", back_populates="sessions")

    def __repr__(self):
        return f"<CalculatorSession {self.id} for Calculator {self.calculator_id}>"
