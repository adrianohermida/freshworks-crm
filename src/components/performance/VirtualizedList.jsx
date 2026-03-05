import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';

/**
 * Virtualized List para rendering eficiente de listas grandes
 * Renderiza apenas items visíveis + buffer
 */

export default function VirtualizedList({
  items = [],
  itemHeight = 60,
  height = 400,
  width = '100%',
  renderItem,
  overscanCount = 5
}) {
  const Row = ({ index, style }) => (
    <div style={style} className="px-4 py-2">
      {renderItem(items[index], index)}
    </div>
  );

  return (
    <List
      height={height}
      itemCount={items.length}
      itemSize={itemHeight}
      width={width}
      overscanCount={overscanCount}
    >
      {Row}
    </List>
  );
}

/**
 * Hook para pagination + virtualization
 */
export function useVirtualizedPagination(allItems, pageSize = 50) {
  const [currentPage, setCurrentPage] = React.useState(0);

  const paginatedItems = useMemo(() => {
    const start = currentPage * pageSize;
    return allItems.slice(start, start + pageSize);
  }, [allItems, currentPage, pageSize]);

  const totalPages = Math.ceil(allItems.length / pageSize);

  return {
    items: paginatedItems,
    currentPage,
    totalPages,
    goToPage: setCurrentPage,
    nextPage: () => setCurrentPage(p => Math.min(p + 1, totalPages - 1)),
    prevPage: () => setCurrentPage(p => Math.max(p - 1, 0))
  };
}