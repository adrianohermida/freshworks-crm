import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

/**
 * Custom hook para operações com Deadlines
 */
export const useDeadlines = (filters = {}, options = {}) => {
  const queryClient = useQueryClient();

  // ✅ FETCH
  const {
    data: deadlines = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['deadlines', filters],
    queryFn: async () => {
      const query = filters.status && filters.status !== 'all' ? { status: filters.status } : {};
      return base44.entities.Deadline.filter(query, '-deadline_date', 100);
    },
    staleTime: options.staleTime || 30000,
    retry: 2,
    ...options
  });

  // ✅ CREATE
  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Deadline.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deadlines'] });
    }
  });

  // ✅ UPDATE
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Deadline.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deadlines'] });
    }
  });

  // ✅ DELETE
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Deadline.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deadlines'] });
    }
  });

  return {
    deadlines,
    isLoading,
    error,
    refetch,
    create: createMutation.mutateAsync,
    update: updateMutation.mutateAsync,
    delete: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending
  };
};