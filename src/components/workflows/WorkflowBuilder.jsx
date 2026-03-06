import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Play, Zap, ArrowDown, CheckCircle2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const TRIGGERS = [
  'publicacao_criada', 'intimacao_recebida', 'prazo_vencendo',
  'processo_atualizado', 'tarefa_atrasada', 'ticket_aberto'
];

const STEP_TYPES = ['send_email', 'create_task', 'create_ticket', 'notify_user', 'update_status'];

export default function WorkflowBuilder() {
  const [name, setName] = useState('');
  const [trigger, setTrigger] = useState('');
  const [steps, setSteps] = useState([{ type: 'notify_user', config: {} }]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(null);

  const addStep = () => setSteps([...steps, { type: 'notify_user', config: {} }]);
  const updateStep = (idx, type) => {
    const updated = [...steps];
    updated[idx] = { ...updated[idx], type };
    setSteps(updated);
  };

  const saveWorkflow = async () => {
    setSaving(true);
    const res = await base44.functions.invoke('workflows/workflowEngine', {
      action: 'create',
      workflow: { name, trigger, steps }
    });
    setSaving(false);
    if (res.data?.success) setSaved(res.data.workflow);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Construtor de Workflow
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {saved ? (
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <div>
              <p className="font-semibold text-green-800">Workflow criado!</p>
              <p className="text-sm text-green-600">{saved.name} — {saved.steps.length} etapas</p>
            </div>
            <Button variant="outline" size="sm" className="ml-auto" onClick={() => { setSaved(null); setName(''); setTrigger(''); }}>
              Novo
            </Button>
          </div>
        ) : (
          <>
            <input
              className="w-full border rounded px-3 py-2 text-sm"
              placeholder="Nome do workflow..."
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <div>
              <label className="text-xs font-medium text-gray-500 block mb-1">Gatilho</label>
              <select
                className="w-full border rounded px-3 py-2 text-sm"
                value={trigger}
                onChange={e => setTrigger(e.target.value)}
              >
                <option value="">Selecionar evento...</option>
                {TRIGGERS.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-500 block">Etapas</label>
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  {idx > 0 && <ArrowDown className="w-4 h-4 text-gray-400 ml-4" />}
                  <div className="flex items-center gap-2 bg-gray-50 border rounded px-3 py-2 flex-1">
                    <Badge variant="outline">{idx + 1}</Badge>
                    <select
                      className="text-sm flex-1 bg-transparent"
                      value={step.type}
                      onChange={e => updateStep(idx, e.target.value)}
                    >
                      {STEP_TYPES.map(t => <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>)}
                    </select>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addStep}>
                <Plus className="w-4 h-4 mr-1" /> Adicionar Etapa
              </Button>
            </div>

            <Button className="w-full" onClick={saveWorkflow} disabled={saving || !name || !trigger}>
              <Play className="w-4 h-4 mr-2" />
              {saving ? 'Salvando...' : 'Criar Workflow'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}