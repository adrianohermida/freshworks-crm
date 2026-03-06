import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

/**
 * Custom hook para gerenciar testes de endpoints
 */
export const useEndpointTests = () => {
  const queryClient = useQueryClient();

  // ✅ FETCH COURTS
  const {
    data: courts = [],
    isLoading,
    refetch
  } = useQuery({
    queryKey: ['courts'],
    queryFn: () => base44.entities.Court.filter({}, '-category', 100),
    staleTime: 30000
  });

  // ✅ TEST ENDPOINT - Com testes 2 e 3
  const testMutation = useMutation({
    mutationFn: async (court) => {
      // Test 2: Discovery
      const discoveryRes = await base44.functions.invoke('testDatajudEndpointV2', {
        courtAlias: court.alias,
        testType: 'discovery'
      });
      
      // Test 3: Query
      const queryRes = await base44.functions.invoke('testDatajudEndpointV2', {
        courtAlias: court.alias,
        testType: 'query'
      });

      return {
        ...discoveryRes.data,
        queryTest: queryRes.data
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courts'] });
    }
  });

  // ✅ FETCH TEST HISTORY
  const {
    data: testHistory = [],
    isLoading: historyLoading
  } = useQuery({
    queryKey: ['endpoint-tests'],
    queryFn: () => base44.entities.EndpointTest.filter({}, '-tested_at', 50)
  });

  // ✅ SEED ENDPOINTS
  const seedMutation = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('seedCourtEndpoints', {});
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courts'] });
      window.dispatchEvent(new CustomEvent('toast', {
        detail: { type: 'success', message: 'Endpoints carregados com sucesso' }
      }));
    },
    onError: () => {
      window.dispatchEvent(new CustomEvent('toast', {
        detail: { type: 'error', message: 'Erro ao carregar endpoints (admin only)' }
      }));
    }
  });

  return {
    courts,
    isLoading,
    testHistory,
    historyLoading,
    test: testMutation.mutateAsync,
    isTesting: testMutation.isPending,
    seed: seedMutation.mutateAsync,
    isSeeding: seedMutation.isPending,
    refetch
  };
};