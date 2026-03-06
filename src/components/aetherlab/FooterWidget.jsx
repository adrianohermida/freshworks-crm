import React from 'react';

export default function FooterWidget({ 
  type = 'links',
  title,
  logo,
  description,
  socialLinks = [],
  links = [],
  copyrightText,
  onNewsletterSubmit
}) {
  if (type === 'about') {
    return (
      <div style={{ paddingRight: '30px' }}>
        {logo && (
          <div style={{ marginBottom: '20px' }}>
            <img src={logo} alt="Logo" style={{ width: '130px' }} />
          </div>
        )}

        {description && (
          <p style={{
            color: '#ffffff',
            marginTop: '20px',
            fontSize: '15px',
            marginBottom: '25px',
            lineHeight: 1.6
          }}>
            {description}
          </p>
        )}

        {socialLinks.length > 0 && (
          <div>
            <span style={{
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              display: 'block',
              marginBottom: '20px'
            }}>
              Siga-nos
            </span>
            <ul style={{
              listStyle: 'none',
              padding: 0,
              margin: 0,
              display: 'flex',
              gap: '15px'
            }}>
              {socialLinks.map((social, idx) => (
                <li key={idx}>
                  <a 
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#ffffff',
                      textDecoration: 'none',
                      transition: 'color 0.3s ease',
                      fontSize: '18px'
                    }}
                    onMouseEnter={(e) => e.target.style.color = '#7E57FF'}
                    onMouseLeave={(e) => e.target.style.color = '#ffffff'}
                  >
                    {social.icon}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {copyrightText && (
          <div style={{
            color: '#ffffff',
            fontSize: '15px',
            marginTop: '40px',
            lineHeight: 1.6
          }}>
            {typeof copyrightText === 'string' ? (
              <p style={{ margin: 0 }}>{copyrightText}</p>
            ) : (
              copyrightText
            )}
          </div>
        )}
      </div>
    );
  }

  if (type === 'links') {
    return (
      <div style={{ marginTop: '40px' }}>
        {title && (
          <h3 style={{
            fontSize: '17px',
            fontWeight: 600,
            marginBottom: '35px',
            color: '#ffffff',
            margin: 0,
            marginBottom: '35px'
          }}>
            {title}
          </h3>
        )}

        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: 0
        }}>
          {links.map((link, idx) => (
            <li key={idx} style={{ marginBottom: '15px' }}>
              <a
                href={link.url || '#'}
                style={{
                  fontSize: '15px',
                  fontWeight: 400,
                  color: '#ffffff',
                  textDecoration: 'none',
                  transition: 'color 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.color = '#7E57FF'}
                onMouseLeave={(e) => e.target.style.color = '#ffffff'}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (type === 'newsletter') {
    return (
      <div style={{ paddingLeft: '80px', marginTop: '40px' }}>
        {title && (
          <h3 style={{
            fontSize: '17px',
            fontWeight: 600,
            marginBottom: '35px',
            color: '#ffffff',
            margin: 0,
            marginBottom: '35px'
          }}>
            {title}
          </h3>
        )}

        {description && (
          <p style={{
            color: '#ffffff',
            fontSize: '15px',
            marginBottom: '20px',
            lineHeight: 1.6
          }}>
            {description}
          </p>
        )}

        <form 
          onSubmit={(e) => {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;
            if (onNewsletterSubmit) onNewsletterSubmit(email);
          }}
          style={{
            marginTop: '30px',
            position: 'relative'
          }}
        >
          <input
            type="email"
            placeholder="seu@email.com"
            required
            style={{
              height: '52px',
              width: '100%',
              borderRadius: '8px',
              border: 'none',
              paddingLeft: '18px',
              paddingRight: '70px',
              transition: 'all 0.4s ease',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              color: '#ffffff',
              fontSize: '15px'
            }}
            onFocus={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'}
            onBlur={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.12)'}
          />

          <button
            type="submit"
            style={{
              position: 'absolute',
              right: '0px',
              top: '0',
              height: '52px',
              width: '52px',
              borderRadius: '0 8px 8px 0',
              backgroundColor: 'rgba(255, 255, 255, 0.16)',
              color: '#ffffff',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              transition: 'all 0.4s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#7E57FF';
              e.target.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.16)';
              e.target.style.color = '#ffffff';
            }}
          >
            →
          </button>
        </form>
      </div>
    );
  }

  return null;
}