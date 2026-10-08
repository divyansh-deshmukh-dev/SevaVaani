# SevaVaani — REST API Reference

All endpoints return JSON responses with standard error formatting and `X-Request-ID` tracking headers.

---

## 1. System Endpoints

### `GET /health`
Returns system status, version, mock mode status, and configured providers.
```json
{
  "status": "healthy",
  "service": "SevaVaani",
  "version": "1.0.0",
  "mockMode": true,
  "environment": "development",
  "providers": { "llm": "mock", "stt": "browser", "tts": "browser" }
}
```

---

## 2. Session & Conversational Turn Endpoints

### `POST /api/session`
Initializes a new session.
- **Request Body:** `{ "language": "hi" | "mr" | "en" }`
- **Response:** `TurnResponse`

### `POST /api/session/{id}/turn`
Executes a natural-language or speech turn.
- **Request Body:**
  ```json
  {
    "text": "Mujhe PM-Kisan ke liye apply karna hai",
    "language": "hi"
  }
  ```
- **Response:** `TurnResponse`

### `POST /api/session/{id}/action`
Executes explicit UI actions (e.g. `CONFIRM_YES`, `CONFIRM_NO`, `APPLY_NOW`, `SUBMIT_MANUAL_FIELD`, `HELP`, `REPEAT`, `BACK`, `RESTART`).

### `GET /api/session/{id}/summary`
Returns masked form review data.

### `GET /api/session/{id}/handoff`
Returns Level 3 operator handoff record if one was generated.

---

## 3. Service Catalog & Guidance Endpoints

### `GET /api/services`
Lists all services in the catalog.

### `GET /api/services/{service_id}`
Returns metadata for a specific service.

### `POST /api/service/discover`
Matches user search string against catalog.
- **Request:** `{ "query": "पीएम किसान", "language": "hi" }`

### `GET /api/services/{service_id}/guidance`
Returns official steps, required documents, and prototype disclaimer for unsupported services.

---

## 4. Eligibility & Adapter Endpoints

### `POST /api/service/recommend`
Recommends candidate schemes based on natural language problem description.

### `POST /api/service/eligibility`
Evaluates deterministic rules for candidate scheme.

### `POST /api/services/{service_id}/submit`
Submits validated application to service adapter. Returns:
```json
{
  "success": true,
  "applicationId": "DEMO-PMK-20261009-XXXX",
  "status": "SUBMITTED (DEMO)",
  "message": "Demo application successfully processed."
}
```

### `GET /api/services/{service_id}/status/{application_id}`
Retrieves tracking status for a submitted demo application.

---

## 5. Metrics & Evaluation Lab Endpoints

### `GET /api/metrics`
Aggregates session count, completion rate, average latency, and fallback distributions.

### `POST /api/eval/wer`
Calculates Levenshtein Word Error Rate: `WER = (S + D + I) / N`.
```json
{
  "reference": "मेरा नाम रमेश कुमार है",
  "hypothesis": "मेरा नाम रमेश कुमार है",
  "language": "hi"
}
```
