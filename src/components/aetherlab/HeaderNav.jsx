import React from 'react';
import HeaderNavLink from './HeaderNavLink';

export default function HeaderNav({ 
  navItems = [],
  isDark = false,
  activeItem = null 
}) {
  const defaultItems = [
    { label: 'Início', url: '#home' },
    { label: 'Funcionalidades', url: '#features' },
    { label: 'Preços', url: '#pricing' },
    { label: 'Sobre', url: '#about' },
    { 
      label: 'Recursos', 
      submenu: [
        { label: 'Documentação', url: '#docs' },
        { label: 'Blog', url: '#blog' },
        { label: 'Suporte', url: '#support' }
      ]
    }
  ];

  const items = navItems.length > 0 ? navItems : defaultItems;

  return (
    <nav className="hidden lg:flex items-center gap-1">
      {items.map((item, idx) => (
        <HeaderNavLink
          key={idx}
          label={item.label}
          url={item.url}
          submenu={item.submenu || []}
          isDark={isDark}
          isActive={activeItem === item.label}
        />
      ))}
    </nav>
  );
}