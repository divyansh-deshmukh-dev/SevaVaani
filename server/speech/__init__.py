"""SevaVaani Speech Provider Package"""
from speech.base import (
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
from speech.sarvam import SarvamSTTProvider, SarvamTTSProvider
from speech.factory import get_stt_provider, get_tts_provider, get_speech_status

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
