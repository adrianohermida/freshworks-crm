import React, { useState } from 'react';

export default function MobileMenu({ navItems = [], onNavClick, isSticky = false }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div style={{ display: 'none' }}>
      {/* Mobile menu toggle button */}
      <button
        style={{
          padding: 0,
          border: 'none',
          background: 'transparent',
          cursor: 'pointer',
          zIndex: 100
        }}
        className={`mobile-menu-btn ${mobileMenuOpen ? 'active' : ''}`}
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <span style={{
          width: '30px',
          height: '2px',
          backgroundColor: isSticky ? '#333' : '#ffffff',
          display: 'block',
          margin: '5px 0',
          position: 'relative',
          transition: 'all 0.3s ease-out',
          transform: mobileMenuOpen ? 'rotate(45deg) translateY(7px)' : 'rotate(0)'
        }} />
        <span style={{
          width: '30px',
          height: '2px',
          backgroundColor: isSticky ? '#333' : '#ffffff',
          display: 'block',
          margin: '5px 0',
          position: 'relative',
          transition: 'all 0.3s ease-out',
          opacity: mobileMenuOpen ? 0 : 1
        }} />
        <span style={{
          width: '30px',
          height: '2px',
          backgroundColor: isSticky ? '#333' : '#ffffff',
          display: 'block',
          margin: '5px 0',
          position: 'relative',
          transition: 'all 0.3s ease-out',
          transform: mobileMenuOpen ? 'rotate(135deg) translateY(-7px)' : 'rotate(0)'
        }} />
      </button>

      {/* Mobile menu content */}
      {mobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '67px',
          left: 0,
          width: '100%',
          backgroundColor: '#fff',
          zIndex: 9,
          boxShadow: '0px 15px 20px 0px rgba(0, 0, 0, 0.1)',
          padding: '10px 20px',
          maxHeight: '350px',
          overflowY: 'auto',
          borderTop: '1px solid #eee',
          borderRadius: '8px'
        }}>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0
          }}>
            {navItems.map((item, idx) => (
              <li key={idx} style={{ 
                margin: 0,
                borderBottom: idx !== navItems.length - 1 ? '1px solid #eee' : 'none'
              }}>
                <a
                  href={item.url || '#'}
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileMenuOpen(false);
                    onNavClick && onNavClick(item.label);
                  }}
                  style={{
                    display: 'block',
                    padding: '12px 16px',
                    color: '#051441',
                    textDecoration: 'none',
                    fontWeight: 500,
                    fontSize: '14px',
                    transition: 'color 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.color = '#7E57FF'}
                  onMouseLeave={(e) => e.target.style.color = '#051441'}
                >
                  {item.label}
                </a>

                {/* Mobile submenu */}
                {item.submenu && item.submenu.length > 0 && (
                  <ul style={{
                    listStyle: 'none',
                    padding: 0,
                    margin: 0,
                    marginLeft: '15px',
                    backgroundColor: '#f9f9f9'
                  }}>
                    {item.submenu.map((subitem, subidx) => (
                      <li key={subidx}>
                        <a
                          href={subitem.url || '#'}
                          onClick={(e) => {
                            e.preventDefault();
                            setMobileMenuOpen(false);
                          }}
                          style={{
                            display: 'block',
                            padding: '10px 12px',
                            color: '#888',
                            textDecoration: 'none',
                            fontSize: '14px',
                            transition: 'color 0.3s ease'
                          }}
                          onMouseEnter={(e) => e.target.style.color = '#7E57FF'}
                          onMouseLeave={(e) => e.target.style.color = '#888'}
                        >
                          {subitem.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}