import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Smartphone, Wifi, WifiOff, CheckCircle2, AlertCircle } from 'lucide-react';

export default function PWAOptimizer() {
  const [pwaStatus, setPwaStatus] = useState(null);
  const [offline, setOffline] = useState(!navigator.onLine);
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    checkPWASupport();
    
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setInstallPrompt(e);
    });

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const checkPWASupport = async () => {
    const status = {
      isInstalled: window.matchMedia('(display-mode: standalone)').matches,
      serviceWorkerSupported: 'serviceWorker' in navigator,
      serviceWorkerActive: false,
      cacheSupported: 'caches' in window,
      indexedDBSupported: 'indexedDB' in window
    };

    if (status.serviceWorkerSupported) {
      try {
        const reg = await navigator.serviceWorker.getRegistration();
        status.serviceWorkerActive = !!reg && !!reg.active;
      } catch (err) {
        console.error('Erro ao verificar SW:', err);
      }
    }

    setPwaStatus(status);
  };

  const handleInstall = async () => {
    if (installPrompt) {
      installPrompt.prompt();
      const { outcome } = await installPrompt.userChoice;
      if (outcome === 'accepted') {
        setInstallPrompt(null);
      }
    }
  };

  if (!pwaStatus) {
    return <Card className="p-4 text-gray-500">Verificando PWA...</Card>;
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">📱 Status PWA</h3>
          {offline ? (
            <Badge className="bg-red-100 text-red-800 flex gap-1">
              <WifiOff className="w-3 h-3" />
              Offline
            </Badge>
          ) : (
            <Badge className="bg-green-100 text-green-800 flex gap-1">
              <Wifi className="w-3 h-3" />
              Online
            </Badge>
          )}
        </div>

        <div className="space-y-3">
          {/* Status Items */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm">Instalado</span>
            {pwaStatus.isInstalled ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-gray-400" />
            )}
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm">Service Worker</span>
            {pwaStatus.serviceWorkerActive ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            )}
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm">Cache API</span>
            {pwaStatus.cacheSupported ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-gray-400" />
            )}
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-sm">IndexedDB</span>
            {pwaStatus.indexedDBSupported ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <AlertCircle className="w-5 h-5 text-gray-400" />
            )}
          </div>
        </div>

        {installPrompt && !pwaStatus.isInstalled && (
          <button
            onClick={handleInstall}
            className="w-full mt-4 py-2 px-4 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Instalar App
          </button>
        )}
      </Card>

      <Card className="p-4 bg-blue-50 border border-blue-200">
        <p className="text-xs text-blue-800">
          💡 <strong>PWA Offline-First:</strong> Sincronização automática quando voltar online. Cache local para acesso rápido.
        </p>
      </Card>
    </div>
  );
}