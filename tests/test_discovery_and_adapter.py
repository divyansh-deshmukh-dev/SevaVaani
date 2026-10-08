from fastapi.testclient import TestClient
from server.main import app

client = TestClient(app)

def test_problem_need_recommendation():
    res = client.post("/api/service/recommend", json={
        "problemText": "Main kisan hoon aur mujhe sarkar se financial help chahiye",
        "language": "hi"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["recommendedService"]["serviceId"] == "pm_kisan"
    assert data["eligibility"]["status"] == "LIKELY_ELIGIBLE"
    assert "पात्रता" in data["explanation"] or "पात्र" in data["explanation"]

def test_eligibility_rule_evaluation():
    # 1. Eligible farmer
    res = client.post("/api/service/eligibility", json={
        "serviceId": "pm_kisan",
        "profile": {
            "occupation": "farmer",
            "isFarmer": True,
            "landHeldAcres": 2.5,
            "isInstitutionalLandholder": False,
            "isIncomeTaxPayer": False
        }
    })
    assert res.status_code == 200
    assert res.json()["status"] == "LIKELY_ELIGIBLE"

    # 2. Excluded: Income tax payer
    res = client.post("/api/service/eligibility", json={
        "serviceId": "pm_kisan",
        "profile": {
            "occupation": "farmer",
            "isFarmer": True,
            "landHeldAcres": 2.5,
            "isIncomeTaxPayer": True
        }
    })
    assert res.status_code == 200
    assert res.json()["status"] == "NOT_ELIGIBLE"

    # 3. Missing information
    res = client.post("/api/service/eligibility", json={
        "serviceId": "pm_kisan",
        "profile": {}
    })
    assert res.status_code == 200
    assert res.json()["status"] == "MORE_INFORMATION_REQUIRED"
    assert "landHeldAcres" in res.json()["missingFields"]

def test_pm_kisan_adapter_submit_and_status():
    valid_form = {
        "full_name": "Ramesh Patel",
        "aadhaar": "554433221100",
        "mobile": "9876543210",
        "state": "Madhya Pradesh",
        "district": "Bhopal",
        "village": "Berasia",
        "land_area": "2.5 acre"
    }
    # 1. Submit
    res = client.post("/api/services/pm_kisan/submit", json={"formData": valid_form})
    assert res.status_code == 200
    data = res.json()
    assert data["success"] is True
    assert "DEMO-PMK-" in data["applicationId"]
    assert "SUBMITTED (DEMO)" in data["status"]
    app_id = data["applicationId"]

    # 2. Status lookup
    res = client.get(f"/api/services/pm_kisan/status/{app_id}")
    assert res.status_code == 200
    status_data = res.json()
    assert status_data["found"] is True
    assert status_data["applicationId"] == app_id
    # Aadhaar must be masked in stored record
    assert "XXXX-XXXX-" in status_data["details"]["data"]["aadhaar"]

def test_unsupported_service_cannot_submit():
    res = client.post("/api/services/ration_card/submit", json={"formData": {"name": "Test"}})
    assert res.status_code == 400
    assert "does not support direct submission" in res.json()["detail"]
