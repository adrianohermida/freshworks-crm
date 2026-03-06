import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

/**
 * Hook: Sincronismo em Background
 * Sincroniza dados automaticamente quando app volta online
 */
export function useSyncBackground() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState(null);
  const [syncError, setError] = useState(null);

  const sync = async (tipo = null) => {
    try {
      setIsSyncing(true);
      setError(null);

      const response = await base44.functions.invoke('backgroundSync', {
        tipo,
        force: false
      });

      setLastSync(new Date());
      return response.data;
    } catch (err) {
      setError(err.message);
      console.error('Erro ao sincronizar:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    // Sincronizar quando app volta online
    const handleOnline = () => {
      console.log('App voltou online, sincronizando...');
      sync();
    };

    // Sincronizar periodicamente (a cada 5 minutos)
    const syncInterval = setInterval(() => {
      sync();
    }, 5 * 60 * 1000);

    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('online', handleOnline);
      clearInterval(syncInterval);
    };
  }, []);

  return { sync, isSyncing, lastSync, syncError };
}