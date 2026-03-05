/**
 * BulkActionsBar.jsx
 * Componente para ações em lote (export CSV, sync múltiplos)
 */
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, RefreshCw, Trash2, X } from 'lucide-react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function BulkActionsBar({ selectedIds = [], processos = [], onClear }) {
  const queryClient = useQueryClient();
  const [syncing, setSyncing] = useState(false);

  const syncMutation = useMutation({
    mutationFn: async (ids) => {
      setSyncing(true);
      try {
        for (const id of ids) {
          const proc = processos.find(p => p.id === id);
          if (proc) {
            // Atualizar sync_status para pendente
            await base44.entities.ProcessoCEJUSC.update(id, {
              sync_status: {
                datajud: { status: 'pendente' },
                tpu: { status: 'pendente' },
                dje: { status: 'pendente' },
              },
            });
          }
        }
      } finally {
        setSyncing(false);
        queryClient.invalidateQueries({ queryKey: ['processos'] });
      }
    },
    onSuccess: () => {
      toast.success(`${selectedIds.length} processo(s) agendado(s) para sincronização`);
      onClear?.();
    },
    onError: (error) => {
      toast.error(`Erro ao sincronizar: ${error.message}`);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (ids) => {
      for (const id of ids) {
        await base44.entities.ProcessoCEJUSC.delete(id);
      }
    },
    onSuccess: () => {
      toast.success(`${selectedIds.length} processo(s) removido(s)`);
      queryClient.invalidateQueries({ queryKey: ['processos'] });
      onClear?.();
    },
    onError: (error) => {
      toast.error(`Erro ao remover: ${error.message}`);
    },
  });

  const handleExportCSV = () => {
    const selected = processos.filter(p => selectedIds.includes(p.id));
    
    const headers = ['Número', 'Status', 'Tribunal', 'Classe', 'Data Ajuizamento', 'Órgão Julgador'];
    const rows = selected.map(p => [
      p.numero_processo,
      p.status,
      p.tribunal,
      p.classe_judicial,
      p.data_ajuizamento || '—',
      p.orgao_julgador,
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(r => r.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `processos-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success('CSV exportado com sucesso');
  };

  if (selectedIds.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:right-auto md:left-auto md:max-w-2xl md:mx-auto bg-slate-900 text-white rounded-lg p-4 shadow-lg flex items-center justify-between gap-3 z-40">
      <div className="flex items-center gap-3">
        <Badge variant="secondary" className="text-base px-2 py-1">
          {selectedIds.length} selecionado(s)
        </Badge>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="ghost"
          className="text-white hover:bg-slate-700"
          onClick={handleExportCSV}
          disabled={syncing || deleteMutation.isPending}
        >
          <Download className="w-4 h-4 mr-1" />
          Exportar CSV
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className="text-white hover:bg-slate-700"
          onClick={() => syncMutation.mutate(selectedIds)}
          disabled={syncing || deleteMutation.isPending}
        >
          <RefreshCw className={`w-4 h-4 mr-1 ${syncing ? 'animate-spin' : ''}`} />
          Sincronizar
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className="text-red-400 hover:bg-red-900/20"
          onClick={() => {
            if (window.confirm(`Remover ${selectedIds.length} processo(s)?`)) {
              deleteMutation.mutate(selectedIds);
            }
          }}
          disabled={syncing || deleteMutation.isPending}
        >
          <Trash2 className="w-4 h-4 mr-1" />
          Remover
        </Button>

        <Button
          size="sm"
          variant="ghost"
          className="text-white hover:bg-slate-700"
          onClick={onClear}
          disabled={syncing || deleteMutation.isPending}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}