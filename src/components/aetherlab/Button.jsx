import React from 'react';

export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  disabled = false, 
  onClick,
  className = '',
  type = 'button',
  ...props 
}) {
  const baseStyles = `
    font-family: var(--font-primary);
    border: none;
    border-radius: var(--border-radius);
    cursor: ${disabled ? 'not-allowed' : 'pointer'};
    transition: all var(--transition-base);
    font-weight: var(--font-weight-semibold);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    opacity: ${disabled ? 0.5 : 1};
  `;

  const variants = {
    primary: `
      background-color: #7E57FF;
      color: #ffffff;
      &:hover:not(:disabled) {
        background-color: #081828;
        box-shadow: 0px 10px 20px rgba(0, 0, 0, 0.1);
      }
    `,
    secondary: `
      background-color: var(--color-gray);
      color: var(--color-heading);
      &:hover:not(:disabled) {
        background-color: #e8e8f0;
      }
    `,
    outline: `
      background-color: transparent;
      color: var(--color-primary);
      border: 2px solid var(--color-primary);
      &:hover:not(:disabled) {
        background-color: var(--color-primary);
        color: var(--color-white);
      }
    `,
    danger: `
      background-color: var(--color-error);
      color: var(--color-white);
      &:hover:not(:disabled) {
        background-color: #dc2626;
        box-shadow: var(--shadow-lg);
      }
    `,
    success: `
      background-color: var(--color-success);
      color: var(--color-white);
      &:hover:not(:disabled) {
        background-color: #059669;
        box-shadow: var(--shadow-lg);
      }
    `
  };

  const sizes = {
    sm: 'padding: var(--spacing-sm) var(--spacing-md); font-size: var(--font-size-sm);',
    md: 'padding: var(--spacing-md) var(--spacing-lg); font-size: var(--font-size-base);',
    lg: 'padding: var(--spacing-lg) var(--spacing-xl); font-size: var(--font-size-lg);'
  };

  const style = {
    ...baseStyles,
    ...sizes[size],
    ...(variant && variants[variant])
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        fontFamily: 'var(--font-primary)',
        borderRadius: 'var(--border-radius)',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all var(--transition-base)',
        fontWeight: 'var(--font-weight-semibold)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        opacity: disabled ? 0.5 : 1,
        ...(variant === 'primary' && {
           backgroundColor: '#7E57FF',
           color: '#ffffff',
         }),
        ...(variant === 'secondary' && {
          backgroundColor: 'var(--color-gray)',
          color: 'var(--color-heading)',
        }),
        ...(variant === 'outline' && {
          backgroundColor: 'transparent',
          color: 'var(--color-primary)',
          border: '2px solid var(--color-primary)',
        }),
        ...(variant === 'danger' && {
          backgroundColor: 'var(--color-error)',
          color: 'var(--color-white)',
        }),
        ...(variant === 'success' && {
          backgroundColor: 'var(--color-success)',
          color: 'var(--color-white)',
        }),
        ...(size === 'sm' && {
          padding: 'var(--spacing-sm) var(--spacing-md)',
          fontSize: 'var(--font-size-sm)',
        }),
        ...(size === 'md' && {
          padding: 'var(--spacing-md) var(--spacing-lg)',
          fontSize: 'var(--font-size-base)',
        }),
        ...(size === 'lg' && {
          padding: 'var(--spacing-lg) var(--spacing-xl)',
          fontSize: 'var(--font-size-lg)',
        }),
      }}
      className={className}
      {...props}
    >
      {children}
    </button>
  );
}