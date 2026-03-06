import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter, X } from 'lucide-react';
import { format, subDays } from 'date-fns';

export default function AdvancedSearch({ tickets, onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState({
    searchText: '',
    dateFrom: '',
    dateTo: '',
    category: '',
    tags: '',
    assignedAgent: ''
  });

  const agents = [...new Set(tickets.map(t => t.assigned_agent_name).filter(Boolean))];
  const categories = [...new Set(tickets.map(t => t.category).filter(Boolean))];
  const allTags = [...new Set(tickets.flatMap(t => t.tags || []))];

  const handleApplyFilters = () => {
    const filtered = tickets.filter(ticket => {
      // Text search
      if (filters.searchText) {
        const search = filters.searchText.toLowerCase();
        if (!ticket.subject.toLowerCase().includes(search) &&
            !ticket.description?.toLowerCase().includes(search) &&
            !ticket.customer_name?.toLowerCase().includes(search)) {
          return false;
        }
      }

      // Date range
      if (filters.dateFrom) {
        const createdDate = new Date(ticket.created_date);
        if (createdDate < new Date(filters.dateFrom)) return false;
      }
      if (filters.dateTo) {
        const createdDate = new Date(ticket.created_date);
        if (createdDate > new Date(filters.dateTo)) return false;
      }

      // Category
      if (filters.category && ticket.category !== filters.category) return false;

      // Tags
      if (filters.tags) {
        const selectedTags = filters.tags.split(',').map(t => t.trim());
        if (!selectedTags.some(tag => ticket.tags?.includes(tag))) return false;
      }

      // Agent
      if (filters.assignedAgent && ticket.assigned_agent_name !== filters.assignedAgent) return false;

      return true;
    });

    onFilterChange(filtered);
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    setFilters({
      searchText: '',
      dateFrom: '',
      dateTo: '',
      category: '',
      tags: '',
      assignedAgent: ''
    });
    onFilterChange(tickets);
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className="relative">
      <Button
        variant="outline"
        className="gap-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Filter className="w-4 h-4" />
        Busca Avançada
        {hasActiveFilters && <span className="ml-1 text-xs bg-turquoise-600 text-white px-2 py-0.5 rounded">Ativo</span>}
      </Button>

      {isOpen && (
        <Card className="absolute top-full mt-2 right-0 w-96 z-50 shadow-xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Filtros Avançados</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Text Search */}
            <div>
              <label className="text-sm font-medium">Buscar em assunto/descrição</label>
              <Input
                placeholder="Digite aqui..."
                value={filters.searchText}
                onChange={(e) => setFilters({ ...filters, searchText: e.target.value })}
                className="mt-1"
              />
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-sm font-medium">De</label>
                <Input
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Até</label>
                <Input
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>

            {/* Category */}
            {categories.length > 0 && (
              <div>
                <label className="text-sm font-medium">Categoria</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="">Todas</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Agent */}
            {agents.length > 0 && (
              <div>
                <label className="text-sm font-medium">Agente</label>
                <select
                  value={filters.assignedAgent}
                  onChange={(e) => setFilters({ ...filters, assignedAgent: e.target.value })}
                  className="w-full mt-1 px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="">Todos</option>
                  {agents.map(agent => (
                    <option key={agent} value={agent}>{agent}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Tags */}
            {allTags.length > 0 && (
              <div>
                <label className="text-sm font-medium">Tags</label>
                <Input
                  placeholder="Separadas por vírgula"
                  value={filters.tags}
                  onChange={(e) => setFilters({ ...filters, tags: e.target.value })}
                  className="mt-1"
                />
                <div className="flex flex-wrap gap-1 mt-2">
                  {allTags.slice(0, 5).map(tag => (
                    <button
                      key={tag}
                      onClick={() => {
                        const tags = filters.tags.split(',').map(t => t.trim());
                        if (tags.includes(tag)) {
                          setFilters({ ...filters, tags: tags.filter(t => t !== tag).join(', ') });
                        } else {
                          setFilters({ ...filters, tags: [...tags, tag].filter(Boolean).join(', ') });
                        }
                      }}
                      className={`text-xs px-2 py-1 rounded transition-colors ${
                        filters.tags.includes(tag)
                          ? 'bg-turquoise-600 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-2 pt-2">
              <Button onClick={handleApplyFilters} className="flex-1 bg-turquoise-600 hover:bg-turquoise-700">
                Filtrar
              </Button>
              {hasActiveFilters && (
                <Button onClick={handleClearFilters} variant="outline" className="flex-1">
                  Limpar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}