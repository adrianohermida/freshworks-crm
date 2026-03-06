import React from 'react';

export default function Logo({ 
  size = 'md',
  variant = 'default',
  className = ''
}) {
  const sizeMap = {
    sm: { width: 100, fontSize: 16 },
    md: { width: 130, fontSize: 20 },
    lg: { width: 160, fontSize: 24 },
    xl: { width: 200, fontSize: 28 }
  };

  const { width, fontSize } = sizeMap[size] || sizeMap.md;

  const variantStyles = {
    default: 'text-gray-900 dark:text-white',
    white: 'text-white',
    primary: 'text-[#7e57ff]',
    inverted: 'text-white'
  };

  return (
    <div className={`flex items-center gap-2 ${variantStyles[variant]} ${className}`} style={{ fontFamily: 'Arial, sans-serif' }}>
      {/* Logo Mark - Chain Link Icon */}
      <svg
        width={width * 0.35}
        height={width * 0.35}
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Blockchain Links */}
        <circle cx="10" cy="10" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="30" cy="10" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="10" cy="30" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
        <circle cx="30" cy="30" r="5" stroke="currentColor" strokeWidth="2" fill="none" />
        
        {/* Connection Lines */}
        <line x1="15" y1="10" x2="25" y2="10" stroke="currentColor" strokeWidth="1.5" />
        <line x1="10" y1="15" x2="10" y2="25" stroke="currentColor" strokeWidth="1.5" />
        <line x1="30" y1="15" x2="30" y2="25" stroke="currentColor" strokeWidth="1.5" />
        <line x1="15" y1="30" x2="25" y2="30" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      {/* Logo Text */}
      <span 
        className="font-bold tracking-tight"
        style={{ fontSize: `${fontSize}px`, fontFamily: 'Arial, sans-serif' }}
      >
        LegalChain
      </span>
    </div>
  );
}