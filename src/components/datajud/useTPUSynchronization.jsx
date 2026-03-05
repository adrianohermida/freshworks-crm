import { useState, useCallback } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

/**
 * Hook centralizado para sincronização TPU
 * Gerencia: busca de métricas, sincronização de tabelas, importação de dados
 */
export const useTPUSynchronization = () => {
  const queryClient = useQueryClient();
  const [syncProgress, setSyncProgress] = useState({});

  // Buscar métricas de uma tabela TPU
  const fetchMetrics = useMutation({
    mutationFn: async (tipo) => {
      const response = await base44.functions.invoke('buscarTPU', {
        tipo,
        buscarMetricas: true
      });
      return response.data?.metricas || {};
    },
    onError: (error) => {
      toast.error(`Erro ao buscar métricas de ${tipo}: ${error.message}`);
    }
  });

  // Sincronizar tabela com SGT
  const syncTable = useMutation({
    mutationFn: async ({ tipo, options = {} }) => {
      setSyncProgress(prev => ({ ...prev, [tipo]: 'sincronizando' }));
      const response = await base44.functions.invoke('sincronizarTPUViaSgt', {
        tipo,
        ...options
      });
      setSyncProgress(prev => ({ ...prev, [tipo]: 'concluido' }));
      return response.data;
    },
    onSuccess: (data, { tipo }) => {
      queryClient.invalidateQueries({ queryKey: ['tpu_metrics', tipo] });
      toast.success(`${tipo} sincronizado com sucesso`);
    },
    onError: (error, { tipo }) => {
      setSyncProgress(prev => ({ ...prev, [tipo]: 'erro' }));
      toast.error(`Erro ao sincronizar ${tipo}: ${error.message}`);
    }
  });

  // Importar dados SQL
  const importSQLData = useMutation({
    mutationFn: async ({ tipo, sqlFile }) => {
      const formData = new FormData();
      formData.append('tipo', tipo);
      formData.append('file', sqlFile);
      
      const response = await base44.functions.invoke('importarTPUSql', {
        tipo,
        sqlContent: await sqlFile.text()
      });
      return response.data;
    },
    onSuccess: (data, { tipo }) => {
      queryClient.invalidateQueries({ queryKey: ['tpu_data', tipo] });
      toast.success(`Dados de ${tipo} importados com sucesso`);
    },
    onError: (error, { tipo }) => {
      toast.error(`Erro ao importar ${tipo}: ${error.message}`);
    }
  });

  // Limpar cache de sincronização
  const clearSyncCache = useCallback((tipo) => {
    queryClient.invalidateQueries({ queryKey: ['tpu_metrics', tipo] });
    queryClient.invalidateQueries({ queryKey: ['tpu_data', tipo] });
  }, [queryClient]);

  return {
    // Mutations
    fetchMetrics: fetchMetrics.mutateAsync,
    syncTable: syncTable.mutateAsync,
    importSQLData: importSQLData.mutateAsync,
    
    // State
    isFetching: fetchMetrics.isPending,
    isSyncing: syncTable.isPending,
    isImporting: importSQLData.isPending,
    syncProgress,
    
    // Utilities
    clearSyncCache
  };
};

/**
 * Hook para gerenciar todas as métricas TPU de uma vez
 */
export const useAllTPUMetrics = () => {
  const TABELAS = ['classes', 'assuntos', 'movimentos', 'documentos'];
  
  const { data: metricas = {}, isLoading } = useQuery({
    queryKey: ['all_tpu_metrics'],
    queryFn: async () => {
      const results = await Promise.all(
        TABELAS.map(async (tipo) => {
          try {
            const response = await base44.functions.invoke('buscarTPU', {
              tipo,
              buscarMetricas: true
            });
            return [tipo, response.data?.metricas || {}];
          } catch (err) {
            console.warn(`Erro ao buscar métricas de ${tipo}:`, err);
            return [tipo, {}];
          }
        })
      );
      
      return Object.fromEntries(results);
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
    refetchOnWindowFocus: false
  });

  return { metricas, isLoading };
};