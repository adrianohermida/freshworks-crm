import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

/**
 * Custom hook para operações com Publications
 */
export const usePublications = (filters = {}, options = {}) => {
  const queryClient = useQueryClient();

  // ✅ FETCH
  const {
    data: publications = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['publications', filters],
    queryFn: async () => {
      const query = filters.status && filters.status !== 'all' ? { status: filters.status } : {};
      return base44.entities.Publication.filter(query, '-publication_date', 100);
    },
    staleTime: options.staleTime || 30000,
    retry: 2,
    ...options
  });

  // ✅ CREATE
  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.Publication.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
    }
  });

  // ✅ UPDATE
  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Publication.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
    }
  });

  // ✅ DELETE
  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Publication.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publications'] });
    }
  });

  return {
    publications,
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