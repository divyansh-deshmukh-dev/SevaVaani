import logging
import uuid
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from server.config import settings

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
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
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
        }
    }

from server.routes.services import router as services_router
from server.routes.session import router as session_router
from server.routes.discovery import router as discovery_router
from server.routes.metrics import router as metrics_router
from server.routes.eval import router as eval_router

app.include_router(services_router)
app.include_router(session_router)
app.include_router(discovery_router)
app.include_router(metrics_router)
app.include_router(eval_router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server.main:app", host=settings.HOST, port=settings.PORT, reload=True)
