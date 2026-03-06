import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

/**
 * Hook para gerenciar analytics com cache otimizado
 * - Deduplicação automática de requisições simultâneas
 * - Cache agressivo para reduzir requisições
 * - Refetch seletivo apenas quando necessário
 */
export const useAnalytics = () => {
  const queryClient = useQueryClient();

  // Track event
  const trackEvent = useMutation({
    mutationFn: async (eventData) => {
      const response = await base44.functions.invoke('trackAnalyticsEvent', eventData);
      return response.data;
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 30000)
  });

  // Fetch metrics (otimizado com cache agressivo)
  const {
    data: metrics,
    isLoading: metricsLoading,
    refetch: refetchMetrics
  } = useQuery({
    queryKey: ['analytics-metrics'],
    queryFn: async () => {
      const response = await base44.functions.invoke('aggregateAnalyticsMetrics', {
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        endDate: new Date().toISOString()
      });
      return response.data;
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 2, // retry automático em caso de erro
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 30000) // exponential backoff
  });

  // Generate report
  const generateReport = useMutation({
    mutationFn: async (options) => {
      const response = await base44.functions.invoke('generateAnalyticsReport', options);
      return response.data;
    },
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * Math.pow(2, attemptIndex), 30000)
  });

  return {
    trackEvent: trackEvent.mutateAsync,
    isTracking: trackEvent.isPending,
    metrics: metrics?.metrics || null,
    events: metrics?.rawEvents || [],
    metricsLoading,
    refetchMetrics,
    generateReport: generateReport.mutateAsync,
    isGeneratingReport: generateReport.isPending
  };
};