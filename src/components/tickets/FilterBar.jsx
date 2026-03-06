import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export default function FilterBar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  onAdvancedSearch,
  selectedCount,
  onToggleSelectAll,
  filteredCount
}) {
  return (
    <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6 items-start md:items-center">
      {onAdvancedSearch && (
        <Button
          size="sm"
          variant="outline"
          onClick={onAdvancedSearch}
          className="text-xs"
        >
          Busca Avançada
        </Button>
      )}
      {selectedCount > 0 && (
        <Button
          size="sm"
          variant="outline"
          onClick={onToggleSelectAll}
          className="text-xs"
        >
          {selectedCount === filteredCount ? 'Desselecionar Todos' : 'Selecionar Todos'}
        </Button>
      )}
      <Input
        placeholder="Buscar por assunto ou cliente..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1"
        aria-label="Buscar tickets"
      />
      <Select value={statusFilter} onValueChange={onStatusChange}>
        <SelectTrigger className="w-full md:w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os Status</SelectItem>
          <SelectItem value="open">Aberto</SelectItem>
          <SelectItem value="pending">Pendente</SelectItem>
          <SelectItem value="resolved">Resolvido</SelectItem>
          <SelectItem value="closed">Fechado</SelectItem>
        </SelectContent>
      </Select>
      <Select value={priorityFilter} onValueChange={onPriorityChange}>
        <SelectTrigger className="w-full md:w-40">
          <SelectValue placeholder="Prioridade" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as Prioridades</SelectItem>
          <SelectItem value="low">Baixa</SelectItem>
          <SelectItem value="medium">Média</SelectItem>
          <SelectItem value="high">Alta</SelectItem>
          <SelectItem value="urgent">Urgente</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}