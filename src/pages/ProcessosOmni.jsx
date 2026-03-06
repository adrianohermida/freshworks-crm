import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import { motion } from 'framer-motion';

import ProcessosHeaderCompacta from '@/components/processos/ProcessosHeaderCompacta';
import ProcessoCardCompacta from '@/components/processos/ProcessoCardCompacta';
import ProcessoCreateModal from '@/components/processos/ProcessoCreateModal';
import ProcessosFiltersDrawer from '@/components/processos/ProcessosFiltersDrawer';
import LoadingState from '@/components/common/LoadingState';
import { useLocation } from 'react-router-dom';
import { useProcessosData } from '@/components/processos/hooks/useProcessosData';
import { useProcessosActions } from '@/components/processos/hooks/useProcessosActions';
import { InstrumentedErrorBoundary } from '@/components/debug/InstrumentedErrorBoundary';
import { FileText } from 'lucide-react';

export default function ProcessosOmni() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  
  // Estados
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showFiltersDrawer, setShowFiltersDrawer] = useState(false);
  const [filtros, setFiltros] = useState({
    status: 'todos',
    cliente_id: 'todos',
    dataInicio: null,
    dataFim: null,
  });

  // Dados
  const { processos = [], clientes, escritorio, isLoading } = useProcessosData();
  const { createMutation } = useProcessosActions(escritorio?.id);

  // Auditoria de filtros (com validação)
  const handleFiltrosChange = useCallback((novosFiltros) => {
    setFiltros(novosFiltros);
    // Log assíncrono sem bloquear UX
    if (escritorio?.id) {
      base44.functions.invoke('auditarFiltrosProcessos', {
        escritorio_id: escritorio.id,
        filtros: novosFiltros,
        timestamp: new Date().toISOString(),
      }).catch(() => {});
    }
  }, [escritorio?.id]);

  // Filtrar processos (memoized)
  const processosFiltrados = useMemo(() => {
    return processos.filter((processo) => {
      const matchSearch =
        !searchTerm ||
        processo.numero_cnj?.includes(searchTerm) ||
        processo.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        clientes?.find(c => c.id === processo.cliente_id)?.nome_completo?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchStatus = filtros.status === 'todos' || processo.status === filtros.status;
      const matchCliente = filtros.cliente_id === 'todos' || processo.cliente_id === filtros.cliente_id;
      const matchData = 
        (!filtros.dataInicio || new Date(processo.data_distribuicao) >= new Date(filtros.dataInicio)) &&
        (!filtros.dataFim || new Date(processo.data_distribuicao) <= new Date(filtros.dataFim));

      return matchSearch && matchStatus && matchCliente && matchData;
    });
  }, [processos, searchTerm, filtros, clientes]);

  const handleSubmit = (data) => {
    createMutation.mutate(data);
    setShowModal(false);
  };

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
      <div className="min-h-screen bg-[var(--bg-secondary)] pb-20 lg:pb-0">
        {/* Header Compacto */}
        <ProcessosHeaderCompacta
          totalProcessos={processosFiltrados.length}
          onNovo={() => setShowModal(true)}
          onBuscar={setSearchTerm}
          searchTerm={searchTerm}
          onFiltersToggle={() => setShowFiltersDrawer(!showFiltersDrawer)}
          filtrosAtivos={Object.values(filtros).some(v => v !== 'todos' && v !== null)}
        />

        {/* Conteúdo */}
        <div className="max-w-7xl mx-auto px-3 md:px-6 py-4 space-y-4">
          {/* Estado Vazio */}
          {processosFiltrados.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col items-center justify-center py-16 text-center" 
              data-testid="empty-state"
            >
              <FileText className="w-12 h-12 text-[var(--text-tertiary)] mb-4 opacity-50" />
              <p className="text-[var(--text-secondary)] mb-2">Nenhum processo encontrado</p>
              <p className="text-xs text-[var(--text-tertiary)] mb-4">
                {searchTerm ? 'Tente ajustar sua busca' : 'Crie um novo processo para começar'}
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="text-[var(--brand-primary)] hover:underline font-medium text-sm"
                data-testid="btn-novo-processo-empty"
              >
                + Criar novo processo
              </button>
            </motion.div>
          ) : (
            /* Grid Adaptativo */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {processosFiltrados.map((processo) => (
                <ProcessoCardCompacta
                  key={processo.id}
                  processo={processo}
                  cliente={clientes?.find((c) => c.id === processo.cliente_id)}
                  onView={() => navigate(createPageUrl('ProcessoDetails') + `?id=${processo.id}`)}
                />
              ))}
            </div>
          )}
        </div>

        {/* Modais */}
        <ProcessoCreateModal 
          open={showModal} 
          onClose={() => setShowModal(false)} 
          onSubmit={handleSubmit}
          escritorioId={escritorio?.id}
        />

        <ProcessosFiltersDrawer
          open={showFiltersDrawer}
          onClose={() => setShowFiltersDrawer(false)}
          filtros={filtros}
          onFiltrosChange={handleFiltrosChange}
          clientes={clientes}
        />
      </div>
    </InstrumentedErrorBoundary>
  );
}