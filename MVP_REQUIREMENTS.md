# Stella POC - Complete MVP Requirements & Context

## Project Overview
**Stella** is a Document OCR SaaS platform for processing mixed documents (handwritten + machine-printed). This is a **local MVP demo** running on MacBook Pro to prove the concept. If approved, the tech stack will be rebuilt for enterprise SaaS.

**Demo Scenario:** Customer uploads 50 mixed invoices → automated workflow classifies and routes to appropriate OCR engines → outputs automatically created (assuming no errors) → user can retrieve when ready → CSV export available.

---

## Tech Stack (MVP - Local MacBook Pro)

### Core Stack
- **Next.js 14** (App Router, TypeScript, monorepo)
- **Tailwind CSS** for styling
- **SQLite** database (easy local setup)
- **Prisma** ORM
- **BullMQ + Redis** (local) for job queue
- **React Flow** for workflow visual editor
- **Ollama** for OCR engines (local inference)

### Environment
- MacBook Pro M2 Max, 36GB RAM
- Node.js (check existing version, fallback to latest stable LTS)
- Development and demo on same machine

---

## Critical MVP Priorities

1. **Workflow Editor is CRITICAL** - start here to validate UX/UI
2. Upload → classify → OCR → results pipeline must work
3. Admin dashboard with real-time progress
4. Job list with filtering
5. Human review interface (basic, 1 sample document)
6. Mockup screens for advanced features (React components, not just static images)

---

## Data & Storage Structure

### Multi-Customer Setup
- **3 customers:** customer1, customer2, customer3
- **Only customer1 is fully functional** (others shown in mockups for multi-tenancy)
- Storage path: `data/customers/{customer1|customer2|customer3}/{drop-off|pickup}/`
- **Drop-off subfolders for classification:**
  - `/machine-printed/`
  - `/handwritten/`
  - `/mixed/`
- Classification works via folder structure (pre-organized for MVP)

### Database Schema (Prisma/SQLite)
**Core Entities:**
- **Customer:** id, name, retention_policy, created_at
- **User:** id, customer_id, role (admin|power_analyst), email, created_at
- **Document:** id, customer_id, storage_path, format, size, created_at, retention_until
- **Page:** id, document_id, page_index, classification (handwritten|machine-printed|mixed), category, ocr_result_id, width_px, height_px
- **Job:** id, customer_id, status (queued|processing|completed|failed|review_needed), created_at, completed_at, error_code, error_message
- **OCRResult:** id, job_id, page_id, document_id, text, engine_used, confidence, created_at
- **Workflow:** id, customer_id, name, definition (JSON), version, created_at
- **AuditEvent:** id, document_id, job_id, event_type, stage, actor_id, timestamp, payload

---

## Workflow Editor (TOP PRIORITY)

### Visual Canvas (React Flow)
- Drag-drop node-based interface
- **6 Node Types:**
  1. **Classification** (handwritten vs printed vs mixed)
  2. **OCR** (engine selection, settings)
  3. **Validation** (business rules)
  4. **Human Review** (checkpoints)
  5. **Data Extraction** (field extraction/transformation)
  6. **Export** (output formatting)

### Workflow Behavior
- **Linear flow for MVP** (no branching logic yet)
- Show branching is possible via mockup/UI hint
- **User-triggered validation** (not real-time) - button to preview/validate
- Validation shows errors/missing connections
- **Save/load workflows** to database
- **Versioning:** Show version number in UI (mockup only, not functional)

### Pre-built Templates (3 required)
1. **Basic Invoice Processing**
2. **Mixed Document Processing**
3. **Healthcare Form Processing**

### Conditional Routing (Important)
- Example logic: `IF classified as "handwritten" THEN use olmOCR 2, ELSE use LightOnOCR`
- Implemented via node configuration, not visual branching

---

## Node Configuration Panels (Form-Based)

### OCR Node Settings
- **Engine selection dropdown:** olmOCR 2, LightOnOCR, DeepSeek-OCR-2, EasyOCR
  - **Only 1 engine needs to actually work** (others can show "coming soon" or simulate)
- **Confidence threshold slider** (0-100%)
- **Language selection:** English (only one that works, others visible but disabled)

### Validation Node Settings
- **Pre-loaded sample rules** tied to document fields
- Users can **add/remove rules**
- Rule structure: Field Name → Rule Type (required|format|range) → Action (flag for review|block|warn)
- Example: Field: "Invoice Total" | Rule: "Must be numeric" | Action: "Flag for review"

### Human Review Node Settings
- **Triggers (all of the above):**
  - Confidence below threshold
  - Validation rule failure
  - Manual flag (always review this document type)

### Data Extraction Node Settings
- **Automatic extraction** with human override option
- Define fields to extract from documents
- Example: "Invoice Number (top-right), Date (header), Total (bottom-right)"

### Export Node Settings
- **Output format:** JSON (customer-specific formats later)
- Generic CSV export option

---

## Document Processing & Job Queue

### Processing Model
- **Always background processing** (BullMQ workers)
- Users don't wait for results (can close browser)
- **Only admins see real-time progress**

### Simulated Fast Processing
- Use **artificial delay** (2-3 seconds per document) to appear realistic
- Don't use actual OCR wait times (too slow for demos)
- Can use **pre-computed results** for speed

### Error Handling
- If OCR fails on a page/document:
  - **Flag for human review**
  - **Don't block other documents** (pull aside, continue processing rest)
  - Store error in Job.error_code and Job.error_message

### Output Format (JSON)
```json
{
  "document_id": "...",
  "filename": "...",
  "pages": [
    {
      "page_number": 1,
      "classification": "printed",
      "ocr_engine": "olmOCR2",
      "extracted_text": "...",
      "confidence": 0.95,
      "extracted_fields": {
        "invoice_number": "...",
        "date": "...",
        "total": "..."
      }
    }
  ]
}
```

### CSV Export Columns
- `document_id, filename, status, total_pages, extracted_text, processed_date`

---

## Admin Dashboard & Monitoring

### Real-time Progress View
- **Two panels side-by-side:**
  1. **Real-time progress bar** (current batch processing status)
  2. **Job list with live updates**
- **Update mechanism:** Polling (every 2 seconds) - simple for MVP
- **System stats displayed:**
  - Total jobs (overall)
  - Success rate (%)
  - Average processing time
  - **Per-customer breakdown:** customer1: X jobs, customer2: Y jobs, customer3: Z jobs

### Job List Filters
- **By status:** queued, processing, completed, failed, review_needed
- **By customer:** customer1, customer2, customer3
- **By date range**
- **By workflow used** (optional)

---

## Human Review Interface

### Requirements
- **Dedicated page** (not modal)
- Shows **1 sample document** demonstrating human review workflow
- **Form with max 20 fields**
- **Highlight fields needing validation**

### Display All 3 Error Types
1. **OCR errors** (wrong text extraction)
2. **Missing required fields**
3. **Validation failures** (e.g., invalid date format)

### Reviewer Actions
- View original document image
- Edit extracted text
- Approve/reject
- Add comments

---

## Pre-loaded Demo Data (Seed Script)

### Must Include
- **3 customers** (customer1 functional, customer2/customer3 for mockups)
- **3 workflow templates** (Basic Invoice, Mixed Document, Healthcare Form)
- **Jobs in all 3 states:**
  - Some **completed** (show success state)
  - Some **in-progress** (show progress bar working)
  - Some **queued** (show pending state)
- **Sample documents** in classification folders (machine-printed, handwritten, mixed)
- **Consistent, realistic data** across all entities

### Auto-run on First Startup
- Seed script should detect empty database and populate automatically
- Should be idempotent (safe to run multiple times)

---

## Mockup Screens (React Components - Separate Session)

### 1. AI Agent Dashboard
- **Recent interventions** (errors caught and auto-fixed)
- **Recommendations** (suggested workflow improvements)
- **Alerts configuration** (when to notify human)

### 2. Industry Template Library
- **4 industries shown:** Banking, Insurance, Healthcare, Police
- **Banking:** 3 templates (fully shown)
- **Others:** 1 template each
- **Workflow preview thumbnails** for each template

### 3. Quick Start Wizard
**5 steps (expandable later):**
1. Company info (name, industry)
2. Document types to process
3. Volume expectations
4. Output format preferences
5. Workflow template selection

### 4. Multi-tenancy Features
- **Customer switcher** (dropdown to switch between customers)
- **Customer management page** (list all customers with stats)
- **Per-customer isolation** (show separate data/workflows/storage)

### 5. Advanced Analytics (mockup)
- Charts/graphs showing processing volumes, accuracy trends, etc.

### 6. Language Switcher (mockup)
- Show language selector UI (English, French, Dutch, German)
- Only English functional

---

## Authentication & Users

### For MVP: Hardcoded/Stubbed
- Simple login screen (or skip entirely)
- Two roles visible: **Administrator** vs **Power Analyst**
- Admins see everything (dashboard, all customers, workflows)
- Power Analysts see limited view (their jobs only)

---

## Test Documents

### Requirements
- **Mix of document types:** invoices, forms, receipts, contracts
- **Mix of content:** printed, handwritten, mixed pages
- **Mix of page counts:** single-page and multi-page (5-10 pages)
- **Total needed:** 50+ documents for demo (user has some, need ~10 more)
- **Industries represented:** banking, healthcare, insurance (per FR-028)

### Organization
- Place in `data/customers/customer1/drop-off/{machine-printed|handwritten|mixed}/`
- Pre-tag/organize for classification via folder structure

---

## Quickstart & Setup

### Setup Scripts Required
1. **Check if Ollama is running** (don't restart if already running)
2. **Start Ollama** (if not running)
3. **Pull OCR model** (olmOCR 2 or equivalent)
4. **Start Redis** (for BullMQ)
5. **Run database migrations** (Prisma)
6. **Seed database** (pre-load demo data)
7. **Start Next.js dev server**
8. **Start BullMQ worker**

### Documentation Style
- **Very clear, step-by-step instructions**
- "10-year-old friendly" - no assumptions about technical knowledge
- **Specify which terminal window** (Cursor integrated terminal, standalone terminal, etc.)
- **Manual steps are acceptable** (don't need single-command startup)
- **Check for errors at each step** with troubleshooting tips

---

## Implementation Phases

### Phase 1: Project Setup
- Initialize Next.js 14 + TypeScript + Tailwind
- Setup Prisma + SQLite schema
- Setup BullMQ + Redis connection
- Create folder structure (`data/customers/{1,2,3}/{drop-off,pickup}/{machine-printed,handwritten,mixed}/`)
- Basic routing and layout

### Phase 2: Workflow Editor ⭐ **START HERE**
- Integrate React Flow
- Create 6 node types with custom styling
- Build configuration panels (form-based)
- Implement save/load workflow to DB
- Add validation/preview functionality
- Create 3 pre-built templates
- Show version number (mockup)

### Phase 3: Document Processing
- Upload API + UI
- Background job queue (BullMQ workers)
- Simulated OCR processing (artificial delay)
- Job status tracking
- Results storage (JSON output to `/pickup/`)

### Phase 4: Admin & Monitoring
- Admin progress dashboard (real-time polling updates)
- Job list with filters
- Human review interface (dedicated page)
- CSV export functionality

### Phase 5: Mockup Components (NEW SESSION)
- AI Agent dashboard (React components with fake data)
- Industry template library
- Quick Start wizard (multi-step form)
- Advanced analytics
- Multi-tenancy features
- Language switcher

### Phase 6: Testing & Polish
- Database seed script (auto-run)
- Test documents preparation (10+ documents)
- Quickstart documentation (step-by-step)
- Setup scripts (Ollama, Redis, etc.)
- End-to-end testing

---

## Key Technical Decisions Summary

| Decision Point | Choice | Reason |
|----------------|--------|--------|
| **Database** | SQLite | Local demo, zero config |
| **Queue** | BullMQ + Redis | Best for Node.js, local Redis easy |
| **Frontend Framework** | Next.js 14 (App Router) | Monorepo, modern, TypeScript |
| **Workflow Editor** | React Flow | Proven for node-based UIs |
| **OCR Engine** | Ollama (olmOCR 2 primary) | Local-only, Mac compatible |
| **Processing Speed** | Simulated (artificial delay) | Real OCR too slow for demos |
| **Real-time Updates** | Polling (2 sec interval) | Simplest for MVP |
| **Auth** | Hardcoded/stubbed | Not needed for local demo |
| **Multi-customer** | 1 real, 2 mockup | Reduce complexity, show capability |
| **Workflow Logic** | Linear (show branching in mockup) | Simplify MVP implementation |
| **Output Format** | JSON (generic CSV export) | Customer-specific later |

---

## What NOT to Build (Defer or Mockup Only)

- ❌ Actual workflow versioning/rollback (just show version number)
- ❌ Branching workflow logic (linear only, show mockup)
- ❌ Multiple working OCR engines (only 1 needs to work)
- ❌ Real multi-tenancy (show 1 customer, mockup others)
- ❌ Advanced AI agent (mockup only)
- ❌ Industry-specific templates (mockup 4 industries, only basic ones work)
- ❌ Full Quick Start wizard (mockup flow)
- ❌ Multi-language support (mockup switcher, English only)
- ❌ Real authentication (hardcode/stub)
- ❌ Cloud deployment (local only)

---

## Success Criteria (Demo Ready)

### Must Work
✅ Workflow editor (drag-drop, configure, save, load)
✅ Upload 50 documents
✅ Background processing with progress tracking
✅ Job list with filtering
✅ View OCR results (JSON + CSV export)
✅ Human review interface (1 sample document)
✅ Pre-loaded demo data (3 states: completed, in-progress, queued)

### Must Show (Mockups)
✅ AI Agent dashboard
✅ Industry template library (4 industries)
✅ Quick Start wizard (5 steps)
✅ Multi-tenancy features
✅ Advanced analytics
✅ Workflow versioning (version number visible)
✅ Branching workflows (UI hint that it's possible)

---

## Notes for Implementation

- **Start with Workflow Editor** - it's the most critical UX piece
- **Use React components for mockups** (not static images) - reusable later
- **Seed data must be consistent** - realistic customer names, dates, volumes
- **Artificial delays** should feel natural (2-3 sec/doc)
- **Error messages** should be clear and helpful
- **UI should be polished** - this is a demo to get approval
- **Quickstart must work flawlessly** - first impression matters

---

## Repository Context

**Current State:**
- Branch: `claude/review-poc-stella-FB1U0`
- Repo: `/home/user/poc_stella`
- Existing: specs, Phase 0 OCR test scripts, sample images
- Missing: backend/, frontend/ directories (not built yet)

**Git Workflow:**
- Develop on branch `claude/review-poc-stella-FB1U0`
- Commit frequently with clear messages
- Push when complete

---

## Usage Instructions

**Copy this entire document into a new session and tell Claude:**

"Start building the Stella MVP according to these requirements in `MVP_REQUIREMENTS.md`. Begin with Phase 2 (Workflow Editor) as the top priority."
