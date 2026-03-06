import React from 'react';
import { Check } from 'lucide-react';

export default function SuccessMessage({ 
  title = 'Success!', 
  subtitle = '', 
  message = '',
  icon = null,
  onClose = null,
  showCloseButton = true
}) {
  return (
    <div style={{
      height: '100vh',
      width: '100%',
      backgroundColor: '#081828',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        display: 'inline-block',
        padding: '70px 60px',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        textAlign: 'center',
        maxWidth: '500px',
        width: '90%'
      }}>
        {/* Icon */}
        {icon ? (
          <div style={{
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'center'
          }}>
            {icon}
          </div>
        ) : (
          <div style={{
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <Check 
              size={60} 
              color="#7E57FF" 
              strokeWidth={1.5}
            />
          </div>
        )}

        {/* Title */}
        {title && (
          <h1 style={{
            fontSize: '40px',
            color: '#7E57FF',
            marginBottom: '20px',
            marginTop: 0,
            fontWeight: 700
          }}>
            {title}
          </h1>
        )}

        {/* Subtitle */}
        {subtitle && (
          <h2 style={{
            fontSize: '18px',
            marginBottom: '15px',
            marginTop: 0,
            color: '#081828',
            fontWeight: 600
          }}>
            {subtitle}
          </h2>
        )}

        {/* Message */}
        {message && (
          <p style={{
            fontWeight: 400,
            marginBottom: '30px',
            color: '#081828',
            fontSize: '16px',
            lineHeight: '1.6'
          }}>
            {message}
          </p>
        )}

        {/* Close Button */}
        {showCloseButton && onClose && (
          <button
            onClick={onClose}
            style={{
              backgroundColor: '#7E57FF',
              color: '#ffffff',
              border: 'none',
              padding: '12px 32px',
              fontSize: '15px',
              fontWeight: 600,
              borderRadius: '6px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#081828';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#7E57FF';
            }}
          >
            Fechar
          </button>
        )}
      </div>
    </div>
  );
}