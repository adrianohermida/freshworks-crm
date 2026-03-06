import React from 'react';
import { COLORS, TYPOGRAPHY } from './theme/ThemeConfig';

export default function LoginFormTitle({ 
  title = "Login",
  subtitle = ""
}) {
  return (
    <div
      style={{
        marginBottom: '45px',
        textAlign: 'center'
      }}
      className="xs:mb-[30px]"
    >
      <h3
        style={{
          fontSize: '25px',
          fontWeight: TYPOGRAPHY.weights.bold,
          color: COLORS.black,
          marginBottom: '8px',
          margin: '0 0 8px 0',
          fontFamily: TYPOGRAPHY.fontFamily
        }}
        className="xs:text-[22px]"
      >
        {title}
      </h3>
      {subtitle && (
        <p
          style={{
            fontSize: '14px',
            color: COLORS.text.body,
            margin: '0',
            fontFamily: TYPOGRAPHY.fontFamily,
            fontWeight: '400'
          }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}