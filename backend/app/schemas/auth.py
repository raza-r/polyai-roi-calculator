"""Authentication schemas"""
from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional
from uuid import UUID
from datetime import datetime


class UserSignup(BaseModel):
    """User signup request"""
    email: EmailStr
    password: str = Field(..., min_length=8)
    full_name: Optional[str] = None
    organization_name: str = Field(..., min_length=2, max_length=100)

    @field_validator('password')
    @classmethod
    def validate_password(cls, v):
        """Validate password strength"""
        if len(v) < 8:
            raise ValueError('Password must be at least 8 characters')
        if not any(c.isdigit() for c in v):
            raise ValueError('Password must contain at least one digit')
        if not any(c.isupper() for c in v):
            raise ValueError('Password must contain at least one uppercase letter')
        return v


class UserLogin(BaseModel):
    """User login request"""
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    """Token response"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshTokenRequest(BaseModel):
    """Refresh token request"""
    refresh_token: str


class UserResponse(BaseModel):
    """User response"""
    id: UUID
    email: str
    full_name: Optional[str]
    organization_id: UUID
    role: str
    is_active: bool
    email_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True


class OrganizationResponse(BaseModel):
    """Organization response"""
    id: UUID
    name: str
    slug: str
    subscription_tier: str
    subscription_status: str
    trial_ends_at: Optional[datetime]
    created_at: datetime

    class Config:
        from_attributes = True


class AuthResponse(BaseModel):
    """Complete auth response with user and tokens"""
    user: UserResponse
    organization: OrganizationResponse
    tokens: TokenResponse
