import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, Play, Calendar } from 'lucide-react';

const VISUALIZATION_TYPES = [
  { id: 'line', label: '📈 Linha', icon: '📊' },
  { id: 'bar', label: '📊 Barras', icon: '📊' },
  { id: 'pie', label: '🥧 Pizza', icon: '🥧' },
  { id: 'table', label: '📋 Tabela', icon: '📋' },
  { id: 'scatter', label: '✨ Dispersão', icon: '✨' },
  { id: 'gauge', label: '⏱️ Velocímetro', icon: '⏱️' }
];

export default function AdvancedReportBuilder() {
  const queryClient = useQueryClient();
  const [showNewReport, setShowNewReport] = useState(false);
  const [newReport, setNewReport] = useState({
    name: '',
    description: '',
    query_type: 'simple',
    visualization_type: 'bar',
    filters: {},
    is_public: false
  });
  const [editingId, setEditingId] = useState(null);

  const { data: queries = [], isLoading } = useQuery({
    queryKey: ['biQueries'],
    queryFn: () => base44.entities.BiQuery.list(),
    initialData: []
  });

  const { data: user } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  const createMutation = useMutation({
    mutationFn: (data) => {
      return base44.entities.BiQuery.create({
        ...data,
        created_by: user?.email,
        last_executed: new Date().toISOString()
      });
    },
    onSuccess: () => {
      toast.success('✅ Relatório criado!');
      queryClient.invalidateQueries({ queryKey: ['biQueries'] });
      setNewReport({
        name: '',
        description: '',
        query_type: 'simple',
        visualization_type: 'bar',
        filters: {},
        is_public: false
      });
      setShowNewReport(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.BiQuery.delete(id),
    onSuccess: () => {
      toast.success('❌ Relatório removido');
      queryClient.invalidateQueries({ queryKey: ['biQueries'] });
    }
  });

  const executeMutation = useMutation({
    mutationFn: (id) => {
      return base44.entities.BiQuery.update(id, {
        last_executed: new Date().toISOString()
      });
    },
    onSuccess: () => {
      toast.success('▶️ Relatório executado!');
      queryClient.invalidateQueries({ queryKey: ['biQueries'] });
    }
  });

  const handleCreateReport = () => {
    if (!newReport.name.trim()) {
      toast.error('Digite um nome para o relatório');
      return;
    }
    createMutation.mutate(newReport);
  };

  return (
    <div className="space-y-6">
      {/* Create Form */}
      {showNewReport && (
        <Card>
          <CardHeader>
            <CardTitle>📊 Novo Relatório BI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Nome do Relatório</label>
                <Input
                  value={newReport.name}
                  onChange={(e) => setNewReport({ ...newReport, name: e.target.value })}
                  placeholder="Ex: Análise de Satisfação"
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium">Tipo de Query</label>
                <select
                  value={newReport.query_type}
                  onChange={(e) => setNewReport({ ...newReport, query_type: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md text-sm mt-1"
                >
                  <option value="simple">Simples</option>
                  <option value="metric">Métrica</option>
                  <option value="sql">SQL</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Descrição</label>
              <Textarea
                value={newReport.description}
                onChange={(e) => setNewReport({ ...newReport, description: e.target.value })}
                placeholder="Descrição do relatório"
                className="mt-1 h-20"
              />
            </div>

            {/* Visualization Type */}
            <div>
              <label className="text-sm font-medium block mb-2">Tipo de Visualização</label>
              <div className="grid grid-cols-3 gap-2">
                {VISUALIZATION_TYPES.map(viz => (
                  <button
                    key={viz.id}
                    onClick={() => setNewReport({ ...newReport, visualization_type: viz.id })}
                    className={`p-3 rounded border-2 text-sm font-medium transition-all ${
                      newReport.visualization_type === viz.id
                        ? 'border-blue-600 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {viz.icon} {viz.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Public Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={newReport.is_public}
                onChange={(e) => setNewReport({ ...newReport, is_public: e.target.checked })}
                className="w-4 h-4"
              />
              <span className="text-sm">Permitir compartilhamento</span>
            </label>

            <div className="flex gap-3 pt-4 border-t">
              <Button
                onClick={handleCreateReport}
                disabled={createMutation.isPending}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-1" />
                Criar Relatório
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowNewReport(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reports List */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">📊 Relatórios BI ({queries.length})</h3>
          {!showNewReport && (
            <Button
              onClick={() => setShowNewReport(true)}
              className="bg-blue-600 hover:bg-blue-700 gap-2"
            >
              <Plus className="w-4 h-4" />
              Novo Relatório
            </Button>
          )}
        </div>

        {isLoading ? (
          <p className="text-sm text-gray-500 py-4">Carregando relatórios...</p>
        ) : queries.length === 0 ? (
          <p className="text-sm text-gray-500 py-4">Nenhum relatório criado</p>
        ) : (
          <div className="space-y-2">
            {queries.map(report => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold">{report.name}</p>
                        <Badge className="text-xs">
                          {VISUALIZATION_TYPES.find(v => v.id === report.visualization_type)?.label}
                        </Badge>
                        {report.is_public && (
                          <Badge variant="outline" className="text-xs">🌐 Público</Badge>
                        )}
                      </div>
                      {report.description && (
                        <p className="text-xs text-gray-600 mb-2">{report.description}</p>
                      )}
                      <div className="flex gap-4 text-xs text-gray-600">
                        <span>📝 {report.query_type}</span>
                        {report.last_executed && (
                          <span>
                            ⏱️ Executado: {new Date(report.last_executed).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                        {report.execution_time_ms && (
                          <span>⚡ {report.execution_time_ms}ms</span>
                        )}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => executeMutation.mutate(report.id)}
                        className="gap-1"
                      >
                        <Play className="w-3 h-3" />
                        Executar
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => deleteMutation.mutate(report.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}