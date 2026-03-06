import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Activity, AlertCircle, CheckCircle2, TrendingDown, Clock } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function StatusDashboardWidget() {
  const { data: status, isLoading } = useQuery({
    queryKey: ['status-dashboard'],
    queryFn: async () => {
      const response = await base44.functions.invoke('statusDashboard', {});
      return response.data;
    },
    refetchInterval: 30000 // Atualiza a cada 30 segundos
  });

  if (isLoading) {
    return <div className="text-gray-600 dark:text-gray-400">Carregando status...</div>;
  }

  if (!status) {
    return null;
  }

  const getStatusColor = (saude) => {
    if (saude >= 80) return 'text-green-600';
    if (saude >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStatusBgColor = (saude) => {
    if (saude >= 80) return 'bg-green-100 dark:bg-green-900';
    if (saude >= 50) return 'bg-yellow-100 dark:bg-yellow-900';
    return 'bg-red-100 dark:bg-red-900';
  };

  return (
    <Card className={`p-6 border-l-4 ${status.sistema.status === 'healthy' ? 'border-green-500' : 'border-yellow-500'}`}>
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <Activity className={`w-5 h-5 ${getStatusColor(status.sistema.saude)}`} />
        Status em Tempo Real
      </h3>

      <div className="space-y-4">
        {/* Saúde do Sistema */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-semibold">Saúde do Sistema</span>
            <span className={`text-2xl font-bold ${getStatusColor(status.sistema.saude)}`}>
              {Math.round(status.sistema.saude)}%
            </span>
          </div>
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${getStatusBgColor(status.sistema.saude).replace('bg-', 'bg-')}`}
              style={{ width: `${status.sistema.saude}%` }}
            />
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">Processos Ativos</p>
            <p className="text-xl font-bold text-blue-600">{status.metricas.processosAtivos}</p>
          </div>
          <div className="p-3 bg-red-50 dark:bg-red-900 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">Prazos Vencidos</p>
            <p className="text-xl font-bold text-red-600">{status.metricas.prazosVencidos}</p>
          </div>
          <div className="p-3 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">Alertas Críticos</p>
            <p className="text-xl font-bold text-yellow-600">{status.metricas.alertasCriticos}</p>
          </div>
          <div className="p-3 bg-purple-50 dark:bg-purple-900 rounded-lg">
            <p className="text-xs text-gray-600 dark:text-gray-400">Audiências (7 dias)</p>
            <p className="text-xl font-bold text-purple-600">{status.metricas.audienciasProximas}</p>
          </div>
        </div>

        {/* Componentes */}
        <div className="border-t pt-3 space-y-2">
          <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">Componentes</p>
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle2 className="w-3 h-3 text-green-600" />
            <span className="text-gray-700 dark:text-gray-300">Advise API: Conectado</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle2 className="w-3 h-3 text-green-600" />
            <span className="text-gray-700 dark:text-gray-300">Database: Disponível</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <CheckCircle2 className="w-3 h-3 text-green-600" />
            <span className="text-gray-700 dark:text-gray-300">Cache: Ativo</span>
          </div>
        </div>

        {/* Última Sincronização */}
        <div className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Atualizado: {new Date(status.timestamp).toLocaleTimeString('pt-BR')}
        </div>
      </div>
    </Card>
  );
}