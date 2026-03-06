import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';

/**
 * Componente compartilhado para headers de módulos
 * Reduz duplicação de código em Dashboard, AdminDashboard, etc
 */

export default function ModuleHeader({
  title,
  subtitle,
  icon: Icon,
  onAdd,
  onRefresh,
  showAdd = true,
  showRefresh = true,
  actions = null
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="flex items-center gap-4">
        {Icon && (
          <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Icon className="w-6 h-6 text-blue-600 dark:text-blue-300" />
          </div>
        )}
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{title}</h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2 flex-wrap sm:flex-nowrap">
        {showRefresh && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            className="gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Atualizar</span>
          </Button>
        )}

        {showAdd && (
          <Button
            onClick={onAdd}
            size="sm"
            className="gap-2 bg-cyan-600 hover:bg-cyan-700 w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Adicionar</span>
          </Button>
        )}

        {actions}
      </div>
    </div>
  );
}