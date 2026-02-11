# Step 4: Validation Rules - Collapsible Side Panel Wireframe

**Last Updated:** 2026-02-10
**Status:** Low-resolution wireframe complete
**Purpose:** Wireframe documentation for Quick Start Wizard Step 4 with collapsible side panel pattern
**Related Documents:**
- [WIZARD_SPEC.md](../specs/WIZARD_SPEC.md#step-4-validation-rules)
- [SESSION_2026-02-10_template-creation-steps3-6.md](../sessions/SESSION_2026-02-10_template-creation-steps3-6.md)
- [template-external-validation-flow.md](../diagrams/template-external-validation-flow.md)

---

## Overview

Step 4 allows customers to configure validation rules and external validation for selected templates. This wireframe shows both collapsed (panel hidden) and expanded (panel visible) states of the collapsible side panel pattern.

**Key Design Decision:** Accordion pattern for per-template configuration. First template expanded by default, others collapsed. Global settings always visible at top.

---

## Panel Hidden State (Default)

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
│  ● 1. Company → ● 2. Template → ● 3. Types → ● 4. Validation → ○ 5. Volume → ○ 6. Output →  │
│                  → ○ 7. Review                                                                 │
│                                                                                                │
└────────────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                │
│  STEP 4: VALIDATION RULES                                                                     │
│  ──────────────────────────────────────────────────────────────────────────────────────────   │
│                                                                                                │
│  Configure validation rules for your document processing                                      │
│                                                                                                │
│  ──────────────────────────────────────────────────────────────────────────────────────────   │
│                                                                                                │
│  GLOBAL SETTINGS                                                                              │
│  ──────────────────────────────────────────────────────────────────────────────────────────   │
│                                                                                                │
│  Enable Validation: [Toggle: ON ●]                                                            │
│                                                                                                │
│  Global Confidence Threshold: [85%] [──────●─────────] (50-100%)                              │
│  Flag for review if OCR confidence below this threshold                                       │
│                                                                                                │
│  Enable External Validation (RAG): [Toggle: ON ●]                                             │
│  Validates fields against external reference databases (zip codes, country codes, etc.)       │
│                                                                                                │
│  ──────────────────────────────────────────────────────────────────────────────────────────   │
│                                                                                                │
│  TEMPLATE VALIDATION                                                                          │
│  ──────────────────────────────────────────────────────────────────────────────────────────   │
│                                                                                                │
│  ▼ Traffic Violation Ticket (Type A)                                         [Collapse]       │
│     ──────────────────────────────────────────────────────────────────────────────────────   │
│                                                                                                │
│     REQUIRED FIELDS (flag for review if missing)                                              │
│     ☑ Ticket Number                                                                           │
│     ☑ Date                                                                                    │
│     ☑ Violation Type                                                                          │
│     ☑ Fine Amount                                                                             │
│     ☑ Location (with zip code validation)                                                     │
│     ☐ Officer Name                                                                            │
│                                                                                                │
│     VALIDATION RULES                                                                          │
│     ┌────────────────────────────────────────────────────────────────────────────────────┐   │
│     │ 1. Ticket Number Format                                                             │   │
│     │    Field: Ticket Number                                                             │   │
│     │    Rule: Must match pattern "TKT-YYYY-NNNNNN"                                       │   │
│     │    Action: Flag for review                                                          │   │
│     │    [Enable ●]  [Edit]  [Remove]                                                     │   │
│     ├────────────────────────────────────────────────────────────────────────────────────┤   │
│     │ 2. Fine Amount Range                                                                │   │
│     │    Field: Fine Amount                                                               │   │
│     │    Rule: Value between $10 and $5000                                                │   │
│     │    Action: Flag for review                                                          │   │
│     │    [Enable ●]  [Edit]  [Remove]                                                     │   │
│     ├────────────────────────────────────────────────────────────────────────────────────┤   │
│     │ 3. Date Range                                                                       │   │
│     │    Field: Date                                                                      │   │
│     │    Rule: Within last 5 years, not future date                                      │   │
│     │    Action: Flag for review                                                          │   │
│     │    [Enable ●]  [Edit]  [Remove]                                                     │   │
│     └────────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                                │
│     [+ Add Validation Rule]                                                                    │
│                                                                                                │
│     EXTERNAL VALIDATION (RAG)                                                                  │
│     ☑ Zip Code (Location field)                                                               │
│        Validates against: US Postal Codes database                                            │
│        Action: Flag if invalid                                                                │
│                                                                                                │
│     ☑ State Code (State field)                                                                │
│        Validates against: US State codes list                                                 │
│        Action: Flag if invalid                                                                │
│                                                                                                │
│     [+ Add External Validation]                                                               │
│                                                                                                │
│  ──────────────────────────────────────────────────────────────────────────────────────────   │
│                                                                                                │
│  ▶ Speeding Citation (Type B)                                                [Expand]         │
│     ──────────────────────────────────────────────────────────────────────────────────────   │
│     Click to configure validation rules for this template                                     │
│                                                                                                │
│  ──────────────────────────────────────────────────────────────────────────────────────────   │
│                                                                                                │
│  ▶ Parking Violation (Type C)                                                [Expand]         │
│     ──────────────────────────────────────────────────────────────────────────────────────   │
│     Click to configure validation rules for this template                                     │
│                                                                                                │
│  ──────────────────────────────────────────────────────────────────────────────────────────   │
│                                                                                                │
│  ... (17 more collapsed template sections)                                                    │
│                                                                                                │
│  ──────────────────────────────────────────────────────────────────────────────────────────   │
│                                                                                                │
│  Active rules across all templates: 47 rules, 65 required fields, 12 external validations    │
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

## Panel Visible State (70% / 30% Split)

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
│  ● 1. Company → ● 2. Template → ● 3. Types → ● 4. Validation → ○ 5. Volume → ○ 6. Output →  │
│                  → ○ 7. Review                                                                 │
│                                                                                                │
└────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────┬──────────────────────────────────────────────────┐
│                                             │                                                  │
│  STEP 4: VALIDATION RULES                   │  YOUR PROGRESS                                   │
│  ─────────────────────────────────────────  │  ──────────────────────────────────────────────  │
│                                             │                                                  │
│  Configure validation rules for your        │  Step 4 of 7                                     │
│  document processing                        │                                                  │
│                                             │  ███████████░░░ 57%                              │
│  ─────────────────────────────────────────  │                                                  │
│                                             │  ──────────────────────────────────────────────  │
│  GLOBAL SETTINGS                            │  Validation Summary                              │
│  ─────────────────────────────────────────  │  ──────────────────────────────────────────────  │
│                                             │                                                  │
│  Enable Validation: [Toggle: ON ●]         │  Validation: Enabled ✓                           │
│                                             │                                                  │
│  Global Confidence Threshold: [85%]        │  Total Rules: 47                                 │
│  [──────●─────────] (50-100%)               │  Required Fields: 65                             │
│  Flag for review if OCR confidence below    │  External Validations: 12                        │
│  this threshold                             │                                                  │
│                                             │  Global Threshold: 85%                           │
│  Enable External Validation (RAG):          │  RAG: Enabled ✓                                  │
│  [Toggle: ON ●]                             │                                                  │
│  Validates fields against external          │  ──────────────────────────────────────────────  │
│  reference databases                        │  Need Help?                                      │
│                                             │  ──────────────────────────────────────────────  │
│  ─────────────────────────────────────────  │                                                  │
│                                             │  • Validation rules are loaded from your         │
│  TEMPLATE VALIDATION                        │    selected templates                            │
│  ─────────────────────────────────────────  │  • You can customize rules per workflow          │
│                                             │  • External validation (RAG) checks values       │
│  ▼ Traffic Violation Ticket (Type A)       │    against reference databases                   │
│     [Collapse]                              │  • Flag for review = requires human approval     │
│     ───────────────────────────────────     │  • Block = prevents processing until fixed       │
│                                             │                                                  │
│     REQUIRED FIELDS                         │                                                  │
│     ☑ Ticket Number                         │                                                  │
│     ☑ Date                                  │                                                  │
│     ☑ Violation Type                        │                                                  │
│     ☑ Fine Amount                           │                                                  │
│     ☑ Location (with zip code)              │                                                  │
│     ☐ Officer Name                          │                                                  │
│                                             │                                                  │
│     VALIDATION RULES                        │                                                  │
│     ┌──────────────────────────────────┐   │                                                  │
│     │ 1. Ticket Number Format          │   │                                                  │
│     │    Field: Ticket Number          │   │                                                  │
│     │    Rule: Match "TKT-YYYY-NNNNNN" │   │                                                  │
│     │    Action: Flag for review       │   │                                                  │
│     │    [Enable ●] [Edit] [Remove]    │   │                                                  │
│     ├──────────────────────────────────┤   │                                                  │
│     │ 2. Fine Amount Range             │   │                                                  │
│     │    Field: Fine Amount            │   │                                                  │
│     │    Rule: $10 - $5000             │   │                                                  │
│     │    Action: Flag for review       │   │                                                  │
│     │    [Enable ●] [Edit] [Remove]    │   │                                                  │
│     ├──────────────────────────────────┤   │                                                  │
│     │ 3. Date Range                    │   │                                                  │
│     │    Field: Date                   │   │                                                  │
│     │    Rule: Last 5 years, no future │   │                                                  │
│     │    Action: Flag for review       │   │                                                  │
│     │    [Enable ●] [Edit] [Remove]    │   │                                                  │
│     └──────────────────────────────────┘   │                                                  │
│                                             │                                                  │
│     [+ Add Validation Rule]                 │                                                  │
│                                             │                                                  │
│     EXTERNAL VALIDATION (RAG)               │                                                  │
│     ☑ Zip Code (Location field)             │                                                  │
│        US Postal Codes database             │                                                  │
│     ☑ State Code (State field)              │                                                  │
│        US State codes list                  │                                                  │
│                                             │                                                  │
│     [+ Add External Validation]             │                                                  │
│                                             │                                                  │
│  ─────────────────────────────────────────  │                                                  │
│                                             │                                                  │
│  ▶ Speeding Citation (Type B) [Expand]     │                                                  │
│     Click to configure...                   │                                                  │
│                                             │                                                  │
│  ▶ Parking Violation (Type C) [Expand]     │                                                  │
│     Click to configure...                   │                                                  │
│                                             │                                                  │
│  ... (17 more)                              │                                                  │
│                                             │                                                  │
│  Active: 47 rules, 65 required fields,     │                                                  │
│          12 external validations            │                                                  │
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
**LocalStorage Persistence:** `wizard_step4_panel_visible` (boolean)
**Layout:**
- Panel hidden: 100% width for main content
- Panel visible: 70% main content, 30% side panel

### Global Settings

**Enable Validation Toggle:**
- ON (default): All validation rules enabled
- OFF: All validation disabled, Next button always enabled

**Global Confidence Threshold Slider:**
- Range: 50% to 100%
- Default: 85%
- Purpose: Flag any field with OCR confidence below threshold for manual review

**Enable External Validation (RAG) Toggle:**
- ON (default): External validation queries enabled
- OFF: Skip RAG validation for all fields
- Requires RAG service to be configured

### Accordion Pattern

**Default State:** First template (Traffic Violation Ticket Type A) expanded, all others collapsed
**On Click [Expand]:** Expand that template section, show configuration
**On Click [Collapse]:** Collapse that template section, hide configuration
**Multiple Open:** Can have multiple templates expanded simultaneously

### Required Fields

**Checkboxes:** Toggle which fields are required
**Effect:** If required field is missing from document, flag for review or block processing (based on action setting)

### Validation Rules Table

**Each Rule Shows:**
- Rule number and name
- Field being validated
- Rule description (pattern, range, etc.)
- Action (Flag for review, Block, Warn)
- Enable toggle + Edit + Remove buttons

**[Enable] Toggle:** Turn rule on/off without deleting
**[Edit] Button:** Opens modal to edit rule configuration
**[Remove] Button:** Deletes rule (with confirmation)
**[+ Add Validation Rule]:** Opens modal to create new rule

### External Validation (RAG)

**Checkboxes:** Enable/disable each external validation
**Display:** Field name, validation type, data source
**[+ Add External Validation]:** Opens modal to configure new external validation

**Supported Types:**
- Zip Code / Postal Code
- Country Code
- State Code
- Custom validation queries

---

## Data Structure

```typescript
interface Step4Data {
  enableValidation: boolean;  // Master toggle
  templateValidation: Record<string, ValidationConfig>;  // Per-template rules
  globalSettings: {
    confidenceThreshold: number;  // Flag if OCR confidence < threshold (50-100)
    enableExternalValidation: boolean;  // Master toggle for RAG
  };
}

interface ValidationConfig {
  requiredFields: string[];  // Field IDs that are required
  validationRules: ValidationRule[];
  externalValidation: ExternalValidationConfig[];
}

interface ValidationRule {
  id: string;
  fieldId: string;
  fieldName: string;
  ruleType: 'format' | 'range' | 'custom';
  ruleConfig: any;  // Pattern, min/max, custom logic
  action: 'flag_for_review' | 'block' | 'warn';
  enabled: boolean;
}

interface ExternalValidationConfig {
  fieldId: string;
  fieldName: string;
  validationType: 'zip_code' | 'country_code' | 'state_code' | 'custom';
  enabled: boolean;
}
```

---

## Summary Text (for Step 7 Review)

Format: `"Validation: X rules, Y required fields, RAG enabled/disabled"`
Example: `"Validation: 47 rules, 65 required fields, RAG enabled"`

---

## Key Learnings & Gotchas

### 1. Accordion Pattern for Scalability

**Decision:** Accordion pattern with first template expanded by default
**Rationale:** 20 templates selected in Step 3, showing all configuration at once would be overwhelming
**Gotcha:** Must preserve scroll position when expanding/collapsing sections

### 2. Global Settings Always Visible

**Decision:** Global settings section always visible at top (not in accordion)
**Rationale:** Master toggles and global threshold apply to all templates
**Gotcha:** If global validation is disabled, all per-template rules are ignored

### 3. Pre-loaded from Templates

**Important:** Validation rules are loaded from templates selected in Step 3
**Editable:** User can customize rules per-workflow (doesn't modify template)
**Gotcha:** If user returns to Step 3 and changes template selection, Step 4 configuration is reset

### 4. RAG Dependency

**External Validation Requires RAG:** If RAG service is not configured, external validation section shows warning
**Fallback:** If RAG is unavailable during processing, skip validation and flag for manual review
**Gotcha:** Must test RAG availability before showing external validation options

---

## Related Documentation

- **External Validation Flow:** [template-external-validation-flow.md](../diagrams/template-external-validation-flow.md)
- **Specification:** [WIZARD_SPEC.md](../specs/WIZARD_SPEC.md#step-4-validation-rules)
- **Session Log:** [SESSION_2026-02-10_template-creation-steps3-6.md](../sessions/SESSION_2026-02-10_template-creation-steps3-6.md)
- **Design System:** [DESIGN_SYSTEM.md](../../DESIGN_SYSTEM.md)

---

**Next Steps for High-Resolution Design:**
1. Match Step 1 and Step 2 visual style
2. Design rule editor modal (Edit button)
3. Design rule creation modal (Add Validation Rule)
4. Design external validation configuration modal
5. Add validation rule templates/presets for common patterns
6. Design confidence threshold visualization
