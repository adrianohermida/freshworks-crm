import React from 'react';
import { TYPOGRAPHY, COLORS } from './theme/ThemeConfig';

// Heading 1
export function H1({ children, className = '', ...props }) {
  return (
    <h1
      className={`text-4xl md:text-5xl font-extrabold ${className}`}
      style={{
        fontFamily: TYPOGRAPHY.fontFamily,
        color: COLORS.text.heading,
        lineHeight: 1.2
      }}
      {...props}
    >
      {children}
    </h1>
  );
}

// Heading 2
export function H2({ children, className = '', ...props }) {
  return (
    <h2
      className={`text-3xl md:text-4xl font-bold ${className}`}
      style={{
        fontFamily: TYPOGRAPHY.fontFamily,
        color: COLORS.text.heading,
        lineHeight: 1.3
      }}
      {...props}
    >
      {children}
    </h2>
  );
}

// Heading 3
export function H3({ children, className = '', ...props }) {
  return (
    <h3
      className={`text-2xl md:text-3xl font-bold ${className}`}
      style={{
        fontFamily: TYPOGRAPHY.fontFamily,
        color: COLORS.text.heading,
        lineHeight: 1.4
      }}
      {...props}
    >
      {children}
    </h3>
  );
}

// Heading 4
export function H4({ children, className = '', ...props }) {
  return (
    <h4
      className={`text-xl md:text-2xl font-semibold ${className}`}
      style={{
        fontFamily: TYPOGRAPHY.fontFamily,
        color: COLORS.text.heading,
        lineHeight: 1.5
      }}
      {...props}
    >
      {children}
    </h4>
  );
}

// Body Text
export function Body({ children, className = '', size = 'base', ...props }) {
  const sizes = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg'
  };

  return (
    <p
      className={`${sizes[size]} leading-relaxed ${className}`}
      style={{
        fontFamily: TYPOGRAPHY.fontFamily,
        color: COLORS.text.body,
        fontWeight: TYPOGRAPHY.weights.normal
      }}
      {...props}
    >
      {children}
    </p>
  );
}

// Small Text
export function Small({ children, className = '', ...props }) {
  return (
    <small
      className={`text-xs ${className}`}
      style={{
        fontFamily: TYPOGRAPHY.fontFamily,
        color: COLORS.text.body
      }}
      {...props}
    >
      {children}
    </small>
  );
}

// Label
export function Label({ children, className = '', ...props }) {
  return (
    <label
      className={`text-sm font-semibold ${className}`}
      style={{
        fontFamily: TYPOGRAPHY.fontFamily,
        color: COLORS.text.heading
      }}
      {...props}
    >
      {children}
    </label>
  );
}