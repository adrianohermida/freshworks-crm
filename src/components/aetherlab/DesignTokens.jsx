/**
 * Aetherlab Design System - Design Tokens
 * Variáveis centralizadas de design baseadas no brand Aetherlab
 */

export const designTokens = {
  // Font Family
  fonts: {
    primary: "'DM Sans', 'Inter', system-ui, -apple-system, sans-serif",
    mono: "'Fira Code', monospace",
  },

  // Colors - Palette
  colors: {
    // Neutrals
    white: '#ffffff',
    black: '#081828',
    gray: '#F4F7FA',
    
    // Primary Theme
    primary: '#7E57FF',
    primaryLight: '#9F7FFF',
    primaryDark: '#6A4AD1',
    
    // Semantic
    border: '#F4EEFB',
    bodyText: '#727272',
    heading: '#081828',
    
    // Extended Neutrals
    neutral: {
      50: '#F4F7FA',
      100: '#EAEEF5',
      200: '#D5E1EB',
      300: '#C0D4E1',
      400: '#ABE7D7',
      500: '#727272',
      600: '#5A5A5A',
      700: '#424242',
      800: '#2A2A2A',
      900: '#081828',
    },
    
    // Status Colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '4px',
    base: '8px',
    md: '10px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  // Spacing Scale (8px base)
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },

  // Typography Scale
  typography: {
    h1: {
      fontSize: '48px',
      fontWeight: 700,
      lineHeight: '56px',
      letterSpacing: '-0.5px',
    },
    h2: {
      fontSize: '36px',
      fontWeight: 700,
      lineHeight: '44px',
      letterSpacing: '-0.25px',
    },
    h3: {
      fontSize: '28px',
      fontWeight: 600,
      lineHeight: '36px',
    },
    h4: {
      fontSize: '24px',
      fontWeight: 600,
      lineHeight: '32px',
    },
    body: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '24px',
    },
    bodySmall: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: '20px',
    },
    caption: {
      fontSize: '12px',
      fontWeight: 400,
      lineHeight: '16px',
    },
  },

  // Shadow System
  shadows: {
    none: 'none',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    md: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    lg: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    xl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    'primary-sm': '0 4px 12px 0 rgba(126, 87, 255, 0.15)',
    'primary-md': '0 10px 25px 0 rgba(126, 87, 255, 0.2)',
  },

  // Transitions
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  },

  // Breakpoints (Mobile-first approach)
  breakpoints: {
    xs: '0px',
    sm: '480px',
    md: '768px',
    lg: '992px',
    xl: '1200px',
    '2xl': '1400px',
  },

  // Z-Index Scale
  zIndex: {
    hide: '-1',
    base: '0',
    dropdown: '1000',
    sticky: '100',
    fixed: '1000',
    backdrop: '1040',
    modal: '1050',
    popover: '1060',
    tooltip: '1070',
  },
};

// Utility function para acessar tokens
export const getToken = (path) => {
  return path.split('.').reduce((obj, key) => obj?.[key], designTokens);
};