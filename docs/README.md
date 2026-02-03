# Stella Documentation

This directory contains all design specifications, session logs, and diagrams for the Stella Document OCR SaaS platform.

---

## 📁 Directory Structure

```
docs/
├── specs/                      # Master Specifications (SINGLE SOURCE OF TRUTH)
│   ├── WIZARD_SPEC.md         # Quick Start Wizard complete specification
│   ├── WORKFLOW_EDITOR_SPEC.md (future)
│   └── DASHBOARD_SPEC.md      (future)
│
├── sessions/                   # Session Logs (Decision History)
│   ├── SESSION_2026-02-01_wizard-step1.md
│   ├── SESSION_2026-01-31_wizard-design.md
│   └── ... (one per session)
│
└── diagrams/                   # Mermaid Flow Diagrams
    ├── README.md
    ├── app-flow.md
    └── quick-start-wizard-flow.md
```

---

## 🎯 Documentation Philosophy

### Master Specs = What to Build NOW
- **Location:** `/docs/specs/`
- **Purpose:** Single source of truth for current implementation
- **Audience:** Developers, QA, Product Managers
- **Content:** Final decisions, complete specifications, approved designs
- **Updates:** Modified at END of each session with final decisions

### Session Logs = What Changed and WHY
- **Location:** `/docs/sessions/`
- **Purpose:** Decision history and rationale
- **Audience:** Design team, future team members, stakeholders
- **Content:** Decisions made, alternatives considered, discussions, Q&A
- **Updates:** Created DURING each session, finalized at end

### Diagrams = Visual Flows
- **Location:** `/docs/diagrams/`
- **Purpose:** Visualize user journeys and app navigation
- **Audience:** Everyone (high-level overview)
- **Content:** Mermaid diagrams for flows, workflows, navigation
- **Updates:** Updated when significant UX/flow changes occur

---

## 🔍 How to Find Information

### "What are the current wizard fields?"
➜ Read `/docs/specs/WIZARD_SPEC.md`

### "Why did we choose 7 fields instead of 13?"
➜ Read `/docs/sessions/SESSION_2026-02-01_wizard-step1.md`

### "What does the overall wizard flow look like?"
➜ Read `/docs/diagrams/quick-start-wizard-flow.md`

### "What changed in yesterday's session?"
➜ Read latest session log in `/docs/sessions/`

---

## 🚀 For Developers

### Before Starting Implementation
1. **Read the Master Spec** for your feature
   - Example: Implementing wizard? Read `WIZARD_SPEC.md`
2. **Check related diagrams** for context
   - Example: See `quick-start-wizard-flow.md` for visual overview
3. **Skim recent session logs** if you need to understand "why"
   - Example: "Why no company size field?" → See session log

### While Implementing
- **Follow the Master Spec exactly** - it's the approved design
- **If something is unclear or incomplete** - ask before assuming
- **Propose changes** via session discussion (don't modify spec directly)

### After Implementation
- **No need to update Master Spec** - design team handles this
- **Link your PR to the related spec** in PR description

---

## 📝 For Designers / PMs

### Before a Design Session
1. **Read existing Master Spec** for the feature
2. **Review related session logs** to understand previous decisions
3. **Check diagrams** for overall context

### During a Design Session
1. **Create a session log** as you work (or update at end)
2. **Document all decisions** in session log
3. **Note alternatives considered** and why they were rejected

### After a Design Session
1. **Update the Master Spec** with final approved design
2. **Finalize the session log** with all decisions/changes
3. **Update change log** at bottom of Master Spec
4. **Commit both files** to git
5. **Create follow-up tasks** if needed

---

## 📋 Session Log Template

```markdown
# Session: [Feature Name] - [Specific Focus]

**Date:** YYYY-MM-DD
**Branch:** claude/branch-name
**Participants:** [Names]
**Status:** [In Progress / Completed]

## Session Objectives
- [ ] Objective 1
- [ ] Objective 2

## Key Decisions Made
1. Decision 1
2. Decision 2

## Changes to Master Spec
- Updated Section X
- Added Section Y

## Files Created
- file1.md
- file2.tsx

## Files Modified
- file3.md (changed X to Y)

## Next Steps
- [ ] Task 1
- [ ] Task 2

## Alternatives Considered
**Option A:** Description
- ❌ Rejected: Reason

**Option B:** Description ✅
- ✅ Selected: Reason

## Open Questions
1. Question 1
2. Question 2

## Notes
Additional context, user preferences, etc.
```

---

## 🔄 Workflow Example

### Scenario: Designing Step 2 of Wizard

#### Designer/PM Actions:
1. Read `WIZARD_SPEC.md` (current state of wizard)
2. Read `SESSION_2026-02-01_wizard-step1.md` (how Step 1 was designed)
3. Create `SESSION_2026-02-02_wizard-step2.md` to log today's session
4. Design Step 2 (wireframes, discussions, decisions)
5. Update `WIZARD_SPEC.md` with Step 2 specification
6. Finalize session log with all decisions
7. Commit both files to git

#### Developer Actions:
1. Read `WIZARD_SPEC.md` → find Step 2 section
2. Implement exactly as specified
3. Create PR linking to `WIZARD_SPEC.md`
4. If questions arise, check session log or ask team

#### Future Team Member Actions:
1. Want to understand wizard design? → Read `WIZARD_SPEC.md`
2. Want to know why certain decisions were made? → Read session logs
3. Want to see visual flow? → Read `quick-start-wizard-flow.md`

---

## 📚 Related Documentation (Root Level)

- **`/MVP_REQUIREMENTS.md`** - Overall project requirements
- **`/DESIGN_SYSTEM.md`** - Color palette, typography, components
- **`/COLOR_ACCESSIBILITY.md`** - WCAG compliance analysis
- **`/SESSION_SUMMARY.md`** - Previous session summary (login/dashboard)

---

## 🆘 Common Scenarios

### "I need to change a field in Step 1"
1. Discuss with team (don't change spec directly)
2. Create a session log documenting the discussion
3. Update `WIZARD_SPEC.md` with approved change
4. Update session log with decision rationale
5. Commit both files

### "I'm confused about duplicate company validation"
1. Read `WIZARD_SPEC.md` Step 1 → Validation Rules section
2. Still unclear? Read session log for context
3. Still unclear? Ask team

### "I want to see what was decided last week"
1. Check `/docs/sessions/` for recent session logs
2. Each log has date in filename
3. Read the "Key Decisions Made" section

### "I'm starting work on a new feature"
1. Check if a Master Spec exists in `/docs/specs/`
2. If yes → implement according to spec
3. If no → create a session log and design spec first

---

## ✅ Best Practices

### DO:
- ✅ Read Master Spec before implementing
- ✅ Update Master Spec at end of design sessions
- ✅ Create session logs for all design work
- ✅ Document "why" in session logs, "what" in specs
- ✅ Keep Master Specs concise and current
- ✅ Keep session logs detailed and comprehensive

### DON'T:
- ❌ Modify Master Specs during implementation (unless approved)
- ❌ Skip session logs for "small" changes
- ❌ Assume things not in the spec
- ❌ Let Master Specs get outdated
- ❌ Use session logs as specs (they're history, not current state)

---

## 🔗 Quick Links

**Current Sprint:**
- Master Spec: [WIZARD_SPEC.md](specs/WIZARD_SPEC.md)
- Latest Session: [SESSION_2026-02-01](sessions/SESSION_2026-02-01_wizard-step1.md)
- Flow Diagram: [quick-start-wizard-flow.md](diagrams/quick-start-wizard-flow.md)

**Design System:**
- [DESIGN_SYSTEM.md](../DESIGN_SYSTEM.md)
- [COLOR_ACCESSIBILITY.md](../COLOR_ACCESSIBILITY.md)

**Project:**
- [MVP_REQUIREMENTS.md](../MVP_REQUIREMENTS.md)

---

## 📞 Questions?

If you have questions about this documentation structure:
- Ask in the design channel
- Create an issue in the repo
- Contact the design team lead

---

**Last Updated:** 2026-02-01
**Maintained By:** Design & Engineering Team
**Version:** 1.0.0
