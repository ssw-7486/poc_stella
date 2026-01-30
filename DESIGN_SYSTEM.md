# Stella Design System

## Color Scheme

### Monochrome Teal Palette
A cohesive teal color system ranging from dark navy to light cyan.

**Primary Scale:**
- **Navy Darkest**: `#07464C` - Primary text, headers, dark backgrounds
- **Navy Dark**: `#0B6873` - Secondary text, darker accents
- **Primary**: `#12AEBF` - Main interactions, links, primary CTAs
- **Primary Light**: `#71CED9` - Hover states, secondary actions, accents
- **Primary Lighter**: `#A0DFE5` - Input backgrounds, subtle highlights
- **Primary Lightest**: `#D0EFF2` - Card backgrounds, page backgrounds

**Neutral Greys:**
- **Dark Grey**: `#888888` - Borders, disabled states, muted text
- **Light Grey**: `#DDDDDD` - Dividers, subtle backgrounds

**White:**
- **White**: `#FFFFFF` - Card surfaces, contrasting elements

### Design Tokens (Tailwind CSS Variables)
```css
/* Monochrome Teal Palette */
--color-navy-darkest: #07464C
--color-navy-dark: #0B6873
--color-primary: #12AEBF
--color-primary-light: #71CED9
--color-primary-lighter: #A0DFE5
--color-primary-lightest: #D0EFF2

/* Greys */
--color-gray-dark: #888888
--color-gray-light: #DDDDDD

--radius: 12px
```

### Color Usage Guidelines
- **Text**: Use Navy Darkest (#07464C) for primary text, Navy Dark (#0B6873) for secondary
- **Backgrounds**: Primary Lightest (#D0EFF2) for page backgrounds, White (#FFFFFF) for cards
- **Interactive Elements**: Primary (#12AEBF) for buttons/links, Primary Light (#71CED9) for hover states
- **Borders**: Primary Light (#71CED9) for focus states, Dark Grey (#888888) for default borders
- **Status Indicators**: Primary Light (#71CED9) for success/completion states

---

## Typography

### Font Family
- **Primary**: System font stack (San Francisco on macOS, Segoe UI on Windows)
- **Monospace**: Consolas, Monaco, Courier New (for code/data display)

### Scale
- **Heading 1**: 3rem (48px) - Page titles
- **Heading 2**: 2rem (32px) - Section headers
- **Heading 3**: 1.5rem (24px) - Card titles
- **Body**: 1rem (16px) - Default text
- **Small**: 0.875rem (14px) - Helper text, labels

---

## Spacing

Follow 8px base grid:
- **xs**: 4px (0.5rem)
- **sm**: 8px (1rem)
- **md**: 16px (2rem)
- **lg**: 24px (3rem)
- **xl**: 32px (4rem)
- **2xl**: 48px (6rem)

---

## Components

### Buttons
- **Primary**: Primary (#12AEBF) background, white text, 12px border radius
- **Secondary**: Primary Light (#71CED9) background, white text, 12px border radius
- **Outline**: Transparent background, Primary border, Primary text
- **Minimum size**: 44×44px (touch-friendly)
- **Hover**: 90% opacity or darker shade

### Cards
- **Background**: White (#FFFFFF)
- **Border**: Optional 1px solid Light Grey (#DDDDDD)
- **Border Radius**: 12px
- **Shadow**: Subtle drop shadow
- **Padding**: 24px (1.5rem)

### Inputs
- **Background**: Primary Lighter (#A0DFE5)
- **Border**: 1px solid Primary Light (#71CED9)
- **Border Radius**: 12px
- **Padding**: 12px 16px
- **Focus**: 2px solid Primary outline with offset
- **Text**: Navy Darkest (#07464C)

### Badges
- **Border Radius**: 8px
- **Padding**: 4px 12px
- **Variants**:
  - Success: Primary Light (#71CED9) background
  - Info: Primary (#12AEBF) background
  - Neutral: Dark Grey (#888888) background

---

## Layout Patterns

### Split Screen (Login)
- **Left Panel**: Navy background, brand content
- **Right Panel**: Card background, form content
- **Split Ratio**: 40/60 on desktop

### Dashboard
- **Two-panel layout**: Progress + Job List
- **Navigation**: Top horizontal bar
- **Quick Actions**: Prominent buttons for key workflows

### Wizard
- **Main Content**: Full-width form area
- **Side Panel**: Fixed right sidebar showing progress/summary
- **Panel Ratio**: 70/30 on desktop

---

## Accessibility

- **Contrast Ratio**: Minimum 4.5:1 for normal text, 3:1 for large text
- **Focus States**: Visible 2px outline with offset
- **Touch Targets**: Minimum 44×44px
- **Keyboard Navigation**: Full keyboard support for all interactive elements

---

## File Structure

```
/app
  /(auth)
    /login
      page.tsx
  /(dashboard)
    layout.tsx          # Shared layout with navigation
    /dashboard
      page.tsx
    /workflows
      page.tsx
    /jobs
      page.tsx
    /quick-start
      page.tsx
    /documents
      page.tsx
    /settings
      page.tsx
  layout.tsx            # Root layout
  globals.css           # Global styles

/components
  /ui                   # Reusable primitives
    button.tsx
    card.tsx
    input.tsx
    select.tsx
    checkbox.tsx
    badge.tsx
    navigation.tsx
    wizard-sidebar.tsx
  /features             # Page-specific components
    /dashboard
    /workflows
    /quick-start

/lib
  utils.ts              # Helper functions
  constants.ts          # Color scheme constants
```

---

## Design Principles

1. **Simplicity First**: Clean, uncluttered interfaces
2. **Consistency**: Reuse patterns and components
3. **Clarity**: Clear visual hierarchy and labeling
4. **Accessibility**: WCAG 2.1 AA compliance
5. **Desktop-First**: Optimized for desktop workflows (MVP)

---

**Version**: 1.0.0
**Last Updated**: 2026-01-30
