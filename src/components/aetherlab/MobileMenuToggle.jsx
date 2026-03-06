import React from 'react';
import { Menu, X } from 'lucide-react';

export default function MobileMenuToggle({ 
  isOpen = false,
  onClick,
  isDark = false 
}) {
  return (
    <button
      onClick={onClick}
      className={`lg:hidden p-2 transition-colors ${
        isDark ? 'text-white hover:text-[#7e57ff]' : 'text-gray-900 hover:text-[#7e57ff]'
      }`}
    >
      {isOpen ? (
        <X className="w-6 h-6" />
      ) : (
        <Menu className="w-6 h-6" />
      )}
    </button>
  );
}