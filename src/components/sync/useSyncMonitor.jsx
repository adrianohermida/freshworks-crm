import { useQuery, useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export const useSyncMonitor = () => {
  // Monitorar sincronizações ativas
  const {
    data: activeSyncs = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['sync-monitor'],
    queryFn: () => base44.entities.Analytics.filter(
      { event_type: 'process_synced' },
      '-timestamp',
      50
    ),
    refetchInterval: 5000, // Atualizar a cada 5s
    staleTime: 0
  });

  // Iniciar sincronização SGT CNJ
  const syncMutation = useMutation({
    mutationFn: async (tribunalAlias) => {
      const response = await base44.functions.invoke('consultarSGT', {
        tribunalAlias,
        action: 'sync_all'
      });
      return response.data;
    },
    onSuccess: () => {
      refetch();
    }
  });

  // Obter estatísticas de sincronização
  const {
    data: stats = {},
    isLoading: statsLoading
  } = useQuery({
    queryKey: ['sync-stats'],
    queryFn: async () => {
      const syncs = await base44.entities.Analytics.filter(
        { event_type: 'process_synced' },
        '-timestamp',
        100
      );

      return {
        totalSynced: syncs.length,
        successCount: syncs.filter(s => s.status === 'success').length,
        errorCount: syncs.filter(s => s.status === 'error').length,
        lastSync: syncs[0]?.timestamp,
        byTribunal: Object.groupBy?.(syncs, s => s.metadata?.tribunal) || {}
      };
    },
    refetchInterval: 10000
  });

  return {
    activeSyncs,
    isLoading,
    stats,
    statsLoading,
    startSync: syncMutation.mutateAsync,
    isSyncing: syncMutation.isPending,
    refetch
  };
};