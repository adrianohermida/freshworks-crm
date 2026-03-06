import React from 'react';
import { COLORS, TYPOGRAPHY } from './theme/ThemeConfig';

export default function LoginSocialOptions({ 
  title = "Ou continue com",
  options = []
}) {
  return (
    <div
      style={{
        marginTop: '30px',
        textAlign: 'center'
      }}
      className="xs:mt-[30px]"
    >
      <span
        style={{
          marginBottom: '15px',
          textAlign: 'center',
          display: 'block',
          fontSize: '14px',
          color: COLORS.text.body,
          fontWeight: '500',
          fontFamily: TYPOGRAPHY.fontFamily
        }}
      >
        {title}
      </span>

      <div style={{ marginTop: '15px', display: 'flex', justifyContent: 'center', gap: '15px', flexWrap: 'wrap' }}>
        {options.map((option, idx) => (
          <button
            key={idx}
            onClick={option.onClick}
            style={{
              padding: '14px 25px 14px 15px',
              border: '1px solid #eee',
              borderRadius: '30px',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: COLORS.text.body,
              backgroundColor: COLORS.white,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontFamily: TYPOGRAPHY.fontFamily,
              fontSize: '14px',
              fontWeight: '500'
            }}
            onMouseEnter={(e) => {
              e.target.style.borderColor = COLORS.primary;
              e.target.style.color = COLORS.primary;
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#eee';
              e.target.style.color = COLORS.text.body;
            }}
          >
            {option.icon && (
              <img
                src={option.icon}
                alt={option.label}
                style={{
                  display: 'inline-block',
                  marginRight: '10px',
                  height: '20px',
                  width: '20px'
                }}
              />
            )}
            <span>{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}