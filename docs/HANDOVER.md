# Create Template Feature - Developer Handover

**Date:** February 12, 2026
**Session:** UX/UI Design Brainstorming Complete
**Status:** ✅ Ready for Implementation
**Branch:** `claude/fix-completed-workflows-20260211-1803`

---

## Quick Start (5-Minute Read)

### What Was Accomplished Today

Complete wireframe specifications for the **Create Template** feature - a 3-phase admin workflow to create document templates for OCR processing.

**Timeline:** ~2 hours of intensive UX/UI design with user feedback
**Output:** Finalized wireframes, responsive layouts, complete implementation guidance

---

## 📋 What You Need to Read

### 1. **START HERE:** Wireframe Specifications (20-30 min read)
📄 **File:** [`docs/design/create-template-wireframes.md`](design/create-template-wireframes.md)

**Contains:**
- ✅ Complete ASCII wireframes for Phase 1 & 2
- ✅ Responsive layout strategy (2-column optimization)
- ✅ Component hierarchy and implementation guidance
- ✅ Keyboard shortcuts, state management, success criteria
- ✅ All design decisions with rationales

**Why this first?** Everything you need to start coding is in this doc.

---

### 2. **DEEP DIVE:** Complete Plan File (1-2 hour read)
📄 **File:** [`../.claude/plans/vivid-swimming-lantern.md`](../.claude/plans/vivid-swimming-lantern.md)

**Contains:**
- Lines 608-622: Original workflow (business context)
- Lines 627-727: 10 improvements with detailed implementations
- Lines 731-843: Revised 3-phase workflow
- Lines 847-950: All UX decisions (Q1-Q6 answered)
- Lines 954-1054: Technical specifications
- Lines 1060-1395: All wireframe options (including alternatives)
- Lines 1397+: Handover documentation (this context)

**When to read?** When you need business context, alternative designs, or detailed technical specs.

---

### 3. **REFERENCE:** Supporting Materials (optional)
- [`docs/roadmap/web3-evolution-and-mvp-plan.md`](roadmap/web3-evolution-and-mvp-plan.md) - Long-term vision (30-month roadmap)
- [`docs/reference/Soluz.io Doma 7.4 User Manual E.pdf`](reference/Soluz.io%20Doma%207.4%20User%20Manual%20E.pdf) - DocRoom feature analysis (inspiration)

**When to read?** For context on why we're building this and future directions.

---

## 🎯 What We're Building

### Feature: Create Template (Phase 0 - OCR Testing)

**User Journey:**
1. **Phase 1:** Admin uploads 2-3 sample traffic tickets → System auto-detects fields → Admin reviews/corrects
2. **Phase 2:** Admin uploads 10 test samples → System extracts data → Admin reviews field-by-field → Logs corrections
3. **Phase 3:** System calculates accuracy → Admin approves if ≥99.5% → Template integrates with Step 3

**Why Phase 0?** We need to test Ollama OCR accuracy before building the full MVP.

---

## 🎨 Key Design Decisions (Finalized)

| Decision | Selection | Why |
|----------|-----------|-----|
| **Interface** | Full page (not modal) | Complex 3-phase workflow needs space |
| **Phase 1 Layout** | Option B (horizontal split) | Maximizes image visibility |
| **Responsive** | 2-column when panel hidden | 50% height reduction on 1080p |
| **Phase 2 Layout** | Option C recommended (compact) | No scrolling on standard screens |
| **Storage** | localStorage → SQLite later | Fast POC, easy migration |
| **Navigation** | Free switching (tabs/stepper) | Allows iterative refinement |

---

## 📐 Responsive Layout (Critical)

```
Panel Visible (70/30 split):
  - Field properties: 1 column (vertical)
  - Height: ~45 lines (requires scrolling)

Panel Hidden (100% width):
  - Field properties: 2 columns (horizontal) ✨
  - Height: ~28 lines (no scrolling on 1080p) ✨
  - **This is the key optimization!**
```

**Breakpoints:**
- All sizes + panel visible → 1 column
- ≥1280px + panel hidden → 2 columns ✅
- ≥1600px + panel hidden → 2-3 columns (optional)

---

## 🏗️ Implementation Roadmap

### Sprint 1 (Week 1-2) - Phase 1 UI

**Files to Create:**
```
frontend/src/pages/
  CreateTemplatePage.tsx              # Main container with phase nav

frontend/src/components/template/
  Phase1FieldIdentification.tsx       # Phase 1 component
  UploadZone.tsx                       # Drag-drop upload
  ImageViewer.tsx                      # Document viewer with bbox overlay
  FieldPropertiesPanel.tsx             # Responsive 1/2-column layout

frontend/src/utils/
  templateStorage.ts                   # localStorage utilities

frontend/src/types/
  template.ts                          # TypeScript interfaces
```

**Tasks:**
1. Create `CreateTemplatePage` with 3-phase tabs/stepper
2. Build `UploadZone` with drag-drop
3. Build `ImageViewer` (can be placeholder for now)
4. Build `FieldPropertiesPanel` with responsive layout (1/2-col)
5. Implement panel toggle with localStorage persistence
6. Wire up Step 3 integration (navigation + auto-selection)

---

### Sprint 2 (Week 3-4) - Phase 2 & 3 UI

**Files to Create:**
```
frontend/src/components/template/
  Phase2DataExtraction.tsx             # Phase 2 component
  Phase3AccuracyApproval.tsx           # Phase 3 component
  SampleNavigator.tsx                  # Sample picker with prev/next
  SplitScreenReview.tsx                # 60/40 split for review
  AccuracyDashboard.tsx                # Overall % + drill-down
```

**Tasks:**
1. Build Phase 2 split-screen review
2. Implement field-by-field navigation + keyboard shortcuts
3. Build Phase 3 accuracy dashboard
4. Add correction logging with issue categorization
5. Implement all phase navigation

---

### Sprint 3-4 (Week 5-8) - Backend Integration

**Tasks:**
1. Integrate Ollama OCR (field detection)
2. Implement data extraction pipeline
3. Add auto-retry logic (3 attempts + fallback)
4. Implement sample difficulty sorting
5. End-to-end testing with real traffic ticket samples

---

## 🔧 Technical Details

### TypeScript Interfaces (From Plan)

```typescript
interface TemplateDraft {
  id: string;
  name: string;
  phase: 1 | 2 | 3;
  samples: UploadedSample[];
  fields: FieldDefinition[];
  testResults: TestResult[];
  accuracy: number;
  targetAccuracy: number;
  createdAt: string;
  lastModified: string;
}

interface FieldDefinition {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'currency' | 'zip-code' | 'country-code';
  boundingBox: { x: number; y: number; width: number; height: number };
  required: boolean;
  confidence?: number;
  validationRules?: ValidationRule[];
}

// See plan file lines 987-1003 for complete schemas
```

### Keyboard Shortcuts

| Key | Action | Phase |
|-----|--------|-------|
| Tab | Next field | 1, 2 |
| Shift+Tab | Previous field | 1, 2 |
| ↑↓ | Navigate fields | 1, 2 |
| Ctrl+M | Mark correct | 2 |
| Ctrl+E | Edit value | 2 |
| Ctrl+S | Save draft | All |

### State Management

**localStorage Keys:**
- `stella-template-draft-{timestamp}` - Draft data
- `wizard_step1_panel_visible` - Phase 1 panel state
- `wizard_step2_panel_visible` - Phase 2 panel state
- `wizard_step3_panel_visible` - Phase 3 panel state

---

## ❓ Questions for You

### Before Starting:
1. Should we create a new branch or continue on `claude/fix-completed-workflows-20260211-1803`?
2. Do you need Ollama backend endpoints first, or start with mock data?
3. Phase 1/2/3: Separate pages or tabs within `CreateTemplatePage`?
4. Any existing components for image viewer with bounding boxes?
5. State management preference? (Context, Zustand, Redux?)

### Design Clarifications:
1. Phase 2: Implement both layouts or just Compact (Option C)?
2. Panel toggle: Per-phase state or global?
3. Need full keyboard shortcut list beyond those specified?

---

## ✅ Success Criteria

**Phase 0 Complete When:**
- ✅ Admin can upload & review samples
- ✅ System displays auto-detected fields (mocked for Phase 0)
- ✅ Admin can correct field definitions
- ✅ Admin can test with 10 samples
- ✅ Admin can review extracted data field-by-field
- ✅ System calculates accuracy
- ✅ Template can be approved and auto-selects in Step 3
- ✅ All state persists to localStorage (resume capability)

---

## 📞 Next Steps

1. **Read wireframe doc** (20-30 min): [`docs/design/create-template-wireframes.md`](design/create-template-wireframes.md)
2. **Review plan file** (optional deep dive): [`../.claude/plans/vivid-swimming-lantern.md`](../.claude/plans/vivid-swimming-lantern.md)
3. **Ask questions** (before coding): Post in chat/Slack/email
4. **Create branch** (if needed): `git checkout -b feature/create-template`
5. **Start Sprint 1**: Begin with `CreateTemplatePage.tsx` scaffolding

---

## 📚 Additional Resources

**Existing Codebase References:**
- Quick Start Wizard pattern: `frontend/src/pages/QuickStartPage.tsx`
- WizardLayout component: `frontend/src/components/wizard/WizardLayout.tsx`
- Step 3 integration point: `frontend/src/components/wizard/Step3DocumentTypes.tsx` (line 158-162)
- Existing UI components: `frontend/src/components/ui/`

**Color Scheme:**
- Design system: [`DESIGN_SYSTEM.md`](../DESIGN_SYSTEM.md)
- Accessibility: [`COLOR_ACCESSIBILITY.md`](../COLOR_ACCESSIBILITY.md)
- Primary color: Teal (#20B2AA, #14A8A3, #0D9D97)
- Confidence colors: Green (>90%), Yellow (70-90%), Red (<70%)

---

## 🎉 Summary

You have everything you need to start building:
- ✅ Complete wireframes with ASCII visualization
- ✅ Responsive layout specifications
- ✅ Component hierarchy and file structure
- ✅ TypeScript interfaces and state management
- ✅ Implementation roadmap (3 sprints)
- ✅ Success criteria and testing guidance

**Time to build:** Estimated 6-8 weeks for complete Phase 0 feature.

**Questions?** Reach out before starting - better to align early than refactor later!

---

**Good luck and happy coding! 🚀**
