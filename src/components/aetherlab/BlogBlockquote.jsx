import React from 'react';
import { COLORS, TYPOGRAPHY } from './theme/ThemeConfig';

export default function BlogBlockquote({ 
  quote,
  author,
  icon = '❝'
}) {
  return (
    <blockquote
      style={{
        position: 'relative',
        color: COLORS.white,
        fontWeight: TYPOGRAPHY.weights.normal,
        clear: 'both',
        zIndex: 1,
        margin: '40px 0',
        textAlign: 'center',
        padding: '40px',
        backgroundColor: COLORS.black,
        borderRadius: '8px',
        overflow: 'hidden',
        fontFamily: TYPOGRAPHY.fontFamily
      }}
      className="xs:p-[20px]"
    >
      {/* Decorative circles */}
      <div
        style={{
          position: 'absolute',
          content: '""',
          right: '-30px',
          top: '-30px',
          height: '80px',
          width: '80px',
          borderRadius: '50%',
          border: `4px solid ${COLORS.primary}`,
          pointerEvents: 'none'
        }}
      />
      <div
        style={{
          position: 'absolute',
          content: '""',
          left: '-30px',
          bottom: '-30px',
          height: '80px',
          width: '80px',
          borderRadius: '50%',
          border: `4px solid ${COLORS.primary}`,
          pointerEvents: 'none'
        }}
      />

      {/* Icon */}
      {icon && (
        <div
          style={{
            fontSize: '32px',
            color: COLORS.white,
            display: 'block',
            marginBottom: '20px',
            position: 'relative',
            zIndex: 2
          }}
          className="xs:mb-[15px]"
        >
          {icon}
        </div>
      )}

      {/* Quote Text */}
      <h4
        style={{
          fontWeight: TYPOGRAPHY.weights.medium,
          fontSize: '14px',
          lineHeight: '24px',
          color: COLORS.white,
          position: 'relative',
          zIndex: 2,
          margin: '0 0 20px 0'
        }}
        className="xs:text-[14px]"
      >
        {quote}
      </h4>

      {/* Author */}
      {author && (
        <span
          style={{
            fontSize: '13px',
            display: 'block',
            marginTop: '20px',
            color: COLORS.white,
            position: 'relative',
            zIndex: 2
          }}
        >
          — {author}
        </span>
      )}
    </blockquote>
  );
}