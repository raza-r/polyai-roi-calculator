# SaaS Platform Architecture

## Vision
Transform the PolyAI ROI Calculator into a multi-tenant SaaS platform where any company can create, customize, and deploy their own ROI calculator in minutes.

## Product Name
**CalcForge** - Build and deploy professional ROI calculators in minutes

## Target Users
1. **Primary**: SaaS companies, consultancies, B2B service providers
2. **Secondary**: Agencies, marketing teams, sales teams

## Core Value Proposition
- 🚀 Launch your custom ROI calculator in 10 minutes (no coding)
- 🎨 Fully branded with your company's look and feel
- 📊 Analytics dashboard to track leads and conversions
- 🔗 Embed anywhere (website, landing pages, sales proposals)
- 💼 Enterprise-grade security and performance

---

## Multi-Tenant SaaS Architecture

### Database Schema (PostgreSQL)

```sql
-- Organizations (tenants)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL, -- e.g., "acme-corp"
    domain VARCHAR(255), -- Custom domain (e.g., calc.acme.com)
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    subscription_tier VARCHAR(50) DEFAULT 'free', -- free, starter, pro, enterprise
    subscription_status VARCHAR(50) DEFAULT 'active', -- active, trial, canceled, past_due
    stripe_customer_id VARCHAR(255),
    trial_ends_at TIMESTAMP,
    settings JSONB DEFAULT '{}' -- Organization-level settings
);

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'admin', -- admin, member, viewer
    is_active BOOLEAN DEFAULT TRUE,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    last_login_at TIMESTAMP,
    avatar_url VARCHAR(500)
);

-- Calculators (configurations)
CREATE TABLE calculators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL, -- e.g., "roi-calculator"
    description TEXT,
    status VARCHAR(50) DEFAULT 'draft', -- draft, published, archived
    config JSONB NOT NULL, -- Full calculator configuration
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    published_at TIMESTAMP,
    views_count INTEGER DEFAULT 0,
    completions_count INTEGER DEFAULT 0,
    UNIQUE(organization_id, slug)
);

-- Calculator Sessions (analytics)
CREATE TABLE calculator_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    calculator_id UUID REFERENCES calculators(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    inputs JSONB, -- User inputs
    results JSONB, -- Calculation results
    lead_email VARCHAR(255), -- If user provided email
    lead_name VARCHAR(255),
    lead_company VARCHAR(255),
    ip_address INET,
    user_agent TEXT,
    referrer TEXT,
    completed BOOLEAN DEFAULT FALSE,
    exported BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP
);

-- API Keys (for embedded calculators)
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    key_hash VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    last_used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Audit Log
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL, -- created_calculator, updated_config, etc.
    resource_type VARCHAR(50), -- calculator, organization, user
    resource_id UUID,
    changes JSONB,
    ip_address INET,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_calculators_org ON calculators(organization_id);
CREATE INDEX idx_sessions_calculator ON calculator_sessions(calculator_id);
CREATE INDEX idx_sessions_created ON calculator_sessions(created_at);
CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_audit_org ON audit_logs(organization_id, created_at DESC);
```

### Calculator Configuration Schema (JSONB)

```json
{
  "version": "1.0",
  "metadata": {
    "name": "SaaS ROI Calculator",
    "description": "Calculate ROI for our platform",
    "industry": "saas"
  },
  "branding": {
    "company_name": "Acme Corp",
    "logo_url": "https://...",
    "primary_color": "#3B82F6",
    "secondary_color": "#10B981",
    "background_color": "#FFFFFF",
    "font_family": "Inter, sans-serif"
  },
  "inputs": {
    "global_parameters": [
      {
        "id": "annual_transactions",
        "label": "Annual Transaction Volume",
        "type": "number",
        "default": 100000,
        "min": 0,
        "max": 10000000,
        "help_text": "Total transactions per year",
        "unit": "transactions",
        "required": true
      },
      {
        "id": "current_cost_per_unit",
        "label": "Current Cost per Transaction",
        "type": "currency",
        "default": 0.50,
        "currency": "USD",
        "required": true
      }
    ],
    "intents": {
      "enabled": true,
      "label": "Transaction Types",
      "max_intents": 10,
      "fields": [
        {
          "id": "name",
          "label": "Type Name",
          "type": "text"
        },
        {
          "id": "volume_share",
          "label": "Volume %",
          "type": "percentage"
        },
        {
          "id": "avg_time",
          "label": "Avg Time (min)",
          "type": "number"
        }
      ]
    }
  },
  "calculations": {
    "engine": "formula",
    "formulas": [
      {
        "id": "baseline_cost",
        "formula": "annual_transactions * current_cost_per_unit",
        "label": "Current Annual Cost"
      },
      {
        "id": "new_cost",
        "formula": "annual_transactions * new_cost_per_unit",
        "label": "New Annual Cost"
      },
      {
        "id": "savings",
        "formula": "baseline_cost - new_cost",
        "label": "Annual Savings"
      },
      {
        "id": "roi_5y",
        "formula": "(savings * 5) / (new_cost * 5) * 100",
        "label": "5-Year ROI %"
      }
    ]
  },
  "outputs": {
    "primary_metrics": [
      {
        "id": "roi_5y",
        "label": "5-Year ROI",
        "format": "percentage",
        "highlight": true
      },
      {
        "id": "savings",
        "label": "Annual Savings",
        "format": "currency",
        "currency": "USD"
      }
    ],
    "charts": [
      {
        "type": "bar",
        "title": "Cost Comparison",
        "data_keys": ["baseline_cost", "new_cost"]
      }
    ],
    "export": {
      "enabled": true,
      "formats": ["csv", "pdf"],
      "require_email": true
    }
  },
  "lead_capture": {
    "enabled": true,
    "trigger": "on_export", // on_export, on_completion, manual
    "fields": [
      {"id": "email", "label": "Email", "required": true},
      {"id": "name", "label": "Full Name", "required": false},
      {"id": "company", "label": "Company", "required": false}
    ]
  },
  "embed": {
    "allowed_domains": ["acme.com", "*.acme.com"],
    "theme": "light" // light, dark, auto
  }
}
```

---

## Application Architecture

### Backend Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app entry point
│   ├── config.py               # Environment configuration
│   ├── database.py             # Database connection & session
│   ├── models/                 # SQLAlchemy models
│   │   ├── __init__.py
│   │   ├── organization.py
│   │   ├── user.py
│   │   ├── calculator.py
│   │   └── session.py
│   ├── schemas/                # Pydantic schemas
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── calculator.py
│   │   └── analytics.py
│   ├── api/                    # API endpoints
│   │   ├── __init__.py
│   │   ├── auth.py            # /api/auth/*
│   │   ├── calculators.py     # /api/calculators/*
│   │   ├── analytics.py       # /api/analytics/*
│   │   ├── embed.py           # /api/embed/*
│   │   └── admin.py           # /api/admin/*
│   ├── services/               # Business logic
│   │   ├── __init__.py
│   │   ├── auth_service.py
│   │   ├── calculator_service.py
│   │   ├── formula_engine.py
│   │   └── email_service.py
│   ├── middleware/             # Custom middleware
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   └── rate_limit.py
│   ├── utils/                  # Utilities
│   │   ├── __init__.py
│   │   ├── security.py
│   │   └── validation.py
│   └── legacy/                 # Original ROI calculator (keep for reference)
│       ├── calc_engine.py
│       ├── templates.py
│       └── models.py
├── alembic/                    # Database migrations
│   ├── versions/
│   └── env.py
├── tests/
├── requirements.txt
└── alembic.ini
```

### Frontend Structure

```
frontend/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── routes/                 # React Router pages
│   │   ├── Landing.tsx         # Public landing page
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   ├── Dashboard.tsx       # Calculator list
│   │   ├── CalculatorBuilder.tsx  # Create/edit calculator
│   │   ├── Analytics.tsx       # Analytics dashboard
│   │   └── Settings.tsx        # Org settings
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── builder/            # Calculator builder components
│   │   │   ├── ConfigWizard.tsx
│   │   │   ├── InputDesigner.tsx
│   │   │   ├── FormulaEditor.tsx
│   │   │   ├── BrandingEditor.tsx
│   │   │   └── PreviewPanel.tsx
│   │   ├── calculator/         # Public calculator view
│   │   │   ├── CalculatorEmbed.tsx
│   │   │   ├── InputForm.tsx
│   │   │   └── ResultsDisplay.tsx
│   │   ├── dashboard/
│   │   │   ├── CalculatorCard.tsx
│   │   │   └── StatsOverview.tsx
│   │   └── common/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── Modal.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCalculators.ts
│   │   └── useAnalytics.ts
│   ├── services/
│   │   ├── api.ts              # API client
│   │   └── auth.ts
│   ├── store/                  # Zustand state management
│   │   ├── auth.ts
│   │   └── calculator.ts
│   ├── types/
│   │   ├── auth.ts
│   │   ├── calculator.ts
│   │   └── analytics.ts
│   ├── utils/
│   │   └── validators.ts
│   └── legacy/                 # Original PolyAI calculator (reference)
│       ├── App.tsx
│       └── components/
├── public/
│   ├── embed.html              # Embeddable calculator iframe
│   └── landing/                # Marketing assets
└── package.json
```

---

## User Flows

### 1. New User Onboarding (5 minutes)

**Step 1: Signup**
- Email + password or Google OAuth
- Verify email
- Auto-create organization

**Step 2: Quick Start Wizard**
- Choose calculator template (SaaS, Consulting, Manufacturing, etc.)
- Customize branding (logo, colors, company name)
- Preview calculator
- Publish!

**Step 3: First Calculator Live**
- Get embed code
- Share public URL: `calcforge.app/c/{org-slug}/{calculator-slug}`
- Dashboard shows analytics

### 2. Creating a Custom Calculator (10 minutes)

**Step 1: Basic Info**
- Calculator name
- Industry category
- Description

**Step 2: Input Designer**
- Add input fields (drag & drop)
- Field types: number, currency, percentage, text, dropdown
- Set defaults, min/max, help text

**Step 3: Formula Builder**
- Visual formula editor with autocomplete
- Predefined functions (SUM, AVG, NPV, IRR, etc.)
- Validation & testing

**Step 4: Results Designer**
- Choose which metrics to display
- Add charts (bar, line, pie)
- Configure export options

**Step 5: Branding**
- Upload logo
- Choose colors
- Customize messaging

**Step 6: Publish & Share**
- Get embed code
- Get shareable link
- Enable lead capture

### 3. Embedding Calculator (1 minute)

```html
<!-- Embed via iframe -->
<iframe
  src="https://calcforge.app/embed/{org-slug}/{calc-slug}"
  width="800"
  height="600"
  frameborder="0">
</iframe>

<!-- Or via JavaScript widget -->
<div id="calcforge-widget"></div>
<script src="https://calcforge.app/widget.js"></script>
<script>
  CalcForge.embed({
    calculator: 'org-slug/calc-slug',
    theme: 'light',
    container: '#calcforge-widget'
  });
</script>
```

---

## Pricing Tiers

### Free Tier
- 1 calculator
- 100 monthly sessions
- CalcForge branding
- Email support
- Public URL only

### Starter ($29/month)
- 3 calculators
- 1,000 monthly sessions
- Remove branding
- Lead capture with CSV export
- Embed on your website
- Email support

### Pro ($99/month)
- 10 calculators
- 10,000 monthly sessions
- Custom domain (calc.yourdomain.com)
- Advanced analytics
- Webhook integrations (Slack, Zapier, HubSpot)
- Priority support

### Enterprise (Custom)
- Unlimited calculators
- Unlimited sessions
- White-label solution
- SSO (SAML, OAuth)
- Dedicated account manager
- SLA guarantee
- Custom integrations

---

## Technical Stack

### Backend
- **Framework**: FastAPI 0.104+
- **Database**: PostgreSQL 15+
- **ORM**: SQLAlchemy 2.0
- **Migrations**: Alembic
- **Authentication**: JWT (python-jose)
- **Password Hashing**: bcrypt (passlib)
- **Formula Engine**: simpleeval (safe expression evaluation)
- **Email**: SendGrid or Resend
- **Payments**: Stripe
- **Caching**: Redis (optional)
- **Task Queue**: Celery + Redis (optional, for async tasks)

### Frontend
- **Framework**: React 19 + TypeScript
- **Routing**: React Router v6
- **State**: Zustand
- **Forms**: React Hook Form + Zod
- **HTTP**: Axios
- **Charts**: Recharts
- **UI**: Tailwind CSS + Shadcn/UI
- **Build**: Vite

### Infrastructure
- **Deployment**: Railway (DB + Backend) + Vercel (Frontend)
- **CDN**: Vercel Edge Network
- **Monitoring**: Sentry
- **Analytics**: PostHog or Plausible
- **Email**: Resend
- **Storage**: AWS S3 (for logos, exports)

---

## Security Features

1. **Authentication**
   - JWT-based auth with refresh tokens
   - Password strength requirements
   - Rate limiting on login attempts
   - Email verification

2. **Authorization**
   - Role-based access control (RBAC)
   - Organization-level isolation
   - API key scoping

3. **Data Protection**
   - Row-level security (RLS) in database
   - Encrypted fields for sensitive data
   - GDPR compliance (data export/deletion)

4. **API Security**
   - Rate limiting (per IP, per user, per org)
   - CORS configuration
   - Input validation
   - SQL injection prevention (ORM)
   - XSS prevention

---

## Analytics & Metrics

### For Calculator Owners (Dashboard)
- Total views & completions
- Conversion rate (view → completion)
- Lead capture rate
- Average ROI shown
- Top referrers
- Geographic distribution
- Time-series charts

### For Platform (Internal)
- Monthly Active Organizations (MAO)
- Total calculators created
- Total sessions across platform
- Churn rate
- MRR & ARR
- Customer acquisition cost (CAC)

---

## Deployment Strategy

### Phase 1: MVP (Week 1-4)
- Multi-tenant database
- Authentication system
- Basic calculator builder (no drag-drop yet)
- Formula engine
- Public calculator view
- Embeddable iframe

### Phase 2: Polish (Week 5-6)
- Landing page & marketing site
- Stripe payment integration
- Analytics dashboard
- Email notifications
- Export to CSV/PDF

### Phase 3: Scale (Week 7-8)
- Advanced formula editor
- Custom domains
- Webhook integrations
- Performance optimization
- Comprehensive testing

### Phase 4: Launch (Week 9-10)
- Documentation & help center
- Video tutorials
- SEO optimization
- Public beta launch
- Community building

---

## Success Metrics

### Technical
- [ ] Page load < 2s
- [ ] API response time < 200ms
- [ ] 99.9% uptime
- [ ] Calculator embed loads < 1s

### Business
- [ ] 100 signups in first month
- [ ] 20% activation rate (create first calculator)
- [ ] 10% conversion to paid
- [ ] < 5% monthly churn

### User Experience
- [ ] Onboarding completion < 5 minutes
- [ ] NPS score > 50
- [ ] Support response time < 4 hours
- [ ] Calculator creation time < 10 minutes

---

## Next Steps

1. ✅ Architecture design (this document)
2. ⏳ Database setup & migrations
3. ⏳ Authentication system
4. ⏳ Calculator builder UI
5. ⏳ Formula engine
6. ⏳ Landing page
7. ⏳ Payment integration
8. ⏳ Analytics dashboard
9. ⏳ Documentation
10. ⏳ Launch!

