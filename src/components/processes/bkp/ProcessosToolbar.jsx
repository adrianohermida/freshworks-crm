/**
 * ProcessosToolbar - Barra de ações: filtros + botões de ação
 */
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Search, BarChart2 } from 'lucide-react';
import ProcessoFilters from './ProcessoFilters';
import ProcessosExport from './ProcessosExport';

export default function ProcessosToolbar({
  filters,
  onFilterChange,
  processosFiltrados = [],
  onNovo,
  onBuscarDataJud,
  onToggleDashboard,
  showDashboard,
  canCreate = true,
  canExport = true,
}) {
  return (
    <div className="flex flex-wrap gap-3 items-center justify-between">
      <ProcessoFilters filters={filters} onChange={onFilterChange} />

      <div className="flex gap-2 flex-wrap">
        {canExport && <ProcessosExport processos={processosFiltrados} />}

        {onToggleDashboard && (
          <Button
            variant={showDashboard ? 'secondary' : 'outline'}
            size="sm"
            onClick={onToggleDashboard}
            className="gap-1"
          >
            <BarChart2 className="w-4 h-4" />
            {showDashboard ? 'Ocultar métricas' : 'Métricas'}
          </Button>
        )}

        {onBuscarDataJud && (
          <Button variant="outline" size="sm" onClick={onBuscarDataJud} className="gap-1">
            <Search className="w-3.5 h-3.5" /> DataJud
          </Button>
        )}

        {canCreate && onNovo && (
          <Button
            size="sm"
            onClick={onNovo}
            className="bg-[#212373] hover:bg-[#1a1b5e] text-white gap-1"
          >
            <Plus className="w-4 h-4" /> Novo Processo
          </Button>
        )}
      </div>
    </div>
  );
}