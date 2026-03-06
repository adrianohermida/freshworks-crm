import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

/**
 * Virtual scrolling list for large datasets
 * Renderiza apenas items visíveis na viewport
 */
export function VirtualTicketList({ 
  items = [], 
  itemHeight = 120, 
  renderItem,
  isLoading = false,
  onLoadMore 
}) {
  const containerRef = useRef(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver(() => {
      setContainerHeight(container.clientHeight);
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, []);

  const handleScroll = useCallback((e) => {
    const newScrollTop = e.target.scrollTop;
    setScrollTop(newScrollTop);

    // Load more quando scroll chega perto do final
    if (onLoadMore) {
      const scrollPercentage = (newScrollTop + containerHeight) / (items.length * itemHeight);
      if (scrollPercentage > 0.8) {
        onLoadMore();
      }
    }
  }, [containerHeight, items.length, itemHeight, onLoadMore]);

  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - 1);
  const endIndex = Math.min(items.length, Math.ceil((scrollTop + containerHeight) / itemHeight) + 1);
  const visibleItems = items.slice(startIndex, endIndex);

  const offsetY = startIndex * itemHeight;

  return (
    <div
      ref={containerRef}
      className="relative h-96 overflow-y-auto border rounded-lg dark:border-slate-700"
      onScroll={handleScroll}
      role="region"
      aria-label="Lista virtual de tickets"
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            willChange: 'transform'
          }}
        >
          {visibleItems.map((item, index) => (
            <div key={startIndex + index} style={{ height: itemHeight }}>
              {renderItem(item, startIndex + index)}
            </div>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
        </div>
      )}
    </div>
  );
}