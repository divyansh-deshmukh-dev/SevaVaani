# SevaVaani — Technical Architecture Guide

## 1. High-Level Architectural Principle
```
AI = Understanding
CODE = Control
RULES = Validation
SERVICE ADAPTER = Submission
```

- **AI (Understanding):** Natural Language Understanding & Speech-to-Text interprets citizen utterances in Hindi, Marathi, or English.
- **Code (Control):** A deterministic 14-state finite state machine directs conversation flow, screen transitions, and fallback escalation. The AI cannot mutate application state.
- **Rules (Validation):** Deterministic validators and rule engines verify format criteria (e.g. 12-digit dummy Aadhaar, 10-digit mobile starting with 6-9, place matching) and eligibility logic without LLM hallucinations.
- **Service Adapter (Submission):** Clean adapter interfaces ensure mock/demo submissions are clearly marked as DEMO, with real government submission interfaces cleanly segregated behind adapters.

---

## 2. Component Diagram
```
┌────────────────────────────────────────────────────────┐
│                   CITIZEN INTERACTION                  │
│             Multilingual Voice / Text Input            │
│                 (Hindi, Marathi, English)              │
└───────────────────────────┬────────────────────────────┘
                            │
                            ▼
┌────────────────────────────────────────────────────────┐
│              REACT + TYPESCRIPT CLIENT                 │
│  - Unified Service Discovery & Recommendation Cards   │
│  - Voice Form Runtime & Single-Field Progression       │
│  - Level 1 (Re-prompt), Level 2 (Manual Input)         │
│  - Simulated 2G Network Latency Simulator              │
│  - Live WER (Word Error Rate) & Metrics Dashboard      │
│  - Web Speech API STT / TTS Engine                     │
└───────────────────────────┬────────────────────────────┘
                            │ REST / JSON
                            ▼
┌────────────────────────────────────────────────────────┐
│                  FASTAPI BACKEND                       │
│  ├── Session Store (In-memory TTL & PII Redaction)     │
│  ├── State Machine (Deterministic 14 States)           │
│  ├── Service Catalog (Search, Match, Guidance)         │
│  ├── Generic Form Engine (Schema-Driven)               │
│  ├── Eligibility Engine (Deterministic Rules)          │
│  ├── Confidence Pipeline (Penalties & Thresholds)      │
│  ├── Three-Level Fallback Ladder                       │
│  ├── Evaluation Lab (Levenshtein DP WER Algorithm)    │
│  └── Demo Government Service Adapters                  │
└───────────────┬─────────────────────────┬──────────────┘
                │                         │
                ▼                         ▼
┌───────────────────────────────┐ ┌───────────────────────────────┐
│     AI / SPEECH PROVIDER      │ │      DEMO GOV API ADAPTER     │
│  - MockAIProvider (Default)   │ │  - DemoPmKisanAdapter         │
│  - GeminiAIProvider (Optional)│ │  - Status Lookup Router       │
└───────────────────────────────┘ └───────────────────────────────┘
```

---

## 3. State Machine States
- `WELCOME`: Initial entry and language greeting.
- `SERVICE_DISCOVERY`: Matches citizen intent (Direct service vs. Problem description).
- `SERVICE_RECOMMENDATION`: Recommends matching schemes with explanation and likely eligibility.
- `GUIDANCE`: Step-by-step guidance, documents, and official portal links for unsupported services.
- `SERVICE_CONFIRM`: Confirms citizen intent before initiating form.
- `ASK_FIELD`: Prompts current form question one field at a time.
- `AWAIT_ANSWER`: Awaits voice or text response with confidence scoring.
- `CONFIRM_FIELD`: Prompts readback confirmation (`आपने बताया: [X]। क्या यह सही है?`).
- `FALLBACK_INPUT`: Level 2 visual/typed input on repeated audio hurdles.
- `FINAL_REVIEW`: Displays all answers with per-field edit capability.
- `SUBMITTING`: Invokes Demo Government API adapter.
- `DONE`: Shows demo application ID and status tracking badge.
- `HANDOFF`: Level 3 operator case creation (`HO-XXXX`).
