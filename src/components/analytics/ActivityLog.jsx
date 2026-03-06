import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Activity, CheckCircle2, AlertCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

const eventIcons = {
  process_created: Activity,
  process_synced: Activity,
  deadline_completed: CheckCircle2,
  deadline_overdue: AlertCircle,
  endpoint_tested: Clock
};

const eventColors = {
  success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
};

export default function ActivityLog({ events = [], isLoading = false }) {
  const [page, setPage] = useState(0);
  const itemsPerPage = 10;

  const paginatedEvents = useMemo(() => {
    const start = page * itemsPerPage;
    const end = start + itemsPerPage;
    return events.slice(start, end);
  }, [events, page]);

  const totalPages = Math.ceil((events?.length || 0) / itemsPerPage);

  if (isLoading) {
    return (
      <Card className="p-6 dark:bg-gray-800">
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 animate-pulse rounded" />
          ))}
        </div>
      </Card>
    );
  }

  if (!events || events.length === 0) {
    return (
      <Card className="p-6 dark:bg-gray-800 text-center text-gray-600 dark:text-gray-400">
        Nenhuma atividade registrada
      </Card>
    );
  }

  return (
    <Card className="p-6 dark:bg-gray-800">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Atividades Recentes ({events.length} total)
        </h3>
        <span className="text-xs text-gray-600 dark:text-gray-400">
          Página {page + 1} de {totalPages}
        </span>
      </div>

      <div className="space-y-4">
        {paginatedEvents.map((event, idx) => {
          const IconComponent = eventIcons[event.event_type] || Activity;
          const colorClass = eventColors[event.status] || eventColors.success;

          return (
            <div key={idx} className="flex gap-4 pb-4 border-b border-gray-200 dark:border-gray-700 last:border-0">
              {/* Icon */}
              <div className="flex-shrink-0 mt-1">
                <IconComponent className="w-5 h-5 text-gray-400" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {event.action || event.event_type}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {event.entity_type} {event.entity_id && `(${event.entity_id.slice(0, 8)}...)`}
                    </p>
                  </div>
                  <Badge className={colorClass}>
                    {event.status}
                  </Badge>
                </div>

                {/* Timestamp */}
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                  {format(new Date(event.timestamp), 'PPpp', { locale: ptBR })}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="gap-2 dark:bg-gray-700 dark:border-gray-600"
          >
            <ChevronLeft className="w-4 h-4" />
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="gap-2 dark:bg-gray-700 dark:border-gray-600"
          >
            Próxima
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      )}
    </Card>
  );
}