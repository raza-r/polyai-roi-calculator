"""Authentication service"""
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import datetime, timedelta
from ..models.user import User
from ..models.organization import Organization
from ..utils.security import hash_password, verify_password, create_access_token, create_refresh_token, generate_slug
from ..schemas.auth import UserSignup, UserLogin, TokenResponse, AuthResponse, UserResponse, OrganizationResponse
from uuid import uuid4


class AuthService:
    """Authentication service for user management"""

    @staticmethod
    def signup(db: Session, signup_data: UserSignup) -> AuthResponse:
        """Register a new user and organization"""

        # Check if user already exists
        existing_user = db.query(User).filter(User.email == signup_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email already registered"
            )

        # Create organization
        org_slug = generate_slug(signup_data.organization_name)

        # Ensure unique slug
        base_slug = org_slug
        counter = 1
        while db.query(Organization).filter(Organization.slug == org_slug).first():
            org_slug = f"{base_slug}-{counter}"
            counter += 1

        organization = Organization(
            name=signup_data.organization_name,
            slug=org_slug,
            subscription_tier="free",
            subscription_status="trial",
            trial_ends_at=datetime.utcnow() + timedelta(days=14)  # 14-day trial
        )
        db.add(organization)
        db.flush()

        # Create user
        user = User(
            email=signup_data.email,
            password_hash=hash_password(signup_data.password),
            full_name=signup_data.full_name,
            organization_id=organization.id,
            role="admin",
            is_active=True,
            email_verified=False
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        db.refresh(organization)

        # Create tokens
        access_token = create_access_token({"sub": str(user.id), "org_id": str(organization.id)})
        refresh_token = create_refresh_token({"sub": str(user.id)})

        return AuthResponse(
            user=UserResponse.model_validate(user),
            organization=OrganizationResponse.model_validate(organization),
            tokens=TokenResponse(
                access_token=access_token,
                refresh_token=refresh_token
            )
        )

    @staticmethod
    def login(db: Session, login_data: UserLogin) -> AuthResponse:
        """Authenticate user and return tokens"""

        # Find user
        user = db.query(User).filter(User.email == login_data.email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )

        # Verify password
        if not verify_password(login_data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password"
            )

        # Check if user is active
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is disabled"
            )

        # Update last login
        user.last_login_at = datetime.utcnow()
        db.commit()

        # Get organization
        organization = db.query(Organization).filter(Organization.id == user.organization_id).first()

        # Create tokens
        access_token = create_access_token({"sub": str(user.id), "org_id": str(organization.id)})
        refresh_token = create_refresh_token({"sub": str(user.id)})

        return AuthResponse(
            user=UserResponse.model_validate(user),
            organization=OrganizationResponse.model_validate(organization),
            tokens=TokenResponse(
                access_token=access_token,
                refresh_token=refresh_token
            )
        )

    @staticmethod
    def refresh_token(db: Session, refresh_token: str) -> TokenResponse:
        """Refresh access token using refresh token"""
        from ..utils.security import verify_token

        # Verify refresh token
        payload = verify_token(refresh_token, token_type="refresh")
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token"
            )

        user_id = payload.get("sub")
        user = db.query(User).filter(User.id == user_id).first()

        if not user or not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found or inactive"
            )

        # Create new tokens
        access_token = create_access_token({"sub": str(user.id), "org_id": str(user.organization_id)})
        new_refresh_token = create_refresh_token({"sub": str(user.id)})

        return TokenResponse(
            access_token=access_token,
            refresh_token=new_refresh_token
        )
