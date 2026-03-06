import React from 'react';

export default function ErrorCard({ 
  code,
  title,
  description,
  children,
  className = ''
}) {
  return (
    <div className={`inline-block px-16 py-20 md:px-12 md:py-16 sm:px-10 sm:py-12 bg-white rounded-2xl ${className}`}>
      
      {/* Error Code */}
      {code && (
        <h1 className="text-9xl md:text-7xl sm:text-6xl font-black text-[#7e57ff] mb-6 leading-tight">
          {code}
        </h1>
      )}

      {/* Title */}
      {title && (
        <h2 className="text-2xl md:text-xl sm:text-lg font-bold text-gray-900 mb-3 leading-relaxed">
          {title}
        </h2>
      )}

      {/* Description */}
      {description && (
        <p className="text-gray-600 font-normal mb-10">
          {description}
        </p>
      )}

      {/* Children (buttons, etc) */}
      {children}
    </div>
  );
}