import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollTopButton({ className = '' }) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible(window.pageYOffset > 300);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <button
      onClick={scrollToTop}
      style={{
        width: '45px',
        height: '45px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-white)',
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        zIndex: 999,
        cursor: 'pointer',
        transition: 'all var(--transition-base)',
        borderRadius: 'var(--border-radius-sm)',
        border: 'none',
        boxShadow: '0 1rem 3rem rgba(35, 38, 45, 0.15)',
      }}
      className={className}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = '0 1rem 3rem rgba(35, 38, 45, 0.25)';
        e.currentTarget.style.transform = 'translate3d(0, -5px, 0)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = '0 1rem 3rem rgba(35, 38, 45, 0.15)';
        e.currentTarget.style.transform = 'translate3d(0, 0, 0)';
      }}
      aria-label="Voltar ao topo"
    >
      <ArrowUp size={20} />
    </button>
  );
}