import React, { useState } from 'react';
import { ExternalLink } from 'lucide-react';

export default function PortfolioItem({ 
  image, 
  title, 
  category,
  onViewClick 
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        borderRadius: '6px',
        overflow: 'hidden',
        marginBottom: '30px'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Portfolio Image */}
      <img
        src={image}
        alt={title}
        style={{
          width: '100%',
          transition: 'all 0.4s ease',
          transform: isHovered ? 'scale(1.1)' : 'scale(1)'
        }}
      />

      {/* Portfolio Overlay */}
      <div
        style={{
          position: 'absolute',
          left: '15px',
          bottom: '15px',
          backgroundColor: '#ffffff',
          padding: '20px 35px 20px 20px',
          borderRadius: '5px',
          boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.096)',
          display: 'inline-block'
        }}
      >
        <div>
          {category && (
            <p style={{
              margin: 0,
              fontSize: '12px',
              fontWeight: 500,
              color: '#7E57FF',
              textTransform: 'uppercase'
            }}>
              {category}
            </p>
          )}
          <h4 style={{
            marginTop: '5px',
            fontSize: '16px',
            fontWeight: 700,
            lineHeight: '28px',
            color: '#081828',
            margin: '5px 0 0 0'
          }}>
            {title}
          </h4>
        </div>

        {onViewClick && (
          <button
            onClick={onViewClick}
            style={{
              padding: '8px 27px',
              color: '#fff',
              border: '2px solid #fff',
              backgroundColor: '#7E57FF',
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '10px',
              fontSize: '12px',
              fontWeight: 600,
              transition: 'all 0.3s ease',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#fff';
              e.target.style.color = '#7E57FF';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#7E57FF';
              e.target.style.color = '#fff';
            }}
          >
            <ExternalLink size={14} />
            Ver
          </button>
        )}
      </div>
    </div>
  );
}