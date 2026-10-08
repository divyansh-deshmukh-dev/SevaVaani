# UNIFIED MULTILINGUAL GOVERNMENT SERVICE ASSISTANT
# COMPLETE IMPLEMENTATION PLAN
## AI-Builder Master Plan — Phase-by-Phase

> **Purpose:** This file is the implementation source of truth.
> Build every phase in order. Do not artificially limit implementation to a 36-hour hackathon.
> If a feature can be implemented reliably with available AI/services/code, implement it.
> The project must remain honest: real government submission must never be faked.

---

## 0. MASTER PRODUCT DEFINITION

### Product
**Unified Multilingual Government Service Assistant**

### Core promise
A citizen can:
1. directly name a government service and start it immediately;
2. describe a problem/need and receive relevant service recommendations;
3. get deterministic eligibility guidance;
4. complete supported forms through multilingual voice/text interaction;
5. receive confirmation and correction opportunities;
6. fall back to text/manual input or human handoff;
7. receive guidance when direct application is unavailable.

### Primary languages
- Hindi
- Marathi

### Fully implemented reference service
- PM-Kisan-style farmer registration using dummy/demo data.

### Architecture principle
**AI = Understanding**  
**Code = Control**  
**Rules = Validation**  
**Service Adapter = Submission**

### Non-negotiable honesty
- Never claim a real government application was submitted unless a real, authorized integration actually exists.
- Demo submission must be visibly marked DEMO.
- Do not invent government URLs, APIs, eligibility rules, benefits, or documents.
- Real integrations belong behind adapters.

---

# PHASE 1 — FOUNDATION & REPOSITORY

## 1.1 Initialize project
- [ ] Create frontend
- [ ] Create backend
- [ ] Create shared types/schemas where useful
- [ ] Configure package managers
- [ ] Configure TypeScript/Python types as selected by final stack
- [ ] Configure linting
- [ ] Configure formatting
- [ ] Configure environment variables
- [ ] Add `.env.example`
- [ ] Add `.gitignore`
- [ ] Add README/run instructions
- [ ] Add error handling foundation

## 1.2 Repository structure
Create clean separation for:
- [ ] frontend
- [ ] backend
- [ ] services
- [ ] service schemas
- [ ] eligibility
- [ ] state machine
- [ ] AI
- [ ] speech
- [ ] validation
- [ ] adapters
- [ ] metrics
- [ ] configuration
- [ ] tests
- [ ] documentation

## 1.3 Configuration
- [ ] `MOCK_MODE`
- [ ] AI provider configuration
- [ ] STT provider configuration
- [ ] TTS provider configuration
- [ ] backend URL
- [ ] logging configuration
- [ ] feature flags
- [ ] language configuration

## 1.4 Quality gates
- [ ] Frontend starts
- [ ] Backend starts
- [ ] Health endpoint works
- [ ] No secret committed
- [ ] Build passes

---

# PHASE 2 — DOMAIN MODEL & SERVICE CATALOG

## 2.1 Service definition model
Implement configurable service metadata:
- [ ] service ID
- [ ] name
- [ ] aliases
- [ ] supported languages
- [ ] description
- [ ] direct application availability
- [ ] guidance availability
- [ ] form schema reference
- [ ] eligibility rule reference
- [ ] required information
- [ ] document information
- [ ] official-source metadata when verified
- [ ] demo flag

## 2.2 Service catalog
Add initial catalog entries such as:
- [ ] PM-Kisan
- [ ] Ration-related service
- [ ] Pension-related service
- [ ] Scholarship-related service
- [ ] Housing-related service

Only PM-Kisan should be marked fully direct-application-supported initially.

## 2.3 Search/discovery
- [ ] exact service matching
- [ ] alias matching
- [ ] multilingual matching
- [ ] fuzzy matching
- [ ] AI-assisted intent classification
- [ ] confidence score
- [ ] deterministic fallback

## 2.4 Service catalog API
- [ ] list services
- [ ] get service
- [ ] search services
- [ ] get service guidance
- [ ] get supported application capabilities

---

# PHASE 3 — GENERIC FORM ENGINE

## 3.1 Form schema
Create reusable field definitions:
- [ ] field ID
- [ ] label
- [ ] translations
- [ ] type
- [ ] required
- [ ] validation
- [ ] normalization
- [ ] voice hints
- [ ] confirmation prompt
- [ ] grouping/chunking
- [ ] help text

## 3.2 Form runtime
Implement:
- [ ] dynamic form loading
- [ ] current field
- [ ] progress
- [ ] answer storage
- [ ] correction
- [ ] skip rules where allowed
- [ ] validation
- [ ] confirmation
- [ ] final review

## 3.3 Field types
Support extensible types such as:
- [ ] text
- [ ] number
- [ ] integer
- [ ] mobile
- [ ] Aadhaar-like identifier
- [ ] date
- [ ] state
- [ ] district
- [ ] village
- [ ] select
- [ ] yes/no
- [ ] land area
- [ ] custom structured value

---

# PHASE 4 — PM-KISAN DEMO SERVICE

## 4.1 Form
Implement exactly:
1. [ ] full_name
2. [ ] aadhaar
3. [ ] mobile
4. [ ] state
5. [ ] district
6. [ ] village
7. [ ] land_area

## 4.2 Validation
- [ ] name validation
- [ ] Aadhaar-format validation
- [ ] mobile validation
- [ ] state validation
- [ ] district validation
- [ ] village validation
- [ ] land-area validation
- [ ] normalization
- [ ] invalid-answer re-prompt

## 4.3 Voice-friendly collection
- [ ] Aadhaar grouping
- [ ] mobile grouping
- [ ] number normalization
- [ ] Hindi number interpretation where feasible
- [ ] Marathi number interpretation where feasible
- [ ] repeat-back confirmation

---

# PHASE 5 — STATE MACHINE

Implement states:
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

## 5.1 Transition rules
- [ ] deterministic transitions
- [ ] no LLM-controlled state mutation
- [ ] recoverable errors
- [ ] cancellation
- [ ] back/correction
- [ ] restart
- [ ] resume where possible

---

# PHASE 6 — AI UNDERSTANDING LAYER

## 6.1 Intent classification
Support:
- [ ] direct service request
- [ ] problem/need
- [ ] field answer
- [ ] confirmation yes
- [ ] confirmation no
- [ ] correction
- [ ] repeat
- [ ] help
- [ ] back
- [ ] restart
- [ ] cancel

## 6.2 Structured extraction
Implement strict structured outputs:
- [ ] current field
- [ ] extracted value
- [ ] confidence
- [ ] alternatives if useful
- [ ] detected language
- [ ] ambiguity reason

## 6.3 Provider abstraction
- [ ] AI interface
- [ ] Gemini implementation
- [ ] mock implementation
- [ ] retry logic
- [ ] timeout
- [ ] malformed response handling

## 6.4 Prompt safety
- [ ] schema-constrained output
- [ ] no direct business-state control
- [ ] no final eligibility authority
- [ ] no fake submission claims

---

# PHASE 7 — SPEECH LAYER

## 7.1 STT
Create provider interface:
- [ ] browser/native speech fallback
- [ ] Gemini/available speech implementation where supported
- [ ] optional Sarvam adapter
- [ ] optional Bhashini adapter
- [ ] mock STT

## 7.2 TTS
- [ ] provider interface
- [ ] browser speech synthesis fallback
- [ ] Gemini/available TTS implementation where supported
- [ ] optional Sarvam adapter
- [ ] optional Bhashini adapter
- [ ] mock TTS

## 7.3 Speech UX
- [ ] microphone permission handling
- [ ] listening indicator
- [ ] transcript preview
- [ ] retry
- [ ] stop/cancel
- [ ] audio failure recovery
- [ ] language selection
- [ ] speech speed controls where practical

---

# PHASE 8 — CONFIDENCE & VALIDATION ENGINE

## 8.1 Confidence pipeline
Combine:
- [ ] model confidence
- [ ] deterministic validation
- [ ] field type compatibility
- [ ] ambiguity detection
- [ ] previous conversation context

## 8.2 Decision levels
- [ ] high confidence → validate → confirm
- [ ] medium confidence → clarify → confirm
- [ ] low confidence → re-prompt
- [ ] repeated failure → fallback

## 8.3 Never blindly save
- [ ] no invalid value persistence
- [ ] no unconfirmed value considered final

---

# PHASE 9 — THREE-LEVEL FALLBACK

## Level 1
- [ ] simpler re-prompt
- [ ] example answer
- [ ] slower/simpler wording
- [ ] repeat option

## Level 2
- [ ] manual text input
- [ ] visible controls
- [ ] field-specific UI
- [ ] continue voice after manual entry

## Level 3
- [ ] human/operator handoff screen
- [ ] case summary
- [ ] collected information summary
- [ ] handoff reason
- [ ] no fake live human claim

---

# PHASE 10 — PROBLEM/NEED DISCOVERY

## 10.1 Natural-language problem intake
Examples:
- farmer financial support
- housing help
- pension need
- ration support
- scholarship need

## 10.2 Discovery questions
- [ ] configurable question sets
- [ ] minimum necessary questions
- [ ] multilingual prompts
- [ ] voice/text answers
- [ ] deterministic storage

## 10.3 Recommendation
- [ ] candidate services
- [ ] relevance score
- [ ] explanation
- [ ] direct-application availability
- [ ] guidance availability

---

# PHASE 11 — ELIGIBILITY ENGINE

## 11.1 Rules
Implement deterministic rule evaluation:
- [ ] rule definitions
- [ ] operators
- [ ] required inputs
- [ ] missing information
- [ ] pass/fail/unknown
- [ ] explanation

## 11.2 Output
Return:
- [ ] likely eligible
- [ ] likely not eligible
- [ ] insufficient information

Never present demo rules as authoritative legal/government decisions.

## 11.3 Rule versioning
- [ ] rule version
- [ ] source/reference metadata
- [ ] last verified field
- [ ] configurable updates

---

# PHASE 12 — GUIDANCE MODE

For unsupported direct services:
- [ ] service overview
- [ ] likely eligibility
- [ ] required information
- [ ] documents if configured
- [ ] step-by-step process
- [ ] where/how to apply
- [ ] official-source verification
- [ ] no invented links
- [ ] disclaimer that prototype does not submit

---

# PHASE 13 — DEMO GOVERNMENT API / SERVICE ADAPTERS

## 13.1 Adapter interface
- [ ] validate submission
- [ ] submit
- [ ] get status
- [ ] error mapping

## 13.2 PM-Kisan demo adapter
- [ ] submission validation
- [ ] simulated delay
- [ ] deterministic/safe demo ID
- [ ] demo status
- [ ] retry behavior
- [ ] clearly labeled DEMO

## 13.3 Future adapter structure
- [ ] separate external integration from UI
- [ ] no direct government calls in components

---

# PHASE 14 — FINAL REVIEW & APPLICATION STATUS

- [ ] complete summary
- [ ] per-field edit
- [ ] voice correction
- [ ] final confirmation
- [ ] submission progress
- [ ] result screen
- [ ] demo application ID
- [ ] status lookup
- [ ] start new application

---

# PHASE 15 — FRONTEND EXPERIENCE

## 15.1 Welcome
- [ ] language selection
- [ ] voice-first CTA
- [ ] text fallback
- [ ] simple explanation

## 15.2 Unified assistant
- [ ] microphone
- [ ] transcript
- [ ] assistant response
- [ ] service suggestions
- [ ] quick actions

## 15.3 Form
- [ ] current question
- [ ] step number
- [ ] progress bar
- [ ] current answer
- [ ] confirmation controls
- [ ] edit controls

## 15.4 Accessibility
- [ ] large controls
- [ ] readable typography
- [ ] keyboard accessibility
- [ ] clear focus states
- [ ] screen-reader-friendly labels
- [ ] color-independent status indicators
- [ ] reduced complexity

---

# PHASE 16 — LOW-BANDWIDTH & RESILIENCE

- [ ] lightweight API payloads
- [ ] retry
- [ ] timeout handling
- [ ] local draft/session state
- [ ] reconnect handling
- [ ] text fallback
- [ ] optional audio compression where appropriate
- [ ] graceful degradation
- [ ] mock mode

---

# PHASE 17 — SESSION & PRIVACY

- [ ] session ID
- [ ] safe session storage
- [ ] avoid sensitive logs
- [ ] redact Aadhaar/mobile in logs
- [ ] demo data warnings
- [ ] session expiry/cleanup
- [ ] server-side secrets
- [ ] privacy notice

---

# PHASE 18 — METRICS & EVALUATION LAB

Track:
- [ ] completion success
- [ ] completion failure
- [ ] field extraction accuracy
- [ ] confirmation corrections
- [ ] fallback count
- [ ] fallback accuracy
- [ ] latency
- [ ] form completion time
- [ ] retry count
- [ ] language
- [ ] STT transcript/evaluation data where safe

## Evaluation tools
- [ ] scripted test cases
- [ ] expected field values
- [ ] extraction comparison
- [ ] WER calculation support
- [ ] aggregate metrics
- [ ] exportable results

---

# PHASE 19 — TESTING

## Unit tests
- [ ] validators
- [ ] normalization
- [ ] eligibility rules
- [ ] state transitions
- [ ] schema validation
- [ ] service matching

## Integration tests
- [ ] service discovery
- [ ] form flow
- [ ] AI structured output
- [ ] adapter submission
- [ ] fallback
- [ ] mock mode

## E2E tests
- [ ] direct PM-Kisan
- [ ] problem-to-service-to-application
- [ ] correction
- [ ] low confidence
- [ ] invalid field
- [ ] network failure
- [ ] handoff

---

# PHASE 20 — OBSERVABILITY & SECURITY

- [ ] structured logs
- [ ] request IDs
- [ ] safe error messages
- [ ] sensitive-data redaction
- [ ] rate limiting where appropriate
- [ ] input size limits
- [ ] backend validation
- [ ] CORS configuration
- [ ] dependency audit
- [ ] secret handling

---

# PHASE 21 — DOCUMENTATION

Create:
- [ ] setup guide
- [ ] architecture guide
- [ ] API documentation
- [ ] service schema guide
- [ ] adding-a-service guide
- [ ] AI provider guide
- [ ] speech provider guide
- [ ] mock mode guide
- [ ] testing guide
- [ ] metrics guide
- [ ] hackathon demo guide
- [ ] limitations/future work

---

# PHASE 22 — DEMO POLISH

## Demo path A
Direct:
"Mujhe PM-Kisan ke liye apply karna hai."

Expected:
- identify PM-Kisan
- open form
- voice fill
- validate
- confirm
- review
- demo submit
- demo application ID

## Demo path B
Need discovery:
"Mujhe farmer ke liye financial help chahiye."

Expected:
- identify need
- ask relevant questions
- evaluate demo rules
- recommend PM-Kisan where appropriate
- Apply Now
- voice form

## Demo path C
Unsupported:
User requests unsupported service.

Expected:
- identify service
- explain direct application unavailable
- guidance mode
- no fake submission

---

# PHASE 23 — RELEASE READINESS

- [ ] production build succeeds
- [ ] fresh setup tested
- [ ] `.env.example` complete
- [ ] no hardcoded secret
- [ ] mock mode works
- [ ] PM-Kisan E2E works
- [ ] Hindi works
- [ ] Marathi works
- [ ] fallback works
- [ ] metrics work
- [ ] docs complete
- [ ] known limitations documented

---

# PHASE 24 — OPTIONAL ADVANCED CAPABILITIES

Implement these when technically feasible and useful, without breaking core behavior:

- [ ] multilingual code-switching
- [ ] conversational context memory within session
- [ ] speech interruption/barge-in
- [ ] streaming transcription
- [ ] streaming TTS
- [ ] offline-ish cached UI shell
- [ ] resumable applications
- [ ] service recommendation ranking
- [ ] richer evaluation dashboard
- [ ] configurable admin/service catalog
- [ ] multiple form versions
- [ ] audit trail
- [ ] provider failover
- [ ] analytics
- [ ] accessibility enhancements
- [ ] progressive web app capabilities

Do not add risky complexity merely for appearance.

---

# DEFINITION OF DONE

The project is complete when:

1. A citizen can directly request PM-Kisan.
2. PM-Kisan form opens without unnecessary discovery.
3. Hindi and Marathi interaction work.
4. Voice and text are both usable.
5. Fields are extracted and validated.
6. Every field is confirmed.
7. Corrections work.
8. Fallback ladder works.
9. Final review works.
10. Demo submission works.
11. Demo application ID/status works.
12. Problem/need discovery works.
13. Eligibility is rule-driven.
14. Unsupported services use guidance mode.
15. AI cannot control business state.
16. No real government submission is falsely claimed.
17. Mock mode works without external credentials.
18. Tests pass.
19. Metrics/evaluation are available.
20. Documentation is complete.
