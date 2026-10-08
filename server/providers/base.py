from abc import ABC, abstractmethod
from typing import Any, Optional
from pydantic import BaseModel

class UnderstandingInput(BaseModel):
    text: Optional[str] = None
    audioBase64: Optional[str] = None
    mimeType: Optional[str] = "audio/webm"
    language: str = "hi"
    contextState: str = "WELCOME"
    expectingField: Optional[str] = None
    expectedFieldType: Optional[str] = None
    lastPrompt: Optional[str] = None
    currentFormData: dict[str, Any] = {}

class UnderstandingResult(BaseModel):
    transcript: str
    detectedLanguage: str = "hi"
    intent: str  # DIRECT_SERVICE, PROBLEM_NEED, FIELD_ANSWER, CONFIRM_YES, CONFIRM_NO, CORRECTION, REPEAT, HELP, BACK, CANCEL, UNCLEAR
    serviceId: Optional[str] = None
    extractedValue: Optional[Any] = None
    normalizedValue: Optional[Any] = None
    confidence: float = 1.0
    reason: Optional[str] = None
    latencyMs: int = 10
    provider: str = "mock"

class BaseAIProvider(ABC):
    @abstractmethod
    async def understand(self, input_data: UnderstandingInput) -> UnderstandingResult:
        pass
