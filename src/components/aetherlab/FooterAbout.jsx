import React from 'react';
import { COLORS, TYPOGRAPHY } from './theme/ThemeConfig';

export default function FooterAbout({ 
  logoSrc,
  description = "",
  socialTitle = "Siga-nos",
  socialLinks = [],
  copyrightText = ""
}) {
  return (
    <div
      style={{
        paddingRight: '30px'
      }}
      className="xs:p-0 xs:text-center"
    >
      {/* Logo */}
      {logoSrc && (
        <div style={{ marginBottom: '20px' }}>
          <img
            src={logoSrc}
            alt="Logo"
            style={{
              width: '130px',
              display: 'block'
            }}
            className="md:w-[125px] xs:w-[120px]"
          />
        </div>
      )}

      {/* Description */}
      {description && (
        <p
          style={{
            color: COLORS.white,
            marginTop: '20px',
            fontSize: '15px',
            marginBottom: '25px',
            fontFamily: TYPOGRAPHY.fontFamily,
            fontWeight: '400',
            margin: '20px 0 25px 0'
          }}
        >
          {description}
        </p>
      )}

      {/* Social Links */}
      {socialLinks.length > 0 && (
        <div>
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
            {socialTitle}
          </span>

          <ul
            style={{
              listStyle: 'none',
              padding: '0',
              margin: '0',
              display: 'flex',
              gap: '15px'
            }}
          >
            {socialLinks.map((link, idx) => (
              <li key={idx}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: COLORS.white,
                    textDecoration: 'none',
                    transition: 'color 0.3s ease',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                  onMouseEnter={(e) => e.target.style.color = COLORS.primary}
                  onMouseLeave={(e) => e.target.style.color = COLORS.white}
                >
                  {link.icon && <link.icon size={20} />}
                  {link.label && <span style={{ marginLeft: '8px' }}>{link.label}</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Copyright Text */}
      {copyrightText && (
        <div
          style={{
            color: COLORS.white,
            fontSize: '15px',
            marginTop: '40px',
            fontFamily: TYPOGRAPHY.fontFamily
          }}
          className="xs:mt-[20px]"
        >
          <p style={{ margin: '0 0 10px 0', display: 'block' }}>
            {copyrightText}
          </p>
        </div>
      )}
    </div>
  );
}