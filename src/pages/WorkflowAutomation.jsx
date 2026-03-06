import React, { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit2, Trash2, Play } from 'lucide-react';
import { toast } from 'sonner';

export default function WorkflowAutomation() {
  const [workflows, setWorkflows] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    trigger: 'create',
    conditions: [],
    actions: [],
    enabled: true
  });

  const { refetch: refetchWorkflows } = useQuery({
    queryKey: ['workflows'],
    queryFn: async () => {
      try {
        // In real scenario, fetch from base44.entities.TicketRule
        return workflows;
      } catch {
        return [];
      }
    }
  });

  const triggers = [
    { value: 'create', label: '🆕 Quando ticket é criado' },
    { value: 'update', label: '🔄 Quando ticket é atualizado' },
    { value: 'delay', label: '⏰ Após X horas de inatividade' }
  ];

  const conditions = [
    { value: 'status', label: 'Status do ticket' },
    { value: 'priority', label: 'Prioridade' },
    { value: 'category', label: 'Categoria' },
    { value: 'response_time', label: 'Tempo sem resposta' }
  ];

  const actions = [
    { value: 'change_status', label: 'Mudar status' },
    { value: 'assign_agent', label: 'Atribuir agente' },
    { value: 'add_tag', label: 'Adicionar tag' },
    { value: 'send_notification', label: 'Enviar notificação' }
  ];

  const handleAddCondition = () => {
    setFormData({
      ...formData,
      conditions: [...formData.conditions, { field: 'status', operator: 'equals', value: '' }]
    });
  };

  const handleAddAction = () => {
    setFormData({
      ...formData,
      actions: [...formData.actions, { type: 'change_status', value: '' }]
    });
  };

  const handleRemoveCondition = (index) => {
    setFormData({
      ...formData,
      conditions: formData.conditions.filter((_, i) => i !== index)
    });
  };

  const handleRemoveAction = (index) => {
    setFormData({
      ...formData,
      actions: formData.actions.filter((_, i) => i !== index)
    });
  };

  const handleSaveWorkflow = async () => {
    if (!formData.name) {
      toast.error('Nome do workflow é obrigatório');
      return;
    }

    try {
      if (editId) {
        // Update existing
        setWorkflows(workflows.map(w => w.id === editId ? { ...formData, id: editId } : w));
        toast.success('Workflow atualizado!');
      } else {
        // Create new
        const newWorkflow = { ...formData, id: Date.now() };
        setWorkflows([...workflows, newWorkflow]);
        toast.success('Workflow criado!');
      }
      
      setShowForm(false);
      setEditId(null);
      setFormData({
        name: '',
        description: '',
        trigger: 'create',
        conditions: [],
        actions: [],
        enabled: true
      });
    } catch (error) {
      toast.error('Erro ao salvar workflow');
    }
  };

  const handleDeleteWorkflow = (id) => {
    setWorkflows(workflows.filter(w => w.id !== id));
    toast.success('Workflow deletado');
  };

  const handleEditWorkflow = (workflow) => {
    setFormData(workflow);
    setEditId(workflow.id);
    setShowForm(true);
  };

  const handleTestWorkflow = async (id) => {
    try {
      await base44.functions.invoke('executeWorkflow', { workflowId: id });
      toast.success('Workflow testado com sucesso!');
    } catch {
      toast.error('Erro ao testar workflow');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Automação de Workflows
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Crie regras para automatizar ações de tickets
          </p>
        </div>

        {/* Create Button */}
        <div className="mb-6">
          <Button 
            onClick={() => {
              setShowForm(true);
              setEditId(null);
              setFormData({
                name: '',
                description: '',
                trigger: 'create',
                conditions: [],
                actions: [],
                enabled: true
              });
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Workflow
          </Button>
        </div>

        {/* Form */}
        {showForm && (
          <Card className="mb-8 border-blue-200">
            <CardHeader>
              <CardTitle>{editId ? 'Editar' : 'Criar'} Workflow</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Nome do Workflow *</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: Auto-responder para urgentes"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Descrição</label>
                  <Input
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Detalhe o que este workflow faz"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Disparador (Trigger)</label>
                  <select
                    value={formData.trigger}
                    onChange={(e) => setFormData({...formData, trigger: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    {triggers.map(t => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Conditions */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Condições (AND)</h3>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleAddCondition}
                  >
                    <Plus className="w-3 h-3 mr-1" /> Adicionar Condição
                  </Button>
                </div>

                <div className="space-y-3">
                  {formData.conditions.length === 0 ? (
                    <p className="text-sm text-muted-foreground">Nenhuma condição (aplicar a todos)</p>
                  ) : (
                    formData.conditions.map((cond, idx) => (
                      <div key={idx} className="flex gap-2 items-end">
                        <select
                          value={cond.field}
                          onChange={(e) => {
                            const newConds = [...formData.conditions];
                            newConds[idx].field = e.target.value;
                            setFormData({...formData, conditions: newConds});
                          }}
                          className="flex-1 px-3 py-2 border rounded-lg text-sm"
                        >
                          {conditions.map(c => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                          ))}
                        </select>
                        <select
                          value={cond.operator}
                          onChange={(e) => {
                            const newConds = [...formData.conditions];
                            newConds[idx].operator = e.target.value;
                            setFormData({...formData, conditions: newConds});
                          }}
                          className="px-3 py-2 border rounded-lg text-sm"
                        >
                          <option value="equals">é igual</option>
                          <option value="not_equals">não é igual</option>
                          <option value="contains">contém</option>
                        </select>
                        <Input
                          value={cond.value}
                          onChange={(e) => {
                            const newConds = [...formData.conditions];
                            newConds[idx].value = e.target.value;
                            setFormData({...formData, conditions: newConds});
                          }}
                          placeholder="Valor"
                          className="flex-1"
                        />
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => handleRemoveCondition(idx)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Actions */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Ações</h3>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={handleAddAction}
                  >
                    <Plus className="w-3 h-3 mr-1" /> Adicionar Ação
                  </Button>
                </div>

                <div className="space-y-3">
                  {formData.actions.map((action, idx) => (
                    <div key={idx} className="flex gap-2 items-end">
                      <select
                        value={action.type}
                        onChange={(e) => {
                          const newActions = [...formData.actions];
                          newActions[idx].type = e.target.value;
                          setFormData({...formData, actions: newActions});
                        }}
                        className="flex-1 px-3 py-2 border rounded-lg text-sm"
                      >
                        {actions.map(a => (
                          <option key={a.value} value={a.value}>{a.label}</option>
                        ))}
                      </select>
                      <Input
                        value={action.value}
                        onChange={(e) => {
                          const newActions = [...formData.actions];
                          newActions[idx].value = e.target.value;
                          setFormData({...formData, actions: newActions});
                        }}
                        placeholder="Valor da ação"
                        className="flex-1"
                      />
                      <Button 
                        size="sm" 
                        variant="destructive"
                        onClick={() => handleRemoveAction(idx)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-2 justify-end">
                <Button 
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </Button>
                <Button 
                  onClick={handleSaveWorkflow}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {editId ? 'Atualizar' : 'Criar'} Workflow
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* List */}
        <div className="grid gap-4">
          {workflows.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                Nenhum workflow criado. Clique em "Novo Workflow" para começar.
              </CardContent>
            </Card>
          ) : (
            workflows.map(workflow => (
              <Card key={workflow.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {workflow.name}
                        <Badge variant={workflow.enabled ? 'default' : 'secondary'}>
                          {workflow.enabled ? '✓ Ativo' : 'Inativo'}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{workflow.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Disparador</p>
                      <p className="text-sm">{triggers.find(t => t.value === workflow.trigger)?.label}</p>
                    </div>

                    {workflow.conditions.length > 0 && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Condições</p>
                        <div className="space-y-1">
                          {workflow.conditions.map((cond, idx) => (
                            <p key={idx} className="text-sm">
                              {conditions.find(c => c.value === cond.field)?.label} {cond.operator} {cond.value}
                            </p>
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Ações</p>
                      <div className="space-y-1">
                        {workflow.actions.map((action, idx) => (
                          <p key={idx} className="text-sm">
                            {actions.find(a => a.value === action.type)?.label}: {action.value}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => handleTestWorkflow(workflow.id)}
                    >
                      <Play className="w-3 h-3 mr-1" /> Testar
                    </Button>
                    <Button 
                      size="sm"
                      variant="outline"
                      onClick={() => handleEditWorkflow(workflow)}
                    >
                      <Edit2 className="w-3 h-3 mr-1" /> Editar
                    </Button>
                    <Button 
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteWorkflow(workflow.id)}
                    >
                      <Trash2 className="w-3 h-3 mr-1" /> Deletar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}