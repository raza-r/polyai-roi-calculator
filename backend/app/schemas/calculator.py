"""Calculator schemas for API requests and responses"""
from pydantic import BaseModel, Field, field_validator
from typing import Optional, Dict, Any, List
from uuid import UUID
from datetime import datetime
from enum import Enum


class CalculatorStatus(str, Enum):
    """Calculator status"""
    DRAFT = "draft"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class CalculatorCreate(BaseModel):
    """Create calculator request"""
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    template_id: Optional[str] = None  # If creating from template
    config: Dict[str, Any] = Field(..., description="Calculator configuration")

    @field_validator('name')
    @classmethod
    def validate_name(cls, v):
        if not v.strip():
            raise ValueError('Name cannot be empty')
        return v.strip()


class CalculatorUpdate(BaseModel):
    """Update calculator request"""
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    config: Optional[Dict[str, Any]] = None
    status: Optional[CalculatorStatus] = None


class CalculatorResponse(BaseModel):
    """Calculator response"""
    id: UUID
    organization_id: UUID
    name: str
    slug: str
    description: Optional[str]
    status: CalculatorStatus
    config: Dict[str, Any]
    views_count: int
    completions_count: int
    created_at: datetime
    updated_at: datetime
    published_at: Optional[datetime]

    # Computed fields
    public_url: Optional[str] = None
    embed_url: Optional[str] = None

    class Config:
        from_attributes = True


class CalculatorListResponse(BaseModel):
    """List of calculators with pagination"""
    items: List[CalculatorResponse]
    total: int
    page: int
    page_size: int
    has_more: bool


class TemplateResponse(BaseModel):
    """Calculator template response"""
    id: str
    name: str
    description: str
    category: str
    thumbnail_url: Optional[str]
    config: Dict[str, Any]
    use_cases: List[str]


class SessionCreate(BaseModel):
    """Create calculator session request"""
    calculator_id: UUID
    inputs: Dict[str, Any]


class SessionResponse(BaseModel):
    """Calculator session response"""
    id: UUID
    session_token: str
    calculator_id: UUID
    inputs: Dict[str, Any]
    results: Optional[Dict[str, Any]]
    completed: bool
    created_at: datetime

    class Config:
        from_attributes = True


class LeadCaptureRequest(BaseModel):
    """Lead capture request"""
    session_token: str
    email: str = Field(..., pattern=r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$')
    name: Optional[str] = None
    company: Optional[str] = None


class AnalyticsResponse(BaseModel):
    """Analytics for a calculator"""
    calculator_id: UUID
    total_views: int
    total_completions: int
    conversion_rate: float
    leads_captured: int
    avg_time_to_complete: Optional[float]
    sessions_by_day: List[Dict[str, Any]]
    top_results: List[Dict[str, Any]]
