import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus } from 'lucide-react';

const PRIORITIES = ['low', 'medium', 'high', 'urgent'];

export default function SLAPolicyManager() {
  const queryClient = useQueryClient();
  const [newPolicy, setNewPolicy] = useState({
    name: '',
    priority: 'medium',
    first_response_time: 4,
    resolution_time: 24,
    business_hours_only: true,
    escalation_time: 8,
    auto_escalate: false,
    enabled: true
  });
  const [editingId, setEditingId] = useState(null);

  const { data: policies = [], isLoading } = useQuery({
    queryKey: ['slaPolicies'],
    queryFn: () => base44.entities.SLAPolicy.list(),
    initialData: []
  });

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (editingId) {
        return base44.entities.SLAPolicy.update(editingId, data);
      }
      return base44.entities.SLAPolicy.create(data);
    },
    onSuccess: () => {
      toast.success(editingId ? 'Política atualizada!' : 'Política criada!');
      queryClient.invalidateQueries({ queryKey: ['slaPolicies'] });
      resetForm();
    },
    onError: (error) => {
      toast.error('Erro: ' + error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.SLAPolicy.delete(id),
    onSuccess: () => {
      toast.success('Política removida');
      queryClient.invalidateQueries({ queryKey: ['slaPolicies'] });
    },
    onError: (error) => {
      toast.error('Erro: ' + error.message);
    }
  });

  const resetForm = () => {
    setNewPolicy({
      name: '',
      priority: 'medium',
      first_response_time: 4,
      resolution_time: 24,
      business_hours_only: true,
      escalation_time: 8,
      auto_escalate: false,
      enabled: true
    });
    setEditingId(null);
  };

  const handleSave = () => {
    if (!newPolicy.name.trim()) {
      toast.error('Nome da política é obrigatório');
      return;
    }
    saveMutation.mutate(newPolicy);
  };

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {editingId ? '✏️ Editar Política SLA' : '➕ Nova Política SLA'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Nome *</label>
              <Input
                value={newPolicy.name}
                onChange={(e) => setNewPolicy({ ...newPolicy, name: e.target.value })}
                placeholder="Ex: SLA Premium"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Prioridade</label>
              <select
                value={newPolicy.priority}
                onChange={(e) => setNewPolicy({ ...newPolicy, priority: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                {PRIORITIES.map(p => (
                  <option key={p} value={p} className="capitalize">
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium">1ª Resposta (h)</label>
              <Input
                type="number"
                value={newPolicy.first_response_time}
                onChange={(e) => setNewPolicy({ ...newPolicy, first_response_time: parseInt(e.target.value) })}
                min="1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Resolução (h)</label>
              <Input
                type="number"
                value={newPolicy.resolution_time}
                onChange={(e) => setNewPolicy({ ...newPolicy, resolution_time: parseInt(e.target.value) })}
                min="1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Escalação (h)</label>
              <Input
                type="number"
                value={newPolicy.escalation_time}
                onChange={(e) => setNewPolicy({ ...newPolicy, escalation_time: parseInt(e.target.value) })}
                min="1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={newPolicy.business_hours_only}
                onCheckedChange={(checked) => 
                  setNewPolicy({ ...newPolicy, business_hours_only: checked })
                }
              />
              <span className="text-sm">Apenas horário comercial</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={newPolicy.auto_escalate}
                onCheckedChange={(checked) => 
                  setNewPolicy({ ...newPolicy, auto_escalate: checked })
                }
              />
              <span className="text-sm">Escalar automaticamente</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={newPolicy.enabled}
                onCheckedChange={(checked) => 
                  setNewPolicy({ ...newPolicy, enabled: checked })
                }
              />
              <span className="text-sm">Ativa</span>
            </label>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {editingId ? 'Atualizar' : 'Criar'} Política
            </Button>
            {editingId && (
              <Button variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Policies List */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Políticas Ativas ({policies.filter(p => p.enabled).length})</h3>
        {policies.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma política criada</p>
        ) : (
          policies.map((policy) => (
            <Card key={policy.id} className={!policy.enabled ? 'opacity-50' : ''}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">{policy.name}</h4>
                      <Badge variant="outline" className="capitalize">
                        {policy.priority}
                      </Badge>
                      {policy.enabled && (
                        <Badge className="bg-green-100 text-green-800">Ativa</Badge>
                      )}
                    </div>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>1ª Resposta: {policy.first_response_time}h • Resolução: {policy.resolution_time}h • Escalação: {policy.escalation_time}h</p>
                      {policy.business_hours_only && <p>📅 Apenas horário comercial</p>}
                      {policy.auto_escalate && <p>⚡ Auto-escalação ativa</p>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingId(policy.id);
                        setNewPolicy(policy);
                      }}
                    >
                      ✏️
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate(policy.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}