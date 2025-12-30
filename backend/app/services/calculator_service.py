"""Calculator service for business logic"""
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from fastapi import HTTPException, status
from typing import List, Optional, Dict, Any
from datetime import datetime
from uuid import UUID, uuid4
import secrets

from ..models.calculator import Calculator
from ..models.session import CalculatorSession
from ..models.organization import Organization
from ..models.user import User
from ..schemas.calculator import (
    CalculatorCreate, CalculatorUpdate, CalculatorResponse,
    CalculatorListResponse, SessionCreate, SessionResponse,
    LeadCaptureRequest, AnalyticsResponse
)
from ..utils.security import generate_slug
from .formula_engine import FormulaEngine


class CalculatorService:
    """Service for calculator operations"""

    @staticmethod
    def create_calculator(
        db: Session,
        user: User,
        calculator_data: CalculatorCreate
    ) -> Calculator:
        """Create a new calculator"""

        # Generate unique slug
        base_slug = generate_slug(calculator_data.name)
        slug = base_slug
        counter = 1

        while db.query(Calculator).filter(
            Calculator.organization_id == user.organization_id,
            Calculator.slug == slug
        ).first():
            slug = f"{base_slug}-{counter}"
            counter += 1

        # Create calculator
        calculator = Calculator(
            organization_id=user.organization_id,
            name=calculator_data.name,
            slug=slug,
            description=calculator_data.description,
            config=calculator_data.config,
            status="draft",
            created_by=user.id
        )

        db.add(calculator)
        db.commit()
        db.refresh(calculator)

        return calculator

    @staticmethod
    def get_calculator(
        db: Session,
        calculator_id: UUID,
        organization_id: UUID
    ) -> Calculator:
        """Get calculator by ID"""

        calculator = db.query(Calculator).filter(
            Calculator.id == calculator_id,
            Calculator.organization_id == organization_id
        ).first()

        if not calculator:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Calculator not found"
            )

        return calculator

    @staticmethod
    def get_calculator_by_slug(
        db: Session,
        org_slug: str,
        calc_slug: str
    ) -> Calculator:
        """Get calculator by organization slug and calculator slug (for public access)"""

        calculator = db.query(Calculator).join(Organization).filter(
            Organization.slug == org_slug,
            Calculator.slug == calc_slug,
            Calculator.status == "published"
        ).first()

        if not calculator:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Calculator not found or not published"
            )

        return calculator

    @staticmethod
    def list_calculators(
        db: Session,
        organization_id: UUID,
        page: int = 1,
        page_size: int = 20,
        status_filter: Optional[str] = None
    ) -> CalculatorListResponse:
        """List calculators for an organization"""

        query = db.query(Calculator).filter(
            Calculator.organization_id == organization_id
        )

        if status_filter:
            query = query.filter(Calculator.status == status_filter)

        # Count total
        total = query.count()

        # Paginate
        calculators = query.order_by(desc(Calculator.updated_at)).offset(
            (page - 1) * page_size
        ).limit(page_size).all()

        return CalculatorListResponse(
            items=[CalculatorResponse.model_validate(c) for c in calculators],
            total=total,
            page=page,
            page_size=page_size,
            has_more=total > page * page_size
        )

    @staticmethod
    def update_calculator(
        db: Session,
        calculator_id: UUID,
        organization_id: UUID,
        update_data: CalculatorUpdate
    ) -> Calculator:
        """Update calculator"""

        calculator = CalculatorService.get_calculator(db, calculator_id, organization_id)

        # Update fields
        if update_data.name is not None:
            calculator.name = update_data.name
        if update_data.description is not None:
            calculator.description = update_data.description
        if update_data.config is not None:
            calculator.config = update_data.config
        if update_data.status is not None:
            calculator.status = update_data.status
            if update_data.status == "published" and not calculator.published_at:
                calculator.published_at = datetime.utcnow()

        calculator.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(calculator)

        return calculator

    @staticmethod
    def delete_calculator(
        db: Session,
        calculator_id: UUID,
        organization_id: UUID
    ) -> None:
        """Delete calculator"""

        calculator = CalculatorService.get_calculator(db, calculator_id, organization_id)
        db.delete(calculator)
        db.commit()

    @staticmethod
    def publish_calculator(
        db: Session,
        calculator_id: UUID,
        organization_id: UUID
    ) -> Calculator:
        """Publish calculator"""

        calculator = CalculatorService.get_calculator(db, calculator_id, organization_id)
        calculator.status = "published"
        calculator.published_at = datetime.utcnow()
        calculator.updated_at = datetime.utcnow()

        db.commit()
        db.refresh(calculator)

        return calculator

    @staticmethod
    def create_session(
        db: Session,
        calculator: Calculator,
        inputs: Dict[str, Any],
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        referrer: Optional[str] = None
    ) -> CalculatorSession:
        """Create a calculator session and calculate results"""

        # Increment views
        calculator.views_count += 1

        # Generate session token
        session_token = secrets.token_urlsafe(32)

        # Calculate results using formula engine
        try:
            formulas = calculator.config.get("calculations", {}).get("formulas", {})

            # Convert formula list to dict if needed
            if isinstance(formulas, list):
                formulas = {f["id"]: f["formula"] for f in formulas}

            results = FormulaEngine.calculate_roi_metrics(inputs, formulas)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Calculation error: {str(e)}"
            )

        # Create session
        session = CalculatorSession(
            calculator_id=calculator.id,
            session_token=session_token,
            inputs=inputs,
            results=results,
            ip_address=ip_address,
            user_agent=user_agent,
            referrer=referrer,
            completed=True,
            completed_at=datetime.utcnow()
        )

        # Increment completions
        calculator.completions_count += 1

        db.add(session)
        db.commit()
        db.refresh(session)

        return session

    @staticmethod
    def capture_lead(
        db: Session,
        session_token: str,
        lead_data: LeadCaptureRequest
    ) -> CalculatorSession:
        """Capture lead information for a session"""

        session = db.query(CalculatorSession).filter(
            CalculatorSession.session_token == session_token
        ).first()

        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session not found"
            )

        # Update lead information
        session.lead_email = lead_data.email
        session.lead_name = lead_data.name
        session.lead_company = lead_data.company

        db.commit()
        db.refresh(session)

        return session

    @staticmethod
    def get_analytics(
        db: Session,
        calculator_id: UUID,
        organization_id: UUID
    ) -> AnalyticsResponse:
        """Get analytics for a calculator"""

        calculator = CalculatorService.get_calculator(db, calculator_id, organization_id)

        # Get sessions
        sessions = db.query(CalculatorSession).filter(
            CalculatorSession.calculator_id == calculator_id
        ).all()

        total_views = calculator.views_count
        total_completions = calculator.completions_count
        conversion_rate = (total_completions / total_views * 100) if total_views > 0 else 0
        leads_captured = sum(1 for s in sessions if s.lead_email)

        # Sessions by day
        sessions_by_day = db.query(
            func.date(CalculatorSession.created_at).label('date'),
            func.count(CalculatorSession.id).label('count')
        ).filter(
            CalculatorSession.calculator_id == calculator_id
        ).group_by(
            func.date(CalculatorSession.created_at)
        ).all()

        sessions_by_day_data = [
            {"date": str(day.date), "count": day.count}
            for day in sessions_by_day
        ]

        # Top results (most common ROI ranges)
        top_results = []  # TODO: Implement based on results data

        return AnalyticsResponse(
            calculator_id=calculator_id,
            total_views=total_views,
            total_completions=total_completions,
            conversion_rate=conversion_rate,
            leads_captured=leads_captured,
            avg_time_to_complete=None,  # TODO: Calculate
            sessions_by_day=sessions_by_day_data,
            top_results=top_results
        )
