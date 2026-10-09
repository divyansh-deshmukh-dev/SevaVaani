from abc import ABC, abstractmethod
from typing import Optional
from pydantic import BaseModel, Field

class SpeechProviderError(Exception):
    """Base exception for all speech provider errors."""
    def __init__(self, message: str, provider: str = "unknown", status_code: int = 500):
        super().__init__(message)
        self.message = message
        self.provider = provider
        self.status_code = status_code

class ProviderNotConfiguredError(SpeechProviderError):
    """Raised when an external speech provider lacks necessary credentials."""
    def __init__(self, message: str, provider: str = "sarvam"):
        super().__init__(message, provider=provider, status_code=503)

class ProviderAuthError(SpeechProviderError):
    """Raised when the provider rejects credentials (401/403)."""
    def __init__(self, message: str, provider: str = "sarvam"):
        super().__init__(message, provider=provider, status_code=401)

class ProviderRateLimitError(SpeechProviderError):
    """Raised when the provider rate limit is exceeded (429)."""
    def __init__(self, message: str, provider: str = "sarvam"):
        super().__init__(message, provider=provider, status_code=429)

class ProviderTimeoutError(SpeechProviderError):
    """Raised when the external provider request times out."""
    def __init__(self, message: str, provider: str = "sarvam"):
        super().__init__(message, provider=provider, status_code=504)

class STTResponse(BaseModel):
    transcript: str
    language: str
    confidence: float = 1.0
    latencyMs: int = 0
    provider: str = "sarvam"
    model: str = "saaras:v1"

class TTSResponse(BaseModel):
    audioBase64: str
    mimeType: str = "audio/wav"
    language: str
    latencyMs: int = 0
    provider: str = "sarvam"
    model: str = "bulbul:v1"

class SpeechServiceStatus(BaseModel):
    configured: bool
    provider: str
    sttAvailable: bool
    ttsAvailable: bool
    supportedLanguages: list[str] = Field(default_factory=lambda: ["hi", "mr", "en"])
    missingEnvVars: list[str] = Field(default_factory=list)
    message: str

class BaseSTTProvider(ABC):
    @property
    @abstractmethod
    def name(self) -> str:
        pass

    @abstractmethod
    def is_configured(self) -> bool:
        pass

    @abstractmethod
    async def transcribe(
        self,
        audio_bytes: bytes,
        language: str = "hi",
        mime_type: str = "audio/wav"
    ) -> STTResponse:
        """Transcribe raw audio bytes to text."""
        pass

class BaseTTSProvider(ABC):
    @property
    @abstractmethod
    def name(self) -> str:
        pass

    @abstractmethod
    def is_configured(self) -> bool:
        pass

    @abstractmethod
    async def synthesize(
        self,
        text: str,
        language: str = "hi",
        speaker: Optional[str] = None
    ) -> TTSResponse:
        """Synthesize text to speech audio."""
        pass
