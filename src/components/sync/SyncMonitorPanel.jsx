import React, { useEffect, useState } from 'react';
import { Activity, Zap, CheckCircle2, AlertCircle, Clock, RefreshCw, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useScheduleSync } from './useScheduleSync';

export default function SyncMonitorPanel({ activeSyncs, stats, isLoading, isSyncing, onStartSync, tribunals }) {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [showSchedule, setShowSchedule] = useState(false);
  const { schedule, isScheduling } = useScheduleSync();

  const successRate = stats.totalSynced > 0 
    ? Math.round((stats.successCount / stats.totalSynced) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex-1">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <Activity className="w-5 h-5 text-cyan-600" />
            Sincronização SGT CNJ - TPU
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Acompanhamento em tempo real da sincronização da Tabela Processual Unificada
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowSchedule(!showSchedule)}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <Calendar className="w-4 h-4" />
            Agendar
          </Button>
          <Button
            onClick={() => setAutoRefresh(!autoRefresh)}
            variant={autoRefresh ? 'default' : 'outline'}
            size="sm"
            className="gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${autoRefresh ? 'animate-spin' : ''}`} />
            {autoRefresh ? 'Auto' : 'Manual'}
          </Button>
        </div>
      </div>

      {/* SCHEDULE SECTION */}
      {showSchedule && (
        <Card className="p-4 bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700">
          <div className="space-y-4">
            <h4 className="font-semibold text-sm">Agendar Sincronização Automática</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button
                onClick={() => schedule({ triggerType: 'daily', time: '02:00' })}
                disabled={isScheduling}
                className="gap-2"
              >
                <Calendar className="w-4 h-4" />
                Agendar Diário (02:00)
              </Button>
              <Button
                onClick={() => schedule({ triggerType: 'daily', time: '22:00' })}
                disabled={isScheduling}
                className="gap-2"
              >
                <Calendar className="w-4 h-4" />
                Agendar Diário (22:00)
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Sincronizado</p>
              <p className="text-2xl font-bold mt-2">{stats.totalSynced}</p>
            </div>
            <Zap className="w-5 h-5 text-yellow-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Sucesso</p>
              <p className="text-2xl font-bold text-green-600 mt-2">{stats.successCount}</p>
            </div>
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Erros</p>
              <p className="text-2xl font-bold text-red-600 mt-2">{stats.errorCount}</p>
            </div>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Taxa Sucesso</p>
              <p className="text-2xl font-bold text-cyan-600 mt-2">{successRate}%</p>
            </div>
            <Activity className="w-5 h-5 text-cyan-500" />
          </div>
        </Card>
      </div>

      {/* SUCCESS RATE PROGRESS */}
      {stats.totalSynced > 0 && (
        <Card className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Taxa de Sucesso</span>
              <span className="text-gray-600 dark:text-gray-400">{successRate}%</span>
            </div>
            <Progress value={successRate} className="h-2" />
          </div>
        </Card>
      )}

      {/* LAST SYNC INFO */}
      {stats.lastSync && (
        <Card className="p-4 bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700">
          <div className="flex items-center gap-3">
            <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Última sincronização
              </p>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                {new Date(stats.lastSync).toLocaleString('pt-BR')}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* TRIBUNALS SYNC STATUS */}
      <div className="space-y-3">
        <h4 className="font-semibold text-sm">Status por Tribunal</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tribunals?.map(tribunal => {
            const syncStatus = activeSyncs.find(s => s.metadata?.tribunal === tribunal.name);
            const tribunalStats = stats.byTribunal?.[tribunal.name] || [];
            
            return (
              <Card key={tribunal.alias} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-medium text-sm">{tribunal.name}</p>
                      <p className="text-xs text-gray-500">{tribunal.alias}</p>
                    </div>
                    {syncStatus ? (
                      <Badge className="bg-blue-100 text-blue-800 animate-pulse">
                        Sincronizando...
                      </Badge>
                    ) : tribunalStats.length > 0 ? (
                      <Badge className="bg-green-100 text-green-800">
                        Atualizado
                      </Badge>
                    ) : (
                      <Badge variant="outline">Pendente</Badge>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-xs">
                    <span className="text-gray-600 dark:text-gray-400">
                      Sincronizações: <span className="font-semibold">{tribunalStats.length}</span>
                    </span>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => onStartSync(tribunal.alias)}
                    disabled={isSyncing || syncStatus}
                    className="w-full gap-2"
                  >
                    {syncStatus ? (
                      <>
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        Sincronizando...
                      </>
                    ) : (
                      <>
                        <Zap className="w-3 h-3" />
                        Sincronizar Agora
                      </>
                    )}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ACTIVE SYNCS LOG */}
      {activeSyncs.length > 0 && (
        <Card className="p-4">
          <h4 className="font-semibold text-sm mb-4">Atividade Recente</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {activeSyncs.map((sync, idx) => (
              <div key={idx} className="flex items-start gap-3 text-xs pb-2 border-b border-gray-200 dark:border-gray-700 last:border-0">
                <div className={`p-1 rounded ${sync.status === 'success' ? 'bg-green-100' : 'bg-red-100'}`}>
                  {sync.status === 'success' ? (
                    <CheckCircle2 className={`w-3 h-3 ${sync.status === 'success' ? 'text-green-600' : 'text-red-600'}`} />
                  ) : (
                    <AlertCircle className="w-3 h-3 text-red-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {sync.metadata?.tribunal || 'Sistema'}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400">{sync.action}</p>
                  <p className="text-gray-500 dark:text-gray-500 mt-1">
                    {new Date(sync.timestamp).toLocaleTimeString('pt-BR')}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}