# Plan: Web 3.0 DocRoom Strategy & Blockchain-Ready MVP

## Context

After analyzing DocRoom (enterprise document management system from Soluz.io Doma 7.4), we've designed a 30-month roadmap to evolve Stella POC into a Web 3.0 decentralized document management system using **Approach 1: Hybrid Public/Private Architecture** (blockchain + IPFS with encryption).

**Current State:** Stella POC is a local MVP for document OCR processing with workflow editor, classification, and human review.

**30-Month Vision:** Stella Web 3.0 DocRoom - enterprise-grade decentralized document management with:
- Decentralized storage (IPFS)
- Blockchain-based access control & audit trail (Ethereum L2/Polygon)
- True data ownership for enterprises
- Immutable compliance records

This plan documents the roadmap and identifies blockchain-ready features to build into the current MVP.

---

## Product Roadmap: Stella POC → Web 3.0 DocRoom (30 Months)

### **Phase 1: MVP Launch & Market Validation (Months 1-6)**

**Objective:** Get paying customers, validate product-market fit

**Key Activities:**
- Complete Stella MVP features (OCR, workflow editor, job queue)
- Deploy to cloud (AWS/Azure)
- Traditional centralized architecture (PostgreSQL, S3)
- Build REST API with abstraction layers (blockchain-ready interfaces)
- Basic document management features

**Blockchain-Ready Architecture:**
```
[Frontend] → [API Layer with Interfaces] → [Storage Provider (SQL/S3)]
                                         → [Auth Provider (JWT)]
                                         → [Audit Provider (SQL)]
```

**Success Criteria:**
- 5-10 paying customers
- Document processing pipeline validated
- API abstraction layer in place for future blockchain swap

---

### **Phase 2: Enterprise Document Management (Months 7-12)**

**Objective:** Build traditional DMS features that map to Web 3.0 concepts

**Features Added (DocRoom-inspired):**
- 📁 Hierarchical folder structure → *Maps to: Smart contract folder ownership*
- 🔍 Advanced search & metadata → *Maps to: Decentralized indexing*
- 👥 Access control (ACLs) → *Maps to: On-chain permissions*
- 📝 Version control (check-in/check-out) → *Maps to: Immutable blockchain history*
- 💬 Collaboration (comments, linking) → *Maps to: Cryptographically signed interactions*
- 📊 Audit trail → *Maps to: On-chain audit log*

**Strategic Preparations:**
- Every document gets content hash (SHA-256) - stored but unused
- Audit logs are append-only (blockchain-like structure)
- Permissions stored in structured format compatible with smart contracts

---

### **Phase 3: Blockchain Research & Pilot (Months 13-18)**

**Objective:** Prove blockchain integration, build technical foundation

**Parallel Tracks:**
1. Production system continues (traditional stack)
2. R&D builds blockchain prototype

**Blockchain Development:**
- Smart contracts (access control, version control, audit trail)
- IPFS integration with encryption (AES-256)
- Wallet integration (enterprise SSO → wallet mapping)
- Testnet deployment (Polygon Mumbai)

**Pilot Program:**
- 2-3 early adopter customers
- Gather UX feedback on wallet interaction
- Validate compliance concerns

---

### **Phase 4: Hybrid Architecture Rollout (Months 19-24)**

**Objective:** Launch Web 3.0 features, offer customer choice

**Dual-Mode Architecture:**
- Traditional storage mode (PostgreSQL + S3)
- Web 3.0 mode (Smart contracts + IPFS + Wallet auth)
- Same UI for both modes

**Migration Strategy:**
- Customers choose: stay traditional, opt-in to Web 3.0, or hybrid
- Web 3.0 premium pricing
- Gradual rollout: beta → general availability

**Web 3.0 Unique Features:**
- True data ownership (customers hold encryption keys)
- Immutable audit trail (blockchain-verified)
- Interoperability (third-party verification)
- No vendor lock-in

---

### **Phase 5: Full Web 3.0 Launch (Months 25-30)**

**Objective:** Market leadership in decentralized enterprise DMS

**Go-to-Market:**
- Rebrand as "Stella Web 3.0 DocRoom"
- Target: Financial services, Healthcare, Legal, Government
- Positioning: Data sovereignty + compliance advantages

**Advanced Features:**
- Cross-organization workflows (multi-party smart contracts)
- Token-gated access (NFT-based permissions)
- Zero-knowledge proofs (Phase 5.5) - prove compliance without revealing data

**Success Metrics:**
- 50%+ customers on Web 3.0 mode
- Press coverage as first enterprise Web 3.0 DMS
- Premium pricing established

---

## Blockchain-Ready Features for Current MVP

### **CRITICAL: Build These Into MVP NOW**

#### **1. API Abstraction Layer**
**Why:** Makes Phase 4 blockchain swap possible without frontend rewrite

**Interfaces to Create:**
```typescript
interface IStorageProvider {
  uploadDocument(file: File, metadata: Metadata): Promise<DocumentId>
  downloadDocument(docId: DocumentId): Promise<File>
  deleteDocument(docId: DocumentId): Promise<void>
  getDocumentHash(docId: DocumentId): Promise<string>
}

interface IAuditProvider {
  logEvent(event: AuditEvent): Promise<void>
  getAuditTrail(docId: DocumentId): Promise<AuditEvent[]>
  verifyIntegrity(docId: DocumentId): Promise<boolean>
}

interface IAuthProvider {
  authenticate(credentials: Credentials): Promise<AuthToken>
  authorize(user: User, resource: Resource, action: Action): Promise<boolean>
  getPermissions(user: User, resource: Resource): Promise<Permission[]>
}
```

**Initial Implementations:**
- `LocalFileStorage implements IStorageProvider` (MVP)
- `SQLiteAudit implements IAuditProvider` (MVP)
- `JWTAuth implements IAuthProvider` (MVP)

**Future Implementations:**
- `IPFSStorage implements IStorageProvider` (Phase 4)
- `BlockchainAudit implements IAuditProvider` (Phase 4)
- `WalletAuth implements IAuthProvider` (Phase 4)

---

#### **2. Content Hash for Every Document**
**Why:** Required for blockchain verification and IPFS addressing

**Database Schema Addition:**
```sql
ALTER TABLE documents ADD COLUMN content_hash VARCHAR(64); -- SHA-256
ALTER TABLE documents ADD COLUMN metadata_hash VARCHAR(64); -- For metadata integrity
```

**Implementation:**
- Calculate SHA-256 hash on upload
- Store in database (unused in MVP, critical in Phase 4)
- Function: `calculateContentHash(file: File): string`

---

#### **3. Append-Only Audit Log**
**Why:** Mirrors blockchain immutability, easy to migrate later

**Database Design:**
```sql
CREATE TABLE audit_events (
  id UUID PRIMARY KEY,
  document_id UUID,
  event_type VARCHAR(50), -- upload, download, edit, delete, share
  actor_id UUID,
  timestamp TIMESTAMP,
  event_data JSONB, -- Flexible for future blockchain fields
  previous_event_id UUID, -- Chain events together
  content_hash VARCHAR(64) -- Hash of event data for integrity
);
```

**Rules:**
- NEVER UPDATE or DELETE audit events
- Only INSERT allowed
- Chain events via `previous_event_id`

---

#### **4. Structured Permissions (ACL-Ready)**
**Why:** Maps directly to smart contract access control

**Database Design:**
```sql
CREATE TABLE permissions (
  id UUID PRIMARY KEY,
  resource_id UUID, -- document or folder
  resource_type VARCHAR(20), -- 'document' or 'folder'
  principal_id UUID, -- user, group, or role
  principal_type VARCHAR(20), -- 'user', 'group', 'role'
  action VARCHAR(50), -- 'read', 'write', 'delete', 'share', 'admin'
  granted BOOLEAN, -- true = allow, false = deny
  created_at TIMESTAMP,
  created_by UUID
);
```

**Smart Contract Mapping:**
```solidity
// Future smart contract structure (Phase 3-4)
struct AccessRule {
  bytes32 resourceId;
  address principal;
  string action;
  bool granted;
}
```

---

#### **5. Version Control Schema**
**Why:** Blockchain will store version metadata, need compatible structure

**Database Design:**
```sql
CREATE TABLE document_versions (
  version_id UUID PRIMARY KEY,
  document_id UUID,
  version_number INT,
  content_hash VARCHAR(64), -- SHA-256 of this version
  previous_version_id UUID, -- Link to previous version
  created_at TIMESTAMP,
  created_by UUID,
  change_description TEXT,
  is_current BOOLEAN
);
```

**Blockchain Mapping:**
- Each version gets unique `content_hash`
- `previous_version_id` creates immutable chain
- In Phase 4: store version metadata on blockchain, content on IPFS

---

#### **6. Metadata in Structured JSON Format**
**Why:** Easier to encrypt and store on blockchain later

**Implementation:**
```typescript
interface DocumentMetadata {
  title: string
  author: string
  createdAt: string // ISO 8601
  modifiedAt: string
  tags: string[]
  classification: string // handwritten | machine-printed | mixed
  customFields: Record<string, any>
}
```

**Storage:**
- Store as JSONB in PostgreSQL (MVP)
- In Phase 4: encrypt JSON, store on IPFS, hash on blockchain

---

## Todo List: Blockchain-Ready MVP Features

### **High Priority (Build in Next Sprint)**
- [ ] Create `IStorageProvider` interface and `LocalFileStorage` implementation
- [ ] Create `IAuditProvider` interface and `SQLiteAudit` implementation
- [ ] Create `IAuthProvider` interface and `JWTAuth` implementation
- [ ] Add `content_hash` column to documents table
- [ ] Implement `calculateContentHash()` function (SHA-256)
- [ ] Design append-only `audit_events` table
- [ ] Implement audit event chaining (previous_event_id)

### **Medium Priority (Within 2 Sprints)**
- [ ] Create structured `permissions` table (ACL schema)
- [ ] Implement permission checking via `IAuthProvider`
- [ ] Create `document_versions` table with hash chaining
- [ ] Store document metadata as JSONB format
- [ ] Add metadata hash calculation
- [ ] Document API abstraction patterns in code comments

### **Documentation Tasks**
- [ ] Create `/docs/architecture/blockchain-ready-design.md`
- [ ] Document interface contracts (IStorageProvider, IAuditProvider, IAuthProvider)
- [ ] Create migration guide: "Traditional → Web 3.0"
- [ ] Add Web 3.0 roadmap to `/docs/roadmap/web3-evolution.md`
- [ ] Update README with long-term vision

### **Research Track (Parallel, Low Priority for MVP)**
- [ ] Research smart contract platforms (Polygon vs Arbitrum vs Optimism)
- [ ] Prototype IPFS upload/download
- [ ] Test wallet integration (MetaMask, WalletConnect)
- [ ] Estimate gas costs for access control operations
- [ ] Identify IPFS pinning service (Pinata vs Infura)

---

## Critical Files to Create (Documentation Only)

### **1. `/docs/roadmap/web3-evolution.md`**
Full 30-month roadmap (Phases 1-5 detailed)

### **2. `/docs/architecture/blockchain-ready-design.md`**
- API abstraction layer patterns
- Interface definitions
- Traditional vs Web 3.0 implementation comparison
- Migration strategy

### **3. `/docs/reference/docroom-features-analysis.md`**
Summary of DocRoom features from Chapter 5 and how they map to Web 3.0 concepts

### **4. `/docs/architecture/smart-contract-spec.md`** (Phase 3)
- Access control contract
- Version control contract
- Audit trail contract

---

## Success Criteria

### **MVP (Phase 1 - Now)**
✅ API abstraction layer in place
✅ Content hashing implemented
✅ Append-only audit log
✅ Structured permissions schema
✅ Documentation created

### **Blockchain-Ready (Phase 2 - Month 12)**
✅ All DocRoom core features implemented (folders, search, ACLs, versions)
✅ Data models map 1:1 to blockchain concepts
✅ Test suite covers abstraction layer

### **Web 3.0 Launch (Phase 5 - Month 30)**
✅ Dual-mode architecture working
✅ First 10+ customers on Web 3.0 mode
✅ Smart contracts audited and deployed
✅ Market positioning as Web 3.0 leader

---

## Key Strategic Principles

1. **Incremental Migration** - No big bang, run both systems in parallel
2. **API-First Design** - Abstract now, swap implementations later
3. **Preserve Customer Investment** - Same UI throughout evolution
4. **Build What You Can Sell** - Revenue in Phase 1-2 funds Phase 3-4 development
5. **Compliance-First** - Position Web 3.0 as compliance advantage

---

## Current MVP Status (As of Feb 12, 2026)

### ✅ Completed Features
- **Quick Start Wizard** (Steps 1-7) - Fully implemented ✅
  - Company Info, Choose Template, Document Types, Validation Rules, Volume Estimate, Output Format, Review & Accept
  - State management, save/resume, cross-step data flow
  - 10 new files (6 UI components + 4 Step components)
- **LoginPage** - Complete ✅
- **DashboardPage** - Implemented with mock data (stats, job list, per-customer breakdown) ✅
- **UI Components Library** - 14 reusable primitives ✅
- **Navigation** - Complete ✅
- **Storage Utility** - workflowStorage.ts for localStorage persistence ✅

### ❌ Missing Critical Features for Phase 1 MVP

**🚨 TOP PRIORITY (per MVP_REQUIREMENTS.md):**
1. ❌ **Workflow Editor** - Visual canvas with React Flow (6 node types)
   - **This is CRITICAL and should be built first to validate UX/UI**
   - WorkflowsPage currently just a stub
   - Required features:
     - Drag-drop node-based interface
     - 6 node types: Classification, OCR, Validation, Human Review, Data Extraction, Export
     - Save/load workflows to database
     - 3 pre-built templates (Basic Invoice, Mixed Document, Healthcare Form)

**High Priority:**
2. ❌ **Database Schema** - Prisma + SQLite setup
   - Customer, User, Document, Page, Job, OCRResult, Workflow, AuditEvent tables
3. ❌ **Document Upload** - Upload functionality + classification
4. ❌ **OCR Processing Pipeline** - Upload → classify → OCR → results
   - BullMQ + Redis job queue
   - Background processing
   - Simulated OCR (artificial delay for demo)
5. ❌ **Job List Page** - JobsPage with filtering (status, customer, date)
6. ❌ **Human Review Interface** - Dedicated page for reviewing flagged documents

**Medium Priority:**
7. ❌ **Documents Page** - View/manage processed documents
8. ❌ **Settings Page** - User preferences
9. ❌ **Mockup Screens** - AI Agent Dashboard, Industry Template Library, etc.

---

## Phase 1 MVP Todo List (Prioritized)

### 🎯 Sprint 1: Workflow Editor + Database Foundation (Week 1-2)

**Critical Path:**
- [ ] **Set up Prisma + SQLite database**
  - [ ] Create schema.prisma with all 8 entities
  - [ ] Add blockchain-ready fields (content_hash, metadata_hash) to Document table
  - [ ] Create append-only audit_events table with chaining
  - [ ] Run prisma generate + prisma migrate
  - [ ] Seed database with mock data (3 customers, 3 workflows, jobs in all states)

- [ ] **Build Workflow Editor (WorkflowsPage)**
  - [ ] Install and configure React Flow
  - [ ] Create 6 custom node components (Classification, OCR, Validation, Human Review, Data Extraction, Export)
  - [ ] Build node configuration panels (form-based settings)
  - [ ] Implement drag-drop canvas
  - [ ] Save workflow to database (workflow.definition as JSON)
  - [ ] Load workflow from database
  - [ ] Create 3 pre-built template workflows
  - [ ] Add validation/preview button

**Blockchain-Ready Implementation:**
- [ ] **Create API abstraction layer**
  - [ ] Define IStorageProvider interface
  - [ ] Define IAuditProvider interface
  - [ ] Define IAuthProvider interface
  - [ ] Implement LocalFileStorage (MVP implementation)
  - [ ] Implement SQLiteAudit (MVP implementation)
  - [ ] Implement JWTAuth (MVP implementation)

---

### 🎯 Sprint 2: Document Processing Pipeline (Week 3)

- [ ] **Document Upload Functionality**
  - [ ] Upload API endpoint (POST /api/upload)
  - [ ] File storage in data/customers/{id}/drop-off/
  - [ ] Classification via folder structure
  - [ ] Create Document + Page records in database
  - [ ] Calculate and store content_hash (SHA-256) for each document

- [ ] **Job Queue Setup**
  - [ ] Install BullMQ + Redis
  - [ ] Create job queue workers
  - [ ] Implement simulated OCR processing (artificial 2-3s delay)
  - [ ] Store OCRResult records
  - [ ] Update Job status (queued → processing → completed/failed)
  - [ ] Log all events to append-only audit_events table

- [ ] **Job List Page (JobsPage)**
  - [ ] Fetch jobs from database
  - [ ] Display job list with status badges
  - [ ] Filters: status, customer, date range
  - [ ] Real-time updates (polling every 2 seconds)
  - [ ] Click job to view details

---

### 🎯 Sprint 3: Human Review + Output (Week 4)

- [ ] **Human Review Interface**
  - [ ] Create ReviewPage component
  - [ ] Display 1 sample document with errors
  - [ ] Show 3 error types: OCR errors, missing fields, validation failures
  - [ ] Edit extracted text
  - [ ] Approve/reject actions
  - [ ] Add comments

- [ ] **Documents Page**
  - [ ] List processed documents
  - [ ] View document details
  - [ ] Download JSON/CSV export
  - [ ] Search/filter documents

- [ ] **Output Format**
  - [ ] Generate JSON output to pickup folder
  - [ ] Generate CSV export
  - [ ] Download functionality

---

### 🎯 Sprint 4: Polish + Testing (Week 5)

- [ ] **Integration Testing**
  - [ ] End-to-end workflow: Upload → Process → Review → Download
  - [ ] Test all 3 workflow templates
  - [ ] Test save/resume functionality
  - [ ] Test real-time progress updates

- [ ] **Documentation**
  - [ ] Create `/docs/architecture/blockchain-ready-design.md`
  - [ ] Create `/docs/roadmap/web3-evolution.md`
  - [ ] Create `/docs/reference/docroom-features-analysis.md`
  - [ ] Update README with setup instructions
  - [ ] Add quickstart guide

- [ ] **Setup Scripts**
  - [ ] Check/start Ollama script
  - [ ] Check/start Redis script
  - [ ] Database migration script
  - [ ] Seed data script
  - [ ] All-in-one startup script

---

## Critical Files That Need Blockchain-Ready Features

### Database Schema (schema.prisma)
```prisma
model Document {
  id             String   @id @default(uuid())
  customerId     String
  storagePath    String
  format         String
  size           Int
  contentHash    String?  // SHA-256 - BLOCKCHAIN-READY ✅
  metadataHash   String?  // BLOCKCHAIN-READY ✅
  createdAt      DateTime @default(now())
  retentionUntil DateTime?

  customer Customer @relation(fields: [customerId], references: [id])
  pages    Page[]
  jobs     Job[]
}

model AuditEvent {
  id              String   @id @default(uuid())
  documentId      String?
  jobId           String?
  eventType       String   // upload, download, edit, delete, share
  actorId         String
  timestamp       DateTime @default(now())
  eventData       Json     // Flexible for blockchain fields
  previousEventId String?  // Chain events - BLOCKCHAIN-READY ✅
  contentHash     String   // Hash of event data - BLOCKCHAIN-READY ✅

  document      Document?   @relation(fields: [documentId], references: [id])
  job           Job?        @relation(fields: [jobId], references: [id])
  previousEvent AuditEvent? @relation("EventChain", fields: [previousEventId], references: [id])
  nextEvent     AuditEvent? @relation("EventChain")
}

model Permission {
  id           String   @id @default(uuid())
  resourceId   String
  resourceType String   // 'document' or 'folder'
  principalId  String
  principalType String  // 'user', 'group', 'role'
  action       String   // 'read', 'write', 'delete', 'share', 'admin'
  granted      Boolean  // true = allow, false = deny
  createdAt    DateTime @default(now())
  createdBy    String
}

model DocumentVersion {
  versionId          String   @id @default(uuid())
  documentId         String
  versionNumber      Int
  contentHash        String   // SHA-256 - BLOCKCHAIN-READY ✅
  previousVersionId  String?  // Chain versions - BLOCKCHAIN-READY ✅
  createdAt          DateTime @default(now())
  createdBy          String
  changeDescription  String?
  isCurrent          Boolean  @default(true)

  document        Document         @relation(fields: [documentId], references: [id])
  previousVersion DocumentVersion? @relation("VersionChain", fields: [previousVersionId], references: [id])
  nextVersion     DocumentVersion? @relation("VersionChain")
}
```

---

## Notes

- **PDF Downloaded:** `/docs/reference/Soluz.io Doma 7.4 User Manual E.pdf` ✅
- **Poppler Installed:** `brew install poppler` ✅
- **DocRoom Analysis Complete:** Chapter 5 features documented ✅
- **Brainstorming Complete:** Web 3.0 architecture selected (Hybrid Approach 1) ✅
- **Yesterday's Work (Feb 11):** Quick Start Wizard Steps 4-7 completed ✅
- **Current Branch:** `claude/fix-completed-workflows-20260211-1803`
- **Next Critical Task:** Build Workflow Editor (React Flow) - TOP PRIORITY ⚠️
