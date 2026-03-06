import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function PortfolioItemCard({ 
  image,
  title,
  category,
  link,
  onClick
}) {
  return (
    <div className="relative rounded-sm overflow-hidden mb-8 group cursor-pointer">
      
      {/* Image Container */}
      <div className="overflow-hidden rounded-sm">
        <img 
          src={image} 
          alt={title}
          className="w-full transition-transform duration-400 group-hover:scale-110"
        />
      </div>

      {/* Overlay - Bottom Left */}
      <div className="absolute bottom-4 left-4 bg-white rounded px-5 py-5 shadow-sm">
        <p className="text-xs text-gray-600 mb-1">{category}</p>
        <h4 className="text-base font-bold text-[#051441] dark:text-[#081828] leading-7 mb-4">
          {title}
        </h4>
        <a
          href={link || '#'}
          onClick={(e) => {
            e.preventDefault();
            onClick?.();
          }}
          className="inline-flex items-center gap-2 px-7 py-2 text-white bg-[#7e57ff] hover:bg-white hover:text-[#7e57ff] border-2 border-[#7e57ff] rounded transition-all duration-300 text-sm font-medium"
        >
          <span>Ver Projeto</span>
          <ArrowUpRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}