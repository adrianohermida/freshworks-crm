import React, { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { 
  Activity, CheckCircle, AlertCircle, RefreshCw, 
  Zap, Clock, Bell 
} from 'lucide-react';

export default function RealtimeSyncManager() {
  const [syncStatus, setSyncStatus] = useState('idle');
  const [lastSync, setLastSync] = useState(null);
  const [intimacoes, setIntimacoes] = useState([]);
  const [newCount, setNewCount] = useState(0);
  const [isRealtime, setIsRealtime] = useState(false);

  useEffect(() => {
    initRealtimeSync();
    return () => {
      if (window.intimacoesUnsubscribe) {
        window.intimacoesUnsubscribe();
      }
    };
  }, []);

  const initRealtimeSync = useCallback(async () => {
    try {
      setSyncStatus('connecting');
      
      // Subscribe to real-time updates
      const unsubscribe = base44.entities.IntimacaoAdvise.subscribe((event) => {
        handleRealtimeUpdate(event);
      });

      window.intimacoesUnsubscribe = unsubscribe;
      
      // Initial load
      await loadIntimacoes();
      
      setIsRealtime(true);
      setSyncStatus('connected');
      setLastSync(new Date());
    } catch (error) {
      console.error('Erro ao iniciar sync real-time:', error);
      setSyncStatus('error');
    }
  }, []);

  const handleRealtimeUpdate = (event) => {
    console.log('Real-time update received:', event);
    
    if (event.type === 'create') {
      setIntimacoes(prev => [event.data, ...prev]);
      setNewCount(prev => prev + 1);
      showNotification('Nova intimação recebida', event.data);
    } else if (event.type === 'update') {
      setIntimacoes(prev => prev.map(i => i.id === event.id ? event.data : i));
    } else if (event.type === 'delete') {
      setIntimacoes(prev => prev.filter(i => i.id !== event.id));
    }

    setLastSync(new Date());
  };

  const loadIntimacoes = async () => {
    try {
      const data = await base44.entities.IntimacaoAdvise.list('-dataIntimacao', 50);
      setIntimacoes(data);
    } catch (error) {
      console.error('Erro ao carregar intimações:', error);
    }
  };

  const showNotification = (title, intimacao) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: `Processo: ${intimacao.numeroProcesso}`,
        icon: '/favicon.ico',
        tag: intimacao.id
      });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const manualSync = async () => {
    setSyncStatus('syncing');
    try {
      await loadIntimacoes();
      setSyncStatus('connected');
      setLastSync(new Date());
    } catch (error) {
      setSyncStatus('error');
    }
  };

  const getStatusBadge = () => {
    switch (syncStatus) {
      case 'connected':
        return <Badge className="bg-green-600"><Zap className="w-3 h-3 mr-1" /> Conectado</Badge>;
      case 'syncing':
        return <Badge className="bg-blue-600"><RefreshCw className="w-3 h-3 mr-1 animate-spin" /> Sincronizando</Badge>;
      case 'error':
        return <Badge className="bg-red-600"><AlertCircle className="w-3 h-3 mr-1" /> Erro</Badge>;
      default:
        return <Badge className="bg-gray-600"><Activity className="w-3 h-3 mr-1" /> Aguardando</Badge>;
    }
  };

  return (
    <div className="space-y-4">
      {/* Sync Status Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Sincronização em Tempo Real
            </CardTitle>
            {getStatusBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-3 rounded border border-blue-200">
              <p className="text-xs text-blue-700 font-semibold mb-1">Status</p>
              <p className="text-lg font-bold text-blue-900">
                {isRealtime ? 'Ativo' : 'Inativo'}
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded border border-green-200">
              <p className="text-xs text-green-700 font-semibold mb-1">Novos (Hoje)</p>
              <p className="text-lg font-bold text-green-900">{newCount}</p>
            </div>
            <div className="bg-purple-50 p-3 rounded border border-purple-200">
              <p className="text-xs text-purple-700 font-semibold mb-1">Total</p>
              <p className="text-lg font-bold text-purple-900">{intimacoes.length}</p>
            </div>
            <div className="bg-orange-50 p-3 rounded border border-orange-200">
              <p className="text-xs text-orange-700 font-semibold mb-1">Última Sync</p>
              <p className="text-xs font-semibold text-orange-900">
                {lastSync ? lastSync.toLocaleTimeString('pt-BR') : '--:--'}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={manualSync} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Sincronizar Agora
            </Button>
            <Button onClick={requestNotificationPermission} variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Ativar Notificações
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Feed */}
      {isRealtime && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-900 ml-2">
            <strong>Sincronização Real-time Ativa!</strong> Você receberá atualizações instantâneas 
            quando novas intimações forem detectadas.
          </AlertDescription>
        </Alert>
      )}

      {/* Recent Intimações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Intimações Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {intimacoes.slice(0, 5).map((intimacao, idx) => (
              <div 
                key={intimacao.id || idx} 
                className="p-3 bg-slate-50 rounded border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                <div className="flex justify-between items-start mb-1">
                  <p className="font-semibold text-sm text-gray-900">
                    {intimacao.numeroProcesso}
                  </p>
                  <Badge className={intimacao.statusIntimacao === 'pendente' ? 'bg-orange-600' : 'bg-green-600'}>
                    {intimacao.statusIntimacao}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-1">{intimacao.tipo}</p>
                <p className="text-xs text-gray-500">
                  {new Date(intimacao.dataIntimacao).toLocaleDateString('pt-BR')}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}