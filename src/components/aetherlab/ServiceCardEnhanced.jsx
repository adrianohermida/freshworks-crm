import React from 'react';

export default function ServiceCardEnhanced({ 
  icon: Icon,
  title,
  description,
  className = ''
}) {
  return (
    <div className={`min-h-80 mt-7 rounded-3xl bg-white shadow-md p-12 sm:p-10 text-center transition-all duration-400 border-t-[3px] border-b-[3px] border-transparent hover:scale-105 hover:border-t-[#7e57ff] hover:border-b-[#7e57ff] hover:shadow-lg group ${className}`}>
      
      {/* Icon */}
      {Icon && (
        <div className="w-16 h-16 bg-[#7e57ff] text-white rounded-md flex items-center justify-center text-2xl mx-auto group-hover:scale-110 transition-transform duration-400">
          {typeof Icon === 'function' ? <Icon className="w-7 h-7" /> : Icon}
        </div>
      )}

      {/* Title */}
      {title && (
        <h3 className="text-[#081828] dark:text-white text-lg sm:text-xl font-bold mt-7 mb-4 leading-7">
          {title}
        </h3>
      )}

      {/* Description */}
      {description && (
        <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-6">
          {description}
        </p>
      )}
    </div>
  );
}