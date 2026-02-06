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

---

## Claude Server Startup Instructions (Non-Negotiable)

**Context:**
- Repo name: `poc_stella`
- The real frontend lives in `poc_stella/frontend`
- Never run `npm install` or `npm run dev` at repo root

### Required Startup Sequence

Every time the dev server needs to start, follow this **exact** sequence. No shortcuts.

```bash
# 1. Confirm location
pwd
ls
# You must see a frontend/ folder before continuing.

# 2. Enter the frontend
cd frontend
pwd
# You must now be inside poc_stella/frontend.

# 3. Ensure a clean port
lsof -ti tcp:5173 | xargs -r kill -9

# 4. Install dependencies (frontend only)
npm install

# 5. Start the dev server
npm run dev
```

### Mandatory Verification (Do Not Skip)

In a new terminal tab or after the server starts:

```bash
curl -I http://localhost:5173/login
```

- If this returns an HTTP response, the server is running.
- If not, the startup **failed**, regardless of terminal messages.

### Hard Rules

- **Never** run `npm install` at repo root
- **Never** run `npm run dev` at repo root
- **Never** assume the server is running without `curl -I` verification
- **Always** show `pwd` before and after `cd frontend`

### Failure Handling

If any step fails:
1. **Stop immediately**
2. Paste the exact command, working directory, and full terminal output
3. **Do not guess or retry blindly**

---

## Lessons Learned (Session 2026-02-06)

### Server Startup Protocol Violation

**What happened:** Claude skipped the startup protocol — did not confirm `pwd`/`ls` before starting, did not show `pwd` after `cd frontend`, did not kill existing processes on port 5173, and did not use the prescribed `curl -I` verification. Instead, used a shortcut curl command and assumed success.

**Impact:** Wasted the user's time reviewing and correcting the process.

**Root cause:** Treated the startup as a routine task and took shortcuts instead of following the documented protocol step by step.

**Fix:** The "Claude Server Startup Instructions" section above is now mandatory. Every server start must follow the exact sequence with no deviations. This has also been recorded in Claude's persistent memory so it carries across sessions.

**Rule for future developers (human or AI):** If you cannot show `curl -I http://localhost:5173/login` returning HTTP 200, the server is not running. Period.
