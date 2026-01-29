# Tasks: Stella (Document OCR SaaS)

**Input**: Design documents from `specs/poc_stella/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Testing**: Constitution requires minimum four levels (developer tests, senior developer tests, customer analyst tests, customer sponsor sign-off). Developer and senior developer test tasks are included below; customer analyst validation and sponsor sign-off are checkpoints after each user story.

**Organization**: Tasks are grouped by user story (US1–US4) so each story can be implemented and tested independently. **Phase 0** (olmOCR 2 small test) runs first to validate the OCR engine before pipeline work.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: US1, US2, US3, US4
- Paths follow plan.md: `backend/src/`, `frontend/src/`, `backend/tests/`, `frontend/tests/`

**Phase 0** (olmOCR 2 small test) runs first; then Phase 1 (Setup), Phase 2 (Foundational), and user stories.

---

## Phase 0: olmOCR 2 small test (do first)

**Purpose**: Validate olmOCR 2 on the target environment (MacBook Pro for MVP) with a minimal test before building the full Stella pipeline. See [ocr-engine-decision.md](./ocr-engine-decision.md).

- [ ] T0a Install Ollama (or LM Studio / MLX) on MacBook Pro and pull the olmOCR 2 model (e.g. `ollama pull olmocr2` or equivalent per [olmocr.allenai.org](https://olmocr.allenai.org)).
- [ ] T0b Create a minimal test script or notebook (e.g. `scripts/ocr-test/` or `docs/ocr-test.md`) that: (1) sends 1–2 sample images (one printed, one handwritten if available) to olmOCR 2 via Ollama API or local inference, (2) captures and prints the extracted text.
- [ ] T0c Add 1–2 sample test images to the repo (e.g. `scripts/ocr-test/samples/`) or document where to obtain them (e.g. public test PDFs/images); ensure at least one printed and optionally one handwritten sample.
- [ ] T0d Run the small test; document results (accuracy, latency, any errors or setup issues) in `specs/poc_stella/ocr-engine-decision.md` or a short `specs/poc_stella/ocr-test-results.md`. Confirm olmOCR 2 is acceptable for MVP before proceeding to Phase 1.

**Checkpoint**: olmOCR 2 runs locally and returns text from sample images; results documented. Proceed to Phase 1 (Setup) only after this passes.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project structure and tooling per plan.md

- [ ] T001 Create project structure: `backend/`, `frontend/`, `backend/src/api/`, `backend/src/models/`, `backend/src/services/`, `backend/src/workers/`, `backend/src/config/`, `frontend/src/components/`, `frontend/src/pages/`, `frontend/src/services/`, `backend/tests/contract/`, `backend/tests/integration/`, `backend/tests/unit/`, `frontend/tests/`
- [ ] T002 Initialize backend (e.g. Python/FastAPI) with dependency file and app entry in `backend/src/`
- [ ] T003 Initialize frontend (e.g. TypeScript/React) with dependency file and app entry in `frontend/src/`
- [ ] T004 [P] Configure linting and formatting for backend and frontend
- [ ] T005 [P] Add `contracts/` OpenAPI placeholder or skeleton and document planned endpoints per contracts/README.md
- [ ] T005a Define and run multiple tests with **actual documents** (representative of customer data) to: (1) help train and tune OCR engines, (2) refine business rules and logic, (3) refine ETL (extraction, transformation, loading). Document test corpus, expected results, and iteration process so outcomes match the data in the documents. Repeat as OCR and rules evolve (ongoing setup/quality activity).

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before any user story implementation.

**CRITICAL**: No user story work can begin until this phase is complete.

- [ ] T006 Setup database (PostgreSQL) schema and migrations; create tables for Customer, User, Document, Page, Job, OCRResult (per data-model.md)
- [ ] T007 [P] Implement basic auth (role-based: Administrator vs Power Analyst) and attach to API; demo views per role (FR-011)
- [ ] T008 Setup API routing and middleware in `backend/src/api/` (e.g. FastAPI app, CORS, error handling)
- [ ] T009 Create base models/entities: Customer, User in `backend/src/models/` with persistence
- [ ] T010 [P] Configure queue (e.g. Redis + Celery/RQ) and worker entrypoint in `backend/src/workers/`
- [ ] T011 [P] Configure object storage (per-customer prefix or bucket) for document drop-off and pickup (FR-013, FR-024). For **MVP**: use local file folder as secured repository (see T011a).
- [ ] T011a Create **local secured repository** folder for MVP: at repo root create `data/` (or `storage/`) with per-customer layout `data/customers/{customer_id}/drop-off/` (incoming documents) and `data/customers/{customer_id}/pickup/` (outputs for customer). Add `data/.gitignore` so customer files are not committed; add `data/README.md` documenting the layout and that this is the MVP implementation of FR-013 (secured drop-off/pickup). Ensure app config points to this path for MVP (e.g. `STORAGE_PATH=./data` or equivalent).
- [ ] T012 Configure env and config (e.g. `backend/src/config/`) for DB, queue, storage, auth secrets
- [ ] T013 Implement health/readiness endpoint in `backend/src/api/` (FR-010)
- [ ] T014 Implement duplicate-upload prevention by file identity/hash with override option (FR-020)
- [ ] T014a Define per-page size and dimension limits (e.g. max size ~1 GB, max dimensions ~10000×10000 px) and policy for oversize pages: fail whole file vs. skip page and process rest. Implement validation and failure path; document policy (see spec edge case: may affect ~10% of volume). In `backend/src/services/` or `backend/src/config/`.

**Checkpoint**: Foundation ready — user story implementation can begin.

---

## Phase 3: User Story 1 — Ingest and classify documents (P1)

**Goal**: Upload documents (image/PDF), store them, classify each page as handwritten or machine-printed, and queue for the correct OCR pipeline.

**Independent Test**: Upload a small set of mixed documents; verify stored, classified, and queued for appropriate engine (no OCR output yet).

### Tests for US1

- [ ] T015 [P] [US1] Contract test for document upload and job creation in `backend/tests/contract/test_upload_job.py`
- [ ] T016 [P] [US1] Integration test: upload → storage → classification → queue routing in `backend/tests/integration/test_ingest_classify.py`

### Implementation for US1

- [ ] T017 [P] [US1] Create Document and Page models in `backend/src/models/` (per data-model.md)
- [ ] T018 [P] [US1] Create Job model in `backend/src/models/` with status (queued, running, completed, failed)
- [ ] T019 [US1] Implement document upload API (multipart; customer-scoped; max file/batch size per FR-007) in `backend/src/api/`
- [ ] T020 [US1] Implement classification service (handwritten vs machine-printed vs unknown) in `backend/src/services/`
- [ ] T021 [US1] Implement job creation and queue dispatch: store document/pages, run classification, enqueue per-engine jobs in `backend/src/services/` and `backend/src/workers/`
- [ ] T022 [US1] Add validation (format allowlist FR-019, size limits) and error responses; logging for ingest operations

**Checkpoint**: US1 complete — upload → store → classify → queue; run developer then senior developer tests; customer analyst validation and sponsor sign-off per constitution.

---

## Phase 4: User Story 2 — Run OCR and retrieve text (P2)

**Goal**: Run OCR on queued documents (printed and handwritten paths) and expose extracted text via API.

**Independent Test**: Run OCR on a small batch of pre-classified documents; retrieve text via API and confirm correct engine path.

### Tests for US2

- [ ] T023 [P] [US2] Contract test for results API (get by job/document/page) in `backend/tests/contract/test_results.py`
- [ ] T024 [P] [US2] Integration test: queued job → printed OCR worker → result stored → API returns text in `backend/tests/integration/test_ocr_printed.py`
- [ ] T025 [P] [US2] Integration test: queued job → handwritten OCR worker → result stored → API returns text in `backend/tests/integration/test_ocr_handwritten.py`

### Implementation for US2

- [ ] T026 [P] [US2] Create OCRResult model in `backend/src/models/`
- [ ] T027 [US2] Implement printed OCR worker: consume from queue, call **olmOCR 2** (per [ocr-engine-decision.md](./ocr-engine-decision.md)), store OCRResult, update Job status in `backend/src/workers/`
- [ ] T028 [US2] Implement handwritten OCR worker: consume from queue, call **olmOCR 2** (same engine for MVP; per ocr-engine-decision.md), store OCRResult, update Job status in `backend/src/workers/`
- [ ] T029 [US2] Implement results API: get text by job ID and/or document/page ID (JSON; optional confidence/engine) in `backend/src/api/` (FR-004, FR-008)
- [ ] T030 [US2] Route classified pages to correct worker (printed vs handwritten; unknown per spec) and handle engine errors/timeouts (FR-009)

**Checkpoint**: US2 complete — OCR runs and results retrievable via API; run developer then senior developer tests; customer analyst validation and sponsor sign-off.

---

## Phase 5: User Story 3 — Monitor jobs and handle failures (P3)

**Goal**: Expose job status (queued, running, completed, failed) and failure reasons via API (and later UI).

**Independent Test**: Submit a job, poll status until completion; submit invalid/corrupt file and verify failed state and error message.

### Tests for US3

- [ ] T031 [P] [US3] Contract test for job status API in `backend/tests/contract/test_job_status.py`
- [ ] T032 [P] [US3] Integration test: failed job returns error code/message in `backend/tests/integration/test_job_failure.py`

### Implementation for US3

- [ ] T033 [US3] Implement job status API: get by job ID; list by customer with status filter in `backend/src/api/` (FR-005)
- [ ] T034 [US3] Ensure failed jobs persist error_code/error_message (FR-009); reject or fail invalid/corrupt files with clear error
- [ ] T035 [US3] Add status transition consistency (e.g. completed jobs not shown as running/queued) and optional polling contract

**Checkpoint**: US3 complete — job status and failure visibility; run developer then senior developer tests; customer analyst validation and sponsor sign-off.

---

## Phase 6: User Story 4 — Export and minimal UI (P4)

**Goal**: Minimal web UI to upload documents, see job list and status, and view/download extracted text.

**Independent Test**: Upload via UI, wait for completion, view or download text and confirm it matches API.

### Tests for US4

- [ ] T036 [P] [US4] Frontend unit or integration test: upload flow and job list in `frontend/tests/`
- [ ] T037 [P] [US4] Frontend test: view/download text for completed job in `frontend/tests/`

### Implementation for US4

- [ ] T038 [US4] Implement upload page: file select and submit; call upload API; show job(s) in list with status in `frontend/src/pages/` and `frontend/src/components/`
- [ ] T039 [US4] Implement job list: recent jobs with status; polling or refresh button (no full page reload required) in `frontend/src/`
- [ ] T040 [US4] Implement view text / download for completed job: fetch results API and display or download in `frontend/src/`
- [ ] T041 [US4] Wire auth (Administrator vs Power Analyst) and basic layout/navigation for demo

**Checkpoint**: US4 complete — minimal UI for upload, list, view/download; run developer then senior developer tests; customer analyst validation and sponsor sign-off.

---

## Phase 7: Polish & Cross-Cutting

**Purpose**: Items that affect multiple stories or release readiness.

- [ ] T042 [P] Add API documentation (OpenAPI) for upload, jobs, results, status per `contracts/README.md`
- [ ] T043 Enforce max file size and batch size in API and return 413 or clear error (FR-007)
- [ ] T044 [P] Structured logging and request/response correlation for observability
- [ ] T045 Run quickstart.md flow (env, DB, queue, storage, backend, workers, frontend) and fix gaps
- [ ] T046 Document and verify four-tier testing and sign-off (developer, senior developer, customer analyst, customer sponsor) for release

---

## Dependencies & Execution Order

### Phase dependencies

- **Phase 0 (olmOCR 2 small test)**: No dependencies; run first. Blocks Phase 1 only until checkpoint passed (olmOCR 2 validated).
- **Phase 1 (Setup)**: Depends on Phase 0 checkpoint (olmOCR 2 test passed).
- **Phase 2 (Foundational)**: Depends on Phase 1; blocks all user stories.
- **Phase 3–6 (US1–US4)**: Depend on Phase 2; US2 depends on US1 (queue/classification); US3/US4 can lean on US1/US2.
- **Phase 7 (Polish)**: After US1–US4 are complete enough for release.

### User story order

- **US1 (P1)**: First — ingest and classification are the foundation.
- **US2 (P2)**: Second — OCR and results build on US1 queue/routing.
- **US3 (P3)**: Third — status and failures apply to jobs from US1/US2.
- **US4 (P4)**: Fourth — UI consumes upload, status, and results APIs.

### Parallel opportunities

- Within Phase 1: T004, T005 can run in parallel.
- Within Phase 2: T007, T010, T011 can run in parallel.
- Within each user story: tasks marked [P] (e.g. contract and integration tests; multiple models) can run in parallel where files differ.
- US3 and US4 can be advanced in parallel after US2 (different areas: API vs frontend).

---

## Implementation strategy

### MVP first (US1 only)

1. Complete **Phase 0** (olmOCR 2 small test) and document results.
2. Complete Phase 1 and Phase 2.
3. Complete Phase 3 (US1).
3. Run developer tests, then senior developer tests; customer analyst tests and sponsor sign-off.
4. Deploy/demo ingest and classify pipeline.

### Incremental delivery

1. **Phase 0** → olmOCR 2 validated on MacBook Pro.
2. Phase 1 + 2 → foundation.
3. Phase 3 (US1) → validate ingest/classify → deploy.
3. Phase 4 (US2) → validate OCR and results API → deploy.
4. Phase 5 (US3) → validate status/failures → deploy.
5. Phase 6 (US4) → validate minimal UI → deploy.
6. Phase 7 → polish and four-tier sign-off for release.

---

## Notes

- [P] = parallel-safe (different files or no shared state).
- [USn] = traceability to user story in spec.md.
- Each user story is independently testable; run constitution’s four-tier testing (developer, senior developer, customer analyst, sponsor sign-off) at each checkpoint.
- Commit after each task or logical group; stop at any checkpoint to validate that story alone.
