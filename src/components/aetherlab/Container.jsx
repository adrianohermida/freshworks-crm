import React from 'react';
import { SPACING, BORDER_RADIUS, COLORS } from './theme/ThemeConfig';

// Container for sections
export function Container({ children, className = '', size = 'lg', ...props }) {
  const sizes = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl'
  };

  return (
    <div
      className={`mx-auto px-6 ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// Card Component
export function Card({ children, className = '', variant = 'default', ...props }) {
  const variants = {
    default: {
      backgroundColor: COLORS.white,
      border: `1px solid ${COLORS.border}`,
      borderRadius: BORDER_RADIUS
    },
    bordered: {
      backgroundColor: 'transparent',
      border: `2px solid ${COLORS.primary}`,
      borderRadius: BORDER_RADIUS
    },
    filled: {
      backgroundColor: COLORS.gray,
      border: 'none',
      borderRadius: BORDER_RADIUS
    }
  };

  return (
    <div
      className={`p-6 ${className}`}
      style={variants[variant]}
      {...props}
    >
      {children}
    </div>
  );
}

// Grid Component
export function Grid({ children, className = '', cols = 3, gap = 'lg', ...props }) {
  const colClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
  };

  const gapValue = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-12'
  };

  return (
    <div
      className={`grid ${colClasses[cols]} ${gapValue[gap]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// Section with padding
export function Section({ children, className = '', padding = 'lg', bgColor = 'white', ...props }) {
  const paddingValue = {
    sm: 'py-8 px-6',
    md: 'py-12 px-6',
    lg: 'py-16 px-6',
    xl: 'py-24 px-6'
  };

  const bgClasses = {
    white: { backgroundColor: COLORS.white },
    gray: { backgroundColor: COLORS.gray },
    primary: { backgroundColor: COLORS.primaryLight }
  };

  return (
    <section
      className={`${paddingValue[padding]} ${className}`}
      style={bgClasses[bgColor]}
      {...props}
    >
      {children}
    </section>
  );
}

// Divider
export function Divider({ className = '', ...props }) {
  return (
    <div
      className={`${className}`}
      style={{
        height: '1px',
        backgroundColor: COLORS.border
      }}
      {...props}
    />
  );
}