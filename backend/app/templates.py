from .models import DealInputs, IntentRow, VerticalTemplate


def get_template(vertical: VerticalTemplate) -> DealInputs:
    """Get pre-configured template based on real PolyAI case studies"""
    
    # Base configuration - conservative defaults
    base_inputs = {
        "telco_cost_per_min": 0.05,
        "polyai_cost_per_min": 0.12,
        "acw_minutes": 1.0,
        "inflation": 0.03,
        "volume_growth": 0.05,
        "discount_rate": 0.10,
        "risk_adjustment": 0.1
    }
    
    templates = {
        # Based on PG&E case study: 16M calls/year, 41% containment, 22% CSAT increase during outages
        VerticalTemplate.UTILITIES: {
            **base_inputs,
            "annual_calls": 8000000,  # 8M calls (conservative vs PG&E's 16M)
            "agent_cost_per_min": 1.05,  # Higher skilled agents for regulated industry
            "baseline_abandon_rate": 0.35,  # High during outages (PG&E had 1+ hour waits)
            "ai_abandon_rate": 0.08,  # Dramatic improvement with PolyAI
            "business_hours_only": False,  # 24/7 utility operations
            "night_fraction": 0.4,  # More after-hours calls during emergencies
            "intents": [
                IntentRow(
                    name="Outage Reporting & Updates",
                    volume_share=0.45,  # Primary use case during emergencies
                    avg_minutes=2.5,
                    containment_m0=0.35,
                    containment_m3=0.85,  # High containment with location-based updates
                    handoff_minutes=0.5,
                    revenue_per_abandon=None  # Cost center, focus on CSAT
                ),
                IntentRow(
                    name="Billing Inquiries",
                    volume_share=0.25,
                    avg_minutes=3.0,
                    containment_m0=0.60,
                    containment_m3=0.90,
                    handoff_minutes=0.8,
                    revenue_per_abandon=None
                ),
                IntentRow(
                    name="Service Start/Stop",
                    volume_share=0.15,
                    avg_minutes=4.0,
                    containment_m0=0.30,
                    containment_m3=0.70,
                    handoff_minutes=1.5,
                    revenue_per_abandon=None
                ),
                IntentRow(
                    name="General FAQs",
                    volume_share=0.10,
                    avg_minutes=1.8,
                    containment_m0=0.75,
                    containment_m3=0.95,
                    handoff_minutes=0.2,
                    revenue_per_abandon=None
                ),
                IntentRow(
                    name="Safety/Gas Leaks",
                    volume_share=0.05,
                    avg_minutes=1.0,  # Immediate escalation
                    containment_m0=0.0,  # Never contained - immediate transfer
                    containment_m3=0.0,
                    handoff_minutes=0.1,  # Immediate handoff
                    revenue_per_abandon=None
                )
            ]
        },
        
        # Based on Côte Brasserie & Melting Pot: 76% conversion, £250k after-hours revenue
        VerticalTemplate.RESTAURANTS: {
            **base_inputs,
            "annual_calls": 350000,  # Mid-size restaurant chain
            "agent_cost_per_min": 0.75,  # Lower skilled front-of-house staff
            "baseline_abandon_rate": 0.30,  # High miss rate when staff busy
            "ai_abandon_rate": 0.05,  # PolyAI answers every call
            "business_hours_only": False,  # Key value: after-hours bookings
            "night_fraction": 0.35,  # 35% of calls outside business hours
            "intents": [
                IntentRow(
                    name="New Reservations",
                    volume_share=0.45,
                    avg_minutes=3.5,
                    containment_m0=0.50,
                    containment_m3=0.76,  # Côte's 76% conversion rate
                    handoff_minutes=1.0,
                    revenue_per_abandon=65.0  # Average reservation value
                ),
                IntentRow(
                    name="Reservation Changes",
                    volume_share=0.25,
                    avg_minutes=3.0,
                    containment_m0=0.60,
                    containment_m3=0.85,
                    handoff_minutes=0.8,
                    revenue_per_abandon=50.0  # Retention value
                ),
                IntentRow(
                    name="Cancellations",
                    volume_share=0.15,
                    avg_minutes=2.0,
                    containment_m0=0.70,
                    containment_m3=0.90,
                    handoff_minutes=0.3,
                    revenue_per_abandon=45.0  # Processing efficiency
                ),
                IntentRow(
                    name="Menu & Location Info",
                    volume_share=0.10,
                    avg_minutes=1.5,
                    containment_m0=0.85,
                    containment_m3=0.95,
                    handoff_minutes=0.2,
                    revenue_per_abandon=25.0  # Drives future bookings
                ),
                IntentRow(
                    name="Special Events & Groups",
                    volume_share=0.05,
                    avg_minutes=5.0,
                    containment_m0=0.30,
                    containment_m3=0.60,
                    handoff_minutes=2.0,
                    revenue_per_abandon=150.0  # High-value group bookings
                )
            ]
        },
        
        # Based on Quicken & Retail Bank: 21-30% containment, non-digital customer base
        VerticalTemplate.FINANCIAL_SERVICES: {
            **base_inputs,
            "annual_calls": 1200000,  # Large financial services volume
            "agent_cost_per_min": 1.10,  # Compliance and training requirements
            "baseline_abandon_rate": 0.15,  # Lower than other industries due to importance
            "ai_abandon_rate": 0.06,
            "business_hours_only": True,  # Traditional banking hours
            "night_fraction": 0.25,
            "intents": [
                IntentRow(
                    name="Account Balance & Statements",
                    volume_share=0.30,
                    avg_minutes=2.0,
                    containment_m0=0.45,
                    containment_m3=0.75,  # Quicken saw growth from 5% to 21%
                    handoff_minutes=0.5,
                    revenue_per_abandon=None  # Retention/satisfaction focus
                ),
                IntentRow(
                    name="Password Reset & Login Help",
                    volume_share=0.25,
                    avg_minutes=3.0,
                    containment_m0=0.35,
                    containment_m3=0.65,  # Non-digital natives need guidance
                    handoff_minutes=1.0,
                    revenue_per_abandon=None
                ),
                IntentRow(
                    name="Card Services",
                    volume_share=0.20,
                    avg_minutes=3.5,
                    containment_m0=0.40,
                    containment_m3=0.70,
                    handoff_minutes=1.2,
                    revenue_per_abandon=None
                ),
                IntentRow(
                    name="Payments & Transfers",
                    volume_share=0.15,
                    avg_minutes=4.0,
                    containment_m0=0.25,
                    containment_m3=0.55,  # Security concerns require human oversight
                    handoff_minutes=1.8,
                    revenue_per_abandon=None
                ),
                IntentRow(
                    name="Disputes & Complex Issues",
                    volume_share=0.10,
                    avg_minutes=6.0,
                    containment_m0=0.10,
                    containment_m3=0.35,  # Complex cases need human expertise
                    handoff_minutes=2.5,
                    revenue_per_abandon=None
                )
            ]
        },
        
        # Based on Howard Brown Health: 30% containment, 72% AHT reduction, crisis scaling
        VerticalTemplate.HEALTHCARE: {
            **base_inputs,
            "annual_calls": 180000,  # Howard Brown's normal volume
            "agent_cost_per_min": 1.25,  # Specialized healthcare training
            "baseline_abandon_rate": 0.20,  # Healthcare urgency creates pressure
            "ai_abandon_rate": 0.08,
            "business_hours_only": False,  # Healthcare is 24/7
            "night_fraction": 0.30,
            "intents": [
                IntentRow(
                    name="Appointment Scheduling",
                    volume_share=0.40,
                    avg_minutes=2.5,  # PolyAI: 1min vs human: 3.5min (72% reduction)
                    containment_m0=0.35,
                    containment_m3=0.60,  # Howard Brown achieved 30% overall
                    handoff_minutes=1.5,
                    revenue_per_abandon=None  # Access and care focus
                ),
                IntentRow(
                    name="Test Results & Records",
                    volume_share=0.20,
                    avg_minutes=2.0,
                    containment_m0=0.20,  # Privacy and sensitivity concerns
                    containment_m3=0.45,
                    handoff_minutes=1.0,
                    revenue_per_abandon=None
                ),
                IntentRow(
                    name="Prescription Refills",
                    volume_share=0.15,
                    avg_minutes=3.0,
                    containment_m0=0.40,
                    containment_m3=0.70,
                    handoff_minutes=1.2,
                    revenue_per_abandon=None
                ),
                IntentRow(
                    name="General Health Information",
                    volume_share=0.15,
                    avg_minutes=2.5,
                    containment_m0=0.60,
                    containment_m3=0.85,  # FAQs well-suited for AI
                    handoff_minutes=0.5,
                    revenue_per_abandon=None
                ),
                IntentRow(
                    name="Crisis & Emergency Info",
                    volume_share=0.10,
                    avg_minutes=1.5,
                    containment_m0=0.70,  # Information provision + immediate escalation
                    containment_m3=0.90,
                    handoff_minutes=0.3,
                    revenue_per_abandon=None
                )
            ]
        },
        
        # Based on Hopper: 15% containment for complex travel queries
        VerticalTemplate.TRAVEL: {
            **base_inputs,
            "annual_calls": 600000,  # Large travel platform volume
            "agent_cost_per_min": 0.95,
            "baseline_abandon_rate": 0.25,  # Travel issues create urgency
            "ai_abandon_rate": 0.12,
            "business_hours_only": False,  # Travel is global and 24/7
            "night_fraction": 0.45,  # International time zones
            "intents": [
                IntentRow(
                    name="Booking Questions & FAQs",
                    volume_share=0.35,
                    avg_minutes=3.0,
                    containment_m0=0.25,
                    containment_m3=0.50,  # Complex travel scenarios
                    handoff_minutes=1.5,
                    revenue_per_abandon=85.0  # Booking value
                ),
                IntentRow(
                    name="Flight Changes & Cancellations",
                    volume_share=0.25,
                    avg_minutes=5.0,
                    containment_m0=0.15,  # Complex policies and exceptions
                    containment_m3=0.35,
                    handoff_minutes=2.5,
                    revenue_per_abandon=120.0
                ),
                IntentRow(
                    name="Travel Alerts & Updates",
                    volume_share=0.20,
                    avg_minutes=2.0,
                    containment_m0=0.60,
                    containment_m3=0.85,  # Information-based queries
                    handoff_minutes=0.5,
                    revenue_per_abandon=None
                ),
                IntentRow(
                    name="Refund Requests",
                    volume_share=0.15,
                    avg_minutes=4.0,
                    containment_m0=0.10,  # Requires human judgment
                    containment_m3=0.25,
                    handoff_minutes=2.0,
                    revenue_per_abandon=95.0
                ),
                IntentRow(
                    name="Special Assistance",
                    volume_share=0.05,
                    avg_minutes=6.0,
                    containment_m0=0.05,  # Highly specialized needs
                    containment_m3=0.15,
                    handoff_minutes=3.0,
                    revenue_per_abandon=200.0  # High-value customer care
                )
            ]
        },
        
        # Enhanced retail based on existing template + case study insights
        VerticalTemplate.RETAIL: {
            **base_inputs,
            "annual_calls": 450000,
            "agent_cost_per_min": 0.85,
            "baseline_abandon_rate": 0.18,
            "ai_abandon_rate": 0.09,
            "business_hours_only": True,
            "night_fraction": 0.25,
            "intents": [
                IntentRow(
                    name="Order Status & Tracking",
                    volume_share=0.35,
                    avg_minutes=2.5,
                    containment_m0=0.60,
                    containment_m3=0.85,
                    handoff_minutes=0.5,
                    revenue_per_abandon=25.0
                ),
                IntentRow(
                    name="Returns & Exchanges",
                    volume_share=0.25,
                    avg_minutes=4.0,
                    containment_m0=0.40,
                    containment_m3=0.75,
                    handoff_minutes=1.0,
                    revenue_per_abandon=40.0
                ),
                IntentRow(
                    name="Product Information",
                    volume_share=0.20,
                    avg_minutes=3.0,
                    containment_m0=0.55,
                    containment_m3=0.80,
                    handoff_minutes=0.8,
                    revenue_per_abandon=35.0
                ),
                IntentRow(
                    name="Delivery & Shipping",
                    volume_share=0.15,
                    avg_minutes=3.5,
                    containment_m0=0.50,
                    containment_m3=0.80,
                    handoff_minutes=1.2,
                    revenue_per_abandon=30.0
                ),
                IntentRow(
                    name="Account & Loyalty",
                    volume_share=0.05,
                    avg_minutes=2.0,
                    containment_m0=0.70,
                    containment_m3=0.90,
                    handoff_minutes=0.3,
                    revenue_per_abandon=20.0
                )
            ]
        },
        
        # Based on Atos case study: 30% call reduction, 24/7 operations
        VerticalTemplate.CONTACT_CENTER: {
            **base_inputs,
            "annual_calls": 2500000,  # Large BPO operation
            "agent_cost_per_min": 0.90,  # Competitive BPO rates
            "baseline_abandon_rate": 0.25,  # High volume creates pressure
            "ai_abandon_rate": 0.08,
            "business_hours_only": False,  # Atos operates 24/7/365
            "night_fraction": 0.40,
            "intents": [
                IntentRow(
                    name="General FAQs",
                    volume_share=0.40,  # Atos achieved 30% automation
                    avg_minutes=2.5,
                    containment_m0=0.45,
                    containment_m3=0.75,
                    handoff_minutes=0.8,
                    revenue_per_abandon=None  # Cost center focus
                ),
                IntentRow(
                    name="Account Authentication",
                    volume_share=0.25,
                    avg_minutes=3.0,
                    containment_m0=0.35,
                    containment_m3=0.65,
                    handoff_minutes=1.2,
                    revenue_per_abandon=None
                ),
                IntentRow(
                    name="Service Requests",
                    volume_share=0.20,
                    avg_minutes=4.0,
                    containment_m0=0.25,
                    containment_m3=0.55,
                    handoff_minutes=1.8,
                    revenue_per_abandon=None
                ),
                IntentRow(
                    name="Technical Support L1",
                    volume_share=0.10,
                    avg_minutes=5.0,
                    containment_m0=0.20,
                    containment_m3=0.45,
                    handoff_minutes=2.5,
                    revenue_per_abandon=None
                ),
                IntentRow(
                    name="Escalations & Complex Cases",
                    volume_share=0.05,
                    avg_minutes=7.0,
                    containment_m0=0.05,
                    containment_m3=0.20,
                    handoff_minutes=3.0,
                    revenue_per_abandon=None
                )
            ]
        }
    }
    
    return DealInputs(**templates[vertical])