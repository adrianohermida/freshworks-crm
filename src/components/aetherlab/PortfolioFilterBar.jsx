import React, { useState } from 'react';
import PortfolioFilterButton from './PortfolioFilterButton';

export default function PortfolioFilterBar({ 
  filters = [],
  onFilterChange,
  defaultActive = 0
}) {
  const [activeFilter, setActiveFilter] = useState(defaultActive);

  const handleFilterClick = (idx, value) => {
    setActiveFilter(idx);
    onFilterChange?.(value);
  };

  if (filters.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-0 sm:gap-2.5">
      {filters.map((filter, idx) => (
        <PortfolioFilterButton
          key={idx}
          label={filter.label || filter}
          active={idx === activeFilter}
          onClick={() => handleFilterClick(idx, filter.value || filter)}
        />
      ))}
    </div>
  );
}