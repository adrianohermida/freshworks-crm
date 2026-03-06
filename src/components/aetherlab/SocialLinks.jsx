import React from 'react';
import { COLORS, TYPOGRAPHY } from './theme/ThemeConfig';

export default function SocialLinks({ 
  title = "Redes Sociais",
  links = []
}) {
  if (links.length === 0) return null;

  return (
    <div>
      {title && (
        <span
          style={{
            color: COLORS.white,
            fontSize: '13px',
            fontWeight: TYPOGRAPHY.weights.semibold,
            display: 'block',
            marginBottom: '20px',
            fontFamily: TYPOGRAPHY.fontFamily
          }}
        >
          {title}
        </span>
      )}
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {links.map((link, idx) => (
          <li
            key={idx}
            style={{
              display: 'inline-block',
              marginRight: '15px',
              marginBottom: 0
            }}
          >
            <a
              href={link.href || '#'}
              title={link.label}
              style={{
                color: COLORS.white,
                textDecoration: 'none',
                transition: 'color 0.3s ease',
                fontFamily: TYPOGRAPHY.fontFamily,
                fontSize: '16px'
              }}
              onMouseEnter={(e) => e.target.style.color = COLORS.primary}
              onMouseLeave={(e) => e.target.style.color = COLORS.white}
            >
              {link.icon && <span style={{ marginRight: '8px' }}>{link.icon}</span>}
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}