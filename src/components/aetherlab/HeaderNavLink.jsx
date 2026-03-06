import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeaderNavLink({ 
  label, 
  url,
  submenu = [],
  isDark = false,
  isActive = false 
}) {
  const [isOpen, setIsOpen] = useState(false);

  const linkClass = `flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors duration-300 ${
    isActive
      ? isDark ? 'text-[#7e57ff]' : 'text-[#7e57ff]'
      : isDark 
        ? 'text-gray-300 hover:text-[#7e57ff]'
        : 'text-gray-700 hover:text-[#7e57ff]'
  }`;

  return (
    <div className="relative group">
      {url ? (
        <Link to={url} className={linkClass}>
          {label}
          {submenu.length > 0 && (
            <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
          )}
        </Link>
      ) : (
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={linkClass}
        >
          {label}
          {submenu.length > 0 && (
            <ChevronDown className="w-4 h-4 transition-transform" style={{ 
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' 
            }} />
          )}
        </button>
      )}

      {/* Submenu */}
      {submenu.length > 0 && (
        <div className={`absolute left-0 mt-0 w-48 rounded-lg shadow-lg border transition-all duration-300 ${
          isDark
            ? 'bg-[#0f1f2e] border-gray-700 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0'
            : 'bg-white border-gray-200 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0'
        } opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0`}>
          <ul className="py-2">
            {submenu.map((item, idx) => (
              <li key={idx}>
                <Link
                  to={item.url}
                  className={`block px-4 py-2 text-sm transition-colors ${
                    isDark
                      ? 'text-gray-300 hover:text-[#7e57ff] hover:bg-[#081828]'
                      : 'text-gray-700 hover:text-[#7e57ff] hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}