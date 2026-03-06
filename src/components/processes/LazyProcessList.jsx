import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useIntersectionObserver } from '@/components/hooks/useIntersectionObserver';
import ProcessCard from './ProcessCard';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

/**
 * Lazy Process List - Carrega processes em chunks infinitos
 * Reduz memory footprint e melhora performance inicial
 */

export default function LazyProcessList({ processes = [], isLoading, onLoadMore, hasMore }) {
  const [displayedCount, setDisplayedCount] = useState(20);
  const loadMoreRef = useRef(null);
  const { isVisible } = useIntersectionObserver(loadMoreRef);

  // Trigger load mais quando atinge bottom
  useEffect(() => {
    if (isVisible && hasMore && !isLoading) {
      setDisplayedCount(prev => Math.min(prev + 20, processes.length));
      onLoadMore?.();
    }
  }, [isVisible, hasMore, isLoading, onLoadMore, processes.length]);

  const displayedProcesses = processes.slice(0, displayedCount);

  if (processes.length === 0 && !isLoading) {
    return (
      <div className="py-12 text-center text-gray-600 dark:text-gray-400">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
        <p>Nenhum processo encontrado</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Rendered items */}
      {displayedProcesses.map(process => (
        <ProcessCard key={process.id} process={process} />
      ))}

      {/* Loading skeleton */}
      {isLoading && (
        <>
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </>
      )}

      {/* Load more trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="py-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {isLoading ? 'Carregando mais...' : 'Scroll para carregar mais'}
          </p>
        </div>
      )}

      {/* End of list */}
      {!hasMore && displayedCount > 0 && (
        <div className="py-4 text-center text-sm text-gray-600 dark:text-gray-400">
          ✅ {displayedCount} de {processes.length} processes carregados
        </div>
      )}
    </div>
  );
}