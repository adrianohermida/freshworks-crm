import React, { useState, useEffect } from 'react';
import { usePushNotifications } from '@/components/hooks/usePushNotifications';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Bell, CheckCircle2, AlertCircle, X } from 'lucide-react';

/**
 * Componente para solicitar permissão de push notifications
 * Aparece uma vez por sessão se ainda não foi ativado
 */
export default function PushNotificationPrompt() {
  const { isSupported, isSubscribed, subscribe, error } = usePushNotifications();
  const [isVisible, setIsVisible] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    // Mostrar prompt apenas se:
    // 1. Navegador suporta
    // 2. Usuário ainda não subscreveu
    // 3. Ainda não foi fechado nesta sessão
    if (isSupported && !isSubscribed && !sessionStorage.getItem('push-prompt-dismissed')) {
      // Esperar 3 segundos antes de mostrar (UX)
      const timer = setTimeout(() => setIsVisible(true), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSupported, isSubscribed]);

  const handleSubscribe = async () => {
    try {
      setIsSubscribing(true);
      // VAPID public key deveria vir do backend/env
      const vapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';
      if (!vapidKey) {
        console.warn('VAPID public key não configurada');
        return;
      }
      await subscribe(vapidKey);
      setIsVisible(false);
      sessionStorage.setItem('push-prompt-dismissed', 'true');
    } catch (err) {
      console.error('Erro ao inscrever em notificações:', err);
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    sessionStorage.setItem('push-prompt-dismissed', 'true');
  };

  if (!isVisible || !isSupported) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Bell className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-base">Notificações Ativas</CardTitle>
                <CardDescription className="text-sm">
                  Receba alertas sobre prazos e atualizações
                </CardDescription>
              </div>
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
          <ul className="text-sm text-gray-600 space-y-1">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              Notificações de prazos
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              Atualizações de processos
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
              Funciona offline
            </li>
          </ul>

          {error && (
            <Alert variant="destructive" className="py-2">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                {error}
              </AlertDescription>
            </Alert>
          )}

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
              onClick={handleSubscribe}
              disabled={isSubscribing}
              className="flex-1"
            >
              {isSubscribing ? 'Ativando...' : 'Ativar'}
            </Button>
          </div>

          <p className="text-xs text-gray-500 text-center">
            Você pode alterar isso nas configurações a qualquer momento
          </p>
        </CardContent>
      </Card>
    </div>
  );
}