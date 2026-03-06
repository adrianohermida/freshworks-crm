import React, { useState } from 'react';

export default function ServiceCard({
  icon,
  title,
  description
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        minHeight: '300px',
        marginTop: '30px',
        borderRadius: '20px',
        backgroundColor: '#ffffff',
        boxShadow: '0px 0px 30px rgba(81, 94, 125, 0.082)',
        padding: '40px 50px',
        textAlign: 'center',
        transition: 'all 0.4s ease',
        borderTop: isHovered ? '3px solid #7E57FF' : '3px solid transparent',
        borderBottom: isHovered ? '3px solid #7E57FF' : '3px solid transparent',
        transform: isHovered ? 'scale(1.05)' : 'scale(1)'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Icon */}
      {icon && (
        <div
          style={{
            height: '65px',
            width: '65px',
            lineHeight: '65px',
            backgroundColor: '#7E57FF',
            color: '#ffffff',
            borderRadius: '10px',
            fontSize: '27px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {icon}
        </div>
      )}

      {/* Title */}
      {title && (
        <h3
          style={{
            color: '#081828',
            fontSize: '18px',
            lineHeight: '28px',
            fontWeight: 700,
            marginTop: '30px',
            marginBottom: '15px'
          }}
        >
          {title}
        </h3>
      )}

      {/* Description */}
      {description && (
        <p
          style={{
            lineHeight: '26px',
            fontSize: '15px',
            color: '#727272',
            margin: 0
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}