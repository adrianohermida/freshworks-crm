/**
 * ProcessosConsultorView - Visão do consultor (multi-tenant por email)
 */
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import ProcessoCard from './ProcessoCard';
import ProcessoKPIBar from './ProcessoKPIBar';
import ProcessoListaVazia from './ProcessoListaVazia';
import ProcessosToolbar from './ProcessosToolbar';
import ProcessoModal from './ProcessoModal';
import { useProcessos, useProcessoFilters } from './hooks/useProcessos';

export default function ProcessosConsultorView({ user, onBuscarDataJud }) {
  const [filters, setFilters] = useState({ search: '', status: 'todos', tipo: 'todos', tribunal: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProcesso, setEditingProcesso] = useState(null);

  const { processos, isLoading } = useProcessos({ user, role: user?.role || 'consultor' });
  const { apply, kpis } = useProcessoFilters(processos);
  const filtrados = apply(filters);
  const stats = kpis();

  const hasFilters = filters.search || filters.status !== 'todos' || filters.tipo !== 'todos' || filters.tribunal;

  return (
    <div className="space-y-5">
      <ProcessoKPIBar kpis={stats} cols={4} />

      <ProcessosToolbar
        filters={filters}
        onFilterChange={setFilters}
        processosFiltrados={filtrados}
        onNovo={() => { setEditingProcesso(null); setModalOpen(true); }}
        onBuscarDataJud={onBuscarDataJud}
      />

      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
      ) : filtrados.length === 0 ? (
        <ProcessoListaVazia
          hasFilters={!!hasFilters}
          onNovo={() => setModalOpen(true)}
          onBuscarDataJud={onBuscarDataJud}
        />
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-slate-500">{filtrados.length} processo(s)</p>
          {filtrados.map(p => (
            <ProcessoCard
              key={p.id}
              processo={p}
              showCliente
              onEdit={(proc) => { setEditingProcesso(proc); setModalOpen(true); }}
            />
          ))}
        </div>
      )}

      <ProcessoModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingProcesso(null); }}
        processo={editingProcesso}
      />
    </div>
  );
}