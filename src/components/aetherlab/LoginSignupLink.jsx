import React from 'react';
import { COLORS, TYPOGRAPHY } from './theme/ThemeConfig';

export default function LoginSignupLink({ 
  text = "Não tem conta?",
  linkText = "Criar uma agora",
  href = "#"
}) {
  return (
    <a
      href={href}
      style={{
        fontWeight: '500',
        color: COLORS.black,
        textAlign: 'center',
        marginTop: '35px',
        fontSize: '14px',
        display: 'block',
        textDecoration: 'none',
        fontFamily: TYPOGRAPHY.fontFamily,
        transition: 'all 0.3s ease'
      }}
      onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
      onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
    >
      {text}{' '}
      <span
        style={{
          color: COLORS.primary,
          fontWeight: TYPOGRAPHY.weights.semibold
        }}
      >
        {linkText}
      </span>
    </a>
  );
}