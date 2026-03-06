import React from 'react';
import { COLORS, TYPOGRAPHY } from './theme/ThemeConfig';

export default function LoginForgotPassword({ 
  href = "#"
}) {
  return (
    <a
      href={href}
      style={{
        color: '#888',
        fontSize: '14px',
        textDecoration: 'none',
        fontFamily: TYPOGRAPHY.fontFamily,
        fontWeight: '400',
        transition: 'color 0.3s ease',
        display: 'inline-block',
        marginTop: '10px'
      }}
      onMouseEnter={(e) => e.target.style.color = COLORS.primary}
      onMouseLeave={(e) => e.target.style.color = '#888'}
    >
      Esqueceu sua senha?
    </a>
  );
}