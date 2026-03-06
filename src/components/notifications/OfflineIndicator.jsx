import React from 'react';
import { useOfflineQueue } from '@/components/hooks/usePushNotifications';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wifi, WifiOff, Loader2 } from 'lucide-react';

/**
 * Componente para indicar status offline e tamanho da fila
 */
export default function OfflineIndicator() {
  const { isOnline, queueSize } = useOfflineQueue();

  if (isOnline && queueSize === 0) {
    return null;
  }

  if (!isOnline) {
    return (
      <Alert className="border-yellow-300 bg-yellow-50 rounded-b-none fixed top-0 left-0 right-0 z-40">
        <WifiOff className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800 ml-2">
          Você está offline. As ações serão sincronizadas quando reconectado.
          {queueSize > 0 && ` (${queueSize} pendente)`}
        </AlertDescription>
      </Alert>
    );
  }

  if (queueSize > 0) {
    return (
      <Alert className="border-blue-300 bg-blue-50 rounded-b-none fixed top-0 left-0 right-0 z-40">
        <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
        <AlertDescription className="text-blue-800 ml-2">
          Sincronizando {queueSize} ação{queueSize !== 1 ? 's' : ''} pendente{queueSize !== 1 ? 's' : ''}...
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}