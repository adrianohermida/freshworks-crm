import React from 'react';
import { AlertCircle } from 'lucide-react';

export function ErrorAlert({ error, onRetry }) {
  if (!error) return null;

  return (
    <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex gap-3">
      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <h3 className="font-semibold text-red-900 dark:text-red-300 text-sm mb-1">
          Erro ao processar
        </h3>
        <p className="text-sm text-red-700 dark:text-red-400 mb-2">
          {error.message || 'Um erro inesperado ocorreu'}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="text-sm px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Tentar novamente
          </button>
        )}
      </div>
    </div>
  );
}