import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header({ logo, navItems = [], onNavClick, buttonText = 'Começar' }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const headerStyle = {
    width: '100%',
    backgroundColor: isSticky ? '#fff' : 'transparent',
    position: isSticky ? 'fixed' : 'absolute',
    top: 0,
    left: 0,
    zIndex: isSticky ? 99 : 1,
    boxShadow: isSticky ? '0px 20px 50px rgba(0, 0, 0, 0.05)' : 'none',
    transition: 'all 0.3s ease-out'
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '80px'
  };

  const logoStyle = {
    display: 'flex',
    alignItems: 'center'
  };

  const logoImgStyle = {
    width: '130px',
    height: 'auto'
  };

  const navbarStyle = {
    display: 'flex',
    listStyle: 'none',
    margin: 0,
    padding: 0,
    gap: '40px',
    marginLeft: 'auto'
  };

  const navItemStyle = {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  };

  const navLinkStyle = {
    fontSize: '15px',
    color: isSticky ? '#081828' : '#fff',
    textDecoration: 'none',
    fontWeight: 500,
    transition: 'all 0.3s ease-out',
    textTransform: 'capitalize',
    cursor: 'pointer'
  };

  const navLinkHoverStyle = {
    color: '#7E57FF'
  };

  const buttonContainerStyle = {
    display: isSticky ? 'inline-block' : 'none',
    marginLeft: '20px'
  };

  const buttonStyle = {
    padding: '12px 30px',
    backgroundColor: isSticky ? '#7E57FF' : '#fff',
    color: isSticky ? '#fff' : '#081828',
    border: 'none',
    borderRadius: '30px',
    fontSize: '15px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.3s ease-out',
    textDecoration: 'none',
    textTransform: 'capitalize'
  };

  const mobileMenuBtnStyle = {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 0,
    display: 'none',
    marginLeft: 'auto'
  };

  const mobileMenuStyle = {
    position: 'absolute',
    top: '80px',
    left: 0,
    width: '100%',
    backgroundColor: '#fff',
    zIndex: 9,
    boxShadow: '0px 15px 20px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    maxHeight: '350px',
    overflowY: 'auto',
    borderTop: '1px solid #eee',
    borderRadius: '8px'
  };

  const mobileNavItemStyle = {
    padding: '12px 16px',
    borderBottom: '1px solid #eee',
    color: '#081828',
    textDecoration: 'none',
    display: 'block',
    transition: 'all 0.3s ease-out'
  };

  return (
    <header style={headerStyle}>
      <div style={containerStyle}>
        {/* Logo */}
        <div style={logoStyle}>
          <a href="/" style={{ display: 'flex', alignItems: 'center' }}>
            <img src={logo} alt="Logo" style={logoImgStyle} />
          </a>
        </div>

        {/* Desktop Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', marginLeft: 'auto', gap: '40px' }}>
          <ul style={navbarStyle}>
            {navItems.map((item, idx) => (
              <li key={idx} style={navItemStyle}>
                <a
                  href={item.url}
                  style={navLinkStyle}
                  onMouseEnter={(e) => Object.assign(e.target.style, navLinkHoverStyle)}
                  onMouseLeave={(e) => Object.assign(e.target.style, { color: isSticky ? '#081828' : '#fff' })}
                  onClick={() => onNavClick?.(item.id)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Button */}
          <button
            style={{
              ...buttonStyle,
              display: isSticky ? 'inline-block' : 'none'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = isSticky ? '#6b46c1' : '#7E57FF'}
            onMouseLeave={(e) => e.target.style.backgroundColor = isSticky ? '#7E57FF' : '#fff'}
          >
            {buttonText}
          </button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          style={{
            ...mobileMenuBtnStyle,
            display: window.innerWidth < 992 ? 'block' : 'none'
          }}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} color="#081828" /> : <Menu size={24} color={isSticky ? '#081828' : '#fff'} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav style={mobileMenuStyle}>
          {navItems.map((item, idx) => (
            <a
              key={idx}
              href={item.url}
              style={mobileNavItemStyle}
              onMouseEnter={(e) => e.target.style.color = '#7E57FF'}
              onMouseLeave={(e) => e.target.style.color = '#081828'}
              onClick={() => {
                onNavClick?.(item.id);
                setMobileMenuOpen(false);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}