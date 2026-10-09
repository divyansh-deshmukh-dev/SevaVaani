import pytest
from unittest.mock import patch, AsyncMock
from fastapi.testclient import TestClient
import httpx

from server.main import app
from server.speech.sarvam import SarvamSTTProvider, SarvamTTSProvider, SARVAM_LANG_MAP
from server.speech.base import (
    ProviderNotConfiguredError,
    ProviderAuthError,
    ProviderRateLimitError,
    ProviderTimeoutError,
)

client = TestClient(app)

def test_speech_status_unconfigured():
    """Verify that when SARVAM_API_KEY is not set, /api/speech/status clearly indicates browser mode fallback."""
    response = client.get("/api/speech/status")
    assert response.status_code == 200
    data = response.json()
    assert data["configured"] is False
    assert data["provider"] == "browser"
    assert "SARVAM_API_KEY" in data["missingEnvVars"]
    assert "hi" in data["supportedLanguages"]
    assert "mr" in data["supportedLanguages"]
    assert "en" in data["supportedLanguages"]
    assert "browser" in data["message"].lower()

def test_speech_stt_missing_credentials_returns_503():
    """Verify that STT endpoint returns 503 when API key is missing, directing client to browser Web Speech API."""
    file_payload = ("test.wav", b"RIFF....WAVEfmt ", "audio/wav")
    response = client.post(
        "/api/speech/stt",
        files={"file": file_payload},
        data={"language": "hi"}
    )
    assert response.status_code == 503
    detail = response.json()["detail"]
    assert detail["error"] == "ProviderNotConfigured"
    assert "SARVAM_API_KEY" in detail["message"]
    assert "browser" in detail["fallback"].lower()

def test_speech_tts_missing_credentials_returns_503():
    """Verify that TTS endpoint returns 503 when API key is missing for all 3 languages."""
    for lang in ["hi", "mr", "en"]:
        response = client.post(
            "/api/speech/tts",
            json={"text": "नमस्ते नागरिक", "language": lang}
        )
        assert response.status_code == 503
        detail = response.json()["detail"]
        assert detail["error"] == "ProviderNotConfigured"
        assert "browser" in detail["fallback"].lower()

def test_sarvam_language_mapping():
    """Verify language code mappings to Sarvam Indic formats."""
    assert SARVAM_LANG_MAP["hi"] == "hi-IN"
    assert SARVAM_LANG_MAP["mr"] == "mr-IN"
    assert SARVAM_LANG_MAP["en"] == "en-IN"

@pytest.mark.asyncio
async def test_sarvam_stt_provider_unconfigured_raises():
    provider = SarvamSTTProvider(api_key="")
    assert not provider.is_configured()
    with pytest.raises(ProviderNotConfiguredError):
        await provider.transcribe(b"dummy audio", "hi")

@pytest.mark.asyncio
async def test_sarvam_tts_provider_unconfigured_raises():
    provider = SarvamTTSProvider(api_key="")
    assert not provider.is_configured()
    with pytest.raises(ProviderNotConfiguredError):
        await provider.synthesize("test", "mr")

@pytest.mark.asyncio
async def test_sarvam_auth_error_handling():
    """Test 401 Unauthorized handling from Sarvam API."""
    provider = SarvamSTTProvider(api_key="invalid-test-key")
    
    mock_resp = httpx.Response(status_code=401, request=httpx.Request("POST", "http://test"))
    with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
        mock_post.return_value = mock_resp
        with pytest.raises(ProviderAuthError):
            await provider.transcribe(b"audio", "hi")

@pytest.mark.asyncio
async def test_sarvam_rate_limit_handling():
    """Test 429 Rate Limit handling from Sarvam API."""
    provider = SarvamTTSProvider(api_key="test-key")
    
    mock_resp = httpx.Response(status_code=429, request=httpx.Request("POST", "http://test"))
    with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
        mock_post.return_value = mock_resp
        with pytest.raises(ProviderRateLimitError):
            await provider.synthesize("नमस्कार", "mr")

@pytest.mark.asyncio
async def test_sarvam_timeout_handling():
    """Test request timeout handling from Sarvam API."""
    provider = SarvamSTTProvider(api_key="test-key")
    
    with patch("httpx.AsyncClient.post", side_effect=httpx.TimeoutException("Timeout")):
        with pytest.raises(ProviderTimeoutError):
            await provider.transcribe(b"audio", "en")

@pytest.mark.asyncio
async def test_sarvam_successful_mock_call_all_languages():
    """Test successful transcription and synthesis for Hindi, Marathi, and English with mocked API responses."""
    stt_provider = SarvamSTTProvider(api_key="valid-mock-key")
    tts_provider = SarvamTTSProvider(api_key="valid-mock-key")
    
    mock_stt_resp = httpx.Response(
        status_code=200,
        json={"transcript": "मला मदत हवी आहे", "confidence": 0.98},
        request=httpx.Request("POST", "http://test")
    )
    with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
        mock_post.return_value = mock_stt_resp
        res = await stt_provider.transcribe(b"sample audio", language="mr")
        assert res.transcript == "मला मदत हवी आहे"
        assert res.language == "mr"
        assert res.confidence == 0.98
        assert res.provider == "sarvam"

    mock_tts_resp = httpx.Response(
        status_code=200,
        json={"audios": ["UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA="]},
        request=httpx.Request("POST", "http://test")
    )
    with patch("httpx.AsyncClient.post", new_callable=AsyncMock) as mock_post:
        mock_post.return_value = mock_tts_resp
        res = await tts_provider.synthesize("आपका स्वागत है", language="hi")
        assert res.audioBase64.startswith("UklGR")
        assert res.language == "hi"
        assert res.mimeType == "audio/wav"
