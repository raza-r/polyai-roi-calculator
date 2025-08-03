from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from .models import DealInputs, Results, VerticalTemplate
from .calc_engine import ROICalculator
from .templates import get_template
from functools import lru_cache
import csv
import io

app = FastAPI(title="PolyAI ROI Calculator API", version="1.0.0")

# CORS middleware - Allow all origins for demo deployment
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for easy deployment
    allow_credentials=False,  # Set to False when using allow_origins=["*"]
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)


@app.get("/")
async def root():
    return {"message": "PolyAI ROI Calculator API"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}


@app.post("/api/calc", response_model=Results)
async def calculate_roi(inputs: DealInputs):
    """Calculate ROI based on provided inputs"""
    try:
        calculator = ROICalculator(inputs)
        results = calculator.calculate()
        return results
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/templates")
async def get_templates():
    """Get available vertical templates based on real PolyAI case studies"""
    return {
        "verticals": [v.value for v in VerticalTemplate],
        "descriptions": {
            "utilities": "Protect revenue during outages, reduce customer churn, and scale support during crisis events",
            "restaurants": "Capture after-hours bookings, reduce no-shows, and increase table utilization",
            "financial_services": "Reduce compliance costs, improve customer satisfaction, and scale during peak periods",
            "healthcare": "Reduce no-shows, improve patient outcomes, and scale support during health crises",
            "travel": "Handle booking disruptions, reduce customer frustration, and provide 24/7 global support",
            "retail": "Increase sales conversion, reduce cart abandonment, and improve customer experience",
            "contact_center": "Reduce operational costs, improve agent satisfaction, and scale without hiring"
        },
        "case_studies": {
            "utilities": "PG&E serves 5.2M households with PolyAI handling 4M+ calls yearly. 22% CSAT increase during outages, 25% customer effort reduction.",
            "restaurants": "Côte Brasserie achieves 3,000 monthly reservations with 76% conversion rate. £250k generated from after-hours bookings.",
            "financial_services": "Quicken resolves 2,500 daily calls with zero customer complaints since launch. 21% containment growth in first year.",
            "healthcare": "Howard Brown scales from 15k to 60k calls during health crises seamlessly. 72% AHT reduction for routine requests.",
            "travel": "Hopper provides 24/7 support across 100+ countries with immediate resolution. 15% containment for complex travel scenarios.",
            "retail": "Big Table Group books 3,800+ reservations monthly worth £140k+ revenue. 100% call answer rate across 130 locations.",
            "contact_center": "Atos reduces agent calls by 30% while maintaining 96% CSAT scores. 187% ROI on labor cost savings alone."
        }
    }


@lru_cache(maxsize=10)
def get_cached_template(vertical: VerticalTemplate) -> DealInputs:
    """Cached template lookup for performance"""
    return get_template(vertical)

@app.get("/api/templates/{vertical}", response_model=DealInputs)
async def get_template_data(vertical: VerticalTemplate):
    """Get template data for specific vertical"""
    try:
        return get_cached_template(vertical)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# @app.post("/api/export/xlsx")
# async def export_xlsx(inputs: DealInputs):
#     """Export results as Excel file with formulas"""
#     try:
#         calculator = ROICalculator(inputs)
#         results = calculator.calculate()
#         
#         exporter = ExcelExporter()
#         excel_bytes = exporter.create_workbook(inputs, results)
#         
#         return Response(
#             content=excel_bytes,
#             media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
#             headers={"Content-Disposition": "attachment; filename=roi_analysis.xlsx"}
#         )
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# @app.post("/api/export/pdf")
# async def export_pdf(inputs: DealInputs):
#     """Export results as PDF report"""
#     try:
#         calculator = ROICalculator(inputs)
#         results = calculator.calculate()
#         
#         exporter = PDFExporter()
#         pdf_bytes = exporter.create_report(inputs, results)
#         
#         return Response(
#             content=pdf_bytes,
#             media_type="application/pdf",
#             headers={"Content-Disposition": "attachment; filename=roi_report.pdf"}
#         )
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/export/csv")
async def export_csv(inputs: DealInputs):
    """Export results as CSV file"""
    try:
        calculator = ROICalculator(inputs)
        results = calculator.calculate()
        
        # Create CSV content
        output = io.StringIO()
        writer = csv.writer(output)
        
        # Header
        writer.writerow(['PolyAI ROI Calculator - Results'])
        writer.writerow([])
        
        # Summary metrics
        writer.writerow(['Summary Metrics'])
        writer.writerow(['5-Year Total Value', f"£{results.yearly[-1].cumulative_value:,.0f}"])
        writer.writerow(['5-Year NPV', f"£{results.npv_5y:,.0f}"])
        writer.writerow(['5-Year ROI', f"{results.roi_5y:.1%}"])
        if results.payback_months:
            writer.writerow(['Payback Period', f"{results.payback_months:.1f} months"])
        writer.writerow([])
        
        # Yearly breakdown
        writer.writerow(['Yearly Breakdown'])
        writer.writerow(['Year', 'Baseline Cost', 'AI Cost', 'Savings', 'Revenue Retained', 'Total Value'])
        for yr in results.yearly:
            writer.writerow([
                f"Year {yr.year + 1}",
                f"£{yr.baseline_cost:,.0f}",
                f"£{yr.ai_cost:,.0f}",
                f"£{yr.ops_savings:,.0f}",
                f"£{yr.revenue_retained:,.0f}",
                f"£{yr.total_value:,.0f}"
            ])
        writer.writerow([])
        
        # Input assumptions
        writer.writerow(['Input Assumptions'])
        writer.writerow(['Annual Calls', inputs.annual_calls])
        writer.writerow(['Agent Cost per Minute', f"£{inputs.agent_cost_per_min}"])
        writer.writerow(['PolyAI Cost per Minute', f"£{inputs.polyai_cost_per_min}"])
        writer.writerow(['Volume Growth', f"{inputs.volume_growth:.1%}"])
        writer.writerow(['Discount Rate', f"{inputs.discount_rate:.1%}"])
        writer.writerow([])
        
        # Intent breakdown
        writer.writerow(['Intent Configuration'])
        writer.writerow(['Intent', 'Volume %', 'Avg Minutes', 'Containment M0', 'Containment M3'])
        for intent in inputs.intents:
            writer.writerow([
                intent.name,
                f"{intent.volume_share:.1%}",
                intent.avg_minutes,
                f"{intent.containment_m0:.1%}",
                f"{intent.containment_m3:.1%}"
            ])
        
        csv_content = output.getvalue()
        
        return Response(
            content=csv_content,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=roi_analysis.csv"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)