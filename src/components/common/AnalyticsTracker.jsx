import { useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export function useAnalyticsTracker(eventName, properties = {}) {
  useEffect(() => {
    if (!eventName) return;

    const trackEvent = async () => {
      try {
        await base44.functions.invoke('setupAnalytics', {
          eventName,
          properties
        });
      } catch (error) {
        console.error('Analytics tracking error:', error);
      }
    };

    trackEvent();
  }, [eventName, JSON.stringify(properties)]);
}

export function usePerformanceTracking() {
  useEffect(() => {
    const trackPerformance = async () => {
      if (!window.performance) return;

      const perfData = window.performance.timing;
      const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

      // Web Vitals (se disponível)
      const metrics = {
        pageUrl: window.location.href,
        loadTime: pageLoadTime,
        deviceType: /mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
        isMobile: /mobile/i.test(navigator.userAgent),
        browser: getBrowserName(),
        os: getOSName(),
        connectionType: getConnectionType()
      };

      // Se Web Vitals está disponível
      if (window.webVitals) {
        window.webVitals.getCLS((metric) => {
          metrics.cls = metric.value;
          track(metrics);
        });
        window.webVitals.getFCP((metric) => {
          metrics.fcp = metric.value * 1000;
          track(metrics);
        });
        window.webVitals.getLCP((metric) => {
          metrics.lcp = metric.value * 1000;
          track(metrics);
        });
        window.webVitals.getTTI((metric) => {
          metrics.tti = metric.value * 1000;
          track(metrics);
        });
      } else {
        // Fallback para métricas básicas
        metrics.fcp = performance.getEntriesByName('first-contentful-paint')[0]?.startTime || null;
        track(metrics);
      }
    };

    const track = async (metrics) => {
      try {
        await base44.functions.invoke('performanceMonitoring', metrics);
      } catch (error) {
        console.error('Performance tracking error:', error);
      }
    };

    // Aguardar page load
    if (document.readyState === 'complete') {
      setTimeout(trackPerformance, 1000);
    } else {
      window.addEventListener('load', () => {
        setTimeout(trackPerformance, 1000);
      });
    }
  }, []);
}

export function useErrorTracking() {
  useEffect(() => {
    const handleError = (event) => {
      const error = event.error || event;
      
      base44.functions.invoke('errorTracking', {
        type: 'UncaughtError',
        message: error.message || String(error),
        stack: error.stack || '',
        pageUrl: window.location.href,
        severity: 'error',
        userAgent: navigator.userAgent
      }).catch(e => console.error('Error tracking failed:', e));
    };

    const handleUnhandledRejection = (event) => {
      base44.functions.invoke('errorTracking', {
        type: 'UnhandledPromiseRejection',
        message: event.reason?.message || String(event.reason),
        stack: event.reason?.stack || '',
        pageUrl: window.location.href,
        severity: 'error',
        userAgent: navigator.userAgent
      }).catch(e => console.error('Error tracking failed:', e));
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);
}

function getBrowserName() {
  const ua = navigator.userAgent;
  if (ua.indexOf('Firefox') > -1) return 'Firefox';
  if (ua.indexOf('Safari') > -1 && ua.indexOf('Chrome') === -1) return 'Safari';
  if (ua.indexOf('Chrome') > -1) return 'Chrome';
  if (ua.indexOf('Edge') > -1) return 'Edge';
  return 'Unknown';
}

function getOSName() {
  const ua = navigator.userAgent;
  if (ua.indexOf('Win') > -1) return 'Windows';
  if (ua.indexOf('Mac') > -1) return 'macOS';
  if (ua.indexOf('Linux') > -1) return 'Linux';
  if (ua.indexOf('Android') > -1) return 'Android';
  if (ua.indexOf('iOS') > -1 || ua.indexOf('iPhone') > -1) return 'iOS';
  return 'Unknown';
}

function getConnectionType() {
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (!connection) return 'unknown';
  return connection.effectiveType || 'unknown';
}