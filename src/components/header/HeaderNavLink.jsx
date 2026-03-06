import React, { useState } from 'react';

export default function HeaderNavLink({ 
  label, 
  url = '#', 
  active = false,
  hasSubmenu = false,
  submenuItems = [],
  onClick,
  isSticky = false
}) {
  const [showSubmenu, setShowSubmenu] = useState(false);

  return (
    <li style={{
      zIndex: 1,
      position: 'relative',
      marginRight: '40px',
      listStyle: 'none'
    }}
    onMouseEnter={() => setShowSubmenu(true)}
    onMouseLeave={() => setShowSubmenu(false)}
    >
      <a
        href={url}
        onClick={(e) => {
          if (onClick) {
            e.preventDefault();
            onClick();
          }
        }}
        style={{
          fontSize: '15px',
          color: isSticky ? '#081828' : '#ffffff',
          transition: 'all 0.3s ease-out',
          position: 'relative',
          padding: '35px 0',
          display: 'inline-flex',
          alignItems: 'center',
          fontWeight: 500,
          textTransform: 'capitalize',
          textDecoration: 'none',
          color: active ? '#7E57FF' : (isSticky ? '#081828' : '#ffffff')
        }}
        onMouseEnter={(e) => e.target.style.color = '#7E57FF'}
        onMouseLeave={(e) => e.target.style.color = active ? '#7E57FF' : (isSticky ? '#081828' : '#ffffff')}
        className={hasSubmenu ? 'dd-menu' : ''}
      >
        {label}
        {hasSubmenu && (
          <span style={{
            fontFamily: 'LineIcons',
            marginLeft: '5px',
            fontSize: '10px'
          }}>
            ⌄
          </span>
        )}
      </a>

      {/* Submenu */}
      {hasSubmenu && submenuItems.length > 0 && (
        <ul style={{
          padding: '30px',
          minWidth: '240px',
          backgroundColor: '#ffffff',
          boxShadow: '0px 5px 20px rgba(0, 0, 0, 0.1)',
          position: 'absolute',
          top: showSubmenu ? '100%' : '110%',
          left: 0,
          opacity: showSubmenu ? 1 : 0,
          visibility: showSubmenu ? 'visible' : 'hidden',
          transition: 'all 0.3s ease-out',
          borderRadius: '5px',
          listStyle: 'none',
          margin: 0,
          zIndex: 100
        }}>
          {submenuItems.map((item, idx) => (
            <li key={idx} style={{ 
              width: '100%', 
              marginBottom: idx === submenuItems.length - 1 ? 0 : '15px',
              listStyle: 'none'
            }}>
              <a
                href={item.url || '#'}
                style={{
                  padding: '12px 15px',
                  color: '#888',
                  display: 'block',
                  width: '100%',
                  fontSize: '14px',
                  fontWeight: 500,
                  textTransform: 'capitalize',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  transition: 'all 0.1s ease',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => e.target.style.color = '#7E57FF'}
                onMouseLeave={(e) => e.target.style.color = '#888'}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}