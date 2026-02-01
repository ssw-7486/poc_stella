# Quick Start Wizard Specification

**Last Updated:** 2026-02-01
**Status:** Step 1 in design, Steps 2-6 pending
**Related Documents:**
- [DESIGN_SYSTEM.md](../../DESIGN_SYSTEM.md)
- [COLOR_ACCESSIBILITY.md](../../COLOR_ACCESSIBILITY.md)
- [Session Logs](../sessions/)

---

## Overview

The Quick Start Wizard is a 6-step onboarding flow that helps new customers set up their OCR processing workflow. The wizard collects company information, template preferences, and configuration settings to create an initial workflow.

**Total Steps:** 6
**Estimated Time:** 4-5 minutes
**Entry Point:** Dashboard "Quick Start" button or `/quick-start` route
**Exit Point:** Workflow Editor (`/workflows`) after completion

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

**9. Primary Contact 2 - Name**
- **Type:** Text input
- **Label:** "Primary Contact 2 - Name"
- **Validation:** Optional
- **Placeholder:** "Jane Smith"

**10. Primary Contact 2 - Email**
- **Type:** Email input
- **Label:** "Primary Contact 2 - Email"
- **Validation:** Optional (but if provided, must be valid email format)
- **Placeholder:** "jane.smith@company.com"

**11. Primary Contact 2 - Cell**
- **Type:** Tel input
- **Label:** "Primary Contact 2 - Cell"
- **Validation:** Optional (but if provided, must be valid phone format)
- **Placeholder:** "+1 (555) 987-6543"

#### Section: FILE LOCATIONS

**12. Secured Drop-off Location (Files)** *
- **Type:** Text input
- **Label:** "Secured Drop-off Location (Files)"
- **Validation:**
  - Required
  - Can be skipped if not known upfront (user can add later)
- **Placeholder:** "/data/customers/customer1/drop-off/ or s3://bucket-name/drop-off/"
- **Helper Text:** "File system path or S3 bucket name where documents will be uploaded"
- **Format:** File system path (e.g., /data/...) or S3 bucket name (e.g., s3://...)

**13. Secure Pick-up Location (Files)** *
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
│ Primary Contact 2 - Name            │
│ [input field]                       │
│                                     │
│ Primary Contact 2 - Email           │
│ [input field]                       │
│                                     │
│ Primary Contact 2 - Cell            │
│ [input field]                       │
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

**Status:** Pending design
**Purpose:** Choose a pre-built workflow template or start from scratch

**Placeholder:** To be defined in next session

---

## Step 3: Document Types

**Status:** Pending design
**Purpose:** Select which document types will be processed

**Placeholder:** To be defined in future session

---

## Step 4: Validation Rules

**Status:** Pending design
**Purpose:** Configure business rules and validation logic

**Placeholder:** To be defined in future session

---

## Step 5: Volume Estimate

**Status:** Pending design
**Purpose:** Estimate monthly processing volume for capacity planning

**Placeholder:** To be defined in future session

---

## Step 6: Output Format

**Status:** Pending design
**Purpose:** Define how processed data will be exported

**Placeholder:** To be defined in future session

---

## Confirmation Screen

**Status:** Pending design
**Purpose:** Review all entries before finalizing setup

**Features:**
- Summary cards for each step
- Edit links to return to specific steps
- "Complete Setup" button
- "What happens next" explanation

**Behavior:**
- On Complete: Create customer account, create initial workflow, redirect to Workflow Editor

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
│   └── Step6OutputFormat.tsx
└── ConfirmationScreen.tsx
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

---

**Maintained by:** Design & Engineering Team
**Review Cycle:** After each wizard session
**Next Review:** After Step 2 design completion
