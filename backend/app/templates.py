from .models import DealInputs, IntentRow, VerticalTemplate


def get_template(vertical: VerticalTemplate) -> DealInputs:
    """Get pre-configured template for different verticals"""
    
    base_inputs = {
        "annual_calls": 100000,
        "agent_cost_per_min": 0.8,
        "telco_cost_per_min": 0.05,
        "polyai_cost_per_min": 0.12,
        "acw_minutes": 1.0,
        "baseline_abandon_rate": 0.15,
        "ai_abandon_rate": 0.08,
        "business_hours_only": True,
        "night_fraction": 0.3,
        "inflation": 0.03,
        "volume_growth": 0.05,
        "discount_rate": 0.10,
        "risk_adjustment": 0.1
    }
    
    templates = {
        VerticalTemplate.RETAIL: {
            **base_inputs,
            "intents": [
                IntentRow(
                    name="Order Status",
                    volume_share=0.35,
                    avg_minutes=2.5,
                    containment_m0=0.6,
                    containment_m3=0.85,
                    handoff_minutes=0.5,
                    revenue_per_abandon=25.0
                ),
                IntentRow(
                    name="Returns & Exchanges",
                    volume_share=0.25,
                    avg_minutes=4.0,
                    containment_m0=0.4,
                    containment_m3=0.75,
                    handoff_minutes=1.0,
                    revenue_per_abandon=40.0
                ),
                IntentRow(
                    name="Store Hours & Locations",
                    volume_share=0.15,
                    avg_minutes=1.5,
                    containment_m0=0.8,
                    containment_m3=0.95,
                    handoff_minutes=0.2,
                    revenue_per_abandon=15.0
                ),
                IntentRow(
                    name="Delivery Issues",
                    volume_share=0.15,
                    avg_minutes=3.5,
                    containment_m0=0.5,
                    containment_m3=0.80,
                    handoff_minutes=1.2,
                    revenue_per_abandon=35.0
                ),
                IntentRow(
                    name="Loyalty Program",
                    volume_share=0.10,
                    avg_minutes=2.0,
                    containment_m0=0.7,
                    containment_m3=0.90,
                    handoff_minutes=0.3,
                    revenue_per_abandon=20.0
                )
            ]
        },
        
        VerticalTemplate.FINANCIAL_SERVICES: {
            **base_inputs,
            "agent_cost_per_min": 1.2,  # Higher skilled agents
            "baseline_abandon_rate": 0.12,
            "ai_abandon_rate": 0.06,
            "intents": [
                IntentRow(
                    name="Card Activation",
                    volume_share=0.20,
                    avg_minutes=3.0,
                    containment_m0=0.7,
                    containment_m3=0.90,
                    handoff_minutes=0.5,
                    revenue_per_abandon=None
                ),
                IntentRow(
                    name="Balance Inquiry",
                    volume_share=0.25,
                    avg_minutes=1.5,
                    containment_m0=0.8,
                    containment_m3=0.95,
                    handoff_minutes=0.2,
                    revenue_per_abandon=None
                ),
                IntentRow(
                    name="Dispute Resolution",
                    volume_share=0.15,
                    avg_minutes=6.0,
                    containment_m0=0.3,
                    containment_m3=0.60,
                    handoff_minutes=2.0,
                    revenue_per_abandon=None
                ),
                IntentRow(
                    name="Lost/Stolen Cards",
                    volume_share=0.20,
                    avg_minutes=4.0,
                    containment_m0=0.5,
                    containment_m3=0.80,
                    handoff_minutes=1.0,
                    revenue_per_abandon=None
                ),
                IntentRow(
                    name="KYC & Identity Verification",
                    volume_share=0.20,
                    avg_minutes=5.5,
                    containment_m0=0.2,
                    containment_m3=0.55,
                    handoff_minutes=2.5,
                    revenue_per_abandon=None
                )
            ]
        },
        
        VerticalTemplate.TELCO: {
            **base_inputs,
            "annual_calls": 150000,
            "baseline_abandon_rate": 0.18,
            "ai_abandon_rate": 0.10,
            "intents": [
                IntentRow(
                    name="Plan Changes",
                    volume_share=0.25,
                    avg_minutes=4.5,
                    containment_m0=0.4,
                    containment_m3=0.70,
                    handoff_minutes=1.5,
                    revenue_per_abandon=45.0
                ),
                IntentRow(
                    name="Billing Inquiries",
                    volume_share=0.30,
                    avg_minutes=3.0,
                    containment_m0=0.6,
                    containment_m3=0.85,
                    handoff_minutes=0.8,
                    revenue_per_abandon=30.0
                ),
                IntentRow(
                    name="Tech Support Tier-0",
                    volume_share=0.20,
                    avg_minutes=5.0,
                    containment_m0=0.3,
                    containment_m3=0.65,
                    handoff_minutes=2.0,
                    revenue_per_abandon=None
                ),
                IntentRow(
                    name="Outage Information",
                    volume_share=0.15,
                    avg_minutes=2.0,
                    containment_m0=0.8,
                    containment_m3=0.95,
                    handoff_minutes=0.3,
                    revenue_per_abandon=None
                ),
                IntentRow(
                    name="Device Upgrade",
                    volume_share=0.10,
                    avg_minutes=6.0,
                    containment_m0=0.3,
                    containment_m3=0.60,
                    handoff_minutes=2.5,
                    revenue_per_abandon=150.0
                )
            ]
        },
        
        VerticalTemplate.HOSPITALITY: {
            **base_inputs,
            "annual_calls": 75000,
            "baseline_abandon_rate": 0.20,
            "ai_abandon_rate": 0.09,
            "business_hours_only": False,  # 24/7 operation
            "intents": [
                IntentRow(
                    name="Reservations",
                    volume_share=0.40,
                    avg_minutes=3.5,
                    containment_m0=0.5,
                    containment_m3=0.80,
                    handoff_minutes=1.0,
                    revenue_per_abandon=120.0
                ),
                IntentRow(
                    name="Modifications",
                    volume_share=0.25,
                    avg_minutes=4.0,
                    containment_m0=0.4,
                    containment_m3=0.75,
                    handoff_minutes=1.5,
                    revenue_per_abandon=80.0
                ),
                IntentRow(
                    name="Cancellations",
                    volume_share=0.15,
                    avg_minutes=2.5,
                    containment_m0=0.7,
                    containment_m3=0.90,
                    handoff_minutes=0.5,
                    revenue_per_abandon=100.0
                ),
                IntentRow(
                    name="General FAQ",
                    volume_share=0.15,
                    avg_minutes=1.8,
                    containment_m0=0.8,
                    containment_m3=0.95,
                    handoff_minutes=0.2,
                    revenue_per_abandon=None
                ),
                IntentRow(
                    name="Loyalty Program",
                    volume_share=0.05,
                    avg_minutes=2.2,
                    containment_m0=0.6,
                    containment_m3=0.85,
                    handoff_minutes=0.4,
                    revenue_per_abandon=50.0
                )
            ]
        }
    }
    
    return DealInputs(**templates[vertical])