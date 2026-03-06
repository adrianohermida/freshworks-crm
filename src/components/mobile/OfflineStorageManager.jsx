import { useState, useEffect } from 'react';

// Offline Storage Manager for Mobile PWA
export const useOfflineStorage = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [pendingActions, setPendingActions] = useState([]);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    loadPendingActions();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const loadPendingActions = () => {
    try {
      const stored = localStorage.getItem('offline_pending_actions');
      if (stored) {
        setPendingActions(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Erro ao carregar ações pendentes:', error);
    }
  };

  const savePendingAction = (action) => {
    const newActions = [...pendingActions, { ...action, timestamp: Date.now() }];
    setPendingActions(newActions);
    localStorage.setItem('offline_pending_actions', JSON.stringify(newActions));
  };

  const clearPendingActions = () => {
    setPendingActions([]);
    localStorage.removeItem('offline_pending_actions');
  };

  const syncPendingActions = async (syncFunction) => {
    if (!isOnline || pendingActions.length === 0) return;

    try {
      for (const action of pendingActions) {
        await syncFunction(action);
      }
      clearPendingActions();
      return { success: true, synced: pendingActions.length };
    } catch (error) {
      console.error('Erro ao sincronizar:', error);
      return { success: false, error };
    }
  };

  return {
    isOnline,
    pendingActions,
    savePendingAction,
    clearPendingActions,
    syncPendingActions
  };
};

// Local data cache for offline access
export const useCachedData = (key, fetchFunction) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadData();
  }, [key]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Try to load from cache first
      const cached = localStorage.getItem(`cache_${key}`);
      if (cached) {
        setData(JSON.parse(cached));
      }

      // Then fetch fresh data if online
      if (navigator.onLine) {
        const fresh = await fetchFunction();
        setData(fresh);
        localStorage.setItem(`cache_${key}`, JSON.stringify(fresh));
      }
    } catch (err) {
      setError(err);
      console.error('Erro ao carregar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => loadData();

  return { data, loading, error, refreshData };
};

export default { useOfflineStorage, useCachedData };