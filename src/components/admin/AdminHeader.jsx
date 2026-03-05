import React, { useState } from 'react';
import { Scale, LogOut, User, Settings, Sun, Moon, ChevronDown, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';

export default function AdminHeader({ user, isSuperAdmin, isDark, setIsDark, activeTab }) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const handleLogout = async () => {
    await base44.auth.logout();
  };

  // Mapa de abas para breadcrumb
  const tabLabels = {
    dashboard: 'Dashboard',
    datajud: 'DataJud API',
    tpu: 'TPU Sync',
    'tpu-analytics': 'TPU Analytics',
    database: 'Database',
    users: 'Usuários',
    alerts: 'Alertas',
    import: 'Importador',
    'e2e-tests': 'E2E Tests',
    settings: 'Configurações'
  };

  const currentTabLabel = tabLabels[activeTab] || 'Dashboard';

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-40 shadow-sm">
      {/* Top Bar */}
      <div className="px-6 py-3 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-600 rounded-lg">
            <Scale className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-white">Admin Panel</h1>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {isSuperAdmin ? 'Super Admin' : 'Admin'}
            </p>
          </div>
        </div>

        {/* Status Badge + Theme + Menu */}
        <div className="flex items-center gap-4">
          {/* System Status */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-200 dark:border-green-800">
            <Circle className="w-2 h-2 fill-green-600 text-green-600" />
            <span className="text-xs font-medium text-green-700 dark:text-green-400">Sistema Online</span>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={() => setIsDark(!isDark)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Alternar tema"
          >
            {isDark ? (
              <Sun className="w-4 h-4 text-gray-700 dark:text-gray-300" />
            ) : (
              <Moon className="w-4 h-4 text-gray-700" />
            )}
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-cyan-600 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-semibold">
                  {user?.full_name?.charAt(0)?.toUpperCase() || 'A'}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:inline max-w-[100px] truncate">
                {user?.full_name?.split(' ')[0] || 'Admin'}
              </span>
              <ChevronDown className={`w-4 h-4 text-gray-600 dark:text-gray-400 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.full_name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                  <p className="text-xs text-cyan-600 dark:text-cyan-400 mt-1 font-medium">
                    {isSuperAdmin ? '👑 Super Admin' : '👤 Admin'}
                  </p>
                </div>

                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
                  <User className="w-4 h-4" />
                  Meu Perfil
                </button>

                <button className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700">
                  <Settings className="w-4 h-4" />
                  Configurações
                </button>

                <button
                  onClick={() => {
                    setIsUserMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="px-6 py-2 flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50">
        <span className="text-gray-700 dark:text-gray-300 font-medium">Admin</span>
        <span className="text-gray-400">/</span>
        <span className="text-cyan-600 dark:text-cyan-400 font-medium">{currentTabLabel}</span>
      </div>
    </header>
  );
}