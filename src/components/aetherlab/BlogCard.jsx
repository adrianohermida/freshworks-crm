import React, { useState } from 'react';
import { Calendar, User } from 'lucide-react';

export default function BlogCard({
  image,
  title,
  excerpt,
  author,
  date,
  category,
  link = '#',
  onReadMore
}) {
  const [isImageHovered, setIsImageHovered] = useState(false);

  const handleReadMore = () => {
    if (onReadMore) {
      onReadMore();
    }
  };

  return (
    <div
      style={{
        marginTop: '30px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.089)',
        overflow: 'hidden',
        transition: 'all 0.3s ease'
      }}
    >
      {/* Blog Image */}
      {image && (
        <div
          style={{
            overflow: 'hidden',
            height: '250px',
            backgroundColor: '#f0f0f0'
          }}
          onMouseEnter={() => setIsImageHovered(true)}
          onMouseLeave={() => setIsImageHovered(false)}
        >
          <a href={link}>
            <img
              src={image}
              alt={title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'all 0.3s ease',
                transform: isImageHovered ? 'scale(1.1)' : 'scale(1)'
              }}
            />
          </a>
        </div>
      )}

      {/* Blog Content */}
      <div style={{ padding: '35px' }}>
        {/* Meta Info */}
        {(author || date || category) && (
          <div style={{ marginBottom: '20px', display: 'flex', gap: '22px', flexWrap: 'wrap' }}>
            {author && (
              <a
                href="#"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '14px',
                  color: '#727272',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#7E57FF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#727272')}
              >
                <User size={16} color="#7E57FF" />
                {author}
              </a>
            )}
            {date && (
              <a
                href="#"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  fontSize: '14px',
                  color: '#727272',
                  fontWeight: 500,
                  textDecoration: 'none',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#7E57FF')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#727272')}
              >
                <Calendar size={16} color="#7E57FF" />
                {date}
              </a>
            )}
            {category && (
              <span
                style={{
                  fontSize: '14px',
                  color: '#7E57FF',
                  fontWeight: 500
                }}
              >
                {category}
              </span>
            )}
          </div>
        )}

        {/* Title */}
        <h4 style={{ display: 'block', lineHeight: '28px', margin: 0, marginBottom: '15px' }}>
          <a
            href={link}
            style={{
              fontSize: '17px',
              color: '#081828',
              fontWeight: 700,
              display: 'inline-block',
              textDecoration: 'none',
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#7E57FF')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#081828')}
          >
            {title}
          </a>
        </h4>

        {/* Excerpt */}
        {excerpt && (
          <p style={{ display: 'block', marginTop: '20px', color: '#727272', lineHeight: '26px' }}>
            {excerpt}
          </p>
        )}

        {/* Read More Button */}
        <div style={{ marginTop: '20px' }}>
          <button
            onClick={handleReadMore}
            style={{
              padding: 0,
              backgroundColor: 'transparent',
              color: '#081828',
              textDecoration: 'underline',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 500,
              transition: 'color 0.3s ease'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#7E57FF')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#081828')}
          >
            Read More →
          </button>
        </div>
      </div>
    </div>
  );
}