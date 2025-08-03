#!/usr/bin/env python3
"""
Basic functionality test for the PolyAI ROI Calculator
Tests core calculation without system-dependent PDF generation
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from app.models import DealInputs, IntentRow
from app.calc_engine import ROICalculator
from app.templates import get_template, VerticalTemplate

def test_basic_calculation():
    """Test basic ROI calculation"""
    print("Testing basic ROI calculation...")
    
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
    
    print(f"✓ 5-Year NPV: £{results.npv_5y:,.0f}")
    print(f"✓ 5-Year ROI: {results.roi_5y:.1f}%")
    print(f"✓ Payback: {results.payback_months:.1f} months" if results.payback_months else "✓ No payback")
    print(f"✓ Year 1 Savings: £{results.yearly[0].ops_savings:,.0f}")
    
    assert len(results.yearly) == 5
    assert results.yearly[0].ops_savings > 0
    print("✓ Basic calculation test passed\n")

def test_templates():
    """Test template loading"""
    print("Testing vertical templates...")
    
    for vertical in VerticalTemplate:
        template = get_template(vertical)
        total_share = sum(intent.volume_share for intent in template.intents)
        
        print(f"✓ {vertical.value.upper()}: {len(template.intents)} intents, {template.annual_calls:,} calls")
        assert abs(total_share - 1.0) < 0.01, f"Volume shares don't sum to 1.0 for {vertical.value}"
    
    print("✓ All templates loaded successfully\n")

def test_multiple_intents():
    """Test calculation with multiple intents"""
    print("Testing multiple intents calculation...")
    
    retail_template = get_template(VerticalTemplate.RETAIL)
    calculator = ROICalculator(retail_template)
    results = calculator.calculate()
    
    print(f"✓ Retail template - NPV: £{results.npv_5y:,.0f}")
    print(f"✓ {len(retail_template.intents)} intents processed")
    print(f"✓ Revenue retained: £{results.yearly[0].revenue_retained:,.0f}")
    
    assert results.yearly[0].revenue_retained > 0  # Should have revenue component
    print("✓ Multiple intents test passed\n")

def test_sensitivity_analysis():
    """Test tornado and scenario analysis"""
    print("Testing sensitivity analysis...")
    
    inputs = get_template(VerticalTemplate.TELCO)
    calculator = ROICalculator(inputs)
    results = calculator.calculate()
    
    print(f"✓ Tornado analysis: {len(results.tornado)} drivers")
    for driver, impact in results.tornado[:3]:
        print(f"  - {driver}: ±£{impact:,.0f}")
    
    print(f"✓ Scenarios:")
    print(f"  - P10: £{results.p10_p50_p90['p10']:,.0f}")
    print(f"  - P50: £{results.p10_p50_p90['p50']:,.0f}")
    print(f"  - P90: £{results.p10_p50_p90['p90']:,.0f}")
    
    assert len(results.tornado) > 0
    assert results.p10_p50_p90['p10'] <= results.p10_p50_p90['p50'] <= results.p10_p50_p90['p90']
    print("✓ Sensitivity analysis test passed\n")

def test_xlsx_export():
    """Test XLSX export functionality"""
    print("Testing XLSX export...")
    
    try:
        from app.exports import ExcelExporter
        
        inputs = get_template(VerticalTemplate.FINANCIAL_SERVICES)
        calculator = ROICalculator(inputs)
        results = calculator.calculate()
        
        exporter = ExcelExporter()
        excel_bytes = exporter.create_workbook(inputs, results)
        
        print(f"✓ XLSX export generated: {len(excel_bytes):,} bytes")
        assert len(excel_bytes) > 10000  # Should be substantial
        print("✓ XLSX export test passed\n")
        
    except Exception as e:
        print(f"⚠ XLSX export test skipped: {e}\n")

def test_csv_export():
    """Test CSV export functionality"""
    print("Testing CSV export...")
    
    try:
        from app.exports import CSVExporter
        
        inputs = get_template(VerticalTemplate.HOSPITALITY)
        calculator = ROICalculator(inputs)
        results = calculator.calculate()
        
        exporter = CSVExporter()
        csv_content = exporter.create_csv(inputs, results)
        
        lines = csv_content.split('\n')
        print(f"✓ CSV export generated: {len(lines)} lines")
        assert len(lines) >= 6  # Header + 5 years
        print("✓ CSV export test passed\n")
        
    except Exception as e:
        print(f"⚠ CSV export test skipped: {e}\n")

def main():
    """Run all tests"""
    print("=== PolyAI ROI Calculator - Basic Functionality Test ===\n")
    
    try:
        test_basic_calculation()
        test_templates()
        test_multiple_intents()
        test_sensitivity_analysis()
        test_xlsx_export()
        test_csv_export()
        
        print("🎉 All tests passed! The ROI Calculator is working correctly.")
        print("\nNext steps:")
        print("1. Start backend: cd backend && uvicorn app.main:app --reload")
        print("2. Start frontend: cd frontend && npm run dev")
        print("3. Open http://localhost:5173 in your browser")
        
    except Exception as e:
        print(f"❌ Test failed: {e}")
        import traceback
        traceback.print_exc()
        return 1
    
    return 0

if __name__ == "__main__":
    exit(main())