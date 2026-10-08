from server.core import validators

def test_validate_name():
    # Valid English
    valid, val, err = validators.validate_name("Ramesh Kumar Patel")
    assert valid is True
    assert val == "Ramesh Kumar Patel"
    assert err is None

    # Valid Hindi Devanagari
    valid, val, err = validators.validate_name("रमेश कुमार पटेल")
    assert valid is True
    assert val == "रमेश कुमार पटेल"

    # Too short
    valid, val, err = validators.validate_name("A")
    assert valid is False
    assert "short" in err

    # Invalid characters
    valid, val, err = validators.validate_name("Ramesh@123")
    assert valid is False

def test_validate_aadhaar():
    # Valid 12 digits
    valid, val, err = validators.validate_aadhaar("5544 3322 1100")
    assert valid is True
    assert val == "554433221100"

    # Valid with Devanagari numerals
    valid, val, err = validators.validate_aadhaar("५५४४ ३३२२ ११००")
    assert valid is True
    assert val == "554433221100"

    # Invalid: all same digits
    valid, val, err = validators.validate_aadhaar("111111111111")
    assert valid is False
    assert "same" in err

    # Invalid length: 11 digits
    valid, val, err = validators.validate_aadhaar("12345678901")
    assert valid is False
    assert "12 digits" in err

def test_validate_mobile():
    # Valid 10 digits starting with 9
    valid, val, err = validators.validate_mobile("9876543210")
    assert valid is True
    assert val == "9876543210"

    # Valid with words
    valid, val, err = validators.validate_mobile("नौ आठ सात छह पांच चार तीन दो एक शून्य")
    assert valid is True
    assert val == "9876543210"

    # Invalid starting digit (e.g. 5)
    valid, val, err = validators.validate_mobile("5876543210")
    assert valid is False
    assert "start" in err

    # Invalid length
    valid, val, err = validators.validate_mobile("98765")
    assert valid is False

def test_validate_state():
    valid, val, err = validators.validate_state("Maharashtra")
    assert valid is True
    assert val == "Maharashtra"

    valid, val, err = validators.validate_state("मध्य प्रदेश")
    assert valid is True
    assert val == "Madhya Pradesh"

    valid, val, err = validators.validate_state("MP")
    assert valid is True
    assert val == "Madhya Pradesh"

def test_validate_land_area():
    valid, val, err = validators.validate_land_area("2.5 एकड़")
    assert valid is True
    assert "2.5" in val

    valid, val, err = validators.validate_land_area("0")
    assert valid is False
