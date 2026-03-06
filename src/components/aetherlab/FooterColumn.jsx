import React from 'react';
import { COLORS, TYPOGRAPHY } from './theme/ThemeConfig';

export default function FooterColumn({ 
  title,
  type = "links", // "about", "links", "newsletter"
  logo,
  description,
  socialLinks,
  children,
  links = []
}) {
  return (
    <div
      className="md:mt-[40px] xs:mt-[40px] xs:text-center"
      style={{
        paddingRight: type === 'about' ? '30px' : '0'
      }}
      className={`md:mt-[40px] xs:mt-[40px] xs:text-center ${type === 'about' ? 'xs:p-0' : ''}`}
    >
      {/* About Section */}
      {type === 'about' && (
        <>
          {logo && (
            <div style={{ marginBottom: '20px' }}>
              <img
                src={logo}
                alt="Logo"
                style={{
                  width: '130px',
                  height: 'auto'
                }}
                className="md:w-[125px] xs:w-[120px]"
              />
            </div>
          )}

          {description && (
            <p
              style={{
                color: COLORS.white,
                marginTop: '20px',
                fontSize: '15px',
                marginBottom: '25px',
                fontFamily: TYPOGRAPHY.fontFamily,
                fontWeight: TYPOGRAPHY.weights.normal
              }}
            >
              {description}
            </p>
          )}

          {socialLinks && <div>{socialLinks}</div>}
        </>
      )}

      {/* Links Section */}
      {type === 'links' && (
        <>
          {title && (
            <h3
              style={{
                fontSize: '17px',
                fontWeight: TYPOGRAPHY.weights.semibold,
                display: 'block',
                marginBottom: '35px',
                color: COLORS.white,
                margin: '0 0 35px 0',
                fontFamily: TYPOGRAPHY.fontFamily
              }}
              className="md:mb-[25px] xs:mb-[25px]"
            >
              {title}
            </h3>
          )}

          <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {links.map((link, idx) => (
              <li key={idx} style={{ display: 'block', marginBottom: '15px' }}>
                <a
                  href={link.href || '#'}
                  style={{
                    fontSize: '15px',
                    fontWeight: TYPOGRAPHY.weights.normal,
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
        </>
      )}

      {/* Newsletter Section */}
      {type === 'newsletter' && (
        <>
          {title && (
            <h3
              style={{
                fontSize: '17px',
                fontWeight: TYPOGRAPHY.weights.semibold,
                display: 'block',
                marginBottom: '35px',
                color: COLORS.white,
                margin: '0 0 35px 0',
                fontFamily: TYPOGRAPHY.fontFamily
              }}
              className="md:mb-[25px] xs:mb-[25px]"
            >
              {title}
            </h3>
          )}
          {description && (
            <p
              style={{
                color: COLORS.white,
                fontFamily: TYPOGRAPHY.fontFamily,
                fontSize: '15px',
                marginBottom: '15px'
              }}
            >
              {description}
            </p>
          )}
          {children}
        </>
      )}

      {/* Custom Content */}
      {!type && children}
    </div>
  );
}