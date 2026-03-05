import React from 'react';

export default function PageLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {(title || subtitle) && (
          <div className="mb-8">
            {title && (
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-slate-600 dark:text-slate-400">{subtitle}</p>
            )}
          </div>
        )}

        {/* Content */}
        {children}
      </div>
    </div>
  );
}