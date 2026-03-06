import React, { useState, useEffect } from 'react';
import { COLORS, TYPOGRAPHY } from './theme/ThemeConfig';
import { Menu, X } from 'lucide-react';

export default function HeaderPublic({ 
  logoSrc,
  logoLink = "/",
  navItems = [],
  ctaButton = null,
  onMobileMenuToggle = () => {}
}) {
  const [isSticky, setIsSticky] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileOpen(!isMobileOpen);
    onMobileMenuToggle(!isMobileOpen);
  };

  return (
    <>
      <header
        style={{
          width: '100%',
          background: isSticky ? COLORS.white : 'transparent',
          position: isSticky ? 'fixed' : 'absolute',
          top: '0',
          left: '0',
          zIndex: '99',
          transition: 'all 0.3s ease-out',
          boxShadow: isSticky ? '0px 20px 50px 0px rgba(0, 0, 0, 0.05)' : 'none',
          padding: isSticky ? '18px 0' : '0'
        }}
        className="w-full"
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '35px 0'
          }}
          className="max-w-7xl mx-auto px-6 md:px-4 xs:px-4"
        >
          {/* Logo */}
          <a
            href={logoLink}
            style={{
              display: 'inline-block',
              textDecoration: 'none'
            }}
          >
            {logoSrc && (
              <img
                src={logoSrc}
                alt="Logo"
                style={{
                  width: '130px',
                  display: 'block'
                }}
                className="md:w-[125px] xs:w-[120px]"
              />
            )}
          </a>

          {/* Navigation - Desktop */}
          <nav
            style={{
              display: 'flex',
              gap: '40px',
              alignItems: 'center',
              marginLeft: 'auto',
              marginRight: 'auto'
            }}
            className="hidden md:hidden lg:flex"
          >
            {navItems.map((item, idx) => (
              <NavItemPublic
                key={idx}
                item={item}
                isSticky={isSticky}
              />
            ))}
          </nav>

          {/* CTA Button - Desktop */}
          {ctaButton && (
            <div
              style={{
                display: 'inline-block',
                marginLeft: '10px'
              }}
              className="hidden xs:hidden"
            >
              <button
                onClick={ctaButton.onClick}
                style={{
                  backgroundColor: isSticky ? COLORS.primary : COLORS.white,
                  color: isSticky ? COLORS.white : COLORS.black,
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '15px',
                  fontWeight: TYPOGRAPHY.weights.semibold,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: TYPOGRAPHY.fontFamily
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = COLORS.primary;
                  e.target.style.color = COLORS.white;
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = isSticky ? COLORS.primary : COLORS.white;
                  e.target.style.color = isSticky ? COLORS.white : COLORS.black;
                }}
              >
                {ctaButton.label}
              </button>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            style={{
              display: 'none',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px'
            }}
            className="md:flex lg:hidden flex-col gap-1.5"
          >
            {isMobileOpen ? (
              <X
                size={24}
                color={isSticky ? COLORS.black : COLORS.white}
                style={{ transition: 'color 0.3s ease' }}
              />
            ) : (
              <Menu
                size={24}
                color={isSticky ? COLORS.black : COLORS.white}
                style={{ transition: 'color 0.3s ease' }}
              />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div
          style={{
            position: 'fixed',
            top: isSticky ? '67px' : '62px',
            left: '0',
            width: '100%',
            backgroundColor: COLORS.white,
            zIndex: '9',
            boxShadow: '0px 15px 20px 0px rgba(0, 0, 0, 0.1)',
            padding: '10px 20px',
            maxHeight: '350px',
            overflowY: 'auto',
            borderTop: `1px solid #eee`,
            borderRadius: '8px'
          }}
          className="md:block lg:hidden"
        >
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {navItems.map((item, idx) => (
              <MobileNavItemPublic
                key={idx}
                item={item}
                onItemClick={() => setIsMobileOpen(false)}
              />
            ))}
          </nav>
        </div>
      )}
    </>
  );
}

function NavItemPublic({ item, isSticky }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      style={{
        position: 'relative',
        zIndex: '1'
      }}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <a
        href={item.href}
        style={{
          fontSize: '15px',
          color: isSticky ? COLORS.black : COLORS.white,
          textDecoration: 'none',
          transition: 'color 0.3s ease',
          padding: '35px 0',
          display: 'inline-flex',
          alignItems: 'center',
          fontWeight: TYPOGRAPHY.weights.medium,
          textTransform: 'capitalize'
        }}
        onMouseEnter={(e) => e.target.style.color = COLORS.primary}
        onMouseLeave={(e) => e.target.style.color = isSticky ? COLORS.black : COLORS.white}
      >
        {item.label}
      </a>

      {/* Submenu */}
      {item.submenu && isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: '0',
            backgroundColor: COLORS.white,
            boxShadow: '0px 5px 20px rgba(0, 0, 0, 0.1)',
            borderRadius: '5px',
            padding: '30px',
            minWidth: '240px',
            opacity: '1',
            visibility: 'visible',
            transition: 'all 0.3s ease'
          }}
        >
          {item.submenu.map((subitem, idx) => (
            <a
              key={idx}
              href={subitem.href}
              style={{
                display: 'block',
                padding: '12px 15px',
                color: '#888',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: TYPOGRAPHY.weights.medium,
                marginBottom: idx === item.submenu.length - 1 ? '0' : '15px',
                borderRadius: '4px',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = COLORS.primary}
              onMouseLeave={(e) => e.target.style.color = '#888'}
            >
              {subitem.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function MobileNavItemPublic({ item, onItemClick }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ borderBottom: '1px solid #eee' }}>
      <button
        onClick={() => {
          if (item.submenu) {
            setIsOpen(!isOpen);
          } else {
            onItemClick();
          }
        }}
        style={{
          width: '100%',
          textAlign: 'left',
          padding: '12px 16px',
          border: 'none',
          background: 'none',
          color: COLORS.black,
          fontSize: '14px',
          fontWeight: TYPOGRAPHY.weights.medium,
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          textTransform: 'capitalize',
          transition: 'color 0.3s ease'
        }}
        onMouseEnter={(e) => e.target.style.color = COLORS.primary}
        onMouseLeave={(e) => e.target.style.color = COLORS.black}
      >
        <a
          href={item.href}
          onClick={(e) => e.preventDefault()}
          style={{
            textDecoration: 'none',
            color: 'inherit',
            display: 'block',
            flex: '1'
          }}
        >
          {item.label}
        </a>
        {item.submenu && (
          <span style={{ fontSize: '12px' }}>{isOpen ? '▼' : '▶'}</span>
        )}
      </button>

      {/* Mobile Submenu */}
      {item.submenu && isOpen && (
        <div style={{ marginLeft: '15px', marginRight: '15px' }}>
          {item.submenu.map((subitem, idx) => (
            <a
              key={idx}
              href={subitem.href}
              onClick={onItemClick}
              style={{
                display: 'block',
                padding: '10px 12px',
                color: '#888',
                textDecoration: 'none',
                fontSize: '14px',
                borderRadius: '4px',
                transition: 'color 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.color = COLORS.primary}
              onMouseLeave={(e) => e.target.style.color = '#888'}
            >
              {subitem.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}