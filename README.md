# PolyAI Voice AI ROI Calculator

A comprehensive ROI calculator for voice AI deployments, featuring minutes-first modeling, intent-based containment analysis, and CFO-grade financial exports.

## Features

### Core Capabilities
- **5-Year Financial Modeling**: Complete ROI, NPV, and payback analysis
- **Intent-Based Modeling**: Configure multiple customer intents with different containment rates
- **Ramp Analysis**: Month-by-month containment improvement (M0 → M3)
- **Sensitivity Analysis**: Tornado charts showing top value drivers
- **Scenario Planning**: P10/P50/P90 risk analysis
- **Professional Exports**: XLSX with formulas, 3-page PDF reports, CSV data

### Business Logic
- **Minutes-First Pricing**: Per-minute cost modeling for agents, telephony, and AI
- **Containment Ramp**: Linear improvement from M0 to M3 over 3 months
- **Revenue Impact**: Abandon rate reduction and revenue retention modeling
- **Growth Factors**: Volume growth, inflation, and discount rate adjustments
- **Risk Adjustment**: Configurable containment risk factors

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

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn

### Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

The API will be available at http://localhost:8000

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The React app will be available at http://localhost:5173

### Running Tests

```bash
cd backend
pytest tests/
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

## Demo Script (2 minutes)

1. **Load Template**: Select "Retail" template
2. **Adjust Dials**: Change containment from 45% → 60%, watch payback improve
3. **View Sensitivity**: Open tornado chart - "Top driver is avg minutes"
4. **Export Results**: Download XLSX, show formulas update when changed
5. **Audit Trail**: Show JSON export with timestamp and assumptions

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

## Troubleshooting

### Common Issues

**Volume shares don't sum to 100%**
- Check intent configuration table
- Ensure all intents sum to 1.0 (within 1% tolerance)

**Export failing**
- Verify backend is running on port 8000
- Check browser console for CORS errors
- Ensure inputs are valid before export

**Negative ROI**
- Review agent vs PolyAI cost per minute
- Check containment improvement (M0 → M3)
- Consider revenue retention benefits

**No payback**
- Increase containment rates
- Review handoff minutes (should be minimal)
- Check call volume and average minutes

## Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/new-calculation`
3. Add tests for new functionality
4. Ensure all tests pass: `pytest backend/tests/`
5. Submit pull request with description

## License

MIT License - see LICENSE file for details.

## Support

For issues or questions:
1. Check existing GitHub issues
2. Create new issue with:
   - Error messages
   - Input configuration
   - Expected vs actual behavior
   - Environment details (browser, Python version)

## Roadmap

### Near Term
- [ ] Monte Carlo simulation for uncertainty
- [ ] Additional export formats (PowerPoint)
- [ ] Custom vertical template builder
- [ ] Multi-language support

### Future
- [ ] Real-time cost API integration
- [ ] Deployment cost modeling
- [ ] Advanced risk adjustments
- [ ] Industry benchmarking data