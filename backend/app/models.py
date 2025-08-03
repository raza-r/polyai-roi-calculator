from pydantic import BaseModel, Field, field_validator
from typing import List, Optional, Dict, Tuple
from enum import Enum


class IntentRow(BaseModel):
    name: str
    volume_share: float = Field(..., ge=0, le=1, description="Share of total volume (0-1)")
    avg_minutes: float = Field(..., gt=0, description="Average minutes per call")
    containment_m0: float = Field(..., ge=0, le=1, description="Initial containment rate")
    containment_m3: float = Field(..., ge=0, le=1, description="Steady-state containment rate")
    handoff_minutes: float = Field(..., ge=0, description="Additional minutes when bot hands off")
    revenue_per_abandon: Optional[float] = Field(None, ge=0, description="Revenue saved per prevented abandon")


class DealInputs(BaseModel):
    annual_calls: int = Field(..., gt=0, description="Annual call volume")
    intents: List[IntentRow] = Field(..., min_length=1, max_length=20)
    agent_cost_per_min: float = Field(..., gt=0, description="Agent cost per minute (£)")
    telco_cost_per_min: float = Field(..., gt=0, description="Telephony cost per minute (£)")
    polyai_cost_per_min: float = Field(..., gt=0, description="PolyAI cost per minute (£)")
    acw_minutes: float = Field(1.0, ge=0, description="After-call work minutes")
    baseline_abandon_rate: float = Field(..., ge=0, le=1, description="Current abandon rate")
    ai_abandon_rate: float = Field(..., ge=0, le=1, description="Post-AI abandon rate")
    business_hours_only: bool = Field(True, description="Business hours only vs 24/7")
    night_fraction: float = Field(0.3, ge=0, le=1, description="Fraction of calls outside business hours")
    inflation: float = Field(0.03, ge=0, le=0.2, description="Annual inflation rate")
    volume_growth: float = Field(0.05, ge=0, le=0.5, description="Annual volume growth rate")
    discount_rate: float = Field(0.10, ge=0, le=0.3, description="Discount rate for NPV")
    risk_adjustment: float = Field(0.0, ge=0, le=1, description="Containment risk adjustment")

    @field_validator('intents')
    @classmethod
    def validate_volume_shares(cls, v):
        total_share = sum(intent.volume_share for intent in v)
        if abs(total_share - 1.0) > 0.01:
            raise ValueError(f"Volume shares must sum to 1.0, got {total_share}")
        return v


class YearResult(BaseModel):
    year: int
    baseline_minutes: float
    automated_minutes: float
    handoff_minutes: float
    human_minutes: float
    baseline_cost: float
    ai_cost: float
    ops_savings: float
    revenue_retained: float
    total_value: float
    cumulative_value: float
    discounted_value: float


class Results(BaseModel):
    payback_months: Optional[float] = Field(None, description="Months to payback, None if never")
    roi_5y: float = Field(..., description="5-year ROI percentage")
    npv_5y: float = Field(..., description="5-year Net Present Value")
    ops_vs_revenue_split: Dict[str, float] = Field(..., description="Split between ops savings and revenue")
    tornado: List[Tuple[str, float]] = Field(..., description="Top sensitivity drivers")
    p10_p50_p90: Dict[str, float] = Field(..., description="Scenario analysis")
    yearly: List[YearResult] = Field(..., description="Year-by-year breakdown")


class VerticalTemplate(str, Enum):
    UTILITIES = "utilities"
    RESTAURANTS = "restaurants"
    FINANCIAL_SERVICES = "financial_services"
    HEALTHCARE = "healthcare"
    TRAVEL = "travel"
    RETAIL = "retail"
    CONTACT_CENTER = "contact_center"