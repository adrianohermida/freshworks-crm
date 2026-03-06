import React from 'react';

export default function ClientLogo({
  logo,
  alt = 'Client Logo',
  link = '#',
  onLogoClick
}) {
  const handleClick = () => {
    if (onLogoClick) {
      onLogoClick();
    }
  };

  return (
    <div
      style={{
        padding: '0 30px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        minHeight: '120px'
      }}
    >
      <a
        href={link}
        onClick={(e) => {
          if (onLogoClick) {
            e.preventDefault();
            handleClick();
          }
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%'
        }}
      >
        <img
          src={logo}
          alt={alt}
          style={{
            width: 'auto',
            height: 'auto',
            maxWidth: '100%',
            maxHeight: '80px',
            objectFit: 'contain'
          }}
        />
      </a>
    </div>
  );
}