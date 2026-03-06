import React from 'react';

export default function Spinner({
  size = 'md',
  color = 'primary',
  className = '',
}) {
  const sizes = {
    sm: { width: '20px', height: '20px' },
    md: { width: '40px', height: '40px' },
    lg: { width: '60px', height: '60px' },
  };

  const colors = {
    primary: 'var(--color-primary)',
    secondary: 'var(--color-secondary)',
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    error: 'var(--color-error)',
  };

  const spinnerStyle = {
    border: `4px solid ${colors[color]}20`,
    borderTop: `4px solid ${colors[color]}`,
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    ...sizes[size],
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div style={spinnerStyle} className={className} />
    </>
  );
}