import React, { useEffect, useState } from 'react';
import { RefreshCw, CheckCircle2, AlertCircle, Clock, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { base44 } from '@/api/base44Client';

export default function SyncStatusDashboard() {
  const [syncs, setSyncs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    sucesso: 0,
    erro: 0,
    pendente: 0,
    taxa_sucesso: 0
  });

  useEffect(() => {
    carregarSincronizacoes();
    const interval = setInterval(carregarSincronizacoes, 30000); // Atualizar a cada 30s
    return () => clearInterval(interval);
  }, []);

  const carregarSincronizacoes = async () => {
    try {
      setIsLoading(true);
      const data = await base44.entities.TPUSincronizacao.list('-data_sincronizacao', 50);
      setSyncs(data || []);

      // Calcular estatísticas
      const total = data?.length || 0;
      const sucesso = data?.filter(s => s.status === 'sucesso').length || 0;
      const erro = data?.filter(s => s.status === 'erro').length || 0;
      const pendente = data?.filter(s => s.status === 'pendente').length || 0;
      const taxa_sucesso = total > 0 ? Math.round((sucesso / total) * 100) : 0;

      setStats({ total, sucesso, erro, pendente, taxa_sucesso });
    } catch (error) {
      console.error('Erro ao carregar sincronizações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'sucesso': return 'bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700';
      case 'erro': return 'bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700';
      case 'sincronizando': return 'bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700';
      default: return 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'sucesso': return <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />;
      case 'erro': return <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'sincronizando': return <RefreshCw className="w-5 h-5 text-blue-600 dark:text-blue-400 animate-spin" />;
      default: return <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />;
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'sucesso': return 'Sucesso';
      case 'erro': return 'Erro';
      case 'sincronizando': return 'Sincronizando';
      default: return 'Pendente';
    }
  };

  if (isLoading && syncs.length === 0) {
    return (
      <div className="text-center py-12">
        <RefreshCw className="w-12 h-12 mx-auto text-gray-400 animate-spin mb-4" />
        <p className="text-gray-600 dark:text-gray-400">Carregando status de sincronizações...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-100 dark:bg-cyan-900 rounded-lg">
            <Zap className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold">Status de Sincronizações</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Rastreamento em tempo real de sincronizações com DataJud
            </p>
          </div>
        </div>
        <button
          onClick={carregarSincronizacoes}
          disabled={isLoading}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        >
          <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Total</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </Card>
        <Card className="p-4 border-green-200 dark:border-green-700">
          <p className="text-sm text-green-600 dark:text-green-400 mb-1">✓ Sucesso</p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-400">{stats.sucesso}</p>
        </Card>
        <Card className="p-4 border-red-200 dark:border-red-700">
          <p className="text-sm text-red-600 dark:text-red-400 mb-1">✗ Erro</p>
          <p className="text-3xl font-bold text-red-600 dark:text-red-400">{stats.erro}</p>
        </Card>
        <Card className="p-4 border-yellow-200 dark:border-yellow-700">
          <p className="text-sm text-yellow-600 dark:text-yellow-400 mb-1">⏳ Pendente</p>
          <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pendente}</p>
        </Card>
        <Card className="p-4 border-blue-200 dark:border-blue-700">
          <p className="text-sm text-blue-600 dark:text-blue-400 mb-1">Taxa de Sucesso</p>
          <div className="mt-2">
            <Progress value={stats.taxa_sucesso} className="h-2 mb-1" />
            <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{stats.taxa_sucesso}%</p>
          </div>
        </Card>
      </div>

      {/* HISTÓRICO */}
      <div className="space-y-3">
        <h4 className="font-semibold text-gray-900 dark:text-white">Últimas Sincronizações</h4>
        {syncs.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">Nenhuma sincronização registrada</p>
          </Card>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {syncs.map(sync => (
              <Card
                key={sync.id}
                className={`p-4 border ${getStatusColor(sync.status)}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    {getStatusIcon(sync.status)}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          {sync.processo_id || 'Sincronização geral'}
                        </p>
                        <Badge variant="outline">
                          {getStatusLabel(sync.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {sync.total_movimentos_sincronizados || 0} movimentos · 
                        {sync.total_novos || 0} novos ·
                        {sync.total_duplicatas || 0} duplicatas
                      </p>
                      {sync.tempo_execucao_ms && (
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          Tempo: {sync.tempo_execucao_ms}ms
                        </p>
                      )}
                      {sync.mensagem_erro && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                          Erro: {sync.mensagem_erro}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {sync.data_sincronizacao ? new Date(sync.data_sincronizacao).toLocaleString('pt-BR') : '-'}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}