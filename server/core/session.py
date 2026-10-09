import time
import uuid
from typing import Any, Optional
from pydantic import BaseModel, Field
from server.core.models import LocalizedString, SessionState

class SessionData(BaseModel):
    sessionId: str = Field(default_factory=lambda: str(uuid.uuid4()))
    state: SessionState = "WELCOME"
    language: str = "hi"
    selectedServiceId: Optional[str] = None
    formSession: Optional[dict[str, Any]] = None
    currentFieldId: Optional[str] = None
    lastAssistantMessage: LocalizedString = Field(
        default_factory=lambda: LocalizedString(
            en="Welcome to SevaVaani. How can I assist you today?",
            hi="सेवावाणी में आपका स्वागत है। मैं आपकी क्या सहायता कर सकता हूँ?",
            mr="सेवावाणीमध्ये आपले स्वागत आहे. मी आपल्याला कशी मदत करू शकतो?"
        )
    )
    failureCount: dict[str, int] = Field(default_factory=dict)
    fallbackLevel: int = 0
    handoffRecord: Optional[dict[str, Any]] = None
    submissionResult: Optional[dict[str, Any]] = None
    transcriptHistory: list[str] = Field(default_factory=list)
    metrics: list[dict[str, Any]] = Field(default_factory=list)
    createdAt: float = Field(default_factory=time.time)
    updatedAt: float = Field(default_factory=time.time)

class SessionStore:
    def __init__(self, ttl_seconds: int = 3600):
        self._sessions: dict[str, SessionData] = {}
        self.ttl = ttl_seconds

    def create_session(self, language: str = "hi") -> SessionData:
        self.cleanup()
        session = SessionData(language=language)
        self._sessions[session.sessionId] = session
        return session

    def get_session(self, session_id: str) -> Optional[SessionData]:
        session = self._sessions.get(session_id)
        if session:
            session.updatedAt = time.time()
        return session

    def get_or_create(self, session_id: str, language: str = "hi") -> SessionData:
        session = self._sessions.get(session_id)
        if not session:
            session = SessionData(sessionId=session_id, language=language)
            self._sessions[session_id] = session
        else:
            session.updatedAt = time.time()
        return session

    def save_session(self, session: SessionData):
        session.updatedAt = time.time()
        self._sessions[session.sessionId] = session

    def cleanup(self):
        now = time.time()
        expired = [sid for sid, s in self._sessions.items() if (now - s.updatedAt) > self.ttl]
        for sid in expired:
            del self._sessions[sid]

session_store = SessionStore()
