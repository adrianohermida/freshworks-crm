import React from 'react';
import { COLORS, TYPOGRAPHY } from './theme/ThemeConfig';

export default function FooterCopyrightArea({ 
  leftContent = "© 2024 Todos os direitos reservados.",
  rightContent = "Desenvolvido com ❤️",
  links = []
}) {
  return (
    <div
      style={{
        borderTop: `1px solid rgba(238, 238, 238, 0.288)`,
        paddingTop: '30px',
        paddingBottom: '30px',
        marginTop: '80px'
      }}
      className="xs:mt-[50px] xs:text-center"
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          alignItems: 'center'
        }}
        className="xs:grid-cols-1"
      >
        {/* Left Side */}
        <div>
          <p
            style={{
              color: COLORS.white,
              fontSize: '15px',
              fontFamily: TYPOGRAPHY.fontFamily,
              fontWeight: '400',
              margin: '0'
            }}
          >
            {leftContent}
            {links.length > 0 && (
              <span style={{ marginLeft: '10px' }}>
                {links.map((link, idx) => (
                  <React.Fragment key={idx}>
                    {idx > 0 && ' | '}
                    <a
                      href={link.href}
                      style={{
                        textDecoration: 'underline',
                        color: COLORS.white,
                        transition: 'color 0.3s ease',
                        marginLeft: '10px'
                      }}
                      onMouseEnter={(e) => e.target.style.color = COLORS.primary}
                      onMouseLeave={(e) => e.target.style.color = COLORS.white}
                    >
                      {link.label}
                    </a>
                  </React.Fragment>
                ))}
              </span>
            )}
          </p>
        </div>

        {/* Right Side */}
        <div
          style={{
            textAlign: 'right'
          }}
          className="xs:text-center xs:mt-[15px]"
        >
          <p
            style={{
              color: COLORS.white,
              fontSize: '15px',
              fontFamily: TYPOGRAPHY.fontFamily,
              fontWeight: '400',
              margin: '0'
            }}
          >
            {rightContent}
          </p>
        </div>
      </div>
    </div>
  );
}