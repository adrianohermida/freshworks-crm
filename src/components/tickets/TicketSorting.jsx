import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TicketSorting({ sortField, sortDir, onSort }) {
  const handleSort = (field) => {
    if (sortField === field) {
      // Toggle direction
      onSort({ field, direction: sortDir === 'asc' ? 'desc' : 'asc' });
    } else {
      // New field, default to descending
      onSort({ field, direction: 'desc' });
    }
  };

  const SortButton = ({ field, label }) => {
    const isActive = sortField === field;
    const Icon = isActive && sortDir === 'asc' ? ChevronUp : ChevronDown;

    return (
      <Button
        variant={isActive ? 'default' : 'ghost'}
        size="sm"
        onClick={() => handleSort(field)}
        className={`gap-1 ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
      >
        {label}
        {isActive && <Icon className="w-4 h-4" />}
      </Button>
    );
  };

  return (
    <div className="flex gap-2 flex-wrap">
      <span className="text-sm text-muted-foreground self-center">Ordenar por:</span>
      <SortButton field="created_date" label="Data" />
      <SortButton field="priority" label="Prioridade" />
      <SortButton field="status" label="Status" />
      <SortButton field="updated_date" label="Última Atualização" />
    </div>
  );
}