# Quick Start Wizard Specification

**Last Updated:** 2026-02-01
**Status:** Step 1 in design, Steps 2-6 pending
**Related Documents:**
- [DESIGN_SYSTEM.md](../../DESIGN_SYSTEM.md)
- [COLOR_ACCESSIBILITY.md](../../COLOR_ACCESSIBILITY.md)
- [Session Logs](../sessions/)

---

## Overview

The Quick Start Wizard is a 7-step onboarding flow that helps new customers set up their OCR processing workflow. The wizard collects company information, template preferences, and configuration settings, and requires policy acceptance before creating an initial workflow.

**Total Steps:** 7 (Steps 1-6 + Step 7 Review & Accept)
**Estimated Time:** 5-7 minutes
**Entry Point:** Dashboard "Quick Start" button or `/quick-start` route
**Exit Point:** Dashboard (`/dashboard`) after completion, with new workflow created

---

## Global Wizard Template

**IMPORTANT:** All wizard steps MUST use this consistent template for uniformity across the application.

### Layout Structure

```
┌────────────────────────────────────────────────────────────────────────────────┐
│  GLOBAL HEADER / MAIN NAVIGATION (always visible)                              │
│  STELLA    Dashboard  Workflows  Jobs  Documents  Settings    [Quick Start]    │
└────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────┬─────────────────────────────────────┐
│  MAIN CONTENT AREA (70%)                 │  SIDE PANEL (30%)                   │
│                                          │                                     │
│  ┌────────────────────────────────────┐  │  ┌───────────────────────────────┐  │
│  │ Step X of 6                        │  │  │  Your Progress                │  │
│  │ Progress Bar: ▓▓▓░░░ XX%           │  │  │                               │  │
│  └────────────────────────────────────┘  │  │  ● Step 1: Company Info       │  │
│                                          │  │  ○ Step 2: Choose Template    │  │
│  [Step Title]                            │  │  ○ Step 3: Document Types     │  │
│  [Step Subtitle/Helper Text]             │  │  ○ Step 4: Validation Rules   │  │
│                                          │  │  ○ Step 5: Volume Estimate    │  │
│  ┌────────────────────────────────────┐  │  │  ○ Step 6: Output Format      │  │
│  │                                    │  │  │                               │  │
│  │  [Step Content]                    │  │  │  ────────────────────────     │  │
│  │  [Form fields, selections, etc.]   │  │  │                               │  │
│  │                                    │  │  │  [Summary of entries]         │  │
│  │                                    │  │  │  [Helper content]             │  │
│  │                                    │  │  │                               │  │
│  └────────────────────────────────────┘  │  └───────────────────────────────┘  │
│                                          │                                     │
│  ┌────────────────────────────────────┐  │                                     │
│  │ FOOTER ACTIONS                     │  │                                     │
│  │ [Cancel] [Save & Exit]  [← Back] [Next →] │                                │
│  └────────────────────────────────────┘  │                                     │
└──────────────────────────────────────────┴─────────────────────────────────────┘
```

### Template Components

#### 1. Global Header / Main Navigation
- **Always visible** across all wizard steps
- Same navigation bar used in Dashboard, Workflows, Jobs, etc.
- Shows: STELLA logo, main nav links, Quick Start button, notifications
- **Purpose:** Maintains consistency and allows users to exit wizard easily
- **Implementation:** Use shared `Navigation.tsx` component

#### 2. Progress Indicator (Top of Main Content)
- **Location:** Top of 70% main content area
- **Format:** "Step X of 6" + horizontal progress bar
- **Progress Bar:** Shows percentage complete (Step 1 = 17%, Step 2 = 33%, etc.)
- **Color:** Primary teal (#12AEBF) for filled portion, Light grey (#DDDDDD) for unfilled

#### 3. Step Title & Subtitle
- **Title:** H1, Navy Darkest (#07464C), 2rem (32px)
- **Subtitle:** Regular text, Navy Dark (#0B6873), 1rem (16px)
- **Spacing:** 8px between title and subtitle

#### 4. Main Content Area (70% width)
- **Background:** White (#FFFFFF) card with 12px border radius
- **Padding:** 24px (reduced to 16px for compact forms)
- **Max Width:** No max-width constraint (uses 70% of viewport)
- **Scrollable:** If content exceeds viewport height

#### 5. Side Panel (30% width)
- **Background:** Light grey (#F0EFEF)
- **Padding:** 16px
- **Fixed Position:** Stays visible while scrolling main content
- **Contains:**
  - Progress stepper (all 6 steps with status indicators)
  - Summary of user entries (optional, per step)
  - Helper content (tips, need help box, etc.)

#### 6. Progress Stepper (Side Panel)
- **Current Step:** Filled dot (●), Navy Darkest (#07464C)
- **Completed Steps:** Checkmark (✓), Primary (#12AEBF)
- **Future Steps:** Empty circle (○), Dark Grey (#888888)
- **Text:** Current step bold, others regular weight

#### 7. Footer Actions
- **Layout:** Left-aligned: Cancel, Save & Exit | Right-aligned: Back, Next
- **Spacing:** 16px between buttons
- **Cancel:** Outline button, shows confirmation dialog
- **Save & Exit:** Secondary button, saves progress and returns to dashboard
- **Back:** Secondary button (hidden on Step 1)
- **Next:** Primary button, validates and proceeds

#### 8. Navigation Rules
- **Next Button:**
  - Validates current step
  - Shows inline errors if validation fails
  - Proceeds to next step if validation passes
  - On Step 6, proceeds to Confirmation screen
- **Back Button:**
  - Available on Steps 2-6 (hidden on Step 1)
  - Preserves current step data
  - No validation required
- **Cancel Button:**
  - Shows dialog: "Cancel setup? All progress will be lost."
  - Options: "Continue Setup" or "Cancel Setup"
  - Returns to Dashboard if confirmed
- **Save & Exit:**
  - Saves all progress to database (draft state)
  - Shows toast: "Progress saved. Resume anytime from Dashboard."
  - Returns to Dashboard

### Design Specifications

#### Spacing
- Between sections: 16px
- Between form fields: 8px (compact)
- Card padding: 16px (forms) or 24px (content-heavy steps)
- Side panel padding: 16px

#### Colors
- Background: Light grey #F0EFEF
- Cards: White #FFFFFF
- Text: Navy Darkest #07464C (primary), Navy Dark #0B6873 (secondary)
- Borders: Light Grey #DDDDDD
- Focus states: Primary #12AEBF with 2px outline

#### Typography
- Step title: 2rem (32px), bold
- Step subtitle: 1rem (16px), regular
- Section headers: 0.875rem (14px), uppercase, semi-bold
- Field labels: 0.875rem (14px), regular
- Helper text: 0.875rem (14px), light grey

---

## Step 1: Company Info

### Purpose
Collect essential company information to set up the customer account and personalize the OCR workflow experience.

### Metadata
- **Title:** "Let's set up your company"
- **Subtitle:** "This helps us customize your experience"
- **Estimated Time:** 1-2 minutes
- **Required:** Yes (cannot skip)
- **Total Fields:** 13 (10 required, 3 optional)

### Form Fields

**Source:** Based on SESSION_SUMMARY_QUICK_START_WIZARD.md (2026-01-31, branch: claude/design-app-ui-layouts-yTgK0)

#### Section: COMPANY DETAILS

**1. Company Name** *
- **Type:** Text input
- **Validation:**
  - Required
  - Min 2 characters, max 100 characters
  - Duplicate check on blur (check against existing companies in database)
  - If duplicate found: Show error "A company with this name already exists. Please use a different name."
- **Placeholder:** "Enter your company name"

**2. Industry Sector** *
- **Type:** Dropdown select
- **Label:** "Industry Sector"
- **Options:**
  - Banking & Finance
  - Insurance
  - Healthcare
  - Government & Public Sector
  - Legal Services
  - Other
- **Validation:** Required
- **Default:** None (user must select)

**3. Primary Region** *
- **Type:** Dropdown select
- **Label:** "Primary Region"
- **Options:**
  - North America
  - Europe
  - Asia Pacific
  - Latin America
  - Middle East & Africa
- **Validation:** Required
- **Default:** None (user must select)

**4. Country** *
- **Type:** Autocomplete select (searchable dropdown)
- **Validation:** Required
- **Default:** Pre-selected based on browser locale (e.g., "United States")
- **Helper Text:** "Type to search countries"
- **Behavior:** User can type to filter country list
- **Implementation:** Use CountrySelect.tsx component (react-select)

**5. No. of Lines of Business Being Processed** *
- **Type:** Number input
- **Label:** "No. of Lines of Business Being Processed"
- **Validation:**
  - Required
  - Minimum: 1
  - Maximum: 100
  - Integer only
- **Placeholder:** "e.g., 3"
- **Helper Text:** "How many different business lines or departments will process documents?"
- **Important:** This value determines the number of sections shown in Step 5 (Volume Expectations)

#### Section: PRIMARY CONTACTS

**6. Primary Contact 1 - Name** *
- **Type:** Text input
- **Label:** "Primary Contact 1 - Name"
- **Validation:** Required, min 2 characters
- **Placeholder:** "John Doe"

**7. Primary Contact 1 - Email** *
- **Type:** Email input
- **Label:** "Primary Contact 1 - Email"
- **Validation:**
  - Required
  - Valid email format (RFC 5322)
- **Placeholder:** "john.doe@company.com"

**8. Primary Contact 1 - Cell** *
- **Type:** Tel input
- **Label:** "Primary Contact 1 - Cell"
- **Validation:**
  - Required
  - Phone format validation (allow international formats)
- **Placeholder:** "+1 (555) 123-4567"

**9. + Add another contact**
- **Type:** Expandable link
- **Behavior:** Hidden by default, clicking expands inline to show Contact 2 fields below
- **Text:** "+ Add another contact" (when collapsed)
- **Text when expanded:** "− Remove contact 2"

**10. Primary Contact 2 - Name** (shown after clicking "+ Add another contact")
- **Type:** Text input
- **Label:** "Primary Contact 2 - Name"
- **Validation:** Optional
- **Placeholder:** "Jane Smith"
- **Display:** Hidden by default, shown when link is clicked

**11. Primary Contact 2 - Email** (shown after clicking "+ Add another contact")
- **Type:** Email input
- **Label:** "Primary Contact 2 - Email"
- **Validation:** Optional (but if provided, must be valid email format)
- **Placeholder:** "jane.smith@company.com"
- **Display:** Hidden by default, shown when link is clicked

**12. Primary Contact 2 - Cell** (shown after clicking "+ Add another contact")
- **Type:** Tel input
- **Label:** "Primary Contact 2 - Cell"
- **Validation:** Optional (but if provided, must be valid phone format)
- **Placeholder:** "+1 (555) 987-6543"
- **Display:** Hidden by default, shown when link is clicked

#### Section: FILE LOCATIONS

**13. Secured Drop-off Location (Files)** *
- **Type:** Text input
- **Label:** "Secured Drop-off Location (Files)"
- **Validation:**
  - Required
  - Can be skipped if not known upfront (user can add later)
- **Placeholder:** "/data/customers/customer1/drop-off/ or s3://bucket-name/drop-off/"
- **Helper Text:** "File system path or S3 bucket name where documents will be uploaded"
- **Format:** File system path (e.g., /data/...) or S3 bucket name (e.g., s3://...)

**14. Secure Pick-up Location (Files)** *
- **Type:** Text input
- **Label:** "Secure Pick-up Location (Files)"
- **Validation:**
  - Required
  - Can be skipped if not known upfront (user can add later)
- **Placeholder:** "/data/customers/customer1/pickup/ or s3://bucket-name/pickup/"
- **Helper Text:** "File system path or S3 bucket name where processed documents will be delivered"
- **Format:** File system path (e.g., /data/...) or S3 bucket name (e.g., s3://...)

### Visual Layout

```
┌─────────────────────────────────────┐
│ COMPANY DETAILS                     │
│                                     │
│ Company Name *                      │
│ [input field]                       │
│                                     │
│ Industry Sector *                   │
│ [dropdown: Banking & Finance ▼]     │
│                                     │
│ Primary Region *                    │
│ [dropdown: North America ▼]         │
│                                     │
│ Country *                           │
│ [autocomplete: United States ▼]     │
│ Type to search countries            │
│                                     │
│ No. of Lines of Business Being      │
│ Processed *                         │
│ [number input: e.g., 3]             │
│ How many different business lines...│
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ PRIMARY CONTACTS                    │
│                                     │
│ Primary Contact 1 - Name *          │
│ [input field]                       │
│                                     │
│ Primary Contact 1 - Email *         │
│ [input field]                       │
│                                     │
│ Primary Contact 1 - Cell *          │
│ [input field]                       │
│                                     │
│ + Add another contact               │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ FILE LOCATIONS                      │
│                                     │
│ Secured Drop-off Location (Files) * │
│ [input field]                       │
│ File system path or S3 bucket name  │
│ where documents will be uploaded    │
│                                     │
│ Secure Pick-up Location (Files) *   │
│ [input field]                       │
│ File system path or S3 bucket name  │
│ where processed documents will be   │
│ delivered                           │
└─────────────────────────────────────┘
```

### Validation Rules

#### On Blur (Field-Level)
- **Company Name:** Check for duplicates via API call
- **Primary Contact 1 - Email:** Validate email format
- **Primary Contact 1 - Cell:** Validate phone format
- **Primary Contact 2 - Email:** Validate email format (if provided)
- **Primary Contact 2 - Cell:** Validate phone format (if provided)

#### On Next Button Click
- **All 10 required fields:** Must be filled
- **No validation errors:** All fields must pass validation
- **Success:** Proceed to Step 2
- **Failure:** Show inline error messages below each invalid field

#### Skip Logic
- **Secured Drop-off Location:** Can be skipped if not known upfront
- **Secure Pick-up Location:** Can be skipped if not known upfront
- Note: These can be configured later in Settings

### Error Messages

| Field | Error Condition | Message |
|-------|----------------|---------|
| Company Name | Empty | "Company name is required" |
| Company Name | Duplicate | "A company with this name already exists. Please use a different name." |
| Company Name | Too short | "Company name must be at least 2 characters" |
| Industry Sector | Not selected | "Please select an industry sector" |
| Primary Region | Not selected | "Please select a primary region" |
| Country | Not selected | "Please select a country" |
| Lines of Business | Empty | "Please enter the number of lines of business" |
| Lines of Business | < 1 | "Must be at least 1" |
| Lines of Business | > 100 | "Maximum 100 lines of business" |
| Contact 1 Name | Empty | "Primary contact name is required" |
| Contact 1 Email | Empty | "Primary contact email is required" |
| Contact 1 Email | Invalid format | "Please enter a valid email address" |
| Contact 1 Cell | Empty | "Primary contact cell phone is required" |
| Contact 1 Cell | Invalid format | "Please enter a valid phone number" |
| Contact 2 Email | Invalid format | "Please enter a valid email address" |
| Contact 2 Cell | Invalid format | "Please enter a valid phone number" |
| Drop-off Location | Empty | "Drop-off location is required (or skip to configure later)" |
| Pick-up Location | Empty | "Pick-up location is required (or skip to configure later)" |

### Side Panel Content

#### Progress Stepper
```
Your Progress

● Company Info         ← Current step (bold, filled dot)
○ Choose Template
○ Document Types
○ Validation Rules
○ Volume Estimate
○ Output Format
```

#### Need Help? Box
```
┌─────────────────────────────────┐
│ Need Help?                      │
│                                 │
│ • Required fields are marked    │
│   with an asterisk (*)          │
│ • You can edit this information │
│   later in Settings             │
│ • Contact support if you need   │
│   assistance                    │
└─────────────────────────────────┘
```

### Footer Actions

- **Cancel:** Shows confirmation dialog
- **Save & Exit:** Saves progress, returns to Dashboard
- **Back:** Hidden (this is Step 1)
- **Next →:** Validates and proceeds to Step 2

### State Management

#### Data Structure
```typescript
interface Step1Data {
  companyName: string;
  industrySector: string;
  primaryRegion: string;
  country: string;
  linesOfBusiness: number;
  primaryContact1: {
    name: string;
    email: string;
    cell: string;
  };
  primaryContact2?: {
    name: string;
    email: string;
    cell: string;
  };
  securedDropoffLocation: string;
  securePickupLocation: string;
}
```

#### Persistence
- **In-session:** React state (lost on refresh)
- **Save & Exit:** Saved to database as draft
- **On Next:** Data validated and stored in wizard state

#### Important Notes
- **linesOfBusiness** value is used to dynamically generate sections in Step 5 (Volume Expectations)
- **securedDropoffLocation** and **securePickupLocation** can be skipped but should be configured before production use
- **primaryContact2** fields are optional

---

## Step 2: Template Selection

**Status:** In design (Session 2026-02-06)
**Purpose:** Choose a pre-built workflow template or start from scratch. Selection determines pre-filled defaults for Steps 3-6.

### Metadata
- **Title:** "Choose a template"
- **Subtitle:** "Select a workflow template to get started quickly, or build your own from scratch"
- **Estimated Time:** < 1 minute
- **Required:** Yes (must select one option to proceed)
- **Skip:** Not allowed (same as Step 1)

### Options (6 total, 3x2 grid)

| Position | Name | ID | Type | Icon |
|----------|------|----|------|------|
| 1 | Basic Invoice Processing | `basic-invoice` | Template | Invoice/receipt SVG |
| 2 | Mixed Document Processing | `mixed-document` | Template | Mixed pages SVG |
| 3 | Healthcare Form Processing | `healthcare-form` | Template | Medical/health SVG |
| 4 | Banking | `banking` | Template | Bank/finance SVG |
| 5 | Insurance | `insurance` | Template | Shield/policy SVG |
| 6 | Start from Scratch | `start-from-scratch` | Blank | Generic "build" SVG |

### Card Content (Templates 1-5)
- Template name
- Short description (placeholder text for now)
- Document types covered (placeholder text for now)
- Estimated setup time
- Sector-representative SVG icon

### Card Content (Start from Scratch — Position 6)
- Name: "Start from Scratch"
- Description: "Build a custom workflow from the ground up"
- Visually distinct: different color from palette, not teal — signals this is not a pre-built template
- No document types or setup time shown

### Card Behavior
- **Click** = select (single-click selection)
- **Selected state** = reversed colors (swap background/foreground)
- **Only one card selected at a time** (radio behavior)
- **Deselect** = click a different card

### Layout
- **3 columns x 2 rows**
- Card height set for legible content (accessibility — minimum readable font sizes)
- Consistent card sizing across all 6
- `rounded-[5px]` border radius (per project conventions)

### Side Panel Content

#### Progress Stepper
```
Your Progress

✓ Company Info         ← Completed (checkmark)
● Choose Template      ← Current step (bold, filled dot)
○ Document Types
○ Validation Rules
○ Volume Estimate
○ Output Format
```

#### Template Summary
- Before selection: "Select a template to see details"
- After selection: Shows template name and description

### Footer Actions
- **Cancel:** Confirmation dialog (same as Step 1)
- **Save & Exit:** Saves progress, returns to Dashboard
- **Back:** Returns to Step 1 (preserves Step 1 data)
- **Next →:** Enabled only when a card is selected; proceeds to Step 3

### Validation
- Must select one option to proceed
- No other field validation needed
- Error state: if user clicks Next with no selection, show message above grid

### Pre-fill Behavior (depends on Steps 3-6 design)
- Selecting a template pre-fills Steps 3-6 with template defaults (editable)
- Selecting "Start from Scratch" leaves Steps 3-6 blank
- **Template change warning:** If user returns to Step 2 and changes selection after completing later steps:
  - Dialog: "Changing your template will reset your settings in the following steps. Continue?"
  - Options: "Continue" (reset) or "Go Back" (keep current)
- **Exact pre-fill values TBD** — requires Steps 3-6 field definitions first

### Data Structure
```typescript
interface Step2Data {
  selectedTemplateId: string; // 'basic-invoice' | 'mixed-document' | 'healthcare-form' | 'banking' | 'insurance' | 'start-from-scratch'
  templateName: string;
}
```

### Visual Layout (Approved Outline)

```
┌─────────────────────────────────────────┐
│ Step 2 of 6                             │
│ Progress Bar: ▓▓▓▓░░░░░░ 33%           │
└─────────────────────────────────────────┘

Choose a template
Select a workflow template to get started quickly,
or build your own from scratch

┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  [icon]      │ │  [icon]      │ │  [icon]      │
│  Basic       │ │  Mixed       │ │  Healthcare  │
│  Invoice     │ │  Document    │ │  Form        │
│  Processing  │ │  Processing  │ │  Processing  │
│              │ │              │ │              │
│  Lorem ipsum │ │  Lorem ipsum │ │  Lorem ipsum │
│  Doc types:  │ │  Doc types:  │ │  Doc types:  │
│  lorem ipsum │ │  lorem ipsum │ │  lorem ipsum │
│  ~3 min      │ │  ~5 min      │ │  ~4 min      │
└──────────────┘ └──────────────┘ └──────────────┘

┌──────────────┐ ┌──────────────┐ ┌──────────────┐
│  [icon]      │ │  [icon]      │ │  [icon]      │
│  Banking     │ │  Insurance   │ │  Start from  │
│              │ │              │ │  Scratch     │
│              │ │              │ │  [distinct   │
│  Lorem ipsum │ │  Lorem ipsum │ │   color]     │
│  Doc types:  │ │  Doc types:  │ │  Build your  │
│  lorem ipsum │ │  lorem ipsum │ │  own workflow │
│  ~4 min      │ │  ~4 min      │ │              │
└──────────────┘ └──────────────┘ └──────────────┘
```

### Open Items (Blocked on Steps 3-6)
- Exact pre-fill mappings per template
- Preview modal content (deferred — will show workflow visualization once steps are defined)
- Real descriptions and document types to replace lorem ipsum
- Icon finalization (simple SVG placeholders for now)

---

## Step 3: Document Types

**Status:** Design complete (Session 2026-02-10)
**Purpose:** Select pre-created document templates for this workflow
**Related:** [SESSION_2026-02-10_template-creation-steps3-6.md](../sessions/SESSION_2026-02-10_template-creation-steps3-6.md)
**Diagram:** [step3-user-interaction-flow.md](../diagrams/step3-user-interaction-flow.md)

### Metadata
- **Title:** "Document Types"
- **Subtitle:** "Select which document templates to include in this workflow"
- **Estimated Time:** 1-2 minutes
- **Required:** Yes (must select at least 1 template)

### Key Concepts

**MAJOR DESIGN CHANGE:** Step 3 no longer uses a matrix selection of document types × file formats. Instead, it displays **pre-created document templates** from the Template Creation Workflow.

**Template-First Approach:**
1. Administrators create templates via Template Creation Workflow (admin-only)
2. Templates are tested and validated (accuracy tracking, field detection)
3. Customers select pre-created templates in Quick Start Wizard Step 3
4. Selected templates pre-populate Steps 4-6 with validation rules, volume estimates, output formats

### Data Structure

```typescript
interface Step3Data {
  selectedTemplateIds: string[];  // Array of selected template IDs
  documentTemplates: DocumentTemplate[];  // Full template objects for display
}
```

### UI Summary

**Template Cards Display:**
- Single-column scrollable list
- Each card shows: Name, LOB, City, Classification, Fields count, Accuracy %, Status, Processing pipeline
- Checkbox for selection
- [View Details] button (opens modal - Phase 2 feature)

**Footer Actions:**
- [+ Create New Template] [View Template Library]
- "Selected: X templates | Avg Accuracy: Y%"

**Validation:** Must select at least 1 template to proceed

**Empty State:** Show CTA to create first template if none exist

**Summary Text:** `"Types: X templates, Avg accuracy Y%"`

See [SESSION_2026-02-10](../sessions/SESSION_2026-02-10_template-creation-steps3-6.md) for complete UI specification, mockup, and gap analysis.

---

## Step 4: Validation Rules

**Status:** Design complete (Session 2026-02-10)
**Purpose:** Configure validation rules and external validation for selected templates
**Related:** [SESSION_2026-02-10_template-creation-steps3-6.md](../sessions/SESSION_2026-02-10_template-creation-steps3-6.md)

### Metadata
- **Title:** "Validation Rules"
- **Subtitle:** "Configure validation rules for your document processing"
- **Estimated Time:** 2-3 minutes
- **Required:** Optional (can proceed with validation disabled)

### Key Concepts

**Pre-loaded from Templates:** Validation rules are automatically loaded from templates selected in Step 3, but can be customized per-workflow.

**External Validation via RAG:** Supports validation against external reference databases (zip codes, country codes, state codes) via Reference Augmented Generation.

### Data Structure

```typescript
interface Step4Data {
  enableValidation: boolean;  // Master toggle
  templateValidation: Record<string, ValidationConfig>;  // Per-template rules
  globalSettings: {
    confidenceThreshold: number;  // Flag if OCR confidence < threshold
    enableExternalValidation: boolean;  // Master toggle for RAG
  };
}
```

### UI Summary

**Global Settings:**
- Enable Validation toggle
- Global Confidence Threshold slider (e.g., 85%)
- Enable External Validation (RAG) toggle

**Per-Template Configuration:**
- Required fields list (checkboxes)
- Validation rules table (field, rule type, action, enable/edit/remove)
- External validation list (field, validation type, enable)

**Summary Text:** `"Validation: X rules, Y required fields, RAG enabled/disabled"`

See [SESSION_2026-02-10](../sessions/SESSION_2026-02-10_template-creation-steps3-6.md) for complete specification.

---

## Step 5: Volume Estimate

**Status:** Design complete (Session 2026-02-10)
**Purpose:** Estimate processing volume per Line of Business for capacity planning
**Related:** [SESSION_2026-02-10_template-creation-steps3-6.md](../sessions/SESSION_2026-02-10_template-creation-steps3-6.md)

### Metadata
- **Title:** "Volume Estimate"
- **Subtitle:** "Estimate your monthly document processing volume"
- **Estimated Time:** 1-2 minutes
- **Required:** Optional (can skip with warning)

### Key Concepts

**Dynamic Sections:** Number of LOB sections is determined by Step 1 field "No. of Lines of Business Being Processed"

**Example:** If Step 1 = "3" lines of business, Step 5 shows 3 LOB sections

### Data Structure

```typescript
interface Step5Data {
  volumeByLOB: Record<string, VolumeEstimate>;
}

interface VolumeEstimate {
  lobName: string;  // e.g., "Traffic Enforcement"
  monthlyVolume: number;  // e.g., 150000
  peakPeriod?: string;  // e.g., "End of month" (optional)
}
```

### UI Summary

**Per-LOB Section:**
- LOB Name (text input, required)
- Expected Monthly Volume (number input, required)
- Peak Processing Period (text input, optional)

**Side Panel:** Shows total estimated volume across all LOBs

**Skip Logic:** Can skip step entirely with warning dialog

**Summary Text:** `"Volume: X docs/month across Y LOBs"`

See [SESSION_2026-02-10](../sessions/SESSION_2026-02-10_template-creation-steps3-6.md) for complete specification.

---

## Step 6: Output Format

**Status:** Design complete (Session 2026-02-10)
**Purpose:** Define output formats, delivery method, and audit trail configuration
**Related:** [SESSION_2026-02-10_template-creation-steps3-6.md](../sessions/SESSION_2026-02-10_template-creation-steps3-6.md)

### Metadata
- **Title:** "Output Format"
- **Subtitle:** "Choose how processed documents will be delivered"
- **Estimated Time:** 1-2 minutes
- **Required:** Yes (must select at least 1 output format)

### Key Concepts

**Audit Trail Always Enabled:** Per G9 and FR-009 requirements, audit logging is mandatory and cannot be disabled.

**Tracked Events:**
1. Documents arrive at drop-off location
2. Documents leave for processing
3. Outputs ready before transfer
4. Documents transferred to customer pickup

### Data Structure

```typescript
interface Step6Data {
  outputFormats: OutputFormatConfig;
  selectedFormats: ('json' | 'csv')[];
  auditTrail: {
    enabled: boolean;  // Always true (read-only)
    events: AuditEventConfig[];
    retentionDays: number;  // Default: 90 days
  };
}
```

### UI Summary

**Output Formats Section:**
- JSON Files (checkbox with options: include metadata, include confidence scores)
- CSV Export (checkbox with options: delimiter, include headers)

**Delivery Method Section:**
- Method dropdown (Pickup Location, S3 Bucket, API Webhook)
- Location/endpoint configuration (pre-filled from Step 1 if pickup location)
- Schedule dropdown (Daily, Weekly, etc.)
- Notify on completion checkbox

**Audit Trail Section (Read-Only):**
- Always enabled banner
- List of tracked events (all enabled by default)
- Retention period dropdown (30, 60, 90, 180, 365 days)
- Access control info (Administrators and select Power Analysts)

**Validation:** Must select at least 1 output format

**Summary Text:** `"Output: JSON + CSV, Daily pickup, Audit enabled"`

See [SESSION_2026-02-10](../sessions/SESSION_2026-02-10_template-creation-steps3-6.md) for complete specification and detailed audit trail configuration

---

## Step 7: Review & Accept

**Status:** Design complete (Session 2026-02-10)
**Purpose:** Review all entries, accept security/privacy policies, and finalize workflow setup
**Related:** [SESSION_2026-02-10_template-creation-steps3-6.md](../sessions/SESSION_2026-02-10_template-creation-steps3-6.md)
**Wireframe:** [step7-review-accept-single-column.md](../wireframes/step7-review-accept-single-column.md)

### Metadata
- **Title:** "Review & Accept"
- **Subtitle:** "Review your configuration and accept policies to complete setup"
- **Estimated Time:** 2-3 minutes
- **Required:** Yes (all policies must be accepted and signature provided)

### Key Concepts

**Final Review:** All previous steps are summarized with [Edit] links to return and modify if needed.

**Policy Acceptance Required:** Four security and privacy policies must be explicitly accepted via checkboxes before completing setup.

**Electronic Signature:** User must provide full name as electronic signature to confirm acceptance.

### Data Structure

```typescript
interface Step7Data {
  policiesAccepted: {
    dpa: boolean;  // Data Processing Agreement
    sla: boolean;  // Service Level Agreement
    compliance: boolean;  // Compliance Requirements
    auditRetention: boolean;  // Audit & Retention Policy
  };
  acceptedBy: string;  // Full name signature
  acceptedAt: string;  // Timestamp (ISO 8601)
}
```

### UI Layout (Option 3: Single Column with Card-Style Summaries)

**Structure:**

1. **Step Summary Cards** (single column)
   - 6 cards (one per step 1-6)
   - Each card shows:
     - Step number and title
     - [Edit] button to return to that step
     - Compact bullet-point summary
     - Example: "ACME Corp • United States • 3 LOBs • 200,000 docs/month"

2. **Security & Privacy Policies Section**
   - Full-width section below step summaries
   - 4 separate policy cards (country-specific based on Step 1)
   - Each policy card has:
     - Policy name
     - Detailed description
     - Checkbox for acceptance (required)
     - [View Document →] link (opens policy in new tab)

3. **Signature Section**
   - "Accepted By (Full Name)" text input field
   - Required field indicator (*)
   - Helper text: "Your electronic signature confirms acceptance of all policies"

4. **Complete Setup Button**
   - Disabled until all 4 checkboxes checked + name provided
   - Primary action button
   - Text: "Complete Setup"

### Step Summary Format

Each step card follows this format:

**Step 1 Summary:**
```
Company Name • Country • X LOBs • Volume/month
Drop-off: [location]
Pick-up: [location]
Primary Contact: [name] • [email]
```

**Step 2 Summary:**
```
Template: [template name]
```

**Step 3 Summary:**
```
Types: X templates, Avg accuracy Y%
Example templates: Template A, Template B, Template C... (N more)
```

**Step 4 Summary:**
```
Validation: X rules, Y required fields, RAG enabled/disabled
Confidence threshold: Z%
```

**Step 5 Summary:**
```
Volume: X docs/month across Y LOBs
LOB 1: [name] - [volume]
LOB 2: [name] - [volume]
...
```

**Step 6 Summary:**
```
Output: JSON + CSV, Daily pickup, Audit enabled
Retention: X days
```

### Security & Privacy Policies

Four policies are displayed with country-specific content (based on Step 1 Country field):

#### 1. Data Processing Agreement (DPA)
- **Title:** Data Processing Agreement
- **Description:** Governs how we process, store, and protect your documents and extracted data. Includes GDPR compliance (EU), CCPA compliance (California), and region-specific data residency requirements.
- **Checkbox Required:** Yes
- **Link:** [View Document →] (opens `/policies/dpa?country=[country_code]`)

#### 2. Service Level Agreement (SLA)
- **Title:** Service Level Agreement
- **Description:** Defines uptime guarantees (99.9%), processing time commitments, and support response times. Includes service credits for downtime and performance remediation procedures.
- **Checkbox Required:** Yes
- **Link:** [View Document →] (opens `/policies/sla`)

#### 3. Compliance Requirements
- **Title:** Compliance Requirements
- **Description:** Outlines regulatory compliance obligations including HIPAA (healthcare), SOC 2 Type II, ISO 27001, and industry-specific certifications. Details audit rights and breach notification procedures.
- **Checkbox Required:** Yes
- **Link:** [View Document →] (opens `/policies/compliance?country=[country_code]`)

#### 4. Audit & Retention Policy
- **Title:** Audit & Retention Policy
- **Description:** Defines audit trail requirements, log retention periods (default 90 days), data archival procedures, and deletion policies. Includes right to audit and data retrieval guarantees.
- **Checkbox Required:** Yes
- **Link:** [View Document →] (opens `/policies/audit-retention`)

### Validation Rules

**Enabled State for "Complete Setup" Button:**
1. All 4 policy checkboxes must be checked
2. "Accepted By" field must be filled (minimum 2 characters)

**Disabled State:**
- Button is grayed out and unclickable
- Hover tooltip shows: "Please accept all policies and provide your name"

**On Click (when enabled):**
1. Validate all conditions met
2. Save Step7Data with timestamp
3. Create workflow with all step data
4. Show success toast: "Workflow setup complete!"
5. Redirect to Dashboard (`/dashboard`)

### Error States

| Condition | Error Message | Location |
|-----------|--------------|----------|
| Click "Complete Setup" with unchecked policies | "Please accept all security and privacy policies" | Above policies section |
| Click "Complete Setup" with empty "Accepted By" field | "Please provide your full name" | Below signature field |
| Any step fails validation on final save | "Unable to complete setup. Please review all steps." | Top of page |

### Side Panel Content

**Panel Visible:**
```
YOUR PROGRESS
──────────────────────────

Step 7 of 7

██████████████████ 100%

Setup Complete

Once you accept all policies
and provide your signature,
your workflow will be created
and ready to use.

──────────────────────────

What Happens Next?

• Workflow is created with your
  configuration
• You'll be redirected to the
  Dashboard
• You can start uploading
  documents immediately
• All settings can be modified
  later
```

### Footer Actions

- **Cancel:** Shows confirmation dialog: "Cancel setup? All progress will be lost."
- **Save & Exit:** Disabled on Step 7 (cannot save incomplete workflow)
- **← Back:** Returns to Step 6, preserves all data
- **Complete Setup:** Primary button, validates and finalizes workflow

### Behavior on Success

1. **Save All Data:**
   - Persist steps 1-7 data to database
   - Create workflow record with status "active"
   - Create customer account (if new customer)
   - Associate templates with workflow
   - Initialize audit trail

2. **Show Success Feedback:**
   - Toast notification: "Workflow setup complete!"
   - Brief loading state (1-2 seconds) while saving

3. **Redirect:**
   - Navigate to Dashboard (`/dashboard`)
   - Dashboard shows new workflow in "Active Workflows" section
   - Show welcome message or tutorial prompt (optional)

### Behavior on Edit

If user clicks [Edit] on any step summary:
1. Navigate to that step (e.g., Step 3)
2. Load existing data into form
3. Allow user to make changes
4. On Next, validate and save changes
5. Return to Step 7 with updated summary

**Important:** Changes to Step 2 (template selection) may trigger confirmation dialog if it would reset later steps.

### Summary Text (Used in Other Contexts)

`"Review: 6 steps configured, 4 policies accepted, signed by [name]"`

### Related Documentation

- [SESSION_2026-02-10_template-creation-steps3-6.md](../sessions/SESSION_2026-02-10_template-creation-steps3-6.md) - Full design session log
- [step7-review-accept-single-column.md](../wireframes/step7-review-accept-single-column.md) - Detailed wireframe
- [DESIGN_SYSTEM.md](../../DESIGN_SYSTEM.md) - Color and spacing specs

### Implementation Notes

**Dynamic Content:**
- Policy content must be country-specific (loaded based on Step 1 Country field)
- Step summaries must reflect actual user inputs from each step
- LOB count in Step 5 summary must match Step 1 input

**Accessibility:**
- All policy checkboxes must have clear labels for screen readers
- Keyboard navigation must work for all interactive elements
- Complete Setup button must show clear disabled state

**Testing:**
- Verify all 4 policies load correctly for different countries
- Test edit links return to correct step with data preserved
- Validate button enable/disable logic
- Test success flow (save → redirect)

---

## Technical Implementation Notes

### Component Structure
```
/components/wizard/
├── WizardLayout.tsx          # Global template wrapper
├── WizardProgressBar.tsx     # Step indicator + progress bar
├── WizardSidePanel.tsx       # Right side panel with stepper
├── WizardFooter.tsx          # Action buttons (Cancel, Save, Back, Next)
├── steps/
│   ├── Step1CompanyInfo.tsx
│   ├── Step2TemplateSelection.tsx
│   ├── Step3DocumentTypes.tsx
│   ├── Step4ValidationRules.tsx
│   ├── Step5VolumeEstimate.tsx
│   ├── Step6OutputFormat.tsx
│   └── Step7ReviewAccept.tsx
```

### State Management
- Use React Context or local state for wizard data
- Persist to database on "Save & Exit"
- Clear draft data after successful completion

### API Endpoints
- `POST /api/wizard/save-draft` - Save progress
- `GET /api/wizard/resume` - Resume saved progress
- `POST /api/wizard/validate-company` - Check duplicate company name
- `POST /api/wizard/complete` - Finalize setup

---

## Change Log

| Date | Changes | Session |
|------|---------|---------|
| 2026-02-01 | Initial specification created with Step 1 defined | [SESSION_2026-02-01](../sessions/SESSION_2026-02-01_wizard-step1.md) |
| 2026-02-06 | Step 2 Template Selection added | - |
| 2026-02-10 | Steps 3-7 specifications complete, updated to 7-step wizard with Review & Accept as Step 7 | [SESSION_2026-02-10](../sessions/SESSION_2026-02-10_template-creation-steps3-6.md) |

---

**Maintained by:** Design & Engineering Team
**Review Cycle:** After each wizard session
**Next Review:** After high-resolution designs complete
