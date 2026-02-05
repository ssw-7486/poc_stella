# 0_START_HERE.md

All contributors (human or AI) must explicitly verify and restate the active git branch, dev server (type + port), and runtime browser visibility before making changes or claiming success—no exceptions.

---

# ⚠️ Mandatory Startup Protocol

Any human or AI working in this repository MUST complete the startup protocol below before making changes.
Skipping this step invalidates subsequent work.

## Claude / AI Startup Protocol (Required)

Before proposing changes, writing code, or offering solutions, the AI must:

1. Explicitly list the files and folders it can see in the current workspace.
2. Summarize the project’s purpose in no more than 5 bullet points.
3. Identify the current working area (files likely to be modified in this session).
4. Ask exactly ONE clarification question if required.
5. Confirm it will not propose solutions until the above is completed.

If any step is skipped, the session must be reset and the protocol re-run.

## Why This Protocol Exists

This repository is worked on across multiple sessions, tools, and contributors (human and AI).
This protocol prevents:
- Context drift
- Editing the wrong files
- Repeating solved problems
- Claude/Cursor operating on false assumptions

---

## Development Startup Protocol (Read This First)

This project uses multiple active branches and local dev servers.
To avoid working on the wrong branch or serving stale code, follow this checklist before making any changes.

### 1. Confirm Active Branch (Source of Truth)

Before editing any files, confirm the current branch:

```bash
git branch --show-current
git status -sb
```

- Treat the active branch as the source of truth
- Do not switch branches unless explicitly instructed

### 2. Confirm Dev Server Context

State explicitly:
- Framework (Vite / Next.js / etc.)
- Port in use (e.g. http://localhost:5173)
- Directory the server is running from

Do not assume defaults.

### 3. Branch Discipline

- All changes must be made on the active branch
- Do not create, switch, or commit to a different branch without approval
- If a different branch is required, explain why and wait for confirmation

### 4. Visibility Guarantee

Before claiming that changes are "visible" or "working":
- Ensure the changes affect files used by the active dev server
- When needed, add a temporary visible marker to confirm runtime visibility

### 5. End-of-Task Verification

Before concluding any task, restate:
- Branch name
- Files changed
- Whether the dev server must be restarted
- Expected visible effect in the browser

If any step cannot be verified, stop and ask before proceeding.

At the end of any meaningful session, run `/insights` and record any key decisions in the appropriate documentation.

---

## Instructions to Dev for Terminal

After code changes are pushed, follow these steps to view updates in the browser:

### 1. Confirm Correct Repo

```bash
pwd
ls
```

Verify you are in the correct repository directory before proceeding.

### 2. Git Pull into the Right Branch

```bash
git pull origin <branch-name>
```

Replace `<branch-name>` with the active branch (e.g., `claude/review-stella-docs-Cc35Z`).

### 3. Restart Vite

```bash
cd frontend
rm -rf node_modules/.vite
npm install
npm run dev
```

This clears Vite's cache, reinstalls dependencies, and starts the dev server fresh.
