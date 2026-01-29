# High-Level Architecture: Stella

**Version**: 1.0 | **Date**: 2025-01-29 | **Spec**: [spec.md](./spec.md) | **Plan**: [plan.md](./plan.md)

---

## 1. Overview and Goals

Stella is a **document OCR SaaS** that:

- Ingests documents (multi-page files: PDF, images, TIFF, CSV, etc.).
- Classifies each **page** (handwritten vs. machine-printed vs. unknown) and may **categorize** (e.g. document type, business category) per customer configuration.
- Runs the appropriate **local** OCR engine per type (hybrid: printed path vs. handwritten path).
- Exposes extracted text and metadata via API and UI, with workflow, human review, and AI-assisted error handling.

**Architectural goals**:

- **Single-tenant, customer-isolated**: No data shared between customers; per-customer file drop-off/pickup and storage.
- **Local-only OCR**: No customer data sent to external ML; optional local LLMs per customer to improve accuracy.
- **Scalable**: Support ~5M docs/month per customer; capacity adjusts from past volumes or customer-defined peak schedules; near-zero latency target.
- **Operable**: Health checks, audit trail, job status, clear failure handling.
- **Configurable**: Workflow, business rules, ETL, and compliance managed per customer (low-code/no-code where possible).

---

## 2. System Context

**Actors**:

- **Administrator**: Full CRUD; setup customers and workflows; resolve errors with AI agent; sees all customers and activities.
- **Power Analyst (customer)**: Operates within one customer; uploads, monitors jobs, reviews results; may configure workflow/rules within scope.
- **Systems / API clients**: Integrations that upload documents and poll for results via REST API.

**External systems** (optional / as-needed):

- **Shared reference data (RAG or similar)** — see §3a below: commonly used data sources (used by more than one customer) accessed when needed (e.g. postal code lookups to validate addresses); not duplicated per customer.
- **Third-party reporting / business intelligence (BI) engine**: Optional integration for reporting and BI; data exposed MUST preserve customer isolation and sovereignty (e.g. aggregated or permitted-only access).
- **Billing / identity** (post-MVP or lightweight): For basic billing and user accounts.

**Stella boundary**: Everything below (API, workers, storage, frontend, OCR engines, workflow engine) is inside Stella. Customer document data never leaves Stella except to the customer’s own pickup location.

```
                    ┌─────────────────────────────────────────────────────────┐
                    │                    Stella (system boundary)             │
  Administrator ────┤                                                         │
  Power Analyst ────┤    ┌──────────┐    ┌─────────────┐    ┌────────────┐   │
  API clients ─────┤───►│   API    │───►│   Queue     │───►│  Workers   │   │
                    │    │ (REST)   │    │ (Redis/etc) │    │ (OCR etc)  │   │
                    │    └────┬─────┘    └──────┬──────┘    └─────┬──────┘   │
                    │         │                 │                 │           │
                    │         ▼                 ▼                 ▼           │
                    │    ┌──────────┐    ┌─────────────┐    ┌────────────┐   │
                    │    │ Frontend │    │ PostgreSQL  │    │  Object    │   │
                    │    │ (UI)     │    │ (jobs, etc) │    │  Storage   │   │
                    │    └──────────┘    └─────────────┘    │ (per cust) │   │
                    │                                       └────────────┘   │
                    │    ┌─────────────────────────────────────────────┐    │
                    │    │ Shared reference data (§3a): RAG or similar  │    │
                    │    │ Used by >1 customer when needed (e.g. postal │    │
                    │    │ code, compliance). On-demand only.           │    │
                    │    └─────────────────────────────────────────────┘    │
                    └─────────────────────────────────────────────────────────┘
```

---

## 3. High-Level Components

| Component | Responsibility |
|-----------|----------------|
| **API (backend)** | REST endpoints: upload, job create/status, results, workflow CRUD, admin dashboard data, auth (Administrator vs Power Analyst), health. Enforces customer isolation (tenant ID), duplicate prevention, file/page size limits. |
| **Workers** | Async jobs: (1) **Classification (and optional categorization)** — handwritten vs printed per page; optional categories (e.g. document type, business category) per customer config; (2) **Printed OCR** — local printed engine; (3) **Handwritten OCR** — local handwritten engine; (4) **AI agent** — error handling on triggers/alerts. Consume from queue; update Job/Page/OCRResult; write to object storage. |
| **Queue** | Durable job queue (e.g. Redis + Celery/RQ). Separate queues or routing keys for classify vs printed OCR vs handwritten OCR. Scales with worker count. |
| **PostgreSQL** | Customer, User, Document, Page, Job, OCRResult, Workflow definitions, AuditEvent. Source of truth for status and metadata; no document bytes. |
| **Object storage (secured drop-off/pickup)** | Per-customer document drop-off and result pickup; **secured in the cloud** and **scales to any volume** (FR-013). Key/prefix by customer_id; no cross-customer access. All lifecycle events (docs in, size, when; left for processing; outputs before transfer; transferred to customer) recorded in audit trail (G9). See §3c. |
| **Frontend** | Full UI flow: login → landing dashboard (immediate attention, in progress, customer health, volumes) → Quick Start (questions → workflow) → workflow editor with live visual map and separate rules/ETL panel (testable from any step), versioning, AI agent and human-review rules, industry templates. See [spec.md](./spec.md) § MVP screen flow and [plan.md](./plan.md) § MVP UI flow. |
| **Shared reference data (RAG or similar)** | See §3a. Commonly used data sources (used by more than one customer) accessed when needed (e.g. postal code lookups to validate address). Not duplicated per customer; implementation may be RAG, API, cache, or other on-demand lookup. |
| **Local OCR engines** | Run inside Stella (same trust boundary). Printed path and handwritten path; candidates per research.md (e.g. Local AI OCR, LightOnOCR, Deepseek-OCR). Optional per-customer local LLMs for tuning. |

### 3a. Shared reference data (RAG or similar)

**Purpose**: Provide **commonly used data sources** that are needed by **more than one customer** and are **accessed only when needed**. Data is stored once and shared; it is **not duplicated per customer**.

**Examples**:

- **Postal code lookups** — validate that an address (e.g. from OCR) is correct; many customers need the same postal/address data.
- **Country-specific compliance or regulations** — lookup by region/country when applying rules.
- **Other lookup tables** — validation codes, tax IDs, standard classifications, etc., used across customers on demand.

**Access pattern**: Services (API, workers, workflow engine) query the shared store **on demand** during validation or ETL. No per-customer copy of the reference dataset; no need to load it all at once.

**Implementation**: The final method may be **RAG** (retrieval-augmented generation), a **key-value or SQL lookup**, a **cached API**, a **vector store**, or another on-demand mechanism. Choice depends on data shape, query pattern, and latency. Architecture requires only: (1) single source of truth for shared reference data, (2) on-demand access, (3) no per-customer duplication.

**Constitution / spec**: Compliance and reference data are stored once and accessed on demand; every customer has access when needed; sources are not duplicated across customers (constitution III, FR-024, research.md).

### 3b. AI: internal vs external

**Purpose**: Clarify how AI used by Stella is managed so that **customer data stays private** and **external AI use is minimized** due to data privacy concerns.

| Type | Definition | Use in Stella | Data privacy |
|------|------------|---------------|--------------|
| **Internal AI** | AI that runs **inside** the Stella boundary (same process, same machine, or same trusted infra). No customer data is sent outside Stella. | **Classification and categorization** (handwritten vs printed; optional document type/category). **Local OCR engines** (printed and handwritten). **Local LLMs** (per-customer tuning; G8). **AI agent** for error handling (FR-016; triggers/alerts). All run locally; data never leaves the app. | Customer data stays internal; no sharing with third parties; supports constitution (G6, FR-023) and trust. |
| **External AI** | AI offered by **third-party cloud or API** (e.g. OpenAI, Azure OpenAI, Google AI). Customer data would be sent to the provider. | **Minimal or none** for customer document content. External AI may be used only for non-sensitive, non-customer-data tasks (e.g. generic tooling, public lookup) if at all. | **We do not use much external AI** due to data privacy concerns. Customer documents and PII must not be sent to external AI. |

**Policy**:

- **Default**: Use **internal AI only** for anything that touches customer documents, extracted text, or PII. Classification, OCR, categorization, and the error-handling AI agent run inside Stella with local models/engines.
- **External AI**: Use only where (1) no customer document data or PII is sent, and (2) there is a clear, approved exception (e.g. aggregated or anonymized analytics, or non-document tooling). Document any exception and review for compliance.
- **Architecture**: Internal AI = same trust boundary as API and workers (local OCR, local LLMs, in-app classification and AI agent). External AI = outside Stella boundary; treat as untrusted for customer data.

**Constitution / spec**: Data privacy and no sharing with external AI for learning (G6, FR-023); local OCR and local LLMs only for customer data (G8).

### 3c. Secured drop-off and pickup locations (audit trail)

**Purpose**: The secured location for file drop-off and pickup (FR-013) must be **tracked end-to-end** as part of the **audit trail** (G9). The location must be **secured in the cloud** and **handle any volume**.

**Lifecycle events to record** (part of audit trail):

| Stage | What is tracked |
|-------|------------------|
| **Docs arrive** | How many documents; file size(s); when they arrived; customer_id; location reference. |
| **Leave for processing** | When the batch/documents left the drop-off for the processing pipeline (queue/workers). |
| **Outputs ready** | What outputs exist before transfer (e.g. OCR results, extracted text, artifacts); when ready. |
| **Transferred to customer** | When outputs were transferred to the customer’s pickup location or made available for download. |

**Storage**: The drop-off/pickup location MUST be **secured in the cloud** (e.g. Azure Blob Storage, S3) with per-customer isolation (container/prefix per customer). It MUST **scale to any volume** (no single-machine or local-only assumption for production). MVP local demo may use local filesystem; production uses cloud blob only.

**Audit**: Every transition (arrived → left for processing → outputs ready → transferred) is recorded as an **AuditEvent** (or equivalent) with document count, file size(s), timestamps, stage, and customer/location reference. Admin and select power users can view the full trail (G9, data-model.md AuditEvent).

---

## 4. Data Flow (End-to-End)

1. **Upload**  
   Client (UI or API) uploads file(s) → API validates format, size, duplicate (FR-020) and per-page size/dimensions (FR-007) → file stored in customer’s object storage → Document + Page(s) + Job created in DB → Job status = queued.

2. **Classification (and optional categorization)**  
   Worker picks job from queue → loads pages → runs classifier (handwritten / machine-printed / unknown) and optionally categorizer (e.g. document type, business category) per customer config → updates each Page with classification and optional category → enqueues per-page or per-document work for **printed OCR** or **handwritten OCR** (or default for unknown).

3. **OCR**  
   Printed OCR worker: loads page image → runs printed engine → writes OCRResult (text, engine, confidence) → updates Job/Page. Handwritten OCR worker: same for handwritten path. Results stored in DB and optionally in object storage for download.

4. **Results and status**  
   API serves job status (queued / running / completed / failed) and results (text by job/document/page). Frontend polls or refreshes; customer picks up files from secured location (FR-013).

5. **Workflow and human review**  
   Workflow engine (configurable per customer) applies business rules and ETL; human-review steps and alerts trigger when rules are met; AI agent can be invoked on errors (FR-016). Audit trail records document/page location and steps (G9).

6. **Shared reference data (RAG or similar)**  
   When validation or compliance is needed (e.g. postal code lookup to validate address, country rules), services query the **shared reference store** (§3a) on demand. Data is used by more than one customer when needed; no per-customer copy.

---

## 5. Deployment View (MVP)

- **Runtime**: Simple and easy (e.g. Docker Compose or single-node). No Kubernetes required for MVP.
- **Processes**: API server; one or more worker processes (classification + printed OCR + handwritten OCR + optional AI agent); frontend (static or SSR).
- **Storage**: PostgreSQL (single instance or managed); Redis (queue); S3-compatible or local object storage with per-customer prefix/bucket.
- **Scaling**: Add worker replicas to consume queue; scale API if needed; object storage and DB scale with usage. Capacity tuning from past volumes or customer peak schedule (FR-022).

```
  ┌─────────────────────────────────────────────────────────────┐
  │  MVP deployment (e.g. Docker Compose / single node)         │
  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
  │  │ API server  │  │ Workers x N │  │ Frontend (static/   │  │
  │  │             │  │ (classify,  │  │ dev server)         │  │
  │  │             │  │  printed,   │  │                     │  │
  │  │             │  │  handwritten│  │                     │  │
  │  └──────┬──────┘  └──────┬──────┘  └──────────┬──────────┘  │
  │         │                 │                     │             │
  │         ▼                 ▼                     ▼             │
  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
  │  │ PostgreSQL  │  │ Redis       │  │ Object storage      │  │
  │  │             │  │ (queue)     │  │ (per-customer)      │  │
  │  └─────────────┘  └─────────────┘  └─────────────────────┘  │
  └─────────────────────────────────────────────────────────────┘
```

---

## 6. Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| **Hybrid OCR (printed vs. handwritten paths)** | Different engines and models per type; 99.9% OCR accuracy target and lower human review (spec, constitution). |
| **Local OCR only** | Data never leaves for external ML; compliance and trust (G6, FR-023). |
| **Single-tenant, per-customer isolation** | No data shared between customers; secured drop-off/pickup per customer (FR-013, FR-024). |
| **Async queue + workers** | Scale to ~5M docs/month; near-zero latency for accept; heavy OCR offloaded to workers. |
| **Shared reference data (RAG or similar)** | Commonly used data (e.g. postal code lookups for address validation) used by more than one customer; accessed when needed; single source, no per-customer duplication. Implementation may be RAG or other on-demand lookup (constitution III, FR-024, research.md). |
| **Per-page size/dimension limits** | Avoid single oversize page (e.g. 1 GB, 10000×10000 px) failing whole file; policy: fail file or skip page (spec edge case, FR-007). |
| **Workflow engine + human review + AI agent** | Low-code rules and ETL; human-in-the-loop; error handling via triggers/alerts (FR-014, FR-015, FR-016). |
| **Audit trail and job status** | Every document’s location and step visible to admin/power users; clear failure reasons (G9, FR-005, FR-009). |
| **Classification may include categorization** | Per-customer config; e.g. document type, business category; supports routing and reporting (FR-002). |
| **Optional 3rd party reporting/BI** | Integration with external reporting or BI engine for reporting and BI needs; customer isolation and data sovereignty preserved (FR-025). |
| **AI: internal vs external** | Internal AI (classification, OCR, local LLMs, AI agent) runs inside Stella; customer data never leaves. External AI is minimized due to data privacy; no customer document data or PII sent to third-party AI (see §3b). |
| **Secured drop-off/pickup and audit** | Drop-off/pickup location secured in the cloud; scales to any volume. Audit trail records: docs in (count, size, when), left for processing, outputs before transfer, transferred to customer (FR-013, G9, §3c). |

---

## 7. Cross-Cutting Concerns

- **Auth**: Basic role-based (Administrator vs Power Analyst); all API and UI scoped by role and customer.
- **Observability**: Health/readiness endpoint; structured logging; audit events for document/job lifecycle.
- **Configuration**: Per-customer workflow, retention, compliance settings, output shape; env-based feature flags and limits (file size, batch size, per-page limits).

---

## 8. Doc Set

- **Product and behaviour**: [spec.md](./spec.md)
- **Technical plan and structure**: [plan.md](./plan.md)
- **Technical specs (stack)**: [technical-specs.md](./technical-specs.md) — SQL Server, React, Next.js, Tailwind, central rules/APIs
- **Data model**: [data-model.md](./data-model.md)
- **Research and decisions**: [research.md](./research.md)
- **API contracts**: [contracts/](./contracts/)
- **Tasks**: [tasks.md](./tasks.md)
