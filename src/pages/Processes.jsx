import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import Button from '@/components/aetherlab/Button';
import Input from '@/components/aetherlab/Input';
import Card from '@/components/aetherlab/Card';
import ProcessCard from '../components/processes/ProcessCard';
import MovementTimeline from '../components/processes/MovementTimeline';
import AddProcessDialog from '../components/processes/AddProcessDialog';
import ExportToSheetsButton from '../components/processes/ExportToSheetsButton';
import ExportPDFButton from '../components/processes/ExportPDFButton';
import ProcessListMobile from '../components/processes/ProcessListMobile';
import AccessibilityEnhancer from '../components/processes/AccessibilityEnhancer';
import { useAnalytics } from '../components/analytics/useAnalytics';
import { agruparTribunaisPorCategoria } from '../functions/utils/tribunaisData';

export default function ProcessesPage() {
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;
  const queryClient = useQueryClient();
  const { trackEvent } = useAnalytics();

  // Fetch all processes with pagination (RLS: filtra por created_by)
   const { data: processes = [], isLoading: isLoadingProcesses } = useQuery({
     queryKey: ['processes', { page: currentPage, pageSize }],
     queryFn: async () => {
       const user = await base44.auth.me();
       const skip = (currentPage - 1) * pageSize;
       return base44.entities.Process.filter({ created_by: user.email }, '-synced_at', pageSize, skip);
     },
     staleTime: 5 * 60 * 1000, // 5 minutos
   });

  // Fetch movements for selected process (RLS: filtra por created_by)
   const { data: movements = [], isLoading: isLoadingMovements } = useQuery({
     queryKey: ['movements', selectedProcess?.id],
     queryFn: async () => {
       if (!selectedProcess) return [];
       const user = await base44.auth.me();
       return base44.entities.ProcessMovement.filter(
         { process_id: selectedProcess.id, created_by: user.email }, 
         '-movement_date'
       );
     },
     enabled: !!selectedProcess,
     staleTime: 3 * 60 * 1000, // 3 minutos
   });

  // Add/Sync process mutation
  const syncProcessMutation = useMutation({
    mutationFn: (data) => base44.functions.invoke('datajudFetchProcess', data),
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 30000),
    onSuccess: (response) => {
      // Track analytics
      trackEvent({
        event_type: 'process_synced',
        entity_type: 'process',
        entity_id: response.data.id,
        action: `Sincronizou processo ${response.data.cnj_number}`,
        value: response.data.movements?.length || 0,
        status: 'success'
      });
      
      // Exibir toast de sucesso
      const event = new CustomEvent('toast', {
        detail: { 
          message: `Processo sincronizado com sucesso (${response.data.movements?.length || 0} movimentos)`, 
          type: 'success' 
        }
      });
      window.dispatchEvent(event);
      queryClient.invalidateQueries({ queryKey: ['processes'] });
      queryClient.invalidateQueries({ queryKey: ['movements'] });
      setIsDialogOpen(false);
    },
    onError: (error) => {
      // Track analytics
      trackEvent({
        event_type: 'process_synced',
        entity_type: 'process',
        action: 'Erro ao sincronizar processo',
        status: 'error',
        metadata: { error: error.message }
      });
      
      // Exibir toast de erro
      const errorMsg = error.response?.data?.error || 'Erro ao sincronizar processo';
      const event = new CustomEvent('toast', {
        detail: { message: errorMsg, type: 'error' }
      });
      window.dispatchEvent(event);
    }
  });

  // Refresh individual process
  const handleRefreshProcess = async (process) => {
    await syncProcessMutation.mutateAsync({
      cnj_number: process.cnj_number,
      title: process.title
    });
  };

  // Filter processes by search
  const filteredProcesses = processes.filter(p =>
    p.cnj_number.includes(searchTerm.toUpperCase()) ||
    (p.title && p.title.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Track search
  useEffect(() => {
    if (searchTerm.length > 0) {
      trackEvent({
        event_type: 'search_performed',
        entity_type: 'process',
        action: `Pesquisou por "${searchTerm}"`,
        value: filteredProcesses.length,
        status: 'success'
      });
    }
  }, [searchTerm]);

  return (
    <AccessibilityEnhancer>
      <div style={{ backgroundColor: 'var(--color-light)', minHeight: '100vh', padding: 'var(--spacing-lg)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-2xl)' }}>
          <div>
            <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
              Acompanhamento de Processos
            </h1>
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', marginTop: 'var(--spacing-sm)', opacity: 0.8 }}>
              Integração com DataJud - CNJ
            </p>
          </div>
          <div style={{ display: 'flex', gap: 'var(--spacing-md)', alignItems: 'center' }}>
            <Button
              onClick={() => setIsDialogOpen(true)}
              variant="primary"
              size="md"
              aria-label="Adicionar novo processo"
            >
              <Plus style={{ width: '16px', height: '16px' }} />
              Adicionar Processo
            </Button>
            <ExportToSheetsButton processes={filteredProcesses} disabled={filteredProcesses.length === 0} />
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: 'var(--spacing-lg)' }}>
          <Search style={{ position: 'absolute', left: 'var(--spacing-md)', top: 'var(--spacing-md)', width: '16px', height: '16px', color: 'var(--color-body)', opacity: 0.5 }} />
          <Input
            placeholder="Buscar por número CNJ ou descrição..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="md"
            style={{ paddingLeft: 'var(--spacing-2xl)' }}
            aria-label="Buscar processos"
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--spacing-lg)' }}>
          {/* Processes List */}
          <div style={{ minWidth: '0' }}>
            <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', marginBottom: 'var(--spacing-lg)' }}>
              Processos ({filteredProcesses.length})
            </h2>
            {isLoadingProcesses ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                {[...Array(3)].map((_, i) => (
                  <div key={i} style={{ height: '120px', backgroundColor: 'var(--color-gray)', borderRadius: 'var(--border-radius-md)', animation: 'pulse 2s infinite' }} />
                ))}
              </div>
            ) : filteredProcesses.length === 0 ? (
              <Card variant="default">
                <p style={{ color: 'var(--color-body)', textAlign: 'center', margin: 0 }}>Nenhum processo encontrado</p>
                <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', marginTop: 'var(--spacing-md)', textAlign: 'center' }}>
                  Adicione um novo processo para começar
                </p>
              </Card>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)', maxHeight: '70vh', overflowY: 'auto', paddingRight: 'var(--spacing-sm)' }}>
                {filteredProcesses.map((process) => (
                  <div
                    key={process.id}
                    onClick={() => setSelectedProcess(process)}
                    style={{ cursor: 'pointer' }}
                  >
                    <ProcessCard
                      process={process}
                      onRefresh={() => handleRefreshProcess(process)}
                      isLoading={syncProcessMutation.isPending}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Movement Timeline */}
          <div style={{ gridColumn: 'auto / span 2', minWidth: '0' }}>
            {selectedProcess ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
                <Card variant="default">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 'var(--spacing-md)' }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <h2 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0 }}>
                        {selectedProcess.title}
                      </h2>
                      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', fontFamily: 'monospace', marginTop: 'var(--spacing-md)', margin: 0, wordBreak: 'break-all' }}>
                        {selectedProcess.cnj_number}
                      </p>
                    </div>
                    <ExportPDFButton process={selectedProcess} movements={movements} disabled={!selectedProcess} />
                  </div>
                </Card>
                <Card variant="default">
                  <h3 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', marginBottom: 'var(--spacing-lg)', margin: 0 }}>
                    Histórico de Movimentos
                  </h3>
                  <MovementTimeline
                    movements={movements}
                    isLoading={isLoadingMovements}
                  />
                </Card>
              </div>
            ) : (
              <Card variant="default" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', textAlign: 'center' }}>
                <div>
                  <p style={{ fontSize: 'var(--font-size-lg)', color: 'var(--color-body)', margin: 0 }}>Selecione um processo para visualizar</p>
                  <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', marginTop: 'var(--spacing-md)' }}>os movimentos e atualizações</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

        {/* Dialog */}
        <AddProcessDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onAdd={(data) => syncProcessMutation.mutate(data)}
          isLoading={syncProcessMutation.isPending}
        />
      </div>
    </AccessibilityEnhancer>
  );
}