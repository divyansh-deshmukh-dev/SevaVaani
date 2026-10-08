import re
from typing import Optional

# Devanagari to ASCII digit mapping
DEVANAGARI_DIGITS = {
    '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
    '५': '5', '६': '6', '७': '7', '८': '8', '९': '9'
}

# Word to digit mapping for English, Hindi, and Marathi
WORD_TO_DIGIT = {
    # English
    "zero": "0", "one": "1", "two": "2", "three": "3", "four": "4",
    "five": "5", "six": "6", "seven": "7", "eight": "8", "nine": "9",
    "ten": "10",
    
    # Hindi
    "शून्य": "0", "सुन्न": "0",
    "एक": "1", "दो": "2", "तीन": "3", "चार": "4", "पांच": "5", "पाँच": "5",
    "छह": "6", "छः": "6", "सात": "7", "आठ": "8", "नौ": "9", "दस": "10",
    
    # Marathi
    "दोन": "2", "पाच": "5", "सहा": "6", "नऊ": "9", "दहा": "10",

    # Common Hinglish / Romanized
    "ek": "1", "do": "2", "teen": "3", "chaar": "4", "char": "4",
    "paanch": "5", "panch": "5", "chhe": "6", "chheh": "6", "che": "6",
    "saat": "7", "aath": "8", "nau": "9", "das": "10",
    "don": "2", "saha": "6", "daha": "10"
}

def normalize_digits(text: str) -> str:
    """
    Normalizes a text string containing digits, number words in Hindi/Marathi/English,
    or Devanagari numerals into a contiguous ASCII digit string.
    """
    if not text:
        return ""

    # Replace Devanagari numerals first
    for dev, asc in DEVANAGARI_DIGITS.items():
        text = text.replace(dev, asc)

    # Tokenize by whitespace and punctuation
    cleaned = text.lower()
    # Replace known word numbers
    words = re.findall(r"[\w\u0900-\u097F]+", cleaned)
    result_digits: list[str] = []

    for word in words:
        if word in WORD_TO_DIGIT:
            result_digits.append(WORD_TO_DIGIT[word])
        else:
            # Extract any raw digits inside word
            digits_in_word = re.findall(r"\d", word)
            if digits_in_word:
                result_digits.extend(digits_in_word)

    return "".join(result_digits)

def parse_number_with_unit(text: str) -> tuple[Optional[float], Optional[str]]:
    """
    Parses land area like '2.5 acre', '२ एकड़', '3 हेक्टर', '5 bigha'.
    Returns (number_value, unit_string)
    """
    if not text:
        return None, None

    # Replace Devanagari numerals
    for dev, asc in DEVANAGARI_DIGITS.items():
        text = text.replace(dev, asc)

    # Detect unit
    lower = text.lower()
    unit = "acre"
    if any(u in lower for u in ["hectare", "हेक्टर", "हेक्टेयर", "hector"]):
        unit = "hectare"
    elif any(u in lower for u in ["bigha", "बीघा", "बिघा"]):
        unit = "bigha"
    elif any(u in lower for u in ["guntha", "गुंठा"]):
        unit = "guntha"
    elif any(u in lower for u in ["acre", "एकड़", "एकर"]):
        unit = "acre"

    # Extract number (supports decimal e.g. 2.5)
    match = re.search(r"\d+(?:\.\d+)?", text)
    if match:
        try:
            val = float(match.group())
            return val, unit
        except ValueError:
            pass

    # Try word number
    norm = normalize_digits(text)
    if norm:
        try:
            return float(norm), unit
        except ValueError:
            pass

    return None, None
