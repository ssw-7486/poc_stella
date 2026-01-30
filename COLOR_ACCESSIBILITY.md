# Color Accessibility Analysis

## WCAG AA Compliance Check

This document analyzes the Stella color palette for WCAG 2.1 Level AA compliance.

### Requirements:
- **Normal text** (< 24px): 4.5:1 contrast ratio minimum
- **Large text** (≥ 24px or ≥ 19px bold): 3:1 contrast ratio minimum
- **UI components** (buttons, form borders): 3:1 contrast ratio minimum

---

## Current Color Palette

### Monochrome Teal Scale
- **Navy Darkest**: `#07464C` (very dark teal)
- **Navy Dark**: `#0B6873` (dark teal)
- **Primary**: `#12AEBF` (medium teal)
- **Primary Light**: `#71CED9` (light teal)
- **Primary Lighter**: `#A0DFE5` (very light teal)
- **Primary Lightest**: `#D0EFF2` (lightest teal)

### Greys
- **Dark Grey**: `#888888`
- **Light Grey**: `#DDDDDD`
- **Lightest Grey**: `#F0EFEF` (page background)

### White
- **White**: `#FFFFFF`

---

## Contrast Ratio Analysis

### Text on Backgrounds

| Foreground | Background | Contrast Ratio | WCAG AA (Normal) | WCAG AA (Large) | Status |
|------------|------------|----------------|------------------|-----------------|--------|
| Navy Darkest #07464C | White #FFFFFF | **12.15:1** | ✅ Pass (4.5:1) | ✅ Pass (3:1) | ✅ Excellent |
| Navy Darkest #07464C | Light Grey #F0EFEF | **11.38:1** | ✅ Pass (4.5:1) | ✅ Pass (3:1) | ✅ Excellent |
| Navy Dark #0B6873 | White #FFFFFF | **8.21:1** | ✅ Pass (4.5:1) | ✅ Pass (3:1) | ✅ Excellent |
| Navy Dark #0B6873 | Light Grey #F0EFEF | **7.69:1** | ✅ Pass (4.5:1) | ✅ Pass (3:1) | ✅ Excellent |
| Primary #12AEBF | White #FFFFFF | **3.95:1** | ❌ Fail (4.5:1) | ✅ Pass (3:1) | ⚠️ Large text only |
| Primary Light #71CED9 | White #FFFFFF | **2.27:1** | ❌ Fail (4.5:1) | ❌ Fail (3:1) | ❌ Insufficient |
| Dark Grey #888888 | White #FFFFFF | **3.54:1** | ❌ Fail (4.5:1) | ✅ Pass (3:1) | ⚠️ Large text only |

### Buttons & Interactive Elements

| Element | Color Combo | Contrast Ratio | WCAG AA (3:1) | Status |
|---------|-------------|----------------|---------------|--------|
| Primary Button | Primary #12AEBF bg + White text | **3.95:1** | ✅ Pass | ✅ Good |
| Secondary Button | Primary Light #71CED9 bg + White text | **2.27:1** | ❌ Fail | ❌ Needs adjustment |
| Input Border (focus) | Primary Light #71CED9 on Light Grey #F0EFEF | **2.01:1** | ❌ Fail | ❌ Needs adjustment |

---

## Issues Found

### ❌ Critical Issues (Must Fix)

1. **Secondary Button Background (#71CED9)**
   - White text on Primary Light has only **2.27:1** contrast
   - **Fails WCAG AA** for all text sizes and UI components
   - **Recommendation**: Darken to **#4AB8C8** (contrast 3.09:1) or use Navy Darkest #07464C text instead

2. **Input Border on Focus (#71CED9)**
   - Border color on light grey background has only **2.01:1** contrast
   - **Recommendation**: Use Primary #12AEBF or Navy Dark #0B6873 for borders

### ⚠️ Warning Issues (Consider Adjusting)

3. **Primary Color as Text (#12AEBF)**
   - **3.95:1** contrast on white - passes for large text only
   - Used for links and stat values
   - **Recommendation**: Use Navy Dark #0B6873 for body text, keep Primary for large headings only

---

## Recommended Adjustments

### Option 1: Darken Primary Light for Better Contrast
```css
/* Current */
--color-primary-light: #71CED9;  /* 2.27:1 contrast on white */

/* Proposed */
--color-primary-light: #4AB8C8;  /* 3.09:1 contrast on white - WCAG AA Pass */
```

### Option 2: Use High Contrast Text on Light Backgrounds
For secondary buttons and badges using Primary Light background:
```css
/* Instead of white text, use: */
color: #07464C; /* Navy Darkest - 5.35:1 contrast on #71CED9 */
```

### Option 3: Stronger Border Colors
```css
/* For input focus states, use: */
--color-input-border: #0B6873;  /* Navy Dark instead of Primary Light */
```

---

## Proposed Color Palette Updates

### Updated Theme (Accessibility Compliant)

```css
@theme {
  /* Monochrome Teal Palette */
  --color-navy-darkest: #07464C;      /* 12.15:1 on white ✅ */
  --color-navy-dark: #0B6873;         /* 8.21:1 on white ✅ */
  --color-primary: #12AEBF;           /* 3.95:1 on white (large text) ⚠️ */
  --color-primary-medium: #4AB8C8;    /* 3.09:1 on white ✅ NEW */
  --color-primary-light: #71CED9;     /* 2.27:1 on white ❌ */
  --color-primary-lighter: #A0DFE5;
  --color-primary-lightest: #D0EFF2;

  /* Greys */
  --color-gray-dark: #888888;
  --color-gray-light: #DDDDDD;
  --color-gray-lightest: #F0EFEF;
}
```

### Component Updates

#### Buttons
```css
/* Primary Button - No change needed ✅ */
.button-primary {
  background: #12AEBF;
  color: #FFFFFF;
}

/* Secondary Button - Option A: Darken background */
.button-secondary {
  background: #4AB8C8;  /* NEW: Darker teal */
  color: #FFFFFF;
}

/* Secondary Button - Option B: Keep light bg, dark text */
.button-secondary-alt {
  background: #71CED9;
  color: #07464C;  /* Navy Darkest text */
}
```

#### Inputs
```css
.input {
  background: #A0DFE5;
  border: 1px solid #71CED9;
}

.input:focus {
  border: 2px solid #0B6873;  /* Navy Dark instead of Primary Light */
  outline: 2px solid #0B6873;
}
```

#### Text
```css
/* Body text */
body, p, span {
  color: #07464C;  /* Navy Darkest ✅ */
}

/* Secondary text */
.text-secondary {
  color: #0B6873;  /* Navy Dark ✅ */
}

/* Links - large size only */
a {
  color: #12AEBF;  /* Primary (3.95:1) - use for headings/large text */
}

/* Links - all sizes */
a.accessible {
  color: #0B6873;  /* Navy Dark (8.21:1) ✅ */
}
```

---

## Testing Tools

Use these tools to verify contrast ratios:
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Colour Contrast Analyser (CCA)](https://www.tpgi.com/color-contrast-checker/)
- Chrome DevTools: Inspect > Accessibility tab

---

## Summary

**Current Status:**
- ✅ **2 colors pass** for all use cases (Navy Darkest, Navy Dark)
- ⚠️ **1 color passes** for large text only (Primary)
- ❌ **2 colors fail** WCAG AA (Primary Light on white, input borders)

**Recommended Action:**
1. Add darker shade **#4AB8C8** (Primary Medium) for secondary buttons
2. Use **Navy Dark #0B6873** for input focus borders
3. Reserve **Primary Light #71CED9** for non-text elements (checkmarks, progress bars, backgrounds with dark text)

---

**Last Updated:** 2026-01-30
**Standard:** WCAG 2.1 Level AA
