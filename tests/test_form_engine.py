from server.services.form_engine import form_engine

def test_load_pm_kisan_schema():
    schema = form_engine.get_form_schema("pm_kisan_form")
    assert schema is not None
    assert schema.serviceId == "pm_kisan"
    assert len(schema.fields) == 7
    field_ids = [f.id for f in schema.fields]
    assert field_ids == ["full_name", "aadhaar", "mobile", "state", "district", "village", "land_area"]

def test_full_form_lifecycle():
    session = form_engine.initialize_session_form("pm_kisan_form")
    assert session["currentIndex"] == 0
    assert form_engine.is_complete(session) is False

    # 1. Full name
    valid, val, err = form_engine.process_field_value(session, "full_name", "रमेश पाटिल")
    assert valid is True
    assert session["statuses"]["full_name"] == "captured"
    form_engine.confirm_field(session, "full_name")
    assert session["statuses"]["full_name"] == "confirmed"

    # 2. Aadhaar
    valid, val, err = form_engine.process_field_value(session, "aadhaar", "५५४४ ३३२२ ११००")
    assert valid is True
    assert val == "554433221100"
    form_engine.confirm_field(session, "aadhaar")

    # 3. Mobile
    valid, val, err = form_engine.process_field_value(session, "mobile", "9876543210")
    assert valid is True
    form_engine.confirm_field(session, "mobile")

    # 4. State
    valid, val, err = form_engine.process_field_value(session, "state", "Maharashtra")
    assert valid is True
    form_engine.confirm_field(session, "state")

    # 5. District
    valid, val, err = form_engine.process_field_value(session, "district", "Pune")
    assert valid is True
    form_engine.confirm_field(session, "district")

    # 6. Village
    valid, val, err = form_engine.process_field_value(session, "village", "Shivane")
    assert valid is True
    form_engine.confirm_field(session, "village")

    # 7. Land area
    valid, val, err = form_engine.process_field_value(session, "land_area", "2.5 acre")
    assert valid is True
    form_engine.confirm_field(session, "land_area")

    # Form should now be complete
    assert form_engine.is_complete(session) is True

    # Check summary and privacy masking
    summary = form_engine.get_summary(session, language="hi")
    assert len(summary) == 7
    aadhaar_item = next(item for item in summary if item["fieldId"] == "aadhaar")
    assert aadhaar_item["value"].startswith("XXXX-XXXX-")
    assert aadhaar_item["status"] == "confirmed"

    mobile_item = next(item for item in summary if item["fieldId"] == "mobile")
    assert "XXXXXX" in mobile_item["value"]
