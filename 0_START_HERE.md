# 0_START_HERE.md

All contributors (human or AI) must explicitly verify and restate the active git branch, dev server (type + port), and runtime browser visibility before making changes or claiming success—no exceptions.

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
