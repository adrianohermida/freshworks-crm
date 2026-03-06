/**
 * ProcessosAdminView - Visão admin/multi-tenant total
 */
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import ProcessoCard from './ProcessoCard';
import ProcessoKPIBar from './ProcessoKPIBar';
import ProcessoListaVazia from './ProcessoListaVazia';
import ProcessosToolbar from './ProcessosToolbar';
import ProcessosDashboard from './ProcessosDashboard';
import ProcessoModal from './ProcessoModal';
import FiltrosAvancadosProcessos from './FiltrosAvancadosProcessos';
import { useProcessos, useProcessoFilters } from './hooks/useProcessos';

export default function ProcessosAdminView({ user, onBuscarDataJud }) {
  const [filters, setFilters] = useState({ search: '', status: 'todos', tipo: 'todos', tribunal: '' });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProcesso, setEditingProcesso] = useState(null);
  const [showDashboard, setShowDashboard] = useState(false);
  const [filtrosOpen, setFiltrosOpen] = useState(false);

  const { processos, isLoading, deleteMutation } = useProcessos({ user, role: 'admin' });
  const { apply, kpis } = useProcessoFilters(processos);
  const filtrados = apply(filters);
  const stats = kpis();

  const hasFilters = filters.search || filters.status !== 'todos' || filters.tipo !== 'todos' || filters.tribunal;

  function openModal(processo = null) {
    setEditingProcesso(processo);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingProcesso(null);
  }

  function handleDelete(id) {
    if (window.confirm('Remover este processo?')) deleteMutation.mutate(id);
  }

  return (
    <div className="space-y-4">
      <ProcessoKPIBar kpis={stats} cols={5} />

      <FiltrosAvancadosProcessos
        filters={filters}
        onFilterChange={setFilters}
        isOpen={filtrosOpen}
        onToggle={() => setFiltrosOpen(!filtrosOpen)}
      />

      <ProcessosToolbar
        filters={filters}
        onFilterChange={setFilters}
        processosFiltrados={filtrados}
        onNovo={() => openModal()}
        onBuscarDataJud={onBuscarDataJud}
        onToggleDashboard={() => setShowDashboard(d => !d)}
        showDashboard={showDashboard}
      />

      {showDashboard && <ProcessosDashboard processos={filtrados} />}

      {isLoading ? (
        <div className="flex justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>
      ) : filtrados.length === 0 ? (
        <ProcessoListaVazia
          hasFilters={!!hasFilters}
          onNovo={() => openModal()}
          onBuscarDataJud={onBuscarDataJud}
        />
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-slate-500">{filtrados.length} processo(s) encontrado(s)</p>
          {filtrados.map(p => (
            <ProcessoCard
              key={p.id}
              processo={p}
              showCliente
              showConsultor
              onEdit={(proc) => openModal(proc)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <ProcessoModal isOpen={modalOpen} onClose={closeModal} processo={editingProcesso} />
    </div>
  );
}