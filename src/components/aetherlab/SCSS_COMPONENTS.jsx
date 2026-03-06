# Aetherlab Design System - SCSS Components Index

## Overview
This document provides a reference guide for all SCSS component modules in the Aetherlab design system.

---

## Component Modules

### 1. **Variables** (`_variables.scss`)
- Font families, sizes, and weights
- Color palette
- Border radius
- Spacing scale
- Responsive breakpoints
- Box shadows
- Transitions

### 2. **Normalize** (`_normalize.scss`)
- CSS reset and normalization
- Base element styling
- Utility classes
- Responsive typography
- Accessibility styles

### 3. **Header** (`_header.scss`)
- Navigation bar styling
- Mobile menu
- Sticky header effects
- Logo styling
- Nav links and buttons

### 4. **Hero** (`_hero.scss`)
- Full-width hero banner
- Hero background images
- Hero text styling
- CTA buttons in hero
- Hero gradient overlays

### 5. **Services** (`_services.scss`)
- Service cards grid
- Icon styling
- Service hover effects
- Responsive grid layout
- Service descriptions

### 6. **Intro Video** (`_introvideo.scss`)
- Video container styling
- Play button overlay
- Responsive video embed
- Video thumbnail styling

### 7. **About** (`_about.scss`)
- About section layout
- Content grid
- About section images
- Feature highlights

### 8. **Testimonials** (`_testimonial.scss`)
- Testimonial cards
- Author profile styling
- Quote marks/icons
- Testimonial slider
- Navigation dots for carousel

### 9. **Blog** (`_blog.scss`)
- Blog post cards
- Blog post grid
- Featured blog styling
- Blog meta information
- Read more links

### 10. **Clients** (`_clients.scss`)
- Client logo grid
- Logo sizing and spacing
- Client carousel styling
- Logo hover effects

### 11. **Team** (`_team.scss`)
- Team member cards
- Profile image styling
- Member role/title
- Social links
- Hover animations

### 12. **Account/Login** (`_account-login.scss`)
- Login form styling
- Registration form
- Form input styling
- Error messaging
- Form validation states

### 13. **Contact** (`_contact.scss`)
- Contact form styling
- Form fields and labels
- Contact information display
- Map integration styling
- Form submission feedback

### 14. **Pricing Table** (`_pricing-table.scss`)
- Pricing cards
- Feature lists (checkmarks/crosses)
- Price display
- Popular/featured badge
- CTA buttons in pricing

### 15. **Portfolio** (`_portfolio.scss`)
- Portfolio item cards
- Image galleries
- Project filtering
- Hover effects on portfolio items
- Project categories

### 16. **FAQ** (`_faq.scss`)
- Accordion styling
- FAQ questions
- FAQ answers
- Expand/collapse animations
- Active state styling

### 17. **Call-to-Action** (`_cta.scss`)
- CTA sections
- CTA button styling
- CTA background styling
- CTA text alignment
- CTA hover effects

### 18. **Error** (`_error.scss`)
- 404 page styling
- 500 error page
- Error messages
- Error icons
- Back to home links

### 19. **Mail Success** (`_mail-success.scss`)
- Success message styling
- Success icons
- Confirmation messages
- Success animation
- Close button styling

### 20. **Footer** (`_footer.scss`)
- Footer layout
- Footer links
- Social media links
- Copyright text
- Footer widgets
- Responsive footer

---

## Usage

### Importing in React Components

```javascript
import { theme } from '@/components/theme';

const buttonStyle = {
  backgroundColor: theme.colors.primary,
  borderRadius: theme.borderRadius.default,
  fontSize: theme.fontSize.base,
  fontFamily: theme.fonts.primary,
  transition: theme.transitions.default
};
```

### CSS Variables (in globals.css)

```css
:root {
  --color-primary: #7E57FF;
  --color-text: #727272;
  --font-primary: 'DM Sans', sans-serif;
  --border-radius: 10px;
  --transition-default: all 0.4s ease;
}
```

---

## Design Token References

### Colors
- **Primary**: #7E57FF
- **Black**: #081828
- **Gray**: #F4F7FA
- **Text**: #727272
- **Border**: #F4EEFB
- **White**: #ffffff

### Breakpoints
- **Desktop**: 1400px+
- **Laptop**: 1200px - 1399px
- **Large**: 992px - 1199px
- **Medium**: 768px - 991px
- **Small**: 480px - 767px
- **Extra Small**: < 480px

### Font Family
- **Primary**: 'DM Sans', sans-serif

---

## Notes

- All components follow the Aetherlab design system
- Responsive design is mobile-first
- Uses Tailwind CSS for utility classes
- Inline styles in React for dynamic styling
- Consistent color palette and spacing