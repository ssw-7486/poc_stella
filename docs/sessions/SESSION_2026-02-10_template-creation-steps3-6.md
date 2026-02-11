# Session: Template Creation Workflow + Quick Start Wizard Steps 3-6

**Date:** 2026-02-10
**Branch:** master
**Participants:** User, Claude Code
**Status:** Planning Complete - Ready for Implementation
**Plan File:** `/Users/stewartshum/.claude/plans/velvety-weaving-nest.md`

---

## Session Objectives

- [x] Design comprehensive Template Creation & Testing Workflow (Admin-only)
- [x] Design Quick Start Wizard Steps 3-6 (Customer-facing)
- [x] Define integration between template creation and wizard steps
- [x] Answer all architectural questions and document decisions
- [x] Create implementation plan with phases

---

## Key Decisions Made

### 1. Template Creation Workflow Architecture (NEW - Part 1 of Plan)

**Purpose:** Admin workflow to create, test, and validate document templates BEFORE customers use them in Quick Start Wizard.

**Key Features:**
- Iterative template training with accuracy tracking
- Upload samples → correct fields → test extraction → track accuracy
- Target accuracy setting (e.g., 99.5%)
- External validation via RAG (zip codes, country codes)
- Template versioning with rollback support (per FR-026)
- Full audit trail of all changes and test results

**Critical Decision:** Template creation is **separate from and precedes** Quick Start Wizard. Admin creates templates first, customer selects pre-created templates in wizard Step 3.

### 2. Quick Start Wizard Steps 3-6 Revised Design (Part 2 of Plan)

#### Step 3: Document Types (MAJOR REVISION)
**BEFORE (original idea):** Matrix of document types × file formats with checkboxes
**AFTER (revised):** Selection of **pre-created templates** from template library

**Key Change:** Step 3 now displays customer-specific templates created via Template Creation Workflow, with metadata:
- Template name, LOB, city, classification
- Fields detected, accuracy %, status
- Processing pipeline preview
- Validation: Must select at least 1 template

**UI:** Template cards with checkboxes, side panel shows selection summary

#### Step 4: Validation Rules (ENHANCED)
**Added:** External validation configuration (RAG integration)
- Pre-load validation rules from selected templates
- Global confidence threshold setting
- Enable/disable external validation per field type
- Show per-template validation rules

#### Step 5: Volume Estimate (NO CHANGES)
**Kept:** Same as original plan (dynamic LOB sections based on Step 1 input)

#### Step 6: Output Format (ENHANCED)
**Added:** Audit trail configuration section
- Always enabled (per G9, FR-009 requirements)
- Track: documents arrive, leave for processing, outputs ready, transferred to customer
- Configurable retention period (default: 90 days)

### 3. Template Integration Decisions (Item 12 - All 8 Questions Answered)

**12.1 Template Pre-fill:** ✅ **All wizard steps pre-filled from templates**
- Step 4: Pre-load validation rules from templates
- Step 5: Pre-fill volume expectations from template history
- Step 6: Pre-fill output formats from templates

**12.2 Template Modification During Wizard:** ✅ **Quick Edit creates new version**
- Templates can be edited from wizard
- Changes create new template version (preserves original)
- Full version history maintained

**12.3 Multi-Template Handling:** ✅ **All display modes**
- Combined/aggregated settings view
- Per-template configuration (select one to configure)
- Group by LOB or classification

**12.4 Template Validation in Wizard:** ✅ **All validation checks with warnings**
- Check for conflicting validation rules across templates → warning
- Check for field name collisions → warning
- Check for incompatible output formats → warning
- Only approved templates allowed

**12.5 Workflow Creation:** ✅ **20 separate workflows (one per template)**
- **CRITICAL ARCHITECTURAL DECISION**
- When wizard completes with 20 selected templates → system creates 20 independent workflows
- Each template becomes its own workflow
- Benefits: Simple to understand, easy to manage individually, independent volume tracking

**12.6 Template Testing in Wizard:** ✅ **"Test Sample" button in wizard**
- Allow template testing directly from wizard
- Upload test sample and view extraction results
- Validate template before proceeding

**12.7 Template Dependencies:** ✅ **Phase 2 (deferred, must document)**
- Cross-template field mapping
- Shared field detection
- Dependency warnings
- **Action:** Document this deferral in specs

**12.8 Save & Exit Behavior:** ✅ **All options with admin configuration**
- Default: Save template selections to localStorage (resume later)
- Option: Clear selections (start fresh next time)
- Admin configurable per customer

---

## Changes to Master Spec

**Updated Files:**
1. **WIZARD_SPEC.md** - Added Steps 3-6 specifications (see update below)
2. **Plan file** - Complete design document created
3. **Mermaid diagrams** - 5 new diagrams created (extracted to /docs/diagrams/)

**New Specifications Added:**

### Step 3: Document Types (Template Selection)
- Purpose: Select pre-created document templates for workflow
- Data: selectedTemplateIds, documentTemplates
- UI: Template cards with metadata (LOB, city, classification, accuracy, fields)
- Side Panel: Selection summary, average accuracy, total fields
- Validation: At least 1 template must be selected
- Summary: "Types: X templates, Avg accuracy Y%"

### Step 4: Validation Rules
- Purpose: Configure validation rules and external validation
- Data: enableValidation, templateValidation (per-template), globalSettings
- UI: Accordion with per-template rules, global settings, RAG configuration
- Side Panel: Total rules, required fields, external validations count
- Summary: "Validation: X rules, Y required fields, RAG enabled/disabled"

### Step 5: Volume Estimate
- Purpose: Estimate processing volume per LOB
- Data: volumeByLOB (dynamic based on Step 1 linesOfBusiness)
- UI: Dynamic LOB sections with volume inputs
- Side Panel: Total estimated volume across all LOBs
- Summary: "Volume: X docs/month across Y LOBs"

### Step 6: Output Format
- Purpose: Define output formats and delivery method
- Data: outputFormats, selectedFormats, auditTrail (always enabled)
- UI: Format selection, delivery config, audit trail section (read-only)
- Side Panel: Selected formats, delivery method, audit status
- Summary: "Output: JSON + CSV, Daily pickup, Audit enabled"

### Step 7: Review & Accept (Enhanced)
- Added: Template summary section showing all selected templates with accuracy
- Format: "Selected X templates: • Template A - Classification - Accuracy%"

---

## Files Created

### Documentation
1. **SESSION_2026-02-10_template-creation-steps3-6.md** (this file)
2. **velvety-weaving-nest.md** (comprehensive plan file)

### Mermaid Diagrams (to be extracted to /docs/diagrams/)
1. **template-creation-high-level-flow.md** - Complete template creation process
2. **template-field-detection-sequence.md** - Field identification & correction loop
3. **template-accuracy-tracking-flow.md** - Accuracy calculation & learning loop
4. **template-external-validation-flow.md** - RAG integration for external validation
5. **step3-user-interaction-flow.md** - Step 3 user journey with all actions

---

## Files Modified

**To be updated in implementation:**
1. **WIZARD_SPEC.md** - Replace Step 3-6 placeholders with full specifications
2. **WizardLayout.tsx** - Update STEP_NAMES from 6 to 7 steps (added Review & Accept)
3. **workflowStorage.ts** - Add step3Data, step4Data, step5Data, step6Data interfaces

---

## Next Steps

### Phase 0: OCR Validation (BLOCKING - Must Complete First)
**Estimated:** 2-4 hours
**Status:** Not started
**Blocker:** Cannot proceed with template creation until OCR validated

**Tasks:**
1. Install Ollama on MacBook Pro
2. Download olmOCR 2 model
3. Test with sample printed document (measure accuracy, latency)
4. Test with sample handwritten document (measure accuracy, latency)
5. Document results in `/docs/ocr-test-results.md`
6. Get user approval before proceeding to Phase 1

**Success Criteria:**
- olmOCR 2 runs successfully
- Latency < 5 seconds per page for printed
- Latency < 10 seconds per page for handwritten
- Accuracy visually acceptable (spot-check)

### Phase 1: Template Creation Workflow (Admin-Only)
**Estimated:** 20-24 hours
**Status:** Planned, awaiting Phase 0 completion

**Backend Files to Create:**
- `/backend/api/templates.py` - Template CRUD
- `/backend/api/samples.py` - Sample upload and testing
- `/backend/api/fields.py` - Field management
- `/backend/api/validation.py` - External validation (RAG integration)
- `/backend/services/ocr_service.py` - OCR engine wrapper
- `/backend/services/field_detection.py` - Field boundary detection
- `/backend/services/accuracy_calculator.py` - Accuracy metrics
- `/backend/services/rag_service.py` - RAG integration for external validation

**Frontend Files to Create:**
- `/frontend/src/pages/admin/TemplatesPage.tsx` - Template dashboard
- `/frontend/src/pages/admin/TemplateCreatePage.tsx` - Template creation wizard
- `/frontend/src/pages/admin/TemplateTestPage.tsx` - Testing interface
- `/frontend/src/pages/admin/TemplateAccuracyPage.tsx` - Accuracy dashboard
- `/frontend/src/pages/admin/TemplateAuditPage.tsx` - Audit trail
- `/frontend/src/components/templates/TemplateCard.tsx` - Template display card
- `/frontend/src/components/templates/FieldEditor.tsx` - Field configuration
- `/frontend/src/components/templates/BoundingBoxEditor.tsx` - Visual field boundaries
- `/frontend/src/components/templates/AccuracyChart.tsx` - Accuracy visualization
- `/frontend/src/components/templates/CorrectionForm.tsx` - Field correction UI
- `/frontend/src/components/templates/TestResultTable.tsx` - Test results display
- `/frontend/src/types/template.ts` - All template-related interfaces
- `/frontend/src/utils/templateStorage.ts` - Template persistence
- `/frontend/src/utils/accuracyCalculator.ts` - Client-side accuracy calculations
- `/frontend/src/utils/ragClient.ts` - RAG API client

### Phase 2: Quick Start Wizard Steps 3-6 (Customer-Facing)
**Estimated:** 12-16 hours
**Status:** Planned, depends on Phase 1

**Files to Create:**
- `/frontend/src/components/wizard/Step3DocumentTypes.tsx` (revised)
- `/frontend/src/components/wizard/Step4ValidationRules.tsx` (enhanced)
- `/frontend/src/components/wizard/Step5VolumeEstimate.tsx` (same as plan)
- `/frontend/src/components/wizard/Step6OutputFormat.tsx` (enhanced with audit)
- `/frontend/src/components/wizard/Step7ReviewAccept.tsx` (enhanced with template summary)
- `/frontend/src/utils/compliancePolicies.ts` - Policy content by country
- `/frontend/src/types/wizard.ts` - Wizard type definitions

**Files to Modify:**
- `/frontend/src/pages/QuickStartPage.tsx` - Add steps 3-7 state and handlers
- `/frontend/src/utils/workflowStorage.ts` - Add step3-7Data interfaces
- `/frontend/src/components/wizard/WizardLayout.tsx` - Update STEP_NAMES to 7 steps
- `/frontend/src/components/wizard/Step2TemplateSelection.tsx` - Add Traffic Violations template

### Phase 3: Integration & Testing
**Estimated:** 8-12 hours

**Tasks:**
1. Connect Template Creation → Quick Start Wizard Step 3
2. Implement template pre-fill logic for Steps 4-6
3. Test end-to-end workflow: Admin creates templates → Customer runs wizard → Workflow created
4. Implement workflow versioning and rollback (per FR-026)
5. Test external validation (RAG integration)
6. Full accuracy tracking validation

---

## Alternatives Considered

### Step 3 Design Evolution

**Option A: Matrix Selection (Original Idea)** ❌
- Description: 7 document types × 5 file formats = 35 checkboxes
- Pros: Simple, visual
- Cons: No template reuse, no accuracy tracking, no field definitions
- Rejected: Does not support iterative template training or accuracy goals

**Option B: Template Library Selection (SELECTED)** ✅
- Description: Select pre-created templates with metadata
- Pros: Reusable templates, accuracy tracking, field definitions included, admin can improve templates over time
- Cons: Requires template creation workflow first (adds complexity)
- Selected: Aligns with FR-014 (testable workflows), FR-026 (versioning), FR-027 (test info collection)

### Workflow Creation Model (12.5 Decision)

**Option A: One Workflow with Array of Templates** ❌
- Create single workflow containing references to all 20 templates
- Rejected: Complex to manage, harder to pause/modify individual document types

**Option B: 20 Separate Workflows (SELECTED)** ✅
- Create 20 independent workflows (one per template)
- Selected: Simple to understand, easy to manage individually, independent volume tracking

**Option C: Grouped Workflows by LOB** ❌
- Create one workflow per LOB (e.g., "Traffic Enforcement" with 15 templates)
- Rejected: Still complex, less flexibility than separate workflows

**Option D: Admin Chooses at Step 7** ❌
- Let admin decide workflow structure at completion
- Rejected: Adds complexity to wizard, most users won't understand trade-offs

---

## Open Questions

**All critical questions answered.** No blocking issues remain.

**Deferred to Phase 2 (Documented):**
1. Template dependencies and cross-template field mapping (Item 12.7)
2. Bulk selection controls for templates (Gap #4 - LOW PRIORITY)
3. Template comparison feature (Gap #5 - LOW PRIORITY)
4. Accuracy trend sparklines (Gap #7 - LOW PRIORITY)

**Resolved Questions:**
- Q1: Workflow definition schema → JSON with JSON Schema validation (recommended)
- Q2: Field detection method → Hybrid (auto-detect + manual refinement) for MVP
- Q3: RAG system → SQLite with lookup tables for MVP, upgrade to vector store in production
- Q4: Accuracy calculation → `(correct_fields / total_expected_fields) * 100`
- Q5: Versioning scheme → Semantic versioning (major.minor.patch)
- Q6: Testing required before activation → Yes, must meet target accuracy
- Q7: Audit log retention → 90 days default (configurable per customer)
- Q8: Templates shareable across customers → Yes, with "clone and customize" workflow
- Q9: RAG unavailable handling → Local cache fallback + retry logic

---

## Technical Notes

### Data Structures Summary

**Template Creation:**
```typescript
interface DocumentTemplate {
  id: string;
  customerId: string;
  name: string;
  documentType: string;
  classification: 'machine-printed' | 'handwritten' | 'mixed';
  version: string; // Semantic versioning
  status: 'draft' | 'testing' | 'pending_approval' | 'approved' | 'active' | 'archived';
  fields: DocumentField[];
  targetAccuracy: number;
  testResults: TemplateTestResult[];
  accuracy: { overall: number; perField: Record<string, number>; trend: number[] };
  sampleDocuments: string[];
}
```

**Wizard Steps 3-6:**
```typescript
interface Step3Data {
  selectedTemplateIds: string[];
  documentTemplates: DocumentTemplate[];
}

interface Step4Data {
  enableValidation: boolean;
  templateValidation: Record<string, ValidationConfig>;
  globalSettings: { confidenceThreshold: number; enableExternalValidation: boolean };
}

interface Step5Data {
  volumeByLOB: Record<string, VolumeEstimate>;
}

interface Step6Data {
  outputFormats: OutputFormatConfig;
  selectedFormats: ('json' | 'csv')[];
  auditTrail: { enabled: true; events: AuditEventConfig[]; retentionDays: number };
}
```

### API Endpoints Summary

**Template Creation:**
- `POST /api/templates` - Create new template
- `POST /api/templates/:id/samples` - Upload test sample
- `POST /api/templates/:id/fields/:fieldId/correct` - Correct field value
- `GET /api/templates/:id/accuracy` - Get accuracy metrics
- `POST /api/templates/:id/approve` - Approve template (mark active)
- `POST /api/templates/:id/version` - Create new version
- `POST /api/validate/:type` - Validate field against external list (RAG)

**Wizard Integration:**
- `GET /api/customers/:id/templates` - Get customer templates for Step 3
- Existing wizard endpoints remain unchanged

---

## Requirements Alignment

All requirements from comprehensive specs review are addressed:

| Requirement | Plan Section | Status |
|-------------|-------------|--------|
| FR-014: Workflow testing from any step | Part 1, Template Creation | ✅ Designed |
| FR-014: Visual workflow mapping | Part 1, Mermaid diagrams | ✅ Included |
| FR-026: Workflow versioning with rollback | Part 1, Template versioning | ✅ Designed |
| FR-027: Quick Start collects test info | Part 2, Step 3 templates | ✅ Designed |
| FR-028: Industry sector templates | Part 2, Step 2 templates | ✅ Referenced |
| FR-024: Shared reference data (RAG) | Part 1, External validation | ✅ Designed |
| G9, FR-009: Audit trail | Part 2, Step 6 audit config | ✅ Designed |
| Constitution: 99.9% OCR accuracy target | Part 1, Target accuracy setting | ✅ Designed |

---

## Success Criteria

**Planning Phase (COMPLETE):**
- ✅ Template Creation Workflow fully designed
- ✅ Quick Start Wizard Steps 3-6 specifications complete
- ✅ All integration questions answered
- ✅ Implementation plan with phases documented
- ✅ Mermaid diagrams created
- ✅ Gap analysis complete

**Implementation Phase (Next):**
- [ ] Admin can create document template from samples
- [ ] Admin can test template with multiple samples
- [ ] System tracks accuracy per field and overall
- [ ] System reaches target accuracy (e.g., 99.5%)
- [ ] External validation works via RAG
- [ ] Customer selects pre-created templates in Quick Start Wizard
- [ ] Workflow includes all template references
- [ ] All specs requirements met

---

## Notes

### Critical Path
**OCR Validation → Template Creation → Quick Start Wizard → Integration → Testing**

Phase 0 (OCR validation) is **BLOCKING** - must complete before any implementation begins.

### Design Philosophy
- **Iterative accuracy improvement:** Templates improve over time with more test samples
- **Admin creates, customer uses:** Clear separation of template creation (admin) and workflow setup (customer)
- **20 separate workflows:** Simple, flexible, easy to manage
- **Always-on audit trail:** Required per G9, non-negotiable
- **External validation:** RAG integration for data quality (zip codes, country codes)

### User Workflow Summary
1. **Admin:** Create 20 document templates via Template Creation Workflow
2. **Admin:** Test each template until accuracy meets target (99.5%)
3. **Admin:** Approve templates (status = Active)
4. **Customer:** Run Quick Start Wizard
5. **Customer:** Step 1 - Enter company info
6. **Customer:** Step 2 - Select "Traffic Violations" template
7. **Customer:** Step 3 - Select all 20 pre-created templates
8. **Customer:** Step 4 - Review/configure validation rules (pre-loaded from templates)
9. **Customer:** Step 5 - Enter volume estimates per LOB
10. **Customer:** Step 6 - Select output formats, view audit config
11. **Customer:** Step 7 - Review and accept
12. **System:** Create 20 separate workflows (one per template)
13. **Customer:** Redirect to Dashboard showing all 20 workflows

---

## Wireframe Design Session (Added 2026-02-10)

**Status:** Wireframes Complete
**Output:** 5 low-resolution wireframe markdown files + updated WIZARD_SPEC.md

### Session Overview

After completing the comprehensive plan, conducted wireframe design session to document UI layouts for Steps 3-7 with collapsible side panel pattern. All 5 wireframes created with both panel-hidden and panel-visible states.

### Wireframe Files Created

1. **[step3-document-types-collapsible-panel.md](../wireframes/step3-document-types-collapsible-panel.md)**
   - Single-column scrollable template list
   - Panel hidden: 2 cards visible
   - Panel visible: 1 card visible (70%/30% split)

2. **[step4-validation-rules-collapsible-panel.md](../wireframes/step4-validation-rules-collapsible-panel.md)**
   - Accordion pattern for per-template configuration
   - Global settings always visible
   - First template expanded by default

3. **[step5-volume-estimate-collapsible-panel.md](../wireframes/step5-volume-estimate-collapsible-panel.md)**
   - Dynamic LOB sections based on Step 1 input
   - Real-time total volume calculation
   - Optional step with skip option

4. **[step6-output-format-2column-grid.md](../wireframes/step6-output-format-2column-grid.md)**
   - 2-column grid: JSON (left) | CSV (right) when panel hidden
   - Single column when panel visible
   - Full-width Delivery and Audit sections
   - **3 design iterations** documented

5. **[step7-review-accept-single-column.md](../wireframes/step7-review-accept-single-column.md)**
   - Option 3 selected: Single-column card-style summaries
   - 6 step summary cards with [Edit] buttons
   - 4 security/privacy policy cards
   - Electronic signature field

### Global Design Patterns Established

#### 1. Global Navigation Pattern (CRITICAL CORRECTION)
**Wrong (initial attempts):**
```
│  STELLA                                           Workflow Setup                     [Cancel]  │
```

**Correct (final):**
```
│  STELLA    Dashboard    Workflows    Jobs    Documents    Settings         [🔔]  [Stewart ▼]  │
```

**Rationale:** Wizard is part of main application, NOT a standalone modal. Full app navigation must always be visible.

#### 2. Collapsible Side Panel Pattern
- **Default:** Panel hidden with [Show →] button
- **Expanded:** 70% main content + 30% side panel with [← Hide] button
- **LocalStorage:** Panel state persists per step (`wizard_step3_panel_visible`, etc.)

#### 3. Progress Bar Mandatory Format
**CRITICAL:** Must include separator line and blank line

**Correct Format:**
```
┌────────────────────────────────────────────────────────────────────┐
│  PROGRESS                                                [Show →]  │
│  ─────────────────────────────────────────────────────────────── │
│                                                                    │
│  ● 1. Company → ● 2. Template → ● 3. Types → ● 4. Validation → ..│
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

**Gotcha:** Initial Step 5 and 6 wireframes forgot separator line - corrected in final versions.

### Key Design Iterations

#### Step 6: 3 Layout Attempts
1. **Attempt 1:** OUTPUT FORMATS (left) | DELIVERY METHOD (right)
   - **Rejected:** Unrelated sections grouped together

2. **Attempt 2:** JSON + CSV together (left) | Delivery (right)
   - **Rejected:** Each format needs its own configuration space

3. **Attempt 3 (APPROVED):** JSON (left) | CSV (right), then Delivery + Audit full-width below
   - **User Feedback:** "I think we need to have everything related to 1 format together in the same column"
   - **Rationale:** Related content must be grouped; shared settings stay full-width

#### Step 7: 3 Options Evaluated
1. **Option 1:** 2-column grid for step summaries - Rejected (cramped)
2. **Option 2:** Panel visible with compact side panel - Rejected (not enough detail)
3. **Option 3 (APPROVED):** Single column with card-style summaries - Best readability

### Phase 2 Features Identified (Deferred)

**HIGH PRIORITY:**
- Template Detail Modal (View Details button in Step 3)
- Template Status Indicators with color coding
- Validation Warnings before selection
- Empty State Workflow (no templates exist)

**MEDIUM PRIORITY:**
- Filtering & Sorting controls for Step 3
- Template Preview thumbnails
- Dependency Indicators

**LOW PRIORITY:**
- Bulk Selection controls
- Template Comparison feature
- Accuracy Trend sparklines
- Template Edit/Clone actions from Step 3

### Critical Validations Required

1. **Step 5 Dynamic Sections:** LOB count must match Step 1 "No. of Lines of Business Being Processed" field
2. **Step 7 Dynamic Policies:** Policy content must be country-specific based on Step 1 Country field
3. **Step 6 Delivery Location:** Must pre-fill from Step 1 "Secure Pick-up Location (Files)" field

### Documentation Updates

- **WIZARD_SPEC.md:** Updated with Step 7 specification, changed from 6 steps to 7 steps
- **Plan File:** Updated with Part 8 documenting all wireframe work
- **Session Log:** This section added to capture wireframe session

### Data Structures Added

**Step7Data (Added to WIZARD_SPEC.md):**
```typescript
interface Step7Data {
  policiesAccepted: {
    dpa: boolean;
    sla: boolean;
    compliance: boolean;
    auditRetention: boolean;
  };
  acceptedBy: string;
  acceptedAt: string;
}
```

---

**Session Duration:** Full day session (planning + wireframes)
**Phase 0 Status:** PAUSED until Steps 3-7 specs finalized (user wants full spec before OCR validation)
**Next Steps:**
1. Review all wireframe files for consistency
2. Create high-resolution designs matching Step 1 and Step 2 style
3. Resume Phase 0 (OCR validation) once specs complete
4. Begin implementation Phase 1 (Template Creation) after OCR validated

---

**Approved By:** [Pending]
**Ready for Implementation:** Wireframes complete, awaiting high-res designs + OCR validation
**Handoff Complete:** Yes - All specs documented, 5 wireframe files created, plan file updated with Part 8, session log updated
