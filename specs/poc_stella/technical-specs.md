# Technical Specifications: Stella

**Version**: 1.0 | **Date**: 2025-01-29 | **Plan**: [plan.md](./plan.md) | **Architecture**: [architecture.md](./architecture.md)

Technical stack and tooling for the Stella cloud-based SaaS app, aligned with current common practice and stated choices: **SQL Server**, **React**, **Next.js** (as needed), **Tailwind CSS** for styles, and **central management of rules and APIs**. See **§9** for **MVP: local demo (MacBook Pro)** — functional, runs locally for demo, no server required.

---

## 1. Database

| Item | Choice | Notes |
|------|--------|--------|
| **RDBMS** | **Microsoft SQL Server** | Current standard for the project; supports transactions, audit, workflow metadata, and reporting. |
| **Access** | Server-side only (API + workers) | No direct DB access from frontend; all access via APIs. |
| **Schema** | Per [data-model.md](./data-model.md) | Customer, User, Document, Page, Job, OCRResult, Workflow, AuditEvent; tenant isolation via `customer_id`. |
| **Migrations** | Schema-as-code (e.g. Entity Framework migrations, Flyway, or custom SQL scripts) | Versioned with app; repeatable deployments. |
| **Backup / HA** | Per cloud provider (e.g. Azure SQL managed backups, Always On) | Out of scope for MVP detail; assume managed SQL Server or equivalent. |

---

## 2. Backend API and central API management

| Item | Choice | Notes |
|------|--------|--------|
| **Runtime** | **Node.js** (LTS) or **.NET** (e.g. .NET 8) | Node aligns with React/Next.js and TypeScript; .NET aligns with SQL Server and enterprise tooling. Choose one for consistency. |
| **API framework** | **Next.js API routes** (if Node) or **ASP.NET Core Web API** (if .NET) | Next.js API routes for a unified app when using Next.js; separate ASP.NET API if backend is .NET. |
| **Central API management** | Single API surface (BFF or API gateway) | All client traffic goes through one API layer: auth, rate limits, versioning, routing to services. Options: Next.js API routes as BFF, or **Azure API Management** / **Kong** / **AWS API Gateway** in front of backend services. |
| **API style** | REST; OpenAPI (Swagger) for contracts | Contracts in `contracts/`; generate client types for frontend. |
| **Auth** | Centralized in API layer | Role-based (Administrator vs Power Analyst); JWT or session; customer/tenant context on every request. |

**Recommendation**: Use **Next.js API routes** as the primary API surface when using React + Next.js; add a separate API gateway only if multi-service or external partners need a single entry point. Keep **rules and workflow definitions** in SQL Server and expose them via a **Rules API** (see §5).

---

## 3. Frontend

| Item | Choice | Notes |
|------|--------|--------|
| **Framework** | **React** | Primary UI framework; component-based. |
| **Meta-framework** | **Next.js** (as needed) | Use for: SSR/SSG where beneficial, API routes (BFF), routing, and production build. Use “as needed” for pages that benefit (e.g. dashboard, auth, SEO or initial load). |
| **Language** | **TypeScript** | Typed JS; align with API contracts and maintainability. |
| **CSS** | **Tailwind CSS** | Utility-first; design tokens and components; Tailwind + Headless UI or Radix for accessible components. |
| **State / data** | React Query (TanStack Query) or SWR for server state; React state or Zustand for local UI state | Server state from APIs; minimal global client state. |
| **Forms / validation** | React Hook Form + Zod (or similar) | Align with API and validation rules. |
| **Routing** | Next.js App Router or Pages Router | Prefer App Router if starting fresh (Next.js 13+). |

---

## 4. Styling (Tailwind CSS)

| Item | Choice | Notes |
|------|--------|--------|
| **Primary** | **Tailwind CSS** | Utility classes; design system via `tailwind.config` (colors, spacing, typography). Used for all UI styling. |
| **Components** | Tailwind + **Headless UI** or **Radix UI** (accessibility) | Constitution: UX must be accessible; use accessible primitives. |
| **Icons** | **Heroicons** or **Lucide** | Consistent icon set. |
| **Theming** | CSS variables + Tailwind dark mode (if needed) | Per-customer theming later if required. |

---

## 5. Central management of rules and APIs

### 5.1 Rules management

| Item | Choice | Notes |
|------|--------|--------|
| **Storage** | **SQL Server** | Workflow definitions, business rules, ETL rules stored in DB (per data-model: Workflow, and rule-related tables). |
| **API** | **Rules API** (part of central API) | CRUD for workflow and business rules; versioned; scoped by customer. Used by workflow engine and by UI (workflow editor, “rules that apply to this step” per constitution). |
| **Execution** | Workflow engine in backend | Reads rules from DB (or cached); applies during classification, OCR, ETL, human-review steps. |
| **UI** | Low-code/no-code workflow and rules editor (React) | Configure workflows and rules; show which rules apply to which steps and which steps share rules (FR-014, constitution VI). |

**Central** = single source of truth in SQL Server and a single Rules API consumed by backend engine and frontend editor; no duplicate rule stores per service.

### 5.2 API management

| Item | Choice | Notes |
|------|--------|--------|
| **Single entry** | All client requests go through one API surface (Next.js API routes or dedicated API service + optional gateway). | Auth, tenant context, and versioning applied in one place. |
| **Versioning** | URL path (e.g. `/api/v1/...`) or header | Consistent versioning for breaking changes. |
| **Documentation** | OpenAPI (Swagger) in `contracts/` | Generated from code or maintained by hand; used for client generation and contract tests. |
| **Gateway (optional)** | **Azure API Management**, **Kong**, or **AWS API Gateway** | Only if multiple backend services or external partners need a single managed entry point; not required for MVP single-app. |

**Central** = one logical API surface (BFF or gateway), one OpenAPI surface, and one place for auth and tenant resolution.

---

## 6. Workers and queue (unchanged from architecture)

| Item | Choice | Notes |
|------|--------|--------|
| **Queue** | **Redis** + **BullMQ** (Node) or **Celery** (Python) or **Azure Service Bus** | Durable; scale workers independently. |
| **Workers** | Node or .NET worker processes (or Python if OCR stack stays Python) | Classification, printed OCR, handwritten OCR, AI agent; consume from queue; read/write SQL Server and object storage. |
| **OCR** | Local engines only (per research.md) | Run in same trust boundary as API/workers. |

If backend is Node/Next.js, workers can be Node (BullMQ) or a separate Python worker pool for OCR; if backend is .NET, workers can be .NET (e.g. background services + Azure Service Bus or Redis).

---

## 7. Object storage and shared reference data

| Item | Choice | Notes |
|------|--------|--------|
| **Blob storage (drop-off/pickup)** | **Azure Blob Storage** or **S3-compatible** (e.g. AWS S3); **secured in the cloud**, **scales to any volume** | Per-customer container/prefix; document drop-off and result pickup (FR-013). All lifecycle events (docs in—count, size, when; left for processing; outputs before transfer; transferred to customer) recorded in audit trail (G9). MVP local demo may use local filesystem; production uses cloud only. |
| **Shared reference data** | RAG or similar (see [architecture.md](./architecture.md) §3a) | On-demand lookup; e.g. postal codes, compliance; no per-customer duplication. |

---

## 8. Testing and quality

| Item | Choice | Notes |
|------|--------|--------|
| **Unit** | **Jest** (Node/React) or **Vitest**; **xUnit** / **NUnit** (.NET) | Backend and frontend unit tests. |
| **API contract** | **OpenAPI** + **Pact** or **Supertest** (Node) / **WebApplicationFactory** (.NET) | Contract tests against `contracts/`. |
| **Integration** | Same stack; test against real SQL Server (or Testcontainers) and queue | Pipeline and DB integration. |
| **Frontend** | **React Testing Library** + **Jest** or **Vitest**; **Playwright** or **Cypress** for E2E if needed | Component and flow tests. |
| **Constitution** | Four-tier: developer → senior developer → customer analyst → customer sponsor sign-off | Per constitution; automated tests cover first two tiers. |

---

## 9. MVP: local demo (MacBook Pro)

The MVP runs **locally for demo purposes** on a **MacBook Pro** (or equivalent laptop). It must be **functional** but **easy to run without a server** — no heavy infra, all components run on the machine.

| Item | MVP choice | Notes |
|------|------------|--------|
| **Target** | **MacBook Pro** (Apple Silicon or Intel) | Single machine; no remote server; demo and dev only. |
| **Database** | **SQLite** (file-based) or **SQL Server in Docker** | SQLite: zero setup, one file, same schema as SQL Server where possible (e.g. via abstraction or compatible SQL). Alternatively: SQL Server in Docker for Mac if parity with production is required. |
| **Queue** | **Redis in Docker** or **in-memory queue** (e.g. BullMQ with Redis, or simple in-memory for minimal demo) | Redis via Docker: `docker run redis` or in docker-compose. In-memory: no Docker for queue; acceptable for lightweight local demo. |
| **Object storage** | **Local filesystem** (e.g. `./data/customers/{customer_id}/`) or **MinIO in Docker** | No cloud blob needed; per-customer folders on disk or MinIO for S3-compatible API. |
| **API** | **Next.js dev server** (`next dev`) or **Node API** | Single process; API routes or Express/Fastify on localhost. |
| **Frontend** | **Next.js dev server** (same as API if using Next.js) or **Vite + React** | Hot reload; Tailwind CSS; runs on localhost. |
| **Workers** | **Same process** (e.g. background jobs in Next.js/Node) or **separate worker process** (same machine) | For demo: in-process workers are fine; for heavier OCR, run one worker process locally. No separate server. |
| **Shared reference data** | **Local file** (e.g. JSON/SQLite) or **in-memory** | No RAG service required for MVP; static lookup or small SQLite DB. |
| **Startup** | **Single command or two** (e.g. `npm run dev` + optional `docker compose up` for Redis/SQL Server/MinIO) | Document in quickstart.md; developer runs app and optionally 1–2 containers. |

**Constraints for MVP local demo**:

- No dependency on a remote server or cloud account.
- All services (DB, queue, blob, API, frontend, workers) run on the MacBook.
- Use **Tailwind CSS** for all styling (no other CSS framework).
- Functional end-to-end: upload → classify → OCR → view results; dashboard and workflow editor usable for demo.

**When moving off the laptop**: Same codebase; swap SQLite → SQL Server, local blob → Azure Blob/S3, local Redis → managed Redis or Azure Service Bus; deploy API and workers to cloud. See §10 for production-style DevOps.

---

## 10. DevOps and cloud (post-MVP)

| Item | Choice | Notes |
|------|--------|--------|
| **Runtime** | Simple first (e.g. **Docker Compose** or single-node); cloud when ready | Per stakeholder decision #10. |
| **Cloud (when used)** | **Azure** (natural fit for SQL Server, Blob, API Management) or **AWS** / **GCP** | Prefer Azure if SQL Server and Azure SQL are standard. |
| **CI/CD** | **GitHub Actions** or **Azure DevOps** or **GitLab CI** | Build, test, deploy; run contract and integration tests. |
| **Secrets** | Environment variables or **Azure Key Vault** / **AWS Secrets Manager** | No secrets in repo. |

---

## 11. Summary stack diagram

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│  Clients (browser, API clients)                                             │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Central API layer (Next.js API routes or ASP.NET Core API)                 │
│  Auth, tenant context, versioning, routing                                  │
└─────────────────────────────────────────────────────────────────────────────┘
         │                    │                    │                    │
         ▼                    ▼                    ▼                    ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│ Rules API    │    │ Document/Job │    │ Workers      │    │ Shared ref   │
│ (workflow,   │    │ API          │    │ (queue)      │    │ data (RAG    │
│  business    │    │              │    │              │    │  or similar) │
│  rules)      │    │              │    │              │    │              │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘    └──────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  SQL Server (Customer, User, Document, Page, Job, OCRResult, Workflow,      │
│  AuditEvent, rules)                                                         │
└─────────────────────────────────────────────────────────────────────────────┘
       │                   │
       │                   ▼
       │            ┌──────────────┐
       │            │ Object       │
       │            │ storage      │
       │            │ (per customer)│
       │            └──────────────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Frontend: React + Next.js (as needed) + Tailwind CSS                        │
│  Dashboard, workflow editor, upload, job list, view/download                │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 12. Document references

- **Product and behaviour**: [spec.md](./spec.md)
- **Architecture**: [architecture.md](./architecture.md)
- **Data model**: [data-model.md](./data-model.md)
- **Research and decisions**: [research.md](./research.md)
- **API contracts**: [contracts/](./contracts/)
- **Tasks**: [tasks.md](./tasks.md)
