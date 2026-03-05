import React from 'react';

export default function TestimonialCard({
  content,
  authorName,
  authorRole,
  authorImage,
  quoteIcon = '"'
}) {
  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        padding: '50px 40px',
        transition: 'all 0.4s ease',
        borderRadius: '6px',
        overflow: 'hidden',
        position: 'relative',
        margin: '15px 0',
        minHeight: '250px'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.103)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      {/* Decorative Circle */}
      <div
        style={{
          position: 'absolute',
          right: '-30px',
          top: '-30px',
          height: '60px',
          width: '60px',
          backgroundColor: '#7E57FF',
          borderRadius: '50%'
        }}
      />

      {/* Quote Icon */}
      <div
        style={{
          position: 'absolute',
          right: '40px',
          bottom: '50px',
          fontSize: '45px',
          color: '#7E57FF',
          opacity: 0.1
        }}
      >
        {quoteIcon}
      </div>

      {/* Testimonial Text */}
      {content && (
        <div className="text">
          <h4
            style={{
              fontSize: '16px',
              fontWeight: 600,
              lineHeight: '28px',
              margin: 0,
              color: '#081828'
            }}
          >
            {content}
          </h4>
        </div>
      )}

      {/* Author Info */}
      <div
        style={{
          position: 'relative',
          paddingLeft: '70px',
          marginTop: '40px'
        }}
      >
        {/* Author Image */}
        {authorImage && (
          <img
            src={authorImage}
            alt={authorName}
            style={{
              height: '50px',
              width: '50px',
              borderRadius: '50%',
              position: 'absolute',
              left: 0,
              top: '50%',
              transform: 'translateY(-50%)',
              objectFit: 'cover'
            }}
          />
        )}

        {/* Author Name and Role */}
        {authorName && (
          <h4
            style={{
              fontSize: '15px',
              fontWeight: 600,
              margin: 0,
              color: '#081828'
            }}
          >
            {authorName}
            {authorRole && (
              <span
                style={{
                  color: '#727272',
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 500,
                  marginTop: '6px'
                }}
              >
                {authorRole}
              </span>
            )}
          </h4>
        )}
      </div>
    </div>
  );
}