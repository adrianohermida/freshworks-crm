import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { 
  LayoutDashboard, Users, Building2, Zap, Eye, Shield, LogOut, Menu, X 
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminNav({ isOpen, onClose, isSuperAdmin, user }) {
  const adminMenuItems = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
      path: 'AdminPanel',
      superAdminOnly: false
    },
    {
      label: 'Usuários',
      icon: Users,
      path: 'AdminUsers',
      superAdminOnly: false
    },
    {
      label: 'Tenants',
      icon: Building2,
      path: 'AdminTenants',
      superAdminOnly: true
    },
    {
      label: 'Integrações',
      icon: Zap,
      path: 'AdminIntegrations',
      superAdminOnly: false
    },
    {
      label: 'Monitoramento',
      icon: Eye,
      path: 'AdminMonitoring',
      superAdminOnly: false
    },
    {
      label: 'Conformidade',
      icon: Shield,
      path: 'AdminCompliance',
      superAdminOnly: false
    }
  ];

  const filteredItems = adminMenuItems.filter(item => 
    !item.superAdminOnly || isSuperAdmin
  );

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">Admin</h2>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex gap-1">
              {filteredItems.map(item => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={createPageUrl(item.path)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={onClose}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            {filteredItems.map(item => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={createPageUrl(item.path)}
                  onClick={onClose}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </nav>
  );
}