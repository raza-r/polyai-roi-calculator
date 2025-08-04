# PolyAI ROI Calculator

A sophisticated financial modeling application that calculates return on investment for Voice AI implementations across various industry verticals. This tool demonstrates advanced software engineering practices through a full-stack TypeScript/Python architecture with comprehensive business logic modeling.

## Overview

The PolyAI ROI Calculator provides data-driven financial analysis for Voice AI deployments, featuring industry-specific templates, sophisticated DCF modeling, and comprehensive export capabilities. Built as a demonstration of technical competence in modern web development, API design, and financial modeling.

## Technical Architecture

- **Backend**: FastAPI with Pydantic validation and sophisticated DCF modeling
- **Frontend**: React 19 + TypeScript with modern component architecture
- **Financial Modeling**: 5-year NPV analysis, sensitivity analysis, scenario planning
- **Data Processing**: Real-time calculations with sub-2-second response times
- **Deployment**: Containerized with Docker, cloud-ready configuration

## Key Features

### Financial Modeling
- **Cost Modeling**: Per-minute pricing for agents, telephony, and AI services
- **Ramp Analysis**: Linear improvement modeling from M0 to M3 over 3 months
- **Revenue Impact**: Abandon rate reduction and revenue retention calculations
- **Growth Modeling**: Volume growth, inflation, and discount rate adjustments
- **Risk Assessment**: Configurable containment risk factors and sensitivity analysis

### Industry Templates
Pre-configured analysis templates for seven industry verticals with realistic business parameters and case study data.

## Project Structure

```
polyai-roi-calculator/
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── main.py         # FastAPI app and endpoints
│   │   ├── models.py       # Pydantic data models
│   │   ├── calc_engine.py  # Core ROI calculation logic
│   │   ├── templates.py    # Vertical industry templates
│   │   └── exports.py      # XLSX, PDF, CSV export functionality
│   ├── tests/              # Unit tests
│   └── requirements.txt    # Python dependencies
└── frontend/               # React + Vite application
    ├── src/
    │   ├── components/     # React components
    │   ├── types.ts        # TypeScript interfaces
    │   ├── api.ts          # API client
    │   └── App.tsx         # Main application
    └── package.json        # Node.js dependencies
```

## Deployment Options

### Cloud Platforms

#### Railway
1. Connect GitHub repository
2. Backend deploys automatically using `railway.json` configuration
3. Frontend deploys as static site from Vite build

#### Render
1. Backend auto-deploys using `render.yaml` configuration
2. Frontend deploys as static site from `dist/` directory

#### Docker Deployment
```bash
# Backend
cd backend && docker build -t polyai-roi-backend .
docker run -p 8000:8000 polyai-roi-backend

# Frontend  
cd frontend && npm run build
# Serve dist/ folder with any static host
```

## Local Development

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm

### Setup Instructions

#### Backend Setup
```bash
cd backend
pip3 install -r requirements.txt
python3 -m uvicorn app.main:app --reload --port 8000
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Application Access
- Frontend: http://localhost:5173/
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Testing

```bash
cd backend
python3 -m pytest tests/test_calc_engine.py -v
```

## API Endpoints

### Core Endpoints
- `POST /api/calc` - Calculate ROI based on inputs
- `GET /api/templates` - List available vertical templates
- `GET /api/templates/{vertical}` - Get specific template data

### Export Endpoints
- `POST /api/export/xlsx` - Export Excel workbook with formulas
- `POST /api/export/pdf` - Export 3-page PDF report
- `POST /api/export/csv` - Export CSV data

### Utility Endpoints
- `GET /health` - Health check
- `GET /` - API information

## Vertical Templates

Pre-configured templates for common industries:

### Retail
- Order Status, Returns & Exchanges, Store Hours, Delivery Issues, Loyalty Program
- Default: 100k annual calls, mixed containment rates

### Financial Services
- Card Activation, Balance Inquiry, Dispute Resolution, Lost/Stolen Cards, KYC
- Higher agent costs, lower initial containment for complex financial processes

### Telco
- Plan Changes, Billing, Tech Support, Outage Info, Device Upgrade
- Higher call volume, revenue impact from plan changes

### Hospitality
- Reservations, Modifications, Cancellations, FAQ, Loyalty
- 24/7 operation, high revenue per abandon for bookings

## Calculation Methodology

### Key Formulas

**Annual Call Growth**: `calls_year = annual_calls * (1 + volume_growth)^year`

**Intent Minutes**: 
- Baseline: `calls * volume_share * (avg_minutes + acw_minutes)`
- Automated: `calls * volume_share * avg_minutes * containment_rate`
- Human: `calls * volume_share * avg_minutes * (1 - containment) + handoff_minutes + acw`

**Costs**:
- Baseline: `minutes * (agent_cost + telco_cost)`
- AI: `automated_minutes * (polyai_cost + telco_cost) + human_minutes * (agent_cost + telco_cost)`

**Value Components**:
- Operational Savings: `baseline_cost - ai_cost`
- Revenue Retained: `abandon_reduction * revenue_per_abandon`
- Total Value: `ops_savings + revenue_retained`

### Ramp Modeling
- Linear containment improvement from M0 to M3 over first 3 months
- Monthly payback calculation with ramp factor: `ramp_factor = month / 3`
- Steady-state containment from month 4 onwards

### Sensitivity Analysis
Tests ±20% changes in:
- Containment rates (per intent)
- Agent costs
- PolyAI costs
- Volume growth
- Discount rate

Returns top 5 drivers by NPV impact.

### Scenario Analysis
- **P10 (Pessimistic)**: 20% lower containment, 10% higher costs
- **P50 (Base Case)**: Input assumptions as provided
- **P90 (Optimistic)**: 20% higher containment, 10% lower costs

## Development

### Adding New Verticals
1. Add template to `backend/app/templates.py`
2. Ensure volume shares sum to 1.0
3. Test with realistic business parameters

### Extending Calculations
1. Modify core logic in `backend/app/calc_engine.py`
2. Update Pydantic models in `backend/app/models.py`
3. Add corresponding tests in `backend/tests/`

### Frontend Customization
1. Components are in `frontend/src/components/`
2. Styling in `frontend/src/App.css`
3. API integration in `frontend/src/api.ts`

## Deployment

### Backend (Render/Railway/Fly.io)
```bash
# Dockerfile example
FROM python:3.11-slim
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY app/ app/
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy dist/ directory
```

Update `frontend/src/api.ts` with production backend URL.

## Security & Compliance

- No PII collection or storage
- No authentication required (stateless)
- Input validation via Pydantic
- CORS configured for frontend origins only
- No third-party API calls
- Audit trail includes timestamp and full input snapshot

## Assumptions & Disclaimers

- **Illustrative Only**: Not official PolyAI pricing
- **Editable Assumptions**: All parameters can be adjusted
- **Deployment Dependent**: Actual results vary by implementation
- **Usage Pricing**: Per-minute pricing model
- **CFO Review**: Exports designed for finance team validation

## Technical Implementation Details

This application demonstrates several advanced software engineering concepts:

### Architecture Patterns
- **Clean Architecture**: Separation of business logic, data models, and API layers
- **Type Safety**: Full TypeScript implementation with Pydantic validation
- **API Design**: RESTful endpoints with comprehensive OpenAPI documentation
- **Error Handling**: Robust validation and error response patterns

### Financial Modeling
- **DCF Analysis**: Discounted cash flow calculations with proper NPV methodology
- **Sensitivity Analysis**: Tornado charts showing key value drivers
- **Scenario Planning**: P10/P50/P90 analysis for risk assessment
- **Monte Carlo Ready**: Architecture supports stochastic modeling extensions

### Data Processing
- **Real-time Calculations**: Sub-second response times for complex financial models
- **Export Capabilities**: Multiple format support (XLSX, PDF, CSV) with formula preservation
- **Template System**: Configurable industry vertical templates with validation

## License

MIT License