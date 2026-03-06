import React from 'react';
import { COLORS, TYPOGRAPHY } from './theme/ThemeConfig';

export default function LoginButton({ 
  children = "Login",
  type = "submit",
  onClick,
  variant = "primary",
  fullWidth = false,
  loading = false,
  disabled = false
}) {
  const variants = {
    primary: {
      backgroundColor: COLORS.primary,
      color: COLORS.white
    },
    secondary: {
      backgroundColor: 'transparent',
      color: COLORS.primary,
      border: `2px solid ${COLORS.primary}`
    },
    outline: {
      backgroundColor: 'transparent',
      color: COLORS.text.body,
      border: '2px solid #eee'
    }
  };

  const styles = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      style={{
        padding: '14px 40px',
        marginRight: variant === 'primary' ? '20px' : '0',
        width: fullWidth ? '100%' : 'auto',
        backgroundColor: disabled ? '#ccc' : styles.backgroundColor,
        color: styles.color,
        border: styles.border || 'none',
        borderRadius: '30px',
        fontSize: '15px',
        fontWeight: TYPOGRAPHY.weights.semibold,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        fontFamily: TYPOGRAPHY.fontFamily,
        opacity: loading ? '0.7' : '1'
      }}
      onMouseEnter={(e) => {
        if (!disabled && !loading) {
          e.target.style.transform = 'translateY(-2px)';
          e.target.style.boxShadow = '0px 10px 20px rgba(0, 0, 0, 0.1)';
        }
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = 'none';
      }}
    >
      {loading ? '...' : children}
    </button>
  );
}