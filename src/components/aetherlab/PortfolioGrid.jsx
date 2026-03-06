import React, { useState } from 'react';

export default function PortfolioGrid({ items = [], filters = [] }) {
  const [activeFilter, setActiveFilter] = useState('*');

  const filteredItems = activeFilter === '*' 
    ? items 
    : items.filter(item => item.category === activeFilter);

  return (
    <div className="space-y-8">
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => setActiveFilter('*')}
            className={`px-6 py-2 rounded-lg font-semibold transition ${
              activeFilter === '*'
                ? 'bg-[#7e57ff] text-white'
                : 'bg-white dark:bg-gray-800 text-[#081828] dark:text-white border border-[#e5e5e5] dark:border-gray-700 hover:border-[#7e57ff]'
            }`}
          >
            Todos
          </button>
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-6 py-2 rounded-lg font-semibold transition ${
                activeFilter === filter
                  ? 'bg-[#7e57ff] text-white'
                  : 'bg-white dark:bg-gray-800 text-[#081828] dark:text-white border border-[#e5e5e5] dark:border-gray-700 hover:border-[#7e57ff]'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item, idx) => (
          <div 
            key={idx}
            className="group relative overflow-hidden rounded-lg bg-gray-200 h-64"
          >
            {item.image && (
              <img 
                src={item.image} 
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
            )}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-center justify-center">
              <div className="text-white text-center opacity-0 group-hover:opacity-100 transition-opacity">
                <p className="text-sm text-[#7e57ff] font-semibold mb-2">
                  {item.category}
                </p>
                <h4 className="text-lg font-bold">
                  {item.title}
                </h4>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}