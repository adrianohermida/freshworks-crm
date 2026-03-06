import React, { useState } from 'react';

export default function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{
      marginBottom: '20px',
      boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.04)',
      borderRadius: '4px',
      overflow: 'hidden',
      backgroundColor: '#ffffff'
    }}>
      {/* Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          width: '100%',
          border: 'none',
          borderRadius: isOpen ? '4px 4px 0 0' : '4px',
          padding: '15px 25px 15px 25px',
          paddingRight: '40px',
          backgroundColor: isOpen ? '#7E57FF' : '#ffffff',
          color: isOpen ? '#ffffff' : '#081828',
          fontSize: '17px',
          fontWeight: 500,
          textAlign: 'left',
          position: 'relative',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          overflow: 'hidden'
        }}
        onMouseEnter={(e) => !isOpen && (e.target.style.backgroundColor = '#f9f7ff')}
        onMouseLeave={(e) => !isOpen && (e.target.style.backgroundColor = '#ffffff')}
      >
        <span style={{
          fontSize: '14px',
          fontWeight: 600,
          lineHeight: '25px',
          display: 'block',
          paddingRight: '20px'
        }}>
          {question}
        </span>

        {/* Icon */}
        <span style={{
          position: 'absolute',
          right: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '15px',
          transition: 'transform 0.3s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {isOpen ? '−' : '+'}
        </span>
      </button>

      {/* Content */}
      {isOpen && (
        <div style={{
          borderRadius: '0 0 4px 4px',
          padding: '25px',
          backgroundColor: '#ffffff',
          borderTop: '1px solid #f0f0f0',
          animation: 'slideDown 0.3s ease'
        }}>
          <p style={{
            margin: 0,
            color: '#777',
            lineHeight: 1.6,
            fontSize: 'var(--font-size-base)'
          }}>
            {answer}
          </p>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 768px) {
          [data-faq-item] button {
            padding: 18px 20px 18px 20px;
            padding-right: 40px;
          }
        }

        @media (max-width: 480px) {
          [data-faq-item] button {
            padding: 15px 20px 15px 20px;
            padding-right: 40px;
          }

          [data-faq-item] .content {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}