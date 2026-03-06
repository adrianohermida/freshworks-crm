import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

/**
 * Hook para gerenciar agendamento de sincronizações
 */
export const useScheduleSync = () => {
  // Agendar sincronização
  const scheduleMutation = useMutation({
    mutationFn: async (config) => {
      const response = await base44.functions.invoke('automationEngine', {
        action: 'schedule_sync',
        triggerType: config.triggerType, // 'daily', 'hourly', 'on_demand'
        tribunals: config.tribunals || 'all',
        time: config.time || '02:00', // ISO time
        retryPolicy: config.retryPolicy || {
          maxRetries: 3,
          backoffMultiplier: 2,
          initialDelay: 1000
        }
      });
      return response.data;
    }
  });

  // Cancelar agendamento
  const cancelMutation = useMutation({
    mutationFn: async (scheduleId) => {
      const response = await base44.functions.invoke('automationEngine', {
        action: 'cancel_sync',
        scheduleId
      });
      return response.data;
    }
  });

  return {
    schedule: scheduleMutation.mutateAsync,
    cancel: cancelMutation.mutateAsync,
    isScheduling: scheduleMutation.isPending,
    isCanceling: cancelMutation.isPending
  };
};