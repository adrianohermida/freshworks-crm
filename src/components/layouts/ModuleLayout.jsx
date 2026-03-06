import React from 'react';

export default function ModuleLayout({ 
  title, 
  subtitle, 
  icon: Icon, 
  actions, 
  children,
  className = '' 
}) {
  return (
    <div style={{ backgroundColor: 'var(--color-light)', minHeight: '100vh', padding: 'var(--spacing-lg)' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
              {Icon && <Icon style={{ width: '32px', height: '32px', color: 'var(--color-primary)' }} />}
              <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
                {title}
              </h1>
            </div>
            {subtitle && (
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', marginTop: 'var(--spacing-sm)', opacity: 0.8 }}>
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
              {actions}
            </div>
          )}
        </div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}