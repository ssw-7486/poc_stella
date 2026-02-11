CLAUDE.md

Authoritative operating instructions for Claude Code in the Stella repository

⸻

Role of This File

This file defines how Claude must operate in this repository.

It complements but does not replace:
	•	0_START_HERE.md → startup protocol and safety rules (highest authority)
	•	README.md → project overview and usage

If there is any conflict:
0_START_HERE.md → CLAUDE.md → README.md → all other documents

Historical documents never override current instructions.

⸻

Repository Overview (Context Only)

Stella POC is a local MVP proof-of-concept for a document OCR SaaS that processes mixed documents (handwritten + machine-printed).

Key constraints:
	•	Demo-focused, not production
	•	Optimized for clarity, debuggability, and visible correctness
	•	Local development only

Frontend
	•	Active code lives in /frontend/ (Vite + React)
	•	Root-level Next.js setup (/app/) is inactive and must not be modified unless explicitly requested

Backend
	•	Python skeleton exists in /backend/
	•	Backend is not yet implemented

Do not upgrade architecture, tooling, or abstractions unless explicitly instructed.

⸻

Mandatory Reading Order (Non-Negotiable)

Before proposing or making any changes, Claude must read:
	1.	0_START_HERE.md
	2.	README.md
	3.	This file (CLAUDE.md)

Only after that may Claude consult conditional documents (see below).

Session-Startup Checklist (Required)

Before beginning any task, Claude must complete and confirm the following checklist in writing.

0. Git Workflow Setup (MANDATORY)

**CRITICAL:** Never work directly on master. Always use a feature branch.

**ENFORCEMENT:** Run this startup script at the beginning of EVERY session before any work.

```bash
echo "=== CLAUDE SESSION STARTUP CHECK ==="

# 1. Check for uncommitted changes (auto-stash if needed)
if [ -n "$(git status --porcelain)" ]; then
  echo "Uncommitted changes detected. Auto-stashing..."
  git stash push -u -m "claude session autostash $(date '+%Y-%m-%d %H:%M')" || {
    echo "❌ Stash failed. STOP."
    exit 1
  }
  echo "✅ Changes stashed. Will restore after branch creation."
  STASHED=1
else
  STASHED=0
fi

# 2. Ensure we are on master and synced
git checkout master || exit 1
git fetch origin || exit 1
git pull --ff-only origin master || {
  echo "❌ Master is not fast-forward clean. STOP."
  exit 1
}

# 3. Show branch + remote status
echo ""
echo "=== BRANCH STATUS ==="
git status -sb
git remote -v

# 4. Create a new working branch (required)
BRANCH="claude/session-$(date +%Y%m%d-%H%M)"
git checkout -b "$BRANCH" || exit 1
git push -u origin "$BRANCH" || exit 1

# 5. Restore stashed changes (if any)
if [ $STASHED -eq 1 ]; then
  echo ""
  echo "Restoring stashed changes..."
  git stash pop || {
    echo "⚠️  Stash pop failed. Changes remain in stash."
  }
fi

echo ""
echo "✅ Session branch created: $BRANCH"
echo "All work must be committed here."
echo "NEVER push directly to master."
```

**Confirm to user:**
- ✅ Uncommitted changes auto-stashed (if any)
- ✅ Master synced with origin
- ✅ New session branch created: `claude/session-YYYYMMDD-HHMM`
- ✅ Branch pushed to origin and tracking remote
- ✅ Stashed changes restored (if any)

**If the startup check fails:**
- STOP immediately
- Report the error to the user
- Ask for guidance before proceeding

**Rationale:** Working on master creates merge conflicts when remote diverges. Feature branches enable clean PR workflow and prevent push conflicts. Auto-stash preserves work-in-progress.

⸻

1. Context Confirmation

State explicitly:
	•	Current git branch
	•	Whether the task is frontend, backend, documentation, or planning
	•	Which part of the system is in scope (e.g., Quick Start Wizard, Dashboard, docs only)

If any of these are unclear, stop and ask.

⸻

2. Files Read

Confirm that you have read:
	•	0_START_HERE.md
	•	README.md
	•	CLAUDE.md

If you consulted any conditional documents, list them and explain why:
	•	MVP_REQUIREMENTS.md
	•	/docs/sessions/*
	•	Other docs (name explicitly)

Do not claim alignment with documents you have not read.

⸻

3. Authority Check

Explicitly state:
	•	Which document governs the task
	•	Whether any historical documents were used only for context

If there is any ambiguity or conflict between documents, stop and ask before proceeding.

⸻

4. File Target Sanity Check

List the exact files you believe are relevant to this task.

Confirm:
	•	Which files are active
	•	Which similarly named files must not be modified
	•	That you are not editing inactive or deprecated paths (e.g., /app/ unless instructed)

⸻

5. Expected Outcome

Describe in one or two sentences:
	•	What will visibly change if the task is successful
	•	How the user can verify it worked

If success cannot be visibly verified, say so explicitly.

⸻

6. Go / No-Go Declaration

End the checklist with one of the following:
	•	“Ready to proceed.”
	•	“Blocking questions before proceeding:” (list them)

Claude must not begin execution until this checklist is complete.

⸻

Mandatory End-of-Session Protocol (Required)

**CRITICAL:** Before ending any session, Claude must run this end-of-session script and confirm results.

**ENFORCEMENT:** Run this at the conclusion of EVERY session to ensure work is committed, pushed, validated, and PR is created.

```bash
echo "=== CLAUDE SESSION END CHECK ==="

# 1. Refuse to run on master
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" = "master" ]; then
  echo "❌ You are on master. Work must not be committed directly to master."
  exit 1
fi

# 2. Show status
echo ""
echo "=== WORKING TREE STATUS ==="
git status -sb

# 3. Auto-add changes (if any)
if [ -n "$(git status --porcelain)" ]; then
  echo ""
  echo "Changes detected. Committing..."
  git add -A
  git commit -m "Claude session work: $(date '+%Y-%m-%d %H:%M')" || exit 1
else
  echo "No uncommitted changes."
fi

# 4. Push branch (ensures nothing is local-only)
git push -u origin "$CURRENT_BRANCH" || exit 1

# 5. Lint + Build (safety gate)
echo ""
echo "=== BUILD VALIDATION ==="
cd frontend || exit 1
npm run lint || exit 1
npm run build || exit 1
cd ..

# 6. Create PR (if none exists)
echo ""
echo "=== PULL REQUEST CHECK ==="
if ! gh pr view "$CURRENT_BRANCH" >/dev/null 2>&1; then
  gh pr create \
    --base master \
    --head "$CURRENT_BRANCH" \
    --title "Claude: $CURRENT_BRANCH" \
    --body "Automated PR from Claude session." || exit 1
else
  echo "PR already exists."
fi

echo ""
echo "✅ End-of-session complete."
echo "Branch pushed. Build passed. PR created or confirmed."
```

**Confirm to user:**
- ✅ Not on master branch (safety check passed)
- ✅ All changes committed (if any)
- ✅ Branch pushed to origin
- ✅ Lint passed
- ✅ Build passed
- ✅ PR created or already exists

**If the end-of-session check fails:**
- Report which step failed
- Show the error to the user
- Ask for guidance on how to proceed

**Rationale:** Ensures all work is safely committed, validated, and ready for review. Prevents local-only work from being lost. Automates PR creation for clean handoff.

⸻

Post-Merge Cleanup (Manual)

After a PR is merged to master, clean up the session branch to keep the repository tidy.

**IMPORTANT:** This is a MANUAL process. Do NOT run automatically unless explicitly requested by the user.

```bash
echo "=== POST-MERGE CLEANUP ==="

# 1. Switch to master and sync
git checkout master
git fetch origin
git pull --ff-only origin master

# 2. Identify merged branches
echo ""
echo "=== MERGED SESSION BRANCHES ==="
git branch --merged master | grep "claude/session-"

# 3. Delete local session branches
echo ""
echo "Deleting local session branches..."
git branch --merged master | grep "claude/session-" | xargs -n 1 git branch -d

# 4. Delete remote session branches
echo ""
echo "Deleting remote session branches..."
git branch -r --merged master | grep "origin/claude/session-" | sed 's/origin\///' | xargs -n 1 git push origin --delete

echo ""
echo "✅ Cleanup complete."
echo "Merged session branches removed from local and remote."
```

**When to use:**
- After PR is merged to master
- Periodically to clean up old merged branches
- Only when explicitly requested by user

**Safety:**
- Only deletes branches that are fully merged to master
- Uses `--merged` flag to prevent accidental deletion of unmerged work
- User must run manually to maintain control

⸻

Conditional Reference Documents

The following documents provide context, not instructions.
Consult them only when relevant to the task.

MVP Requirements
	•	File: /MVP_REQUIREMENTS.md
	•	Use when:
	•	Evaluating scope or demo completeness
	•	Working on workflows or the Quick Start wizard
	•	Assessing whether a feature is “done” for MVP
	•	Authority: contextual (never overrides 0_START_HERE.md)

Session Summaries
	•	Location: /docs/sessions/*
	•	Use when:
	•	The user references a prior discussion or decision
	•	Avoiding repetition of previously rejected ideas
	•	Authority: historical only

Session summaries are never instructions unless explicitly stated.

⸻

Operating Mode for Stella

Claude must operate in MVP-safe mode:
	•	Prefer minimal, reversible changes
	•	Avoid refactors unless explicitly requested
	•	Optimize for visible correctness over elegance
	•	Assume changes will be demoed live on a local machine

If a change increases risk, scope, or cognitive load, call it out before proceeding.

⸻

Required Change Protocol (Mandatory)

For every task, Claude must follow this sequence:

1. Understanding

Restate what is being requested and what is explicitly out of scope.

2. File Impact List

List every file you plan to:
	•	Create
	•	Modify
	•	Delete

Files not listed here must not be touched.

3. Verification Plan

Explain how success will be confirmed:
	•	Visible UI change
	•	Console output
	•	File diff
	•	Rendered markdown

If verification is not possible, say so clearly.

4. Execute

Make the change exactly as planned.

5. Self-Test & Verify

Before claiming the task is complete, Claude must:

**Run Build & Lint:**
```bash
cd frontend
npm run build    # Must pass with no TypeScript errors
npm run lint     # Must pass with no ESLint errors
```

If either command fails, fix the issues before proceeding.

**Verify Dev Server Changes:**
	•	Confirm the dev server is running at http://localhost:5173
	•	State exactly what should be visible in the browser and where
	•	If the change is not immediately visible, add a temporary marker to confirm runtime visibility

**User Verification Instructions:**
At the end of your response, include a "How to Verify" section with the **exact branch name** and these steps:

```bash
# 1. Confirm current location and branch
pwd
ls  # Should see frontend/ folder
git branch --show-current

# 2. Fetch and switch to the correct branch
# If this is a NEW branch that Claude just created:
git fetch origin <BRANCH-NAME>
git switch -c <BRANCH-NAME> origin/<BRANCH-NAME>

# If this branch ALREADY EXISTS locally:
git pull origin <BRANCH-NAME>

# Verify you're on the right branch:
git branch --show-current
git log --oneline -3  # Should show Claude's recent commits

# 3. Enter frontend and restart Vite
cd frontend
rm -rf node_modules/.vite
npm install
npm run dev

# 4. Open http://localhost:5173 in your browser
# 5. [Specific instructions for what to check]
```

Replace `<BRANCH-NAME>` with the actual branch name (e.g., `claude/add-step2-wizard`).

Claude must not claim success until:
	•	Build + lint pass
	•	Verification steps are documented
	•	Branch name is explicitly stated

6. Confirm

Explicitly state:
	•	**Branch name** (full name, e.g., `claude/add-step2-wizard`)
	•	Files changed
	•	Build and lint results
	•	Expected visible effect in the browser
	•	User verification command summary

If any step cannot be verified, stop and ask before claiming completion.

Skipping any step is an error.

Commands (Frontend Only)

All frontend commands run from /frontend/:

cd frontend
npm install          # Install dependencies
npm run dev          # Dev server at http://localhost:5173
npm run build        # TypeScript check + Vite production build
npm run lint         # ESLint
npm run preview      # Serve production build locally

No automated test suite is configured.

⸻

Frontend Architecture (Reference)

Tech Stack
	•	React 19
	•	TypeScript 5.9 (strict mode)
	•	Vite 7
	•	Tailwind CSS 4
	•	React Router DOM 7

Structure (/frontend/src/)
	•	pages/ — Route-level components (LoginPage, DashboardPage, QuickStartPage)
	•	components/ui/ — Reusable primitives (Button, Input, Card, Badge)
	•	components/wizard/ — Quick Start Wizard steps
	•	components/dashboard/ — Dashboard-specific components
	•	utils/workflowStorage.ts — Single source of truth for persistence

Routing
	•	Handled by React Router DOM
	•	Router configuration lives in App.tsx

⸻

Quick Start Wizard Rules
	•	Wizard is a 6-step flow
	•	Only Step 1 is currently implemented
	•	Step1CompanyInfo.tsx is the reference implementation
	•	QuickStartPage.tsx orchestrates steps and save/resume behavior

New steps must follow the Step 1 pattern unless explicitly approved otherwise.

⸻

Code Conventions (Must Follow)
	•	Border radius: use rounded-[5px] everywhere
	•	Type imports: import type { X } from 'module'
	•	Form state: store values as strings; convert only when saving
	•	Persistence: all localStorage access must go through utils/workflowStorage.ts
	•	Do not access localStorage directly elsewhere

⸻

Design System (Reference)
	•	Monochrome teal palette defined in /frontend/src/index.css
	•	Design documentation: /DESIGN_SYSTEM.md
	•	Accessibility analysis: /COLOR_ACCESSIBILITY.md

Do not introduce new colors, spacing systems, or typography unless requested.

⸻

Visibility & Verification Rules

Claude must never claim success without evidence.
	•	UI changes → specify exact location or visible marker
	•	Docs changes → name file and section
	•	Runtime behavior → describe observable change

If a change appears to have no visible effect, stop and ask.

⸻

Failure Safeguards

If any of the following occur, Claude must pause and ask for clarification:
	•	Multiple similarly named files exist
	•	Instructions conflict across documents
	•	A change does not produce visible results
	•	It is unclear which file is authoritative

Silent failure is unacceptable.

⸻

Final Principle

Accuracy beats speed.
Verification beats confidence.
Current instructions beat history.
