import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function MobileMenu({ 
  items = [],
  isOpen,
  onClose,
  onItemClick
}) {
  const [expandedItems, setExpandedItems] = useState({});

  const toggleSubmenu = (itemId) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  return (
    <nav 
      className={`fixed top-16 left-0 w-full bg-white z-40 shadow-lg rounded-b-lg border-t border-gray-200 max-h-96 overflow-y-auto transition-all duration-300 ${
        isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
      }`}
    >
      <div className="py-3 px-5">
        {items.map((item) => (
          <div key={item.id || item.label}>
            {/* Main Item */}
            <button
              onClick={() => {
                if (item.submenu?.length) {
                  toggleSubmenu(item.id || item.label);
                } else {
                  onItemClick?.(item);
                  onClose?.();
                }
              }}
              className={`w-full flex items-center justify-between px-4 py-3 text-left font-medium text-sm rounded-lg transition-colors ${
                item.active
                  ? 'text-[#7e57ff] bg-gray-50'
                  : 'text-gray-800 hover:text-[#7e57ff] hover:bg-gray-50'
              }`}
            >
              <span>{item.label}</span>
              {item.submenu?.length > 0 && (
                <ChevronDown 
                  className={`w-4 h-4 transition-transform ${
                    expandedItems[item.id || item.label] ? 'rotate-180' : ''
                  }`}
                />
              )}
            </button>

            {/* Submenu */}
            {item.submenu?.length > 0 && expandedItems[item.id || item.label] && (
              <div className="ml-4 mt-2 space-y-2 border-l-2 border-gray-200 pl-4">
                {item.submenu.map((subitem) => (
                  <button
                    key={subitem.label}
                    onClick={() => {
                      onItemClick?.(subitem);
                      onClose?.();
                    }}
                    className={`block w-full text-left px-3 py-2 text-sm rounded font-medium transition-colors ${
                      subitem.active
                        ? 'text-[#7e57ff] bg-gray-50'
                        : 'text-gray-600 hover:text-[#7e57ff] hover:bg-gray-50'
                    }`}
                  >
                    {subitem.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}