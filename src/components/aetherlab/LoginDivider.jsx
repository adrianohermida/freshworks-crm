import React from 'react';
import { COLORS } from './theme/ThemeConfig';

export default function LoginDivider({ 
  text = "ou"
}) {
  return (
    <div
      style={{
        position: 'relative',
        textAlign: 'center',
        margin: '30px 0',
        zIndex: '0'
      }}
    >
      <span
        style={{
          textAlign: 'center',
          fontSize: '16px',
          backgroundColor: COLORS.white,
          padding: '5px 12px',
          color: COLORS.text.body,
          position: 'relative',
          zIndex: '1'
        }}
      >
        {text}
      </span>

      <div
        style={{
          position: 'absolute',
          content: '""',
          left: '0',
          top: '50%',
          marginTop: '-1px',
          backgroundColor: '#e8e8e8',
          height: '1px',
          width: '100%',
          zIndex: '-1'
        }}
      />
    </div>
  );
}