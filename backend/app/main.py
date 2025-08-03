from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from .models import DealInputs, Results, VerticalTemplate
from .calc_engine import ROICalculator
from .templates import get_template
from .exports import ExcelExporter, PDFExporter, CSVExporter

app = FastAPI(title="PolyAI ROI Calculator API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Vite dev server
    allow_credentials=True,
    allow_methods=["*"],
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
    """Get available vertical templates"""
    return {
        "verticals": [v.value for v in VerticalTemplate],
        "descriptions": {
            "retail": "E-commerce and retail customer service",
            "fs": "Financial services and banking",
            "telco": "Telecommunications and utilities",
            "hospitality": "Hotels, restaurants, and travel"
        }
    }


@app.get("/api/templates/{vertical}", response_model=DealInputs)
async def get_template_data(vertical: VerticalTemplate):
    """Get template data for specific vertical"""
    try:
        return get_template(vertical)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/export/xlsx")
async def export_xlsx(inputs: DealInputs):
    """Export results as Excel file with formulas"""
    try:
        calculator = ROICalculator(inputs)
        results = calculator.calculate()
        
        exporter = ExcelExporter()
        excel_bytes = exporter.create_workbook(inputs, results)
        
        return Response(
            content=excel_bytes,
            media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            headers={"Content-Disposition": "attachment; filename=roi_analysis.xlsx"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/export/pdf")
async def export_pdf(inputs: DealInputs):
    """Export results as PDF report"""
    try:
        calculator = ROICalculator(inputs)
        results = calculator.calculate()
        
        exporter = PDFExporter()
        pdf_bytes = exporter.create_report(inputs, results)
        
        return Response(
            content=pdf_bytes,
            media_type="application/pdf",
            headers={"Content-Disposition": "attachment; filename=roi_report.pdf"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/export/csv")
async def export_csv(inputs: DealInputs):
    """Export results as CSV file"""
    try:
        calculator = ROICalculator(inputs)
        results = calculator.calculate()
        
        exporter = CSVExporter()
        csv_content = exporter.create_csv(inputs, results)
        
        return Response(
            content=csv_content,
            media_type="text/csv",
            headers={"Content-Disposition": "attachment; filename=roi_data.csv"}
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)