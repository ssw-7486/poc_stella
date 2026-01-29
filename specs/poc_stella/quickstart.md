# Quickstart: Run Stella Locally (MVP)

Target: simple runtime for MVP (e.g. Docker Compose or single-node). Exact commands depend on Phase 0/1 technology choices.

**Do first**: Run the **olmOCR 2 small test** (Phase 0 in [tasks.md](./tasks.md)) to validate the OCR engine on your MacBook Pro before starting the full app.

---

## Step 0: olmOCR 2 small test (Phase 0)

1. **Install Ollama** on Mac: [ollama.com](https://ollama.com) or `brew install ollama`.
2. **Pull olmOCR 2**: `ollama pull olmocr2` (or the model name per [olmocr.allenai.org](https://olmocr.allenai.org) / Ollama library).
3. **Run minimal test**: Use the script from Phase 0 tasks (T0b) in `scripts/ocr-test/` to send 1–2 sample images and capture text output. Or call Ollama API manually with a test image.
4. **Document results** in `specs/poc_stella/ocr-test-results.md` (or ocr-engine-decision.md). Proceed to full quickstart only after olmOCR 2 test passes.

---

## Prerequisites (to be filled after stack is fixed)

- [ ] Docker and Docker Compose (or local Python/Node runtime)
- [ ] Environment variables (see `.env.example` — to be added at repo root)
  - Database URL, object storage credentials, queue URL
  - Auth secret(s) for basic auth / sessions
  - Optional: OCR model paths or config

---

## Steps (outline)

1. **Clone and enter repo**
   - `git clone <repo> && cd <repo>`

2. **Configure environment**
   - Copy `.env.example` to `.env` and set values for local DB, queue, storage.

3. **Local secured repository (MVP)**
   - Ensure `data/` exists at repo root (per [plan.md](./plan.md) and task T011a). Layout: `data/customers/{customer_id}/drop-off/` (incoming documents), `data/customers/{customer_id}/pickup/` (outputs). Customer files are gitignored; see `data/README.md`. No cloud blob for MVP.

4. **Start infrastructure (MVP)**
   - `docker compose up -d` (or equivalent) to start:
     - PostgreSQL (or SQLite for MVP)
     - Redis (or chosen queue)
     - Object storage: **not required for MVP** — use local `data/` folder above

5. **Run backend**
   - Install deps: `cd backend && pip install -r requirements.txt` (or poetry)
   - Migrate DB: `alembic upgrade head` (or equivalent)
   - Start API: `uvicorn src.api.main:app --reload`
   - Start workers: `celery -A src.workers worker` (or equivalent)

6. **Run frontend**
   - `cd frontend && npm install && npm run dev`
   - Open dashboard at the URL shown (e.g. http://localhost:3000)

7. **Smoke test**
   - Log in as Administrator vs Power Analyst (basic auth).
   - Upload a test document; confirm job appears and moves to completed; view OCR result.

---

## Optional: single-command run

Once Docker Compose is defined, a single command (e.g. `docker compose up`) may start API, workers, and frontend together for local dev.

---

*This file will be updated with concrete commands and `.env.example` once the stack is finalized in research.md and implementation begins.*
