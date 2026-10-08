from server.core.numbers import normalize_digits, parse_number_with_unit

def test_normalize_digits_devanagari():
    # Marathi / Hindi numerals: ९८७६५४३२१०
    res = normalize_digits("९८७६५४३२१०")
    assert res == "9876543210"

def test_normalize_digits_hindi_words():
    # Hindi word numbers: एक दो तीन चार पांच
    res = normalize_digits("एक दो तीन चार पांच")
    assert res == "12345"

def test_normalize_digits_marathi_words():
    # Marathi word numbers: दोन पाच सहा नऊ
    res = normalize_digits("दोन पाच सहा नऊ")
    assert res == "2569"

def test_normalize_digits_hinglish():
    res = normalize_digits("paanch chaar teen do ek")
    assert res == "54321"

def test_normalize_digits_mixed():
    res = normalize_digits("My number is ९८७६ 54 तीन 210")
    assert res == "9876543210"

def test_parse_number_with_unit():
    val, unit = parse_number_with_unit("2.5 acre")
    assert val == 2.5
    assert unit == "acre"

    val, unit = parse_number_with_unit("३ हेक्टर")
    assert val == 3.0
    assert unit == "hectare"

    val, unit = parse_number_with_unit("५ बीघा")
    assert val == 5.0
    assert unit == "bigha"
