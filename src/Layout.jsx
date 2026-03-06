import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useNavigate } from 'react-router-dom';
import {
  Moon, Sun, LayoutDashboard, Ticket, Users, UserCog,
  Settings, BarChart2, Activity, ChevronLeft, ChevronRight, Menu, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import PWAInstall from '@/components/PWAInstall';
import ServiceWorkerProvider from '@/components/ServiceWorkerProvider';
import PWAMetaTags from '@/components/PWAMetaTags';
import OfflineIndicator from '@/components/OfflineIndicator';
import ErrorBoundary from '@/components/ErrorBoundary';
import LanguageSwitcher from '@/components/i18n/LanguageSwitcher';
import { useTranslation } from '@/components/i18n/useTranslation';

const getNavItems = (t) => [
  { label: t('common.dashboard'), href: '/', page: 'Dashboard', icon: LayoutDashboard },
  { label: t('common.tickets'), href: '/?page=Tickets', page: 'Tickets', icon: Ticket, also: ['TicketDetail'] },
  { label: t('common.contacts'), href: '/?page=Contacts', page: 'Contacts', icon: Users },
  { label: t('common.agents'), href: '/?page=Agents', page: 'Agents', icon: UserCog },
  { label: t('common.analytics'), href: '/?page=Performance', page: 'Performance', icon: BarChart2 },
  { label: t('common.status'), href: '/?page=IntegrationStatus', page: 'IntegrationStatus', icon: Activity },
  { label: t('common.portal'), href: '/?page=CustomerPortal', page: 'CustomerPortal', icon: Users },
  { label: t('common.settings'), href: '/?page=Settings', page: 'Settings', icon: Settings },
];

const navItems = getNavItems(t);

export default function Layout({ children, currentPageName }) {
  const { setTheme, resolvedTheme } = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const toggleTheme = () => {
    if (mounted) setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  const isActive = (item) =>
    item.page === currentPageName || (item.also && item.also.includes(currentPageName));

  if (!mounted) return <>{children}</>;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-background text-foreground flex">
        <PWAMetaTags />
        <ServiceWorkerProvider />

        {/* Mobile overlay */}
        {mobileOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`
            fixed top-0 left-0 h-full z-50 bg-card border-r border-border flex flex-col transition-all duration-300
            ${collapsed ? 'w-16' : 'w-60'}
            ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
            md:translate-x-0 md:static md:flex
          `}
        >
          {/* Logo */}
          <div className={`flex items-center h-16 px-4 border-b border-border gap-3 ${collapsed ? 'justify-center' : 'justify-between'}`}>
            {!collapsed && (
              <span className="text-base font-bold text-foreground truncate">{t('common.dashboard')} Manager</span>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex items-center justify-center w-7 h-7 rounded-md hover:bg-muted text-muted-foreground"
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden flex items-center justify-center w-7 h-7 rounded-md hover:bg-muted text-muted-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 py-4 overflow-y-auto">
            {navItems.map((item) => {
               const Icon = item.icon;
               const active = isActive(item);
               return (
                 <button
                   key={item.page}
                   onClick={() => {
                     navigate(item.href);
                     setMobileOpen(false);
                   }}
                   title={collapsed ? item.label : undefined}
                   className={`
                     flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm font-medium transition-colors mb-0.5 w-full text-left
                     ${active
                       ? 'bg-primary text-primary-foreground'
                       : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
                     ${collapsed ? 'justify-center px-0' : ''}
                   `}
                 >
                   <Icon className="w-4 h-4 shrink-0" />
                   {!collapsed && <span>{item.label}</span>}
                 </button>
               );
             })}
          </nav>

          {/* Bottom: Theme + Language */}
          <div className={`border-t border-border p-3 flex ${collapsed ? 'flex-col items-center gap-2' : 'items-center justify-between'}`}>
            {!collapsed && <LanguageSwitcher />}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Alternar tema"
              className="shrink-0"
            >
              {resolvedTheme === 'dark'
                ? <Sun className="h-4 w-4 text-yellow-500" />
                : <Moon className="h-4 w-4 text-slate-400" />}
            </Button>
            {collapsed && <LanguageSwitcher />}
          </div>
        </aside>

        {/* Main area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile topbar */}
          <header className="md:hidden sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur">
            <button
               onClick={() => setMobileOpen(true)}
               className="flex items-center justify-center w-8 h-8 rounded-md hover:bg-muted text-muted-foreground"
             >
               <Menu className="w-5 h-5" />
             </button>
             <span className="text-base font-bold truncate">{t('common.dashboard')} Manager</span>
          </header>

          <main className="flex-1 overflow-auto">
            {children}
          </main>

          <footer className="border-t border-border bg-background py-4 px-6 text-center text-xs text-muted-foreground">
            © 2026 Freshdesk Manager. {t('common.dashboard')} reservados.
          </footer>
        </div>

        <PWAInstall />
        <OfflineIndicator />
      </div>
    </ErrorBoundary>
  );
}