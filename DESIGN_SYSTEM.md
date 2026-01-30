# Stella Design System

## Color Scheme

Based on the [susi/globals.css](https://github.com/ssw-7486/susi/blob/main/app/globals.css)

### Primary Colors
- **Blue (Primary)**: `#12adbf` - Main interactions, links, primary CTAs
- **Green (Secondary)**: `#25e377` - Success states, secondary CTAs
- **Navy (Foreground)**: `#00343f` - Text and dark elements
- **White**: `#fff` - Pure white for cards and contrasts

### Background & Surface Colors
- **Card Background**: `#f4fdfc` - Off-white for page backgrounds
- **Input Section**: `#e8f8f6` - Form section backgrounds
- **Input Border**: `#5fc4d4` - 30% softer/lighter than blue

### Design Tokens (Tailwind CSS Variables)
```css
--background: #f4fdfc
--foreground: #00343f
--card: #fff
--primary: #12adbf
--secondary: #25e377
--border-radius: 12px
```

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
- **Primary**: Blue background, white text, 12px border radius
- **Secondary**: Green background, white text, 12px border radius
- **Outline**: Transparent background, border, colored text
- **Minimum size**: 44×44px (touch-friendly)

### Cards
- **Background**: White (#fff)
- **Border Radius**: 12px
- **Shadow**: Subtle drop shadow
- **Padding**: 24px (1.5rem)

### Inputs
- **Background**: Input section (#e8f8f6)
- **Border**: 1px solid #5fc4d4
- **Border Radius**: 12px
- **Padding**: 12px 16px
- **Focus**: 2px solid outline with offset

### Badges
- **Border Radius**: 8px
- **Padding**: 4px 12px
- **Variants**: success (green), warning (yellow), error (red), info (blue)

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
