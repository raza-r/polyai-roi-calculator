import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


def test_health_check():
    """Test health check endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}


def test_root_endpoint():
    """Test root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    assert "PolyAI ROI Calculator API" in response.json()["message"]


def test_get_templates():
    """Test getting available templates"""
    response = client.get("/api/templates")
    assert response.status_code == 200
    
    data = response.json()
    assert "verticals" in data
    assert "descriptions" in data
    assert isinstance(data["verticals"], list)
    assert len(data["verticals"]) > 0


def test_get_retail_template():
    """Test getting retail template"""
    response = client.get("/api/templates/retail")
    assert response.status_code == 200
    
    data = response.json()
    assert "annual_calls" in data
    assert "intents" in data
    assert len(data["intents"]) > 0
    
    # Check volume shares sum to 1
    total_share = sum(intent["volume_share"] for intent in data["intents"])
    assert abs(total_share - 1.0) < 0.01


def test_get_fs_template():
    """Test getting financial services template"""
    response = client.get("/api/templates/fs")
    assert response.status_code == 200
    
    data = response.json()
    assert "annual_calls" in data
    assert "intents" in data
    assert len(data["intents"]) > 0


def test_get_invalid_template():
    """Test getting invalid template returns 422"""
    response = client.get("/api/templates/invalid")
    assert response.status_code == 422


def test_calculate_roi_basic():
    """Test basic ROI calculation"""
    payload = {
        "annual_calls": 100000,
        "intents": [
            {
                "name": "Test Intent",
                "volume_share": 1.0,
                "avg_minutes": 3.0,
                "containment_m0": 0.5,
                "containment_m3": 0.8,
                "handoff_minutes": 1.0,
                "revenue_per_abandon": None
            }
        ],
        "agent_cost_per_min": 0.8,
        "telco_cost_per_min": 0.05,
        "polyai_cost_per_min": 0.12,
        "acw_minutes": 1.0,
        "baseline_abandon_rate": 0.15,
        "ai_abandon_rate": 0.08,
        "business_hours_only": True,
        "night_fraction": 0.3,
        "inflation": 0.03,
        "volume_growth": 0.05,
        "discount_rate": 0.10,
        "risk_adjustment": 0.0
    }
    
    response = client.post("/api/calc", json=payload)
    assert response.status_code == 200
    
    data = response.json()
    assert "yearly" in data
    assert "roi_5y" in data
    assert "npv_5y" in data
    assert "payback_months" in data
    assert "tornado" in data
    assert "p10_p50_p90" in data
    
    assert len(data["yearly"]) == 5
    assert isinstance(data["roi_5y"], (int, float))
    assert isinstance(data["npv_5y"], (int, float))


def test_calculate_roi_invalid_volume_shares():
    """Test ROI calculation with invalid volume shares"""
    payload = {
        "annual_calls": 100000,
        "intents": [
            {
                "name": "Test Intent",
                "volume_share": 0.5,  # Only 50%, should sum to 100%
                "avg_minutes": 3.0,
                "containment_m0": 0.5,
                "containment_m3": 0.8,
                "handoff_minutes": 1.0,
                "revenue_per_abandon": None
            }
        ],
        "agent_cost_per_min": 0.8,
        "telco_cost_per_min": 0.05,
        "polyai_cost_per_min": 0.12,
        "acw_minutes": 1.0,
        "baseline_abandon_rate": 0.15,
        "ai_abandon_rate": 0.08,
        "business_hours_only": True,
        "night_fraction": 0.3,
        "inflation": 0.03,
        "volume_growth": 0.05,
        "discount_rate": 0.10,
        "risk_adjustment": 0.0
    }
    
    response = client.post("/api/calc", json=payload)
    assert response.status_code == 422


def test_calculate_roi_negative_values():
    """Test ROI calculation rejects negative values"""
    payload = {
        "annual_calls": -100000,  # Negative value
        "intents": [
            {
                "name": "Test Intent",
                "volume_share": 1.0,
                "avg_minutes": 3.0,
                "containment_m0": 0.5,
                "containment_m3": 0.8,
                "handoff_minutes": 1.0,
                "revenue_per_abandon": None
            }
        ],
        "agent_cost_per_min": 0.8,
        "telco_cost_per_min": 0.05,
        "polyai_cost_per_min": 0.12,
        "acw_minutes": 1.0,
        "baseline_abandon_rate": 0.15,
        "ai_abandon_rate": 0.08,
        "business_hours_only": True,
        "night_fraction": 0.3,
        "inflation": 0.03,
        "volume_growth": 0.05,
        "discount_rate": 0.10,
        "risk_adjustment": 0.0
    }
    
    response = client.post("/api/calc", json=payload)
    assert response.status_code == 422


def test_calculate_roi_out_of_range():
    """Test ROI calculation rejects out of range values"""
    payload = {
        "annual_calls": 100000,
        "intents": [
            {
                "name": "Test Intent",
                "volume_share": 1.5,  # > 1.0
                "avg_minutes": 3.0,
                "containment_m0": 0.5,
                "containment_m3": 0.8,
                "handoff_minutes": 1.0,
                "revenue_per_abandon": None
            }
        ],
        "agent_cost_per_min": 0.8,
        "telco_cost_per_min": 0.05,
        "polyai_cost_per_min": 0.12,
        "acw_minutes": 1.0,
        "baseline_abandon_rate": 0.15,
        "ai_abandon_rate": 0.08,
        "business_hours_only": True,
        "night_fraction": 0.3,
        "inflation": 0.03,
        "volume_growth": 0.05,
        "discount_rate": 0.10,
        "risk_adjustment": 0.0
    }
    
    response = client.post("/api/calc", json=payload)
    assert response.status_code == 422


def test_export_xlsx():
    """Test XLSX export"""
    payload = {
        "annual_calls": 100000,
        "intents": [
            {
                "name": "Test Intent",
                "volume_share": 1.0,
                "avg_minutes": 3.0,
                "containment_m0": 0.5,
                "containment_m3": 0.8,
                "handoff_minutes": 1.0,
                "revenue_per_abandon": None
            }
        ],
        "agent_cost_per_min": 0.8,
        "telco_cost_per_min": 0.05,
        "polyai_cost_per_min": 0.12,
        "acw_minutes": 1.0,
        "baseline_abandon_rate": 0.15,
        "ai_abandon_rate": 0.08,
        "business_hours_only": True,
        "night_fraction": 0.3,
        "inflation": 0.03,
        "volume_growth": 0.05,
        "discount_rate": 0.10,
        "risk_adjustment": 0.0
    }
    
    response = client.post("/api/export/xlsx", json=payload)
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    assert "attachment" in response.headers["content-disposition"]
    assert len(response.content) > 1000  # Should be a substantial file


def test_export_pdf():
    """Test PDF export"""
    payload = {
        "annual_calls": 100000,
        "intents": [
            {
                "name": "Test Intent",
                "volume_share": 1.0,
                "avg_minutes": 3.0,
                "containment_m0": 0.5,
                "containment_m3": 0.8,
                "handoff_minutes": 1.0,
                "revenue_per_abandon": None
            }
        ],
        "agent_cost_per_min": 0.8,
        "telco_cost_per_min": 0.05,
        "polyai_cost_per_min": 0.12,
        "acw_minutes": 1.0,
        "baseline_abandon_rate": 0.15,
        "ai_abandon_rate": 0.08,
        "business_hours_only": True,
        "night_fraction": 0.3,
        "inflation": 0.03,
        "volume_growth": 0.05,
        "discount_rate": 0.10,
        "risk_adjustment": 0.0
    }
    
    response = client.post("/api/export/pdf", json=payload)
    assert response.status_code == 200
    assert response.headers["content-type"] == "application/pdf"
    assert "attachment" in response.headers["content-disposition"]
    assert len(response.content) > 1000  # Should be a substantial file


def test_export_csv():
    """Test CSV export"""
    payload = {
        "annual_calls": 100000,
        "intents": [
            {
                "name": "Test Intent",
                "volume_share": 1.0,
                "avg_minutes": 3.0,
                "containment_m0": 0.5,
                "containment_m3": 0.8,
                "handoff_minutes": 1.0,
                "revenue_per_abandon": None
            }
        ],
        "agent_cost_per_min": 0.8,
        "telco_cost_per_min": 0.05,
        "polyai_cost_per_min": 0.12,
        "acw_minutes": 1.0,
        "baseline_abandon_rate": 0.15,
        "ai_abandon_rate": 0.08,
        "business_hours_only": True,
        "night_fraction": 0.3,
        "inflation": 0.03,
        "volume_growth": 0.05,
        "discount_rate": 0.10,
        "risk_adjustment": 0.0
    }
    
    response = client.post("/api/export/csv", json=payload)
    assert response.status_code == 200
    assert response.headers["content-type"] == "text/csv"
    assert "attachment" in response.headers["content-disposition"]
    assert len(response.content) > 100  # Should have content


if __name__ == "__main__":
    pytest.main([__file__])