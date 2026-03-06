import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export const useTPUSync = () => {
  const queryClient = useQueryClient();

  // Sincronizar tabelas
  const syncMutation = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('syncTPUTables', {});
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tpu-assuntos'] });
      queryClient.invalidateQueries({ queryKey: ['tpu-classes'] });
      queryClient.invalidateQueries({ queryKey: ['tpu-movimentos'] });
      queryClient.invalidateQueries({ queryKey: ['tpu-documentos'] });
      queryClient.invalidateQueries({ queryKey: ['tpu-stats'] });
    }
  });

  // Fetch Assuntos
  const { data: assuntos = [], isLoading: loadingAssuntos } = useQuery({
    queryKey: ['tpu-assuntos'],
    queryFn: () => base44.entities.TPUAssuntos.list('-codigo', 1000),
    staleTime: 5 * 60 * 1000
  });

  // Fetch Classes
  const { data: classes = [], isLoading: loadingClasses } = useQuery({
    queryKey: ['tpu-classes'],
    queryFn: () => base44.entities.TPUClasses.list('-codigo', 1000),
    staleTime: 5 * 60 * 1000
  });

  // Fetch Movimentos
  const { data: movimentos = [], isLoading: loadingMovimentos } = useQuery({
    queryKey: ['tpu-movimentos'],
    queryFn: () => base44.entities.TPUMovimentos.list('-codigo', 1000),
    staleTime: 5 * 60 * 1000
  });

  // Fetch Documentos
  const { data: documentos = [], isLoading: loadingDocumentos } = useQuery({
    queryKey: ['tpu-documentos'],
    queryFn: () => base44.entities.TPUDocumentos.list('-codigo', 1000),
    staleTime: 5 * 60 * 1000
  });

  // Fetch Stats
  const { data: stats = {} } = useQuery({
    queryKey: ['tpu-stats'],
    queryFn: async () => ({
      assuntos: assuntos.length,
      classes: classes.length,
      movimentos: movimentos.length,
      documentos: documentos.length,
      total: assuntos.length + classes.length + movimentos.length + documentos.length
    }),
    enabled: !!assuntos.length
  });

  return {
    sync: syncMutation.mutateAsync,
    isSyncing: syncMutation.isPending,
    assuntos,
    classes,
    movimentos,
    documentos,
    stats,
    isLoading: loadingAssuntos || loadingClasses || loadingMovimentos || loadingDocumentos
  };
};