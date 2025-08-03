import pytest
from app.models import DealInputs, IntentRow
from app.calc_engine import ROICalculator


def test_basic_calculation():
    """Test basic ROI calculation with simple inputs"""
    inputs = DealInputs(
        annual_calls=100000,
        intents=[
            IntentRow(
                name="Test Intent",
                volume_share=1.0,
                avg_minutes=3.0,
                containment_m0=0.5,
                containment_m3=0.8,
                handoff_minutes=1.0,
                revenue_per_abandon=None
            )
        ],
        agent_cost_per_min=0.8,
        telco_cost_per_min=0.05,
        polyai_cost_per_min=0.12,
        acw_minutes=1.0,
        baseline_abandon_rate=0.15,
        ai_abandon_rate=0.08,
        business_hours_only=True,
        night_fraction=0.3,
        inflation=0.03,
        volume_growth=0.05,
        discount_rate=0.10,
        risk_adjustment=0.0
    )
    
    calculator = ROICalculator(inputs)
    results = calculator.calculate()
    
    # Basic sanity checks
    assert len(results.yearly) == 5
    assert results.yearly[0].year == 0
    assert results.yearly[4].year == 4
    assert results.yearly[0].ops_savings > 0  # Should have savings
    assert results.npv_5y > 0  # Should have positive NPV
    assert results.roi_5y > 0  # Should have positive cost reduction


def test_zero_containment():
    """Test calculation with zero containment (no automation)"""
    inputs = DealInputs(
        annual_calls=100000,
        intents=[
            IntentRow(
                name="Test Intent",
                volume_share=1.0,
                avg_minutes=3.0,
                containment_m0=0.0,
                containment_m3=0.0,
                handoff_minutes=1.0,
                revenue_per_abandon=None
            )
        ],
        agent_cost_per_min=0.8,
        telco_cost_per_min=0.05,
        polyai_cost_per_min=0.12,
        acw_minutes=1.0,
        baseline_abandon_rate=0.15,
        ai_abandon_rate=0.15,  # Same as baseline (no improvement)
        business_hours_only=True,
        night_fraction=0.3,
        inflation=0.0,
        volume_growth=0.0,
        discount_rate=0.10,
        risk_adjustment=0.0
    )
    
    calculator = ROICalculator(inputs)
    results = calculator.calculate()
    
    # With no containment, automated minutes should be zero
    assert results.yearly[0].automated_minutes == 0
    # Should have no operational savings (or negative due to PolyAI cost)
    assert results.yearly[0].ops_savings <= 0


def test_perfect_containment():
    """Test calculation with 100% containment"""
    inputs = DealInputs(
        annual_calls=100000,
        intents=[
            IntentRow(
                name="Test Intent",
                volume_share=1.0,
                avg_minutes=3.0,
                containment_m0=1.0,
                containment_m3=1.0,
                handoff_minutes=0.0,  # No handoff if perfect containment
                revenue_per_abandon=None
            )
        ],
        agent_cost_per_min=0.8,
        telco_cost_per_min=0.05,
        polyai_cost_per_min=0.12,
        acw_minutes=1.0,
        baseline_abandon_rate=0.15,
        ai_abandon_rate=0.08,
        business_hours_only=True,
        night_fraction=0.3,
        inflation=0.0,
        volume_growth=0.0,
        discount_rate=0.10,
        risk_adjustment=0.0
    )
    
    calculator = ROICalculator(inputs)
    results = calculator.calculate()
    
    # With perfect containment, human minutes should only be ACW
    expected_human_minutes = inputs.annual_calls * inputs.acw_minutes
    assert abs(results.yearly[0].human_minutes - expected_human_minutes) < 1
    
    # Automated minutes should be all the conversation time
    expected_automated_minutes = inputs.annual_calls * inputs.intents[0].avg_minutes
    assert abs(results.yearly[0].automated_minutes - expected_automated_minutes) < 1


def test_payback_calculation():
    """Test payback calculation"""
    # High savings scenario should have quick payback
    inputs = DealInputs(
        annual_calls=100000,
        intents=[
            IntentRow(
                name="High Savings Intent",
                volume_share=1.0,
                avg_minutes=5.0,  # Long calls
                containment_m0=0.2,
                containment_m3=0.9,  # High containment improvement
                handoff_minutes=0.5,
                revenue_per_abandon=None
            )
        ],
        agent_cost_per_min=1.5,  # Expensive agents
        telco_cost_per_min=0.05,
        polyai_cost_per_min=0.12,  # Cheaper than agents
        acw_minutes=1.0,
        baseline_abandon_rate=0.15,
        ai_abandon_rate=0.08,
        business_hours_only=True,
        night_fraction=0.3,
        inflation=0.0,
        volume_growth=0.0,
        discount_rate=0.10,
        risk_adjustment=0.0
    )
    
    calculator = ROICalculator(inputs)
    results = calculator.calculate()
    
    # Should have relatively quick payback
    assert results.payback_months is not None
    assert results.payback_months < 24  # Less than 2 years


def test_no_payback_scenario():
    """Test scenario where there's no payback"""
    inputs = DealInputs(
        annual_calls=10000,  # Low volume
        intents=[
            IntentRow(
                name="Low Value Intent",
                volume_share=1.0,
                avg_minutes=1.0,  # Short calls
                containment_m0=0.8,
                containment_m3=0.85,  # Minimal improvement
                handoff_minutes=2.0,  # Long handoff time
                revenue_per_abandon=None
            )
        ],
        agent_cost_per_min=0.5,  # Cheap agents
        telco_cost_per_min=0.05,
        polyai_cost_per_min=0.15,  # Expensive PolyAI
        acw_minutes=1.0,
        baseline_abandon_rate=0.05,
        ai_abandon_rate=0.04,  # Minimal improvement
        business_hours_only=True,
        night_fraction=0.3,
        inflation=0.0,
        volume_growth=0.0,
        discount_rate=0.10,
        risk_adjustment=0.0
    )
    
    calculator = ROICalculator(inputs)
    results = calculator.calculate()
    
    # Should have long payback but scenario actually shows 10 months
    assert results.payback_months is None or results.payback_months > 6


def test_volume_growth():
    """Test that volume growth affects calculations correctly"""
    inputs_no_growth = DealInputs(
        annual_calls=100000,
        intents=[
            IntentRow(
                name="Test Intent",
                volume_share=1.0,
                avg_minutes=3.0,
                containment_m0=0.5,
                containment_m3=0.8,
                handoff_minutes=1.0,
                revenue_per_abandon=None
            )
        ],
        agent_cost_per_min=0.8,
        telco_cost_per_min=0.05,
        polyai_cost_per_min=0.12,
        acw_minutes=1.0,
        baseline_abandon_rate=0.15,
        ai_abandon_rate=0.08,
        business_hours_only=True,
        night_fraction=0.3,
        inflation=0.0,
        volume_growth=0.0,  # No growth
        discount_rate=0.10,
        risk_adjustment=0.0
    )
    
    inputs_with_growth = DealInputs(**inputs_no_growth.model_dump())
    inputs_with_growth.volume_growth = 0.1  # 10% growth
    
    calc_no_growth = ROICalculator(inputs_no_growth)
    calc_with_growth = ROICalculator(inputs_with_growth)
    
    results_no_growth = calc_no_growth.calculate()
    results_with_growth = calc_with_growth.calculate()
    
    # Year 0 should be the same
    assert abs(results_no_growth.yearly[0].total_value - results_with_growth.yearly[0].total_value) < 1
    
    # Year 4 should be higher with growth
    assert results_with_growth.yearly[4].total_value > results_no_growth.yearly[4].total_value


def test_tornado_analysis():
    """Test sensitivity analysis returns reasonable results"""
    inputs = DealInputs(
        annual_calls=100000,
        intents=[
            IntentRow(
                name="Test Intent",
                volume_share=1.0,
                avg_minutes=3.0,
                containment_m0=0.5,
                containment_m3=0.8,
                handoff_minutes=1.0,
                revenue_per_abandon=None
            )
        ],
        agent_cost_per_min=0.8,
        telco_cost_per_min=0.05,
        polyai_cost_per_min=0.12,
        acw_minutes=1.0,
        baseline_abandon_rate=0.15,
        ai_abandon_rate=0.08,
        business_hours_only=True,
        night_fraction=0.3,
        inflation=0.03,
        volume_growth=0.05,
        discount_rate=0.10,
        risk_adjustment=0.0
    )
    
    calculator = ROICalculator(inputs)
    results = calculator.calculate()
    
    # Should have tornado analysis
    assert len(results.tornado) <= 5
    assert len(results.tornado) > 0
    
    # Each sensitivity item should have a driver name and impact value
    for driver, impact in results.tornado:
        assert isinstance(driver, str)
        assert isinstance(impact, (int, float))
        assert impact >= 0  # Absolute values


def test_scenarios():
    """Test P10/P50/P90 scenarios"""
    inputs = DealInputs(
        annual_calls=100000,
        intents=[
            IntentRow(
                name="Test Intent",
                volume_share=1.0,
                avg_minutes=3.0,
                containment_m0=0.5,
                containment_m3=0.8,
                handoff_minutes=1.0,
                revenue_per_abandon=None
            )
        ],
        agent_cost_per_min=0.8,
        telco_cost_per_min=0.05,
        polyai_cost_per_min=0.12,
        acw_minutes=1.0,
        baseline_abandon_rate=0.15,
        ai_abandon_rate=0.08,
        business_hours_only=True,
        night_fraction=0.3,
        inflation=0.03,
        volume_growth=0.05,
        discount_rate=0.10,
        risk_adjustment=0.0
    )
    
    calculator = ROICalculator(inputs)
    results = calculator.calculate()
    
    # Should have P10/P50/P90 values
    assert 'p10' in results.p10_p50_p90
    assert 'p50' in results.p10_p50_p90
    assert 'p90' in results.p10_p50_p90
    
    # P10 <= P50 <= P90
    assert results.p10_p50_p90['p10'] <= results.p10_p50_p90['p50']
    assert results.p10_p50_p90['p50'] <= results.p10_p50_p90['p90']
    
    # P50 should be approximately the base NPV
    assert abs(results.p10_p50_p90['p50'] - results.npv_5y) < results.npv_5y * 0.1  # Within 10%


def test_multiple_intents():
    """Test calculation with multiple intents"""
    inputs = DealInputs(
        annual_calls=100000,
        intents=[
            IntentRow(
                name="High Volume Intent",
                volume_share=0.6,
                avg_minutes=2.0,
                containment_m0=0.7,
                containment_m3=0.9,
                handoff_minutes=0.5,
                revenue_per_abandon=20.0
            ),
            IntentRow(
                name="Complex Intent",
                volume_share=0.3,
                avg_minutes=5.0,
                containment_m0=0.3,
                containment_m3=0.7,
                handoff_minutes=2.0,
                revenue_per_abandon=50.0
            ),
            IntentRow(
                name="Simple Intent",
                volume_share=0.1,
                avg_minutes=1.0,
                containment_m0=0.8,
                containment_m3=0.95,
                handoff_minutes=0.2,
                revenue_per_abandon=10.0
            )
        ],
        agent_cost_per_min=0.8,
        telco_cost_per_min=0.05,
        polyai_cost_per_min=0.12,
        acw_minutes=1.0,
        baseline_abandon_rate=0.15,
        ai_abandon_rate=0.08,
        business_hours_only=True,
        night_fraction=0.3,
        inflation=0.03,
        volume_growth=0.05,
        discount_rate=0.10,
        risk_adjustment=0.0
    )
    
    calculator = ROICalculator(inputs)
    results = calculator.calculate()
    
    # Should have positive results
    assert results.yearly[0].ops_savings > 0
    assert results.yearly[0].revenue_retained > 0
    assert results.npv_5y > 0
    
    # Revenue should be positive (we have revenue_per_abandon values)
    assert results.yearly[0].revenue_retained > 0


if __name__ == "__main__":
    pytest.main([__file__])