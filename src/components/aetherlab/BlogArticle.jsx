import React from 'react';
import { COLORS, TYPOGRAPHY } from './theme/ThemeConfig';

export default function BlogArticle({ 
  title,
  image,
  meta = [],
  children
}) {
  return (
    <article style={{ backgroundColor: COLORS.white }}>
      {/* Meta Info */}
      {meta.length > 0 && (
        <ul
          style={{
            margin: '20px 0 30px 0',
            padding: '0',
            listStyle: 'none',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0'
          }}
          className="xs:flex-col"
        >
          {meta.map((item, idx) => (
            <li
              key={idx}
              style={{
                fontSize: '15px',
                display: 'inline-block',
                marginRight: '15px',
                paddingRight: '15px',
                position: 'relative'
              }}
              className="xs:mb-[8px]"
            >
              <a
                href={item.link || '#'}
                style={{
                  color: '#888',
                  fontSize: '15px',
                  fontWeight: '400',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = COLORS.primary}
                onMouseLeave={(e) => e.target.style.color = '#888'}
              >
                {item.icon && <span style={{ marginRight: '2px' }}>{item.icon}</span>}
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      )}

      {/* Thumbnail */}
      {image && (
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '8px',
            marginBottom: '40px'
          }}
          className="md:mb-[40px] xs:mb-[30px]"
        >
          <img
            src={image}
            alt={title}
            style={{ width: '100%', display: 'block' }}
          />
        </div>
      )}

      {/* Title */}
      <h1
        style={{
          lineHeight: '40px',
          fontSize: '26px',
          fontWeight: TYPOGRAPHY.weights.bold,
          display: 'inline-block',
          marginBottom: '30px',
          fontFamily: TYPOGRAPHY.fontFamily,
          color: COLORS.black
        }}
        className="md:text-[22px] md:leading-[40px] xs:text-[20px] xs:leading-[32px]"
      >
        {title}
      </h1>

      {/* Content */}
      <div
        style={{
          fontSize: '15px',
          lineHeight: '26px',
          color: COLORS.text.body,
          fontFamily: TYPOGRAPHY.fontFamily
        }}
      >
        {children}
      </div>
    </article>
  );
}