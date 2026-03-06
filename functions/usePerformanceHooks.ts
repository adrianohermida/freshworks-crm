// functions/usePerformanceHooks.js
// Utility functions para Performance Monitoring - usar em componentes React

/**
 * Função para medir render time de um componente
 * Usar dentro de useEffect
 * 
 * Exemplo:
 * useEffect(() => {
 *   const cleanup = measureRender('MyComponent');
 *   return cleanup;
 * }, []);
 */
export const measureRender = (componentName) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const renderTime = endTime - startTime;
    
    if (renderTime > 50) {
      console.warn(`⚠️ ${componentName} render lento: ${renderTime.toFixed(2)}ms`);
    } else {
      console.log(`✅ ${componentName} render OK: ${renderTime.toFixed(2)}ms`);
    }
  };
};

/**
 * Função para setup de Web Vitals monitoring
 * Chamar no main.jsx da aplicação
 */
export const setupWebVitals = () => {
  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(`📊 ${entry.name}: ${entry.startTime?.toFixed(2) || entry.startTime}ms`);
        }
      });
      observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
      
      return () => observer.disconnect();
    } catch (err) {
      console.error('Error setting up Web Vitals:', err);
    }
  }
};

/**
 * Função para setup de CLS monitoring
 */
export const setupCLSMonitoring = () => {
  let clsValue = 0;
  
  if ('PerformanceObserver' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          console.log(`⚠️ CLS Updated: ${clsValue.toFixed(3)}`);
        }
      }
    });
    
    observer.observe({ entryTypes: ['layout-shift'] });
    return () => observer.disconnect();
  }
};