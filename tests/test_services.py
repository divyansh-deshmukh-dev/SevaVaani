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

def test_direct_service_aadhaar_no_scheme_question():
    # User says "Mujhe Aadhaar card banana hai"
    res = client.post("/api/service/discover", json={"query": "Mujhe Aadhaar card banana hai", "language": "hi"})
    assert res.status_code == 200
    data = res.json()
    assert data["matched"] is True
    assert data["service"]["serviceId"] == "aadhaar_service"
    assert data["service"]["applicationMode"] == "guidance-only"

    # Turn in session
    s_res = client.post("/api/session", json={"language": "hi"})
    session_id = s_res.json()["sessionId"]
    t_res = client.post(f"/api/session/{session_id}/turn", json={
        "text": "Mujhe Aadhaar card banana hai",
        "language": "hi"
    })
    assert t_res.status_code == 200
    t_data = t_res.json()
    assert t_data["state"] == "GUIDANCE"
    assert t_data["service"]["serviceId"] == "aadhaar_service"
    # Must NOT ask "कृपया योजना का नाम बताएं"
    assert "योजना का नाम बताएं" not in t_data["assistantMessage"]["hi"]

def test_problem_need_intent_separation():
    s_res = client.post("/api/session", json={"language": "hi"})
    session_id = s_res.json()["sessionId"]
    t_res = client.post(f"/api/session/{session_id}/turn", json={
        "text": "Main farmer hoon aur mujhe financial help chahiye",
        "language": "hi"
    })
    assert t_res.status_code == 200
    t_data = t_res.json()
    # Problem/need intent should enter recommendation / need discovery, NOT ask for scheme name or direct form
    assert t_data["state"] in ["NEED_DISCOVERY", "SERVICE_DISCOVERY", "ELIGIBILITY_CHECK", "SERVICE_RECOMMENDATION"]
    assert "किसान" in t_data["assistantMessage"]["hi"] or "मदद" in t_data["assistantMessage"]["hi"] or "योजना" in t_data["assistantMessage"]["hi"]


def test_service_search_endpoint():
    res = client.get("/api/services/search?q=aadhaar&language=hi")
    assert res.status_code == 200
    results = res.json()
    assert len(results) >= 1
    assert any(s["serviceId"] == "aadhaar_service" for s in results)

def test_service_form_and_eligibility_endpoints():
    f_res = client.get("/api/services/pm_kisan/form")
    assert f_res.status_code == 200
    form_data = f_res.json()
    assert form_data["formId"] == "pm_kisan_form"
    assert len(form_data["fields"]) >= 4

    e_res = client.get("/api/services/pm_kisan/eligibility")
    assert e_res.status_code == 200
    elig_data = e_res.json()
    assert elig_data["serviceId"] == "pm_kisan"
    assert "criteria" in elig_data

