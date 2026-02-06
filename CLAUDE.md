# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Stella POC is a local MVP proof-of-concept for a document OCR SaaS platform that processes mixed documents (handwritten + machine-printed). The active frontend lives in `/frontend/` (Vite + React). The root-level Next.js setup (`/app/`) is inactive.

## Commands

All frontend commands run from the `/frontend/` directory:

```bash
cd frontend
npm install          # Install dependencies
npm run dev          # Dev server at http://localhost:5173
npm run build        # TypeScript check + Vite production build
npm run lint         # ESLint
npm run preview      # Serve production build locally
```

No automated test suite is configured.

## Architecture

### Tech Stack
- **Frontend:** React 19, TypeScript 5.9, Vite 7, Tailwind CSS 4, React Router DOM 7
- **Backend:** Python (skeleton in `/backend/`, not yet implemented)
- **Persistence:** localStorage via `workflowStorage.ts` (MVP)

### Frontend Structure (`/frontend/src/`)
- `pages/` — Route-level components (LoginPage, DashboardPage, QuickStartPage, etc.)
- `components/ui/` — Reusable primitives (Button, Input, Card, Badge, Navigation)
- `components/wizard/` — Quick Start Wizard steps (WizardLayout, Step1CompanyInfo)
- `components/dashboard/` — Dashboard-specific components (WorkflowsCard)
- `utils/workflowStorage.ts` — All localStorage CRUD operations (single source of truth for persistence)

### Routing
React Router DOM handles routing. Key routes: `/login`, `/dashboard`, `/quick-start`, `/workflows`, `/jobs`, `/documents`, `/settings`. Router setup is in `App.tsx`.

### Wizard Architecture
The Quick Start Wizard is a 6-step flow (only Step 1 implemented). `QuickStartPage.tsx` orchestrates steps and manages save/resume. Each step is a separate component receiving `data` and `onChange` props. Step 1 (`Step1CompanyInfo.tsx`) is the reference implementation for future steps.

## Mandatory Protocol

Read `/0_START_HERE.md` before making changes. It requires:
1. Verify active git branch before editing files
2. Confirm dev server framework, port, and directory
3. Do not switch branches without explicit approval
4. Restate branch, changed files, and expected browser effect at end of task

## Code Conventions

- **Border radius:** Use `rounded-[5px]` everywhere (not `rounded-md` or `rounded-xl`)
- **Type imports:** Use `import type { X } from 'module'` for type-only imports
- **Form data as strings:** Keep form state as strings; convert types only when saving to storage
- **localStorage access:** All reads/writes go through `utils/workflowStorage.ts` — do not use `localStorage` directly elsewhere
- **TypeScript strict mode** is enabled with no unused locals/parameters enforced

## Design System

Monochrome teal palette defined in `/frontend/src/index.css` as Tailwind theme variables:
- Text: `navy-darkest` (#07464C), `navy-dark` (#0B6873)
- Interactive: `primary` (#12AEBF), hover: `primary-light` (#71CED9)
- Input backgrounds: `primary-lighter` (#A0DFE5)
- Page/card backgrounds: `primary-lightest` (#D0EFF2), white
- Borders/disabled: `dark-grey` (#888888), `light-grey` (#DDDDDD)

Full design system documented in `/DESIGN_SYSTEM.md`. WCAG analysis in `/COLOR_ACCESSIBILITY.md`.

## Documentation Structure

- `/docs/specs/` — Master specifications (single source of truth for what to build)
- `/docs/sessions/` — Session logs (decision history and rationale)
- `/docs/diagrams/` — Mermaid flow diagrams
- `/HANDOFF.md` — Quick start guide with next tasks and patterns
- `/MVP_REQUIREMENTS.md` — Complete MVP requirements

Specs are updated at end of design sessions. Session logs capture the "why" behind decisions.
