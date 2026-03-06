import React from 'react';

export default function ResponsiveContainer({ children, className = '' }) {
  return (
    <div className={`
      w-full
      px-4 md:px-6 lg:px-8
      py-4 md:py-6
      max-w-full lg:max-w-7xl
      mx-auto
      ${className}
    `}>
      {children}
    </div>
  );
}