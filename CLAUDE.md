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

5. Confirm

Explain how the user can verify success and what to do if it fails.

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
