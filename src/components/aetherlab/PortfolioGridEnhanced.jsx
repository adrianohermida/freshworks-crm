import React, { useState, useMemo } from 'react';
import PortfolioFilterBar from './PortfolioFilterBar';
import PortfolioItemCard from './PortfolioItemCard';
import SectionTitle from './SectionTitle';

export default function PortfolioGridEnhanced({ 
  title,
  subtitle,
  description,
  items = [],
  filters = [],
  columns = 3,
  onItemClick
}) {
  const [activeFilter, setActiveFilter] = useState(null);

  // Filter items based on selected category
  const filteredItems = useMemo(() => {
    if (!activeFilter || activeFilter === 'all') return items;
    return items.filter(item => item.category === activeFilter);
  }, [items, activeFilter]);

  const columnClasses = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4',
  };

  return (
    <section className="py-20 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        {(title || subtitle || description) && (
          <div className="mb-16">
            <SectionTitle
              subtitle={subtitle}
              title={title}
              description={description}
              centered
            />
          </div>
        )}

        {/* Filter Buttons */}
        {filters.length > 0 && (
          <div className="mb-20 md:mb-16 sm:mb-12">
            <PortfolioFilterBar
              filters={filters}
              onFilterChange={setActiveFilter}
            />
          </div>
        )}

        {/* Portfolio Grid */}
        <div className={`grid grid-cols-1 gap-8 mt-20 md:mt-16 sm:mt-10 ${columnClasses[columns] || columnClasses[3]}`}>
          {filteredItems.length > 0 ? (
            filteredItems.map((item, idx) => (
              <PortfolioItemCard
                key={idx}
                image={item.image}
                title={item.title}
                category={item.category}
                link={item.link}
                onClick={() => onItemClick?.(idx, item)}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                Nenhum projeto encontrado nesta categoria.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}