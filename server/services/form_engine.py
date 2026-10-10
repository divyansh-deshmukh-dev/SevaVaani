import json
from pathlib import Path
from typing import Any, Optional
from core.models import FormFieldDefinition, FormSchema
from core import validators

FORMS_DIR = Path(__file__).resolve().parent.parent / "data"

class GenericFormEngine:
    def __init__(self, forms_dir: Path = FORMS_DIR):
        self.forms_dir = forms_dir
        self._schemas: dict[str, FormSchema] = {}
        self.load_all()

    def load_all(self):
        for path in self.forms_dir.glob("*_form.json"):
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
                schema = FormSchema(**data)
                self._schemas[schema.formId] = schema

    def get_form_schema(self, form_id: str) -> Optional[FormSchema]:
        return self._schemas.get(form_id)

    def validate_field(
        self, field_def: FormFieldDefinition, raw_value: Any, state_val: Optional[str] = None
    ) -> tuple[bool, Any, Optional[str]]:
        """
        Pure deterministic validation based on field type and field ID rules.
        Returns: (is_valid, normalized_value, error_message)
        """
        if raw_value is None or (isinstance(raw_value, str) and not raw_value.strip()):
            if field_def.required:
                return False, "", "This field is required."
            return True, "", None

        str_val = str(raw_value).strip()

        # Specific field ID checks
        if field_def.id == "full_name":
            return validators.validate_name(str_val)
        elif field_def.id == "aadhaar":
            return validators.validate_aadhaar(str_val)
        elif field_def.id == "mobile":
            return validators.validate_mobile(str_val)
        elif field_def.id == "state":
            return validators.validate_state(str_val)
        elif field_def.id == "district":
            return validators.validate_district(str_val, state_val)
        elif field_def.id == "village":
            return validators.validate_village(str_val)
        elif field_def.id == "land_area":
            return validators.validate_land_area(str_val)

        # Fallback by generic type
        if field_def.type == "digits":
            digits = validators.normalize_digits(str_val)
            if not digits:
                return False, "", "Please provide valid digits."
            return True, digits, None
        elif field_def.type == "number":
            try:
                num = float(str_val)
                return True, num, None
            except ValueError:
                return False, str_val, "Please provide a valid number."
        elif field_def.type == "number_unit":
            return validators.validate_land_area(str_val)
        elif field_def.type == "place":
            return validators.validate_state(str_val)
        elif field_def.type == "text":
            return validators.validate_name(str_val)

        return True, str_val, None

    def initialize_session_form(self, form_id: str) -> dict:
        schema = self.get_form_schema(form_id)
        if not schema:
            raise ValueError(f"Form schema '{form_id}' not found.")

        return {
            "formId": form_id,
            "fields": [f.model_dump() for f in schema.fields],
            "currentIndex": 0,
            "data": {},
            "statuses": {f.id: "pending" for f in schema.fields},
            "history": []
        }

    def process_field_value(
        self, form_session: dict, field_id: str, raw_value: Any
    ) -> tuple[bool, Any, Optional[str]]:
        schema = self.get_form_schema(form_session["formId"])
        if not schema:
            return False, raw_value, "Schema not found."

        field_def = next((f for f in schema.fields if f.id == field_id), None)
        if not field_def:
            return False, raw_value, f"Field '{field_id}' not found in form schema."

        state_context = form_session["data"].get("state")
        valid, normalized, err = self.validate_field(field_def, raw_value, state_context)

        if valid:
            form_session["data"][field_id] = normalized
            form_session["statuses"][field_id] = "captured"
            return True, normalized, None
        else:
            return False, raw_value, err

    def confirm_field(self, form_session: dict, field_id: str) -> bool:
        if field_id in form_session["statuses"] and form_session["statuses"][field_id] == "captured":
            form_session["statuses"][field_id] = "confirmed"
            # Advance index if current
            schema = self.get_form_schema(form_session["formId"])
            if schema:
                for idx, f in enumerate(schema.fields):
                    if form_session["statuses"].get(f.id) in ("pending", "unverified"):
                        form_session["currentIndex"] = idx
                        return True
                # If all confirmed
                form_session["currentIndex"] = len(schema.fields)
            return True
        return False

    def is_complete(self, form_session: dict) -> bool:
        schema = self.get_form_schema(form_session["formId"])
        if not schema:
            return False
        for f in schema.fields:
            if f.required and form_session["statuses"].get(f.id) != "confirmed":
                return False
        return True

    def get_summary(self, form_session: dict, language: str = "hi") -> list[dict]:
        schema = self.get_form_schema(form_session["formId"])
        if not schema:
            return []

        summary = []
        for f in schema.fields:
            val = form_session["data"].get(f.id, "")
            # Mask Aadhaar and mobile for privacy in summary/logs
            display_val = str(val)
            if f.id == "aadhaar" and len(display_val) == 12:
                display_val = "XXXX-XXXX-" + display_val[-4:]
            elif f.id == "mobile" and len(display_val) == 10:
                display_val = display_val[:2] + "XXXXXX" + display_val[-2:]

            summary.append({
                "fieldId": f.id,
                "label": getattr(f.label, language, f.label.en),
                "value": display_val,
                "rawValue": val,
                "status": form_session["statuses"].get(f.id, "pending")
            })
        return summary

form_engine = GenericFormEngine()
