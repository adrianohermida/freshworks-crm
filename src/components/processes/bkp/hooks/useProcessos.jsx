/**
 * useProcessos - Hook multi-tenant para busca de processos
 * Aplica filtro automático por role: admin vê tudo, consultor vê os seus, cliente vê os dele
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export const PROCESSOS_QUERY_KEY = 'processos';

export function useProcessos({ user, role, clienteId } = {}) {
  const queryClient = useQueryClient();

  const { data: processos = [], isLoading } = useQuery({
    queryKey: [PROCESSOS_QUERY_KEY, role, user?.email, clienteId],
    queryFn: async () => {
      const todos = await base44.entities.ProcessoCEJUSC.filter({}, '-created_date', 500);

      if (role === 'admin') return todos;

      if (role === 'consultant' || role === 'consultor') {
        return todos.filter(p =>
          p.consultor_responsavel_email === user?.email ||
          p.created_by === user?.email
        );
      }

      // cliente
      if (clienteId) return todos.filter(p => p.cliente_id === clienteId);
      if (user?.email) return todos.filter(p => p.cliente_email === user.email);
      return [];
    },
    enabled: !!role,
    staleTime: 30 * 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.ProcessoCEJUSC.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PROCESSOS_QUERY_KEY] });
      toast.success('Processo removido');
    },
    onError: (e) => toast.error('Erro ao remover: ' + e.message),
  });

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: [PROCESSOS_QUERY_KEY] });
  }

  return { processos, isLoading, deleteMutation, invalidate };
}

export function useProcessoFilters(processos = []) {
  function apply(filters) {
    return processos.filter(p => {
      const matchSearch = !filters.search ||
        p.numero_processo?.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.descricao?.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.cliente_nome?.toLowerCase().includes(filters.search.toLowerCase());
      const matchStatus = !filters.status || filters.status === 'todos' || p.status === filters.status;
      const matchTipo = !filters.tipo || filters.tipo === 'todos' || p.tipo === filters.tipo;
      const matchTribunal = !filters.tribunal || p.tribunal === filters.tribunal;
      return matchSearch && matchStatus && matchTipo && matchTribunal;
    });
  }

  function kpis(list = processos) {
    return {
      total: list.length,
      abertos: list.filter(p => p.status === 'aberto').length,
      emAudiencia: list.filter(p => p.status === 'em_audiencia').length,
      acordos: list.filter(p => p.status === 'acordo').length,
      finalizados: list.filter(p => p.status === 'finalizado' || p.status === 'cancelado').length,
      sincronizados: list.filter(p => !!p.ultima_sincronizacao).length,
    };
  }

  return { apply, kpis };
}