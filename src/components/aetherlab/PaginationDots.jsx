import React from 'react';

export default function PaginationDots({ 
  total, 
  current = 0, 
  onChange,
  variant = 'bottom' // 'bottom' | 'inline'
}) {
  return (
    <div className={`flex justify-center gap-2 ${
      variant === 'bottom' ? 'mt-8' : ''
    }`}>
      {Array.from({ length: total }).map((_, idx) => (
        <button
          key={idx}
          onClick={() => onChange?.(idx)}
          className={`transition-all duration-400 rounded-sm ${
            idx === current
              ? 'w-7 h-1.5 bg-[#7e57ff]'
              : 'w-3.5 h-1.5 bg-[#081828] dark:bg-gray-400 hover:bg-[#7e57ff]'
          }`}
          aria-label={`Ir para item ${idx + 1}`}
          aria-current={idx === current ? 'true' : 'false'}
        />
      ))}
    </div>
  );
}