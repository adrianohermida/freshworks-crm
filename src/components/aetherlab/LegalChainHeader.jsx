import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MobileMenu from './MobileMenu';
import Logo from './Logo';

export default function LegalChainHeader({
  logo,
  logoWidth = 130,
  navItems = [],
  buttons = [],
  sticky = true,
  onNavClick,
  className = ''
}) {
  const [isSticky, setIsSticky] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!sticky) return;

    const handleScroll = () => {
      setIsSticky(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sticky]);

  return (
    <>
      {/* Header - Inspirado em Aetherlab */}
      <header className={`w-full z-50 transition-all duration-300 ${
        isSticky
          ? 'fixed top-0 bg-white shadow-md border-b border-gray-100'
          : 'relative bg-white border-b border-gray-100'
      } ${className}`} style={{ fontFamily: 'Arial, sans-serif' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          
          {/* Logo + Brand */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {logo ? (
              <img
                src={logo}
                alt="Logo"
                style={{ width: `${logoWidth}px` }}
                className="h-auto"
              />
            ) : (
              <Logo size="md" variant="primary" />
            )}
          </div>

          {/* Desktop Navigation - Centralizada */}
          <nav className="hidden md:flex flex-1 items-center justify-center">
            <div className="flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.id || item.label}
                  onClick={() => onNavClick?.(item)}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    item.active
                      ? 'text-[#7e57ff]'
                      : 'text-gray-700 hover:text-[#7e57ff]'
                  }`}
                  style={{ fontFamily: 'Arial, sans-serif' }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </nav>

          {/* Desktop Buttons - À Direita */}
          <div className="hidden md:flex items-center gap-3 flex-shrink-0">
            {buttons.map((btn, idx) => (
              <Button
                key={idx}
                onClick={btn.onClick}
                className={`font-semibold px-6 py-2 rounded-full transition-all duration-300 ${
                  btn.variant === 'secondary'
                    ? 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                    : 'bg-[#7e57ff] text-white hover:bg-[#6b4cc9]'
                }`}
              >
                {btn.label}
              </Button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex items-center justify-center"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-900" />
            ) : (
              <Menu className="w-6 h-6 text-gray-900" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <MobileMenu
        items={navItems}
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onItemClick={onNavClick}
      />

      {/* Spacer for sticky header */}
      {isSticky && <div className="h-16"></div>}
    </>
  );
}