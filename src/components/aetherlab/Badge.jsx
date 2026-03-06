import React from 'react';

export default function Badge({ 
  children, 
  variant = 'primary', 
  size = 'md',
  className = '' 
}) {
  const sizes = {
    sm: {
      padding: 'var(--spacing-xs) var(--spacing-sm)',
      fontSize: 'var(--font-size-xs)',
    },
    md: {
      padding: 'var(--spacing-sm) var(--spacing-md)',
      fontSize: 'var(--font-size-sm)',
    },
    lg: {
      padding: 'var(--spacing-md) var(--spacing-lg)',
      fontSize: 'var(--font-size-base)',
    },
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-white)',
    },
    secondary: {
      backgroundColor: 'var(--color-gray)',
      color: 'var(--color-heading)',
    },
    success: {
      backgroundColor: 'var(--color-success)',
      color: 'var(--color-white)',
    },
    warning: {
      backgroundColor: 'var(--color-warning)',
      color: 'var(--color-white)',
    },
    error: {
      backgroundColor: 'var(--color-error)',
      color: 'var(--color-white)',
    },
    info: {
      backgroundColor: 'var(--color-info)',
      color: 'var(--color-white)',
    },
  };

  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 'var(--border-radius-sm)',
    fontWeight: 'var(--font-weight-semibold)',
    whiteSpace: 'nowrap',
    ...sizes[size],
    ...variants[variant],
  };

  return (
    <span style={style} className={className}>
      {children}
    </span>
  );
}