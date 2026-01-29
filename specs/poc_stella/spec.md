# Product Specification: Stella (Code Name)

**Product**: Stella — Document OCR SaaS (MVP)  
**Spec Folder**: `poc_stella`  
**Created**: 2025-01-29  
**Status**: Draft  
**Input**: MVP SaaS that processes millions of documents (handwritten and machine-printed) using open-source OCR engines in a hybrid architecture with optimized engines per document type.

---

## Problem Statement

Organizations hold large volumes of scanned documents—invoices, forms, notes, archives—in mixed formats: machine-printed text and handwriting. Extracting searchable, structured text at scale is costly and error-prone when using a single OCR approach. Handwritten text requires different models and tuning than printed text; using one engine for both leads to poor accuracy or high cost when relying on proprietary/cloud APIs. Teams need an open-source–based, scalable pipeline that:

- Routes each document to the right OCR engine (printed vs. handwritten).
- Processes millions of pages without vendor lock-in or per-page licensing.
- Exposes results in a way that supports search, export, and downstream workflows.

---

## Goals

- **G1**: Build an MVP SaaS that ingests documents (images/PDFs), classifies them as handwritten vs. machine-printed, and runs the appropriate open-source OCR engine per type.
- **G2**: Support throughput suitable for “millions of documents” (design for scale; MVP may target a defined subset with clear path to scale).
- **G3**: Deliver extracted text (and optional structured metadata) via API and a minimal UI for upload, status, and export.
- **G4**: Use only open-source OCR engines and keep the architecture hybrid (separate paths for printed vs. handwritten).
- **G5**: Make the system operable: health checks, observability, and clear failure handling.
- **G6**: Preserve security and privacy of customer data at all times; do not share customer data with any AI/ML engines for learning other than for creation and support of a local LLM that can only be seen or used by that customer.
- **G7**: Ensure the system complies with all rules and regulations applicable to the customer (e.g., GDPR in Europe), with compliance configuration in setup and administration panels.
- **G8**: Create and maintain local LLMs to improve processing time for customers’ documents, supporting specific OCR engines where a customer has high volume of images (not just text).
- **G9**: Provide an audit trail for every document viewable by admin and select power users, and ensure the system knows where each document is at any time.
- **G10**: Provide a low-code/no-code workflow setup and manager so business rules and logic can be easily defined and maintained globally or per individual step.

## Non-Goals (MVP)

- **NG1**: Full document understanding (tables, layout, key-value extraction) beyond raw/text line-level OCR.
- **NG2**: Real-time or sub-second latency guarantees; batch/async processing is acceptable.
- **NG3**: Multi-language or script detection beyond what the chosen engines support out of the box.
- **NG4**: On-premise or air-gapped deployment; MVP can be cloud-only.
- **NG5**: Advanced billing/metering or full multi-tenant isolation beyond basic tenant/organization identifiers for MVP.
- **NG6**: Standard reports for customer productivity per selected time period (day, week, month, year).

---

## User Scenarios & Testing *(mandatory)*

User stories are ordered by priority. Each is independently testable so that implementing one delivers a viable slice of value.

### User Story 1 - Ingest and classify documents (Priority: P1)

As an operator or integrator, I upload one or more documents (image or PDF) so that the system stores them, classifies each page (e.g. handwritten vs. machine-printed) and may categorize them (e.g. document type, business category), and queues them for the correct OCR pipeline.

**Why this priority**: Ingestion and classification (and optional categorization) are the foundation; without them, no OCR runs.

**Independent Test**: Upload a small set of mixed documents; verify they are stored, classified (and categorized where configured), and queued for the appropriate engine. No OCR output required yet.

**Acceptance Scenarios**:

1. **Given** valid image/PDF files, **When** I submit them via API or UI, **Then** the system accepts them, persists them, and returns job/batch identifiers.
2. **Given** stored documents, **When** classification runs, **Then** each page is labeled as “handwritten” or “machine-printed” (or “unknown” with defined behavior) and optionally categorized (e.g. document type, business category) per customer configuration.
3. **Given** classified pages, **When** the pipeline runs, **Then** handwritten pages are routed to the handwritten OCR engine and printed pages to the printed OCR engine.

---

### User Story 2 - Run OCR and retrieve text (Priority: P2)

As an operator or integrator, I run OCR on queued documents and retrieve extracted plain text (and optionally confidence/metadata) so that I can search or export content.

**Why this priority**: Core value of the product is extracted text from both document types.

**Independent Test**: Run OCR on a small batch of pre-classified documents; retrieve text via API and confirm it matches the expected engine (printed vs. handwritten path).

**Acceptance Scenarios**:

1. **Given** queued documents for printed OCR, **When** the printed OCR job runs, **Then** extracted text is stored and accessible via API (e.g., by document or page ID).
2. **Given** queued documents for handwritten OCR, **When** the handwritten OCR job runs, **Then** extracted text is stored and accessible via API.
3. **Given** a completed OCR job, **When** I request results by job or document ID, **Then** I receive plain text (and optional confidence/engine metadata) in a defined format (e.g., JSON).

---

### User Story 3 - Monitor jobs and handle failures (Priority: P3)

As an operator, I view job status (queued, running, completed, failed) and see clear failure reasons so that I can retry or fix inputs.

**Why this priority**: At scale, visibility and failure handling are essential for operations.

**Independent Test**: Submit a job, poll status until completion; submit an invalid or corrupt file and verify failed state and error message.

**Acceptance Scenarios**:

1. **Given** a submitted job, **When** I query job status via API (or UI), **Then** I see one of: queued, running, completed, failed.
2. **Given** a failed job (e.g., corrupt file, engine error), **When** I query status or error details, **Then** I receive a deterministic error code/message suitable for retry or support.
3. **Given** a completed job, **When** I request results, **Then** I do not see it in “running” or “queued” anymore; status is eventually consistent.

---

### User Story 4 - Export and minimal UI (Priority: P4)

As a user, I use a minimal web UI to upload documents, see job list and status, and download or view extracted text so that I can validate the pipeline without calling the API only.

**Why this priority**: Enables demos and manual verification; API-first still primary.

**Independent Test**: Upload via UI, wait for completion, open “view text” or “download” and confirm content matches API response.

**Acceptance Scenarios**:

1. **Given** I am on the app’s upload page, **When** I select files and submit, **Then** upload succeeds and I see the job(s) in a list with status.
2. **Given** a completed job in the list, **When** I choose “view text” or “download”, **Then** I see or receive the extracted text (same as API).
3. **Given** the UI is loaded, **When** I open the jobs list, **Then** I see recent jobs with status without requiring full page refresh (e.g., polling or refresh button).

---

## MVP screen flow (rough)

High-level flow for MVP screens; **use this when building the MVP screens**. Details and acceptance criteria are in user stories and FRs.

1. **Login** — User signs in; role (Administrator vs Power Analyst) determines available views.

2. **Landing page (dashboard)** — After login, the landing page is a dashboard showing:
   - Items needing **immediate attention**
   - Items **in progress**
   - **Overall health of customer sites**
   - **Volumes overall per customer**

3. **Menu — Quick Start** — In the menu, **Quick Start** allows an Administrator to set up a customer quickly. It asks a **series of questions** used to create a **workflow process**. Quick Start collects all info needed to be able to **test documents** (i.e. enough to run a test of the workflow with sample docs).

4. **Workflow setup and visual map** — While info is collected:
   - A **visual map** of the workflow is **built in real time** (as the admin answers questions).
   - The screen has a **separate area** that shows **business rules, logic, and ETL rules** that are being applied (per constitution: UI shows rules per step and which steps share rules).
   - **Workflow can be tested at any point and from any starting step** — the user does not have to start from step 1 every time (e.g. test from step 3 onward).

5. **Workflow versioning** — **Versions of the workflow** can be created so the admin can **roll back** if necessary.

6. **AI agent and human review** — The system includes an **AI agent** that helps with **error handling** in the process (FR-016). **Rules must be defined** for when **human review and intervention** are required (FR-015).

7. **Industry toolkits and templates** — **Toolkits and templates** are created based on **industry sector** for the customer (e.g. banking, insurance, healthcare, police). Sectors have similar document types; templates speed up setup and consistency.

---

### Edge Cases

- **Empty or corrupt files**: System rejects or marks job as failed with a clear error (e.g., “invalid image”, “corrupt PDF”); no infinite retries on the same file.
- **Very large single file / huge batch**: Define max file size and max batch size; requests above limit are rejected with 413 or equivalent; batches above limit are split or rejected per policy.
- **Oversize or extreme-dimension page in multi-page file**: Customers have files with many pages; a single page over defined limits (e.g. ~1 GB size or ~10000×10000 px dimensions) may cause the entire file to fail. Such pages may represent up to ~10% of volume. System MUST define per-page size and dimension limits; policy MUST be explicit (e.g. fail whole file vs. skip oversize page and process rest) and documented.
- **Unclassifiable or low-confidence classification**: Pages classified as “unknown” are routed to a defined default path (e.g., printed engine) or retried with a fallback; behavior is documented and consistent.
- **OCR engine timeout or crash**: Job is marked failed after a defined timeout; error is recorded; optional automatic retry with backoff (if in scope for MVP).
- **Duplicate submission**: Same file hash or idempotency key results in either “already processed” response with existing result or a clear duplicate policy (e.g., reject or return existing job ID).
- **Mixed PDF (some handwritten, some printed pages)**: Each page is classified and routed independently; final result aggregates per-document with per-page text and optional page-level labels.
- **Unsupported format**: Only supported formats (e.g., PDF, JPEG, PNG) are accepted; others return 400 with supported types listed.
- **Concurrent limits**: Under load, queue depth or rate limits are applied so that the system degrades gracefully (e.g., 503 or queue-full) rather than failing unpredictably.

---

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST accept document uploads in supported formats (image, PDF, TIFF, CSV; see FR-019) via a defined API and optionally via a minimal web UI.
- **FR-002**: System MUST classify each page as handwritten or machine-printed (or unknown) using a defined classifier (e.g., model or heuristic). Classification MAY include categorization (e.g. document type, business category) per customer configuration.
- **FR-003**: System MUST route handwritten pages to a dedicated open-source handwritten OCR engine and machine-printed pages to a dedicated open-source printed OCR engine.
- **FR-004**: System MUST store extracted text (and optional confidence/metadata) and expose it via API by job and/or document/page identifier.
- **FR-005**: System MUST expose job status (queued, running, completed, failed) via API and optionally in the UI.
- **FR-006**: System MUST persist jobs and results so that status and text can be retrieved after process restart.
- **FR-007**: System MUST enforce maximum file size and batch size; requests exceeding limits MUST be rejected with a clear error. System MUST enforce per-page size and dimension limits (e.g. to avoid single oversize pages failing whole files); policy for oversize pages (fail file vs. skip page) MUST be configurable or documented.
- **FR-008**: System MUST support structured output for text (e.g., JSON with page-level or document-level text); output shape MAY be configurable per customer.
- **FR-009**: System MUST record failure reason for failed jobs (e.g., engine error, timeout, invalid input).
- **FR-010**: System MUST expose a health/readiness endpoint for the service and critical dependencies (e.g., queue, storage).

- **FR-011**: System MUST support basic authorization (e.g., role-based) so that Administrator and Power Analyst see appropriate views (demo admin vs power analyst).
- **FR-012**: System MUST make retention a customer-configurable variable; System MUST respect any rules the customer must abide by; once data is safely with the customer, System need not retain it long.
- **FR-013**: System MUST provide a secured location for file drop-off and pickup by the customer; this location MUST NOT be shared with any other customers. The location MUST be secured in the cloud and MUST scale to any volume. System MUST record, as part of the audit trail (G9): how many documents arrive (per drop-off), file size(s) and when they arrived; when they leave for processing; what outputs exist before transfer to the customer; and when they are transferred to the customer.
- **FR-014**: System MUST provide a workflow/process manager or editor that allows users to build from scratch how documents are processed: which business rules apply, which extraction and transformation rules are followed, and all inputs and outputs. Workflow MUST be testable at any step and from any starting point (not only from step 1). The UI MUST build a visual map of the workflow as info is collected and MUST show a separate area with business rules, logic, and ETL rules being applied (per constitution).
- **FR-015**: System MUST allow human intervention for reviews and changes as needed for all inputs and outputs. Workflow MUST support human-review steps and alerts when certain rules are met. Admin MUST be able to define rules that specify when human review and intervention are required.
- **FR-016**: System MUST provide an AI agent to support error handling in the workflow; the agent MUST be activated based on triggers or alerts and MUST assist in resolving issues in workflow processing.
- **FR-017**: System MUST support English, French, Dutch, and German when fully built. For MVP, System MUST support English only and MUST expose the ability to switch languages (e.g., UI/API language selector) so that multi-language support can be demonstrated.
- **FR-018**: The landing page MUST be a dashboard that shows: items needing immediate attention; items in progress; overall health of customer sites; volumes overall per customer; and (as already stated) all activities across all customers in different stages of processing, including items that need to be finished and customers where processing times exceed or fall short of SLAs.
- **FR-019**: System MUST support document formats PDF, JPEG, PNG, TIFF, and CSV; System MUST allow customers to add more formats as needed.
- **FR-020**: System MUST prevent duplicate uploads by rule (e.g., by file identity/hash); duplicate uploads MUST be rejected unless an explicit override is applied.
- **FR-021**: System MUST provide basic user accounts, dashboards, and billing for MVP.
- **FR-022**: System MUST scale to customer volumes (e.g., up to ~5M documents/month per customer); System MUST adjust capacity based on past volumes or customer-defined peak schedules; System MUST target near-zero latency.
- **FR-023**: Only OCR engines that run locally and protect all data MAY be used. Data MAY be used to train local models to improve processing for that customer only; there MUST be no cross-training across customers’ models. Candidates for evaluation: Local AI OCR (v2.2.2), LightOnOCR-1B-1025, Deepseek-OCR.
- **FR-024**: For MVP, System MUST be single-tenant; architecture MUST isolate each customer from others. Customers MAY share access to central validation sources only (e.g., postal code lookups).
- **FR-025**: System MAY integrate with a third-party reporting or business intelligence (BI) engine to support reporting and BI needs; integration MUST preserve customer isolation and data sovereignty (e.g. aggregated or anonymized exports, or BI engine access only to permitted data).
- **FR-026**: System MUST support workflow versioning; versions of a workflow MUST be creatable and stored so that an admin can roll back to a previous version if necessary.
- **FR-027**: System MUST provide a Quick Start flow (e.g. in the menu) that guides an Administrator through a series of questions to set up a customer and create a workflow; Quick Start MUST collect all info needed to test documents with that workflow.
- **FR-028**: System MUST provide industry-sector toolkits and templates (e.g. banking, insurance, healthcare, police) so that customers in the same sector can reuse similar workflow and document-type definitions; templates speed up setup and consistency.

### Key Entities

- **Document**: Represents an uploaded file (image or PDF); has identifier, storage reference, format, size; may have one or more pages.
- **Page**: Single page of a document; has document reference, page index, classification (handwritten | machine-printed | unknown), and optional reference to OCR result.
- **Job**: A processing unit (e.g., one document or one batch); has identifier, status (queued | running | completed | failed), creation time, optional completion time, and optional error details.
- **OCRResult**: Extracted text and optional metadata (engine used, confidence) per page or per document; linked to Job and Page.

### User Personas

The system will eventually support four user types. **MVP focus**: Administrator and the customer’s **Power Analyst**.

#### Administrator

- Has full CRUD across the system.
- Ensures setup and management of new and existing customers with the workflow agreed in the SLA.
- Resolves all errors with the AI agent within agreed-upon times.
- Sees all customer activities.
- Sees all customers across all regions.

#### Power Analyst (customer)

- *[To be defined; MVP focus alongside Administrator.]*

#### Other personas (post-MVP)

- Two additional user types to be defined when expanding beyond MVP.

---

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Operator can upload a document and receive a job ID within 30 seconds under normal load.
- **SC-002**: Classification and routing (without OCR) complete for a 10-page document within 60 seconds under normal load.
- **SC-003**: OCR text for a single printed page is available via API within 2 minutes of job start under normal load (engine-dependent).
- **SC-004**: Failed jobs always have a non-empty error message or code when status is “failed”.
- **SC-005**: System handles at least 100 documents in a batch without crashing; queue and workers process them within defined SLA or document limits.
- **SC-006**: Health endpoint returns 200 when the service and critical dependencies are available; returns 503 or 500 when a critical dependency is down.
- **SC-007**: System scales to support customers processing up to ~5M documents/month and adjusts capacity from past volumes or customer-defined peak schedules; latency target is near-zero.

---

## Stakeholder Decisions (Resolved)

Decisions from stakeholder input; these replace the former open questions.

1. **Scale and SLA**: Some customers will process up to ~5M documents/month. The app MUST adjust capacity based on past volumes or the customer identifying peak periods in a schedule. Target: almost no latency.
2. **Engines**: Only OCR that runs locally (for security) is acceptable. Candidates to evaluate: **Local AI OCR (v2.2.2)**, **LightOnOCR-1B-1025**, **Deepseek-OCR**. Any OCR MUST protect all data. Data MAY be used to train local models to improve processing for that customer only; there MUST be no cross-training across customers’ models.
3. **Auth**: MVP MUST support basic authorization so we can demo what the Administrator sees vs. the Power Analyst.
4. **Tenancy**: Single-tenant for MVP. Architecture MUST isolate each customer from others. Customers MAY access central sources only for validating common data (e.g., postal code lookups).
5. **Retention**: Retention is a variable set by the customer. System MUST respect any rules the customer must abide by. Once data is safely with the customer, System need not retain it long.
6. **Formats**: Support PDF, JPEG, PNG, TIFF, CSV. Customer MUST be able to add more formats as needed.
7. **Output**: Structured output is normally needed; this MAY vary per customer.
8. **Idempotency**: Duplicate uploads MUST be prevented by rule unless there is an explicit override.
9. **UI scope**: Basic user accounts, dashboards, and billing are required for MVP.
10. **Deployment**: For MVP, runtime should be simple and easy to use (e.g., Docker Compose or single-node).
