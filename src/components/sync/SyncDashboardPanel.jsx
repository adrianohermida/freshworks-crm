import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Clock, Zap } from 'lucide-react';

export default function SyncDashboardPanel() {
  const [syncStatus, setSyncStatus] = useState({
    total: 0,
    sucesso: 0,
    erro: 0,
    processando: 0,
    taxa_sucesso_pct: 0,
    tempo_medio_ms: 0,
    ultima_sincronizacao: null,
    proxima_sincronizacao: null
  });

  const statusBadgeColor = (status) => {
    if (status === 'sucesso') return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200';
    if (status === 'erro') return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200';
    if (status === 'processando') return 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200';
    return 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200';
  };

  return (
    <div className="space-y-4">
      {/* RESUMO */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 dark:bg-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">Taxa de Sucesso</div>
          <div className="text-3xl font-bold text-green-600">{syncStatus.taxa_sucesso_pct}%</div>
          <Progress value={syncStatus.taxa_sucesso_pct} className="mt-2" />
        </Card>

        <Card className="p-4 dark:bg-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">Total Sincronizações</div>
          <div className="text-3xl font-bold text-cyan-600">{syncStatus.total}</div>
          <div className="text-xs text-gray-500 mt-2">
            ✅ {syncStatus.sucesso} | ❌ {syncStatus.erro} | ⏳ {syncStatus.processando}
          </div>
        </Card>

        <Card className="p-4 dark:bg-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">Tempo Médio</div>
          <div className="text-3xl font-bold text-purple-600">{syncStatus.tempo_medio_ms}ms</div>
          <div className="text-xs text-gray-500 mt-2">Por sincronização</div>
        </Card>

        <Card className="p-4 dark:bg-gray-800">
          <div className="text-sm text-gray-600 dark:text-gray-400">Próxima Sincronização</div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">
            {syncStatus.proxima_sincronizacao 
              ? new Date(syncStatus.proxima_sincronizacao).toLocaleTimeString('pt-BR')
              : 'Agendada'
            }
          </div>
        </Card>
      </div>

      {/* TIMELINE DE EVENTOS */}
      <Card className="p-6 dark:bg-gray-800">
        <h3 className="font-bold text-lg mb-4">📊 Últimos Eventos de Sincronização</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              {i % 3 === 0 ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
              ) : i % 3 === 1 ? (
                <Clock className="w-5 h-5 text-blue-600 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className="text-sm font-semibold">Processo #{1000 + i}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {i % 3 === 0 ? 'Sincronizado com sucesso' : i % 3 === 1 ? 'Em processamento' : 'Falha na sincronização'}
                </p>
              </div>
              <Badge className={statusBadgeColor(i % 3 === 0 ? 'sucesso' : i % 3 === 1 ? 'processando' : 'erro')}>
                {i % 3 === 0 ? '2.3s' : i % 3 === 1 ? '...ms' : 'Erro'}
              </Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}