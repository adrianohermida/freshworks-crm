/**
 * ProcessoFilters - Filtros de busca/status/tipo/tribunal para o módulo
 */
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

const TRIBUNAIS = ['TJSP','TJRJ','TJMG','TJRS','TJPR','TJSC','TJBA','TJPE','TJCE','TJGO','TJMA','TJMT','TJMS','TJPA','TJPB','TJPI','TJRN','TJRO','TJRR','TJSE','TJTO','TJAC','TJAL','TJAM','TJAP','TJES','TJDFT','TRF1','TRF2','TRF3','TRF4','TRF5','TST','STJ','STF'];

const DEFAULT_FILTERS = { search: '', status: 'todos', tipo: 'todos', tribunal: '' };

export default function ProcessoFilters({ filters, onChange }) {
  const hasActive = filters.search || filters.status !== 'todos' || filters.tipo !== 'todos' || filters.tribunal;

  function set(key, val) {
    onChange({ ...filters, [key]: val });
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <div className="relative">
        <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <Input
          placeholder="Buscar processo..."
          value={filters.search}
          onChange={e => set('search', e.target.value)}
          className="pl-8 w-56 h-9 text-sm"
        />
      </div>

      <Select value={filters.status} onValueChange={v => set('status', v)}>
        <SelectTrigger className="w-36 h-9 text-sm">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos status</SelectItem>
          <SelectItem value="aberto">Aberto</SelectItem>
          <SelectItem value="em_audiencia">Em Audiência</SelectItem>
          <SelectItem value="acordo">Acordo</SelectItem>
          <SelectItem value="finalizado">Finalizado</SelectItem>
          <SelectItem value="cancelado">Cancelado</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.tipo} onValueChange={v => set('tipo', v)}>
        <SelectTrigger className="w-32 h-9 text-sm">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos tipos</SelectItem>
          <SelectItem value="cejusc">CEJUSC</SelectItem>
          <SelectItem value="procon">PROCON</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filters.tribunal || ''} onValueChange={v => set('tribunal', v)}>
        <SelectTrigger className="w-32 h-9 text-sm">
          <SelectValue placeholder="Tribunal" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={null}>Todos tribunais</SelectItem>
          {TRIBUNAIS.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
        </SelectContent>
      </Select>

      {hasActive && (
        <Button
          variant="ghost"
          size="sm"
          className="h-9 text-xs text-slate-500 gap-1"
          onClick={() => onChange({ ...DEFAULT_FILTERS })}
        >
          <X className="w-3.5 h-3.5" /> Limpar
        </Button>
      )}
    </div>
  );
}