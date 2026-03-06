import React from 'react';
import { ChevronRight } from 'lucide-react';

export default function BreadcrumbNav({ 
  items = [],
  className = ''
}) {
  if (items.length === 0) return null;

  return (
    <section className={`relative pt-40 pb-32 md:pt-28 md:pb-16 sm:pt-28 sm:pb-12 z-10 text-left bg-[#081828] bg-cover bg-right bg-no-repeat ${className}`}
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1557821552-17105176677c?w=1200&h=400&fit=crop')",
      }}>
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/70 z-0"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-3xl md:text-2xl sm:text-xl font-bold text-white capitalize mb-4">
          {items[items.length - 1]?.label || 'Page'}
        </h1>

        {/* Breadcrumb Navigation */}
        <nav className="flex justify-center gap-0 mt-4 sm:mt-4 flex-wrap">
          {items.map((item, idx) => (
            <div key={idx} className="flex items-center">
              {item.href ? (
                <a 
                  href={item.href}
                  className="text-white text-sm font-medium capitalize hover:text-gray-300 transition-colors"
                >
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                </a>
              ) : (
                <span className="text-white text-sm font-medium capitalize">
                  {item.icon && <span className="mr-1">{item.icon}</span>}
                  {item.label}
                </span>
              )}
              
              {idx < items.length - 1 && (
                <ChevronRight className="w-4 h-4 text-white mx-3" />
              )}
            </div>
          ))}
        </nav>
      </div>
    </section>
  );
}