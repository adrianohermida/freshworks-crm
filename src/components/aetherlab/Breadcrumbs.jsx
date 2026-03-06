import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({
  title,
  items = [],
  backgroundImage = null,
  className = '',
}) {
  return (
    <section
      style={{
        position: 'relative',
        paddingTop: '160px',
        paddingBottom: '120px',
        zIndex: 2,
        textAlign: 'left',
        backgroundColor: 'var(--color-black)',
        backgroundImage: backgroundImage ? `url('${backgroundImage}')` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'right',
        backgroundRepeat: 'no-repeat',
        boxShadow: '0px 7px 30px rgba(0, 0, 0, 0.075)',
      }}
      className={className}
    >
      {/* Overlay */}
      <div
        style={{
          position: 'absolute',
          content: '""',
          left: 0,
          top: 0,
          height: '100%',
          width: '100%',
          backgroundColor: 'var(--color-black)',
          opacity: 0.7,
          zIndex: 1,
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          textAlign: 'center',
          zIndex: 2,
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 var(--spacing-lg)',
        }}
      >
        {/* Page Title */}
        {title && (
          <h1
            style={{
              fontSize: '26px',
              color: 'var(--color-white)',
              fontWeight: 'var(--font-weight-bold)',
              position: 'relative',
              lineHeight: 'var(--line-height-tight)',
              textTransform: 'capitalize',
              margin: '0 0 var(--spacing-md) 0',
            }}
          >
            {title}
          </h1>
        )}

        {/* Breadcrumb Navigation */}
        {items.length > 0 && (
          <nav
            style={{
              backgroundColor: 'transparent',
              borderRadius: 0,
              marginBottom: 0,
              padding: 0,
              display: 'inline-block',
              marginTop: 'var(--spacing-md)',
            }}
          >
            <ol
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 'var(--spacing-md)',
                listStyle: 'none',
                margin: 0,
                padding: 0,
              }}
            >
              {items.map((item, index) => (
                <li
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--spacing-md)',
                    textTransform: 'capitalize',
                    color: 'var(--color-white)',
                  }}
                >
                  {item.href ? (
                    <a
                      href={item.href}
                      style={{
                        color: 'var(--color-white)',
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 'var(--font-weight-semibold)',
                        textDecoration: 'none',
                        transition: 'all var(--transition-base)',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#e4e4e4';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'var(--color-white)';
                      }}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <span
                      style={{
                        color: 'var(--color-white)',
                        fontSize: 'var(--font-size-sm)',
                        fontWeight: 'var(--font-weight-semibold)',
                      }}
                    >
                      {item.label}
                    </span>
                  )}

                  {index < items.length - 1 && (
                    <ChevronRight size={16} color="var(--color-white)" />
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}
      </div>
    </section>
  );
}