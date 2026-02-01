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
- **Estimated Time:** 1 minute
- **Required:** Yes (cannot skip)

### Form Fields

#### Section: COMPANY DETAILS

**1. Company Name** *
- **Type:** Text input
- **Validation:**
  - Required
  - Min 2 characters, max 100 characters
  - Duplicate check on blur (check against existing companies in database)
  - If duplicate found: Show error "A company with this name already exists. Please use a different name."
- **Placeholder:** "Enter your company name"

**2. Industry** *
- **Type:** Dropdown select
- **Options:**
  - Banking & Finance
  - Insurance
  - Healthcare
  - Government & Public Sector
  - Legal Services
  - Other
- **Validation:** Required
- **Default:** None (user must select)

**3. No. of Lines of Business** *
- **Type:** Number input
- **Validation:**
  - Required
  - Minimum: 1
  - Maximum: 100
  - Integer only
- **Placeholder:** "e.g., 3"
- **Helper Text:** "How many different business lines or departments will use this system?"

#### Section: LOCATION

**4. Country** *
- **Type:** Autocomplete select (searchable dropdown)
- **Validation:** Required
- **Default:** Pre-selected based on browser locale (e.g., "United States")
- **Helper Text:** "Type to search countries"
- **Behavior:** User can type to filter country list

#### Section: PRIMARY CONTACT

**5. Contact Name** *
- **Type:** Text input
- **Validation:** Required, min 2 characters
- **Placeholder:** "John Doe"

**6. Email Address** *
- **Type:** Email input
- **Validation:**
  - Required
  - Valid email format (RFC 5322)
- **Placeholder:** "john.doe@company.com"

**7. Phone Number** *
- **Type:** Tel input
- **Validation:**
  - Required
  - Phone format validation (allow international formats)
- **Placeholder:** "+1 (555) 123-4567"

#### Section: ADDITIONAL CONTACTS (Optional, Expandable)

**8. + Add another contact**
- **Type:** Expandable link
- **Behavior:**
  - Clicking expands inline to show Contact 2 fields
  - Shows same 3 fields: Name, Email, Phone
  - All Contact 2 fields are optional
  - Link text changes to "− Remove contact 2" when expanded

### Visual Layout

```
┌─────────────────────────────────────┐
│ COMPANY DETAILS                     │
│                                     │
│ Company Name *                      │
│ [input field]                       │
│                                     │
│ Industry *                          │
│ [dropdown: Banking & Finance ▼]     │
│                                     │
│ No. of Lines of Business *          │
│ [number input]                      │
│ How many different business lines...│
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ LOCATION                            │
│                                     │
│ Country *                           │
│ [autocomplete: United States ▼]     │
│ Type to search countries            │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ PRIMARY CONTACT                     │
│                                     │
│ Contact Name *                      │
│ [input field]                       │
│                                     │
│ Email Address *                     │
│ [input field]                       │
│                                     │
│ Phone Number *                      │
│ [input field]                       │
│                                     │
│ + Add another contact               │
└─────────────────────────────────────┘
```

### Validation Rules

#### On Blur (Field-Level)
- **Company Name:** Check for duplicates via API call
- **Email Address:** Validate format
- **Phone Number:** Validate format

#### On Next Button Click
- **All required fields:** Must be filled
- **No validation errors:** All fields must pass validation
- **Success:** Proceed to Step 2
- **Failure:** Show inline error messages below each invalid field

### Error Messages

| Field | Error Condition | Message |
|-------|----------------|---------|
| Company Name | Empty | "Company name is required" |
| Company Name | Duplicate | "A company with this name already exists. Please use a different name." |
| Company Name | Too short | "Company name must be at least 2 characters" |
| Industry | Not selected | "Please select an industry" |
| Lines of Business | Empty | "Please enter the number of lines of business" |
| Lines of Business | < 1 | "Must be at least 1" |
| Lines of Business | > 100 | "Maximum 100 lines of business" |
| Country | Not selected | "Please select a country" |
| Contact Name | Empty | "Contact name is required" |
| Email | Empty | "Email address is required" |
| Email | Invalid format | "Please enter a valid email address" |
| Phone | Empty | "Phone number is required" |
| Phone | Invalid format | "Please enter a valid phone number" |

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
  industry: string;
  linesOfBusiness: number;
  country: string;
  primaryContact: {
    name: string;
    email: string;
    phone: string;
  };
  additionalContact?: {
    name: string;
    email: string;
    phone: string;
  };
}
```

#### Persistence
- **In-session:** React state (lost on refresh)
- **Save & Exit:** Saved to database as draft
- **On Next:** Data validated and stored in wizard state

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
