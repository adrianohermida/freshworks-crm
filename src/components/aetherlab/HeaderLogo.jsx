import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function HeaderLogo({ 
  logo,
  companyName = 'LegalChain',
  isDark = false 
}) {
  return (
    <Link to={createPageUrl('Home')} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
      {logo ? (
        <img src={logo} alt={companyName} className="h-10 object-contain" />
      ) : (
        <div className="relative w-10 h-10">
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#7e57ff]" />
            <text x="20" y="26" textAnchor="middle" fontSize="18" fontWeight="bold" className="text-[#7e57ff]">L</text>
          </svg>
        </div>
      )}
      <span className={`font-bold text-lg ${isDark ? 'text-white' : 'text-[#7e57ff]'}`} style={{ fontFamily: 'Arial, sans-serif' }}>
        {companyName}
      </span>
    </Link>
  );
}