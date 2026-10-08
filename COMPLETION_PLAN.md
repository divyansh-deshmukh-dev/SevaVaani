# UNIFIED MULTILINGUAL GOVERNMENT SERVICE ASSISTANT
# COMPLETION & PROGRESS PLAN

> **Purpose:** This file is the live project checklist.
> Update it continuously as implementation phases are completed.
>
> Status legend:
> - `[ ]` Not started
> - `[-]` In progress
> - `[x]` Completed
> - `[!]` Blocked / needs decision
>
> IMPORTANT FOR AI BUILDERS:
> After completing a phase, immediately update this file.
> Never mark a phase `[x]` unless its acceptance criteria have actually passed.
> Preserve evidence such as tests, files, endpoints, screenshots, or commands where practical.

---

# MASTER STATUS

| Phase | Status | Completion |
|---|---|---:|
| 1. Foundation & Repository | [ ] | 0% |
| 2. Domain Model & Service Catalog | [ ] | 0% |
| 3. Generic Form Engine | [ ] | 0% |
| 4. PM-Kisan Demo Service | [ ] | 0% |
| 5. State Machine | [ ] | 0% |
| 6. AI Understanding Layer | [ ] | 0% |
| 7. Speech Layer | [ ] | 0% |
| 8. Confidence & Validation | [ ] | 0% |
| 9. Three-Level Fallback | [ ] | 0% |
| 10. Problem/Need Discovery | [ ] | 0% |
| 11. Eligibility Engine | [ ] | 0% |
| 12. Guidance Mode | [ ] | 0% |
| 13. Demo Government API/Adapters | [ ] | 0% |
| 14. Final Review & Status | [ ] | 0% |
| 15. Frontend Experience | [ ] | 0% |
| 16. Low-Bandwidth & Resilience | [ ] | 0% |
| 17. Session & Privacy | [ ] | 0% |
| 18. Metrics & Evaluation | [ ] | 0% |
| 19. Testing | [ ] | 0% |
| 20. Observability & Security | [ ] | 0% |
| 21. Documentation | [ ] | 0% |
| 22. Demo Polish | [ ] | 0% |
| 23. Release Readiness | [ ] | 0% |
| 24. Optional Advanced Capabilities | [ ] | 0% |

**Overall completion:** 0%

---

# PHASE 1 — FOUNDATION & REPOSITORY

## Checklist
- [ ] Frontend created
- [ ] Backend created
- [ ] Shared types/schemas created
- [ ] Package/config files created
- [ ] `.env.example` created
- [ ] `.gitignore` created
- [ ] Lint/format configured
- [ ] Health endpoint works
- [ ] Frontend runs
- [ ] Backend runs
- [ ] Build passes

### Acceptance test
Fresh setup can start frontend and backend without undocumented steps.

### Evidence
- Files:
- Commands:
- Tests:

**Phase status:** [ ]  
**Completion:** 0%

---

# PHASE 2 — DOMAIN MODEL & SERVICE CATALOG

## Checklist
- [ ] Service schema
- [ ] Service catalog
- [ ] PM-Kisan entry
- [ ] Additional guidance entries
- [ ] Aliases
- [ ] Multilingual metadata
- [ ] Service search
- [ ] Service APIs

### Acceptance test
"PM Kisan", "PM-Kisan", and equivalent natural-language requests resolve to the configured PM-Kisan service.

**Phase status:** [ ]  
**Completion:** 0%

---

# PHASE 3 — GENERIC FORM ENGINE

## Checklist
- [ ] Form schema
- [ ] Dynamic rendering
- [ ] Field navigation
- [ ] Progress
- [ ] Validation hooks
- [ ] Confirmation hooks
- [ ] Correction
- [ ] Final review
- [ ] Reusable field types

### Acceptance test
A form can be rendered from configuration without PM-Kisan-specific UI logic.

**Phase status:** [ ]  
**Completion:** 0%

---

# PHASE 4 — PM-KISAN DEMO SERVICE

## Checklist
- [ ] full_name
- [ ] aadhaar
- [ ] mobile
- [ ] state
- [ ] district
- [ ] village
- [ ] land_area
- [ ] deterministic validation
- [ ] number normalization
- [ ] grouped number collection
- [ ] field confirmation

### Acceptance test
A complete PM-Kisan demo form can be filled, corrected, validated and reviewed.

**Phase status:** [ ]  
**Completion:** 0%

---

# PHASE 5 — STATE MACHINE

## Checklist
- [ ] WELCOME
- [ ] SERVICE_DISCOVERY
- [ ] NEED_DISCOVERY
- [ ] ELIGIBILITY
- [ ] SERVICE_RECOMMENDATION
- [ ] ASK_FIELD
- [ ] AWAIT_ANSWER
- [ ] CONFIRM_FIELD
- [ ] FALLBACK_INPUT
- [ ] FINAL_REVIEW
- [ ] SUBMITTING
- [ ] DONE
- [ ] HANDOFF
- [ ] ERROR/RECOVERY
- [ ] deterministic transitions

### Acceptance test
No AI response can arbitrarily jump the application to an invalid state.

**Phase status:** [ ]  
**Completion:** 0%

---

# PHASE 6 — AI UNDERSTANDING

## Checklist
- [ ] Intent classification
- [ ] Direct-service detection
- [ ] Problem/need classification
- [ ] Structured field extraction
- [ ] Confirmation understanding
- [ ] Correction understanding
- [ ] Help/repeat/back/cancel
- [ ] Confidence
- [ ] Provider abstraction
- [ ] Gemini integration
- [ ] Mock AI
- [ ] Retry/timeout
- [ ] malformed response handling

### Acceptance test
AI returns structured information, while application code retains full control.

**Phase status:** [ ]  
**Completion:** 0%

---

# PHASE 7 — SPEECH LAYER

## Checklist
- [ ] Hindi STT
- [ ] Marathi STT
- [ ] text transcript
- [ ] Hindi TTS
- [ ] Marathi TTS
- [ ] browser fallback
- [ ] provider abstraction
- [ ] mock speech
- [ ] microphone errors
- [ ] retry
- [ ] stop/cancel

### Acceptance test
A user can complete the core flow without manually typing every field when supported speech services are available.

**Phase status:** [ ]  
**Completion:** 0%

---

# PHASE 8 — CONFIDENCE & VALIDATION

## Checklist
- [ ] model confidence
- [ ] deterministic validation
- [ ] ambiguity detection
- [ ] high-confidence flow
- [ ] medium-confidence clarification
- [ ] low-confidence retry
- [ ] repeated failure escalation

### Acceptance test
Invalid/ambiguous values are never silently accepted as final values.

**Phase status:** [ ]  
**Completion:** 0%

---

# PHASE 9 — FALLBACK LADDER

## Checklist
- [ ] Level 1 re-prompt
- [ ] Level 2 manual input
- [ ] Level 3 handoff
- [ ] failure counter
- [ ] handoff summary
- [ ] recovery/resume

### Acceptance test
Repeated speech failure results in a useful alternative rather than a dead end.

**Phase status:** [ ]  
**Completion:** 0%

---

# PHASE 10 — PROBLEM/NEED DISCOVERY

## Checklist
- [ ] Natural-language need input
- [ ] Need classification
- [ ] Discovery questions
- [ ] Candidate service generation
- [ ] Service ranking
- [ ] Recommendation UI
- [ ] Apply Now
- [ ] How to Apply

### Acceptance test
A problem description can reach a configured service recommendation.

**Phase status:** [ ]  
**Completion:** 0%

---

# PHASE 11 — ELIGIBILITY ENGINE

## Checklist
- [ ] Rule schema
- [ ] Rule evaluator
- [ ] PM-Kisan demo rules
- [ ] Missing-information handling
- [ ] likely eligible
- [ ] likely not eligible
- [ ] insufficient information
- [ ] explanation
- [ ] rule metadata/version

### Acceptance test
Eligibility output is deterministic for the same inputs and never depends on free-form LLM judgment.

**Phase status:** [ ]  
**Completion:** 0%

---

# PHASE 12 — GUIDANCE MODE

## Checklist
- [ ] service overview
- [ ] eligibility guidance
- [ ] information/documents
- [ ] steps
- [ ] official-source metadata
- [ ] unavailable-direct-application state
- [ ] no fake submission

### Acceptance test
Unsupported service requests produce useful guidance without pretending to apply.

**Phase status:** [ ]  
**Completion:** 0%

---

# PHASE 13 — DEMO GOVERNMENT API / ADAPTER

## Checklist
- [ ] Adapter interface
- [ ] PM-Kisan demo adapter
- [ ] submission validation
- [ ] demo ID generation
- [ ] status
- [ ] retry
- [ ] error mapping
- [ ] DEMO labeling

### Acceptance test
Final review → confirm → demo adapter → demo application ID/status.

**Phase status:** [ ]  
**Completion:** 0%

---

# PHASE 14 — FINAL REVIEW & STATUS

## Checklist
- [ ] Summary
- [ ] Per-field edit
- [ ] Voice correction
- [ ] Final confirmation
- [ ] Submission progress
- [ ] Result
- [ ] Application ID
- [ ] Status lookup
- [ ] New application

**Phase status:** [ ]  
**Completion:** 0%

---

# PHASE 15 — FRONTEND EXPERIENCE

## Checklist
- [ ] Welcome
- [ ] Language selection
- [ ] Unified assistant
- [ ] Voice interaction
- [ ] Service recommendation
- [ ] Guided form
- [ ] Confirmation UI
- [ ] Fallback UI
- [ ] Final review
- [ ] Submission result
- [ ] Guidance mode
- [ ] About
- [ ] Accessibility basics
- [ ] Responsive design

### Acceptance test
A first-time user can understand what to do without technical knowledge.

**Phase status:** [ ]  
**Completion:** 0%

---

# PHASE 16 — LOW-BANDWIDTH & RESILIENCE

## Checklist
- [ ] lightweight requests
- [ ] retry
- [ ] timeout
- [ ] local draft
- [ ] reconnect
- [ ] text fallback
- [ ] graceful degradation
- [ ] mock mode

### Acceptance test
A temporary network/API failure does not unnecessarily destroy the current application state.

**Phase status:** [ ]  
**Completion:** 0%

---

# PHASE 17 — SESSION & PRIVACY

## Checklist
- [ ] session management
- [ ] safe storage
- [ ] sensitive-log redaction
- [ ] demo-data warning
- [ ] cleanup
- [ ] privacy notice
- [ ] server-side secrets

### Acceptance test
Aadhaar/mobile values are not unnecessarily exposed in logs or frontend source.

**Phase status:** [ ]  
**Completion:** 0%

---

# PHASE 18 — METRICS & EVALUATION

## Checklist
- [ ] completion success
- [ ] failure
- [ ] extraction accuracy
- [ ] correction rate
- [ ] fallback rate
- [ ] latency
- [ ] completion time
- [ ] retry count
- [ ] language
- [ ] WER support
- [ ] scripted evaluation
- [ ] export

### Acceptance test
A demo/evaluation session produces measurable results.

**Phase status:** [ ]  
**Completion:** 0%

---

# PHASE 19 — TESTING

## Checklist
- [ ] Unit tests
- [ ] Integration tests
- [ ] E2E direct service
- [ ] E2E need discovery
- [ ] correction test
- [ ] invalid field test
- [ ] low-confidence test
- [ ] fallback test
- [ ] network failure test
- [ ] mock mode test

### Acceptance test
Core user journeys pass automatically or through documented reproducible test steps.

**Phase status:** [ ]  
**Completion:** 0%

---

# PHASE 20 — OBSERVABILITY & SECURITY

## Checklist
- [ ] structured logging
- [ ] request IDs
- [ ] safe errors
- [ ] PII redaction
- [ ] input limits
- [ ] backend validation
- [ ] CORS
- [ ] dependency/security checks
- [ ] secrets audit

**Phase status:** [ ]  
**Completion:** 0%

---

# PHASE 21 — DOCUMENTATION

## Checklist
- [ ] Setup
- [ ] Architecture
- [ ] APIs
- [ ] Service schema
- [ ] Add-service guide
- [ ] AI configuration
- [ ] Speech configuration
- [ ] Mock mode
- [ ] Testing
- [ ] Metrics
- [ ] Demo script
- [ ] Limitations
- [ ] Future work

**Phase status:** [ ]  
**Completion:** 0%

---

# PHASE 22 — DEMO POLISH

## Demo A — Direct PM-Kisan
- [ ] User asks for PM-Kisan
- [ ] Service identified
- [ ] Form opens
- [ ] Voice interaction
- [ ] All 7 fields
- [ ] Validation
- [ ] Confirmation
- [ ] Final review
- [ ] Demo submission
- [ ] Demo application ID

## Demo B — Problem/Need
- [ ] User describes farmer need
- [ ] Need detected
- [ ] Questions asked
- [ ] Eligibility evaluated
- [ ] PM-Kisan recommended
- [ ] Apply Now
- [ ] Form starts

## Demo C — Unsupported Service
- [ ] Service recognized
- [ ] Direct application unavailable
- [ ] Guidance shown
- [ ] No fake submission

**Phase status:** [ ]  
**Completion:** 0%

---

# PHASE 23 — RELEASE READINESS

- [ ] Clean build
- [ ] Fresh install tested
- [ ] Environment documented
- [ ] Mock mode verified
- [ ] Hindi verified
- [ ] Marathi verified
- [ ] PM-Kisan verified
- [ ] Fallback verified
- [ ] Metrics verified
- [ ] Security review
- [ ] Documentation complete
- [ ] Limitations documented

**Phase status:** [ ]  
**Completion:** 0%

---

# PHASE 24 — OPTIONAL ADVANCED CAPABILITIES

- [ ] Multilingual code-switching
- [ ] Session conversational context
- [ ] Barge-in/interruption
- [ ] Streaming STT
- [ ] Streaming TTS
- [ ] Cached/offline-ish shell
- [ ] Resumable application
- [ ] Service ranking
- [ ] Evaluation dashboard
- [ ] Admin/service catalog
- [ ] Form versioning
- [ ] Audit trail
- [ ] Provider failover
- [ ] Analytics
- [ ] PWA enhancements

**Phase status:** [ ]  
**Completion:** 0%

---

# CRITICAL END-TO-END CHECKLIST

## Direct service
- [ ] "Mujhe PM-Kisan ke liye apply karna hai."
- [ ] PM-Kisan opens directly
- [ ] Voice/text input
- [ ] 7 fields
- [ ] Validation
- [ ] Confirmation
- [ ] Correction
- [ ] Final review
- [ ] Demo submission
- [ ] Demo application ID

## Problem/need
- [ ] "Main farmer hoon aur mujhe financial help chahiye."
- [ ] Need detected
- [ ] Questions asked
- [ ] Eligibility evaluated
- [ ] Service recommended
- [ ] Apply Now
- [ ] PM-Kisan flow starts

## Unsupported service
- [ ] Service detected
- [ ] Guidance mode
- [ ] No fake submission

## Failure
- [ ] Speech failure
- [ ] AI failure
- [ ] Validation failure
- [ ] Network failure
- [ ] Level 1
- [ ] Level 2
- [ ] Level 3

---

# FINAL ACCEPTANCE

The project can be declared complete only when all of the following are true:

- [ ] Application starts successfully
- [ ] Hindi works
- [ ] Marathi works
- [ ] Direct PM-Kisan works
- [ ] Problem/need discovery works
- [ ] Eligibility engine works
- [ ] Generic form engine works
- [ ] AI extraction works
- [ ] STT works or graceful fallback exists
- [ ] TTS works or graceful fallback exists
- [ ] Confirmation works
- [ ] Correction works
- [ ] Fallback works
- [ ] Final review works
- [ ] Demo submission works
- [ ] Demo status works
- [ ] Guidance mode works
- [ ] Mock mode works
- [ ] Metrics work
- [ ] Tests pass
- [ ] Security/privacy basics pass
- [ ] Documentation is complete
- [ ] No fake government submission claims exist

---

# CHANGE LOG

## Entry 0
**Status:** Project plan initialized.  
**Date:** 2026-10-09  
**Notes:** Implementation and completion tracking separated. Completion file starts at 0%.

## Future entries
After every completed phase, append:

### Phase X Completed
- Date:
- Files/Modules:
- Tests:
- Evidence:
- Known limitations:
- Next phase:

---

# AI BUILDER INSTRUCTION

When working on this repository:

1. Read `IMPLEMENTATION_PLAN.md`.
2. Read `COMPLETION_PLAN.md`.
3. Identify the earliest incomplete phase.
4. Implement that phase fully.
5. Run relevant tests/build checks.
6. Update `COMPLETION_PLAN.md`.
7. Mark only verified work as complete.
8. Continue to the next incomplete phase.
9. Do not rewrite completed work unnecessarily.
10. If blocked, mark `[!]` and document the exact reason.
11. Never hide failures by marking a phase complete.
12. Keep the project runnable after each phase.
