import React from 'react';
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

const movementTypeColors = {
  'decisão': { bg: 'bg-blue-100', text: 'text-blue-800', icon: CheckCircle2 },
  'audiência': { bg: 'bg-purple-100', text: 'text-purple-800', icon: Clock },
  'publicação': { bg: 'bg-amber-100', text: 'text-amber-800', icon: AlertCircle },
  'default': { bg: 'bg-gray-100', text: 'text-gray-800', icon: Clock }
};

export default function MovementTimeline({ movements, isLoading }) {
  if (isLoading) {
    return (
      <Card className="p-4">
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-200 animate-pulse rounded" />
          ))}
        </div>
      </Card>
    );
  }

  if (!movements || movements.length === 0) {
    return (
      <Card className="p-4 text-center text-gray-500">
        <p>Nenhum movimento registrado</p>
      </Card>
    );
  }

  const sortedMovements = [...movements].sort(
    (a, b) => new Date(b.movement_date) - new Date(a.movement_date)
  );

  return (
    <div className="space-y-0" role="list" aria-label="Histórico de movimentos">
      {sortedMovements.map((movement, index) => {
        const typeKey = movement.movement_type?.toLowerCase() || 'default';
        const colorConfig = movementTypeColors[typeKey] || movementTypeColors.default;
        const TypeIcon = colorConfig.icon;

        return (
          <div key={movement.id} className="flex gap-4 pb-4 relative" role="listitem">
            {/* Timeline line */}
            {index < sortedMovements.length - 1 && (
              <div className="absolute left-4 top-10 w-0.5 h-8 bg-gray-200 dark:bg-gray-600" aria-hidden="true" />
            )}

            {/* Timeline dot */}
            <div 
              className={`flex-shrink-0 w-8 h-8 rounded-full ${colorConfig.bg} flex items-center justify-center mt-0.5 relative z-10`}
              aria-label={movement.movement_type}
            >
              <TypeIcon className={`w-4 h-4 ${colorConfig.text}`} />
            </div>

            {/* Content */}
            <div className="flex-1 pt-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <Badge className={`${colorConfig.bg} ${colorConfig.text} text-xs`}>
                  {movement.movement_type || 'Movimento'}
                </Badge>
                <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  {format(new Date(movement.movement_date), 'dd MMM yyyy', { locale: ptBR })}
                </span>
              </div>
              <p className="text-xs md:text-sm mt-1 text-gray-700 dark:text-gray-300 leading-relaxed break-words">
                {movement.description}
              </p>
              {movement.status === 'pending' && (
                <span className="text-xs text-amber-600 dark:text-amber-400 mt-1 inline-block">
                  ⚠ Pendente de notificação
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}