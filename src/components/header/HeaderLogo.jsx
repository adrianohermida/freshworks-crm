import React from 'react';

export default function HeaderLogo({ logo, alt = 'Logo' }) {
  return (
    <div style={{ 
      paddingLeft: 0, 
      borderRadius: 0,
      display: 'flex',
      alignItems: 'center'
    }}>
      {typeof logo === 'string' ? (
        <img 
          src={logo} 
          alt={alt}
          style={{
            width: '130px',
            height: 'auto'
          }}
        />
      ) : (
        logo
      )}
    </div>
  );
}