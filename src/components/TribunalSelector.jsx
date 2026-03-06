import React, { useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { TRIBUNAIS, agruparTribunaisPorCategoria } from '../functions/utils/tribunaisData';

const CATEGORIA_LABELS = {
  superior: '🏛️ Tribunais Superiores',
  federal: '⚖️ Justiça Federal',
  estadual: '📋 Justiça Estadual',
  trabalho: '💼 Justiça do Trabalho',
  eleitoral: '🗳️ Justiça Eleitoral',
  militar: '🎖️ Justiça Militar'
};

export default function TribunalSelector({ value, onChange, label = 'Selecione um Tribunal' }) {
  const tribunaisPorCategoria = useMemo(() => agruparTribunaisPorCategoria(), []);
  const selectedTribunal = useMemo(() => {
    if (!value || !tribunaisPorCategoria) return null;
    for (const tribunais of Object.values(tribunaisPorCategoria)) {
      const found = tribunais.find(t => t.alias === value);
      if (found) return found;
    }
    return null;
  }, [value, tribunaisPorCategoria]);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Tribunal
      </label>
      <Select value={value || ''} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={label} />
        </SelectTrigger>
        <SelectContent>
          {Object.entries(tribunaisPorCategoria).map(([categoria, tribunais]) => (
            <optgroup key={categoria} label={CATEGORIA_LABELS[categoria]}>
              {tribunais.map(tribunal => (
                <SelectItem key={tribunal.alias} value={tribunal.alias}>
                  {tribunal.nome} {tribunal.regiao ? `(${tribunal.regiao})` : ''}
                </SelectItem>
              ))}
            </optgroup>
          ))}
        </SelectContent>
      </Select>

      {selectedTribunal && (
        <Card className="p-3 bg-cyan-50 dark:bg-cyan-900 border-cyan-200">
          <div className="text-xs space-y-1">
            <p className="font-semibold text-cyan-900 dark:text-cyan-100">
              {selectedTribunal.nome}
            </p>
            <p className="text-cyan-700 dark:text-cyan-200">
              {CATEGORIA_LABELS[selectedTribunal.categoria]}
            </p>
            <p className="text-cyan-600 dark:text-cyan-300 font-mono">
              {selectedTribunal.alias}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
}