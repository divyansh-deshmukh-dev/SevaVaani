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

def test_service_switching_apply_search_reapply_voice():
    # 1. Create session
    res = client.post("/api/session", json={"language": "hi"})
    assert res.status_code == 200
    session_id = res.json()["sessionId"]

    # 2. First Apply Now interaction
    res = client.post(f"/api/session/{session_id}/action", json={
        "action": "APPLY_NOW",
        "value": "pm_kisan",
        "language": "hi"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["state"] == "ASK_FIELD"
    assert data["service"]["serviceId"] == "pm_kisan"
    assert data["currentField"]["id"] == "full_name"

    # 3. Subsequent voice-based search for another service (Aadhaar)
    res = client.post(f"/api/session/{session_id}/turn", json={
        "text": "आधार कार्ड",
        "language": "hi"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["state"] == "GUIDANCE"
    assert data["service"]["serviceId"] == "aadhaar_service"
    assert data["guidanceInfo"] is not None
    assert data["guidanceInfo"]["serviceId"] == "aadhaar_service"

    # 4. Subsequent attempt to open PM-Kisan application via voice
    res = client.post(f"/api/session/{session_id}/turn", json={
        "text": "मुझे पीएम किसान में आवेदन करना है",
        "language": "hi"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["state"] == "ASK_FIELD"
    assert data["service"]["serviceId"] == "pm_kisan"
    assert data["currentField"]["id"] == "full_name"

    # 5. Verify conversation history is preserved
    res_session = client.get(f"/api/session/{session_id}")
    history = res_session.json()["transcriptHistory"]
    assert len(history) >= 2
    assert "आधार कार्ड" in history
    assert "मुझे पीएम किसान में आवेदन करना है" in history

def test_service_switching_apply_search_reapply_action():
    res = client.post("/api/session", json={"language": "hi"})
    session_id = res.json()["sessionId"]

    # 1. First Apply Now interaction
    client.post(f"/api/session/{session_id}/action", json={
        "action": "APPLY_NOW",
        "value": "pm_kisan",
        "language": "hi"
    })

    # 2. Voice-based search for Aadhaar
    res = client.post(f"/api/session/{session_id}/turn", json={
        "text": "आधार कार्ड",
        "language": "hi"
    })
    assert res.json()["state"] == "GUIDANCE"

    # 3. Subsequent attempt to open PM-Kisan application via Action button
    res = client.post(f"/api/session/{session_id}/action", json={
        "action": "APPLY_NOW",
        "value": "pm_kisan",
        "language": "hi"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["state"] == "ASK_FIELD"
    assert data["service"]["serviceId"] == "pm_kisan"
    assert data["currentField"]["id"] == "full_name"

def test_service_switching_during_field_collection():
    res = client.post("/api/session", json={"language": "hi"})
    session_id = res.json()["sessionId"]

    # 1. Start PM-Kisan form
    client.post(f"/api/session/{session_id}/action", json={"action": "APPLY_NOW", "value": "pm_kisan"})

    # 2. Citizen asks for Aadhaar instead of entering name
    res = client.post(f"/api/session/{session_id}/turn", json={"text": "आधार कार्ड", "language": "hi"})
    assert res.json()["state"] == "GUIDANCE"
    assert res.json()["service"]["serviceId"] == "aadhaar_service"

    # 3. Citizen asks to go back to PM-Kisan
    res = client.post(f"/api/session/{session_id}/turn", json={"text": "पीएम किसान", "language": "hi"})
    assert res.json()["state"] == "ASK_FIELD"
    assert res.json()["service"]["serviceId"] == "pm_kisan"
    assert res.json()["currentField"]["id"] == "full_name"

