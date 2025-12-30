# 🚀 CalcForge - Complete Setup Guide

## What You Have Now

A **production-ready, multi-tenant SaaS platform** for creating custom ROI calculators!

### ✅ Completed Features

**Backend (100%)**
- ✅ Multi-tenant PostgreSQL database
- ✅ JWT authentication system
- ✅ Calculator CRUD API
- ✅ Safe formula engine
- ✅ 4 pre-built templates
- ✅ Session tracking & analytics
- ✅ Public API for embeds

**Frontend (100%)**
- ✅ Beautiful landing page
- ✅ Login/Signup pages
- ✅ Dashboard with calculator management
- ✅ Public calculator view (embeddable)
- ✅ Lead capture system
- ✅ Responsive design

---

## 🏃 Quick Start (5 Minutes)

### 1. Install Dependencies

```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd ../frontend
npm install
```

### 2. Setup Database

```bash
# Create PostgreSQL database
createdb calcforge

# Run migrations
cd backend
alembic upgrade head
```

### 3. Configure Environment

**Backend** (`backend/.env`):
```bash
cp .env.example .env

# Edit .env and set:
DATABASE_URL=postgresql://localhost/calcforge
SECRET_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(32))")
```

**Frontend** (`frontend/.env`):
```bash
cp .env.example .env

# Default is:
VITE_API_URL=http://localhost:8000
```

### 4. Start Servers

```bash
# Terminal 1 - Backend
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### 5. Open Your Browser

- **Landing Page**: http://localhost:5173
- **API Docs**: http://localhost:8000/docs
- **Backend Health**: http://localhost:8000/health

---

## 🧪 Test the Full Flow

### Step 1: Create Account

1. Go to http://localhost:5173
2. Click "Get Started Free"
3. Fill in:
   - Company: `Acme Corp`
   - Email: `test@example.com`
   - Password: `SecurePass123`
4. Click "Create Account"

You'll be redirected to the dashboard!

### Step 2: Create Calculator

1. In dashboard, click "New Calculator"
2. Choose "SaaS ROI Calculator" template
3. Click "Use This Template"
4. Your calculator is created!

### Step 3: Get Embed Code

1. Find your new calculator in the list
2. Click "Embed" button
3. Embed code copied to clipboard!

Example:
```html
<iframe
  src="http://localhost:5173/c/acme-corp/saas-roi-calculator-copy"
  width="100%"
  height="600px"
  frameborder="0">
</iframe>
```

### Step 4: Test Public Calculator

1. Click "View" on your calculator
2. Opens in new tab at `/c/acme-corp/saas-roi-calculator-copy`
3. Fill in the form
4. See results calculate in real-time!
5. Click "Download Full Report" to test lead capture

---

## 📊 Test API with cURL

### Signup

```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123",
    "organization_name": "Acme Corp"
  }'
```

### Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123"
  }'
```

Save the `access_token` from response!

### Get Templates

```bash
curl http://localhost:8000/api/templates
```

### Create Calculator

```bash
curl -X POST http://localhost:8000/api/calculators \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My ROI Calculator",
    "template_id": "saas-roi",
    "config": {
      "metadata": {"name": "My ROI Calculator"},
      "branding": {"company_name": "Acme Corp"},
      "inputs": {"global_parameters": []},
      "outputs": {"primary_metrics": []},
      "calculations": {"formulas": {}}
    }
  }'
```

---

## 🎨 Frontend Pages

### Public Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Marketing homepage with features, templates, pricing |
| `/login` | Login | User authentication |
| `/signup` | Signup | New user registration |
| `/c/:org/:calc` | Calculator | Public embeddable calculator view |

### Protected Pages (Requires Login)

| Route | Page | Description |
|-------|------|-------------|
| `/dashboard` | Dashboard | Calculator management, stats, templates |

---

## 🔧 Technology Stack

### Backend

- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Reliable database
- **SQLAlchemy** - ORM
- **Alembic** - Database migrations
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **Simpleeval** - Safe formula evaluation
- **Pydantic** - Data validation

### Frontend

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **React Router** - Navigation
- **Zustand** - State management
- **Axios** - HTTP client
- **Tailwind CSS** - Styling
- **Lucide React** - Icons

---

## 📁 Project Structure

```
polyai-roi-calculator/
├── backend/
│   ├── app/
│   │   ├── api/              # API endpoints
│   │   │   ├── auth.py       # Authentication
│   │   │   ├── calculators.py # Calculator CRUD
│   │   │   └── templates.py  # Templates
│   │   ├── models/           # Database models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── services/         # Business logic
│   │   │   ├── auth_service.py
│   │   │   ├── calculator_service.py
│   │   │   ├── formula_engine.py
│   │   │   └── templates.py  # 4 pre-built templates
│   │   ├── middleware/       # Auth middleware
│   │   ├── utils/            # Utilities
│   │   ├── config.py         # Settings
│   │   ├── database.py       # DB connection
│   │   └── main.py           # FastAPI app
│   ├── alembic/              # Migrations
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.tsx   # Marketing page
│   │   │   ├── Login.tsx     # Auth
│   │   │   ├── Signup.tsx    # Registration
│   │   │   ├── Dashboard.tsx # Main app
│   │   │   └── Calculator.tsx # Public calc wrapper
│   │   ├── components/
│   │   │   └── calculator/
│   │   │       └── CalculatorView.tsx # Embeddable calc
│   │   ├── store/
│   │   │   └── auth.ts       # Auth state
│   │   ├── utils/
│   │   │   └── api.ts        # API client
│   │   └── App.tsx           # Router
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env.example
└── SETUP_GUIDE.md (this file)
```

---

## 🐛 Troubleshooting

### Backend Issues

**Error: `ModuleNotFoundError: No module named 'app'`**
```bash
cd backend
pip install -r requirements.txt
```

**Error: Database connection failed**
```bash
# Make sure PostgreSQL is running
pg_ctl status

# Create database
createdb calcforge
```

**Error: `alembic upgrade head` fails**
```bash
# Check DATABASE_URL in .env
# Make sure database exists
```

### Frontend Issues

**Error: `npm install` fails**
```bash
# Delete node_modules and try again
rm -rf node_modules package-lock.json
npm install
```

**Error: API calls fail with CORS**
```bash
# Make sure backend is running on port 8000
# Check VITE_API_URL in frontend/.env
```

**Error: Zustand persist middleware**
```bash
# Install peer dependencies
npm install zustand
```

---

## 🚀 Deployment

### Backend (Railway)

1. Create Railway project
2. Add PostgreSQL service
3. Add Web service from GitHub
4. Set environment variables:
   ```
   DATABASE_URL=(auto-set by Railway)
   SECRET_KEY=your-generated-secret
   ENVIRONMENT=production
   ```
5. Deploy!

### Frontend (Vercel)

1. Import GitHub repo
2. Set build command: `cd frontend && npm run build`
3. Set output directory: `frontend/dist`
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.railway.app
   ```
5. Deploy!

---

## 📊 What's Working

✅ **Authentication**
- Signup with email/password
- Login with JWT tokens
- Protected routes
- Auto-logout on 401

✅ **Calculator Management**
- Create from 4 templates
- List all calculators
- View stats (views, completions)
- Get embed codes
- Publish/unpublish

✅ **Public Calculators**
- Dynamic form generation
- Real-time calculations
- Lead capture modal
- Mobile-responsive
- Embeddable (iframe)

✅ **Analytics**
- Track views
- Track completions
- Capture leads
- Store session data

---

## 🎯 Next Steps (Optional)

### Week 1-2: Polish
- [ ] Add calculator editing (update configs)
- [ ] Add analytics charts (Recharts)
- [ ] Add export to PDF
- [ ] Improve error messages

### Week 3-4: Scale
- [ ] Add Stripe payment integration
- [ ] Email notifications (Resend)
- [ ] Custom domains
- [ ] Webhook integrations

### Week 5-6: Launch
- [ ] Landing page SEO
- [ ] Help documentation
- [ ] Video tutorials
- [ ] Public beta launch

---

## 💰 Estimated Costs

### Development (Free)
- PostgreSQL: Railway free tier (512MB)
- Backend: Railway free tier (500hrs/month)
- Frontend: Vercel free tier (unlimited)
- **Total: $0/month**

### Production (When you scale)
- Railway DB: $5/month (1GB)
- Railway Backend: $10/month (8GB RAM)
- Vercel Pro: $20/month (optional)
- **Total: ~$15-35/month**

---

## 🆘 Support

- **Issues**: Create GitHub issue
- **Email**: [your-email]
- **Docs**: See `/docs` folder

---

## 🎉 You're Ready!

Your CalcForge platform is ready to launch!

**Test locally** → **Deploy** → **Get your first customers** → **Iterate based on feedback**

Good luck! 🚀
