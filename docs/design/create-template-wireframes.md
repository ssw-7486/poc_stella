# Create Template Feature - Wireframe Specifications

**Date:** February 12, 2026
**Design Session:** UX/UI Brainstorming (Complete)
**Status:** Ready for Implementation

---

## Table of Contents

1. [Overview](#overview)
2. [Design Decisions Summary](#design-decisions-summary)
3. [Phase 1: Field Identification](#phase-1-field-identification)
4. [Phase 2: Data Extraction & Testing](#phase-2-data-extraction--testing)
5. [Responsive Behavior](#responsive-behavior)
6. [Implementation Guidance](#implementation-guidance)

---

## Overview

This document contains the finalized wireframe specifications for the Create Template feature (Phase 0 OCR Testing). The feature enables admins to create document templates for traffic ticket processing through a 3-phase workflow:

- **Phase 1:** Field Identification - Upload samples, detect fields, configure properties
- **Phase 2:** Data Extraction & Testing - Upload test samples, review extracted data, log corrections
- **Phase 3:** Accuracy Tracking & Approval - Calculate accuracy, approve template, integrate with Step 3

**Related Documents:**
- [Plan File](../../.claude/plans/vivid-swimming-lantern.md) - Complete specifications (10 improvements, workflows, technical specs)
- [Session Notes](../sessions/) - Detailed brainstorming session history

---

## Design Decisions Summary

### ✅ Finalized Decisions

| Decision Area | Selected Option | Rationale |
|--------------|-----------------|-----------|
| **Interface Type** | Full page (not modal) | Complex 3-phase workflow needs full screen |
| **Phase 1 Layout** | Option B: Horizontal Split | Maximizes image size for traffic tickets |
| **Responsive Strategy** | 2-column field properties when panel hidden | Reduces scrolling by 50% on 1080p screens |
| **Multi-Sample View** | Hybrid (single-focus + grid toggle) | Balances detail and overview |
| **Data Persistence** | localStorage (Phase 0) → SQLite (Phase 1) | Quick POC, easy migration path |
| **Phase Navigation** | Free switching via tabs/stepper | Allows iterative refinement |
| **Error Recovery** | Auto-retry 3x + fallback options | Graceful degradation |
| **Field Detection** | Semi-automatic with confidence colors | Reduces manual work by 80% |

### 📋 Documented But Not Yet Selected

- **Phase 2 Layout:** Option B (detailed) vs Option C (compact) - Both ready for implementation

---

## Phase 1: Field Identification

### Layout: Option B (Horizontal Split - Stacked) ✅ SELECTED

**Key Features:**
- Full-width image viewer (100% of main 70% area)
- Contextual field properties panel below image
- Side panel (30%) with progress tracker and help tips
- Collapsible panel for maximum workspace

**Dimensions:**
- Main area: 70% width (panel visible) → 100% width (panel hidden)
- Image viewer: 100% of main area width
- Field properties: 1 column (panel visible) → 2 columns (panel hidden)

### Wireframe: Panel Visible (70/30 Split)

```
╔═══════════════════════════════════════════════════════════════════════════════════════╗
║ 🔷 Stella    Dashboard   Workflows   Documents   Settings         👤 Admin   ⚙️ Help ║
╚═══════════════════════════════════════════════════════════════════════════════════════╝

╔═════════════════════════════════════════════╦═════════════════════════════════════════╗
║ MAIN CONTENT AREA (70%)                     ║ SIDE PANEL (30%)         [◀ Hide Panel] ║
╠═════════════════════════════════════════════╬═════════════════════════════════════════╣
║                                             ║ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ ║
║ Phase 1 of 3                                ║ ┃ 📊 Your Progress                  ┃ ║
║ ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░ 33%            ║ ┃                                   ┃ ║
║                                             ║ ┃ ✓ Phase 1: Field Identification   ┃ ║
║ Create New Template                         ║ ┃   • 18 fields detected            ┃ ║
║ Define fields for traffic tickets          ║ ┃   • 3 need review                 ┃ ║
║                                             ║ ┃                                   ┃ ║
║ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ ║ ┃ ○ Phase 2: Data Extraction        ┃ ║
║ ┃ 📤 Upload Samples (2-3 files)          ┃ ║ ┃   (pending)                       ┃ ║
║ ┃ ✓ sample-1.pdf  ✓ sample-2.pdf        ┃ ║ ┃                                   ┃ ║
║ ┃ ✓ sample-3.pdf                         ┃ ║ ┃ ○ Phase 3: Accuracy & Approval    ┃ ║
║ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ ║ ┃   (pending)                       ┃ ║
║                                             ║ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ ║
║ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ ║                                       ║
║ ┃ 🖼️ IMAGE VIEWER (Full Width - 100%)    ┃ ║ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ ║
║ ┃                                         ┃ ║ ┃ 📊 Field Statistics               ┃ ║
║ ┃    ┌──────────────────────────────┐    ┃ ║ ┃                                   ┃ ║
║ ┃    │                              │    ┃ ║ ┃ Total Fields: 18                  ┃ ║
║ ┃    │   [Traffic Ticket - 2024]    │    ┃ ║ ┃                                   ┃ ║
║ ┃    │                              │    ┃ ║ ┃ 🟢 High Confidence: 14            ┃ ║
║ ┃    │   🔵 Ticket #:               │    ┃ ║ ┃ 🟡 Medium Confidence: 3           ┃ ║
║ ┃    │   🟢 ___________________     │    ┃ ║ ┃ 🔴 Low Confidence: 1              ┃ ║
║ ┃    │                              │    ┃ ║ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ ║
║ ┃    │   🔵 Driver Name:            │    ┃ ║                                       ║
║ ┃    │   🟢 ___________________     │    ┃ ║ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ ║
║ ┃    │                              │    ┃ ║ ┃ 💡 Need Help?                     ┃ ║
║ ┃    │   🔵 License Plate:          │    ┃ ║ ┃                                   ┃ ║
║ ┃    │   🟢 ___________________     │    ┃ ║ ┃ • Click any field to edit         ┃ ║
║ ┃    │                              │    ┃ ║ ┃ • Drag corners to resize          ┃ ║
║ ┃    │   🔵 Violation Date:         │    ┃ ║ ┃ • 🔵 Blue = labels                ┃ ║
║ ┃    │   🟢 ___________________     │    ┃ ║ ┃ • 🟢 Green = inputs               ┃ ║
║ ┃    │                              │    ┃ ║ ┃ • Tab to navigate fields          ┃ ║
║ ┃    │   🔵 Zip Code:               │    ┃ ║ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ ║
║ ┃    │   🟢 ___________________     │    ┃ ║                                       ║
║ ┃    └──────────────────────────────┘    ┃ ║                                       ║
║ ┃                                         ┃ ║                                       ║
║ ┃ [Show All] [Show Labels] [Show Inputs] ┃ ║                                       ║
║ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ ║                                       ║
║                                             ║                                       ║
║ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ ║                                       ║
║ ┃ ⚙️ SELECTED FIELD PROPERTIES (Single Col)┃ ║                                      ║
║ ┃                                         ┃ ║                                       ║
║ ┃ Field Name: Ticket Number               ┃ ║                                       ║
║ ┃ Field Type: [text ▼]                    ┃ ║                                       ║
║ ┃ ☑ Required Field                        ┃ ║                                       ║
║ ┃ Confidence: 95% 🟢                      ┃ ║                                       ║
║ ┃                                         ┃ ║                                       ║
║ ┃ [🗑️ Delete]  [📋 Duplicate]            ┃ ║                                       ║
║ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ ║                                       ║
║                                             ║                                       ║
║ [Cancel] [Save Draft v3]                   ║                                       ║
║                   [Retry Detection]        ║                                       ║
║                        [Proceed Phase 2 →] ║                                       ║
╚═════════════════════════════════════════════╩═════════════════════════════════════════╝

✅ PROS: Maximum image size | Better for complex docs | Contextual editing
❌ CONS: Can't see all fields | Must remember field locations | More clicking
```

### Wireframe: Panel Hidden (100% Width, 2-Column Layout)

```
╔═══════════════════════════════════════════════════════════════════════════════════════╗
║ 🔷 Stella    Dashboard   Workflows   Documents   Settings         👤 Admin   ⚙️ Help ║
╚═══════════════════════════════════════════════════════════════════════════════════════╝

╔═══════════════════════════════════════════════════════════════════════════════════════╗
║ MAIN CONTENT AREA (100% - Panel Hidden)                          [Show Panel →]       ║
╠═══════════════════════════════════════════════════════════════════════════════════════╣
║                                                                                       ║
║ Phase 1 of 3  ▓▓▓▓▓▓▓▓▓▓░░░░░░░░░░░░░░░░ 33%                                        ║
║ Create New Template | Define fields for traffic tickets                              ║
║                                                                                       ║
║ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ ║
║ ┃ 📤 Upload: ✓ sample-1.pdf  ✓ sample-2.pdf  ✓ sample-3.pdf    [+ Add More]      ┃ ║
║ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ ║
║                                                                                       ║
║ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ ║
║ ┃ 🖼️ IMAGE VIEWER (Full Width)          [Show All] [Show Labels] [Show Inputs]   ┃ ║
║ ┃                                                                                   ┃ ║
║ ┃    ┌──────────────────────────────────────────────────────────────────┐         ┃ ║
║ ┃    │                                                                  │         ┃ ║
║ ┃    │                     [Traffic Ticket - 2024]                      │         ┃ ║
║ ┃    │                                                                  │         ┃ ║
║ ┃    │   🔵 Ticket #:        🔵 Driver Name:      🔵 License Plate:    │         ┃ ║
║ ┃    │   🟢 ______________   🟢 ______________    🟢 ______________     │         ┃ ║
║ ┃    │                                                                  │         ┃ ║
║ ┃    │   🔵 Violation Date:  🔵 Violation Code:   🔵 Fine Amount:      │         ┃ ║
║ ┃    │   🟢 ______________   🟢 ______________    🟢 ______________     │         ┃ ║
║ ┃    │                                                                  │         ┃ ║
║ ┃    │   🔵 Address:         🔵 City:             🔵 State:             │         ┃ ║
║ ┃    │   🟢 ___________________________________________  🟢 _____       │         ┃ ║
║ ┃    │                                                                  │         ┃ ║
║ ┃    │   🔵 Zip Code:        🔵 Country:           🔵 Phone:            │         ┃ ║
║ ┃    │   🟢 ______________   🟢 ______________    🟢 ______________     │         ┃ ║
║ ┃    └──────────────────────────────────────────────────────────────────┘         ┃ ║
║ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ ║
║                                                                                       ║
║ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ ║
║ ┃ ⚙️ SELECTED FIELD PROPERTIES (2-Column Layout)                                  ┃ ║
║ ┃                                                                                   ┃ ║
║ ┃ Field Name: Ticket Number                 Field Type: [text ▼]                   ┃ ║
║ ┃ ☑ Required Field                          Confidence: 95% 🟢                     ┃ ║
║ ┃ ☐ External Validation                     Auto-detected: Yes                     ┃ ║
║ ┃                                                                                   ┃ ║
║ ┃ [🗑️ Delete]  [📋 Duplicate]  [+ Add Field]  [↻ Retry Detection]                ┃ ║
║ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ ║
║                                                                                       ║
║ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ ║
║ ┃ 📊 18 fields detected | 🟢 14 high | 🟡 3 medium | 🔴 1 low                    ┃ ║
║ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ ║
║                                                                                       ║
║ [Cancel] [Save Draft v3]                      [Retry Detection]  [Proceed Phase 2 →]║
╚═══════════════════════════════════════════════════════════════════════════════════════╝

✅ KEY BENEFITS (Panel Hidden + 2-Column):
• Maximum screen real estate (100% width)
• 2-column field properties → 50% height reduction
• Inline statistics banner (1 line vs panel)
• No scrolling on standard 1080p screens
• Ideal for focused editing mode
```

---

## Phase 2: Data Extraction & Testing

### Two Options Documented (Selection Pending)

#### Option B: Original Detailed Layout

**Features:**
- Separate upload section with file list
- Dedicated sample navigator section
- Full statistics panel in sidebar
- Spacious layout with clear visual separation

**Best For:** Large screens (4K), users who prefer breathing room

#### Option C: Compact Minimalist Layout ✅ RECOMMENDED

**Features:**
- Combined sample navigator in header (saves vertical space)
- Condensed statistics as inline badges
- Minimized chrome and padding
- 40% shorter than Option B

**Best For:** Standard 1080p-1440p screens, efficient workflows

### Wireframe: Option C (Compact) - RECOMMENDED

```
╔═══════════════════════════════════════════════════════════════════════════════════════╗
║ 🔷 Stella    Dashboard   Workflows   Documents   Settings         👤 Admin   ⚙️ Help ║
╚═══════════════════════════════════════════════════════════════════════════════════════╝

╔═════════════════════════════════════════════╦═════════════════════════════════════════╗
║ MAIN CONTENT AREA (70%)                     ║ SIDE PANEL (30%)         [◀ Hide Panel] ║
╠═════════════════════════════════════════════╬═════════════════════════════════════════╣
║ Phase 2 of 3  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░ 67% ║ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ ║
║                                             ║ ┃ ✓ Phase 1 Complete (18 fields)    ┃ ║
║ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ ║ ┃ ● Phase 2: Sample 3/10, Field 5/18┃ ║
║ ┃ 🔄 [◀] ticket-003.pdf (76% 🟡) [▶]    ┃ ║ ┃ ○ Phase 3 Pending                 ┃ ║
║ ┃ [Grid View] | 12 corrections | 2m 14s  ┃ ║ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ ║
║ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ ║                                       ║
║                                             ║ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ ║
║ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ ║ ┃ 📊 Issues: OCR:7 Missing:2        ┃ ║
║ ┃ ┌─────────────────────┬─────────────┐  ┃ ║ ┃     WrongBox:2 Valid:1            ┃ ║
║ ┃ │ 🖼️ IMAGE (60%)      │ 📝 REVIEW   │  ┃ ║ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ ║
║ ┃ │                     │ (40%)       │  ┃ ║                                       ║
║ ┃ │ ┌─────────────────┐ │             │  ┃ ║ ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓ ║
║ ┃ │ │  [Traffic Ticket│ │ Field 5/18  │  ┃ ║ ┃ 💡 Shortcuts                      ┃ ║
║ ┃ │ │   - 2024]       │ │ 🔵 License  │  ┃ ║ ┃ Tab: Next                         ┃ ║
║ ┃ │ │                 │ │    Plate    │  ┃ ║ ┃ Ctrl+M: Mark OK                   ┃ ║
║ ┃ │ │   🔵 Ticket#:   │ │             │  ┃ ║ ┃ Ctrl+E: Edit                      ┃ ║
║ ┃ │ │   🟢________    │ │ Extracted:  │  ┃ ║ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ ║
║ ┃ │ │                 │ │ ABC-1Z34    │  ┃ ║                                       ║
║ ┃ │ │   🔵 License:   │ │ 87% 🟡      │  ┃ ║                                       ║
║ ┃ │ │   🟢[ABC-1Z34] ←┼─┤             │  ┃ ║                                       ║
║ ┃ │ │      highlight  │ │ [✓ OK]      │  ┃ ║                                       ║
║ ┃ │ │                 │ │             │  ┃ ║                                       ║
║ ┃ │ │   🔵 Date:      │ │ OR          │  ┃ ║                                       ║
║ ┃ │ │   🟢________    │ │             │  ┃ ║                                       ║
║ ┃ │ │                 │ │ Fix:        │  ┃ ║                                       ║
║ ┃ │ │   🔵 Zip:       │ │ [________]  │  ┃ ║                                       ║
║ ┃ │ │   🟢________    │ │             │  ┃ ║                                       ║
║ ┃ │ │                 │ │ [OCR err▼]  │  ┃ ║                                       ║
║ ┃ │ └─────────────────┘ │ [Fix→]      │  ┃ ║                                       ║
║ ┃ │                     │             │  ┃ ║                                       ║
║ ┃ │ ▓▓▓▓▓░░░░░░░ 5/18  │             │  ┃ ║                                       ║
║ ┃ └─────────────────────┴─────────────┘  ┃ ║                                       ║
║ ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ ║                                       ║
║                                             ║                                       ║
║ [Cancel] [Save] [◀ Prev] [Next→] [Skip]   ║                                       ║
║                        [Proceed Phase 3 →] ║                                       ║
╚═════════════════════════════════════════════╩═════════════════════════════════════════╝

✅ PROS: Compact | Fast navigation | All info visible | Minimal scrolling
✨ HEIGHT: ~30 lines (vs ~50 for Option B) - No scrolling on 1080p
```

**Key Features:**
- Sample navigator combined with header (saves 4 lines)
- Condensed statistics as badges instead of full panel
- Split-screen: Image (60%) + Field Review (40%)
- Field-by-field navigation with highlighted bounding box
- Keyboard shortcuts: Tab, ↑↓, Ctrl+M, Ctrl+E, Ctrl+S
- Auto-advances to next field after action

---

## Responsive Behavior

### Breakpoint Strategy

| Screen Width | Panel State | Main Area | Field Properties Layout | Height |
|--------------|-------------|-----------|-------------------------|--------|
| **All sizes** | Visible | 70% | 1 column (vertical) | ~45 lines |
| **1280-1599px** | Hidden | 100% | **2 columns** ✅ | ~28 lines |
| **≥1600px** | Hidden | 100% | 2-3 columns (optional) | ~25 lines |

### Layout Transitions

**Panel Toggle Behavior:**
- **Show Panel (→):** Animates from 100% to 70% width, field properties collapse to 1 column
- **Hide Panel (←):** Animates from 70% to 100% width, field properties expand to 2 columns
- **State Persistence:** localStorage per-phase (key: `wizard_step{phase}_panel_visible`)
- **Animation Duration:** 300ms transition-all

### Field Properties Column Logic

```typescript
// Responsive layout hook
const useFieldPropertiesLayout = (isPanelVisible: boolean, screenWidth: number) => {
  // Panel visible: always single column (limited horizontal space)
  if (isPanelVisible) {
    return 'single-column';
  }

  // Panel hidden: use multi-column layout if space permits
  if (screenWidth >= 1600) {
    return 'three-column'; // Optional enhancement for 4K screens
  }

  if (screenWidth >= 1280) {
    return 'two-column'; // Optimal for 1080p-1440p
  }

  // Fallback for narrow screens (<1280px)
  return 'single-column';
};
```

### CSS Implementation

```css
/* Field Properties Panel */
.field-properties {
  display: grid;
  gap: 1rem;
  transition: all 300ms ease-in-out;
}

/* Single column (panel visible or narrow screens) */
.field-properties.single-column {
  grid-template-columns: 1fr;
}

/* Two columns (panel hidden, standard screens) */
.field-properties.two-column {
  grid-template-columns: 1fr 1fr;
}

/* Three columns (panel hidden, wide screens) */
.field-properties.three-column {
  grid-template-columns: 1fr 1fr 1fr;
}
```

---

## Implementation Guidance

### Component Hierarchy

```
CreateTemplatePage
├─ PhaseNavigation (tabs/stepper)
├─ Phase1FieldIdentification
│  ├─ UploadZone (drag-drop)
│  ├─ ImageViewer (bounding boxes, zoom, pan)
│  ├─ FieldPropertiesPanel (responsive 1/2-col)
│  └─ PhaseActions (cancel, save, proceed)
├─ Phase2DataExtraction
│  ├─ SampleNavigator (prev/next, grid view)
│  ├─ SplitScreenReview
│  │  ├─ DocumentImagePane (60%)
│  │  └─ FieldReviewPane (40%)
│  └─ PhaseActions
└─ Phase3AccuracyApproval
   ├─ AccuracyDashboard (overall %, drill-down)
   ├─ TestResultsTable (per-field breakdown)
   └─ ApprovalActions (upload more, approve)
```

### State Management

**localStorage Keys:**
- `stella-template-draft-{timestamp}` - Template draft data
- `wizard_step1_panel_visible` - Phase 1 panel state
- `wizard_step2_panel_visible` - Phase 2 panel state
- `wizard_step3_panel_visible` - Phase 3 panel state

**TypeScript Interfaces:**
See plan file lines 987-1003 for complete schemas:
- `TemplateDraft`
- `FieldDefinition`
- `TestResult`
- `Correction`
- `ExtractedField`

### Keyboard Shortcuts

| Key | Action | Phase |
|-----|--------|-------|
| **Tab** | Navigate to next field | 1, 2 |
| **Shift+Tab** | Navigate to previous field | 1, 2 |
| **↑↓** | Navigate fields (vertical) | 1, 2 |
| **Ctrl+M** | Mark field as correct | 2 |
| **Ctrl+E** | Edit field value | 2 |
| **Ctrl+S** | Save draft | All |
| **Esc** | Cancel/close modal | All |

### Responsive Utilities

```typescript
// Hook for screen width detection
export const useScreenWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return width;
};

// Hook for panel state with localStorage persistence
export const usePanelState = (phase: number, defaultVisible: boolean = true) => {
  const key = `wizard_step${phase}_panel_visible`;
  const [isPanelVisible, setIsPanelVisible] = useState<boolean>(() => {
    const stored = localStorage.getItem(key);
    return stored !== null ? stored === 'true' : defaultVisible;
  });

  useEffect(() => {
    localStorage.setItem(key, String(isPanelVisible));
  }, [isPanelVisible, key]);

  return [isPanelVisible, setIsPanelVisible] as const;
};
```

---

## Success Criteria

### Phase 1 Complete When:
- ✅ Admin can upload 2-3 samples (drag-drop)
- ✅ System displays auto-detected fields with color-coded bounding boxes
- ✅ Admin can edit field names, types, and properties
- ✅ Admin can add/remove/adjust fields
- ✅ Field statistics show confidence breakdown
- ✅ Panel toggle works with responsive layout (1/2-column)
- ✅ [Save Draft] persists to localStorage
- ✅ [Retry Detection] re-scans samples
- ✅ [Proceed Phase 2] advances to next phase

### Phase 2 Complete When:
- ✅ Admin can upload ~10 test samples (batch drag-drop)
- ✅ System extracts data from all fields with confidence scores
- ✅ Samples auto-sort by difficulty (hardest first)
- ✅ Split-screen review shows image + field panel
- ✅ Field-by-field navigation works with keyboard shortcuts
- ✅ Admin can mark correct or enter corrections with issue type
- ✅ All corrections logged with timestamp + issue category
- ✅ [Grid View] toggles multi-sample overview
- ✅ [Save Draft] persists progress
- ✅ [Proceed Phase 3] advances with all data

### Phase 3 Complete When:
- ✅ System calculates overall accuracy %
- ✅ Per-field accuracy breakdown displays (drill-down)
- ✅ Admin can set target accuracy threshold
- ✅ [Upload More Samples] returns to Phase 2 if accuracy < target
- ✅ [Approve Template] enabled when target met
- ✅ Template saves with status = 'active'
- ✅ Navigation returns to Step 3 with template auto-selected
- ✅ Success toast displays: "Template approved and selected!"

---

## Related Files

**Plan File:** `/Users/stewartshum/.claude/plans/vivid-swimming-lantern.md`
- Lines 608-622: Original workflow (business context)
- Lines 627-727: 10 improvements with implementation details
- Lines 731-843: Revised 3-phase workflow
- Lines 847-950: All UX decisions (Q1-Q6)
- Lines 954-1054: Technical specifications
- Lines 1060-1395: Complete wireframes (all options)

**Implementation Files (To Create):**
- `frontend/src/pages/CreateTemplatePage.tsx`
- `frontend/src/components/template/Phase1FieldIdentification.tsx`
- `frontend/src/components/template/Phase2DataExtraction.tsx`
- `frontend/src/components/template/Phase3AccuracyApproval.tsx`
- `frontend/src/components/template/ImageViewer.tsx`
- `frontend/src/components/template/FieldPropertiesPanel.tsx`
- `frontend/src/utils/templateStorage.ts`
- `frontend/src/types/template.ts`

---

**Last Updated:** February 12, 2026
**Status:** Ready for Implementation
**Next Step:** Senior Developer Review → Sprint Planning
