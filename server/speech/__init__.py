"""SevaVaani Speech Provider Package"""
from server.speech.base import (
    BaseSTTProvider,
    BaseTTSProvider,
    STTResponse,
    TTSResponse,
    SpeechServiceStatus,
    SpeechProviderError,
    ProviderNotConfiguredError,
    ProviderAuthError,
    ProviderRateLimitError,
    ProviderTimeoutError,
)
from server.speech.sarvam import SarvamSTTProvider, SarvamTTSProvider
from server.speech.factory import get_stt_provider, get_tts_provider, get_speech_status

__all__ = [
    "BaseSTTProvider",
    "BaseTTSProvider",
    "STTResponse",
    "TTSResponse",
    "SpeechServiceStatus",
    "SpeechProviderError",
    "ProviderNotConfiguredError",
    "ProviderAuthError",
    "ProviderRateLimitError",
    "ProviderTimeoutError",
    "SarvamSTTProvider",
    "SarvamTTSProvider",
    "get_stt_provider",
    "get_tts_provider",
    "get_speech_status",
]
