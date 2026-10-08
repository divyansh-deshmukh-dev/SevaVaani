# SevaVaani (सेवावाणी)
### Unified Multilingual Voice Assistant for Digital Public Services

SevaVaani is a voice-first public service assistant that helps Indian citizens access digital government services in their native language (**Hindi** and **Marathi**, with English support).

Citizens can either directly name a scheme or describe their situation in plain words. The system extracts requirements, determines rule-based eligibility, guides form completion one field at a time, confirms every entry, and processes submissions via service adapters.

---

## 🏛️ Core Architectural Tenets
```
AI = Understanding
CODE = Control
RULES = Validation
SERVICE ADAPTER = Submission
```

- **Non-Negotiable Honesty:** Never claims a real government application was submitted. Demo submissions are visibly marked `DEMO`. Real integrations belong behind adapter interfaces.
- **Zero-Dependency Mock Mode:** Fully functional offline out-of-the-box with deterministic mock fixtures and browser Web Speech API.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Node.js:** v18+ (tested on v22.19.0)
- **Python:** 3.10+ (tested on Python 3.13.2)

### 2. Backend Setup
```bash
# Set up virtual environment and install packages
python -m venv server/.venv
.\server\.venv\Scripts\pip install -r server\requirements.txt

# Start backend server
.\server\.venv\Scripts\python -m uvicorn server.main:app --reload --port 8000
```
Backend runs at `http://localhost:8000` (`GET /health` to verify).

### 3. Frontend Setup
```bash
cd client
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`.

### 4. Running All Tests
```bash
.\server\.venv\Scripts\pytest tests/
```
All 32 test cases (validators, number parsers, form engine, state machine, service catalog, adapters, WER evaluation) pass automatically.

---

## 🌟 Key Features
1. **Direct Service Navigation:** Say "Mujhe PM-Kisan ke liye apply karna hai" to launch the form immediately without redundant steps.
2. **Problem/Need Discovery:** Say "Main kisan hoon aur mujhe financial help chahiye" to receive tailored scheme recommendations with deterministic eligibility evaluation.
3. **Generic Schema-Driven Form Engine:** 7-field PM-Kisan vertical slice with number normalization (Hindi, Marathi, Devanagari digits).
4. **Three-Level Fallback Ladder:**
   - Level 1: Simpler, slower re-prompt with examples
   - Level 2: Visual & manual typed input controls
   - Level 3: Operator assistance case creation (`HO-XXXX`)
5. **Guidance Mode:** Complete documentation, steps, and official portal links for unsupported schemes (Ration card, Old age pension, Student scholarship, Housing).
6. **Simulated 2G Mode:** Test high-latency low-bandwidth resilience with a single toggle.
7. **Evaluation & WER Lab:** Interactive Word Error Rate calculator testing speech hypotheses with alignment metrics.

---

## 📂 Documentation
- [Technical Architecture Guide](docs/architecture.md)
- [REST API Reference](docs/api.md)
- [Demonstration Script for Evaluators](docs/demo_guide.md)
- [Master Implementation Plan](docs/IMPLEMENTATION_PLAN.md)
- [Live Progress Tracker](docs/COMPLETION_PLAN.md)
