import React from 'react';

/**
 * Ícone de citação customizável
 * Componente utilitário para testimonials e citações
 */
export default function QuoteIcon({ 
  size = 'md',
  opacity = 10,
  position = 'absolute',
  className = ''
}) {
  const sizeMap = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20',
  };

  return (
    <svg 
      className={`text-[#7e57ff] opacity-${opacity} ${sizeMap[size]} ${position} ${className}`}
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-4.716-5-7-5-2 0-5.28 4-5 5-1 0-2 0-2 2s1 4 3 4c1 2-1 4-1 6s.022 10.2 3 10.2h4zm15 0c3 0 7-1 7-8V5c0-1.25-4.716-5-7-5-2 0-5.28 4-5 5-1 0-2 0-2 2s1 4 3 4c1 2-1 4-1 6s.02 10.2 3 10.2h4z" />
    </svg>
  );
}