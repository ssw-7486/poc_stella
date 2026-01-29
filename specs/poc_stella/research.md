# Phase 0: Research & Decisions (Stella)

Resolves NEEDS CLARIFICATION from the Implementation Plan and captures technology and architecture decisions. Format: **Decision** → **Rationale** → **Alternatives considered**.

---

## 1. OCR engines (printed vs handwritten)

- **Decision**: **MVP (MacBook Pro local demo)**: Use **olmOCR 2 (Allen AI)** as the primary local OCR engine. It supports both printed and handwritten text, runs on Mac (Ollama, MLX, LM Studio), is Apache 2.0, and is fine-tunable. One model for both paths in MVP; classification still labels printed vs. handwritten for routing and audit. **Production**: Standardize on olmOCR 2, or use a hybrid — **LightOnOCR-1B** (or 2-1B) for printed (speed/cost) and **olmOCR 2** or **DeepSeek-OCR-2** for handwritten. Full comparison and rationale: [ocr-engine-decision.md](./ocr-engine-decision.md).
- **Rationale**: Spec requires local OCR only (FR-023, G6, G8); MVP must run on MacBook Pro (technical-specs.md §9); olmOCR 2 has native Mac support and one-model simplicity; LightOnOCR and DeepSeek-OCR-2 remain options for production hybrid or fallback.
- **Alternatives considered**: Tesseract + TrOCR (two stacks, more integration); LightOnOCR-1B only (lighter but Mac support less documented); DeepSeek-OCR-2 only for MVP (requires community MLX port on Mac).

---

## 2. Backend language and framework

- **Decision**: **Node.js** (LTS) with **Next.js API routes** as primary API surface, or **.NET** (e.g. .NET 8) with **ASP.NET Core Web API**. Node aligns with React/Next.js frontend; .NET aligns with SQL Server. Central API management: single API surface (BFF or gateway) for auth, versioning, routing.
- **Rationale**: See [technical-specs.md](./technical-specs.md); SQL Server is the DB standard; React + Next.js frontend; central management of rules and APIs required.
- **Alternatives considered**: Python/FastAPI (kept for OCR workers if needed); separate API gateway only if multi-service.

---

## 3. Queue and job processing

- **Decision**: TBD — Use a durable queue (e.g. Redis + Celery/RQ, or RabbitMQ) for classification and OCR jobs; workers scale with load; support customer-defined peak schedules and past-volume-based scaling (FR-022).
- **Rationale**: Throughput up to ~5M docs/month per customer with near-zero latency target requires async processing and horizontal worker scaling.
- **Alternatives considered**: In-process only (does not scale); serverless per-doc (cold start and cost at scale).

---

## 4. Storage: relational and object

- **Decision**: **Microsoft SQL Server** for jobs, users, workflow definitions, business rules, audit trail; **Azure Blob Storage** or **S3-compatible** object storage per customer for documents and OCR results (FR-013, FR-024). See [technical-specs.md](./technical-specs.md).
- **Rationale**: SQL Server is the current DB standard; strong consistency for workflow and audit; blob storage per customer with tenant prefix/container; isolation enforced.
- **Alternatives considered**: PostgreSQL (replaced by SQL Server per stakeholder choice); single shared bucket (violates per-customer isolation).

---

## 5. Frontend stack

- **Decision**: **React** + **Next.js** (as needed) + **Tailwind CSS** (or similar); **TypeScript**. Role-based views for Administrator vs Power Analyst (FR-011, FR-018). See [technical-specs.md](./technical-specs.md).
- **Rationale**: React for UI; Next.js for SSR/API routes/routing as needed; Tailwind for CSS; TypeScript for contracts and maintainability; constitution requires accessible UX.
- **Alternatives considered**: Vue (React chosen); CSS-in-JS only (Tailwind preferred for utility-first and design system).

---

## 6. Deployment (MVP)

- **Decision**: Simple and easy to use for MVP (e.g. Docker Compose, single-node or small cluster).
- **Rationale**: Stakeholder decision #10; avoid Kubernetes for MVP unless required.
- **Alternatives considered**: Kubernetes (overkill for MVP); serverless (cold start and complexity for OCR workers).

---

## 7. Duplicate detection and idempotency

- **Decision**: Prevent duplicate uploads by rule (e.g. content hash or file identity); allow override only when explicitly requested (FR-020).
- **Rationale**: Spec requires no duplicate uploads unless override; supports audit and predictable behavior.
- **Alternatives considered**: Allow duplicates and merge later (rejected per spec); no override (too rigid for edge cases).

---

## 8. Per-page size and dimension limits (multi-page files)

- **Decision**: Define per-page size and dimension limits (e.g. max ~1 GB, max ~10000×10000 px) so a single oversize page does not cause unbounded failures. Policy: either fail the whole file or skip the oversize page and process the rest; policy MUST be documented and configurable where possible. Oversize pages may represent up to ~10% of volume for some customers.
- **Rationale**: Spec edge case; multi-page files are common; one bad page should not silently kill the job or overload engines.
- **Alternatives considered**: No per-page limit (rejected: risk of OOM/timeout); always fail file (rejected: loses 90% of good pages when 10% are oversize).

---

## 9. Local model training and isolation

- **Decision**: Data may be used only to train local models for that customer; no cross-training across customers (FR-023, G6, G8).
- **Rationale**: Privacy and compliance; per-customer improvement without data sharing.
- **Alternatives considered**: Central shared model (violates spec); no training (reduces value of local LLMs).

---

## 10. Third-party reporting / business intelligence (BI) engine

- **Decision**: System MAY integrate with a third-party reporting or BI engine to support reporting and business intelligence needs. Integration MUST preserve customer isolation and data sovereignty (e.g. aggregated or anonymized exports, or BI engine access only to permitted data). Engine choice TBD (e.g. Metabase, Superset, Power BI, Tableau, or embedded analytics).
- **Rationale**: Spec FR-025; reporting and BI are needed for dashboards, SLA visibility, and customer insights without building a full BI stack in-house.
- **Alternatives considered**: Build reporting only inside Stella (limited flexibility); send raw PII to external BI (rejected — violates isolation).

---

**Next**: Phase 1 — data-model.md (entities from spec), contracts/ (API), quickstart.md (run locally).
