import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import { navigationItems } from './navigationData';

export default function HeaderMobileMenu({ isOpen, onClose, currentPageName, user }) {
  const handleLogout = async () => {
    await base44.auth.logout();
  };

  if (!isOpen) return null;

  return (
    <nav style={{
      display: 'flex',
      flexDirection: 'column',
      borderTop: '1px solid var(--color-border)',
      paddingBottom: 'var(--spacing-lg)',
      paddingTop: 'var(--spacing-lg)',
      gap: 'var(--spacing-sm)',
    }}>
      {navigationItems.map((item) => (
        <Link
          key={item.page}
          to={createPageUrl(item.page)}
          style={{
            padding: 'var(--spacing-md) 0',
            color: currentPageName === item.page ? 'var(--color-primary)' : 'var(--color-body)',
            textDecoration: 'none',
            fontSize: 'var(--font-size-sm)',
            fontWeight: 'var(--font-weight-semibold)',
            transition: 'color 250ms ease',
            borderBottom: '1px solid var(--color-border)',
          }}
          onClick={onClose}
        >
          {item.name}
        </Link>
      ))}
      <button
        onClick={() => {
          if (user) {
            handleLogout();
          } else {
            base44.auth.redirectToLogin();
          }
          onClose();
        }}
        style={{
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-white)',
          fontWeight: 'var(--font-weight-semibold)',
          fontSize: 'var(--font-size-sm)',
          borderRadius: 'var(--border-radius-md)',
          padding: 'var(--spacing-md) var(--spacing-lg)',
          border: 'none',
          cursor: 'pointer',
          marginTop: 'var(--spacing-lg)',
          width: '100%',
        }}
      >
        {user ? 'Sair' : 'Login'}
      </button>
    </nav>
  );
}