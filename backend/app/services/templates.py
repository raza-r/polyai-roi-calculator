"""Calculator templates for quick start"""
from typing import Dict, List, Any


class CalculatorTemplates:
    """Pre-built calculator templates"""

    @staticmethod
    def get_all_templates() -> List[Dict[str, Any]]:
        """Get all available templates"""
        return [
            CalculatorTemplates.voice_ai_roi(),
            CalculatorTemplates.saas_roi(),
            CalculatorTemplates.cost_savings(),
            CalculatorTemplates.payback_period(),
        ]

    @staticmethod
    def get_template(template_id: str) -> Dict[str, Any]:
        """Get a specific template by ID"""
        templates = {
            "voice-ai-roi": CalculatorTemplates.voice_ai_roi(),
            "saas-roi": CalculatorTemplates.saas_roi(),
            "cost-savings": CalculatorTemplates.cost_savings(),
            "payback-period": CalculatorTemplates.payback_period(),
        }

        template = templates.get(template_id)
        if not template:
            raise ValueError(f"Template '{template_id}' not found")

        return template

    @staticmethod
    def voice_ai_roi() -> Dict[str, Any]:
        """Voice AI ROI Calculator (based on PolyAI)"""
        return {
            "id": "voice-ai-roi",
            "name": "Voice AI ROI Calculator",
            "description": "Calculate ROI for voice AI/chatbot implementation with call deflection and automation",
            "category": "AI & Automation",
            "thumbnail_url": None,
            "use_cases": [
                "Contact centers implementing voice AI",
                "Customer service automation",
                "Call deflection ROI analysis"
            ],
            "config": {
                "version": "1.0",
                "metadata": {
                    "name": "Voice AI ROI Calculator",
                    "description": "Calculate ROI for voice AI implementation",
                    "industry": "contact_center"
                },
                "branding": {
                    "company_name": "Your Company",
                    "primary_color": "#3B82F6",
                    "secondary_color": "#10B981"
                },
                "inputs": {
                    "global_parameters": [
                        {
                            "id": "annual_calls",
                            "label": "Annual Call Volume",
                            "type": "number",
                            "default": 100000,
                            "min": 0,
                            "help_text": "Total inbound calls per year",
                            "required": True
                        },
                        {
                            "id": "agent_cost_per_min",
                            "label": "Agent Cost per Minute ($)",
                            "type": "number",
                            "default": 0.80,
                            "min": 0,
                            "help_text": "Fully loaded cost of human agent per minute",
                            "required": True
                        },
                        {
                            "id": "ai_cost_per_min",
                            "label": "AI Cost per Minute ($)",
                            "type": "number",
                            "default": 0.12,
                            "min": 0,
                            "help_text": "Cost of AI/bot per minute",
                            "required": True
                        },
                        {
                            "id": "avg_call_minutes",
                            "label": "Average Call Duration (minutes)",
                            "type": "number",
                            "default": 5,
                            "min": 0,
                            "help_text": "Average minutes per call",
                            "required": True
                        },
                        {
                            "id": "containment_rate",
                            "label": "AI Containment Rate (%)",
                            "type": "percentage",
                            "default": 70,
                            "min": 0,
                            "max": 100,
                            "help_text": "Percentage of calls fully handled by AI without human escalation",
                            "required": True
                        }
                    ]
                },
                "calculations": {
                    "engine": "formula",
                    "formulas": {
                        "baseline_cost": "annual_calls * agent_cost_per_min * avg_call_minutes",
                        "ai_handled_calls": "annual_calls * (containment_rate / 100)",
                        "human_handled_calls": "annual_calls - ai_handled_calls",
                        "ai_cost": "ai_handled_calls * ai_cost_per_min * avg_call_minutes",
                        "human_cost": "human_handled_calls * agent_cost_per_min * avg_call_minutes",
                        "new_total_cost": "ai_cost + human_cost",
                        "annual_savings": "baseline_cost - new_total_cost",
                        "savings_5y": "annual_savings * 5",
                        "roi_5y": "(savings_5y / (ai_cost * 5)) * 100",
                        "payback_months": "(ai_cost * 12) / annual_savings"
                    }
                },
                "outputs": {
                    "primary_metrics": [
                        {
                            "id": "annual_savings",
                            "label": "Annual Savings",
                            "format": "currency",
                            "highlight": True
                        },
                        {
                            "id": "roi_5y",
                            "label": "5-Year ROI",
                            "format": "percentage",
                            "highlight": True
                        },
                        {
                            "id": "payback_months",
                            "label": "Payback Period",
                            "format": "months"
                        }
                    ]
                },
                "lead_capture": {
                    "enabled": True,
                    "trigger": "on_export",
                    "roi_threshold": 100
                }
            }
        }

    @staticmethod
    def saas_roi() -> Dict[str, Any]:
        """SaaS ROI Calculator"""
        return {
            "id": "saas-roi",
            "name": "SaaS ROI Calculator",
            "description": "Calculate ROI for SaaS product adoption vs current solution",
            "category": "SaaS",
            "thumbnail_url": None,
            "use_cases": [
                "SaaS sales teams",
                "Product marketing",
                "Customer success"
            ],
            "config": {
                "version": "1.0",
                "metadata": {
                    "name": "SaaS ROI Calculator",
                    "description": "Calculate ROI for switching to our SaaS solution",
                    "industry": "saas"
                },
                "branding": {
                    "company_name": "Your SaaS Company",
                    "primary_color": "#6366F1",
                    "secondary_color": "#EC4899"
                },
                "inputs": {
                    "global_parameters": [
                        {
                            "id": "users",
                            "label": "Number of Users",
                            "type": "number",
                            "default": 50,
                            "min": 1,
                            "required": True
                        },
                        {
                            "id": "current_cost_per_user",
                            "label": "Current Cost per User/Month ($)",
                            "type": "number",
                            "default": 50,
                            "min": 0,
                            "required": True
                        },
                        {
                            "id": "our_cost_per_user",
                            "label": "Our Price per User/Month ($)",
                            "type": "number",
                            "default": 30,
                            "min": 0,
                            "required": True
                        },
                        {
                            "id": "productivity_gain",
                            "label": "Productivity Increase (%)",
                            "type": "percentage",
                            "default": 25,
                            "min": 0,
                            "max": 100,
                            "help_text": "Expected productivity improvement",
                            "required": True
                        },
                        {
                            "id": "avg_hourly_rate",
                            "label": "Average Employee Hourly Rate ($)",
                            "type": "number",
                            "default": 50,
                            "min": 0,
                            "required": True
                        }
                    ]
                },
                "calculations": {
                    "engine": "formula",
                    "formulas": {
                        "current_monthly_cost": "users * current_cost_per_user",
                        "new_monthly_cost": "users * our_cost_per_user",
                        "software_savings_monthly": "current_monthly_cost - new_monthly_cost",
                        "hours_saved_per_user_monthly": "(productivity_gain / 100) * 160",
                        "total_hours_saved_monthly": "hours_saved_per_user_monthly * users",
                        "productivity_value_monthly": "total_hours_saved_monthly * avg_hourly_rate",
                        "total_monthly_value": "software_savings_monthly + productivity_value_monthly",
                        "annual_value": "total_monthly_value * 12",
                        "roi_3y": "((annual_value * 3) / (new_monthly_cost * 12 * 3)) * 100",
                        "payback_months": "(new_monthly_cost * 12) / total_monthly_value"
                    }
                },
                "outputs": {
                    "primary_metrics": [
                        {
                            "id": "total_monthly_value",
                            "label": "Monthly Value",
                            "format": "currency",
                            "highlight": True
                        },
                        {
                            "id": "annual_value",
                            "label": "Annual Value",
                            "format": "currency",
                            "highlight": True
                        },
                        {
                            "id": "roi_3y",
                            "label": "3-Year ROI",
                            "format": "percentage",
                            "highlight": True
                        }
                    ]
                },
                "lead_capture": {
                    "enabled": True,
                    "trigger": "smart",
                    "roi_threshold": 150
                }
            }
        }

    @staticmethod
    def cost_savings() -> Dict[str, Any]:
        """Simple Cost Savings Calculator"""
        return {
            "id": "cost-savings",
            "name": "Cost Savings Calculator",
            "description": "Calculate cost savings when switching from current solution to new solution",
            "category": "General",
            "thumbnail_url": None,
            "use_cases": [
                "Any cost comparison scenario",
                "Vendor replacement ROI",
                "Process improvement analysis"
            ],
            "config": {
                "version": "1.0",
                "metadata": {
                    "name": "Cost Savings Calculator",
                    "description": "Simple before and after cost comparison",
                    "industry": "general"
                },
                "branding": {
                    "company_name": "Your Company",
                    "primary_color": "#14B8A6",
                    "secondary_color": "#F59E0B"
                },
                "inputs": {
                    "global_parameters": [
                        {
                            "id": "annual_volume",
                            "label": "Annual Volume/Units",
                            "type": "number",
                            "default": 100000,
                            "min": 0,
                            "required": True
                        },
                        {
                            "id": "current_cost_per_unit",
                            "label": "Current Cost per Unit ($)",
                            "type": "number",
                            "default": 1.00,
                            "min": 0,
                            "required": True
                        },
                        {
                            "id": "new_cost_per_unit",
                            "label": "New Cost per Unit ($)",
                            "type": "number",
                            "default": 0.70,
                            "min": 0,
                            "required": True
                        }
                    ]
                },
                "calculations": {
                    "engine": "formula",
                    "formulas": {
                        "current_annual_cost": "annual_volume * current_cost_per_unit",
                        "new_annual_cost": "annual_volume * new_cost_per_unit",
                        "annual_savings": "current_annual_cost - new_annual_cost",
                        "savings_percentage": "(annual_savings / current_annual_cost) * 100",
                        "savings_3y": "annual_savings * 3",
                        "savings_5y": "annual_savings * 5"
                    }
                },
                "outputs": {
                    "primary_metrics": [
                        {
                            "id": "annual_savings",
                            "label": "Annual Savings",
                            "format": "currency",
                            "highlight": True
                        },
                        {
                            "id": "savings_percentage",
                            "label": "Cost Reduction",
                            "format": "percentage",
                            "highlight": True
                        },
                        {
                            "id": "savings_5y",
                            "label": "5-Year Savings",
                            "format": "currency"
                        }
                    ]
                },
                "lead_capture": {
                    "enabled": True,
                    "trigger": "on_export"
                }
            }
        }

    @staticmethod
    def payback_period() -> Dict[str, Any]:
        """Payback Period Calculator"""
        return {
            "id": "payback-period",
            "name": "Payback Period Calculator",
            "description": "Calculate how quickly an investment pays for itself",
            "category": "Finance",
            "thumbnail_url": None,
            "use_cases": [
                "Capital equipment purchases",
                "Technology investments",
                "Process automation ROI"
            ],
            "config": {
                "version": "1.0",
                "metadata": {
                    "name": "Payback Period Calculator",
                    "description": "Calculate investment payback period",
                    "industry": "finance"
                },
                "branding": {
                    "company_name": "Your Company",
                    "primary_color": "#8B5CF6",
                    "secondary_color": "#06B6D4"
                },
                "inputs": {
                    "global_parameters": [
                        {
                            "id": "initial_investment",
                            "label": "Initial Investment ($)",
                            "type": "number",
                            "default": 50000,
                            "min": 0,
                            "required": True
                        },
                        {
                            "id": "monthly_benefit",
                            "label": "Monthly Benefit/Savings ($)",
                            "type": "number",
                            "default": 5000,
                            "min": 0,
                            "help_text": "Expected monthly savings or revenue increase",
                            "required": True
                        },
                        {
                            "id": "ongoing_monthly_cost",
                            "label": "Ongoing Monthly Cost ($)",
                            "type": "number",
                            "default": 1000,
                            "min": 0,
                            "help_text": "Recurring costs (subscription, maintenance, etc.)",
                            "required": True
                        }
                    ]
                },
                "calculations": {
                    "engine": "formula",
                    "formulas": {
                        "net_monthly_benefit": "monthly_benefit - ongoing_monthly_cost",
                        "payback_months": "initial_investment / net_monthly_benefit",
                        "payback_years": "payback_months / 12",
                        "annual_benefit": "net_monthly_benefit * 12",
                        "roi_3y": "((annual_benefit * 3 - initial_investment) / initial_investment) * 100",
                        "total_3y_value": "annual_benefit * 3 - initial_investment"
                    }
                },
                "outputs": {
                    "primary_metrics": [
                        {
                            "id": "payback_months",
                            "label": "Payback Period (Months)",
                            "format": "number",
                            "highlight": True
                        },
                        {
                            "id": "roi_3y",
                            "label": "3-Year ROI",
                            "format": "percentage",
                            "highlight": True
                        },
                        {
                            "id": "total_3y_value",
                            "label": "3-Year Net Value",
                            "format": "currency"
                        }
                    ]
                },
                "lead_capture": {
                    "enabled": True,
                    "trigger": "smart",
                    "roi_threshold": 100
                }
            }
        }
