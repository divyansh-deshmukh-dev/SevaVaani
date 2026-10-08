import json
import re
from pathlib import Path
from typing import Optional
from server.core.numbers import normalize_digits, parse_number_with_unit

PLACES_FILE = Path(__file__).resolve().parent.parent / "data" / "places.json"

def _load_places():
    try:
        with open(PLACES_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return {"states": [], "districts": {}}

PLACES_DATA = _load_places()

def validate_name(name: str) -> tuple[bool, str, Optional[str]]:
    """Validates full name (2-60 chars, letters/spaces in English or Devanagari)"""
    if not name or not isinstance(name, str):
        return False, "", "Name cannot be empty."
    
    cleaned = " ".join(name.strip().split())
    if len(cleaned) < 2:
        return False, cleaned, "Name is too short (minimum 2 characters)."
    if len(cleaned) > 60:
        return False, cleaned, "Name is too long (maximum 60 characters)."
        
    # Check for valid characters: English, Devanagari, space, dot, hyphen
    if not re.match(r"^[\s\.\-a-zA-Z\u0900-\u097F]+$", cleaned):
        return False, cleaned, "Name contains invalid characters."

    return True, cleaned, None

def validate_aadhaar(aadhaar_input: str) -> tuple[bool, str, Optional[str]]:
    """Validates Aadhaar: exactly 12 digits, not all identical (dummy safe)"""
    digits = normalize_digits(str(aadhaar_input))
    if len(digits) != 12:
        return False, digits, f"Aadhaar must be exactly 12 digits (got {len(digits)})."
    
    # Check if all digits are identical
    if len(set(digits)) == 1:
        return False, digits, "Invalid Aadhaar: digits cannot all be the same."
        
    return True, digits, None

def validate_mobile(mobile_input: str) -> tuple[bool, str, Optional[str]]:
    """Validates 10-digit mobile number starting with 6-9"""
    digits = normalize_digits(str(mobile_input))
    if len(digits) != 10:
        return False, digits, f"Mobile number must be exactly 10 digits (got {len(digits)})."
    
    if digits[0] not in ("6", "7", "8", "9"):
        return False, digits, "Indian mobile number must start with 6, 7, 8, or 9."
        
    return True, digits, None

def validate_state(state_input: str) -> tuple[bool, str, Optional[str]]:
    """Matches Indian state/UT from places dataset"""
    if not state_input:
        return False, "", "State name cannot be empty."
        
    query = state_input.strip().lower()
    for item in PLACES_DATA.get("states", []):
        en_name = item["en"].lower()
        hi_name = item.get("hi", "").lower()
        mr_name = item.get("mr", "").lower()
        code = item.get("code", "").lower()
        
        if query in (en_name, hi_name, mr_name, code) or en_name in query or query in en_name:
            return True, item["en"], None

    # Fallback: if reasonable length string
    if len(state_input.strip()) >= 3:
        return True, state_input.strip().title(), None

    return False, state_input, "Please specify a valid state name."

def validate_district(district_input: str, state: Optional[str] = None) -> tuple[bool, str, Optional[str]]:
    """Validates district against state dataset where available, or standard string"""
    if not district_input:
        return False, "", "District cannot be empty."
    
    cleaned = district_input.strip().title()
    if len(cleaned) < 2:
        return False, cleaned, "District name is too short."

    # If state known, attempt fuzzy match
    if state and state in PLACES_DATA.get("districts", []):
        dists = PLACES_DATA["districts"][state]
        query = cleaned.lower()
        for d in dists:
            if query == d.lower() or query in d.lower() or d.lower() in query:
                return True, d, None

    # Accept valid name
    return True, cleaned, None

def validate_village(village_input: str) -> tuple[bool, str, Optional[str]]:
    """Validates village name (2-60 chars)"""
    if not village_input:
        return False, "", "Village name cannot be empty."
    
    cleaned = village_input.strip()
    if len(cleaned) < 2 or len(cleaned) > 60:
        return False, cleaned, "Village name must be between 2 and 60 characters."

    return True, cleaned, None

def validate_land_area(land_input: str) -> tuple[bool, str, Optional[str]]:
    """Validates land area in acres/hectares/bighas (0.01 - 1000)"""
    val, unit = parse_number_with_unit(str(land_input))
    if val is None:
        return False, "", "Could not parse land area number."

    if val < 0.01:
        return False, "", "Land area must be at least 0.01."
    if val > 1000:
        return False, "", "Land area cannot exceed 1000."

    formatted = f"{val:.2f}".rstrip("0").rstrip(".") + f" {unit or 'acre'}"
    return True, formatted, None
