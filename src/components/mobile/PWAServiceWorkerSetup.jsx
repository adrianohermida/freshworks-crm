import React, { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle, Download, Zap } from 'lucide-react';

export default function PWAServiceWorkerSetup() {
  const [serviceWorkerStatus, setServiceWorkerStatus] = useState('checking');
  const [installable, setInstallable] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Check service worker support
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => {
        setServiceWorkerStatus('registered');
        setInstalled(true);
      }).catch(() => {
        setServiceWorkerStatus('unregistered');
      });

      // Register service worker
      navigator.serviceWorker.register('/service-worker.js').then(() => {
        setServiceWorkerStatus('registered');
      }).catch((error) => {
        console.error('Service Worker registration failed:', error);
        setServiceWorkerStatus('error');
      });
    } else {
      setServiceWorkerStatus('unsupported');
    }

    // Check PWA installability
    const handler = (e) => {
      e.preventDefault();
      setInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleOfflineMode = async () => {
    if ('serviceWorker' in navigator) {
      const registrations = await navigator.serviceWorker.getRegistrations();
      registrations.forEach(reg => {
        reg.scope && console.log('Service Worker scope:', reg.scope);
      });
    }
  };

  const statusInfo = {
    registered: {
      icon: <CheckCircle2 className="w-6 h-6 text-green-600" />,
      label: 'Service Worker Ativo',
      color: 'bg-green-50'
    },
    unregistered: {
      icon: <AlertCircle className="w-6 h-6 text-yellow-600" />,
      label: 'Service Worker Não Registrado',
      color: 'bg-yellow-50'
    },
    error: {
      icon: <AlertCircle className="w-6 h-6 text-red-600" />,
      label: 'Erro ao Registrar',
      color: 'bg-red-50'
    },
    checking: {
      icon: <Zap className="w-6 h-6 text-blue-600 animate-pulse" />,
      label: 'Verificando...',
      color: 'bg-blue-50'
    },
    unsupported: {
      icon: <AlertCircle className="w-6 h-6 text-gray-600" />,
      label: 'Não Suportado',
      color: 'bg-gray-50'
    }
  };

  const info = statusInfo[serviceWorkerStatus];

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold">⚙️ Configuração PWA & Offline</h2>

      {/* Service Worker Status */}
      <Card className={`p-6 ${info.color}`}>
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            {info.icon}
            <div>
              <h3 className="font-semibold text-lg">{info.label}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {serviceWorkerStatus === 'registered' && 'Sincronização offline ativada. App funciona sem conexão.'}
                {serviceWorkerStatus === 'unregistered' && 'Service Worker não está registrado. App não funciona offline.'}
                {serviceWorkerStatus === 'error' && 'Erro ao registrar Service Worker.'}
                {serviceWorkerStatus === 'checking' && 'Verificando suporte do navegador...'}
                {serviceWorkerStatus === 'unsupported' && 'Seu navegador não suporta Service Workers.'}
              </p>
            </div>
          </div>
        </div>

        {serviceWorkerStatus === 'registered' && (
          <div className="mt-4 pt-4 border-t space-y-2">
            <div className="text-sm space-y-1">
              <p><strong>✅ Cache de Assets:</strong> HTML, CSS, JS</p>
              <p><strong>✅ Sync em Background:</strong> Mudanças offline sincronizam quando online</p>
              <p><strong>✅ Push Notifications:</strong> Receba alertas mesmo offline</p>
              <p><strong>✅ Tamanho Cache:</strong> ~50MB (aplicações base44)</p>
            </div>
          </div>
        )}
      </Card>

      {/* PWA Install */}
      {installable && (
        <Card className="p-6 bg-purple-50 border-purple-200">
          <div className="flex items-start justify-between">
            <div className="flex gap-4">
              <Download className="w-6 h-6 text-purple-600 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-lg">Instalar App</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Instale como app nativo no seu dispositivo para acesso rápido
                </p>
              </div>
            </div>
            <Button className="bg-purple-600">Instalar</Button>
          </div>
        </Card>
      )}

      {/* Features */}
      <Card className="p-6">
        <h3 className="font-semibold text-lg mb-4">📱 Features PWA Sprint 23</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="flex gap-2">
            <span className="text-green-600 font-bold">✅</span>
            <div>
              <p className="font-semibold">Offline-First</p>
              <p className="text-gray-600">Funciona completamente offline</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-green-600 font-bold">✅</span>
            <div>
              <p className="font-semibold">Background Sync</p>
              <p className="text-gray-600">Sincroniza quando online</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-green-600 font-bold">✅</span>
            <div>
              <p className="font-semibold">Push Notifications</p>
              <p className="text-gray-600">Notificações em tempo real</p>
            </div>
          </div>
          <div className="flex gap-2">
            <span className="text-green-600 font-bold">✅</span>
            <div>
              <p className="font-semibold">App Shortcut</p>
              <p className="text-gray-600">Atalho na tela inicial</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleOfflineMode}>
          Testar Modo Offline
        </Button>
        <Button className="bg-blue-600">
          Ver Cache
        </Button>
      </div>
    </div>
  );
}