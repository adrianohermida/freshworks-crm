# Aetherlab Design System & Branding Guide

## Typography

### Font Family
- **Primary Font**: DM Sans, sans-serif

### Font Sizes
- `xs`: 12px
- `sm`: 14px
- `base`: 16px
- `lg`: 18px
- `xl`: 20px
- `2xl`: 24px
- `3xl`: 30px
- `4xl`: 36px
- `5xl`: 48px

### Font Weights
- Light: 300
- Normal: 400
- Medium: 500
- Semibold: 600
- Bold: 700
- Extrabold: 800

---

## Color Palette

### Base Colors
| Name | Hex | Usage |
|------|-----|-------|
| White | #fff | Background, text on dark |
| Black | #081828 | Primary text, dark backgrounds |
| Gray | #F4F7FA | Light backgrounds, sections |

### Theme Color
- **Primary**: #7E57FF (Main CTA, active states, focus)
- **Primary Light**: #E8E0FF (Hover states, backgrounds)
- **Primary Dark**: #6B4FD8 (Pressed states)

### Semantic Colors
- **Border**: #F4EEFB (Dividers, borders, separators)
- **Body Text**: #727272 (Regular content)
- **Heading Text**: #081828 (Titles, headers)

---

## Spacing

- `xs`: 4px
- `sm`: 8px
- `md`: 12px
- `lg`: 16px
- `xl`: 24px
- `2xl`: 32px
- `3xl`: 48px
- `4xl`: 64px

---

## Border Radius
- **Default**: 10px
- **Subtle**: 6px
- **None**: 0px

---

## Breakpoints & Responsive Design

| Device | Min Width | Max Width | Variable |
|--------|-----------|-----------|----------|
| Desktop | 1400px | - | `$desktop` |
| Laptop | 1200px | 1399px | `$laptop` |
| Large | 992px | 1199px | `$lg` |
| Medium | 768px | 991px | `$md` |
| Small | 480px | 767px | `$sm` |
| Extra Small | - | 767px | `$xs` |

---

## Shadows

- `sm`: 0 1px 2px rgba(0, 0, 0, 0.05)
- `md`: 0 4px 6px rgba(0, 0, 0, 0.1)
- `lg`: 0 10px 15px rgba(0, 0, 0, 0.1)
- `xl`: 0 20px 25px rgba(0, 0, 0, 0.1)

---

## Transitions

- `fast`: 150ms ease-in-out
- `base`: 250ms ease-in-out
- `slow`: 350ms ease-in-out

---

## Component Guidelines

### Buttons
- **Primary (CTA)**: Background #7E57FF, Text white
- **Secondary**: Background transparent, Border #7E57FF, Text #7E57FF
- **Hover**: Background #E8E0FF or #6B4FD8 depending on style
- **Border Radius**: 10px
- **Padding**: 12px 24px (adjustable per size)

### Forms
- **Border Color**: #F4EEFB
- **Border Radius**: 10px
- **Focus Color**: #7E57FF
- **Label Color**: #081828
- **Help Text**: #727272

### Cards
- **Background**: #ffffff or #F4F7FA
- **Border**: 1px solid #F4EEFB
- **Border Radius**: 10px
- **Shadow**: md (0 4px 6px rgba(0, 0, 0, 0.1))

### Headings
- **Color**: #081828
- **Font Family**: DM Sans
- **Font Weight**: 600-700

### Body Text
- **Color**: #727272
- **Font Family**: DM Sans
- **Font Weight**: 400

---

## Import Usage

```javascript
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS, BREAKPOINTS, MEDIA_QUERIES, SHADOWS, TRANSITIONS } from './theme/ThemeConfig';

// Usage
const myStyle = {
  fontFamily: TYPOGRAPHY.fontFamily,
  fontSize: TYPOGRAPHY.sizes.base,
  color: COLORS.text.heading,
  borderRadius: BORDER_RADIUS,
  padding: SPACING.lg,
  boxShadow: SHADOWS.md,
  transition: TRANSITIONS.base
};
```

---

## Color Accessibility

- **Primary Purple (#7E57FF)** on white meets WCAG AA standards
- **Body Text (#727272)** on white meets WCAG AA standards
- **Heading Text (#081828)** on white/light gray meets WCAG AAA standards

---

## Last Updated
2026-03-04