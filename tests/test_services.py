from fastapi.testclient import TestClient
from server.main import app

client = TestClient(app)

def test_list_services():
    res = client.get("/api/services")
    assert res.status_code == 200
    services = res.json()
    assert len(services) >= 5
    ids = [s["serviceId"] for s in services]
    assert "pm_kisan" in ids
    assert "ration_card" in ids
    assert "old_age_pension" in ids
    assert "post_matric_scholarship" in ids
    assert "pm_awas_yojana" in ids

def test_get_service_pm_kisan():
    res = client.get("/api/services/pm_kisan")
    assert res.status_code == 200
    data = res.json()
    assert data["serviceId"] == "pm_kisan"
    assert data["directApplicationSupported"] is True
    assert data["formSchemaId"] == "pm_kisan_form"
    assert data["isDemo"] is True

def test_service_discovery_pm_kisan_variants():
    queries = [
        "PM Kisan",
        "PM-Kisan",
        "pmkisan",
        "Mujhe PM-Kisan ke liye apply karna hai",
        "पीएम किसान",
        "किसान सम्मान निधि",
        "शेतकरी सन्मान निधी",
        "पीएम किसान योजना"
    ]
    for q in queries:
        res = client.post("/api/service/discover", json={"query": q, "language": "hi"})
        assert res.status_code == 200
        data = res.json()
        assert data["matched"] is True, f"Failed for query: {q}"
        assert data["service"]["serviceId"] == "pm_kisan", f"Matched wrong service for query: {q}"
        assert data["confidence"] >= 0.85

def test_service_discovery_other_services():
    cases = [
        ("राशन कार्ड बनवाना है", "ration_card"),
        ("I need old age pension", "old_age_pension"),
        ("विद्यार्थी शिष्यवृत्ती हवी आहे", "post_matric_scholarship"),
        ("मुझे घर बनाने के लिए आवास योजना चाहिए", "pm_awas_yojana")
    ]
    for query, expected_id in cases:
        res = client.post("/api/service/discover", json={"query": query})
        assert res.status_code == 200
        data = res.json()
        assert data["matched"] is True
        assert data["service"]["serviceId"] == expected_id
        assert data["service"]["directApplicationSupported"] is False

def test_get_guidance_for_unsupported_service():
    res = client.get("/api/services/ration_card/guidance?language=hi")
    assert res.status_code == 200
    guidance = res.json()
    assert guidance["serviceId"] == "ration_card"
    assert guidance["directApplicationSupported"] is False
    assert len(guidance["requiredDocuments"]) > 0
    assert len(guidance["applicationSteps"]) == 3
    assert "प्रोटोटाइप" in guidance["disclaimer"] or "मार्गदर्शन" in guidance["disclaimer"]
