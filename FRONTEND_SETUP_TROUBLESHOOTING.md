# Frontend Setup Troubleshooting Guide

This document describes common issues encountered when setting up the Stella frontend locally and their solutions.

---

## Issue 1: Next.js vs Vite Setup Confusion

### Problem
Initial setup created a Next.js application in the root directory (`/app`, `/components`), but the project specification called for Vite + React.

### Symptoms
- Server running on `http://localhost:3000` but pages not loading
- Next.js-specific file structure (app router, server components)
- Mismatch with project requirements

### Solution
- **Removed Next.js setup** and created a fresh Vite + React application in `/frontend` directory
- Used Vite's official template: `npm create vite@latest frontend -- --template react-ts`
- Installed React Router DOM for client-side routing: `npm install react-router-dom`
- Set up proper routing structure with `/login` and `/dashboard` routes

### Key Takeaway
Always verify the project's tech stack requirements before scaffolding. The `/frontend` directory should contain the Vite + React application, separate from any backend services.

---

## Issue 2: Remote Development Server Access

### Problem
Development server running in remote/container environment was not accessible from local browser.

### Symptoms
- Browser shows "This site can't be reached" or "Connection refused"
- `curl` works on the remote server, but not from local machine
- Port 5173 (or 3000) not accessible via `localhost`

### Solution
**Option A: Run Locally (Recommended)**
```bash
# On your local machine
cd /Users/yourname/poc_stella
git pull origin claude/design-login-dashboard-ztUvg
cd frontend
npm install
npm run dev
```

**Option B: Port Forwarding (SSH)**
```bash
# On your local machine terminal
ssh -L 5173:localhost:5173 user@remote-server
```

Then access: `http://localhost:5173`

### Key Takeaway
For the best development experience, run the frontend server locally on your machine, not on a remote server or container. This avoids networking complexity and provides instant hot-reload.

---

## Issue 3: Port Already in Use

### Problem
Port 5173 (Vite's default) already occupied by another process.

### Symptoms
```
Error: Port 5173 is already in use
```

### Solution
**Option A: Use a Different Port**
```bash
npm run dev -- --port 5174
```

**Option B: Kill the Process Using the Port**
```bash
# Find the process
lsof -i :5173

# Kill it
kill -9 <PID>

# Or use Vite's default port
npm run dev
```

### Key Takeaway
Always specify a custom port if the default is taken. Update any documentation or URLs to reflect the new port number.

---

## Issue 4: Tailwind CSS Not Applied (Critical)

### Problem
The most significant issue: Page loads but **no CSS styling is applied**. Only seeing unstyled HTML content.

### Symptoms
- Page structure visible but no colors, spacing, or layout
- Navy panel and card backgrounds missing
- Buttons and inputs appear as default browser styles
- Only right panel content visible (no split-screen layout)

### Root Cause
**Tailwind CSS v4** was installed instead of v3, which has a **completely different configuration syntax**. The old `@tailwind` directives and `tailwind.config.js` approach doesn't work in v4.

### What We Tried (That Didn't Work)

#### ❌ Attempt 1: Standard Tailwind v3 Syntax
```css
/* index.css - DOESN'T WORK IN V4 */
@tailwind base;
@tailwind components;
@tailwind utilities;
```
**Result:** CSS not compiled, no styles applied.

#### ❌ Attempt 2: Using tailwind.config.js
```js
/* tailwind.config.js - IGNORED IN V4 */
export default {
  theme: {
    extend: {
      colors: {
        blue: '#12adbf',
        // ...
      }
    }
  }
}
```
**Result:** Configuration file ignored by v4, colors not available.

#### ❌ Attempt 3: CSS Variables in :root
```css
:root {
  --blue: #12adbf;
  --green: #25e377;
  /* ... */
}
```
**Result:** Variables defined but not accessible to Tailwind utilities.

### ✅ Final Solution: Tailwind v4 @theme Directive

**Step 1: Update `src/index.css`**
```css
@import "tailwindcss";

@theme {
  --color-blue: #12adbf;
  --color-green: #25e377;
  --color-navy: #00343f;
  --color-card-bg: #f4fdfc;
  --color-input-section-bg: #e8f8f6;
  --color-input-border: #5fc4d4;

  --radius: 12px;
}

body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

**Step 2: Update `postcss.config.js`**
```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

**Step 3: Remove `tailwind.config.js`**
```bash
rm tailwind.config.js
```

**Step 4: Restart Dev Server**
```bash
npm run dev -- --port 5174
```

### Key Differences: Tailwind v3 vs v4

| Feature | v3 | v4 |
|---------|----|----|
| **Import** | `@tailwind base/components/utilities` | `@import "tailwindcss"` |
| **Config** | `tailwind.config.js` | `@theme` directive in CSS |
| **Custom Colors** | `theme.extend.colors` in JS | `--color-name` in `@theme` |
| **PostCSS Plugin** | `tailwindcss` | `@tailwindcss/postcss` |

### Dependencies Required

```json
{
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.18",
    "autoprefixer": "^10.4.23",
    "tailwindcss": "^4.1.18"
  }
}
```

### Key Takeaway
Tailwind CSS v4 is a **major breaking change**. Always check which version is installed (`npm list tailwindcss`) and use the correct syntax. If you need v3 for compatibility, explicitly install it:

```bash
npm install -D tailwindcss@3 postcss autoprefixer
```

---

## Issue 5: Conflicting Local Files During Git Pull

### Problem
Existing `frontend/` directory with untracked files prevents git pull.

### Symptoms
```
error: The following untracked working tree files would be overwritten by merge:
  frontend/.gitignore
  frontend/package.json
  ...
Please move or remove them before you merge.
```

### Solution
**Option A: Backup and Pull (Safest)**
```bash
cd /Users/yourname/poc_stella
mv frontend frontend-backup
git pull origin claude/design-login-dashboard-ztUvg
cd frontend
npm install
npm run dev
```

**Option B: Force Overwrite (if you don't need local changes)**
```bash
rm -rf frontend
git pull origin claude/design-login-dashboard-ztUvg
cd frontend
npm install
npm run dev
```

### Key Takeaway
Always backup local work before force-pulling. Use `git status` to check for uncommitted changes.

---

## Complete Setup Workflow (Start to Finish)

Here's the **correct step-by-step process** to set up the frontend locally:

### 1. Clone or Pull the Repository
```bash
cd /Users/yourname/poc_stella
git checkout claude/design-login-dashboard-ztUvg
git pull origin claude/design-login-dashboard-ztUvg
```

### 2. Install Dependencies
```bash
cd frontend
npm install
```

### 3. Verify Tailwind v4 Configuration

**Check `src/index.css`:**
```css
@import "tailwindcss";

@theme {
  --color-blue: #12adbf;
  /* ... other colors */
}
```

**Check `postcss.config.js`:**
```js
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
```

**Ensure NO `tailwind.config.js` exists** (delete it if present).

### 4. Start Dev Server
```bash
npm run dev
# Or if port 5173 is taken:
npm run dev -- --port 5174
```

### 5. Open in Browser
```
http://localhost:5173/login
# Or your custom port:
http://localhost:5174/login
```

### 6. Verify CSS is Applied

You should see:
- **Split-screen layout** (40% left navy panel, 60% right light panel)
- **STELLA logo** with green underline on the left
- **Feature list** with green checkmarks
- **Styled login form** on the right with blue SSO button and green Sign In button

If you only see unstyled HTML, refer to **Issue 4** above.

---

## Quick Reference: Common Commands

```bash
# Check which Tailwind version is installed
npm list tailwindcss

# Check if port is in use
lsof -i :5173

# Kill process on port
kill -9 $(lsof -t -i:5173)

# Start dev server on custom port
npm run dev -- --port 5174

# Clean install (if dependencies are corrupted)
rm -rf node_modules package-lock.json
npm install

# Check for git conflicts
git status
```

---

## Need Help?

If you encounter issues not covered in this guide:

1. **Check the browser console** (F12) for JavaScript errors
2. **Check the terminal** for build errors
3. **Verify dependencies** with `npm list`
4. **Clear Vite cache**: `rm -rf node_modules/.vite`
5. **Report the issue** with error logs and screenshots

---

**Last Updated:** 2026-01-30
**Version:** 1.0.0
