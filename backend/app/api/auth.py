"""Authentication API endpoints"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database import get_db
from ..schemas.auth import UserSignup, UserLogin, AuthResponse, TokenResponse, RefreshTokenRequest, UserResponse
from ..services.auth_service import AuthService
from ..middleware.auth import get_current_user
from ..models.user import User

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


@router.post("/signup", response_model=AuthResponse, status_code=status.HTTP_201_CREATED)
def signup(signup_data: UserSignup, db: Session = Depends(get_db)):
    """
    Register a new user and organization.

    Creates a new organization and user account with a 14-day free trial.
    Returns user data, organization data, and authentication tokens.
    """
    return AuthService.signup(db, signup_data)


@router.post("/login", response_model=AuthResponse)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate user and get tokens.

    Returns user data, organization data, and authentication tokens.
    """
    return AuthService.login(db, login_data)


@router.post("/refresh", response_model=TokenResponse)
def refresh_token(refresh_data: RefreshTokenRequest, db: Session = Depends(get_db)):
    """
    Refresh access token using refresh token.

    Returns new access token and refresh token.
    """
    return AuthService.refresh_token(db, refresh_data.refresh_token)


@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    """
    Get current authenticated user.

    Returns the current user's profile information.
    """
    return UserResponse.model_validate(current_user)


@router.post("/logout")
def logout():
    """
    Logout user (client should discard tokens).

    In a stateless JWT system, logout is handled client-side by discarding tokens.
    This endpoint is provided for consistency but doesn't perform server-side operations.
    """
    return {"message": "Logged out successfully"}
