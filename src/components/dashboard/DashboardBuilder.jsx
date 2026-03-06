import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { GripVertical, Trash2, Plus, Copy, Eye } from 'lucide-react';

const WIDGET_TYPES = [
  { value: 'kpi', label: 'KPI Cards', description: 'Estatísticas principais' },
  { value: 'chart', label: 'Charts', description: 'Gráficos de distribuição' },
  { value: 'list', label: 'List', description: 'Lista de tickets' },
  { value: 'timeline', label: 'Timeline', description: 'Linha do tempo' },
  { value: 'sentiment', label: 'Sentiment', description: 'Análise de sentimento' },
  { value: 'sla', label: 'SLA Monitor', description: 'Monitor de SLA' }
];

const WIDGET_SIZES = ['small', 'medium', 'large'];

export default function DashboardBuilder() {
  const queryClient = useQueryClient();
  const [newDashboard, setNewDashboard] = useState({
    name: 'Novo Dashboard',
    description: '',
    layout: 'grid',
    widgets: [],
    filters: {},
    refresh_interval: 60,
    is_default: false,
    is_public: false
  });
  const [editingId, setEditingId] = useState(null);

  const { data: dashboards = [], isLoading } = useQuery({
    queryKey: ['dashboardConfigs'],
    queryFn: () => base44.entities.DashboardConfig.list(),
    initialData: []
  });

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (editingId) {
        return base44.entities.DashboardConfig.update(editingId, data);
      }
      return base44.entities.DashboardConfig.create(data);
    },
    onSuccess: () => {
      toast.success(editingId ? 'Dashboard atualizado!' : 'Dashboard criado!');
      queryClient.invalidateQueries({ queryKey: ['dashboardConfigs'] });
      resetForm();
    },
    onError: (error) => {
      toast.error('Erro: ' + error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.DashboardConfig.delete(id),
    onSuccess: () => {
      toast.success('Dashboard removido!');
      queryClient.invalidateQueries({ queryKey: ['dashboardConfigs'] });
    },
    onError: (error) => {
      toast.error('Erro: ' + error.message);
    }
  });

  const setDefaultMutation = useMutation({
    mutationFn: async (id) => {
      // Remover default de todos
      for (const dash of dashboards) {
        if (dash.is_default) {
          await base44.entities.DashboardConfig.update(dash.id, { is_default: false });
        }
      }
      // Definir novo como default
      return base44.entities.DashboardConfig.update(id, { is_default: true });
    },
    onSuccess: () => {
      toast.success('Dashboard padrão alterado!');
      queryClient.invalidateQueries({ queryKey: ['dashboardConfigs'] });
    },
    onError: (error) => {
      toast.error('Erro: ' + error.message);
    }
  });

  const resetForm = () => {
    setNewDashboard({
      name: 'Novo Dashboard',
      description: '',
      layout: 'grid',
      widgets: [],
      filters: {},
      refresh_interval: 60,
      is_default: false,
      is_public: false
    });
    setEditingId(null);
  };

  const addWidget = (type) => {
    const newWidget = {
      id: `widget_${Date.now()}`,
      type,
      title: WIDGET_TYPES.find(w => w.value === type)?.label || type,
      position: newDashboard.widgets.length,
      size: 'medium',
      enabled: true,
      config: {}
    };
    setNewDashboard({
      ...newDashboard,
      widgets: [...newDashboard.widgets, newWidget]
    });
  };

  const removeWidget = (id) => {
    setNewDashboard({
      ...newDashboard,
      widgets: newDashboard.widgets.filter(w => w.id !== id)
    });
  };

  const updateWidget = (id, updates) => {
    setNewDashboard({
      ...newDashboard,
      widgets: newDashboard.widgets.map(w => 
        w.id === id ? { ...w, ...updates } : w
      )
    });
  };

  const handleSave = () => {
    if (!newDashboard.name.trim()) {
      toast.error('Nome do dashboard é obrigatório');
      return;
    }
    if (newDashboard.widgets.length === 0) {
      toast.error('Adicione pelo menos um widget');
      return;
    }
    saveMutation.mutate(newDashboard);
  };

  if (isLoading) return <div>Carregando...</div>;

  return (
    <div className="space-y-6">
      {/* Builder Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {editingId ? '✏️ Editar Dashboard' : '➕ Criar Novo Dashboard'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Nome *</label>
              <Input
                value={newDashboard.name}
                onChange={(e) => setNewDashboard({ ...newDashboard, name: e.target.value })}
                placeholder="Ex: Dashboard Executivo"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Layout</label>
              <select
                value={newDashboard.layout}
                onChange={(e) => setNewDashboard({ ...newDashboard, layout: e.target.value })}
                className="w-full px-3 py-2 border rounded-md text-sm"
              >
                <option value="grid">Grid</option>
                <option value="list">Lista</option>
                <option value="kanban">Kanban</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Descrição</label>
            <Input
              value={newDashboard.description}
              onChange={(e) => setNewDashboard({ ...newDashboard, description: e.target.value })}
              placeholder="Descrição do dashboard"
            />
          </div>

          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold">Widgets ({newDashboard.widgets.length})</label>
              <span className="text-xs text-gray-500">Arraste para reordenar</span>
            </div>

            <div className="space-y-2 mb-4">
              {newDashboard.widgets.map((widget) => (
                <div
                  key={widget.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border"
                >
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <div className="flex-1">
                    <p className="font-medium text-sm">{widget.title}</p>
                    <p className="text-xs text-gray-500">
                      {WIDGET_TYPES.find(t => t.value === widget.type)?.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={widget.size}
                      onChange={(e) => updateWidget(widget.id, { size: e.target.value })}
                      className="text-xs px-2 py-1 border rounded"
                    >
                      {WIDGET_SIZES.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                    <label className="flex items-center gap-1">
                      <Checkbox
                        checked={widget.enabled}
                        onCheckedChange={(checked) => 
                          updateWidget(widget.id, { enabled: checked })
                        }
                      />
                    </label>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeWidget(widget.id)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-gray-600 mb-2">Adicionar Widget:</p>
              <div className="grid grid-cols-2 gap-2">
                {WIDGET_TYPES.map((type) => (
                  <Button
                    key={type.value}
                    variant="outline"
                    size="sm"
                    onClick={() => addWidget(type.value)}
                    className="text-xs justify-start"
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    {type.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          <div className="border-t pt-4 space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={newDashboard.is_default}
                onCheckedChange={(checked) => 
                  setNewDashboard({ ...newDashboard, is_default: checked })
                }
              />
              <span className="text-sm">Definir como padrão</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={newDashboard.is_public}
                onCheckedChange={(checked) => 
                  setNewDashboard({ ...newDashboard, is_public: checked })
                }
              />
              <span className="text-sm">Público (compartilhável)</span>
            </label>
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button
              onClick={handleSave}
              disabled={saveMutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {editingId ? 'Atualizar Dashboard' : 'Criar Dashboard'}
            </Button>
            {editingId && (
              <Button variant="outline" onClick={resetForm}>
                Cancelar
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dashboards List */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold">Meus Dashboards ({dashboards.length})</h3>
        {dashboards.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhum dashboard criado</p>
        ) : (
          dashboards.map((dashboard) => (
            <Card key={dashboard.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{dashboard.name}</h4>
                      {dashboard.is_default && (
                        <Badge className="bg-blue-100 text-blue-800">Padrão</Badge>
                      )}
                      {dashboard.is_public && (
                        <Badge variant="outline">Público</Badge>
                      )}
                    </div>
                    {dashboard.description && (
                      <p className="text-sm text-gray-600 mb-2">{dashboard.description}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      {dashboard.widgets.length} widgets • Layout: {dashboard.layout}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setEditingId(dashboard.id);
                        setNewDashboard(dashboard);
                      }}
                    >
                      ✏️ Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDefaultMutation.mutate(dashboard.id)}
                      disabled={dashboard.is_default}
                    >
                      {dashboard.is_default ? '✓ Padrão' : 'Definir Padrão'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteMutation.mutate(dashboard.id)}
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