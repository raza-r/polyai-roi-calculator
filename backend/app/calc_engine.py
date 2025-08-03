import math
from typing import List, Dict, Tuple, Optional
from .models import DealInputs, YearResult, Results, IntentRow


class ROICalculator:
    def __init__(self, inputs: DealInputs):
        self.inputs = inputs
    
    def calculate(self) -> Results:
        yearly_results = self._calculate_yearly_results()
        payback_months = self._calculate_payback()
        roi_5y = self._calculate_roi_5y(yearly_results)
        npv_5y = sum(yr.discounted_value for yr in yearly_results)
        ops_vs_revenue = self._calculate_ops_vs_revenue_split(yearly_results)
        tornado = self._calculate_tornado()
        p10_p50_p90 = self._calculate_scenarios()
        
        return Results(
            payback_months=payback_months,
            roi_5y=roi_5y,
            npv_5y=npv_5y,
            ops_vs_revenue_split=ops_vs_revenue,
            tornado=tornado,
            p10_p50_p90=p10_p50_p90,
            yearly=yearly_results
        )
    
    def _calculate_yearly_results(self) -> List[YearResult]:
        results = []
        cumulative_value = 0.0
        
        for year in range(5):
            calls_y = self.inputs.annual_calls * ((1 + self.inputs.volume_growth) ** year)
            
            baseline_minutes = 0.0
            automated_minutes = 0.0
            handoff_minutes = 0.0
            human_minutes = 0.0
            revenue_retained = 0.0
            
            for intent in self.inputs.intents:
                # Apply risk adjustment to containment
                containment = intent.containment_m3 * (1 - self.inputs.risk_adjustment)
                
                base_intent_minutes = calls_y * intent.volume_share * (intent.avg_minutes + self.inputs.acw_minutes)
                auto_min = calls_y * intent.volume_share * intent.avg_minutes * containment
                handoff_min = calls_y * intent.volume_share * intent.handoff_minutes * (1 - containment)
                human_min = (calls_y * intent.volume_share * intent.avg_minutes * (1 - containment) + 
                           handoff_min + calls_y * intent.volume_share * self.inputs.acw_minutes)
                
                baseline_minutes += base_intent_minutes
                automated_minutes += auto_min
                handoff_minutes += handoff_min
                human_minutes += human_min
                
                # Revenue retained calculation
                abandon_delta = (self.inputs.baseline_abandon_rate - self.inputs.ai_abandon_rate) * calls_y
                if intent.revenue_per_abandon:
                    revenue_retained += (abandon_delta * intent.volume_share) * intent.revenue_per_abandon
            
            # Apply inflation to costs
            inflation_factor = (1 + self.inputs.inflation) ** year
            agent_cost = self.inputs.agent_cost_per_min * inflation_factor
            telco_cost = self.inputs.telco_cost_per_min * inflation_factor
            polyai_cost = self.inputs.polyai_cost_per_min * inflation_factor
            
            baseline_cost = baseline_minutes * (agent_cost + telco_cost)
            ai_cost = (automated_minutes * (polyai_cost + telco_cost) + 
                      human_minutes * (agent_cost + telco_cost))
            
            ops_savings = baseline_cost - ai_cost
            total_value = ops_savings + revenue_retained
            cumulative_value += total_value
            discounted_value = total_value / ((1 + self.inputs.discount_rate) ** year)
            
            results.append(YearResult(
                year=year,
                baseline_minutes=baseline_minutes,
                automated_minutes=automated_minutes,
                handoff_minutes=handoff_minutes,
                human_minutes=human_minutes,
                baseline_cost=baseline_cost,
                ai_cost=ai_cost,
                ops_savings=ops_savings,
                revenue_retained=revenue_retained,
                total_value=total_value,
                cumulative_value=cumulative_value,
                discounted_value=discounted_value
            ))
        
        return results
    
    def _calculate_payback(self) -> Optional[float]:
        """Calculate payback in months with Q1 ramp consideration"""
        monthly_calls = self.inputs.annual_calls / 12
        cumulative_value = 0.0
        
        for month in range(36):  # Check up to 3 years
            # Ramp factor for first 3 months
            if month < 3:
                ramp_factor = (month + 1) / 3  # Linear ramp from 0 to 1
            else:
                ramp_factor = 1.0
            
            year = month // 12
            inflation_factor = (1 + self.inputs.inflation) ** year
            volume_factor = (1 + self.inputs.volume_growth) ** year
            
            monthly_value = 0.0
            calls_month = monthly_calls * volume_factor
            
            for intent in self.inputs.intents:
                containment = intent.containment_m3 * (1 - self.inputs.risk_adjustment) * ramp_factor
                
                baseline_min = calls_month * intent.volume_share * (intent.avg_minutes + self.inputs.acw_minutes)
                auto_min = calls_month * intent.volume_share * intent.avg_minutes * containment
                handoff_min = calls_month * intent.volume_share * intent.handoff_minutes * (1 - containment)
                human_min = (calls_month * intent.volume_share * intent.avg_minutes * (1 - containment) + 
                           handoff_min + calls_month * intent.volume_share * self.inputs.acw_minutes)
                
                agent_cost = self.inputs.agent_cost_per_min * inflation_factor
                telco_cost = self.inputs.telco_cost_per_min * inflation_factor
                polyai_cost = self.inputs.polyai_cost_per_min * inflation_factor
                
                baseline_cost = baseline_min * (agent_cost + telco_cost)
                ai_cost = (auto_min * (polyai_cost + telco_cost) + 
                          human_min * (agent_cost + telco_cost))
                
                monthly_value += baseline_cost - ai_cost
                
                # Add revenue component
                if intent.revenue_per_abandon:
                    abandon_delta = (self.inputs.baseline_abandon_rate - self.inputs.ai_abandon_rate) * calls_month
                    monthly_value += (abandon_delta * intent.volume_share) * intent.revenue_per_abandon
            
            cumulative_value += monthly_value
            
            if cumulative_value >= 0:
                return month + 1
        
        return None  # No payback within 3 years
    
    def _calculate_roi_5y(self, yearly_results: List[YearResult]) -> float:
        # Use cost reduction approach: savings as % of baseline costs
        total_baseline = sum(yr.baseline_cost for yr in yearly_results)
        total_ai = sum(yr.ai_cost for yr in yearly_results)
        
        if total_baseline == 0:
            return 0.0
        
        # ROI = Cost Reduction Percentage
        return ((total_baseline - total_ai) / total_baseline) * 100
    
    def _calculate_ops_vs_revenue_split(self, yearly_results: List[YearResult]) -> Dict[str, float]:
        total_ops = sum(yr.ops_savings for yr in yearly_results)
        total_revenue = sum(yr.revenue_retained for yr in yearly_results)
        total = total_ops + total_revenue
        
        if total == 0:
            return {"ops_savings": 0.0, "revenue_retained": 0.0}
        
        return {
            "ops_savings": (total_ops / total) * 100,
            "revenue_retained": (total_revenue / total) * 100
        }
    
    def _calculate_tornado(self) -> List[Tuple[str, float]]:
        """Calculate sensitivity analysis (tornado chart data)"""
        base_npv = sum(yr.discounted_value for yr in self._calculate_yearly_results())
        
        sensitivities = []
        
        # Test containment sensitivity
        for intent_idx, intent in enumerate(self.inputs.intents):
            original_m3 = intent.containment_m3
            
            # +20% scenario
            intent.containment_m3 = min(1.0, original_m3 * 1.2)
            high_npv = sum(yr.discounted_value for yr in self._calculate_yearly_results())
            
            # -20% scenario
            intent.containment_m3 = max(0.0, original_m3 * 0.8)
            low_npv = sum(yr.discounted_value for yr in self._calculate_yearly_results())
            
            # Restore original
            intent.containment_m3 = original_m3
            
            delta = abs(high_npv - low_npv) / 2
            sensitivities.append((f"Containment_{intent.name}", delta))
        
        # Test other key variables
        test_vars = [
            ("agent_cost_per_min", 0.2),
            ("polyai_cost_per_min", 0.2),
            ("volume_growth", 0.1),
            ("discount_rate", 0.1)
        ]
        
        for var_name, delta_pct in test_vars:
            original_val = getattr(self.inputs, var_name)
            
            # High scenario
            setattr(self.inputs, var_name, original_val * (1 + delta_pct))
            high_npv = sum(yr.discounted_value for yr in self._calculate_yearly_results())
            
            # Low scenario
            setattr(self.inputs, var_name, original_val * (1 - delta_pct))
            low_npv = sum(yr.discounted_value for yr in self._calculate_yearly_results())
            
            # Restore
            setattr(self.inputs, var_name, original_val)
            
            delta = abs(high_npv - low_npv) / 2
            sensitivities.append((var_name, delta))
        
        # Sort by impact and take top 5
        sensitivities.sort(key=lambda x: x[1], reverse=True)
        return sensitivities[:5]
    
    def _calculate_scenarios(self) -> Dict[str, float]:
        """Calculate P10/P50/P90 scenarios using triangular distribution approximation"""
        base_npv = sum(yr.discounted_value for yr in self._calculate_yearly_results())
        
        # Simplified 3-point estimation
        # P10 (pessimistic): reduce containment by 20%, increase costs by 10%
        p10_inputs = DealInputs(**self.inputs.model_dump())
        for intent in p10_inputs.intents:
            intent.containment_m3 *= 0.8
        p10_inputs.agent_cost_per_min *= 1.1
        p10_inputs.polyai_cost_per_min *= 1.1
        p10_calc = ROICalculator(p10_inputs)
        p10_npv = sum(yr.discounted_value for yr in p10_calc._calculate_yearly_results())
        
        # P90 (optimistic): increase containment by 20%, reduce costs by 10%
        p90_inputs = DealInputs(**self.inputs.model_dump())
        for intent in p90_inputs.intents:
            intent.containment_m3 = min(1.0, intent.containment_m3 * 1.2)
        p90_inputs.agent_cost_per_min *= 0.9
        p90_inputs.polyai_cost_per_min *= 0.9
        p90_calc = ROICalculator(p90_inputs)
        p90_npv = sum(yr.discounted_value for yr in p90_calc._calculate_yearly_results())
        
        return {
            "p10": p10_npv,
            "p50": base_npv,
            "p90": p90_npv
        }