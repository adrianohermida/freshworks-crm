import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

// Hook customizado para CRUD ProcessoCEJUSC
export function useProcessoCEJUSCCRUD() {
  const queryClient = useQueryClient();

  // List com cache
  const list = useQuery({
    queryKey: ['processos-cejusc'],
    queryFn: async () => {
      const data = await base44.entities.ProcessoCEJUSC.list('-updated_date', 100);
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // 5 min cache
  });

  // Get single
  const get = async (id) => {
    return base44.entities.ProcessoCEJUSC.get?.(id) || null;
  };

  // Create
  const createMutation = useMutation({
    mutationFn: async (data) => {
      if (!data.numero_processo) throw new Error('Número de processo é obrigatório');
      return base44.entities.ProcessoCEJUSC.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processos-cejusc'] });
      toast.success('Processo criado com sucesso');
    },
    onError: (err) => toast.error(err.message),
  });

  // Update
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return base44.entities.ProcessoCEJUSC.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processos-cejusc'] });
      toast.success('Processo atualizado');
    },
    onError: (err) => toast.error(err.message),
  });

  // Delete
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return base44.entities.ProcessoCEJUSC.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processos-cejusc'] });
      toast.success('Processo removido');
    },
    onError: (err) => toast.error(err.message),
  });

  // Bulk update status
  const bulkUpdateStatus = useMutation({
    mutationFn: async ({ ids, status }) => {
      const promises = ids.map(id =>
        base44.entities.ProcessoCEJUSC.update(id, { status })
      );
      return Promise.all(promises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['processos-cejusc'] });
      toast.success('Status atualizado em lote');
    },
  });

  return {
    list,
    get,
    create: createMutation.mutate,
    update: updateMutation.mutate,
    delete: deleteMutation.mutate,
    bulkUpdateStatus: bulkUpdateStatus.mutate,
    isLoading:
      createMutation.isPending ||
      updateMutation.isPending ||
      deleteMutation.isPending,
  };
}