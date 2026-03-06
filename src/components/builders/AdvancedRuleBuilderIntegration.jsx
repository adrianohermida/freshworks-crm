import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';

export default function AdvancedRuleBuilderIntegration() {
  const [rule, setRule] = useState({
    name: '',
    description: '',
    conditions: [],
    actions: [],
    enabled: true
  });

  const [newCondition, setNewCondition] = useState({ field: 'status', operator: 'equals', value: '' });
  const [newAction, setNewAction] = useState({ type: 'assign_agent', value: '' });

  const conditionFields = ['status', 'priority', 'customer_email', 'assigned_agent', 'group'];
  const conditionOperators = ['equals', 'not_equals', 'contains', 'greater_than', 'less_than'];
  const actionTypes = ['assign_agent', 'change_status', 'change_priority', 'add_tag', 'send_notification'];

  const handleAddCondition = () => {
    if (newCondition.field && newCondition.value) {
      setRule({
        ...rule,
        conditions: [...rule.conditions, newCondition]
      });
      setNewCondition({ field: 'status', operator: 'equals', value: '' });
    }
  };

  const handleRemoveCondition = (index) => {
    setRule({
      ...rule,
      conditions: rule.conditions.filter((_, i) => i !== index)
    });
  };

  const handleAddAction = () => {
    if (newAction.type && newAction.value) {
      setRule({
        ...rule,
        actions: [...rule.actions, newAction]
      });
      setNewAction({ type: 'assign_agent', value: '' });
    }
  };

  const handleRemoveAction = (index) => {
    setRule({
      ...rule,
      actions: rule.actions.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Advanced Automation Rule Builder</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nome da Regra</label>
            <Input
              value={rule.name}
              onChange={(e) => setRule({ ...rule, name: e.target.value })}
              placeholder="Ex: Auto-assign premium tickets"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <Input
              value={rule.description}
              onChange={(e) => setRule({ ...rule, description: e.target.value })}
              placeholder="Descrição da regra"
            />
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold mb-3">Condições (SE...)</h3>
            
            <div className="grid grid-cols-3 gap-2 mb-3">
              <select
                value={newCondition.field}
                onChange={(e) => setNewCondition({ ...newCondition, field: e.target.value })}
                className="border rounded p-2 text-sm"
              >
                {conditionFields.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>

              <select
                value={newCondition.operator}
                onChange={(e) => setNewCondition({ ...newCondition, operator: e.target.value })}
                className="border rounded p-2 text-sm"
              >
                {conditionOperators.map((op) => (
                  <option key={op} value={op}>{op}</option>
                ))}
              </select>

              <div className="flex gap-1">
                <Input
                  value={newCondition.value}
                  onChange={(e) => setNewCondition({ ...newCondition, value: e.target.value })}
                  placeholder="Valor"
                  className="text-sm"
                />
                <Button onClick={handleAddCondition} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {rule.conditions.length > 0 && (
              <div className="space-y-1 mb-3">
                {rule.conditions.map((cond, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-blue-50 p-2 rounded text-sm">
                    <span>{cond.field} {cond.operator} {cond.value}</span>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveCondition(idx)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border-t pt-4">
            <h3 className="text-sm font-semibold mb-3">Ações (ENTÃO...)</h3>
            
            <div className="flex gap-2 mb-3">
              <select
                value={newAction.type}
                onChange={(e) => setNewAction({ ...newAction, type: e.target.value })}
                className="border rounded p-2 text-sm flex-1"
              >
                {actionTypes.map((act) => (
                  <option key={act} value={act}>{act}</option>
                ))}
              </select>

              <div className="flex gap-1 flex-1">
                <Input
                  value={newAction.value}
                  onChange={(e) => setNewAction({ ...newAction, value: e.target.value })}
                  placeholder="Valor"
                  className="text-sm"
                />
                <Button onClick={handleAddAction} size="sm">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {rule.actions.length > 0 && (
              <div className="space-y-1 mb-3">
                {rule.actions.map((act, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-green-50 p-2 rounded text-sm">
                    <span>{act.type}: {act.value}</span>
                    <Button variant="ghost" size="sm" onClick={() => handleRemoveAction(idx)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="enabled"
              checked={rule.enabled}
              onChange={(e) => setRule({ ...rule, enabled: e.target.checked })}
            />
            <label htmlFor="enabled" className="text-sm font-medium">
              Regra Ativa
            </label>
          </div>

          {rule.conditions.length > 0 && rule.actions.length > 0 && (
            <div className="bg-gray-50 p-3 rounded text-sm">
              <p className="font-medium mb-1">Resumo da Regra:</p>
              <p>SE {rule.conditions.length} condição(ões) atendida(s), ENTÃO executar {rule.actions.length} ação(ões)</p>
            </div>
          )}

          <Button className="w-full">Salvar Regra</Button>
        </CardContent>
      </Card>
    </div>
  );
}