import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Save, Search } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const FIELDS_BY_ENTITY = {
  PublicacaoAdvise: ['numeroProcesso', 'municipio', 'vara', 'diario', 'lido', 'dataPublicacao'],
  IntimacaoAdvise: ['numeroProcesso', 'statusIntimacao', 'lido', 'fonte', 'dataIntimacao'],
  ProcessoAdvise: ['tribunal', 'statusProcesso', 'municipio', 'vara'],
  Ticket: ['status', 'prioridade', 'categoria', 'solicitanteEmail']
};

const OPERATORS = [
  { value: 'eq', label: '=' },
  { value: 'contains', label: 'contém' },
  { value: 'gte', label: '>=' },
  { value: 'lte', label: '<=' },
  { value: 'ne', label: '≠' }
];

export default function AdvancedFilterBuilder({ entityType = 'PublicacaoAdvise', onFiltersApplied }) {
  const [rules, setRules] = useState([{ field: '', operator: 'eq', value: '' }]);
  const [templateName, setTemplateName] = useState('');
  const [saving, setSaving] = useState(false);
  const [applying, setApplying] = useState(false);

  const fields = FIELDS_BY_ENTITY[entityType] || [];

  const addRule = () => setRules([...rules, { field: '', operator: 'eq', value: '' }]);
  const removeRule = (idx) => setRules(rules.filter((_, i) => i !== idx));
  const updateRule = (idx, key, val) => {
    const updated = [...rules];
    updated[idx] = { ...updated[idx], [key]: val };
    setRules(updated);
  };

  const applyFilters = async () => {
    setApplying(true);
    const validRules = rules.filter(r => r.field && r.value !== '');
    const res = await base44.functions.invoke('filters/advancedFilterEngine', {
      action: 'build_query',
      filters: validRules
    });
    setApplying(false);
    if (onFiltersApplied) onFiltersApplied(res.data?.query || {});
  };

  const saveTemplate = async () => {
    if (!templateName) return;
    setSaving(true);
    await base44.functions.invoke('filters/advancedFilterEngine', {
      action: 'save_template',
      templateName,
      entityType,
      filters: rules
    });
    setSaving(false);
    setTemplateName('');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Filtros Avançados
          <Badge variant="secondary">{entityType}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          {rules.map((rule, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <select
                className="border rounded px-2 py-1 text-sm flex-1"
                value={rule.field}
                onChange={e => updateRule(idx, 'field', e.target.value)}
              >
                <option value="">Campo...</option>
                {fields.map(f => <option key={f} value={f}>{f}</option>)}
              </select>
              <select
                className="border rounded px-2 py-1 text-sm w-24"
                value={rule.operator}
                onChange={e => updateRule(idx, 'operator', e.target.value)}
              >
                {OPERATORS.map(op => <option key={op.value} value={op.value}>{op.label}</option>)}
              </select>
              <input
                className="border rounded px-2 py-1 text-sm flex-1"
                placeholder="Valor..."
                value={rule.value}
                onChange={e => updateRule(idx, 'value', e.target.value)}
              />
              <Button variant="ghost" size="icon" onClick={() => removeRule(idx)}>
                <Trash2 className="w-4 h-4 text-red-400" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={addRule}>
            <Plus className="w-4 h-4 mr-1" /> Adicionar Regra
          </Button>
          <Button size="sm" onClick={applyFilters} disabled={applying}>
            <Search className="w-4 h-4 mr-1" /> {applying ? 'Aplicando...' : 'Aplicar'}
          </Button>
        </div>

        <div className="border-t pt-3 flex gap-2">
          <input
            className="border rounded px-2 py-1 text-sm flex-1"
            placeholder="Nome do template..."
            value={templateName}
            onChange={e => setTemplateName(e.target.value)}
          />
          <Button variant="outline" size="sm" onClick={saveTemplate} disabled={saving || !templateName}>
            <Save className="w-4 h-4 mr-1" /> {saving ? 'Salvando...' : 'Salvar Template'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}