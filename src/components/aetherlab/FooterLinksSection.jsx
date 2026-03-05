import React from 'react';
import { COLORS, TYPOGRAPHY } from './theme/ThemeConfig';

export default function FooterLinksSection({ 
  title = "Links",
  links = []
}) {
  return (
    <div>
      <h3
        style={{
          fontSize: '17px',
          fontWeight: TYPOGRAPHY.weights.semibold,
          display: 'block',
          marginBottom: '35px',
          color: COLORS.white,
          fontFamily: TYPOGRAPHY.fontFamily,
          margin: '0 0 35px 0'
        }}
        className="md:mb-[25px] xs:mb-[25px]"
      >
        {title}
      </h3>

      <ul
        style={{
          listStyle: 'none',
          padding: '0',
          margin: '0'
        }}
      >
        {links.map((link, idx) => (
          <li
            key={idx}
            style={{
              display: 'block',
              marginBottom: '15px'
            }}
            className="last:m-0"
          >
            <a
              href={link.href}
              style={{
                fontSize: '15px',
                fontWeight: '400',
                color: COLORS.white,
                textDecoration: 'none',
                transition: 'color 0.3s ease',
                fontFamily: TYPOGRAPHY.fontFamily
              }}
              onMouseEnter={(e) => e.target.style.color = COLORS.primary}
              onMouseLeave={(e) => e.target.style.color = COLORS.white}
            >
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}