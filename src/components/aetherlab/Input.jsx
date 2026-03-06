import React from 'react';

export default function Input({
  type = 'text',
  placeholder = '',
  value,
  onChange,
  disabled = false,
  error = false,
  helperText = '',
  label = '',
  size = 'md',
  variant = 'outline',
  className = '',
  id,
  ...props
}) {
  const sizes = {
    sm: {
      padding: 'var(--spacing-sm) var(--spacing-md)',
      fontSize: 'var(--font-size-sm)',
    },
    md: {
      padding: 'var(--spacing-md) var(--spacing-md)',
      fontSize: 'var(--font-size-base)',
    },
    lg: {
      padding: 'var(--spacing-lg) var(--spacing-md)',
      fontSize: 'var(--font-size-lg)',
    },
  };

  const baseStyle = {
    width: '100%',
    borderRadius: '5px',
    fontFamily: "'DM Sans', sans-serif",
    transition: 'all 0.4s ease',
    color: '#081828',
    ...sizes[size],
  };

  const variants = {
    outline: {
      ...baseStyle,
      border: `1px solid ${error ? '#f44336' : '#eee'}`,
      backgroundColor: '#F4F7FA',
    },
    filled: {
      ...baseStyle,
      border: 'none',
      backgroundColor: '#F4F7FA',
    },
  };

  const style = {
    ...variants[variant],
    opacity: disabled ? 0.5 : 1,
  };

  return (
    <div style={{ width: '100%' }} className={className}>
      {label && (
        <label style={{
          display: 'block',
          marginBottom: 'var(--spacing-sm)',
          fontWeight: 'var(--font-weight-semibold)',
          color: 'var(--color-heading)',
          fontSize: 'var(--font-size-sm)',
        }}>
          {label}
        </label>
      )}
      
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        style={style}
        {...props}
      />
      
      {helperText && (
        <small style={{
          display: 'block',
          marginTop: 'var(--spacing-sm)',
          color: error ? 'var(--color-error)' : 'var(--color-body)',
          fontSize: 'var(--font-size-xs)',
        }}>
          {helperText}
        </small>
      )}
    </div>
  );
}