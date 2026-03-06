import React, { useState } from 'react';
import TestimonialCard from './TestimonialCard';
import PaginationDots from './PaginationDots';

export default function TestimonialsSection({ 
  testimonials = [],
  title,
  subtitle,
  description,
  itemsPerView = 1,
  autoPlay = false,
  autoPlayInterval = 5000
}) {
  const [current, setCurrent] = useState(0);

  // Autoplay logic
  React.useEffect(() => {
    if (!autoPlay) return;
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % testimonials.length);
    }, autoPlayInterval);
    return () => clearInterval(timer);
  }, [autoPlay, autoPlayInterval, testimonials.length]);

  if (testimonials.length === 0) return null;

  // Para múltiplos itens, mostrar grid
  if (itemsPerView > 1) {
    return (
      <section className="bg-[#F4F7FA] dark:bg-gray-900 py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            {subtitle && (
              <p className="text-[#7e57ff] font-semibold text-sm uppercase tracking-wide mb-2">
                {subtitle}
              </p>
            )}
            {title && (
              <h2 className="text-3xl sm:text-4xl font-bold text-[#081828] dark:text-white mb-4">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {description}
              </p>
            )}
          </div>

          {/* Grid */}
          <div className={`grid grid-cols-1 ${
            itemsPerView === 2 ? 'md:grid-cols-2' : 'md:grid-cols-2 lg:grid-cols-3'
          } gap-8`}>
            {testimonials.map((testimonial, idx) => (
              <TestimonialCard
                key={idx}
                {...testimonial}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Para 1 item, mostrar carousel
  return (
    <section className="bg-[#F4F7FA] dark:bg-gray-900 py-20 px-6 relative pb-48 sm:pb-40">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          {subtitle && (
            <p className="text-[#7e57ff] font-semibold text-sm uppercase tracking-wide mb-2">
              {subtitle}
            </p>
          )}
          {title && (
            <h2 className="text-3xl sm:text-4xl font-bold text-[#081828] dark:text-white mb-4">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-gray-600 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>

        {/* Carousel */}
        <div className="relative">
          <TestimonialCard
            {...testimonials[current]}
            featured={true}
          />
        </div>

        {/* Pagination - Positioned Absolutely */}
        <div className="absolute bottom-12 left-0 right-0 flex justify-center z-20">
          <PaginationDots
            total={testimonials.length}
            current={current}
            onChange={setCurrent}
            variant="inline"
          />
        </div>
      </div>
    </section>
  );
}