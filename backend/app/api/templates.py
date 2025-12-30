"""Template API endpoints"""
from fastapi import APIRouter
from typing import List, Dict, Any

from ..services.templates import CalculatorTemplates

router = APIRouter(prefix="/api/templates", tags=["Templates"])


@router.get("", response_model=List[Dict[str, Any]])
def list_templates():
    """
    Get all available calculator templates.

    Returns a list of pre-built templates that users can customize.
    """
    return CalculatorTemplates.get_all_templates()


@router.get("/{template_id}", response_model=Dict[str, Any])
def get_template(template_id: str):
    """
    Get a specific template by ID.

    Template IDs:
    - voice-ai-roi: Voice AI ROI Calculator
    - saas-roi: SaaS ROI Calculator
    - cost-savings: Cost Savings Calculator
    - payback-period: Payback Period Calculator
    """
    return CalculatorTemplates.get_template(template_id)
