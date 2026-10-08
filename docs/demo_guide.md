# SevaVaani — Demonstration Script for Judges & Evaluators

The prototype is designed so anyone can evaluate the complete user experience within 15–30 seconds.

---

## Demo Path A — Direct Service Request (Vertical Slice)
**Scenario:** A farmer citizen directly names the PM-Kisan scheme in Hindi.

1. Select **हिंदी (Hindi)** on the top right.
2. Click the microphone or speak:
   > **"मुझे PM-Kisan के लिए आवेदन करना है"** *(or tap the PM-Kisan suggestion chip)*
3. **Observation:** The assistant immediately identifies PM-Kisan Samman Nidhi and skips redundant discovery, directly asking the first question:
   > *"कृपया अपना पूरा नाम बताइए जैसा आधार या सरकारी रिकॉर्ड में है।"*
4. Say or type:
   > **"रमेश पटेल"**
5. **Observation:** Assistant confirms:
   > *"आपने बताया: रमेश पटेल। क्या यह सही है?"*
6. Click or say:
   > **"हाँ, सही है"**
7. Assistant asks for dummy Aadhaar number:
   > Say or enter **"5544 3322 1100"**
8. Progress through mobile (`9876543210`), State (`Maharashtra`), District (`Pune`), Village (`Shivane`), Land Area (`2.5 acre`).
9. **Observation:** Final Review screen shows all 7 fields with masked PII (`XXXX-XXXX-1100`).
10. Click **Submit Application**:
    - Generates realistic Application ID: `DEMO-PMK-YYYYMMDD-XXXX`
    - Clearly labelled `SUBMITTED (DEMO)`.

---

## Demo Path B — Problem / Need Discovery
**Scenario:** Citizen does not know the exact scheme name.

1. Speak or type:
   > **"मैं किसान हूँ और मुझे सरकार से आर्थिक मदद चाहिए"**
2. **Observation:** Assistant understands the farmer problem intent and presents the **PM-Kisan Scheme Card** with explanation and `Likely Eligible` status.
3. Click **[Apply Now]** to launch the guided form directly.

---

## Demo Path C — Unsupported Service (Guidance Mode)
**Scenario:** Citizen requests an unsupported scheme (e.g. Ration Card or Pension).

1. Speak or type:
   > **"मुझे नया राशन कार्ड बनवाना है"** (or in Marathi: *"मला नवीन रेशन कार्ड काढायचे आहे"*)
2. **Observation:** System enters **Guidance Mode**.
   - Displays official eligibility overview
   - Lists required documents (Aadhaar cards of family, Income Certificate, Residence proof)
   - Step-by-step application walkthrough
   - Official portal reference link (`nfsa.gov.in`)
   - Explicit disclaimer that prototype does not fake official government submission.

---

## Demo Path D — Three-Level Fallback Ladder
1. During voice form, provide intentionally unclear speech:
   - **Failure 1 (Level 1):** Slower, simpler re-prompt with concrete examples.
   - **Failure 2 (Level 2):** Inline visual manual input box appears automatically.
   - **Help / Failure 3 (Level 3):** Click **[Help / मदद चाहिए]** -> Creates an assistance case (`HO-XXXX`) visible in the **Operator Cases** tab.
