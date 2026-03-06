import React from 'react';
import { Check, X } from 'lucide-react';

export default function PricingCard({
  title,
  subtitle,
  price,
  currency = 'R$',
  duration = '/mês',
  features = [],
  buttonText = 'Começar',
  onButtonClick, // Changed from onButtonClick = null
  isPopular = false,
  isFeatured = false
}) {
  return (
    <div
      style={{
        border: isFeatured ? '2px solid #7E57FF' : '1px solid #eee',
        borderRadius: '12px',
        marginTop: '40px',
        backgroundColor: '#ffffff',
        transition: 'all 0.4s ease',
        padding: '50px 35px',
        textAlign: 'left',
        zIndex: 0,
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'none'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0px 15px 30px rgba(0, 0, 0, 0.08)';
        e.currentTarget.style.transform = 'translateY(-5px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Popular Badge */}
      {isPopular && (
        <div
          style={{
            position: 'absolute',
            right: '20px',
            top: '18px',
            color: '#7E57FF',
            fontSize: '14px',
            fontWeight: 600,
            backgroundColor: '#E8DFFB',
            padding: '8px 16px',
            borderRadius: '30px',
            textTransform: 'capitalize'
          }}
        >
          Popular
        </div>
      )}

      {/* Table Head */}
      <div>
        {/* Title */}
        <h3
          style={{
            fontSize: '20px',
            fontWeight: 600,
            marginBottom: '8px',
            color: '#7E57FF',
            display: 'inline-block',
            borderRadius: '30px'
          }}
        >
          {title}
        </h3>

        {/* Subtitle */}
        {subtitle && (
          <p
            style={{
              marginBottom: '30px',
              marginTop: 0,
              color: '#727272',
              fontSize: '14px'
            }}
          >
            {subtitle}
          </p>
        )}

        {/* Price */}
        <div style={{ marginTop: '20px', marginBottom: '30px' }}>
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <span
              style={{
                fontWeight: 500,
                color: '#4f4f4f',
                fontSize: '17px',
                position: 'absolute',
                left: 0,
                top: '3px'
              }}
            >
              {currency}
            </span>
            <span
              style={{
                fontSize: '45px',
                fontWeight: 700,
                display: 'inline-block',
                paddingLeft: '16px'
              }}
            >
              {price}
            </span>
            <span
              style={{
                display: 'inline-block',
                fontSize: '14px',
                color: '#4f4f4f',
                fontWeight: 500,
                marginLeft: '3px'
              }}
            >
              {duration}
            </span>
          </div>
        </div>
      </div>

      {/* Features List */}
      {features.length > 0 && (
        <ul
          style={{
            marginTop: '40px',
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}
        >
          {features.map((feature, index) => (
            <li
              key={index}
              style={{
                fontSize: '15px',
                marginBottom: '16px',
                paddingLeft: '25px',
                fontWeight: 400,
                color: feature.enabled ? '#081828' : '#727272',
                position: 'relative',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}
            >
              {feature.enabled ? (
                <Check size={16} color="#68D585" style={{ marginLeft: '-25px' }} />
              ) : (
                <X size={16} color="#727272" style={{ marginLeft: '-25px' }} />
              )}
              {feature.text}
            </li>
          ))}
        </ul>
      )}

      {/* Button */}
      {buttonText && (
        <button
          onClick={onButtonClick}
          style={{
            marginTop: '50px',
            display: 'inline-block',
            textTransform: 'capitalize',
            fontSize: '15px',
            fontWeight: 500,
            padding: '14px 30px',
            backgroundColor: '#7E57FF',
            color: '#ffffff',
            border: 'none',
            transition: 'all 0.4s ease',
            borderRadius: '30px',
            position: 'relative',
            zIndex: 1,
            overflow: 'hidden',
            cursor: 'pointer',
            width: '100%',
            textAlign: 'center'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#081828';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#7E57FF';
          }}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
}