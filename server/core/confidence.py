from typing import Optional

FIELD_THRESHOLDS = {
    "full_name": 0.60,
    "aadhaar": 0.85,
    "mobile": 0.85,
    "state": 0.60,
    "district": 0.60,
    "village": 0.55,
    "land_area": 0.70
}

def calculate_confidence(
    model_confidence: float,
    field_id: Optional[str] = None,
    is_valid: bool = True,
    transcript: str = "",
    detected_intent: Optional[str] = None
) -> float:
    """
    Combines model confidence with deterministic validation and penalties.
    Clamps between 0.0 and 1.0.
    """
    conf = float(model_confidence)

    # Penalties
    if not is_valid:
        conf -= 0.40

    if not transcript or len(transcript.strip()) < 2:
        conf -= 0.30

    if detected_intent == "UNCLEAR":
        conf -= 0.35

    # Clamp
    conf = max(0.0, min(1.0, conf))
    return round(conf, 2)

def is_confident_enough(field_id: str, confidence: float) -> bool:
    threshold = FIELD_THRESHOLDS.get(field_id, 0.65)
    return confidence >= threshold
