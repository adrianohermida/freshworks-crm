import React from 'react';
import { Trash2, Edit, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import PublicationBadge from './PublicationBadge';

export default function PublicationCard({
  publication,
  onEdit,
  onDelete,
  isLoading = false
}) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow">
      {/* HEADER */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
            {publication.title}
          </h3>
          {publication.publication_number && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Nº {publication.publication_number}
            </p>
          )}
        </div>
        <PublicationBadge status={publication.status} />
      </div>

      {/* DATE */}
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {format(new Date(publication.publication_date), 'd MMM yyyy', { locale: ptBR })}
      </p>

      {/* DJ */}
      {publication.dj && (
        <div className="mb-3">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-cyan-100 dark:bg-cyan-900 text-cyan-800 dark:text-cyan-200">
            {publication.dj}
          </span>
        </div>
      )}

      {/* CONTENT */}
      {publication.content && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
          {publication.content}
        </p>
      )}

      {/* ACTIONS */}
      <div className="flex gap-2 pt-3 border-t border-gray-100 dark:border-gray-700">
        {publication.document_url && (
          <Button
            size="sm"
            variant="ghost"
            onClick={() => window.open(publication.document_url, '_blank')}
            disabled={isLoading}
            className="flex-1 gap-2"
            aria-label="Abrir documento original"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="hidden sm:inline">Abrir</span>
          </Button>
        )}
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onEdit(publication)}
          disabled={isLoading}
          aria-label={`Editar ${publication.title}`}
        >
          <Edit className="w-4 h-4" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDelete(publication.id)}
          disabled={isLoading}
          className="text-red-600 hover:text-red-700 dark:text-red-400"
          aria-label={`Deletar ${publication.title}`}
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}