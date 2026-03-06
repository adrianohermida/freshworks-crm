import { useEffect, useState } from 'react';

/**
 * Custom hook for offline data persistence
 * Stores data in IndexedDB and syncs when online
 */
export function useOfflineStorage(key, fallback = null) {
  const [data, setData] = useState(fallback);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if ('indexedDB' in window) {
      const request = indexedDB.open('FreshDeskApp', 1);
      
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['cache'], 'readonly');
        const store = transaction.objectStore('cache');
        const getRequest = store.get(key);

        getRequest.onsuccess = () => {
          if (getRequest.result) {
            setData(getRequest.result.value);
          }
          setIsReady(true);
        };
      };

      request.onerror = () => {
        console.warn('IndexedDB unavailable');
        setIsReady(true);
      };
    } else {
      setIsReady(true);
    }
  }, [key]);

  const saveData = (newData) => {
    setData(newData);
    
    if ('indexedDB' in window) {
      const request = indexedDB.open('FreshDeskApp', 1);
      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction(['cache'], 'readwrite');
        const store = transaction.objectStore('cache');
        store.put({ key, value: newData, timestamp: Date.now() });
      };
    }
  };

  return { data, saveData, isReady };
}