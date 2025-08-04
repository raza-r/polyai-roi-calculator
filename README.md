# PolyAI ROI Calculator

A sophisticated financial modeling application that calculates return on investment for Voice AI implementations across various industry verticals. This tool demonstrates advanced software engineering practices through a full-stack TypeScript/Python architecture with comprehensive business logic modeling.

## 🚀 Live Demo

- **Frontend**: https://polyai-roi-calculator.vercel.app
- **Backend API**: https://polyai-roi-calculator-backend-production.up.railway.app
- **API Docs**: https://polyai-roi-calculator-backend-production.up.railway.app/docs

## Overview

The PolyAI ROI Calculator provides data-driven financial analysis for Voice AI deployments, featuring industry-specific templates, sophisticated DCF modeling, and comprehensive export capabilities. Built as a demonstration of technical competence in modern web development, API design, and financial modeling.

## Technical Architecture

- **Backend**: FastAPI with Pydantic validation and sophisticated DCF modeling
- **Frontend**: React 19 + TypeScript + Vite with Recharts visualization and modern component architecture
- **Financial Modeling**: 5-year NPV analysis, sensitivity analysis, scenario planning
- **Data Processing**: Real-time calculations with sub-2-second response times
- **Deployment**: Railway (Nixpacks) + Vercel with cloud-native configuration

## Key Features

### Financial Modeling
- **Cost Modeling**: Per-minute pricing for agents, telephony, and AI services
- **Ramp Analysis**: Linear improvement modeling from M0 to M3 over 3 months
- **Revenue Impact**: Abandon rate reduction and revenue retention calculations
- **Growth Modeling**: Volume growth, inflation, and discount rate adjustments
- **Risk Assessment**: Configurable containment risk adjustment and comprehensive sensitivity analysis

### Industry Templates
Pre-configured analysis templates for seven industry verticals based on real PolyAI case studies with realistic business parameters and proven ROI data.

## Project Structure

```
polyai-roi-calculator/
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── main.py         # FastAPI app and endpoints
│   │   ├── models.py       # Pydantic data models
│   │   ├── calc_engine.py  # Core ROI calculation logic
│   │   ├── templates.py    # Vertical industry templates
│   │   └── exports.py      # CSV export functionality
│   ├── tests/              # Unit tests
│   └── requirements.txt    # Python dependencies
└── frontend/               # React + Vite application
    ├── src/
    │   ├── components/     # React components
    │   │   ├── AssumptionEditor.tsx    # Financial parameter inputs
    │   │   ├── AuditTrail.tsx          # Calculation audit log
    │   │   ├── ExportButtons.tsx       # CSV export functionality
    │   │   ├── IntentGrid.tsx          # Intent configuration matrix
    │   │   ├── ResultsPanel.tsx        # ROI visualization and metrics
    │   │   └── TemplatePicker.tsx      # Industry vertical selection
    │   ├── types.ts        # TypeScript interfaces
    │   ├── api.ts          # API client with axios
    │   └── App.tsx         # Main application
    └── package.json        # Node.js dependencies (React 19, Recharts, Vite)
```

## 🌐 Production Deployment

This application is currently deployed with a modern cloud architecture:

### Current Production Setup
- **Frontend**: Deployed on **Vercel** with automatic builds from `main` branch
- **Backend**: Deployed on **Railway** using Nixpacks (native Python deployment)
- **Architecture**: Fully decoupled frontend/backend with CORS-enabled API

### Deployment Configuration

#### Railway Backend (Current)
The backend uses Railway's native Python deployment with `railway.json`:
```json
{
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "uvicorn backend.app.main:app --host 0.0.0.0 --port $PORT",
    "healthcheckPath": "/health"
  }
}
```

#### Vercel Frontend (Current)
The frontend deploys from the root directory with build configuration:
```json
{
  "name": "polyai-roi-calculator-frontend",
  "version": 2,
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercelcdn/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ],
  "env": {
    "VITE_API_BASE_URL": "https://polyai-roi-calculator-backend-production.up.railway.app"
  }
}
```

### Alternative Deployment Options

#### Docker Deployment (Backup Method)
```bash
# Backend (if needed)
docker build -t polyai-roi-backend .
docker run -p 8000:8000 polyai-roi-backend

# Frontend  
cd frontend && npm run build
# Deploy dist/ folder to any static host
```

## Local Development

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

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
npm run dev    # Starts Vite dev server on port 5173
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
- `POST /api/export/csv` - Export CSV data with full analysis breakdown

### Utility Endpoints
- `GET /health` - Health check
- `GET /` - API information

## Vertical Templates

Pre-configured templates based on real PolyAI case studies:

### Utilities
- Based on PG&E case study: 16M calls/year, 41% containment, 22% CSAT increase during outages
- Outage Reporting & Updates, Billing Inquiries, Service Start/Stop, General FAQs, Safety/Gas Leaks
- Default: 8M annual calls, £1.05/min agent cost, 24/7 operations

### Restaurants  
- Based on Côte Brasserie & Melting Pot: 76% conversion rate, £250k after-hours revenue
- New Reservations, Reservation Changes, Cancellations, Menu & Location Info, Special Events & Groups
- Default: 350k annual calls, £0.75/min agent cost, 35% after-hours calls

### Financial Services
- Based on Quicken & Retail Bank: 21-30% containment growth, non-digital customer base
- Account Balance & Statements, Password Reset & Login Help, Card Services, Payments & Transfers, Disputes & Complex Issues
- Default: 1.2M annual calls, £1.10/min agent cost, business hours only

### Healthcare
- Based on Howard Brown Health: 30% containment, 72% AHT reduction, crisis scaling capability
- Appointment Scheduling, Test Results & Records, Prescription Refills, General Health Information, Crisis & Emergency Info
- Default: 180k annual calls, £1.25/min agent cost, 24/7 operations

### Travel
- Based on Hopper: 15% containment for complex travel queries, global 24/7 support
- Booking Questions & FAQs, Flight Changes & Cancellations, Travel Alerts & Updates, Refund Requests, Special Assistance
- Default: 600k annual calls, £0.95/min agent cost, 45% international time zone calls

### Retail
- Enhanced template with e-commerce focus and customer retention emphasis
- Order Status & Tracking, Returns & Exchanges, Product Information, Delivery & Shipping, Account & Loyalty
- Default: 450k annual calls, £0.85/min agent cost, business hours operation

### Contact Center
- Based on Atos case study: 30% call reduction, 24/7/365 operations, 187% ROI on labor savings
- General FAQs, Account Authentication, Service Requests, Technical Support L1, Escalations & Complex Cases
- Default: 2.5M annual calls, £0.90/min agent cost, 40% night shift coverage

## Calculation Methodology

### Key Formulas

**Annual Call Growth**: `calls_year = annual_calls * (1 + volume_growth)^year`

**Intent Minutes**: 
- Baseline: `calls * volume_share * (avg_minutes + acw_minutes)`
- Automated: `calls * volume_share * avg_minutes * containment_rate`
- Handoff: `calls * volume_share * handoff_minutes * (1 - containment)`
- Human: `calls * volume_share * avg_minutes * (1 - containment) + handoff_minutes + calls * volume_share * acw_minutes`

**Costs**:
- Baseline: `minutes * (agent_cost + telco_cost)`
- AI: `automated_minutes * (polyai_cost + telco_cost) + human_minutes * (agent_cost + telco_cost)`

**Value Components**:
- Operational Savings: `baseline_cost - ai_cost`
- Revenue Retained: `(baseline_abandon_rate - ai_abandon_rate) * calls * volume_share * revenue_per_abandon`
- Total Value: `ops_savings + revenue_retained`
- NPV: `total_value / (1 + discount_rate)^year`

### Ramp Modeling
- Linear containment improvement from M0 to M3 over first 3 months
- Monthly payback calculation with ramp factor: `ramp_factor = (month + 1) / 3`
- Steady-state containment from month 4 onwards

### Sensitivity Analysis
Tests percentage changes in key variables:
- Containment rates: ±20% per intent
- Agent costs: ±20%
- PolyAI costs: ±20%
- Volume growth: ±10%
- Discount rate: ±10%

Returns top 5 drivers by NPV impact, calculated as `abs(high_npv - low_npv) / 2`.

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

## 🔧 Deployment Instructions

### Quick Deploy (Recommended)

#### Deploy Backend to Railway
1. Fork this repository
2. Connect to Railway and select your fork
3. Railway will automatically detect the `railway.json` and deploy the backend
4. Copy your Railway backend URL

#### Deploy Frontend to Vercel  
1. Connect your repository to Vercel
2. Set Root Directory to `frontend`
3. Set Framework Preset to `Vite`
4. Add environment variable: `VITE_API_BASE_URL` with your Railway backend URL
5. Deploy

### Manual Environment Configuration
Update the backend URL in these files if needed:
- `frontend/src/api.ts` (production fallback URL)
- `vercel.json` (environment variable)

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
- **Export Capabilities**: CSV export with comprehensive financial analysis breakdown
- **Template System**: Configurable industry vertical templates based on real case studies

## License

MIT License