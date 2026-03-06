import React from 'react';
import { Loader } from 'lucide-react';

export default function LoadingSpinner({ 
  isLoading, 
  message = 'Carregando...', 
  size = 'medium',
  fullScreen = false 
}) {
  if (!isLoading) return null;

  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  };

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-slate-800 rounded-lg p-8 flex flex-col items-center gap-4">
          <Loader className={`${sizeClasses[size]} animate-spin text-blue-600`} />
          <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-3 py-6">
      <Loader className={`${sizeClasses[size]} animate-spin text-blue-600`} />
      <p className="text-sm text-gray-600 dark:text-gray-400">{message}</p>
    </div>
  );
}