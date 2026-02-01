# Session: Quick Start Wizard - Step 1 Design

**Date:** 2026-02-01
**Branch:** `claude/refine-ocr-wizard-70WKs`
**Participants:** User, Claude (Senior UX/UI Designer role)
**Status:** In Progress

---

## Session Objectives

1. ✅ Locate and review existing Quick Start wizard implementation
2. ✅ Evaluate current UX for Steps 1-6
3. ✅ Propose improvements to wizard flow
4. ✅ Establish documentation structure (Master Spec + Session Logs)
5. 🔄 Design Step 1: Company Info wireframe
6. ⏳ Finalize Step 1 specification
7. ⏳ Implement Step 1 in code

---

## Key Decisions Made

### 1. Documentation Structure ✅
- **Adopted:** Option A - Master Spec + Session Logs (separate files)
- **Created:**
  - `/docs/specs/WIZARD_SPEC.md` - Single source of truth for wizard
  - `/docs/sessions/SESSION_YYYY-MM-DD_*.md` - Change history per session
- **Rationale:** Clear separation between current state (spec) and decision history (sessions)

### 2. Global Wizard Template ✅
- **Confirmed:** All wizard steps MUST include global header/main navigation
- **Layout:** 70% main content / 30% side panel
- **Consistency:** Same navigation bar used across Dashboard, Workflows, Jobs, etc.
- **Rationale:** Maintain consistency across app, allow easy wizard exit

### 3. Step 1 Field List ✅
**Reduced from 13 fields (original flow diagram) to 7 core fields:**
1. Company Name *
2. Industry * (dropdown)
3. No. of Lines of Business * (number)
4. Country * (autocomplete)
5. Contact Name *
6. Contact Email *
7. Contact Phone *

**Removed:**
- ❌ Company Size field (redundant with Lines of Business)
- ❌ Address fields (City, State, Postal Code) - not needed for MVP
- ❌ Contact 2 by default (made expandable/optional)

### 4. Industry Dropdown Values ✅
**Finalized list:**
- Banking & Finance
- Insurance
- Healthcare
- Government & Public Sector
- Legal Services
- Other

**Rationale:** Matches template categories and target industries

### 5. Validation Behavior ✅
- **Duplicate company check:** On blur (not on Next button or real-time)
- **Other validations:** On Next button click
- **Rationale:** Balance between immediate feedback and performance

### 6. Additional Contacts ✅
- **Behavior:** "+ Add another contact" link expands inline under Contact 1
- **Fields:** Same 3 fields (Name, Email, Phone) - all optional
- **Rationale:** Reduces form complexity, allows progressive disclosure

### 7. Side Panel Content ✅
- **Included:** Progress stepper + "Need Help?" box
- **Purpose:** Show progress, provide contextual help
- **Status:** Testing this approach in Step 1

---

## Changes to Master Spec

### WIZARD_SPEC.md Updates
1. ✅ Global Wizard Template section added
   - Layout structure documented
   - Component specifications defined
   - Navigation rules clarified
   - Design specifications (spacing, colors, typography)

2. ✅ Step 1: Company Info fully specified
   - 7 fields defined with validation rules
   - Visual layout documented
   - Error messages specified
   - State management structure defined

3. ✅ Steps 2-6 placeholders added
   - Pending future sessions

---

## Design Decisions

### Layout & Spacing
- **Form spacing:** Reduced to 8px between fields (from 16px) for more compact form
- **Section spacing:** 16px between sections
- **Card padding:** 16px for forms
- **Rationale:** Reduce vertical scroll, keep form visible without scrolling

### Visual Grouping
- **3 sections:** Company Details, Location, Primary Contact
- **Section headers:** Uppercase, small font, Navy Dark color
- **Rationale:** Clear visual hierarchy, easier scanning

### Progressive Disclosure
- **Contact 2:** Hidden by default, expands inline when needed
- **Rationale:** 80% of users only need one contact, reduce initial complexity

### Smart Defaults
- **Country field:** Pre-selected based on browser locale (e.g., "United States")
- **Rationale:** Reduce user effort, faster form completion

---

## UX Improvements Proposed (Cross-Step)

### Critical Changes (Recommended)
1. ✅ Add consistent step template with global header/nav
2. ✅ Add progress bar/stepper to all steps
3. 🔄 Reduce Step 1 from 13 to 7 fields
4. ⏳ Simplify Step 4 (remove code editor, use presets)
5. ⏳ Simplify Step 5 (single volume estimate instead of LOB sections)
6. ⏳ Add smart defaults throughout

### Medium Priority
- Improve Skip alerts (inline warnings instead of dialogs)
- Add autosave every 30 seconds
- Add resume indicator on dashboard

### Low Priority
- Add animations between steps
- Add keyboard shortcuts
- Add tooltips for complex fields

---

## Questions Asked During Session

### Q1: Where did the additional fields come from?
**Answer:** Fields were incorrectly inferred from vague documentation:
- `quick-start-wizard-flow.md:133-137` only said "13 fields including company name, industry, address, contact details"
- `MVP_REQUIREMENTS.md:246` only mentioned "Company info (name, industry)"
- No actual field list existed in documentation

**Resolution:** User provided correct field list, which is now documented in WIZARD_SPEC.md

### Q2: Should we have a session MD for every session?
**Answer:** Yes - adopted Option A (Master Spec + Session Logs)

### Q3: Which fields are actually needed?
**Answer:** 7 core fields only (see Step 1 specification)

---

## Files Created

1. ✅ `/docs/specs/WIZARD_SPEC.md` - Master specification (single source of truth)
2. ✅ `/docs/sessions/SESSION_2026-02-01_wizard-step1.md` - This session log

---

## Files Modified

None yet (design phase only)

---

## Next Steps

### Immediate (This Session)
- [ ] Create Step 1 low-fidelity wireframe (corrected version)
- [ ] Get user approval on wireframe
- [ ] Create Step 1 implementation plan

### Next Session
- [ ] Implement Step 1 component (`Step1CompanyInfo.tsx`)
- [ ] Implement global wizard template (`WizardLayout.tsx`)
- [ ] Test Step 1 in browser
- [ ] Design Step 2: Template Selection

---

## Alternatives Considered

### Step 1 Field Reduction
**Option A:** Keep all 13 fields (original)
- ❌ Rejected: Too overwhelming for first step

**Option B:** Reduce to 7 core fields ✅
- ✅ Selected: Faster completion, less abandonment

### Contact 2 Handling
**Option A:** Show inline by default
- ❌ Rejected: Adds unnecessary fields for most users

**Option B:** Show in modal
- ❌ Rejected: Breaks flow, extra clicks

**Option C:** Expandable inline ✅
- ✅ Selected: Progressive disclosure, keeps flow

### Documentation Structure
**Option A:** Master Spec + Session Logs ✅
- ✅ Selected: Clear separation, easier for dev team

**Option B:** Single file with appendices
- ❌ Rejected: File would get too long

---

## Risks & Mitigations

### Risk: Field list incomplete
**Mitigation:** User validated final field list, now documented in WIZARD_SPEC.md

### Risk: Future sessions lose context
**Mitigation:** Session logs document all decisions, master spec always current

### Risk: Dev team builds wrong thing
**Mitigation:** WIZARD_SPEC.md is single source of truth, dev team reads this only

---

## User Preferences Noted

1. **Documentation:** Wants clear, structured specs - no assumptions
2. **Consistency:** Global header/nav must be on all wizard screens
3. **Simplicity:** Prefers fewer fields, progressive disclosure
4. **Validation:** On blur for critical checks (duplicates), on submit for others
5. **Industry values:** Specific list provided (Banking, Insurance, Healthcare, Government, Legal, Other)

---

## Open Questions

1. **Step 1 wireframe approval:** Waiting for user to review corrected wireframe
2. **Side panel content:** Is "Need Help?" box useful or should it be removed?
3. **Implementation timing:** Should we implement Step 1 before designing Steps 2-6, or design all steps first?

---

## Blockers

None currently

---

## Success Criteria

### For This Session
- [x] Documentation structure established
- [x] WIZARD_SPEC.md created with global template
- [x] Step 1 fields finalized and documented
- [ ] Step 1 wireframe approved by user
- [ ] Clear path forward for implementation

### For Next Session
- [ ] Step 1 implemented and working in browser
- [ ] Global wizard template components created
- [ ] Step 2 designed and specified

---

## Notes

- User caught incorrect field assumptions - good reminder to always ask instead of inferring
- Documentation structure (Option A) will prevent similar issues in future
- Global wizard template ensures consistency across all steps
- Session logs will help future team members understand decision rationale

---

**Session Duration:** ~2 hours
**Next Session:** Continue with Step 1 wireframe approval and implementation
**Related Issues:** None
**Related PRs:** To be created after implementation

---

## Appendix: Original Flow Diagram Analysis

**Source:** `docs/diagrams/quick-start-wizard-flow.md`

**Original Step 1 Description:**
- "13 fields including company name, industry, address, contact details"
- Country search with autocomplete
- Duplicate company name check

**Issues Found:**
- No specific field list provided
- Ambiguous field count
- Address fields not necessary for MVP

**Resolution:**
- User provided exact field list (7 fields)
- Documented in WIZARD_SPEC.md
- Original flow diagram needs updating (future task)

---

**Last Updated:** 2026-02-01
**Maintained By:** Design Team
**Review Status:** In Progress
