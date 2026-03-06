import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import HeaderLogo from './HeaderLogo';
import HeaderNav from './HeaderNav';
import HeaderButtons from './HeaderButtons';
import HeaderMobileMenu from './HeaderMobileMenu';
import MobileMenuToggle from './MobileMenuToggle';

export default function PublicHeader({ 
  logo,
  companyName = 'LegalChain',
  navItems = [],
  onSignIn,
  onSignUp 
}) {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const defaultNavItems = [
    { label: 'Início', url: '#home' },
    { label: 'Funcionalidades', url: '#features' },
    { label: 'Preços', url: '#pricing' },
    { label: 'Sobre', url: '#about' },
    { 
      label: 'Recursos', 
      submenu: [
        { label: 'Documentação', url: '#docs' },
        { label: 'Blog', url: '#blog' },
        { label: 'Suporte', url: '#support' }
      ]
    }
  ];

  return (
    <>
      <header 
        className={`w-full transition-all duration-300 ${
          isSticky
            ? `fixed top-0 z-50 border-b ${isDark ? 'bg-[#081828] border-gray-700' : 'bg-white border-gray-200'}`
            : `absolute top-0 left-0 right-0 ${isDark ? 'bg-transparent' : 'bg-transparent'}`
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <HeaderLogo 
            logo={logo}
            companyName={companyName}
            isDark={isDark}
          />

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 flex-1 ml-12">
            <HeaderNav 
              navItems={navItems.length > 0 ? navItems : defaultNavItems}
              isDark={isDark}
            />
          </div>

          {/* Desktop Buttons */}
          <div className="hidden lg:block">
            <HeaderButtons 
              isDark={isDark}
              onSignIn={onSignIn}
              onSignUp={onSignUp}
            />
          </div>

          {/* Mobile Menu Toggle */}
          <MobileMenuToggle 
            isOpen={mobileMenuOpen}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            isDark={isDark}
          />
        </div>
      </header>

      {/* Mobile Menu */}
      <HeaderMobileMenu 
        isOpen={mobileMenuOpen}
        navItems={navItems.length > 0 ? navItems : defaultNavItems}
        isDark={isDark}
      />

      {/* Spacer para sticky header */}
      {isSticky && <div className="h-20" />}
    </>
  );
}