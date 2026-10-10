import time
import logging
from typing import Optional
import httpx

from config import settings
from speech.base import (
    BaseSTTProvider,
    BaseTTSProvider,
    STTResponse,
    TTSResponse,
    SpeechProviderError,
    ProviderNotConfiguredError,
    ProviderAuthError,
    ProviderRateLimitError,
    ProviderTimeoutError
)

logger = logging.getLogger("sevavaani.speech.sarvam")

# Mapping SevaVaani LanguageCode ('hi', 'mr', 'en') to Sarvam language codes
SARVAM_LANG_MAP: dict[str, str] = {
    "hi": "hi-IN",
    "mr": "mr-IN",
    "en": "en-IN"
}

class SarvamSTTProvider(BaseSTTProvider):
    """
    Sarvam AI Saaras STT Adapter.
    Endpoint: POST https://api.sarvam.ai/speech-to-text
    Auth Header: api-subscription-key
    """
    STT_ENDPOINT = "https://api.sarvam.ai/speech-to-text"

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or settings.SARVAM_API_KEY
        self.model = model or settings.SARVAM_STT_MODEL or "saaras:v1"

    @property
    def name(self) -> str:
        return "Sarvam AI (Saaras STT)"

    def is_configured(self) -> bool:
        return bool(self.api_key and self.api_key.strip())

    async def transcribe(
        self,
        audio_bytes: bytes,
        language: str = "hi",
        mime_type: str = "audio/wav"
    ) -> STTResponse:
        if not self.is_configured():
            raise ProviderNotConfiguredError(
                "SARVAM_API_KEY is not configured on the server. Please provide a valid subscription key or use browser Web Speech API.",
                provider="sarvam"
            )

        if not audio_bytes or len(audio_bytes) == 0:
            raise SpeechProviderError("Audio payload is empty.", provider="sarvam", status_code=400)

        target_lang = SARVAM_LANG_MAP.get(language.lower(), "hi-IN")
        filename = "recording.wav" if "wav" in mime_type else "recording.webm"

        headers = {
            "api-subscription-key": self.api_key.strip()
        }

        files = {
            "file": (filename, audio_bytes, mime_type)
        }
        data = {
            "model": self.model,
            "language_code": target_lang
        }

        start_time = time.time()

        try:
            async with httpx.AsyncClient(timeout=12.0) as client:
                response = await client.post(
                    self.STT_ENDPOINT,
                    headers=headers,
                    files=files,
                    data=data
                )

            latency_ms = int((time.time() - start_time) * 1000)

            if response.status_code == 401:
                raise ProviderAuthError("Sarvam AI authentication failed. Invalid api-subscription-key.", provider="sarvam")
            elif response.status_code == 429:
                raise ProviderRateLimitError("Sarvam AI rate limit exceeded.", provider="sarvam")
            elif response.status_code != 200:
                error_detail = response.text[:250]
                raise SpeechProviderError(
                    f"Sarvam AI STT error ({response.status_code}): {error_detail}",
                    provider="sarvam",
                    status_code=response.status_code
                )

            res_json = response.json()
            transcript = res_json.get("transcript", "").strip()

            return STTResponse(
                transcript=transcript,
                language=language,
                confidence=float(res_json.get("confidence", 0.95)),
                latencyMs=latency_ms,
                provider="sarvam",
                model=self.model
            )

        except httpx.TimeoutException:
            raise ProviderTimeoutError("Sarvam AI STT request timed out (12s threshold).", provider="sarvam")
        except httpx.RequestError as exc:
            raise SpeechProviderError(f"Network error connecting to Sarvam AI STT: {str(exc)}", provider="sarvam")


class SarvamTTSProvider(BaseTTSProvider):
    """
    Sarvam AI Bulbul TTS Adapter.
    Endpoint: POST https://api.sarvam.ai/text-to-speech
    Auth Header: api-subscription-key
    """
    TTS_ENDPOINT = "https://api.sarvam.ai/text-to-speech"

    def __init__(self, api_key: Optional[str] = None, model: Optional[str] = None):
        self.api_key = api_key or settings.SARVAM_API_KEY
        self.model = model or settings.SARVAM_TTS_MODEL or "bulbul:v1"

    @property
    def name(self) -> str:
        return "Sarvam AI (Bulbul TTS)"

    def is_configured(self) -> bool:
        return bool(self.api_key and self.api_key.strip())

    async def synthesize(
        self,
        text: str,
        language: str = "hi",
        speaker: Optional[str] = None
    ) -> TTSResponse:
        if not self.is_configured():
            raise ProviderNotConfiguredError(
                "SARVAM_API_KEY is not configured on the server. Please provide a valid subscription key or use browser Web Speech API.",
                provider="sarvam"
            )

        clean_text = text.strip()
        if not clean_text:
            raise SpeechProviderError("Synthesis text is empty.", provider="sarvam", status_code=400)

        target_lang = SARVAM_LANG_MAP.get(language.lower(), "hi-IN")
        chosen_speaker = speaker or ("meera" if target_lang != "en-IN" else "arvind")

        headers = {
            "api-subscription-key": self.api_key.strip(),
            "Content-Type": "application/json"
        }

        payload = {
            "inputs": [clean_text],
            "target_language_code": target_lang,
            "speaker": chosen_speaker,
            "pitch": 0,
            "pace": 0.95,
            "loudness": 1.0,
            "speech_sample_rate": 16000,
            "enable_preprocessing": True,
            "model": self.model
        }

        start_time = time.time()

        try:
            async with httpx.AsyncClient(timeout=12.0) as client:
                response = await client.post(
                    self.TTS_ENDPOINT,
                    headers=headers,
                    json=payload
                )

            latency_ms = int((time.time() - start_time) * 1000)

            if response.status_code == 401:
                raise ProviderAuthError("Sarvam AI authentication failed. Invalid api-subscription-key.", provider="sarvam")
            elif response.status_code == 429:
                raise ProviderRateLimitError("Sarvam AI rate limit exceeded.", provider="sarvam")
            elif response.status_code != 200:
                error_detail = response.text[:250]
                raise SpeechProviderError(
                    f"Sarvam AI TTS error ({response.status_code}): {error_detail}",
                    provider="sarvam",
                    status_code=response.status_code
                )

            res_json = response.json()
            audios = res_json.get("audios", [])
            if not audios or not audios[0]:
                raise SpeechProviderError("Sarvam AI returned empty audio data.", provider="sarvam")

            return TTSResponse(
                audioBase64=audios[0],
                mimeType="audio/wav",
                language=language,
                latencyMs=latency_ms,
                provider="sarvam",
                model=self.model
            )

        except httpx.TimeoutException:
            raise ProviderTimeoutError("Sarvam AI TTS request timed out (12s threshold).", provider="sarvam")
        except httpx.RequestError as exc:
            raise SpeechProviderError(f"Network error connecting to Sarvam AI TTS: {str(exc)}", provider="sarvam")
