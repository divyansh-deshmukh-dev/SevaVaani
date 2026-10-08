import json
import re
from pathlib import Path
from typing import Optional
from server.core.models import ServiceDefinition

CATALOG_FILE = Path(__file__).resolve().parent.parent / "data" / "services.json"

class ServiceCatalog:
    def __init__(self, catalog_path: Path = CATALOG_FILE):
        self.catalog_path = catalog_path
        self._services: dict[str, ServiceDefinition] = {}
        self.load()

    def load(self):
        with open(self.catalog_path, "r", encoding="utf-8") as f:
            raw_data = json.load(f)
            self._services = {
                item["serviceId"]: ServiceDefinition(**item)
                for item in raw_data
            }

    def list_services(self) -> list[ServiceDefinition]:
        return list(self._services.values())

    def get_service(self, service_id: str) -> Optional[ServiceDefinition]:
        return self._services.get(service_id)

    def _normalize(self, text: str) -> str:
        if not text:
            return ""
        # Lowercase, strip punctuation and collapse whitespace
        text = text.lower()
        text = re.sub(r"[^\w\s\u0900-\u097F]", " ", text)
        return " ".join(text.split())

    def match_service(
        self, query: str, language: str = "hi"
    ) -> tuple[Optional[ServiceDefinition], float, list[ServiceDefinition]]:
        """
        Deterministic matching engine.
        Returns: (best_match_or_none, confidence, list_of_ranked_candidates)
        """
        norm_query = self._normalize(query)
        if not norm_query:
            return None, 0.0, []

        scored_candidates: list[tuple[ServiceDefinition, float]] = []

        for service in self._services.values():
            score = 0.0

            # 1. Exact ID match
            if norm_query == self._normalize(service.serviceId):
                score = 1.0

            # 2. Check localized names
            for lang_code in ("hi", "mr", "en"):
                name_val = self._normalize(getattr(service.name, lang_code, ""))
                if norm_query == name_val:
                    score = max(score, 1.0)
                elif name_val and (name_val in norm_query or norm_query in name_val):
                    score = max(score, 0.90)

            # 3. Check aliases
            for alias in service.aliases:
                norm_alias = self._normalize(alias)
                if not norm_alias:
                    continue
                if norm_query == norm_alias:
                    score = max(score, 1.0)
                elif norm_alias in norm_query:
                    # e.g. "mujhe pm kisan chahiye" contains "pm kisan"
                    score = max(score, 0.95)
                elif norm_query in norm_alias:
                    score = max(score, 0.85)
                else:
                    # Token overlap
                    query_tokens = set(norm_query.split())
                    alias_tokens = set(norm_alias.split())
                    overlap = query_tokens.intersection(alias_tokens)
                    if overlap:
                        token_score = len(overlap) / max(len(alias_tokens), 1) * 0.75
                        score = max(score, token_score)

            if score > 0.4:
                scored_candidates.append((service, score))

        # Sort descending by score
        scored_candidates.sort(key=lambda x: x[1], reverse=True)

        if not scored_candidates:
            return None, 0.0, []

        best_service, best_score = scored_candidates[0]
        candidates = [s for s, _ in scored_candidates]

        # If confidence threshold is met
        if best_score >= 0.70:
            return best_service, best_score, candidates
        else:
            return None, best_score, candidates

    def get_service_guidance(self, service_id: str, language: str = "hi") -> Optional[dict]:
        service = self.get_service(service_id)
        if not service:
            return None

        # Build guidance package
        guidance = {
            "serviceId": service.serviceId,
            "title": getattr(service.name, language, service.name.en),
            "description": getattr(service.description, language, service.description.en),
            "directApplicationSupported": service.directApplicationSupported,
            "officialSource": service.officialSource,
            "requiredDocuments": [
                getattr(doc, language, doc.en)
                for doc in service.requiredDocuments
            ],
            "applicationSteps": [
                {
                    "step": 1,
                    "title": "Document Verification" if language == "en" else ("दस्तावेज़ तैयारी" if language == "hi" else "कागदपत्रे तयार करणे"),
                    "details": "Gather required identification and income/land certificates." if language == "en" else ("आवश्यक पहचान और आय/भूमि प्रमाण पत्र एकत्र करें।" if language == "hi" else "आवश्यक ओळख व उत्पन्न/जमीन दाखले गोळा करा.")
                },
                {
                    "step": 2,
                    "title": "Official Portal / Seva Kendra" if language == "en" else ("आधिकारिक पोर्टल या सेवा केंद्र" if language == "hi" else "अधिकृत पोर्टल किंवा आपले सरकार सेवा केंद्र"),
                    "details": f"Visit {service.officialSource or 'the official district portal'} or nearest Common Service Center (CSC)."
                },
                {
                    "step": 3,
                    "title": "Application Submission & Receipt" if language == "en" else ("आवेदन जमा करना और पावती" if language == "hi" else "अर्ज सादर करणे व पोच पावती"),
                    "details": "Submit the verified form and retain your application tracking acknowledgment." if language == "en" else ("सत्यापित फॉर्म जमा करें और अपनी ट्रैकिंग पावती सुरक्षित रखें।" if language == "hi" else "सत्यापित अर्ज जमा करा आणि ट्रॅकिंग पोच पावती सुरक्षित ठेवा.")
                }
            ],
            "disclaimer": "This prototype provides information and guidance only. Real applications must be submitted through the official government portal or authorized service centers." if language == "en" else (
                "यह प्रोटोटाइप केवल सूचना और मार्गदर्शन प्रदान करता है। वास्तविक आवेदन आधिकारिक सरकारी पोर्टल या अधिकृत सेवा केंद्रों के माध्यम से ही जमा किए जाने चाहिए।" if language == "hi" else
                "हा प्रोटोटाइप केवळ माहिती आणि मार्गदर्शन प्रदान करतो. प्रत्यक्ष अर्ज अधिकृत सरकारी पोर्टल किंवा सेवा केंद्रांद्वारेच सादर करावेत."
            )
        }
        return guidance

catalog = ServiceCatalog()
