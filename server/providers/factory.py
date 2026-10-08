from server.config import settings
from server.providers.base import BaseAIProvider
from server.providers.mock_ai import MockAIProvider
from server.providers.gemini_ai import GeminiAIProvider

def get_ai_provider() -> BaseAIProvider:
    if settings.MOCK_MODE or settings.LLM_PROVIDER.lower() == "mock":
        return MockAIProvider()
    elif settings.LLM_PROVIDER.lower() == "gemini":
        return GeminiAIProvider()
    return MockAIProvider()
