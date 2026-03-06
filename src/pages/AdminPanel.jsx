import React, { useState, useEffect } from 'react';
import { useAdminAuth } from '@/components/hooks/useAdminAuth';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminNavigation from '@/components/admin/AdminNavigation';
import AdminContentWrapper from '@/components/admin/AdminContentWrapper';
import Card from '@/components/aetherlab/Card';
import { AlertCircle } from 'lucide-react';

export default function AdminPanel() {
  const { user, isLoading, error, isAdmin } = useAdminAuth();
  const isSuperAdmin = user?.role === 'super_admin';
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedUserType, setSelectedUserType] = useState('admin');
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  if (isLoading) {
    return (
      <div style={{ backgroundColor: 'var(--color-light)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ animation: 'spin 1s linear infinite', width: '48px', height: '48px', borderTop: '4px solid var(--color-primary)', borderRadius: '50%', margin: '0 auto 1rem' }}></div>
          <p style={{ color: 'var(--color-body)' }}>Verificando acesso...</p>
        </div>
      </div>
    );
  }

  if (error || !isAdmin) {
    return (
      <div style={{ backgroundColor: 'var(--color-light)', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'var(--spacing-lg)' }}>
        <Card variant="elevated" style={{ maxWidth: '500px', width: '100%', borderLeft: '4px solid var(--color-error)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)', color: 'var(--color-error)' }}>
            <AlertCircle style={{ width: '24px', height: '24px' }} />
            <h1 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', margin: 0 }}>🔐 Acesso Negado</h1>
          </div>
          <p style={{ color: 'var(--color-body)', margin: 0, fontSize: 'var(--font-size-base)' }}>
            {error || 'Você não tem permissão para acessar este painel. Apenas administradores podem acessar.'}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: 'var(--color-light)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AdminHeader user={user} isSuperAdmin={isSuperAdmin} isDark={isDark} setIsDark={setIsDark} activeTab={activeTab} />
      <AdminNavigation activeTab={activeTab} setActiveTab={setActiveTab} />
      <main style={{ flex: 1, overflow: 'auto' }}>
        <AdminContentWrapper
          activeTab={activeTab}
          isSuperAdmin={isSuperAdmin}
          selectedUserType={selectedUserType}
          setSelectedUserType={setSelectedUserType}
        />
      </main>
    </div>
  );
}

// Keyframe for loading spinner
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);