# Step 3: Document Types - Collapsible Side Panel Wireframe

**Last Updated:** 2026-02-10
**Status:** Low-resolution wireframe complete
**Purpose:** Wireframe documentation for Quick Start Wizard Step 3 with collapsible side panel pattern
**Related Documents:**
- [WIZARD_SPEC.md](../specs/WIZARD_SPEC.md#step-3-document-types)
- [SESSION_2026-02-10_template-creation-steps3-6.md](../sessions/SESSION_2026-02-10_template-creation-steps3-6.md)
- [step3-user-interaction-flow.md](../diagrams/step3-user-interaction-flow.md)

---

## Overview

Step 3 allows customers to select pre-created document templates for their workflow. This wireframe shows both collapsed (panel hidden) and expanded (panel visible) states of the collapsible side panel pattern.

**Key Design Decision:** Single-column scrollable list of template cards, NOT a grid layout. When panel is hidden, 2 template cards are visible per screen. When panel is visible, 1 template card is visible per screen (70%/30% split).

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
│  ● 1. Company → ● 2. Template → ● 3. Types → ○ 4. Validation → ○ 5. Volume → ○ 6. Output →  │
│                  → ○ 7. Review                                                                 │
│                                                                                                │
└────────────────────────────────────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                                │
│  STEP 3: DOCUMENT TYPES                                                                       │
│  ──────────────────────────────────────────────────────────────────────────────────────────   │
│                                                                                                │
│  Select which document templates to include in this workflow                                  │
│                                                                                                │
│  ──────────────────────────────────────────────────────────────────────────────────────────   │
│                                                                                                │
│  Your Document Templates                                                                      │
│                                                                                                │
│  Based on the samples you provided during onboarding, we've created templates for your        │
│  document types:                                                                              │
│                                                                                                │
│  ┌──────────────────────────────────────────────────────────────────────────────────────────┐ │
│  │ [✓] Traffic Violation Ticket (Type A)                               [View Details]       │ │
│  │     ──────────────────────────────────────────────────────────────────────────────────   │ │
│  │     LOB: Traffic Enforcement  |  City: Los Angeles  |  Classification: Mixed             │ │
│  │                                                                                           │ │
│  │     Fields: 12 detected  |  Accuracy: 98.7% ✓  |  Status: Active                        │ │
│  │                                                                                           │ │
│  │     Processing: OCR (olmOCR 2) → Extract fields → Validate → Export                      │ │
│  └──────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                │
│  ┌──────────────────────────────────────────────────────────────────────────────────────────┐ │
│  │ [✓] Speeding Citation (Type B)                                      [View Details]       │ │
│  │     ──────────────────────────────────────────────────────────────────────────────────   │ │
│  │     LOB: Traffic Enforcement  |  City: San Francisco  |  Classification: Machine-printed │ │
│  │                                                                                           │ │
│  │     Fields: 10 detected  |  Accuracy: 99.2% ✓  |  Status: Active                        │ │
│  │                                                                                           │ │
│  │     Processing: OCR (olmOCR 2) → Extract fields → Validate → Export                      │ │
│  └──────────────────────────────────────────────────────────────────────────────────────────┘ │
│                                                                                                │
│  ... (18 more template cards - scroll to view)                                                │
│                                                                                                │
│  ──────────────────────────────────────────────────────────────────────────────────────────   │
│                                                                                                │
│  [+ Create New Template]  [View Template Library]                                             │
│                                                                                                │
│  Selected: 20 templates  |  Avg Accuracy: 98.9%                                               │
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
│  ● 1. Company → ● 2. Template → ● 3. Types → ○ 4. Validation → ○ 5. Volume → ○ 6. Output →  │
│                  → ○ 7. Review                                                                 │
│                                                                                                │
└────────────────────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────┬──────────────────────────────────────────────────┐
│                                             │                                                  │
│  STEP 3: DOCUMENT TYPES                     │  YOUR PROGRESS                                   │
│  ─────────────────────────────────────────  │  ──────────────────────────────────────────────  │
│                                             │                                                  │
│  Select which document templates to include │  Step 3 of 7                                     │
│  in this workflow                           │                                                  │
│                                             │  ████████░░░░░░ 43%                              │
│  ─────────────────────────────────────────  │                                                  │
│                                             │  ──────────────────────────────────────────────  │
│  Your Document Templates                    │  Templates Selected                              │
│                                             │  ──────────────────────────────────────────────  │
│  Based on the samples you provided during   │                                                  │
│  onboarding, we've created templates for    │  ▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░░░ 20 / 30                    │
│  your document types:                       │                                                  │
│                                             │  Average Accuracy: 98.9%                         │
│  ┌───────────────────────────────────────┐ │  Total Fields: 210                               │
│  │ [✓] Traffic Violation Ticket (Type A) │ │                                                  │
│  │     ─────────────────────────────────  │ │  ──────────────────────────────────────────────  │
│  │     LOB: Traffic Enforcement          │ │  Selected Templates                              │
│  │     City: Los Angeles                 │ │  ──────────────────────────────────────────────  │
│  │     Classification: Mixed             │ │                                                  │
│  │                                       │ │  • Traffic Violation Ticket (Type A)             │
│  │     Fields: 12 detected               │ │  • Speeding Citation (Type B)                    │
│  │     Accuracy: 98.7% ✓                 │ │  • Parking Violation (Type C)                    │
│  │     Status: Active                    │ │  • ... (17 more)                                 │
│  │                                       │ │                                                  │
│  │     Processing:                       │ │  ──────────────────────────────────────────────  │
│  │     OCR → Extract → Validate → Export │ │  Need Help?                                      │
│  │                                       │ │  ──────────────────────────────────────────────  │
│  │     [View Details]                    │ │                                                  │
│  └───────────────────────────────────────┘ │  • These templates were created during           │
│                                             │    onboarding and tested with your sample        │
│  ... (19 more template cards - scroll)     │    documents                                     │
│                                             │  • All templates meet the 99.5% accuracy         │
│  ─────────────────────────────────────────  │    target                                        │
│                                             │  • You can create new templates or modify        │
│  [+ Create New Template]                    │    existing ones at any time                     │
│  [View Template Library]                    │                                                  │
│                                             │                                                  │
│  Selected: 20 templates  |  Avg: 98.9%     │                                                  │
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

**Default State:** Panel hidden, [Show →] button visible in top-right of progress bar
**On Click [Show →]:** Panel expands to 30% width, button changes to [← Hide]
**On Click [← Hide]:** Panel collapses, button changes to [Show →]

**LocalStorage Persistence:**
- Panel state saved to `wizard_step3_panel_visible` (boolean)
- State persists across page refreshes and navigation

**Layout Adjustment:**
- Panel hidden: Main content 100% width, shows 2 template cards per screen
- Panel visible: Main content 70% width, panel 30% width, shows 1 template card per screen

### Template Selection

**Click Checkbox:** Toggle template selection (checked/unchecked)
**Real-Time Updates:**
- Footer summary updates: "Selected: X templates | Avg Accuracy: Y%"
- Side panel updates (when visible):
  - Progress bar: "X / 30"
  - Average Accuracy: "Y%"
  - Total Fields: "Z"
  - Template list: Shows selected template names

**Validation:** Must select at least 1 template to proceed
**Next Button:**
- Disabled (grayed out) when no templates selected
- Enabled (primary color) when ≥1 template selected
- Shows validation hint when disabled: "Select at least 1 template to proceed"

### View Details Button

**Phase 2 Feature:** Button exists but functionality deferred
**On Click:** Opens modal showing:
- Full field list (all 12 fields for Traffic Violation Type A)
- Validation rules configured for this template
- Test results history (accuracy trend over time)
- Sample documents used during creation
- Who created/approved the template and when

**Priority:** HIGH PRIORITY for Phase 2

### Create New Template / View Library

**[+ Create New Template]:** Opens Template Creation Wizard (admin-only feature) in new tab or modal
**[View Template Library]:** Opens Template Library page with filters, search, and clone options

### Empty State

**Condition:** No templates exist for this customer
**Display:**
```
┌─────────────────────────────────────┐
│ No Templates Yet?                   │
│                                     │
│ Let's create your first one         │
│                                     │
│ [+ Create New Template]             │
│                                     │
│ Or start with an industry template: │
│ • Healthcare                        │
│ • Banking                           │
│ • Insurance                         │
│ • Police/Government                 │
└─────────────────────────────────────┘
```

---

## Data Structure

```typescript
interface Step3Data {
  selectedTemplateIds: string[];  // IDs of pre-created templates
  documentTemplates: DocumentTemplate[];  // Full template objects (for display)
}

interface DocumentTemplate {
  id: string;
  name: string;  // "Traffic Violation Ticket (Type A)"
  lob: string;  // "Traffic Enforcement"
  city: string;  // "Los Angeles"
  classification: 'machine-printed' | 'handwritten' | 'mixed';
  fieldsDetected: number;  // 12
  accuracy: number;  // 98.7
  status: 'draft' | 'testing' | 'active' | 'archived';
  processingPipeline: string;  // "OCR → Extract → Validate → Export"
}
```

---

## Summary Text (for Step 7 Review)

Format: `"Types: X templates, Avg accuracy Y%"`
Example: `"Types: 20 templates, Avg accuracy 98.9%"`

---

## Key Learnings & Gotchas

### 1. Single Column, Not Grid

**Decision:** Single-column scrollable list of template cards
**Rationale:** Each card needs significant space to show metadata (LOB, city, classification, fields, accuracy, status, processing pipeline)
**Gotcha:** Initial wireframe drafts showed grid layout, but rejected in favor of single column for readability

### 2. Panel Affects Card Visibility

**Hidden:** 2 cards visible per screen
**Visible:** 1 card visible per screen (70%/30% split)
**Gotcha:** Must test scroll behavior with 20+ templates in list

### 3. View Details Modal Not Designed Yet

**Status:** Button exists in wireframe but modal is HIGH PRIORITY for Phase 2
**Gotcha:** Developers should stub out button action with "Coming soon" toast until modal is designed
**Why Deferred:** Focused on core wizard flow first, details modal is enhancement

### 4. Empty State HIGH PRIORITY

**Critical Path:** If customer has no templates, wizard is blocked
**Gotcha:** Must handle empty state gracefully with clear CTA to create first template or clone industry template
**Priority:** HIGH PRIORITY for Phase 2 (or sooner if customers need it during onboarding)

---

## Related Documentation

- **Full Flow Diagram:** [step3-user-interaction-flow.md](../diagrams/step3-user-interaction-flow.md)
- **Specification:** [WIZARD_SPEC.md](../specs/WIZARD_SPEC.md#step-3-document-types)
- **Session Log:** [SESSION_2026-02-10_template-creation-steps3-6.md](../sessions/SESSION_2026-02-10_template-creation-steps3-6.md)
- **Design System:** [DESIGN_SYSTEM.md](../../DESIGN_SYSTEM.md)

---

**Next Steps for High-Resolution Design:**
1. Match Step 1 and Step 2 visual style (colors, spacing, typography)
2. Design template card with proper icon/badge for classification
3. Design [View Details] modal (Phase 2)
4. Design empty state with industry template options
5. Add filtering/sorting controls (Phase 2 - MEDIUM PRIORITY)
