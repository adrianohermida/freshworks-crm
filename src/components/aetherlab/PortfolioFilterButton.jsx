import React from 'react';

export default function PortfolioFilterButton({ 
  label,
  active = false,
  onClick,
  className = ''
}) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2.5 text-sm font-medium rounded-sm transition-all duration-300 sm:px-5 sm:py-1.5 sm:text-xs ${
        active
          ? 'bg-[#7e57ff] text-white'
          : 'bg-[#eff2f9] text-[#051441] hover:bg-[#7e57ff] hover:text-white'
      } ${className}`}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}