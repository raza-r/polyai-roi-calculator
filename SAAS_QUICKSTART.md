# CalcForge SaaS Platform - Quick Start Guide

Welcome to **CalcForge** - the easiest way to build and deploy custom ROI calculators!

## 🎯 What is CalcForge?

CalcForge is a multi-tenant SaaS platform that allows companies to create, customize, and deploy professional ROI calculators without writing code. Perfect for:

- **SaaS Companies**: Help prospects calculate ROI before buying
- **Consultancies**: Showcase value with interactive calculators
- **B2B Services**: Generate leads with custom calculators
- **Agencies**: Build calculators for clients

## 🚀 Features

### ✅ Completed (MVP Ready)
- ✅ Multi-tenant architecture with PostgreSQL
- ✅ User authentication (JWT-based)
- ✅ Organization/workspace management
- ✅ Database models for calculators, sessions, analytics
- ✅ Secure password hashing (bcrypt)
- ✅ Role-based access control (admin, member, viewer)
- ✅ API authentication middleware

### 🚧 In Progress
- 🚧 Admin dashboard UI
- 🚧 Calculator builder (visual editor)
- 🚧 Formula engine (safe expression evaluation)
- 🚧 Public calculator view
- 🚧 Embedding functionality
- 🚧 Landing page

### 📋 Planned
- 📋 Analytics dashboard
- 📋 Stripe payment integration
- 📋 Email notifications (Resend)
- 📋 Custom domains
- 📋 Webhook integrations
- 📋 Export to PDF/CSV

---

## 🛠️ Tech Stack

**Backend:**
- FastAPI 0.104+ (Python web framework)
- PostgreSQL 15+ (Database)
- SQLAlchemy 2.0 (ORM)
- Alembic (Migrations)
- JWT Authentication (python-jose)
- Bcrypt (Password hashing)

**Frontend:** (Coming soon)
- React 19 + TypeScript
- React Router v6
- Zustand (State management)
- Tailwind CSS + Shadcn/UI
- Vite (Build tool)

**Infrastructure:**
- Railway (Database + Backend)
- Vercel (Frontend)
- Resend (Email)
- Stripe (Payments)

---

## 📦 Installation

### Prerequisites

- Python 3.10+
- PostgreSQL 15+
- Node.js 18+ (for frontend)
- Git

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd polyai-roi-calculator
```

### 2. Set Up Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Edit .env and configure:
# - DATABASE_URL (PostgreSQL connection string)
# - SECRET_KEY (generate with: openssl rand -hex 32)
# - Other settings as needed
```

### 3. Set Up PostgreSQL Database

**Option A: Local PostgreSQL**

```bash
# Install PostgreSQL (if not already installed)
# On macOS: brew install postgresql
# On Ubuntu: sudo apt-get install postgresql

# Create database
createdb calcforge

# Update .env file
DATABASE_URL=postgresql://localhost/calcforge
```

**Option B: Railway (Cloud PostgreSQL)**

1. Go to [Railway.app](https://railway.app)
2. Create new project → Add PostgreSQL
3. Copy the DATABASE_URL from Railway dashboard
4. Update `.env` file with the connection string

### 4. Run Database Migrations

```bash
# Initialize Alembic (creates initial migration)
alembic revision --autogenerate -m "Initial migration"

# Apply migrations
alembic upgrade head
```

### 5. Generate Secret Key

```bash
# Generate a secure secret key
python -c "import secrets; print(secrets.token_urlsafe(32))"

# Copy the output and update SECRET_KEY in .env
```

### 6. Run the Backend Server

```bash
# Development server with auto-reload
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Server will start at: http://localhost:8000
```

---

## 🧪 Testing the API

### 1. Check Health Endpoint

```bash
curl http://localhost:8000/health
```

Expected response:
```json
{"status": "healthy"}
```

### 2. Sign Up a New User

```bash
curl -X POST http://localhost:8000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123",
    "full_name": "John Doe",
    "organization_name": "Acme Corp"
  }'
```

Expected response:
```json
{
  "user": {
    "id": "...",
    "email": "john@example.com",
    "full_name": "John Doe",
    "organization_id": "...",
    "role": "admin",
    "is_active": true,
    "email_verified": false,
    "created_at": "2025-01-15T10:30:00Z"
  },
  "organization": {
    "id": "...",
    "name": "Acme Corp",
    "slug": "acme-corp",
    "subscription_tier": "free",
    "subscription_status": "trial",
    "trial_ends_at": "2025-01-29T10:30:00Z",
    "created_at": "2025-01-15T10:30:00Z"
  },
  "tokens": {
    "access_token": "eyJ...",
    "refresh_token": "eyJ...",
    "token_type": "bearer"
  }
}
```

### 3. Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "SecurePass123"
  }'
```

### 4. Get Current User (Protected Route)

```bash
# Replace {ACCESS_TOKEN} with the token from signup/login response
curl http://localhost:8000/api/auth/me \
  -H "Authorization: Bearer {ACCESS_TOKEN}"
```

---

## 📊 Database Schema

The platform uses a multi-tenant architecture with the following core tables:

### Organizations (Tenants)
- Each company gets their own organization
- Contains subscription info (tier, status, Stripe ID)
- Has custom slug for URLs (`calcforge.app/c/{org-slug}/...`)

### Users
- Belong to one organization
- Role-based: admin, member, viewer
- JWT authentication

### Calculators
- Configuration stored as JSON
- Each belongs to an organization
- Has status: draft, published, archived
- Tracks views and completions

### Calculator Sessions
- Analytics for each calculator use
- Stores inputs, results, lead information
- Tracks referrer, IP, user agent

### API Keys
- For embedding calculators on external sites
- Scoped to organization
- Can be enabled/disabled

### Audit Logs
- Track all changes (who, what, when)
- Compliance and debugging

---

## 🔐 Security Features

### Authentication
- JWT-based auth with access & refresh tokens
- Access token: 30 minutes (configurable)
- Refresh token: 7 days (configurable)
- Password requirements: min 8 chars, 1 uppercase, 1 digit

### Authorization
- Role-based access control (RBAC)
- Organization-level isolation (multi-tenancy)
- Protected API routes

### Data Protection
- Bcrypt password hashing (10 rounds)
- SQL injection prevention (SQLAlchemy ORM)
- Input validation (Pydantic)

---

## 🌐 API Documentation

Once the server is running, visit:

- **Interactive API Docs (Swagger)**: http://localhost:8000/docs
- **Alternative API Docs (ReDoc)**: http://localhost:8000/redoc

---

## 🎨 Frontend Setup (Coming Soon)

The frontend is being built with React + TypeScript + Tailwind CSS.

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at: http://localhost:5173

---

## 🚀 Deployment

### Backend Deployment (Railway)

1. Push code to GitHub
2. Go to [Railway.app](https://railway.app)
3. Create new project → Deploy from GitHub repo
4. Add PostgreSQL service
5. Set environment variables from `.env.example`
6. Deploy!

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Go to [Vercel.com](https://vercel.com)
3. Import GitHub repository
4. Set build command: `cd frontend && npm run build`
5. Set output directory: `frontend/dist`
6. Deploy!

---

## 📈 Roadmap

### Phase 1: MVP (Weeks 1-4) ✅
- [x] Database schema & models
- [x] Authentication system
- [x] Multi-tenant architecture
- [ ] Basic calculator builder
- [ ] Public calculator view
- [ ] Embeddable iframe

### Phase 2: Polish (Weeks 5-6)
- [ ] Landing page
- [ ] Analytics dashboard
- [ ] Email notifications
- [ ] CSV/PDF export
- [ ] Stripe integration

### Phase 3: Scale (Weeks 7-8)
- [ ] Advanced formula editor
- [ ] Custom domains
- [ ] Webhook integrations
- [ ] Performance optimization
- [ ] Comprehensive testing

### Phase 4: Launch (Weeks 9-10)
- [ ] Documentation & tutorials
- [ ] SEO optimization
- [ ] Public beta launch
- [ ] Community building

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

TBD (To be decided - likely MIT for open source)

---

## 🆘 Support

- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions
- **Email**: support@calcforge.app (coming soon)

---

## 🎯 Next Steps

1. ✅ Backend infrastructure (DONE!)
2. 🚧 Build frontend authentication UI
3. 🚧 Create calculator builder wizard
4. 🚧 Implement formula engine
5. 🚧 Build public calculator view
6. 🚧 Add analytics dashboard
7. 🚧 Integrate Stripe payments
8. 🚧 Create landing page

---

**Ready to build the future of ROI calculators? Let's go! 🚀**
