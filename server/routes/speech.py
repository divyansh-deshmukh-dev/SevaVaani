import logging
from typing import Optional
from fastapi import APIRouter, File, UploadFile, Form, HTTPException, status
from pydantic import BaseModel

from server.speech.base import (
    STTResponse,
    TTSResponse,
    SpeechServiceStatus,
    ProviderNotConfiguredError,
    ProviderAuthError,
    ProviderRateLimitError,
    ProviderTimeoutError,
    SpeechProviderError
)
from server.speech.factory import (
    get_stt_provider,
    get_tts_provider,
    get_speech_status
)

import base64

logger = logging.getLogger("sevavaani.routes.speech")

router = APIRouter(prefix="/api/speech", tags=["Speech"])

class STTBase64Request(BaseModel):
    audioBase64: str
    language: str = "hi"
    mimeType: str = "audio/wav"

class TTSRequest(BaseModel):
    text: str
    language: str = "hi"
    speaker: Optional[str] = None

@router.get("/status", response_model=SpeechServiceStatus)
async def get_speech_provider_status():
    """
    Check the server-side speech provider status.
    Informs client whether Sarvam AI or browser fallback is active.
    """
    return get_speech_status()

@router.post("/stt", response_model=STTResponse)
async def transcribe_speech(
    file: UploadFile = File(...),
    language: str = Form("hi")
):
    """
    Transcribe audio file via configured server-side STT provider (Sarvam AI Saaras).
    Returns 503 if provider credentials are not configured.
    """
    provider = get_stt_provider()
    try:
        content = await file.read()
        mime_type = file.content_type or "audio/wav"
        result = await provider.transcribe(content, language=language, mime_type=mime_type)
        return result
    except ProviderNotConfiguredError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "error": "ProviderNotConfigured",
                "message": exc.message,
                "provider": exc.provider,
                "fallback": "Use browser Web Speech API (SpeechRecognition)"
            }
        )
    except ProviderAuthError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": "ProviderAuthError", "message": exc.message, "provider": exc.provider}
        )
    except ProviderRateLimitError as exc:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={"error": "ProviderRateLimitError", "message": exc.message, "provider": exc.provider}
        )
    except ProviderTimeoutError as exc:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail={"error": "ProviderTimeoutError", "message": exc.message, "provider": exc.provider}
        )
    except SpeechProviderError as exc:
        raise HTTPException(
            status_code=exc.status_code,
            detail={"error": "SpeechProviderError", "message": exc.message, "provider": exc.provider}
        )
    except Exception as exc:
        logger.exception("Unexpected error in /api/speech/stt: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "InternalSpeechError", "message": str(exc)}
        )

@router.post("/stt-base64", response_model=STTResponse)
async def transcribe_speech_base64(req: STTBase64Request):
    """
    Transcribe base64 audio via configured server-side STT provider (Sarvam AI Saaras).
    """
    provider = get_stt_provider()
    try:
        try:
            content = base64.b64decode(req.audioBase64)
        except Exception:
            raise HTTPException(status_code=400, detail={"error": "InvalidBase64", "message": "Failed to decode base64 audio."})

        result = await provider.transcribe(content, language=req.language, mime_type=req.mimeType)
        return result
    except HTTPException:
        raise
    except ProviderNotConfiguredError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "error": "ProviderNotConfigured",
                "message": exc.message,
                "provider": exc.provider,
                "fallback": "Use browser Web Speech API (SpeechRecognition)"
            }
        )
    except ProviderAuthError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": "ProviderAuthError", "message": exc.message, "provider": exc.provider}
        )
    except ProviderRateLimitError as exc:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={"error": "ProviderRateLimitError", "message": exc.message, "provider": exc.provider}
        )
    except ProviderTimeoutError as exc:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail={"error": "ProviderTimeoutError", "message": exc.message, "provider": exc.provider}
        )
    except SpeechProviderError as exc:
        raise HTTPException(
            status_code=exc.status_code,
            detail={"error": "SpeechProviderError", "message": exc.message, "provider": exc.provider}
        )
    except Exception as exc:
        logger.exception("Unexpected error in /api/speech/stt-base64: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "InternalSpeechError", "message": str(exc)}
        )

@router.post("/tts", response_model=TTSResponse)
async def synthesize_speech(req: TTSRequest):
    """
    Synthesize speech audio via configured server-side TTS provider (Sarvam AI Bulbul).
    Returns 503 if provider credentials are not configured.
    """
    provider = get_tts_provider()
    try:
        result = await provider.synthesize(req.text, language=req.language, speaker=req.speaker)
        return result
    except ProviderNotConfiguredError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail={
                "error": "ProviderNotConfigured",
                "message": exc.message,
                "provider": exc.provider,
                "fallback": "Use browser Web Speech API (speechSynthesis)"
            }
        )
    except ProviderAuthError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"error": "ProviderAuthError", "message": exc.message, "provider": exc.provider}
        )
    except ProviderRateLimitError as exc:
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail={"error": "ProviderRateLimitError", "message": exc.message, "provider": exc.provider}
        )
    except ProviderTimeoutError as exc:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail={"error": "ProviderTimeoutError", "message": exc.message, "provider": exc.provider}
        )
    except SpeechProviderError as exc:
        raise HTTPException(
            status_code=exc.status_code,
            detail={"error": "SpeechProviderError", "message": exc.message, "provider": exc.provider}
        )
    except Exception as exc:
        logger.exception("Unexpected error in /api/speech/tts: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail={"error": "InternalSpeechError", "message": str(exc)}
        )
