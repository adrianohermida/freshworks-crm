import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Download, X, Check } from 'lucide-react';

/**
 * Componente para exibir PWA Install Prompt customizado
 * Aparece quando a PWA pode ser instalada no home screen
 */
export default function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detectar se a PWA pode ser instalada
    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setIsVisible(true);
      console.log('[PWA] Install prompt disponível');
    };

    // Detectar se foi instalada
    const handleAppInstalled = () => {
      console.log('[PWA] App foi instalada');
      setIsInstalled(true);
      setIsVisible(false);
      setDeferredPrompt(null);
      localStorage.setItem('pwa-installed', 'true');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Verificar se já foi instalada
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      console.log('[PWA] App instalado com sucesso');
      setIsVisible(false);
    } else {
      console.log('[PWA] Instalação cancelada');
    }

    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('pwa-install-dismissed', 'true');
  };

  if (!isVisible || isInstalled) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-40 max-w-sm animate-in slide-in-from-bottom-4">
      <Card className="shadow-2xl">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-base flex items-center gap-2">
                <Download className="w-5 h-5 text-blue-600" />
                Instalar Legal Tasks
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                Acesse direto da sua tela inicial
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              className="h-6 w-6 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <Alert className="border-blue-200 bg-blue-50">
            <Check className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800 text-sm">
              ✓ Funciona offline  
              ✓ Sincronização automática  
              ✓ Notificações push
            </AlertDescription>
          </Alert>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleDismiss}
              className="flex-1"
            >
              Agora não
            </Button>
            <Button
              size="sm"
              onClick={handleInstall}
              className="flex-1 gap-1"
            >
              <Download className="w-4 h-4" />
              Instalar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}