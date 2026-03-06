import React from 'react';
import { COLORS, TYPOGRAPHY } from './theme/ThemeConfig';

export default function LoginForm({ 
  children,
  onSubmit 
}) {
  return (
    <div
      style={{
        backgroundColor: COLORS.lightGray,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        style={{
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.075)',
          maxWidth: '500px',
          width: '100%'
        }}
      >
        <form
          onSubmit={onSubmit}
          style={{
            padding: '60px 70px',
            backgroundColor: COLORS.white,
            border: 'none'
          }}
          className="md:p-[50px] xs:p-[50px_35px]"
        >
          <div style={{ padding: '0' }}>
            {children}
          </div>
        </form>
      </div>
    </div>
  );
}