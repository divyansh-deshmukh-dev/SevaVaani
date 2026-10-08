import time
import uuid
from typing import Any
from server.services.adapters.base import BaseServiceAdapter
from server.services.form_engine import form_engine

class DemoPmKisanAdapter(BaseServiceAdapter):
    """
    Demo adapter for PM-Kisan Farmer Registration.
    Clearly marks all applications as DEMO / PROTOTYPE.
    Does not interact with any real government databases or APIs.
    """
    def __init__(self):
        self._demo_records: dict[str, dict[str, Any]] = {}

    async def validate_application(self, data: dict[str, Any]) -> tuple[bool, list[str]]:
        schema = form_engine.get_form_schema("pm_kisan_form")
        if not schema:
            return False, ["PM-Kisan form schema not found."]

        errors = []
        state_context = data.get("state")
        for field in schema.fields:
            val = data.get(field.id)
            is_valid, _, err = form_engine.validate_field(field, val, state_context)
            if not is_valid:
                errors.append(f"{field.label.en}: {err or 'Invalid value'}")

        return len(errors) == 0, errors

    async def submit_application(self, data: dict[str, Any]) -> dict[str, Any]:
        # Validate first
        is_valid, errors = await self.validate_application(data)
        if not is_valid:
            return {
                "success": False,
                "errors": errors,
                "message": "Application validation failed."
            }

        date_code = time.strftime("%Y%m%d")
        rand_suffix = str(uuid.uuid4())[:4].upper()
        app_id = f"DEMO-PMK-{date_code}-{rand_suffix}"

        # Mask Aadhaar & mobile before recording
        masked_snapshot = dict(data)
        if "aadhaar" in masked_snapshot and len(str(masked_snapshot["aadhaar"])) == 12:
            masked_snapshot["aadhaar"] = "XXXX-XXXX-" + str(masked_snapshot["aadhaar"])[-4:]
        if "mobile" in masked_snapshot and len(str(masked_snapshot["mobile"])) == 10:
            m = str(masked_snapshot["mobile"])
            masked_snapshot["mobile"] = m[:2] + "XXXXXX" + m[-2:]

        record = {
            "applicationId": app_id,
            "serviceId": "pm_kisan",
            "serviceName": "PM-Kisan Farmer Registration (Demo)",
            "submittedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ"),
            "status": "SUBMITTED (DEMO)",
            "isDemo": True,
            "data": masked_snapshot,
            "message": "Demo application successfully processed. Prototype only - no government database updated."
        }
        self._demo_records[app_id] = record

        return {
            "success": True,
            "applicationId": app_id,
            "status": record["status"],
            "submittedAt": record["submittedAt"],
            "message": record["message"],
            "isDemo": True
        }

    async def get_status(self, application_id: str) -> dict[str, Any]:
        record = self._demo_records.get(application_id)
        if record:
            return {
                "found": True,
                "applicationId": application_id,
                "status": record["status"],
                "serviceName": record["serviceName"],
                "submittedAt": record["submittedAt"],
                "isDemo": True,
                "details": record
            }
        else:
            return {
                "found": False,
                "applicationId": application_id,
                "message": "Demo application ID not found."
            }

demo_pm_kisan_adapter = DemoPmKisanAdapter()
