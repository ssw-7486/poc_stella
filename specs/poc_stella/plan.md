# Implementation Plan: Stella (Document OCR SaaS)

**Spec folder**: `poc_stella` | **Date**: 2025-01-29 | **Spec**: [spec.md](./spec.md)  
**Input**: Product specification from `specs/poc_stella/spec.md`

---

## Summary

Stella is an MVP SaaS that ingests documents (images/PDFs and other formats), classifies each page as handwritten or machine-printed, and runs the appropriate **local** open-source OCR engine per type. The system must scale to ~5M documents/month per customer with near-zero latency, support a secured per-customer file drop-off/pickup, workflow/process manager with human review and AI-assisted error handling, admin dashboard, and basic auth (Administrator vs Power Analyst). Architecture: single-tenant with strict customer isolation; only local OCR that protects data; no cross-training of models across customers. Technical approach: backend API + async workers (classification, printed OCR, handwritten OCR), queue for jobs, object storage per customer, and a frontend for dashboard and workflow management.

**First step**: Run a **small olmOCR 2 test** on the target environment (MacBook Pro for MVP) to validate the OCR engine before building the full pipeline. See [ocr-engine-decision.md](./ocr-engine-decision.md) and **Phase 0** in [tasks.md](./tasks.md).

---

## Technical Context

See **[technical-specs.md](./technical-specs.md)** for full stack. Summary:

**Database**: **Microsoft SQL Server** (current standard); schema per data-model.md; tenant isolation via customer_id.  
**Backend / API**: Node.js (Next.js API routes) or .NET (ASP.NET Core Web API); **central API management** — single API surface (BFF or gateway) for auth, versioning, routing.  
**Frontend**: **React** + **Next.js** (as needed) + **Tailwind CSS** (or similar); TypeScript; server state (React Query/SWR), forms (React Hook Form + Zod).  
**Rules and APIs**: **Central management** — workflow and business rules in SQL Server; **Rules API** for CRUD and workflow engine; single API entry point for all clients.  
**OCR (MVP)**: **olmOCR 2 (Allen AI)** — local only; one model for printed + handwritten; small test first (Phase 0 in tasks). See [ocr-engine-decision.md](./ocr-engine-decision.md).  
**Workers**: Node or .NET (or Python for OCR if needed); Redis + BullMQ/Celery or Azure Service Bus; classification, printed/handwritten OCR, AI agent.  
**Storage**: SQL Server (metadata, rules, audit); object storage (Azure Blob or S3-compatible) per customer; shared reference data (RAG or similar) on-demand. **MVP**: Secured repository for drop-off/pickup is a **local file folder** — `data/` at repo root with `data/customers/{customer_id}/drop-off/` and `data/customers/{customer_id}/pickup/` (FR-013); production uses cloud blob. See [technical-specs.md](./technical-specs.md) §9 and Phase 2 task T011a in [tasks.md](./tasks.md).  
**Testing**: Jest/Vitest (Node/React) or xUnit (.NET); contract tests (OpenAPI); React Testing Library; four-tier sign-off per constitution.  
**Target Platform**: Cloud-ready; MVP: Docker Compose or single-node; Azure or AWS when scaling.  
**Project Type**: Web application (API + frontend + worker processes).  
**Performance Goals**: ~5M docs/month per customer; capacity from past volumes or customer peak schedule; near-zero latency; duplicate uploads prevented.  
**Constraints**: Local OCR only; no cross-training; per-customer isolation; central rules and API management.

---

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

Gates are determined by [.specify/memory/constitution.md](../../.specify/memory/constitution.md) (Stella Constitution v1.1.0):

1. **Simplicity & Ease of Use**: Design and UX are simple and understandable; complexity justified.
2. **Customer Configurability & Control**: Highly customizable per customer; easy to fill out with options; AI/ML opt-in explicit; outcome review; customers in control of their data.
3. **Compliance, Security & Privacy**: Country-specific compliance; reference/compliance data in shared on-demand store (e.g. RAG), not duplicated per customer; no customer data shared externally; local OCR only.
4. **Trust & Accuracy**: 99.9% OCR accuracy target; higher accuracy reduces human review; full audit trail; data isolation.
5. **Human Review & Interaction**: Workflow supports human-review steps and alerts; human intervention allowed; need scales with OCR accuracy.
6. **Customer Isolation & UX/UI**: No data shared between customers; UX accessible and intuitive; UI shows rules per step and cross-step rule usage; meets critical-importance bar.

No violations to justify at this time.

---

## MVP UI flow (reference)

When building the MVP screens, follow the **rough flow** in [spec.md](./spec.md) § MVP screen flow:

1. **Login** → role-based views (Administrator vs Power Analyst).
2. **Landing dashboard** → immediate attention, in progress, customer site health, volumes per customer.
3. **Menu — Quick Start** → series of questions to create workflow; collects all info needed to test documents.
4. **Workflow setup** → visual map built as info is collected; separate area for business rules, logic, ETL rules; workflow testable at any step (not only from step 1).
5. **Workflow versioning** → create versions; rollback when necessary.
6. **AI agent** (developed as part of Stella) → error handling; **human-review rules** must be defined for when intervention is required.
7. **Industry toolkits/templates** → by sector (e.g. banking, insurance, healthcare, police) for similar document types and faster setup.

---

## Project Structure

### Documentation (this feature)

```text
specs/poc_stella/
├── spec.md              # Product spec (done)
├── plan.md              # This file
├── architecture.md      # High-level architecture (context, components, data flow, deployment)
├── technical-specs.md   # Tech stack: SQL Server, React, Next.js, Tailwind, central rules/APIs
├── ocr-engine-decision.md  # OCR engine comparison and selection (MVP: olmOCR 2)
├── research.md          # Phase 0: OCR stack, queue, storage decisions
├── data-model.md        # Phase 1: entities and relationships
├── quickstart.md        # Phase 1: run locally
├── contracts/            # Phase 1: OpenAPI / API contracts
└── tasks.md             # Phase 2: from speckit.tasks (not from plan)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── api/             # REST endpoints (upload, jobs, results, rules, workflow, admin); central API layer
│   ├── models/          # Domain + persistence (Document, Page, Job, OCRResult, Customer, User, Workflow); SQL Server
│   ├── services/        # Classification, OCR routing, workflow engine, audit, rules service
│   ├── workers/         # Async jobs: classify, printed OCR, handwritten OCR, AI agent
│   └── config/          # Env, feature flags, per-customer settings
└── tests/
    ├── contract/
    ├── integration/
    └── unit/

frontend/
├── src/
│   ├── components/      # Dashboard, job list, upload, workflow editor, admin (React + Tailwind)
│   ├── app/ or pages/   # Next.js App Router or Pages; landing dashboard, customer views, setup/admin
│   └── services/        # API client, auth
└── tests/

shared/                  # Optional: schemas shared between backend and frontend
└── schemas/             # e.g. OpenAPI-generated types or JSON Schema

data/                    # MVP: local secured repository (FR-013); per-customer drop-off/pickup
├── .gitignore           # Ignore customer files; do not commit documents or outputs
├── README.md            # Layout and MVP usage (drop-off vs pickup paths)
└── customers/
    └── {customer_id}/
        ├── drop-off/    # Incoming documents (upload)
        └── pickup/      # Outputs for customer (OCR results, exports)
```

**Structure Decision**: Web application with separate backend and frontend. Backend holds API, workflow engine, and worker processes (classification + dual OCR paths + AI agent). Frontend provides landing dashboard (FR-018), admin vs Power Analyst views (FR-011), workflow editor (FR-014), and basic user/dashboard/billing (FR-021). Single-tenant isolation is enforced by tenant/customer ID in storage and API; object storage uses per-customer prefixes or buckets. **MVP**: The secured repository for drop-off/pickup (FR-013) is a **local file folder** `data/` at repo root with `data/customers/{customer_id}/drop-off/` and `data/customers/{customer_id}/pickup/`; production uses cloud blob (Azure Blob or S3).

---

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| (None yet) | — | — |
