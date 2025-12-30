"""Calculator API endpoints"""
from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session
from typing import Optional
from uuid import UUID

from ..database import get_db
from ..middleware.auth import get_current_user, get_current_organization, get_optional_user
from ..models.user import User
from ..models.organization import Organization
from ..schemas.calculator import (
    CalculatorCreate, CalculatorUpdate, CalculatorResponse,
    CalculatorListResponse, SessionCreate, SessionResponse,
    LeadCaptureRequest, AnalyticsResponse
)
from ..services.calculator_service import CalculatorService

router = APIRouter(prefix="/api/calculators", tags=["Calculators"])


@router.post("", response_model=CalculatorResponse, status_code=status.HTTP_201_CREATED)
def create_calculator(
    calculator_data: CalculatorCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Create a new calculator.

    Creates a calculator for the user's organization.
    Calculator is created in draft status by default.
    """
    calculator = CalculatorService.create_calculator(db, current_user, calculator_data)
    return CalculatorResponse.model_validate(calculator)


@router.get("", response_model=CalculatorListResponse)
def list_calculators(
    page: int = 1,
    page_size: int = 20,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_org: Organization = Depends(get_current_organization)
):
    """
    List all calculators for the organization.

    Supports pagination and filtering by status.
    """
    return CalculatorService.list_calculators(
        db, current_org.id, page, page_size, status
    )


@router.get("/{calculator_id}", response_model=CalculatorResponse)
def get_calculator(
    calculator_id: UUID,
    db: Session = Depends(get_db),
    current_org: Organization = Depends(get_current_organization)
):
    """
    Get a specific calculator by ID.

    Only returns calculators owned by the user's organization.
    """
    calculator = CalculatorService.get_calculator(db, calculator_id, current_org.id)
    return CalculatorResponse.model_validate(calculator)


@router.patch("/{calculator_id}", response_model=CalculatorResponse)
def update_calculator(
    calculator_id: UUID,
    update_data: CalculatorUpdate,
    db: Session = Depends(get_db),
    current_org: Organization = Depends(get_current_organization)
):
    """
    Update a calculator.

    Can update name, description, config, or status.
    """
    calculator = CalculatorService.update_calculator(
        db, calculator_id, current_org.id, update_data
    )
    return CalculatorResponse.model_validate(calculator)


@router.delete("/{calculator_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_calculator(
    calculator_id: UUID,
    db: Session = Depends(get_db),
    current_org: Organization = Depends(get_current_organization)
):
    """
    Delete a calculator.

    Permanently deletes the calculator and all associated sessions.
    """
    CalculatorService.delete_calculator(db, calculator_id, current_org.id)


@router.post("/{calculator_id}/publish", response_model=CalculatorResponse)
def publish_calculator(
    calculator_id: UUID,
    db: Session = Depends(get_db),
    current_org: Organization = Depends(get_current_organization)
):
    """
    Publish a calculator.

    Makes the calculator publicly accessible via embed/public URL.
    """
    calculator = CalculatorService.publish_calculator(db, calculator_id, current_org.id)
    return CalculatorResponse.model_validate(calculator)


@router.get("/{calculator_id}/analytics", response_model=AnalyticsResponse)
def get_calculator_analytics(
    calculator_id: UUID,
    db: Session = Depends(get_db),
    current_org: Organization = Depends(get_current_organization)
):
    """
    Get analytics for a calculator.

    Returns views, completions, conversion rate, leads captured, etc.
    """
    return CalculatorService.get_analytics(db, calculator_id, current_org.id)


# Public endpoints (no auth required)

@router.get("/public/{org_slug}/{calc_slug}", response_model=CalculatorResponse)
def get_public_calculator(
    org_slug: str,
    calc_slug: str,
    db: Session = Depends(get_db)
):
    """
    Get a published calculator by organization and calculator slug.

    This is a public endpoint - no authentication required.
    Used for rendering the calculator embed/public page.
    """
    calculator = CalculatorService.get_calculator_by_slug(db, org_slug, calc_slug)
    return CalculatorResponse.model_validate(calculator)


@router.post("/public/{org_slug}/{calc_slug}/calculate", response_model=SessionResponse)
async def calculate_public(
    org_slug: str,
    calc_slug: str,
    inputs: dict,
    request: Request,
    db: Session = Depends(get_db)
):
    """
    Calculate results for a public calculator.

    Creates a session with the provided inputs and returns results.
    This is a public endpoint - no authentication required.
    """
    # Get calculator
    calculator = CalculatorService.get_calculator_by_slug(db, org_slug, calc_slug)

    # Extract tracking info
    ip_address = request.client.host if request.client else None
    user_agent = request.headers.get("user-agent")
    referrer = request.headers.get("referer")

    # Create session and calculate
    session = CalculatorService.create_session(
        db, calculator, inputs, ip_address, user_agent, referrer
    )

    return SessionResponse.model_validate(session)


@router.post("/sessions/capture-lead", response_model=SessionResponse)
def capture_lead(
    lead_data: LeadCaptureRequest,
    db: Session = Depends(get_db)
):
    """
    Capture lead information for a session.

    This is a public endpoint - no authentication required.
    Used when user provides email after seeing results.
    """
    session = CalculatorService.capture_lead(db, lead_data.session_token, lead_data)
    return SessionResponse.model_validate(session)
