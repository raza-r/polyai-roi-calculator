from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from .models import DealInputs, Results, VerticalTemplate
from .calc_engine import ROICalculator
from .templates import get_template

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
    return {"message": "PolyAI ROI Calculator API - Test Version"}


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


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)