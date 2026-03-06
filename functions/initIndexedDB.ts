/**
 * Initializes IndexedDB for offline data persistence
 * Called on first app load
 */
export function initIndexedDB() {
  if (!('indexedDB' in window)) {
    console.warn('IndexedDB not available');
    return;
  }

  const request = indexedDB.open('FreshDeskApp', 1);

  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    
    // Create cache store
    if (!db.objectStoreNames.contains('cache')) {
      db.createObjectStore('cache', { keyPath: 'key' });
    }

    // Create sync queue store (for offline actions)
    if (!db.objectStoreNames.contains('syncQueue')) {
      db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true });
    }
  };

  request.onerror = () => {
    console.warn('Failed to initialize IndexedDB');
  };

  return request;
}

// Auto-initialize on load
if (typeof window !== 'undefined') {
  initIndexedDB();
}