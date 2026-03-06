import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Clock, Loader2, RefreshCw } from 'lucide-react';

const SYNC_FUNCTIONS = [
  { name: 'syncPublicacoesManual', label: 'Publicações (Manual)', icon: '📄' },
  { name: 'syncPublicacoesBackground', label: 'Publicações (Auto)', icon: '🔄' },
  { name: 'healthCheck', label: 'Health Check Advise', icon: '🏥' },
];

export default function SyncStatusMonitor() {
  const [syncStatus, setSyncStatus] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSyncStatus();
    const interval = setInterval(loadSyncStatus, 30000); // Atualizar a cada 30s
    return () => clearInterval(interval);
  }, []);

  const loadSyncStatus = async () => {
    try {
      const status = {};
      for (const func of SYNC_FUNCTIONS) {
        // Tentar carregar do localStorage ou estado da última execução
        const stored = localStorage.getItem(`sync_${func.name}`);
        if (stored) {
          status[func.name] = JSON.parse(stored);
        } else {
          status[func.name] = {
            status: 'unknown',
            lastRun: null,
            nextRun: null,
            message: 'Nunca executado'
          };
        }
      }
      setSyncStatus(status);
    } catch (err) {
      console.error('Erro ao carregar sync status:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'success': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'error': return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'pending': return <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'unknown': return <Clock className="w-5 h-5 text-gray-400" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'success': return 'bg-green-50 border-green-200';
      case 'error': return 'bg-red-50 border-red-200';
      case 'pending': return 'bg-blue-50 border-blue-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    const now = new Date();
    const diffSeconds = Math.round((now - date) / 1000);

    if (diffSeconds < 60) return 'Agora';
    if (diffSeconds < 3600) return `${Math.round(diffSeconds / 60)}m atrás`;
    if (diffSeconds < 86400) return `${Math.round(diffSeconds / 3600)}h atrás`;
    return date.toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <Card className="p-6 border border-gray-200">
        <div className="flex items-center justify-center h-40">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Carregando status...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-900">📊 Status de Sincronizações</h3>
        <button
          onClick={loadSyncStatus}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
          aria-label="Recarregar status"
        >
          <RefreshCw className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      <div className="space-y-3">
        {SYNC_FUNCTIONS.map((func) => {
          const status = syncStatus[func.name] || {};
          
          return (
            <div
              key={func.name}
              className={`p-4 rounded-lg border-2 ${getStatusColor(status.status)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{func.icon}</span>
                    {getStatusIcon(status.status)}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-gray-900">{func.label}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {status.message || 'Sem informações'}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={status.status === 'success' ? 'default' : 'secondary'}
                    className={
                      status.status === 'success' ? 'bg-green-600' :
                      status.status === 'error' ? 'bg-red-600' :
                      status.status === 'pending' ? 'bg-blue-600' :
                      'bg-gray-400'
                    }
                  >
                    {status.status === 'unknown' ? 'Desconhecido' : status.status.toUpperCase()}
                  </Badge>
                </div>
              </div>

              {status.lastRun && (
                <div className="flex gap-4 mt-3 pt-3 border-t border-current border-opacity-20 text-xs text-gray-600">
                  <span>⏰ Última: {formatTime(status.lastRun)}</span>
                  {status.nextRun && <span>📅 Próxima: {formatTime(status.nextRun)}</span>}
                  {status.duration && <span>⚡ Duração: {status.duration}ms</span>}
                </div>
              )}

              {status.error && (
                <div className="mt-2 p-2 bg-red-100 rounded text-xs text-red-800 font-mono overflow-auto max-h-24">
                  {status.error}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs text-blue-800">
        <p className="font-medium mb-1">💡 Sobre o Monitor:</p>
        <p>Status atualizado a cada 30 segundos. Clique em 🔄 para recarregar manualmente.</p>
      </div>
    </Card>
  );
}