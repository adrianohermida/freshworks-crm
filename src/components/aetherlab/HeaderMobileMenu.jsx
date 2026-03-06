import React from 'react';
import { Link } from 'react-router-dom';

export default function HeaderMobileMenu({ 
  isOpen = false,
  navItems = [],
  isDark = false 
}) {
  if (!isOpen) return null;

  return (
    <div className={`lg:hidden absolute top-full left-0 right-0 border-b ${
      isDark
        ? 'bg-[#0f1f2e] border-gray-700'
        : 'bg-white border-gray-200'
    }`}>
      <nav className="flex flex-col p-4">
        {navItems.map((item, idx) => (
          <div key={idx}>
            <Link
              to={item.url || '#'}
              className={`block px-4 py-3 text-sm font-medium rounded transition-colors ${
                isDark
                  ? 'text-gray-300 hover:text-[#7e57ff] hover:bg-[#081828]'
                  : 'text-gray-700 hover:text-[#7e57ff] hover:bg-gray-50'
              }`}
            >
              {item.label}
            </Link>

            {item.submenu && item.submenu.length > 0 && (
              <div className="ml-4 space-y-2 mt-2">
                {item.submenu.map((sub, subIdx) => (
                  <Link
                    key={subIdx}
                    to={sub.url}
                    className={`block px-4 py-2 text-xs font-medium rounded transition-colors ${
                      isDark
                        ? 'text-gray-400 hover:text-[#7e57ff] hover:bg-[#081828]'
                        : 'text-gray-600 hover:text-[#7e57ff] hover:bg-gray-50'
                    }`}
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}