from fastapi.testclient import TestClient
from server.main import app

client = TestClient(app)

def test_direct_service_flow():
    # 1. Create session
    res = client.post("/api/session", json={"language": "hi"})
    assert res.status_code == 200
    session_data = res.json()
    session_id = session_data["sessionId"]
    assert session_data["state"] == "WELCOME"

    # 2. Citizen says direct service
    res = client.post(f"/api/session/{session_id}/turn", json={
        "text": "Mujhe PM-Kisan ke liye apply karna hai",
        "language": "hi"
    })
    assert res.status_code == 200
    data = res.json()
    # Direct supported service skips unnecessary questions and starts form directly
    assert data["state"] == "ASK_FIELD"
    assert data["service"]["serviceId"] == "pm_kisan"
    assert data["currentField"]["id"] == "full_name"
    assert "पूरा नाम" in data["assistantMessage"]["hi"]

def test_field_confirmation_and_advance():
    # 1. Create session & enter form
    res = client.post("/api/session", json={"language": "hi"})
    session_id = res.json()["sessionId"]
    client.post(f"/api/session/{session_id}/turn", json={"text": "PM-Kisan", "language": "hi"})

    # 2. Answer field 1: full_name
    res = client.post(f"/api/session/{session_id}/turn", json={
        "text": "रमेश पटेल",
        "language": "hi"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["state"] == "CONFIRM_FIELD"
    assert "रमेश पटेल" in data["assistantMessage"]["hi"]
    assert data["formData"]["full_name"] == "रमेश पटेल"

    # 3. Confirm answer: "हाँ"
    res = client.post(f"/api/session/{session_id}/turn", json={
        "text": "हाँ",
        "language": "hi"
    })
    assert res.status_code == 200
    data = res.json()
    # Advances to field 2 (aadhaar)
    assert data["state"] == "ASK_FIELD"
    assert data["currentField"]["id"] == "aadhaar"
    assert data["fieldStatuses"]["full_name"] == "confirmed"

def test_fallback_ladder():
    res = client.post("/api/session", json={"language": "hi"})
    session_id = res.json()["sessionId"]
    client.post(f"/api/session/{session_id}/turn", json={"text": "PM-Kisan", "language": "hi"})

    # First unclear answer -> Level 1 Re-prompt
    res = client.post(f"/api/session/{session_id}/turn", json={
        "text": "unclear muffled sound",
        "language": "hi"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["fallbackLevel"] == 1
    assert data["state"] == "AWAIT_ANSWER"
    assert "धीरे से बोलिए" in data["assistantMessage"]["hi"] or "स्पष्ट" in data["assistantMessage"]["hi"]

    # Second unclear answer -> Level 2 Manual / Visual input
    res = client.post(f"/api/session/{session_id}/turn", json={
        "text": "still confused unclear",
        "language": "hi"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["fallbackLevel"] == 2
    assert data["state"] == "FALLBACK_INPUT"
    assert "बॉक्स में" in data["assistantMessage"]["hi"]

    # Manual entry submission
    res = client.post(f"/api/session/{session_id}/action", json={
        "action": "SUBMIT_MANUAL_FIELD",
        "fieldId": "full_name",
        "value": "सुरेश कुमार",
        "language": "hi"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["state"] == "CONFIRM_FIELD"
    assert data["formData"]["full_name"] == "सुरेश कुमार"

def test_help_level_3_handoff():
    res = client.post("/api/session", json={"language": "hi"})
    session_id = res.json()["sessionId"]

    # User requests help
    res = client.post(f"/api/session/{session_id}/turn", json={
        "text": "मुझे मदद चाहिए",
        "language": "hi"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["state"] == "HANDOFF"
    assert data["fallbackLevel"] == 3

    # Check handoff endpoint
    res = client.get(f"/api/session/{session_id}/handoff")
    assert res.status_code == 200
    handoff = res.json()
    assert handoff["status"] == "QUEUED_FOR_ASSISTANCE"
    assert handoff["sessionId"] == session_id
    assert "HO-" in handoff["handoffId"]

def test_unsupported_service_guidance_flow():
    res = client.post("/api/session", json={"language": "mr"})
    session_id = res.json()["sessionId"]

    res = client.post(f"/api/session/{session_id}/turn", json={
        "text": "मला नवीन रेशन कार्ड हवे आहे",
        "language": "mr"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["state"] == "GUIDANCE"
    assert data["guidanceInfo"] is not None
    assert data["guidanceInfo"]["serviceId"] == "ration_card"
    assert "थेट ऑनलाइन अर्ज उपलब्ध नाही" in data["assistantMessage"]["mr"]
