import React from 'react';
import { Loader } from 'lucide-react';
import TicketCard from './TicketCard';

export default function TicketGrid({
  tickets,
  isLoading,
  selectedIds,
  onToggleSelect,
  onAnalyze
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader className="w-8 h-8 animate-spin text-turquoise-600" />
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Nenhum ticket encontrado</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${selectedIds.size > 0 ? 'pb-24' : ''}`}>
      {tickets.map(ticket => (
        <div
          key={ticket.id}
          className={`cursor-pointer relative transition-all ${selectedIds.has(ticket.id) ? 'ring-2 ring-turquoise-500 rounded-lg' : ''}`}
          onClick={() => onToggleSelect(ticket.id)}
        >
          {selectedIds.has(ticket.id) && (
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-turquoise-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              ✓
            </div>
          )}
          <div onClick={(e) => e.stopPropagation()}>
            <TicketCard
              ticket={ticket}
              onAnalyze={(id) => onAnalyze(id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}