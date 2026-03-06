import React, { useState } from 'react';

export default function AboutFeatureItem({
  icon: Icon,
  title,
  description
}) {
  const [isRotating, setIsRotating] = useState(false);

  const handleMouseEnter = () => {
    setIsRotating(true);
  };

  const handleMouseLeave = () => {
    setIsRotating(false);
  };

  return (
    <div
      style={{
        position: 'relative',
        paddingLeft: '42px',
        marginTop: '40px',
        display: 'inline-block',
        verticalAlign: 'top',
        marginRight: '2%'
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* List Icon */}
      <div
        style={{
          height: '20px',
          width: '20px',
          lineHeight: '20px',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          color: '#ffffff',
          fontSize: '11px',
          backgroundColor: '#7E57FF',
          position: 'absolute',
          left: 0,
          top: 0,
          transition: 'all 0.4s ease',
          transform: isRotating ? 'rotate(360deg)' : 'rotate(0deg)'
        }}
      >
        {Icon && <Icon size={12} />}
      </div>

      {/* Title */}
      {title && (
        <h4
          style={{
            color: '#081828',
            fontSize: '15px',
            marginBottom: '10px',
            margin: 0,
            marginBottom: '10px',
            fontWeight: 600
          }}
        >
          {title}
        </h4>
      )}

      {/* Description */}
      {description && (
        <p
          style={{
            margin: 0,
            fontSize: '15px',
            lineHeight: '24px',
            color: '#727272'
          }}
        >
          {description}
        </p>
      )}
    </div>
  );
}