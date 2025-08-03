# 🚀 **LOCALHOST SETUP - PolyAI ROI Calculator**

**Get the ultimate commercial ROI calculator running locally in 2 minutes**

---

## ⚡ **INSTANT SETUP (Recommended)**

### **One-Command Launch:**
```bash
# Navigate to project directory
cd polyai-roi-calculator

# Run the magic script
./start-local.sh
```

**That's it!** The script handles everything:
- ✅ Installs all dependencies
- ✅ Starts backend on port 8000
- ✅ Starts frontend on port 5173
- ✅ Checks health endpoints
- ✅ Provides direct URLs

### **Access Your ROI Calculator:**
- **🎯 Frontend**: http://localhost:5173
- **⚙️ Backend**: http://localhost:8000
- **📚 API Docs**: http://localhost:8000/docs

---

## 🎭 **DEMO THE MAGIC**

### **Quick Demo Flow (30 seconds):**
1. Open http://localhost:5173
2. Click **"Restaurants"** template
3. Watch the page auto-populate with Côte Brasserie data
4. See **"🏆 Exceptional"** and **"💎 Elite"** ROI badges
5. Notice the auto-popup: **"🎯 Your ROI looks incredible!"**
6. Click **"📅 Schedule Demo"** to see Calendly integration

### **What You'll See:**
- **3,608% ROI** with **1-month payback**
- **Visual badges** for exceptional performance
- **Success stories** dynamically matched to results
- **Commercial CTAs** that auto-trigger for strong cases

---

## 🔧 **MANUAL SETUP (Advanced)**

### **If you prefer step-by-step control:**

#### **1. Backend Setup**
```bash
cd backend

# Create virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

#### **2. Frontend Setup** (New Terminal)
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

#### **3. Verify Everything Works**
```bash
# Test backend health
curl http://localhost:8000/health

# Test API endpoint
curl http://localhost:8000/api/templates
```

---

## 🎯 **TESTING THE COMMERCIAL FEATURES**

### **Test Auto-Qualification:**
1. Select **"Utilities"** template (PG&E data)
2. Results show **strong ROI**
3. **Demo CTA popup** appears automatically
4. **Success story** mentions PG&E case study

### **Test Lead Capture:**
1. Select **"Contact Center"** template (Atos data)
2. Click **"Explore Details"** button
3. Strong ROI triggers **email capture modal**
4. Try the **"📊 Get Full Report"** flow

### **Test Visual Impact:**
- **🏆 Exceptional** badges for ROI > 300%
- **💎 Elite** badges for top performance
- **🚀 Fast** badges for payback < 6 months
- **Gentle animations** and **color coding**

---

## 🐛 **TROUBLESHOOTING**

### **Common Issues:**

#### **"Port already in use"**
```bash
# Kill processes on ports 8000 and 5173
lsof -ti :8000 | xargs kill -9
lsof -ti :5173 | xargs kill -9

# Then restart
./start-local.sh
```

#### **"Backend not responding"**
```bash
# Check if backend is running
curl http://localhost:8000/health

# If not, restart backend manually:
cd backend && uvicorn app.main:app --reload --port 8000
```

#### **"Frontend can't connect to API"**
- ✅ Backend must be running on port 8000
- ✅ Check browser console for CORS errors
- ✅ Try http://localhost:8000/docs to verify backend

#### **"Dependencies not installing"**
```bash
# Backend (Python)
cd backend
pip install --upgrade pip
pip install -r requirements.txt

# Frontend (Node.js)
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 🎨 **CUSTOMIZATION FOR DEMOS**

### **Update Branding:**
```bash
# Edit frontend/src/App.tsx
# Change "🚀 PolyAI ROI Calculator" to your preferred title

# Edit frontend/src/App.css
# Update --color-brand for custom colors
```

### **Add Your Own Templates:**
```bash
# Edit backend/app/templates.py
# Add new industry templates with real client data
```

### **Customize Success Stories:**
```bash
# Edit frontend/src/components/ResultsPanel.tsx
# Update getSuccessStory() function with your case studies
```

---

## 📊 **PERFORMANCE MONITORING**

### **Check Application Health:**
```bash
# Backend health
curl http://localhost:8000/health

# Frontend build test
cd frontend && npm run build

# Full system test
curl -X POST http://localhost:8000/api/calc \
  -H "Content-Type: application/json" \
  -d '{"annual_calls": 100000, "intents": [{"name": "Test", "volume_share": 1.0, "avg_minutes": 3.0, "containment_m0": 0.5, "containment_m3": 0.8, "handoff_minutes": 1.0}], "agent_cost_per_min": 0.8, "telco_cost_per_min": 0.05, "polyai_cost_per_min": 0.12, "acw_minutes": 1.0, "baseline_abandon_rate": 0.15, "ai_abandon_rate": 0.08, "business_hours_only": true, "night_fraction": 0.3, "inflation": 0.03, "volume_growth": 0.05, "discount_rate": 0.10, "risk_adjustment": 0.1}'
```

---

## 🚀 **READY FOR PRODUCTION?**

Once you've tested locally:

1. **Fork the repository** to your GitHub
2. **Deploy to Railway**: [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)
3. **Share with sales team**: Your new conversion weapon is ready!

---

## 🎯 **SUCCESS METRICS TO TRACK**

When you deploy to production, monitor:

### **Engagement:**
- Template selection rates
- Time spent on results page
- Detail view expansion rate

### **Conversion:**
- Demo CTA click rate
- Email capture completion
- Calendly booking rate

### **Quality:**
- Average ROI calculated
- Strong ROI case percentage (>200%)
- Exceptional ROI percentage (>300%)

---

**🎉 You now have the most powerful commercial ROI calculator on the planet running locally!**

*Time to show PolyAI what real commercial intelligence looks like.* 🚀