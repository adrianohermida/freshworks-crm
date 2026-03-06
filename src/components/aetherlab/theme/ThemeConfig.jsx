// Design System Configuration
// Based on Aetherlab design variables

export const COLORS = {
  // Base Colors
  white: '#fff',
  black: '#081828',
  gray: '#F4F7FA',
  
  // Theme
  primary: '#7E57FF',
  primaryLight: '#E8E0FF',
  primaryDark: '#6B4FD8',
  
  // Semantic
  border: '#F4EEFB',
  text: {
    body: '#727272',
    heading: '#081828'
  }
};

export const TYPOGRAPHY = {
  fontFamily: "'DM Sans', sans-serif",
  
  // Font Sizes
  sizes: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
    '5xl': '48px'
  },
  
  // Font Weights
  weights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800
  }
};

export const SPACING = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
  '4xl': '64px'
};

export const BORDER_RADIUS = '10px';

export const BREAKPOINTS = {
  desktop: 1400,
  laptop: 1200,
  lg: 992,
  md: 768,
  sm: 480,
  xs: 0
};

export const MEDIA_QUERIES = {
  desktop: '@media only screen and (min-width: 1400px)',
  laptop: '@media only screen and (min-width: 1200px) and (max-width: 1399px)',
  lg: '@media only screen and (min-width: 992px) and (max-width: 1199px)',
  md: '@media only screen and (min-width: 768px) and (max-width: 991px)',
  sm: '@media only screen and (min-width: 480px) and (max-width: 767px)',
  xs: '@media (max-width: 767px)'
};

export const SHADOWS = {
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 10px 15px rgba(0, 0, 0, 0.1)',
  xl: '0 20px 25px rgba(0, 0, 0, 0.1)'
};

export const TRANSITIONS = {
  fast: '150ms ease-in-out',
  base: '250ms ease-in-out',
  slow: '350ms ease-in-out'
};