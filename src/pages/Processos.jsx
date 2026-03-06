import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import ProcessosHeader from '@/components/processos/ProcessosHeader';
import ProcessoSearchBar from '@/components/processos/ProcessoSearchBar';
import ProcessoTable from '@/components/processos/ProcessoTable';
import ProcessoListViewToggle from '@/components/processos/ProcessoListViewToggle';
import ProcessoCardCompacta from '@/components/processos/ProcessoCardCompacta';
import ProcessoCreateModal from '@/components/processos/ProcessoCreateModal';
import LoadingState from '@/components/common/LoadingState';
import { useProcessosData } from '@/components/processos/hooks/useProcessosData';
import { useProcessosFilters } from '@/components/processos/hooks/useProcessosFilters';
import { InstrumentedErrorBoundary } from '@/components/debug/InstrumentedErrorBoundary';

export default function Processos() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [filtros, setFiltros] = useState({ status: 'todos', cliente_id: 'todos' });

  const { processos = [], clientes, escritorio, isLoading } = useProcessosData();
  const processosFiltrados = useProcessosFilters(processos, clientes, searchTerm, filtros, []);

  React.useEffect(() => {
    if (escritorio) document.documentElement.setAttribute('data-escritorio', escritorio.id);
  }, [escritorio]);

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('new') === 'true') {
      setShowModal(true);
      window.history.replaceState({}, '', createPageUrl('Processos'));
    }
  }, [location.search]);

  if (isLoading) return <LoadingState message="Carregando processos..." />;

  return (
    <InstrumentedErrorBoundary category="ROUTES">
      <div className="min-h-screen bg-[var(--bg-secondary)] pb-20 md:pb-0">
        <ProcessosHeader totalProcessos={processosFiltrados.length} onNovo={() => setShowModal(true)} />
        <ProcessoSearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} filtros={filtros} onFiltrosChange={setFiltros} clientes={clientes} />
        
        <div className="sticky top-[180px] z-20 bg-[var(--bg-secondary)] border-b border-[var(--border-primary)] px-3 md:px-6 py-2">
          <div className="max-w-7xl mx-auto flex justify-end">
            <ProcessoListViewToggle view={viewMode} onViewChange={setViewMode} />
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-3 md:px-6 py-6">
          {processosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[var(--text-secondary)] mb-4">Nenhum processo encontrado</p>
              <button onClick={() => setShowModal(true)} className="text-[var(--brand-primary)] hover:underline font-medium">
                Criar novo processo
              </button>
            </div>
          ) : viewMode === 'table' ? (
            <ProcessoTable processos={processosFiltrados} clientes={clientes} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {processosFiltrados.map((p) => (
                <ProcessoCardCompacta key={p.id} processo={p} cliente={clientes?.find((c) => c.id === p.cliente_id)} />
              ))}
            </div>
          )}
        </div>

        <ProcessoCreateModal open={showModal} onClose={() => setShowModal(false)} onSubmit={(data) => setShowModal(false)} escritorioId={escritorio?.id} />
      </div>
    </InstrumentedErrorBoundary>
  );
}