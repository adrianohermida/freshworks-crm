import React, { useState } from 'react';

export default function TeamMember({
  image,
  name,
  role,
  socialLinks = []
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        marginTop: '30px',
        borderRadius: '8px',
        overflow: 'hidden',
        transition: 'all 0.4s ease',
        textAlign: 'center'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Profile Image */}
      {image && (
        <img
          src={image}
          alt={name}
          style={{
            height: '200px',
            width: '200px',
            borderRadius: '50%',
            display: 'inline-block',
            backgroundColor: '#ffffff',
            padding: '10px',
            border: '1px solid #eee',
            objectFit: 'cover'
          }}
        />
      )}

      {/* Content */}
      <div
        style={{
          padding: '40px 30px'
        }}
      >
        {/* Name */}
        {name && (
          <h4
            style={{
              fontSize: '16px',
              fontWeight: 600,
              margin: 0,
              color: '#081828'
            }}
          >
            {name}
          </h4>
        )}

        {/* Role */}
        {role && (
          <span
            style={{
              color: '#727272',
              fontSize: '14px',
              display: 'block',
              marginTop: '10px',
              fontWeight: 500,
              fontFamily: "'DM Sans', sans-serif"
            }}
          >
            {role}
          </span>
        )}

        {/* Social Links */}
        {socialLinks.length > 0 && (
          <ul
            style={{
              display: 'block',
              opacity: isHovered ? 1 : 0,
              visibility: isHovered ? 'visible' : 'hidden',
              transition: 'all 0.4s ease',
              transform: isHovered ? 'translateY(20px)' : 'translateY(-10px)',
              listStyle: 'none',
              padding: 0,
              margin: '20px 0 0 0'
            }}
          >
            {socialLinks.map((link, index) => (
              <li
                key={index}
                style={{
                  display: 'inline-block',
                  marginRight: index === socialLinks.length - 1 ? 0 : '20px'
                }}
              >
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '15px',
                    color: '#081828',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#7E57FF';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#081828';
                  }}
                  title={link.label}
                >
                  {link.icon ? (
                    <span>{link.icon}</span>
                  ) : (
                    link.label
                  )}
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}