import React from 'react';
import { COLORS, TYPOGRAPHY } from './theme/ThemeConfig';

export default function ContactWidget({ 
  title = "Entre em Contato",
  description = "Estamos aqui para ajudar. Entre em contato conosco.",
  items = []
}) {
  return (
    <div
      style={{
        paddingRight: '80px'
      }}
      className="md:pr-[50px] md:mb-[50px] xs:p-0 xs:mb-[40px]"
    >
      {/* Header */}
      <div style={{ marginBottom: '40px' }}>
        {title && (
          <h2
            style={{
              fontSize: '28px',
              fontWeight: TYPOGRAPHY.weights.bold,
              marginBottom: '20px',
              lineHeight: '40px',
              fontFamily: TYPOGRAPHY.fontFamily,
              color: COLORS.text.heading
            }}
            className="md:text-[24px] md:leading-[35px] xs:text-[22px] xs:leading-[35px]"
          >
            {title}
          </h2>
        )}

        {description && (
          <p
            style={{
              fontSize: '16px',
              fontFamily: TYPOGRAPHY.fontFamily,
              color: COLORS.text.body,
              margin: '0'
            }}
          >
            {description}
          </p>
        )}
      </div>

      {/* Contact Items */}
      <div>
        {items.map((item, idx) => (
          <div
            key={idx}
            style={{
              marginBottom: idx === items.length - 1 ? '0' : '30px'
            }}
          >
            <h3
              style={{
                fontSize: '16px',
                fontWeight: TYPOGRAPHY.weights.bold,
                display: 'block',
                marginBottom: '18px',
                fontFamily: TYPOGRAPHY.fontFamily,
                color: COLORS.text.heading,
                margin: '0 0 18px 0'
              }}
            >
              {item.label}
            </h3>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '3px'
              }}
            >
              {Array.isArray(item.content) ? (
                item.content.map((content, i) => (
                  <p
                    key={i}
                    style={{
                      fontSize: '15px',
                      fontFamily: TYPOGRAPHY.fontFamily,
                      color: COLORS.text.body,
                      margin: i === item.content.length - 1 ? '0' : '0 0 3px 0'
                    }}
                  >
                    {content}
                  </p>
                ))
              ) : (
                <p
                  style={{
                    fontSize: '15px',
                    fontFamily: TYPOGRAPHY.fontFamily,
                    color: COLORS.text.body,
                    margin: '0'
                  }}
                >
                  {item.content}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}