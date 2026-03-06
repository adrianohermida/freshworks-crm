import React from 'react';

export default function Card({ 
  children, 
  variant = 'default', 
  hover = true,
  className = '' 
}) {
  const baseStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    border: '1px solid #eee',
    padding: '40px',
    transition: 'all 0.4s ease',
    boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.089)',
  };

  const variants = {
    default: {
      ...baseStyle,
      ...(hover && { cursor: 'pointer' }),
    },
    elevated: {
      ...baseStyle,
      boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.075)',
      border: 'none',
    },
    gradient: {
      ...baseStyle,
      background: 'linear-gradient(135deg, #7E57FF 0%, #6b46c1 100%)',
      color: '#ffffff',
      border: 'none',
      boxShadow: '0px 10px 30px rgba(126, 87, 255, 0.2)',
    },
  };

  return (
    <div 
      style={variants[variant]}
      className={className}
    >
      {children}
    </div>
  );
}