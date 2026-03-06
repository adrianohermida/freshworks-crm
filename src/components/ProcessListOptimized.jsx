import React, { useState, useMemo, useCallback, Suspense, lazy } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Loader2 } from 'lucide-react';

// Lazy load components
const ProcessCard = lazy(() => import('./processes/ProcessCard'));
const ProcessDetailPanel = lazy(() => import('./ProcessDetailPanel'));

const ProcessListOptimized = ({ searchTerm = '', filters = {} }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 20;

  // Query com caching agressivo
  const { data: processes = [], isLoading, isFetchingNextPage } = useQuery({
    queryKey: ['processes', page, searchTerm, filters],
    queryFn: async () => {
      const response = await base44.entities.Process.filter(
        { ...filters, title: searchTerm ? { $regex: searchTerm, $options: 'i' } : undefined },
        '-synced_at',
        PAGE_SIZE,
        (page - 1) * PAGE_SIZE
      );
      return response;
    },
    staleTime: 5 * 60 * 1000, // Cache por 5 min
    cacheTime: 10 * 60 * 1000, // Manter por 10 min
    keepPreviousData: true
  });

  // Memoizar lista filtrada
  const filteredProcesses = useMemo(() => {
    return processes.slice(0, PAGE_SIZE);
  }, [processes]);

  // Callback otimizado para seleção
  const handleSelectProcess = useCallback((id) => {
    setSelectedId(id);
  }, []);

  // Callback otimizado para próxima página
  const handleNextPage = useCallback(() => {
    setPage(p => p + 1);
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Lista virtualized */}
      <div className="lg:col-span-2 space-y-3 max-h-[600px] overflow-y-auto">
        {isLoading ? (
          <div className="flex justify-center p-6">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : (
          <>
            <Suspense fallback={<div>Carregando...</div>}>
              {filteredProcesses.map(proc => (
                <ProcessCard
                  key={proc.id}
                  process={proc}
                  isSelected={selectedId === proc.id}
                  onSelect={handleSelectProcess}
                />
              ))}
            </Suspense>

            {filteredProcesses.length > 0 && (
              <button
                onClick={handleNextPage}
                disabled={isFetchingNextPage}
                className="w-full py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded transition-colors disabled:opacity-50"
              >
                {isFetchingNextPage ? 'Carregando...' : 'Carregar mais'}
              </button>
            )}
          </>
        )}
      </div>

      {/* Detalhe do lado */}
      {selectedId && (
        <div className="lg:col-span-1">
          <Suspense fallback={<div>Carregando detalhes...</div>}>
            <ProcessDetailPanel processId={selectedId} />
          </Suspense>
        </div>
      )}
    </div>
  );
};

export default React.memo(ProcessListOptimized);