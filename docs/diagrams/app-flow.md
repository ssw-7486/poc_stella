# Stella App Flow - High-Level Navigation

This diagram visualizes the complete application navigation structure, including all primary pages and key user journeys.

## Purpose
- Documents main application routes and entry points
- Shows navigation relationships between pages
- Illustrates the Quick Start wizard entry and completion flow

---

## Main Application Flow

```mermaid
flowchart LR
    Start([User Entry]) --> Root[Root Route]
    Root --> Login[Sign-in Page]

    Login --> Dashboard[Admin Dashboard]

    Dashboard --> Workflows[Workflow Editor]
    Dashboard --> Jobs[Jobs List]
    Dashboard --> Documents[Documents Upload]
    Dashboard --> Settings[Settings]
    Dashboard --> QuickStart[Quick Start Wizard]
    Dashboard --> |Resume| QuickStart

    QuickStart --> |Complete Wizard| Workflows
    QuickStart --> |Save & Exit| Storage[(localStorage)]
    QuickStart --> |Cancel| Dashboard

    Storage --> |Load Saved| Dashboard
    Dashboard --> |View In Progress| WorkflowCard[Workflows Card]
    WorkflowCard --> |Resume Workflow| QuickStart

    Workflows --> Dashboard
    Jobs --> Dashboard
    Documents --> Dashboard
    Settings --> Dashboard

    style Start fill:#D0EFF2,stroke:#07464C,stroke-width:2px
    style Root fill:#D0EFF2,stroke:#07464C,stroke-width:2px
    style Login fill:#71CED9,stroke:#07464C,stroke-width:2px
    style Dashboard fill:#12AEBF,stroke:#07464C,stroke-width:3px,color:#fff
    style QuickStart fill:#4AB8C8,stroke:#07464C,stroke-width:2px,color:#fff
    style Workflows fill:#0B6873,stroke:#07464C,stroke-width:2px,color:#fff
    style Jobs fill:#A0DFE5,stroke:#07464C,stroke-width:2px
    style Documents fill:#A0DFE5,stroke:#07464C,stroke-width:2px
    style Settings fill:#A0DFE5,stroke:#07464C,stroke-width:2px
    style Storage fill:#FFA500,stroke:#07464C,stroke-width:2px
    style WorkflowCard fill:#4AB8C8,stroke:#07464C,stroke-width:2px,color:#fff
```

---

## Navigation Notes

### Entry Points
- **Root (/)**: Automatically redirects to `/login`
- **Login Page**: First interaction point for all users

### Dashboard Hub
- **Admin Dashboard** serves as the central navigation hub
- All primary pages are accessible from the dashboard navigation bar
- "Quick Start" button provides prominent access to the wizard

### Quick Start Wizard Flow
- **Entry**: Accessed via "Quick Start" button on dashboard or "Resume" from Workflows Card
- **Completion**: Redirects to Workflow Editor (`/workflows`)
- **Save & Exit**: Saves workflow to localStorage and returns user to Dashboard
- **Cancel**: Returns to Dashboard (progress lost)
- **Resume**: Loads saved workflow data and returns user to last completed step

### Workflow Management
- **Workflows Card**: Displays all in-progress and completed workflows on Dashboard
- **localStorage**: Stores workflow data including: ID, name, company info, current step, status
- **Multiple Workflows**: Administrators can create and manage multiple workflows simultaneously
- **Edit Name**: Workflow names can be edited directly from the Workflows Card

### Return Navigation
- All pages include navigation back to Dashboard
- Workflow Editor is accessible from both Dashboard and Quick Start completion

---

## Route Summary

| Route | Page | Access From |
|-------|------|-------------|
| `/` | Redirect | Entry point → `/login` |
| `/login` | Sign-in Page | Root redirect |
| `/dashboard` | Admin Dashboard | Login success, all page returns |
| `/workflows` | Workflow Editor | Dashboard, Quick Start completion |
| `/jobs` | Jobs List | Dashboard |
| `/documents` | Documents Upload | Dashboard |
| `/settings` | Settings | Dashboard |
| `/quick-start` | Quick Start Wizard | Dashboard (Quick Start button) |

---

## Color Legend
- **Teal Shades**: Primary user flow pages (Dashboard, Quick Start, Workflow Editor)
- **Light Teal**: Secondary pages (Jobs, Documents, Settings)
- **Lightest Teal**: Entry/start states

---

**Last Updated:** 2026-02-02
**Related Diagrams:** `quick-start-wizard-flow.md`
