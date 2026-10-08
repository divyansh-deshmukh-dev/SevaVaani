from fastapi.testclient import TestClient
from server.main import app

client = TestClient(app)

def test_wer_exact_match():
    res = client.post("/api/eval/wer", json={
        "reference": "मेरा नाम रमेश कुमार है",
        "hypothesis": "मेरा नाम रमेश कुमार है",
        "language": "hi"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["referenceWords"] == 5
    assert data["wer"] == 0.0
    assert data["substitutions"] == 0
    assert data["deletions"] == 0
    assert data["insertions"] == 0

def test_wer_with_differences():
    # 4 reference words: "apply for pm kisan"
    # hypothesis: "apply pm kisan now" (1 deletion 'for', 1 insertion 'now')
    res = client.post("/api/eval/wer", json={
        "reference": "apply for pm kisan",
        "hypothesis": "apply pm kisan now",
        "language": "en"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["referenceWords"] == 4
    assert data["wer"] > 0.0
    assert len(data["alignment"]) > 0

def test_wer_marathi():
    res = client.post("/api/eval/wer", json={
        "reference": "मला शेतकरी योजनेसाठी अर्ज करायचा आहे",
        "hypothesis": "मला शेतकरी योजना अर्ज करायचा आहे",
        "language": "mr"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["referenceWords"] == 6
    assert data["wer"] > 0.0

def test_metrics_endpoint():
    res = client.get("/api/metrics")
    assert res.status_code == 200
    data = res.json()
    assert "totalSessions" in data
    assert "completionRate" in data
    assert "averageLatencyMs" in data
    assert "fallbackBreakdown" in data
    assert "lowBandwidthEfficiency" in data
