import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Smartphone, Wifi, WifiOff, Bell, BellOff, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';

export default function MobileApp() {
  const [deviceStatus, setDeviceStatus] = useState(null);
  const [syncStatus, setSyncStatus] = useState(null);
  const [loading, setLoading] = useState({ init: false, sync: false });
  const [online, setOnline] = useState(true);

  const handleInitialize = async () => {
    setLoading(l => ({ ...l, init: true }));
    const res = await base44.functions.invoke('mobile/mobileAppInitialize', {
      platform: 'web',
      os: navigator.userAgent.includes('Mac') ? 'macOS' : 'Windows'
    });
    setDeviceStatus(res.data);
    setLoading(l => ({ ...l, init: false }));
  };

  const handleSync = async () => {
    setLoading(l => ({ ...l, sync: true }));
    const res = await base44.functions.invoke('mobile/mobileOfflineSync', {
      online,
      pending: 0,
      token: 'push_token_web_demo'
    });
    setSyncStatus(res.data);
    setLoading(l => ({ ...l, sync: false }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-blue-950 p-4 sm:p-6">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-center pt-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-600 mb-4">
            <Smartphone className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">LegalPush Mobile</h1>
          <p className="text-blue-300">MVP — Sprint 15 Phase 1</p>
          <Badge className="mt-2 bg-green-600">✅ Produção</Badge>
        </div>

        {/* Status Bar */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'App Version', value: '1.0.0', color: 'text-blue-400' },
            { label: 'Platform', value: 'Web/PWA', color: 'text-purple-400' },
            { label: 'Status', value: online ? 'Online' : 'Offline', color: online ? 'text-green-400' : 'text-red-400' }
          ].map((s, i) => (
            <Card key={i} className="bg-white/10 border-white/20 text-center">
              <CardContent className="pt-4 pb-3">
                <p className={`text-lg font-bold ${s.color}`}>{s.value}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Device Registration */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-blue-400" />
              Device Registration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {deviceStatus ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-green-400">
                  <CheckCircle2 className="w-5 h-5" />
                  <span className="font-semibold">Dispositivo registrado com sucesso</span>
                </div>
                <div className="bg-black/30 rounded-lg p-3 space-y-2">
                  {[
                    ['Device ID', deviceStatus.device?.id],
                    ['Platform', deviceStatus.device?.platform],
                    ['Usuário', deviceStatus.user?.email],
                    ['Role', deviceStatus.user?.role],
                    ['Sync', deviceStatus.sync?.status]
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between text-sm">
                      <span className="text-gray-400">{k}</span>
                      <span className="text-white font-mono text-xs">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <AlertCircle className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Dispositivo não inicializado</p>
              </div>
            )}
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={handleInitialize}
              disabled={loading.init}
            >
              {loading.init ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Smartphone className="w-4 h-4 mr-2" />
              )}
              {deviceStatus ? 'Re-registrar Dispositivo' : 'Inicializar App'}
            </Button>
          </CardContent>
        </Card>

        {/* Offline Sync */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                {online ? <Wifi className="w-5 h-5 text-green-400" /> : <WifiOff className="w-5 h-5 text-red-400" />}
                Offline Sync Engine
              </div>
              <button
                onClick={() => setOnline(!online)}
                className={`text-xs px-3 py-1 rounded-full border ${online ? 'border-green-400 text-green-400' : 'border-red-400 text-red-400'}`}
              >
                {online ? '🟢 Online' : '🔴 Offline'}
              </button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {syncStatus ? (
              <div className="bg-black/30 rounded-lg p-3 space-y-2">
                {[
                  ['Queue Status', syncStatus.offlineQueue?.status],
                  ['Pending Items', syncStatus.offlineQueue?.pending],
                  ['Push Token', syncStatus.pushToken],
                  ['Last Sync', syncStatus.offlineQueue?.lastSync ? new Date(syncStatus.offlineQueue.lastSync).toLocaleString('pt-BR') : '-'],
                  ['Retry Count', syncStatus.config?.retryCount]
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm">
                    <span className="text-gray-400">{k}</span>
                    <span className="text-white font-mono text-xs">{String(v)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <WifiOff className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400 text-sm">Sync não iniciado</p>
              </div>
            )}
            <Button
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={handleSync}
              disabled={loading.sync}
            >
              {loading.sync ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              {online ? 'Sincronizar Agora' : 'Testar Modo Offline'}
            </Button>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <Card className="bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="text-white">Funcionalidades Mobile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: '📋', label: 'Publicações', desc: 'Offline-first' },
                { icon: '⚖️', label: 'Processos', desc: 'Sincronizado' },
                { icon: '🔔', label: 'Push Alerts', desc: 'Prazos críticos' },
                { icon: '📱', label: 'PWA Ready', desc: 'Instalar no home' },
                { icon: '🔄', label: 'Background Sync', desc: 'Auto sync' },
                { icon: '🔒', label: 'Secure', desc: 'Token auth' }
              ].map((f, i) => (
                <div key={i} className="bg-black/20 rounded-lg p-3 flex items-center gap-3">
                  <span className="text-2xl">{f.icon}</span>
                  <div>
                    <p className="text-white text-sm font-medium">{f.label}</p>
                    <p className="text-gray-400 text-xs">{f.desc}</p>
                  </div>
                  <CheckCircle2 className="w-4 h-4 text-green-400 ml-auto" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}