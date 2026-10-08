from abc import ABC, abstractmethod
from typing import Any

class BaseServiceAdapter(ABC):
    @abstractmethod
    async def validate_application(self, data: dict[str, Any]) -> tuple[bool, list[str]]:
        """Validates all application fields before submission"""
        pass

    @abstractmethod
    async def submit_application(self, data: dict[str, Any]) -> dict[str, Any]:
        """Submits the application and returns application reference details"""
        pass

    @abstractmethod
    async def get_status(self, application_id: str) -> dict[str, Any]:
        """Fetches application tracking status"""
        pass
