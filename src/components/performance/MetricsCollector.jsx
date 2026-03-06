import React, { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

/**
 * Real-time Metrics Collector
 * Coleta e agrega métricas de performance em tempo real
 */

const MetricsContext = React.createContext(null);

export function MetricsProvider({ children }) {
  const [metrics, setMetrics] = useState({
    api_calls: 0,
    avg_response_time: 0,
    cache_hits: 0,
    cache_misses: 0,
    errors: 0,
    active_connections: 0
  });

  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Coletar métricas a cada 5 segundos
    const interval = setInterval(async () => {
      try {
        const response = await base44.functions.invoke('metricsCollector', {
          action: 'get_metrics'
        });

        setMetrics(response.data);
        setHistory(prev => [...prev.slice(-59), { timestamp: Date.now(), ...response.data }]);
      } catch (error) {
        console.error('Erro ao coletar métricas:', error);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getCacheHitRate = () => {
    const total = metrics.cache_hits + metrics.cache_misses;
    return total === 0 ? 0 : Math.round((metrics.cache_hits / total) * 100);
  };

  const getErrorRate = () => {
    const total = metrics.api_calls + metrics.errors;
    return total === 0 ? 0 : Math.round((metrics.errors / total) * 100);
  };

  const value = {
    metrics,
    history,
    getCacheHitRate,
    getErrorRate,
    trends: {
      response_time: history.length > 1 ? history[history.length - 1].avg_response_time - history[0].avg_response_time : 0,
      error_trend: history.length > 1 ? history[history.length - 1].errors - history[0].errors : 0
    }
  };

  return (
    <MetricsContext.Provider value={value}>
      {children}
    </MetricsContext.Provider>
  );
}

export function useMetrics() {
  const context = React.useContext(MetricsContext);
  if (!context) {
    throw new Error('useMetrics deve ser usado dentro de MetricsProvider');
  }
  return context;
}

/**
 * Hook para rastrear uma operação específica
 */
export function useTrackOperation(operationName) {
  const [isTracking, setIsTracking] = useState(false);

  const track = React.useCallback(async (operation) => {
    setIsTracking(true);
    const startTime = performance.now();

    try {
      const result = await operation();
      const duration = performance.now() - startTime;

      await base44.functions.invoke('metricsCollector', {
        action: 'record_operation',
        operation_name: operationName,
        duration_ms: duration,
        success: true
      });

      return result;
    } catch (error) {
      const duration = performance.now() - startTime;

      await base44.functions.invoke('metricsCollector', {
        action: 'record_operation',
        operation_name: operationName,
        duration_ms: duration,
        success: false,
        error: error.message
      });

      throw error;
    } finally {
      setIsTracking(false);
    }
  }, [operationName]);

  return { track, isTracking };
}