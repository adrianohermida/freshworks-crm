import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Play } from 'lucide-react';

export default function AutomationBuilder() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    conditions: [],
    actions: [],
    enabled: true
  });

  const handleCreateRule = async () => {
    if (!formData.name || formData.conditions.length === 0 || formData.actions.length === 0) {
      alert('Nome, condições e ações obrigatórios');
      return;
    }

    setLoading(true);
    try {
      await base44.functions.invoke('createAutomationRule', formData);
      setFormData({
        name: '',
        description: '',
        conditions: [],
        actions: [],
        enabled: true
      });
      setIsCreating(false);
    } catch (error) {
      console.error('Erro ao criar regra:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Automation Rules</h2>
        <Button onClick={() => setIsCreating(!isCreating)} className="gap-2">
          <Plus className="h-4 w-4" /> Nova Regra
        </Button>
      </div>

      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>Criar Nova Regra de Automação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Nome da regra"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              placeholder="Descrição"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div className="border rounded p-4 bg-gray-50">
              <p className="text-sm text-gray-600">Condições e ações serão definidas no builder visual</p>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              />
              <span>Ativo</span>
            </label>
            <div className="flex gap-2">
              <Button onClick={handleCreateRule} disabled={loading}>
                {loading ? 'Criando...' : 'Criar'}
              </Button>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {rules.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center text-gray-600">
              Nenhuma regra de automação criada
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}