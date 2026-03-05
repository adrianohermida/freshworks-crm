/* ======================================
   Aetherlab Design System Variables
   ====================================== */

// ================================
// FONT FAMILY
// ================================
$font-primary: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
$font-secondary: 'Spartan', sans-serif;

// ================================
// COLOR PALETTE - PRIMARY
// ================================
$color-primary: #7E57FF;
$color-primary-dark: #6b46c1;
$color-primary-light: #E8DFFB;

// ================================
// COLOR PALETTE - NEUTRALS
// ================================
$color-white: #ffffff;
$color-black: #081828;
$color-gray: #F4F7FA;
$color-gray-50: #FAFBFC;
$color-gray-100: #F3F4F6;
$color-gray-200: #E5E7EB;
$color-gray-300: #D1D5DB;
$color-gray-400: #9CA3AF;
$color-gray-500: #6B7280;
$color-gray-600: #4B5563;
$color-gray-700: #374151;
$color-gray-800: #1F2937;
$color-gray-900: #111827;

// ================================
// COLOR PALETTE - SEMANTIC
// ================================
$color-heading: #081828;
$color-body: #727272;
$color-border: #F4EEFB;

$color-success: #10B981;
$color-warning: #F59E0B;
$color-error: #EF4444;
$color-info: #3B82F6;

// ================================
// SPACING
// ================================
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;
$spacing-2xl: 48px;
$spacing-3xl: 64px;

// ================================
// BORDER RADIUS
// ================================
$border-radius: 10px;
$border-radius-sm: 6px;
$border-radius-md: 10px;
$border-radius-lg: 16px;
$border-radius-full: 9999px;

// ================================
// TYPOGRAPHY
// ================================
$font-size-xs: 12px;
$font-size-sm: 14px;
$font-size-base: 16px;
$font-size-lg: 18px;
$font-size-xl: 20px;
$font-size-2xl: 24px;
$font-size-3xl: 32px;
$font-size-4xl: 40px;

$font-weight-light: 300;
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;

$line-height-tight: 1.2;
$line-height-normal: 1.5;
$line-height-relaxed: 1.75;

// ================================
// SHADOWS
// ================================
$shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
$shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
$shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
$shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.15);

// ================================
// TRANSITIONS
// ================================
$transition-fast: 150ms ease;
$transition-base: 250ms ease;
$transition-slow: 350ms ease;

// ================================
// RESPONSIVE BREAKPOINTS (Media Queries)
// ================================

// Desktop & Laptop
$desktop: 'only screen and (min-width: 1400px)';
$laptop: 'only screen and (min-width: 1200px) and (max-width: 1399px)';

// Large screens
$lg: 'only screen and (min-width: 992px) and (max-width: 1199px)';

// Medium screens (tablets)
$md: 'only screen and (min-width: 768px) and (max-width: 991px)';

// Small screens (small tablets & large phones)
$sm: 'only screen and (min-width: 480px) and (max-width: 767px)';

// Extra small screens (phones)
$xs: '(max-width: 767px)';

// ================================
// BREAKPOINT MAPS FOR MEDIA QUERIES
// ================================
$breakpoints: (
  'xs': 320px,
  'sm': 480px,
  'md': 768px,
  'lg': 992px,
  'xl': 1200px,
  'xxl': 1400px
);

// ================================
// LEGACY VARIABLE MAPPINGS
// ================================
// These maintain backward compatibility with old SCSS files

$white: $color-white;
$black: $color-black;
$gray: $color-gray;
$theme-color: $color-primary;
$border-color: $color-border;
$body-color: $color-body;
$heading-color: $color-heading;
$borderRadius: $border-radius;
$font: $font-primary;