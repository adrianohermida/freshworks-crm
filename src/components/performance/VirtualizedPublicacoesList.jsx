import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { AlertCircle, Loader2 } from 'lucide-react';

/**
 * Virtualized List — 1M+ Publicações
 * Renderiza apenas itens visíveis (~50 por janela)
 */

const ITEM_HEIGHT = 60;
const BUFFER_SIZE = 10;
const ITEMS_PER_WINDOW = 50;

export default function VirtualizedPublicacoesList() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [scrollOffset, setScrollOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState('');

  // Carregar dados com cursor-based pagination
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        limit: ITEMS_PER_WINDOW,
        ...(cursor && { cursor }),
        ...(search && { search }),
        ...(status && { status })
      });

      const { data } = await base44.functions.invoke('getPublicacoesWithCursor', {
        ...Object.fromEntries(params)
      });

      if (data.data.length > 0) {
        setItems(prev => [...prev, ...data.data]);
        setCursor(data.pagination.cursor);
        setHasMore(data.pagination.hasMore);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [cursor, search, status, loading, hasMore]);

  // Resetar ao mudar filtros
  const handleSearchChange = useCallback((value) => {
    setSearch(value);
    setItems([]);
    setCursor('');
    setScrollOffset(0);
    setHasMore(true);
  }, []);

  // Calcular itens visíveis
  const visibleRange = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollOffset / ITEM_HEIGHT) - BUFFER_SIZE);
    const endIndex = Math.min(
      items.length,
      Math.ceil((scrollOffset + ITEMS_PER_WINDOW * ITEM_HEIGHT) / ITEM_HEIGHT) + BUFFER_SIZE
    );

    return { startIndex, endIndex };
  }, [scrollOffset, items.length]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.startIndex, visibleRange.endIndex).map((item, i) => ({
      ...item,
      displayIndex: visibleRange.startIndex + i
    }));
  }, [items, visibleRange]);

  // Infinite scroll trigger
  const handleScroll = useCallback((e) => {
    const element = e.target;
    const scrollPercentage = (element.scrollTop + element.clientHeight) / element.scrollHeight;

    setScrollOffset(element.scrollTop);

    if (scrollPercentage > 0.8 && hasMore && !loading) {
      loadMore();
    }
  }, [hasMore, loading, loadMore]);

  // Carregamento inicial
  useEffect(() => {
    if (items.length === 0 && !loading) {
      loadMore();
    }
  }, [items.length, loading, loadMore]);

  const totalHeight = items.length * ITEM_HEIGHT;
  const offsetY = visibleRange.startIndex * ITEM_HEIGHT;

  return (
    <div className="w-full h-full flex flex-col gap-4 p-4">
      {/* Search */}
      <div className="flex gap-2">
        <Input
          placeholder="Buscar publicações..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="flex-1"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 rounded-lg">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      {/* Virtualized Container */}
      <div
        className="flex-1 overflow-y-auto border rounded-lg bg-white"
        onScroll={handleScroll}
        style={{ height: '600px' }}
      >
        <div style={{ height: totalHeight, position: 'relative' }}>
          {/* Visible Items */}
          <div style={{ transform: `translateY(${offsetY}px)` }}>
            {visibleItems.map((item) => (
              <div
                key={item.id}
                className="border-b p-3 hover:bg-gray-50 transition-colors"
                style={{ height: ITEM_HEIGHT }}
              >
                <div className="flex gap-3 h-full">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold truncate text-sm">
                      {item.numeroProcesso}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      {item.municipio} • {item.vara}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(item.dataPublicacao).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  <div className="flex flex-col justify-between items-end">
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {item.statusSincronizacao}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div className="flex items-center justify-center py-4 text-gray-500">
            <Loader2 className="w-4 h-4 animate-spin mr-2" />
            Carregando...
          </div>
        )}

        {/* No More Data */}
        {!hasMore && items.length > 0 && (
          <div className="text-center py-4 text-gray-400 text-sm">
            Fim dos resultados ({items.length} total)
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="text-xs text-gray-500 flex justify-between">
        <span>Visíveis: {visibleItems.length}</span>
        <span>Total: {items.length}</span>
        <span>Scroll: {scrollOffset}px</span>
      </div>
    </div>
  );
}