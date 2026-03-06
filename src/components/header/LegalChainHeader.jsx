import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Menu, X, Scale, User, Settings, LogOut, ChevronDown, LayoutDashboard, FileText, Bell, Users, Calendar, Clock, BookOpen } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const navItems = [
  { page: 'Dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { page: 'Processes', name: 'Processos', icon: FileText },
  { page: 'Deadlines', name: 'Prazos', icon: Clock },
  { page: 'Contacts', name: 'Contatos', icon: Users },
  { page: 'Agenda', name: 'Agenda', icon: Calendar },
  { page: 'Publications', name: 'Publicações', icon: BookOpen },
];

export default function LegalChainHeader({ currentPageName, user }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const handleLogout = () => {
    setIsUserDropdownOpen(false);
    base44.auth.logout();
  };

  return (
    <header style={{
      backgroundColor: 'var(--color-white)',
      borderBottom: `2px solid var(--color-primary)`,
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: 'var(--shadow-md)',
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 var(--spacing-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
          
          {/* Logo */}
          <Link to={createPageUrl('Dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <div style={{
              width: '36px', height: '36px', borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--color-primary), #a78bfa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(126,87,255,0.3)'
            }}>
              <Scale style={{ width: '18px', height: '18px', color: '#fff' }} />
            </div>
            <span style={{
              fontFamily: "'Spartan', sans-serif",
              fontWeight: '700',
              fontSize: 'var(--font-size-xl)',
              color: 'var(--color-heading)',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              Legal<span style={{ color: 'var(--color-primary)' }}>Dock</span>
            </span>
          </Link>

          {/* Navigation - Desktop */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: '2px', '@media (max-width: 768px)': { display: 'none' } }}>
            {navItems.map((item) => {
              const isActive = currentPageName === item.page;
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    fontWeight: isActive ? '600' : '500',
                    color: isActive ? 'var(--color-primary)' : 'var(--color-body)',
                    backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
                    transition: 'all 0.15s ease',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--color-light)';
                      e.currentTarget.style.color = 'var(--color-heading)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--color-body)';
                    }
                  }}
                >
                  <item.icon style={{ width: '15px', height: '15px' }} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right side - User Menu */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', position: 'relative' }}>
            
            {/* Notifications */}
            <Link to={createPageUrl('NotificationCenter')} style={{
              width: '36px', height: '36px', borderRadius: '8px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--color-body)',
              textDecoration: 'none',
              backgroundColor: 'transparent',
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-light)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <Bell style={{ width: '18px', height: '18px' }} />
            </Link>

            {/* User dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '8px',
                  padding: '6px 12px 6px 6px',
                  borderRadius: '10px', border: '1px solid var(--color-border)',
                  backgroundColor: 'transparent', cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-light)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div style={{
                  width: '28px', height: '28px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--color-primary), #a78bfa)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <User style={{ width: '14px', height: '14px', color: '#fff' }} />
                </div>
                <span style={{ fontSize: '14px', fontWeight: '500', color: 'var(--color-heading)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user?.full_name?.split(' ')[0] || 'Usuário'}
                </span>
                <ChevronDown style={{ width: '14px', height: '14px', color: 'var(--color-body)' }} />
              </button>

              {isUserDropdownOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  backgroundColor: '#fff', border: '1px solid var(--color-border)',
                  borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  minWidth: '200px', overflow: 'hidden', zIndex: 200,
                }}
                onMouseLeave={() => setIsUserDropdownOpen(false)}
                >
                  {/* User info */}
                  <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-light)' }}>
                    <p style={{ margin: 0, fontWeight: '600', fontSize: '14px', color: 'var(--color-heading)' }}>
                      {user?.full_name || 'Usuário'}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--color-body)' }}>
                      {user?.email || ''}
                    </p>
                    {user?.role === 'admin' && (
                      <span style={{ display: 'inline-block', marginTop: '4px', fontSize: '11px', fontWeight: '600', color: 'var(--color-primary)', backgroundColor: 'var(--color-primary-light)', padding: '2px 8px', borderRadius: '20px' }}>
                        Admin
                      </span>
                    )}
                  </div>

                  {/* Menu items */}
                  <div style={{ padding: '6px' }}>
                    <Link
                      to={createPageUrl('Profile')}
                      onClick={() => setIsUserDropdownOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '8px', textDecoration: 'none', color: 'var(--color-heading)', fontSize: '14px', transition: 'background 0.1s' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-light)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <User style={{ width: '15px', height: '15px', color: 'var(--color-body)' }} />
                      Meu Perfil
                    </Link>

                    <Link
                      to={createPageUrl('Settings')}
                      onClick={() => setIsUserDropdownOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '8px', textDecoration: 'none', color: 'var(--color-heading)', fontSize: '14px', transition: 'background 0.1s' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-light)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <Settings style={{ width: '15px', height: '15px', color: 'var(--color-body)' }} />
                      Configurações
                    </Link>

                    {user?.role === 'admin' && (
                      <Link
                        to={createPageUrl('AdminPanel')}
                        onClick={() => setIsUserDropdownOpen(false)}
                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '8px', textDecoration: 'none', color: 'var(--color-primary)', fontSize: '14px', fontWeight: '500', transition: 'background 0.1s' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-light)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        <LayoutDashboard style={{ width: '15px', height: '15px' }} />
                        Admin Panel
                      </Link>
                    )}
                  </div>

                  {/* Logout */}
                  <div style={{ padding: '6px', borderTop: '1px solid var(--color-border)' }}>
                    <button
                      onClick={handleLogout}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '8px', width: '100%', backgroundColor: 'transparent', border: 'none', color: '#ef4444', fontSize: '14px', cursor: 'pointer', transition: 'background 0.1s' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <LogOut style={{ width: '15px', height: '15px' }} />
                      Sair
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              style={{ padding: '8px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-heading)', borderRadius: '8px', '@media (min-width: 768px)': { display: 'none' } }}
            >
              {isMobileMenuOpen ? <X style={{ width: '20px', height: '20px' }} /> : <Menu style={{ width: '20px', height: '20px' }} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div style={{ borderTop: '1px solid var(--color-border)', padding: 'var(--spacing-md) 0', display: 'flex', flexDirection: 'column', gap: '4px', '@media (min-width: 768px)': { display: 'none' } }}>
            {navItems.map((item) => {
              const isActive = currentPageName === item.page;
              return (
                <Link
                  key={item.page}
                  to={createPageUrl(item.page)}
                  onClick={() => setIsMobileMenuOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '10px 12px', borderRadius: '8px', textDecoration: 'none',
                    fontSize: '15px', fontWeight: isActive ? '600' : '500',
                    color: isActive ? 'var(--color-primary)' : 'var(--color-heading)',
                    backgroundColor: isActive ? 'var(--color-primary-light)' : 'transparent',
                  }}
                >
                  <item.icon style={{ width: '16px', height: '16px' }} />
                  {item.name}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}