import React, { useEffect, useState } from 'react';
import { AlertCircle, Wifi, WifiOff } from 'lucide-react';

export default function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg p-3 shadow-lg z-40">
      <div className="flex items-center gap-3">
        <WifiOff className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Você está offline
          </p>
          <p className="text-xs text-yellow-700 dark:text-yellow-300">
            Aguardando reconexão...
          </p>
        </div>
      </div>
    </div>
  );
}