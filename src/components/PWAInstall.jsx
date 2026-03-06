import React, { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Check if already installed
    if (window.navigator.standalone === true) {
      setShowPrompt(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 max-w-sm animate-in slide-in-from-bottom-5">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-border p-4">
        <div className="flex justify-between items-start gap-3">
          <div className="flex items-start gap-3">
            <Download className="w-5 h-5 text-turquoise-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-sm text-foreground">
                Instalar aplicativo
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Acesse offline e na tela inicial
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowPrompt(false)}
            className="text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            onClick={handleInstall}
            size="sm"
            className="flex-1 bg-turquoise-600 hover:bg-turquoise-700"
          >
            Instalar
          </Button>
          <Button
            onClick={() => setShowPrompt(false)}
            size="sm"
            variant="outline"
            className="flex-1"
          >
            Depois
          </Button>
        </div>
      </div>
    </div>
  );
}