import React, { useEffect } from 'react';

export default function ServiceWorkerProvider() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      // Service worker registration is handled differently in Base44
      // Use a timeout to ensure DOM is ready
      setTimeout(() => {
        navigator.serviceWorker.ready
          .then((registration) => {
            console.log('✅ Service Worker ready');
          })
          .catch((error) => {
            console.warn('⚠️ Service Worker not available:', error?.message);
          });
      }, 1000);
    }
  }, []);

  return null;
}