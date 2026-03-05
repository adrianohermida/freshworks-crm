import React, { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import PublicationCard from './PublicationCard';

export default function PublicationList({
  publications = [],
  isLoading = false,
  onEdit,
  onDelete,
  filters = { status: 'all' }
}) {
  const filteredPublications = useMemo(() => {
    return publications
      .filter((p) => filters.status === 'all' || p.status === filters.status)
      .sort((a, b) => new Date(b.publication_date) - new Date(a.publication_date));
  }, [publications, filters]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-48" />
        ))}
      </div>
    );
  }

  if (filteredPublications.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Nenhuma publicação encontrada</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {filteredPublications.map((publication) => (
        <PublicationCard
          key={publication.id}
          publication={publication}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}