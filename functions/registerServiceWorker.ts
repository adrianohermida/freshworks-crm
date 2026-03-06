// functions/registerServiceWorker.js
// Registra o Service Worker para PWA offline

export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/service-worker.js', {
        scope: '/',
        updateViaCache: 'none'
      });
      
      console.log('✅ Service Worker registrado com sucesso:', registration);
      
      // Verificar atualizações periodicamente
      setInterval(() => {
        registration.update();
      }, 60000); // A cada 1 minuto
      
      return {
        success: true,
        registered: true,
        scope: registration.scope
      };
    } catch (error) {
      console.error('❌ Erro ao registrar Service Worker:', error);
      return {
        success: false,
        error: error.message
      };
    }
  } else {
    console.warn('⚠️ Service Worker não suportado neste navegador');
    return {
      success: false,
      error: 'Service Worker não suportado'
    };
  }
}

// Cache strategy: Network-first com fallback para cache
async function handleFetch(event) {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Cache static assets
  if (request.url.includes('/assets/') || request.url.includes('.js') || request.url.includes('.css')) {
    event.respondWith(
      caches.open('v1').then(cache => {
        return cache.match(request).then(response => {
          return response || fetch(request).then(response => {
            cache.put(request, response.clone());
            return response;
          });
        });
      })
    );
  }

  // Network-first for API calls
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const cache = caches.open('api-v1');
          cache.then(c => c.put(request, response.clone()));
          return response;
        })
        .catch(() => {
          return caches.match(request);
        })
    );
  }
}

self.addEventListener('fetch', handleFetch);