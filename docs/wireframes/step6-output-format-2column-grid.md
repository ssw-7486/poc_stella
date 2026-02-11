# Step 6: Output Format - 2-Column Grid with Collapsible Panel

**Last Updated:** 2026-02-10
**Status:** Low-resolution wireframe complete (after 3 design iterations)
**Purpose:** Wireframe documentation for Quick Start Wizard Step 6 with 2-column grid layout
**Related Documents:**
- [WIZARD_SPEC.md](../specs/WIZARD_SPEC.md#step-6-output-format)
- [SESSION_2026-02-10_template-creation-steps3-6.md](../sessions/SESSION_2026-02-10_template-creation-steps3-6.md)

---

## Overview

Step 6 allows customers to define output formats, delivery method, and audit trail configuration. This wireframe shows both collapsed (panel hidden) and expanded (panel visible) states of the collapsible side panel pattern.

**KEY DESIGN DECISION (After 3 Iterations):** 2-column grid layout when panel is hidden:
- **Left Column:** JSON format with ALL JSON options
- **Right Column:** CSV format with ALL CSV options
- **Below Grid (Full Width):** DELIVERY METHOD section
- **Below Grid (Full Width):** AUDIT TRAIL section

**Rationale:** Everything related to one format should be in the same column. Delivery and Audit apply to all formats, so they stay full-width.

---

## Panel Hidden State (Default) - 2-Column Grid

```
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                │
│  STELLA    Dashboard    Workflows    Jobs    Documents    Settings         [🔔]  [Stewart ▼]  │
│                                                                                                │
└────────────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│  PROGRESS                                                                        [Show →]      │
│  ──────────────────────────────────────────────────────────────────────────────────────────   │
│                                                                                                │
│  ● 1. Company → ● 2. Template → ● 3. Types → ● 4. Validation → ● 5. Volume → ● 6. Output →  │
│                  → ○ 7. Review                                                                 │
│                                                                                                │
└────────────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                │
│  STEP 6: OUTPUT FORMAT                                                                        │
│  ──────────────────────────────────────────────────────────────────────────────────────────   │
│                                                                                                │
│  Choose how processed documents will be delivered                                             │
│                                                                                                │
│  ──────────────────────────────────────────────────────────────────────────────────────────   │
│                                                                                                │
│  OUTPUT FORMATS                                                                               │
│  Select at least one output format                                                            │
│                                                                                                │
│  ┌──────────────────────────────────────────────────┬─────────────────────────────────────┐   │
│  │ JSON FILES (STRUCTURED DATA)                     │ CSV EXPORT (SPREADSHEET)            │   │
│  │ ───────────────────────────────────────────────  │ ──────────────────────────────────  │   │
│  │                                                  │                                     │   │
│  │ [✓] Enable JSON output                          │ [✓] Enable CSV output               │   │
│  │                                                  │                                     │   │
│  │ JSON OPTIONS                                     │ CSV OPTIONS                         │   │
│  │                                                  │                                     │   │
│  │ File naming: [workflow-name]-[timestamp].json   │ File naming: [workflow-name]-       │   │
│  │              [dropdown ▼]                        │              [timestamp].csv        │   │
│  │                                                  │              [dropdown ▼]           │   │
│  │ ☑ Include metadata (timestamps, workflow ID,    │                                     │   │
│  │    processing info)                              │ Delimiter: [Comma (,) ▼]            │   │
│  │                                                  │ Options: Comma, Semicolon, Tab      │   │
│  │ ☑ Include confidence scores (per field)         │                                     │   │
│  │                                                  │ ☑ Include headers (field names in   │   │
│  │ ☑ Pretty print (human-readable formatting)      │    first row)                       │   │
│  │                                                  │                                     │   │
│  │ Indentation: [2 spaces ▼]                       │ Text qualifier: [Double quotes (\") │   │
│  │ Options: 2 spaces, 4 spaces, tabs               │                 ▼]                  │   │
│  │                                                  │ Options: Double quotes, Single      │   │
│  │ Schema: [JSON Schema v7 ▼]                      │          quotes, None               │   │
│  │ Options: JSON Schema v7, Custom                 │                                     │   │
│  │                                                  │ Encoding: [UTF-8 ▼]                 │   │
│  │ Compression: [None ▼]                           │ Options: UTF-8, UTF-16, ISO-8859-1  │   │
│  │ Options: None, gzip, zip                        │                                     │   │
│  │                                                  │ ☑ Escape special characters         │   │
│  └──────────────────────────────────────────────────┴─────────────────────────────────────┘   │
│                                                                                                │
│  ──────────────────────────────────────────────────────────────────────────────────────────   │
│                                                                                                │
│  DELIVERY METHOD                                                                              │
│  ──────────────────────────────────────────────────────────────────────────────────────────   │
│                                                                                                │
│  Method: [Pickup Location ▼]                                                                  │
│  Options: Pickup Location, S3 Bucket, SFTP, API Webhook                                       │
│                                                                                                │
│  Pickup Location: /data/acme/pickup/                                                          │
│  (from Step 1 Company Info)                                                                    │
│                                                                                                │
│  Schedule: [Daily ▼]                                                                          │
│  Options: Immediate, Hourly, Daily, Weekly, Custom                                            │
│                                                                                                │
│  ☑ Notify on completion                                                                       │
│  Send email notification when documents are ready                                             │
│                                                                                                │
│  ──────────────────────────────────────────────────────────────────────────────────────────   │
│                                                                                                │
│  AUDIT TRAIL (REQUIRED PER G9)                                                                │
│  ──────────────────────────────────────────────────────────────────────────────────────────   │
│                                                                                                │
│  ℹ️  Audit logging is automatically enabled for all workflows and cannot be disabled.         │
│                                                                                                │
│  TRACKED EVENTS                                                                               │
│                                                                                                │
│  ☑ Documents arrive at drop-off location                                                      │
│     Captures: Count, file sizes, timestamp, customer ID                                       │
│                                                                                                │
│  ☑ Documents leave for processing                                                             │
│     Captures: Batch ID, document count, processing start time                                 │
│                                                                                                │
│  ☑ Outputs ready before transfer                                                              │
│     Captures: Output count, format, file sizes, processing time                               │
│                                                                                                │
│  ☑ Documents transferred to customer pickup                                                   │
│     Captures: Transfer time, document count, delivery method                                  │
│                                                                                                │
│  Audit Log Retention: [90 days ▼]                                                             │
│  Options: 30 days, 60 days, 90 days, 180 days, 365 days, Custom                              │
│                                                                                                │
│  Access Control: Audit trail viewable by Administrators and select Power Analysts            │
│                                                                                                │
│  [View Compliance Policy →]                                                                   │
│                                                                                                │
└────────────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│  ACTIONS                                                                                       │
│  ──────────────────────────────────────────────────────────────────────────────────────────   │
│                                                                                                │
│  [Cancel]  [Save & Exit]                                                   [← Back]  [Next →] │
│                                                                                                │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Panel Visible State (70% / 30% Split) - Single Column

```
┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                │
│  STELLA    Dashboard    Workflows    Jobs    Documents    Settings         [🔔]  [Stewart ▼]  │
│                                                                                                │
└────────────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│  PROGRESS                                                                        [← Hide]      │
│  ──────────────────────────────────────────────────────────────────────────────────────────   │
│                                                                                                │
│  ● 1. Company → ● 2. Template → ● 3. Types → ● 4. Validation → ● 5. Volume → ● 6. Output →  │
│                  → ○ 7. Review                                                                 │
│                                                                                                │
└────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────┬──────────────────────────────────────────────────┐
│                                             │                                                  │
│  STEP 6: OUTPUT FORMAT                      │  YOUR PROGRESS                                   │
│  ─────────────────────────────────────────  │  ──────────────────────────────────────────────  │
│                                             │                                                  │
│  Choose how processed documents will be     │  Step 6 of 7                                     │
│  delivered                                  │                                                  │
│                                             │  ███████████████ 86%                             │
│  ─────────────────────────────────────────  │                                                  │
│                                             │  ──────────────────────────────────────────────  │
│  OUTPUT FORMATS                             │  Output Summary                                  │
│  Select at least one output format          │  ──────────────────────────────────────────────  │
│                                             │                                                  │
│  ─────────────────────────────────────────  │  Formats: JSON + CSV                             │
│                                             │  Delivery: Daily to pickup location              │
│  JSON FILES (STRUCTURED DATA)               │  Audit: Enabled (required)                       │
│  ─────────────────────────────────────────  │  Retention: 90 days                              │
│                                             │                                                  │
│  [✓] Enable JSON output                     │  ──────────────────────────────────────────────  │
│                                             │  JSON Options                                    │
│  JSON OPTIONS                               │  ──────────────────────────────────────────────  │
│                                             │                                                  │
│  File naming: [workflow-name]-[timestamp]   │  • Includes metadata ✓                           │
│  .json [dropdown ▼]                         │  • Includes confidence scores ✓                  │
│                                             │  • Pretty print (2 spaces) ✓                     │
│  ☑ Include metadata                         │  • JSON Schema v7                                │
│  ☑ Include confidence scores                │  • No compression                                │
│  ☑ Pretty print                             │                                                  │
│                                             │  ──────────────────────────────────────────────  │
│  Indentation: [2 spaces ▼]                  │  CSV Options                                     │
│  Schema: [JSON Schema v7 ▼]                 │  ──────────────────────────────────────────────  │
│  Compression: [None ▼]                      │                                                  │
│                                             │  • Delimiter: Comma                              │
│  ─────────────────────────────────────────  │  • Includes headers ✓                            │
│                                             │  • Text qualifier: Double quotes                 │
│  CSV EXPORT (SPREADSHEET)                   │  • Encoding: UTF-8                               │
│  ─────────────────────────────────────────  │  • Escape special characters ✓                   │
│                                             │                                                  │
│  [✓] Enable CSV output                      │  ──────────────────────────────────────────────  │
│                                             │  Need Help?                                      │
│  CSV OPTIONS                                │  ──────────────────────────────────────────────  │
│                                             │                                                  │
│  File naming: [workflow-name]-[timestamp]   │  • Select at least one output format             │
│  .csv [dropdown ▼]                          │  • Multiple formats can be enabled               │
│                                             │  • Delivery location from Step 1                 │
│  Delimiter: [Comma (,) ▼]                   │  • Audit trail is mandatory (G9)                 │
│  ☑ Include headers                          │  • All settings can be changed later             │
│  Text qualifier: [Double quotes (\") ▼]     │                                                  │
│  Encoding: [UTF-8 ▼]                        │                                                  │
│  ☑ Escape special characters                │                                                  │
│                                             │                                                  │
│  ─────────────────────────────────────────  │                                                  │
│                                             │                                                  │
│  DELIVERY METHOD                            │                                                  │
│  ─────────────────────────────────────────  │                                                  │
│                                             │                                                  │
│  Method: [Pickup Location ▼]               │                                                  │
│  Pickup Location: /data/acme/pickup/        │                                                  │
│  (from Step 1 Company Info)                 │                                                  │
│  Schedule: [Daily ▼]                        │                                                  │
│  ☑ Notify on completion                     │                                                  │
│                                             │                                                  │
│  ─────────────────────────────────────────  │                                                  │
│                                             │                                                  │
│  AUDIT TRAIL (REQUIRED PER G9)              │                                                  │
│  ─────────────────────────────────────────  │                                                  │
│                                             │                                                  │
│  ℹ️  Audit logging is automatically enabled │                                                  │
│  for all workflows.                         │                                                  │
│                                             │                                                  │
│  TRACKED EVENTS                             │                                                  │
│  ☑ Documents arrive at drop-off location    │                                                  │
│     Captures: Count, file sizes, timestamp  │                                                  │
│  ☑ Documents leave for processing           │                                                  │
│     Captures: Batch ID, document count      │                                                  │
│  ☑ Outputs ready before transfer            │                                                  │
│     Captures: Output count, format          │                                                  │
│  ☑ Documents transferred to customer pickup │                                                  │
│     Captures: Transfer time, count          │                                                  │
│                                             │                                                  │
│  Audit Log Retention: [90 days ▼]           │                                                  │
│  Access: Administrators and select Power    │                                                  │
│  Analysts                                   │                                                  │
│                                             │                                                  │
│  [View Compliance Policy →]                 │                                                  │
│                                             │                                                  │
└─────────────────────────────────────────────┴──────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│  ACTIONS                                                                                       │
│  ──────────────────────────────────────────────────────────────────────────────────────────   │
│                                                                                                │
│  [Cancel]  [Save & Exit]                                                   [← Back]  [Next →] │
│                                                                                                │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Behavioral Notes

### Panel Toggle

**Default State:** Panel hidden, [Show →] button visible
**LocalStorage Persistence:** `wizard_step6_panel_visible` (boolean)
**Layout:**
- Panel hidden: 100% width, 2-column grid for output formats
- Panel visible: 70% main content (single column), 30% side panel

### 2-Column Grid Layout (Panel Hidden)

**CRITICAL DESIGN DECISION:** After 3 design iterations, final approved layout is:
- **Left Column:** JSON format with ALL JSON options
- **Right Column:** CSV format with ALL CSV options
- **Below Grid (Full Width):** DELIVERY METHOD section (applies to all formats)
- **Below Grid (Full Width):** AUDIT TRAIL section (applies to all formats)

**Rejected Alternatives:**
- **Attempt 1:** OUTPUT FORMATS (left) | DELIVERY METHOD (right) - Rejected because unrelated sections grouped together
- **Attempt 2:** JSON + CSV together (left) | Delivery (right) - Rejected because each format needs its own configuration space

**Rationale:** Everything related to one format should be in the same column. Shared settings (Delivery, Audit) stay full-width.

### Single Column Layout (Panel Visible)

**When Panel is Visible:** Single column layout with all sections stacked vertically
**Order:** JSON → CSV → Delivery → Audit

### Output Format Selection

**Master Checkboxes:**
- [✓] Enable JSON output
- [✓] Enable CSV output

**Validation:** Must select at least 1 output format to proceed
**Default:** Both enabled by default
**Effect:** Disabling checkbox hides all options for that format

### JSON Options

**File Naming:** Dropdown with templates (workflow-name-timestamp, custom, etc.)
**Include Metadata:** Checkbox, adds timestamps, workflow ID, processing info
**Include Confidence Scores:** Checkbox, adds per-field OCR confidence
**Pretty Print:** Checkbox, human-readable formatting with indentation
**Indentation:** Dropdown (2 spaces, 4 spaces, tabs)
**Schema:** Dropdown (JSON Schema v7, Custom)
**Compression:** Dropdown (None, gzip, zip)

### CSV Options

**File Naming:** Dropdown with templates
**Delimiter:** Dropdown (Comma, Semicolon, Tab)
**Include Headers:** Checkbox, field names in first row
**Text Qualifier:** Dropdown (Double quotes, Single quotes, None)
**Encoding:** Dropdown (UTF-8, UTF-16, ISO-8859-1)
**Escape Special Characters:** Checkbox

### Delivery Method

**Method Dropdown:** Pickup Location, S3 Bucket, SFTP, API Webhook
**Pickup Location Field:** Pre-filled from Step 1 "Secure Pick-up Location (Files)"
**Schedule Dropdown:** Immediate, Hourly, Daily, Weekly, Custom
**Notify on Completion:** Checkbox, sends email when documents ready

### Audit Trail (Read-Only, Always Enabled)

**Banner:** "ℹ️ Audit logging is automatically enabled for all workflows and cannot be disabled."

**Tracked Events (All Enabled by Default, Cannot Disable):**
1. Documents arrive at drop-off location
2. Documents leave for processing
3. Outputs ready before transfer
4. Documents transferred to customer pickup

**Audit Log Retention:** Dropdown (30, 60, 90, 180, 365 days, Custom)
**Access Control:** Read-only text, "Audit trail viewable by Administrators and select Power Analysts"
**[View Compliance Policy →]:** Opens compliance policy document in new tab

---

## Data Structure

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

interface OutputFormatConfig {
  json?: {
    enabled: boolean;
    fileNaming: string;
    includeMetadata: boolean;
    includeConfidenceScores: boolean;
    prettyPrint: boolean;
    indentation: '2-spaces' | '4-spaces' | 'tabs';
    schema: 'json-schema-v7' | 'custom';
    compression: 'none' | 'gzip' | 'zip';
  };
  csv?: {
    enabled: boolean;
    fileNaming: string;
    delimiter: 'comma' | 'semicolon' | 'tab';
    includeHeaders: boolean;
    textQualifier: 'double-quotes' | 'single-quotes' | 'none';
    encoding: 'utf-8' | 'utf-16' | 'iso-8859-1';
    escapeSpecialChars: boolean;
  };
}

interface DeliveryConfig {
  method: 'pickup-location' | 's3-bucket' | 'sftp' | 'api-webhook';
  location: string;  // From Step 1 or custom
  schedule: 'immediate' | 'hourly' | 'daily' | 'weekly' | 'custom';
  notifyOnCompletion: boolean;
}

interface AuditEventConfig {
  eventType: 'drop_off_arrived' | 'left_for_processing' | 'outputs_ready' | 'transferred_to_customer';
  enabled: boolean;  // Always true (read-only)
  metadata: string[];  // What metadata to capture
}
```

---

## Summary Text (for Step 7 Review)

Format: `"Output: JSON + CSV, Daily pickup, Audit enabled"`
Examples:
- `"Output: JSON, Daily pickup, Audit enabled"`
- `"Output: JSON + CSV, Immediate delivery via S3, Audit enabled"`

**Detailed Summary (for Step 7 Review Card):**
```
Output: JSON + CSV, Daily pickup, Audit enabled
JSON: Metadata + confidence, pretty print, no compression
CSV: Comma-delimited, UTF-8, headers included
Retention: 90 days
```

---

## Key Learnings & Gotchas

### 1. 3 Design Iterations for Layout

**Iteration History:**
- **Attempt 1:** OUTPUT FORMATS (left) | DELIVERY METHOD (right)
  - Rejected: Unrelated sections grouped together
- **Attempt 2:** JSON + CSV together (left) | Delivery (right)
  - Rejected: Each format needs its own configuration space
- **Attempt 3 (APPROVED):** JSON (left) | CSV (right), then Delivery + Audit full-width below
  - Rationale: Everything related to one format together in same column

**Key User Feedback:** "I think we need to have everything related to 1 format together in the same column, put a different output in the 2nd column"

### 2. Progress Bar Separator Line

**CRITICAL:** Initial Step 6 wireframe forgot separator line after PROGRESS header (same issue as Step 5)
**Corrected in Final Wireframe**

### 3. Panel Hidden = 2 Columns, Panel Visible = Single Column

**Layout Switch:** Must handle responsive layout change when panel toggles
**Gotcha:** Grid layout only works when panel is hidden. When panel is visible, single column prevents cramped layout.

### 4. Audit Trail Always Enabled (G9 Requirement)

**Mandatory:** Audit logging cannot be disabled, per G9 and FR-009 compliance requirements
**UI:** Read-only section with banner explaining it's always enabled
**All Events Enabled:** Cannot disable individual events (all 4 tracked by default)
**Only Configurable:** Retention period dropdown

### 5. Delivery Location Pre-filled from Step 1

**Source:** Step 1 "Secure Pick-up Location (Files)" field
**Validation:** If Step 1 pickup location is empty, show warning and allow manual entry
**Gotcha:** Must read Step 1 data from wizard state

---

## Related Documentation

- **Specification:** [WIZARD_SPEC.md](../specs/WIZARD_SPEC.md#step-6-output-format)
- **Session Log:** [SESSION_2026-02-10_template-creation-steps3-6.md](../sessions/SESSION_2026-02-10_template-creation-steps3-6.md)
- **Design System:** [DESIGN_SYSTEM.md](../../DESIGN_SYSTEM.md)

---

**Next Steps for High-Resolution Design:**
1. Match Step 1 and Step 2 visual style
2. Design file naming template dropdown with preview
3. Design custom schedule modal (for "Custom" option)
4. Design S3/SFTP/Webhook configuration modals (for alternative delivery methods)
5. Add format examples (show sample JSON/CSV output)
6. Consider adding output preview feature
