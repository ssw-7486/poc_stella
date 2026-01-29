# Phase 1: Data Model (Stella)

Entities and relationships derived from the product spec. Validation rules and state transitions are implied by FRs and acceptance criteria. **Persistence**: Microsoft SQL Server (see [technical-specs.md](./technical-specs.md)).

---

## Core entities (from spec)

### Document

- **Purpose**: An uploaded file (image or PDF, or other supported format).
- **Attributes**: identifier, customer_id, storage_reference (path or key), format (e.g. PDF, JPEG, PNG, TIFF, CSV), size, created_at, retention_until (customer-configurable).
- **Relationships**: Belongs to one Customer; has one or more Pages.
- **Validation**: Format in allowed list (FR-019); size within max (FR-007); duplicate check by identity/hash unless override (FR-020).

### Page

- **Purpose**: Single page of a document (for multi-page PDFs or equivalent).
- **Attributes**: document_id, page_index, classification (handwritten | machine-printed | unknown), category (optional; e.g. document type, business category—per customer config), ocr_result_id (optional), size_bytes (optional), width_px, height_px (optional, for dimension checks).
- **Relationships**: Belongs to one Document; has zero or one OCRResult.
- **Validation**: Classification drives routing to printed vs handwritten OCR path (FR-002, FR-003). Classification MAY include categorization per customer configuration (FR-002). Per-page size and dimension limits apply (FR-007, spec edge case): pages over limit (e.g. ~1 GB or ~10000×10000 px) trigger policy (fail whole file or skip page); oversize pages may represent a material share of volume (~10%).

### Job

- **Purpose**: A processing unit (one document or one batch).
- **Attributes**: identifier, customer_id, status (queued | running | completed | failed), created_at, completed_at (optional), error_code / error_message (optional).
- **Relationships**: Belongs to one Customer; aggregates one or more Documents; may reference workflow_run or pipeline_step for audit.
- **Validation**: Status transitions; failed jobs have non-empty error (FR-009, SC-004).

### OCRResult

- **Purpose**: Extracted text and metadata per page or per document.
- **Attributes**: job_id, page_id (optional), document_id (optional), text, engine_used, confidence (optional), created_at.
- **Relationships**: Belongs to one Job; optionally to one Page or one Document.
- **Validation**: Output shape configurable per customer (FR-008).

---

## Supporting entities (from FRs and personas)

### Customer

- **Purpose**: Tenant; isolated from other customers (FR-024); has own file drop-off/pickup (FR-013).
- **Attributes**: identifier, name, retention_policy_default, peak_schedule (optional), compliance_settings (e.g. GDPR), created_at.
- **Relationships**: Has many Documents, Jobs, Users, Workflows; has one secured storage location (logical or physical prefix/bucket).

### User

- **Purpose**: Identity for auth; role determines view (Administrator vs Power Analyst) (FR-011).
- **Attributes**: identifier, customer_id (optional for admin), role (administrator | power_analyst | …), email, created_at.
- **Relationships**: Belongs to zero or one Customer (admin may be global); has many audit events if needed.

### Workflow

- **Purpose**: Low-code/no-code definition of how documents are processed (FR-014, G10). Supports versioning and rollback (FR-026).
- **Attributes**: identifier, customer_id, name, definition (steps, business rules, extraction/transformation rules, inputs/outputs), version (e.g. semantic or integer), created_at, optional industry_sector or template_id for sector-based templates (FR-028).
- **Relationships**: Belongs to one Customer; referenced by Jobs when executing. Multiple versions of the same logical workflow are stored (e.g. workflow_id + version) so admin can roll back to a previous version.

### AuditEvent (audit trail)

- **Purpose**: Where each document is at any time; viewable by admin and select power users (FR-009, G9). Includes **drop-off/pickup lifecycle** for the secured location (FR-013): docs in (count, file size(s), when), when they leave for processing, outputs before transfer, and when transferred to customer.
- **Attributes**: document_id (or job_id), event_type, stage, actor_id, timestamp, payload (optional). For drop-off/pickup events, payload MUST include: document_count, total_file_size (or per-file sizes), stage (e.g. arrived | left_for_processing | outputs_ready | transferred_to_customer), customer_id, location_reference.
- **Relationships**: References Document and/or Job; optionally User; scoped by customer (location is per customer).
- **Event types (examples)**: drop_off_arrived, left_for_processing, outputs_ready, transferred_to_customer; plus document/job lifecycle events (uploaded, classified, ocr_started, ocr_completed, failed).

---

## Shared / central data (FR-024)

- **Central validation sources**: e.g. postal code lookup; read-only, shared across customers; no PII per customer stored there.

---

## State transitions

- **Job**: queued → running → completed | failed. (No revert from completed/failed unless new job.)
- **Document**: uploaded → classifying → classified → ocr_pending → ocr_running → ocr_completed | failed. (Align with workflow steps if workflow defines stages.)

---

**Next**: contracts/ (API endpoints and payloads), quickstart.md (run locally).
