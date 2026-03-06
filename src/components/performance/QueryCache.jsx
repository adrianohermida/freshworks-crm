import React, { createContext, useContext, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';

/**
 * Cache Layer para otimizar queries recorrentes
 * Implementa cache em memória com invalidação automática
 */

const CacheContext = createContext(null);

export function CacheProvider({ children }) {
  const queryClient = useQueryClient();
  const cacheRef = React.useRef(new Map());

  const getCached = useCallback((key, fetcher, options = {}) => {
    const cacheKey = JSON.stringify(key);
    const ttl = options.ttl || 5 * 60 * 1000; // 5min default

    if (cacheRef.current.has(cacheKey)) {
      const cached = cacheRef.current.get(cacheKey);
      if (Date.now() - cached.timestamp < ttl) {
        return cached.data;
      }
    }

    const data = fetcher();
    cacheRef.current.set(cacheKey, {
      data,
      timestamp: Date.now()
    });

    return data;
  }, []);

  const invalidateCache = useCallback((pattern) => {
    const regex = new RegExp(pattern);
    for (const key of cacheRef.current.keys()) {
      if (regex.test(key)) {
        cacheRef.current.delete(key);
      }
    }
  }, []);

  const clearCache = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  return (
    <CacheContext.Provider value={{ getCached, invalidateCache, clearCache }}>
      {children}
    </CacheContext.Provider>
  );
}

export function useCache() {
  const context = useContext(CacheContext);
  if (!context) {
    throw new Error('useCache deve ser usado dentro de CacheProvider');
  }
  return context;
}

/**
 * Hook para listar com cache automático
 */
export function useListWithCache(entityName, options = {}) {
  const { getCached, invalidateCache } = useCache();

  return getCached(
    [entityName, options],
    () => {
      // Retorna função que faz o fetch real
      return { entityName, options };
    },
    { ttl: options.cacheTtl || 5 * 60 * 1000 }
  );
}