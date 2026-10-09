from server.config import settings
from server.speech.base import (
    BaseSTTProvider,
    BaseTTSProvider,
    SpeechServiceStatus
)
from server.speech.sarvam import SarvamSTTProvider, SarvamTTSProvider

def get_stt_provider() -> BaseSTTProvider:
    """Returns the configured server STT provider."""
    return SarvamSTTProvider()

def get_tts_provider() -> BaseTTSProvider:
    """Returns the configured server TTS provider."""
    return SarvamTTSProvider()

def get_speech_status() -> SpeechServiceStatus:
    """Returns the live speech provider readiness and configuration status."""
    stt = get_stt_provider()
    tts = get_tts_provider()

    sarvam_configured = bool(settings.SARVAM_API_KEY and settings.SARVAM_API_KEY.strip())
    missing = []
    if not sarvam_configured:
        missing.append("SARVAM_API_KEY")

    if sarvam_configured:
        msg = f"Server-side Sarvam AI speech provider is configured (STT: {settings.SARVAM_STT_MODEL}, TTS: {settings.SARVAM_TTS_MODEL})."
        active_provider = "sarvam"
    else:
        msg = (
            "Server-side speech provider (Sarvam AI) is not configured. "
            "The system gracefully uses the client-side browser Web Speech API for Hindi, Marathi, and English."
        )
        active_provider = "browser"

    return SpeechServiceStatus(
        configured=sarvam_configured,
        provider=active_provider,
        sttAvailable=sarvam_configured,
        ttsAvailable=sarvam_configured,
        supportedLanguages=["hi", "mr", "en"],
        missingEnvVars=missing,
        message=msg
    )
