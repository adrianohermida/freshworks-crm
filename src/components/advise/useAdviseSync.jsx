import { useState, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

export function useAdviseSync() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const sync = useCallback(async (action, payload = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await base44.functions.invoke('adviseIntegration', {
        action,
        payload
      });
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Erro ao sincronizar');
      }
      
      setResult(response.data.data);
      return response.data.data;
    } catch (err) {
      const message = err.response?.data?.error || err.message || 'Erro desconhecido';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, result, sync };
}