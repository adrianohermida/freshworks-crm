import React, { useState } from 'react';
import HeaderNavLink from '@/components/header/HeaderNavLink';
export { navigationItems } from './navigationData';

export default function HeaderNav({ 
  navItems = [], 
  activeItem = null,
  isSticky = false,
  onNavClick
}) {
  return (
    <nav style={{
      padding: 0,
      position: 'relative',
      transition: 'all 0.3s ease-out',
      marginLeft: 'auto',
      marginRight: 'auto'
    }}>
      <ul style={{
        margin: 0,
        padding: 0,
        listStyle: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: 0
      }}>
        {navItems.map((item, idx) => (
          <HeaderNavLink
            key={idx}
            label={item.label}
            url={item.url}
            active={activeItem === item.label}
            hasSubmenu={item.submenu && item.submenu.length > 0}
            submenuItems={item.submenu || []}
            onClick={() => onNavClick && onNavClick(item.label)}
            isSticky={isSticky}
          />
        ))}
      </ul>
    </nav>
  );
}