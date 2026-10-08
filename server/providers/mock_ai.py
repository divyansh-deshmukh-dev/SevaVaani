import time
import re
from typing import Any, Optional
from server.providers.base import BaseAIProvider, UnderstandingInput, UnderstandingResult
from server.core.numbers import normalize_digits, parse_number_with_unit
from server.services.catalog import catalog

class MockAIProvider(BaseAIProvider):
    """
    Deterministic mock AI provider for zero-external-dependency offline testing
    and fast reliable execution.
    """
    async def understand(self, input_data: UnderstandingInput) -> UnderstandingResult:
        start_time = time.perf_counter()
        raw_text = input_data.text or ""
        text = raw_text.strip()
        lower_text = text.lower()
        context_state = input_data.contextState
        expecting_field = input_data.expectingField

        # 1. Global Commands
        # Help / Handoff
        if any(h in lower_text for h in ["help", "madad", "मदद", "सहायता", "operator", "human"]):
            latency = int((time.perf_counter() - start_time) * 1000) + 15
            return UnderstandingResult(
                transcript=text,
                detectedLanguage=input_data.language,
                intent="HELP",
                confidence=0.98,
                latencyMs=latency,
                provider="mock"
            )

        # Repeat
        if any(r in lower_text for r in ["repeat", "phir se", "fir se", "दोबारा", "पुन्हा", "पुन्हा सांगा", "once again"]):
            latency = int((time.perf_counter() - start_time) * 1000) + 15
            return UnderstandingResult(
                transcript=text,
                detectedLanguage=input_data.language,
                intent="REPEAT",
                confidence=0.95,
                latencyMs=latency,
                provider="mock"
            )

        # Back
        if any(b in lower_text for b in ["back", "peeche", "मागे", "previous"]):
            latency = int((time.perf_counter() - start_time) * 1000) + 15
            return UnderstandingResult(
                transcript=text,
                detectedLanguage=input_data.language,
                intent="BACK",
                confidence=0.95,
                latencyMs=latency,
                provider="mock"
            )

        # 2. In Confirmation State (CONFIRM_FIELD or SERVICE_CONFIRM or FINAL_REVIEW)
        if context_state in ("CONFIRM_FIELD", "SERVICE_CONFIRM", "FINAL_REVIEW"):
            # Yes
            if any(y in lower_text for y in ["yes", "हाँ", "हो", "haa", "ha", "सही", "सही है", "बरोबर", "correct", "bilkul", "submit"]):
                latency = int((time.perf_counter() - start_time) * 1000) + 15
                return UnderstandingResult(
                    transcript=text,
                    detectedLanguage=input_data.language,
                    intent="CONFIRM_YES",
                    confidence=0.99,
                    latencyMs=latency,
                    provider="mock"
                )
            # No / Correction
            elif any(n in lower_text for n in ["no", "नहीं", "नाही", "galat", "गलत", "wrong", "change", "nako"]):
                # Check if an inline correction is provided (e.g. "नहीं, मेरा नाम रमेश है")
                correction_match = re.search(r"(?:नहीं|नाही|no)[,\s]+(?:मेरा नाम|number|नाम|आखरी)?\s*(.+)", text, re.IGNORECASE)
                extracted = correction_match.group(1).strip() if correction_match else None
                latency = int((time.perf_counter() - start_time) * 1000) + 15
                return UnderstandingResult(
                    transcript=text,
                    detectedLanguage=input_data.language,
                    intent="CORRECTION" if extracted else "CONFIRM_NO",
                    extractedValue=extracted,
                    confidence=0.92,
                    latencyMs=latency,
                    provider="mock"
                )

        # 3. In Field Answer State (ASK_FIELD or AWAIT_ANSWER or FALLBACK_INPUT)
        if context_state in ("ASK_FIELD", "AWAIT_ANSWER", "FALLBACK_INPUT") and expecting_field:
            field_type = input_data.expectedFieldType or "text"
            extracted_val: Any = text
            norm_val: Any = text
            conf = 0.90

            # Intentional low confidence check for testing/eval
            if "unclear" in lower_text or "confused" in lower_text:
                conf = 0.40

            if field_type in ("digits", "number"):
                norm_val = normalize_digits(text)
                extracted_val = norm_val
                if not norm_val:
                    conf = 0.35
            elif field_type == "number_unit":
                val, unit = parse_number_with_unit(text)
                if val is not None:
                    norm_val = f"{val} {unit or 'acre'}"
                    extracted_val = norm_val
                else:
                    conf = 0.35
            elif field_type == "text":
                # Clean filler phrases e.g. "मेरा नाम रमेश है" -> "रमेश"
                cleaned = re.sub(r"^(मेरा नाम|नाव|name is|i am)\s+", "", text, flags=re.IGNORECASE)
                cleaned = re.sub(r"\s+है$", "", cleaned)
                norm_val = cleaned.strip()
                extracted_val = norm_val

            latency = int((time.perf_counter() - start_time) * 1000) + 20
            return UnderstandingResult(
                transcript=text,
                detectedLanguage=input_data.language,
                intent="FIELD_ANSWER",
                extractedValue=extracted_val,
                normalizedValue=norm_val,
                confidence=conf,
                latencyMs=latency,
                provider="mock"
            )

        # 4. Service Discovery / Problem Discovery State
        # Check if direct service matches catalog
        matched_service, conf, _ = catalog.match_service(text, input_data.language)
        if matched_service and conf >= 0.70:
            latency = int((time.perf_counter() - start_time) * 1000) + 20
            return UnderstandingResult(
                transcript=text,
                detectedLanguage=input_data.language,
                intent="DIRECT_SERVICE",
                serviceId=matched_service.serviceId,
                confidence=conf,
                latencyMs=latency,
                provider="mock"
            )

        # Check problem / need patterns
        need_keywords = [
            "farmer", "किसान", "शेतकरी", "pension", "पेंशन", "पेन्शन",
            "ration", "राशन", "रेशन", "scholarship", "छात्रवृत्ति", "शिष्यवृत्ती",
            "house", "makan", "आवास", "घर", "financial help", "आर्थिक सहायता",
            "मदत", "सहाय्य", "help"
        ]
        if any(kw in lower_text for kw in need_keywords):
            latency = int((time.perf_counter() - start_time) * 1000) + 20
            return UnderstandingResult(
                transcript=text,
                detectedLanguage=input_data.language,
                intent="PROBLEM_NEED",
                confidence=0.88,
                latencyMs=latency,
                provider="mock"
            )

        # Fallback / Unclear
        latency = int((time.perf_counter() - start_time) * 1000) + 20
        return UnderstandingResult(
            transcript=text,
            detectedLanguage=input_data.language,
            intent="UNCLEAR",
            confidence=0.30,
            latencyMs=latency,
            provider="mock"
        )
