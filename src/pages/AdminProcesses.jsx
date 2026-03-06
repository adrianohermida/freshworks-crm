import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { AlertCircle, RefreshCw, Download, Filter } from 'lucide-react';

export default function AdminProcesses() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: processes = [], isLoading } = useQuery({
    queryKey: ['admin_processes'],
    queryFn: () => base44.entities.Process.list('-synced_at', 100)
  });

  const { data: syncs = [] } = useQuery({
    queryKey: ['admin_syncs'],
    queryFn: () => base44.entities.TPUSincronizacao.list('-data_sincronizacao', 50)
  });

  const syncMutation = useMutation({
    mutationFn: async (processId) => {
      return await base44.functions.invoke('datajudFetchProcess', {
        cnj_number: processes.find(p => p.id === processId)?.cnj_number
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_processes'] });
      queryClient.invalidateQueries({ queryKey: ['admin_syncs'] });
    }
  });

  const filteredProcesses = processes.filter(p => {
    const matchSearch = p.cnj_number?.includes(searchTerm) || p.title?.includes(searchTerm);
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: processes.length,
    active: processes.filter(p => p.status === 'active').length,
    archived: processes.filter(p => p.status === 'archived').length,
    synced: processes.filter(p => p.synced_at).length
  };

  const syncSuccess = syncs.filter(s => s.status === 'sucesso').length;
  const syncErrors = syncs.filter(s => s.status === 'erro').length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <p className="text-gray-600">Carregando processos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin - Processos</h1>
          <p className="text-gray-600 mt-1">Gestão centralizada de processos jurídicos</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Total Processos</p>
              <p className="text-3xl font-bold text-cyan-600">{stats.total}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Ativos</p>
              <p className="text-3xl font-bold text-green-600">{stats.active}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Sincronizações OK</p>
              <p className="text-3xl font-bold text-blue-600">{syncSuccess}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600">Erros de Sync</p>
              <p className="text-3xl font-bold text-red-600">{syncErrors}</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <Input
            placeholder="Buscar por CNJ ou título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 min-w-48"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm"
          >
            <option value="all">Todos os Status</option>
            <option value="active">Ativos</option>
            <option value="archived">Arquivados</option>
          </select>
        </div>

        {/* Processes List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Processos ({filteredProcesses.length})</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => queryClient.invalidateQueries({ queryKey: ['admin_processes'] })}
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Atualizar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredProcesses.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Nenhum processo encontrado</p>
            ) : (
              <div className="space-y-2">
                {filteredProcesses.map(process => (
                  <div key={process.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                    <div className="flex-1">
                      <p className="font-mono text-sm font-semibold">{process.cnj_number}</p>
                      <p className="text-sm text-gray-600">{process.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Movimentos: {process.movement_count || 0} | Última sync: {process.synced_at ? new Date(process.synced_at).toLocaleDateString('pt-BR') : 'Nunca'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={process.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {process.status}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => syncMutation.mutate(process.id)}
                        disabled={syncMutation.isPending}
                      >
                        <RefreshCw className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Sync History */}
        <Card>
          <CardHeader>
            <CardTitle>Histórico de Sincronizações (últimas 20)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {syncs.slice(0, 20).map(sync => (
                <div key={sync.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{sync.processo_id}</p>
                    <p className="text-xs text-gray-600">
                      Movimentos: {sync.total_movimentos_sincronizados} | Novos: {sync.total_novos} | Duplicatas: {sync.total_duplicatas}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={
                      sync.status === 'sucesso' ? 'bg-green-100 text-green-800' :
                      sync.status === 'erro' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }>
                      {sync.status}
                    </Badge>
                    <span className="text-xs text-gray-600">{sync.tempo_execucao_ms}ms</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}