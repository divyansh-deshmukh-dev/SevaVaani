from fastapi.testclient import TestClient
from server.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["service"] == "SevaVaani"
    assert "version" in data
    assert "mockMode" in data
    assert "providers" in data
    assert "X-Request-ID" in response.headers
