import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file from project root or server dir
BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env")
load_dotenv(Path(__file__).resolve().parent / ".env")

class Settings:
    PROJECT_NAME: str = "SevaVaani - Unified Multilingual Government Service Assistant"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    
    # Mock Mode: default to true for zero-dependency local runs and tests
    MOCK_MODE: bool = os.getenv("MOCK_MODE", "true").lower() in ("true", "1", "yes")
    
    # Provider configurations
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "mock")
    STT_PROVIDER: str = os.getenv("STT_PROVIDER", "browser")
    TTS_PROVIDER: str = os.getenv("TTS_PROVIDER", "browser")
    
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    GEMINI_TTS_MODEL: str = os.getenv("GEMINI_TTS_MODEL", "gemini-2.0-flash")
    
    # Sarvam AI Speech Configuration
    SARVAM_API_KEY: str = os.getenv("SARVAM_API_KEY", "")
    SARVAM_STT_MODEL: str = os.getenv("SARVAM_STT_MODEL", "saaras:v1")
    SARVAM_TTS_MODEL: str = os.getenv("SARVAM_TTS_MODEL", "bulbul:v1")
    
    @property
    def CORS_ORIGINS(self) -> list[str]:
        default_origins = [
            "https://seva-vaani.vercel.app",
            "http://localhost:5173",
            "http://127.0.0.1:5173",
            "http://localhost:3000",
            "http://localhost:8000",
        ]
        raw = os.getenv("CORS_ORIGINS", "")
        if not raw:
            return default_origins
        custom = [o.strip() for o in raw.split(",") if o.strip()]
        return list(dict.fromkeys(default_origins + custom))

settings = Settings()
