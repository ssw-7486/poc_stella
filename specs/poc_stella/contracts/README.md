# API Contracts (Stella)

This directory holds API contracts for the Stella backend.

## Planned artifacts

- **openapi.yaml** (or **openapi.json**): REST API specification for:
  - Document upload (multipart; customer-scoped)
  - Job submission and status (GET by job ID, list by customer)
  - OCR results (GET by job/document/page)
  - Workflow CRUD (create, read, update, delete definitions)
  - Admin dashboard data (activities, items needing attention, SLA metrics)
  - Auth (login, session, or API key for demo admin vs power analyst)
  - Health/readiness (FR-010)

## Source of truth

Contracts are derived from the product spec (spec.md) and data model (data-model.md). Each user-facing action in the spec should map to one or more endpoints.

## Usage

- Generate client types (e.g. TypeScript, Python) from OpenAPI for frontend and tests.
- Contract tests should validate server responses against these schemas.
