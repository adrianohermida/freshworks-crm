import React from 'react';
import { ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const STATUS_OPTIONS = [
  { value: 'aberto', label: 'Aberto' },
  { value: 'em_audiencia', label: 'Em Audiência' },
  { value: 'acordo', label: 'Acordo' },
  { value: 'finalizado', label: 'Finalizado' },
  { value: 'cancelado', label: 'Cancelado' },
];

const TIPO_OPTIONS = [
  { value: 'cejusc', label: 'CEJUSC' },
  { value: 'procon', label: 'Procon' },
  { value: 'judicial_estadual', label: 'Judicial Estadual' },
  { value: 'judicial_federal', label: 'Judicial Federal' },
];

const TRIBUNAL_OPTIONS = [
  { value: 'tjsp', label: 'TJSP' },
  { value: 'tjrj', label: 'TJRJ' },
  { value: 'trf1', label: 'TRF1' },
  { value: 'trf2', label: 'TRF2' },
  { value: 'stj', label: 'STJ' },
  { value: 'stf', label: 'STF' },
];

export default function FiltrosAvancadosProcessos({ filters, onFilterChange, isOpen = false, onToggle }) {
  const handleFilterChange = (key, value) => {
    onFilterChange({
      ...filters,
      [key]: value === filters[key] ? '' : value,
    });
  };

  const handleClear = () => {
    onFilterChange({ status: 'todos', tipo: 'todos', tribunal: '' });
  };

  const activeCount = Object.values(filters).filter(v => v && v !== 'todos').length;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full bg-gradient-to-r from-[#212373] to-[#353782] px-4 py-3 flex items-center justify-between hover:from-[#1a1b5e] hover:to-[#2a2b6a] transition"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-white">Filtros Avançados</span>
          {activeCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-[#00d9a3] text-[#1f2749] text-xs font-bold">
              {activeCount}
            </span>
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-white transition ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="px-4 py-3 space-y-3 border-t border-slate-200">
          {/* Status */}
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-1.5">Status</p>
            <div className="flex flex-wrap gap-1.5">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleFilterChange('status', opt.value)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                    filters.status === opt.value
                      ? 'bg-[#00d9a3] text-[#1f2749]'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tipo */}
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-1.5">Tipo de Processo</p>
            <div className="flex flex-wrap gap-1.5">
              {TIPO_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleFilterChange('tipo', opt.value)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                    filters.tipo === opt.value
                      ? 'bg-[#00d9a3] text-[#1f2749]'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tribunal */}
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-1.5">Tribunal</p>
            <div className="flex flex-wrap gap-1.5">
              {TRIBUNAL_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleFilterChange('tribunal', opt.value)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition ${
                    filters.tribunal === opt.value
                      ? 'bg-[#00d9a3] text-[#1f2749]'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Button */}
          {activeCount > 0 && (
            <Button size="sm" variant="outline" className="w-full text-xs" onClick={handleClear}>
              <X className="w-3 h-3 mr-1" /> Limpar Filtros
            </Button>
          )}
        </div>
      )}
    </div>
  );
}