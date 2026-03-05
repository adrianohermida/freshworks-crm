import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Filter, X } from 'lucide-react';

/**
 * Advanced Process Filter - Filtros avançados com múltiplas opções
 * Status, tribunal, data range, priority, movement count
 */

export default function AdvancedProcessFilter({ onApply, onReset }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    tribunal: '',
    dateFrom: '',
    dateTo: '',
    movementCount: '',
    hasErrors: false,
    isSynced: true
  });

  const statusOptions = ['active', 'archived', 'paused', 'synchronized_error'];
  const tribunalOptions = ['TRF1', 'TJSP', 'TJDFT', 'TJRJ', 'TJMG'];

  const handleApply = () => {
    onApply(filters);
    setIsExpanded(false);
  };

  const handleReset = () => {
    setFilters({
      status: '',
      tribunal: '',
      dateFrom: '',
      dateTo: '',
      movementCount: '',
      hasErrors: false,
      isSynced: true
    });
    onReset();
  };

  const activeFilters = Object.values(filters).filter(v => v && v !== true).length;

  return (
    <div className="space-y-4">
      {/* Filter Button */}
      <Button
        variant="outline"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full dark:border-gray-600 dark:text-gray-300"
      >
        <Filter className="w-4 h-4 mr-2" />
        Filtros Avançados
        {activeFilters > 0 && (
          <span className="ml-2 bg-cyan-600 text-white rounded-full px-2 py-0.5 text-xs">
            {activeFilters} ativo
          </span>
        )}
      </Button>

      {/* Filter Panel */}
      {isExpanded && (
        <Card className="p-6 dark:bg-gray-800 space-y-6">
          {/* Status */}
          <div>
            <Label className="font-semibold mb-3 block">Status</Label>
            <Select value={filters.status} onValueChange={(v) => setFilters({...filters, status: v})}>
              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                <SelectValue placeholder="Todos os status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>Todos</SelectItem>
                {statusOptions.map(s => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Tribunal */}
          <div>
            <Label className="font-semibold mb-3 block">Tribunal</Label>
            <Select value={filters.tribunal} onValueChange={(v) => setFilters({...filters, tribunal: v})}>
              <SelectTrigger className="dark:bg-gray-700 dark:border-gray-600">
                <SelectValue placeholder="Todos os tribunais" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={null}>Todos</SelectItem>
                {tribunalOptions.map(t => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="font-semibold mb-3 block">De</Label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({...filters, dateFrom: e.target.value})}
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
            <div>
              <Label className="font-semibold mb-3 block">Até</Label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({...filters, dateTo: e.target.value})}
                className="dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
          </div>

          {/* Movement Count */}
          <div>
            <Label className="font-semibold mb-3 block">Movimentos Mínimos</Label>
            <Input
              type="number"
              min="0"
              placeholder="Ex: 5"
              value={filters.movementCount}
              onChange={(e) => setFilters({...filters, movementCount: e.target.value})}
              className="dark:bg-gray-700 dark:border-gray-600"
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Checkbox
                id="errors"
                checked={filters.hasErrors}
                onCheckedChange={(checked) => setFilters({...filters, hasErrors: checked})}
              />
              <Label htmlFor="errors" className="cursor-pointer">
                Apenas com erros de sincronização
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="synced"
                checked={filters.isSynced}
                onCheckedChange={(checked) => setFilters({...filters, isSynced: checked})}
              />
              <Label htmlFor="synced" className="cursor-pointer">
                Sincronizados nos últimos 7 dias
              </Label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onClick={handleReset}
              className="flex-1 dark:border-gray-600"
            >
              <X className="w-4 h-4 mr-2" />
              Limpar
            </Button>
            <Button
              onClick={handleApply}
              className="flex-1 bg-cyan-600 hover:bg-cyan-700"
            >
              Aplicar Filtros
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}