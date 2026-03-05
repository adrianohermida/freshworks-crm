import React from 'react';
import { COLORS } from './theme/ThemeConfig';

export default function FooterPublic({ 
  children
}) {
  return (
    <footer
      style={{
        backgroundColor: COLORS.black,
        position: 'relative',
        paddingBottom: '0'
      }}
      className="md:pt-[30px] xs:pt-[20px]"
    >
      {/* Main Footer Content */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '40px',
          padding: '60px 0'
        }}
        className="md:grid-cols-2 xs:grid-cols-1 md:gap-[40px] xs:gap-[40px]"
      >
        {children}
      </div>
    </footer>
  );
}