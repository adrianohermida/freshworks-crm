import { useEffect, useState } from 'react';

/**
 * Hook para gerenciar Push Notifications
 * - Registra service worker
 * - Solicita permissão
 * - Subscreve a push notifications
 * - Sincroniza com backend
 */
export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Verificar suporte
    const supported = 'serviceWorker' in navigator && 'PushManager' in window;
    setIsSupported(supported);

    if (!supported) {
      setIsLoading(false);
      return;
    }

    registerServiceWorkerAndSubscribe();
  }, []);

  const registerServiceWorkerAndSubscribe = async () => {
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.register('/service-worker.js', {
          scope: '/'
        }).catch(() => {
          console.log('[Push] Service Worker registration not available');
          return null;
        });

        if (registration) {
          console.log('[Push] Service Worker registered:', registration);
          const subscription = await registration.pushManager.getSubscription();
          setIsSubscribed(!!subscription);
        }
      }
      setIsLoading(false);
    } catch (err) {
      console.error('[Push] Registration error:', err);
      setError(err.message);
      setIsLoading(false);
    }
  };

  const requestPermission = async () => {
    try {
      if (Notification.permission === 'granted') {
        return true;
      }

      if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
      }

      return false;
    } catch (err) {
      console.error('[Push] Permission error:', err);
      setError(err.message);
      return false;
    }
  };

  const subscribe = async (vapidPublicKey) => {
    try {
      const hasPermission = await requestPermission();
      if (!hasPermission) {
        throw new Error('Notificações negadas pelo usuário');
      }

      const registration = await navigator.serviceWorker.ready;

      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
      });

      console.log('[Push] Subscribed:', subscription);
      setIsSubscribed(true);

      // Enviar subscription para backend
      await sendSubscriptionToServer(subscription);

      return subscription;
    } catch (err) {
      console.error('[Push] Subscribe error:', err);
      setError(err.message);
      throw err;
    }
  };

  const unsubscribe = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        await subscription.unsubscribe();
        setIsSubscribed(false);
        console.log('[Push] Unsubscribed');
      }
    } catch (err) {
      console.error('[Push] Unsubscribe error:', err);
      setError(err.message);
    }
  };

  return {
    isSupported,
    isSubscribed,
    isLoading,
    error,
    subscribe,
    unsubscribe
  };
}

/**
 * Hook para gerenciar Badge API (contador de notificações)
 */
export function useBadge() {
  const [badgeCount, setBadgeCount] = useState(0);

  const isSupported = () => {
    return 'setAppBadge' in navigator && 'clearAppBadge' in navigator;
  };

  const updateBadge = async (count) => {
    try {
      if (isSupported()) {
        if (count > 0) {
          await navigator.setAppBadge(count);
        } else {
          await navigator.clearAppBadge();
        }
      }
      setBadgeCount(count);
    } catch (err) {
      console.error('[Badge] Error:', err);
    }
  };

  const increment = async () => {
    const newCount = badgeCount + 1;
    await updateBadge(newCount);
    return newCount;
  };

  const decrement = async () => {
    const newCount = Math.max(0, badgeCount - 1);
    await updateBadge(newCount);
    return newCount;
  };

  const clear = async () => {
    await updateBadge(0);
  };

  return {
    badgeCount,
    updateBadge,
    increment,
    decrement,
    clear,
    isSupported: isSupported()
  };
}

/**
 * Hook para gerenciar Offline Queue
 */
export function useOfflineQueue() {
  const [queueSize, setQueueSize] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      console.log('[Offline] Online restored');
      setIsOnline(true);
      triggerBackgroundSync();
    };

    const handleOffline = () => {
      console.log('[Offline] Offline detected');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const addToQueue = async (request) => {
    try {
      const db = await openIndexedDB();
      const transaction = db.transaction(['offline-queue'], 'readwrite');
      const store = transaction.objectStore('offline-queue');

      await store.add({
        url: request.url,
        method: request.method,
        headers: request.headers,
        body: request.body,
        timestamp: Date.now()
      });

      updateQueueSize();
      console.log('[Offline] Request queued');
    } catch (err) {
      console.error('[Offline] Queue error:', err);
    }
  };

  const updateQueueSize = async () => {
    try {
      const db = await openIndexedDB();
      const transaction = db.transaction(['offline-queue'], 'readonly');
      const store = transaction.objectStore('offline-queue');
      const count = await store.count();
      setQueueSize(count);
    } catch (err) {
      console.error('[Offline] Count error:', err);
    }
  };

  const triggerBackgroundSync = async () => {
    try {
      const registration = await navigator.serviceWorker.ready;
      if ('sync' in registration) {
        await registration.sync.register('sync-offline-requests');
        console.log('[Offline] Background sync triggered');
      }
    } catch (err) {
      console.error('[Offline] Sync error:', err);
    }
  };

  return {
    queueSize,
    isOnline,
    addToQueue,
    triggerBackgroundSync
  };
}

/**
 * Helpers
 */

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function sendSubscriptionToServer(subscription) {
  try {
    // Este endpoint seria criado no backend para salvar a subscription
    await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(subscription)
    });
  } catch (err) {
    console.error('[Push] Failed to send subscription to server:', err);
  }
}

function openIndexedDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('LegalTasksDB', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('offline-queue')) {
        db.createObjectStore('offline-queue', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}