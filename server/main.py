import logging
import sys
from pathlib import Path
import types
import uuid

# Ensure the server directory is on sys.path so internal imports resolve
# seamlessly regardless of whether the app is started from repo root or server dir
_SERVER_DIR = Path(__file__).resolve().parent
if str(_SERVER_DIR) not in sys.path:
    sys.path.insert(0, str(_SERVER_DIR))

# Backward-compatibility alias for "server" package if running standalone (e.g. on Vercel)
if "server" not in sys.modules:
    _server_pkg = types.ModuleType("server")
    _server_pkg.__path__ = [str(_SERVER_DIR)]
    _server_pkg.__file__ = str(_SERVER_DIR / "__init__.py")
    _server_pkg.__package__ = "server"
    sys.modules["server"] = _server_pkg

import importlib
import importlib.abc
import importlib.machinery
import importlib.util

class _ServerAliasLoader(importlib.abc.Loader):
    def __init__(self, target_name: str):
        self.target_name = target_name

    def create_module(self, spec):
        mod = importlib.import_module(self.target_name)
        sys.modules[spec.name] = mod
        return mod

    def exec_module(self, module):
        pass

class _ServerAliasFinder(importlib.abc.MetaPathFinder):
    def find_spec(self, fullname, path, target=None):
        if fullname.startswith("server."):
            sub = fullname[7:]
            try:
                if importlib.util.find_spec(sub) is not None:
                    return importlib.machinery.ModuleSpec(fullname, _ServerAliasLoader(sub))
            except Exception:
                pass
        return None

if not any(isinstance(finder, _ServerAliasFinder) for finder in sys.meta_path):
    sys.meta_path.insert(0, _ServerAliasFinder())

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from config import settings

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO),
    format="%(asctime)s [%(levelname)s] [%(name)s] %(message)s"
)
logger = logging.getLogger("sevavaani")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Unified Multilingual Government Service Assistant API"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_origin_regex=r"^https://.*\.vercel\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["X-Request-ID"],
)

# Request ID & logging middleware
@app.middleware("http")
async def request_context_middleware(request: Request, call_next):
    request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
    request.state.request_id = request_id
    logger.info(f"Incoming {request.method} {request.url.path} [ReqID: {request_id}]")
    try:
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        return response
    except Exception as exc:
        logger.exception(f"Unhandled error processing {request.method} {request.url.path}: {exc}")
        return JSONResponse(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            content={
                "error": "InternalServerError",
                "message": "An unexpected server error occurred.",
                "requestId": request_id
            },
            headers={"X-Request-ID": request_id}
        )

@app.get("/", tags=["System"])
async def root():
    """Root entrypoint for service verification"""
    return {
        "service": "SevaVaani API",
        "status": "online",
        "version": settings.VERSION,
        "docs": "/docs",
        "health": "/health"
    }

@app.get("/health", tags=["System"])
async def health_check():
    """System health check endpoint"""
    return {
        "status": "healthy",
        "service": "SevaVaani",
        "version": settings.VERSION,
        "mockMode": settings.MOCK_MODE,
        "environment": settings.ENVIRONMENT,
        "providers": {
            "llm": settings.LLM_PROVIDER,
            "stt": settings.STT_PROVIDER,
            "sarvamConfigured": bool(settings.SARVAM_API_KEY and settings.SARVAM_API_KEY.strip()),
        }
    }

from routes.services import router as services_router
from routes.session import router as session_router
from routes.discovery import router as discovery_router
from routes.metrics import router as metrics_router
from routes.eval import router as eval_router
from routes.speech import router as speech_router

app.include_router(services_router)
app.include_router(session_router)
app.include_router(discovery_router)
app.include_router(metrics_router)
app.include_router(eval_router)
app.include_router(speech_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
