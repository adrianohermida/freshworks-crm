/**
 * Aetherlab Design System - Theme Variables
 * Central source of truth for all design tokens
 */

export const theme = {
  // Font Family
  fonts: {
    primary: "'DM Sans', sans-serif"
  },

  // Colors
  colors: {
    white: '#ffffff',
    black: '#081828',
    gray: '#F4F7FA',
    primary: '#7E57FF',
    border: '#F4EEFB',
    text: '#727272',
    heading: '#081828'
  },

  // Border Radius
  borderRadius: {
    default: '10px',
    sm: '6px',
    md: '10px',
    lg: '20px',
    full: '50%'
  },

  // Spacing
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px'
  },

  // Font Sizes
  fontSize: {
    xs: '13px',
    sm: '14px',
    base: '15px',
    lg: '16px',
    xl: '18px',
    '2xl': '20px',
    '3xl': '25px',
    '4xl': '28px',
    '5xl': '34px',
    '6xl': '40px',
    '7xl': '50px'
  },

  // Font Weight
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700
  },

  // Line Heights
  lineHeight: {
    tight: '1.2',
    normal: '1.5',
    relaxed: '1.75'
  },

  // Box Shadows
  shadows: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px rgba(0, 0, 0, 0.15)',
    service: '0px 0px 30px rgba(81, 94, 125, 0.082)',
    hover: '0px 0px 10px rgba(0, 0, 0, 0.103)'
  },

  // Transitions
  transitions: {
    fast: '150ms ease',
    base: '250ms ease',
    slow: '350ms ease',
    default: 'all 0.4s ease'
  },

  // Breakpoints (pixels)
  breakpoints: {
    desktop: 1400,
    laptop: 1200,
    lg: 992,
    md: 768,
    sm: 480,
    xs: 0
  }
};

export default theme;