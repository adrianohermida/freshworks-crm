/**
 * useCurrentUser - Hook para obter o usuário atual
 */
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export function useCurrentUser() {
  const { data: user, isLoading } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => base44.auth.me(),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const role = user?.role;
  const isAdmin = role === 'admin';
  const isConsultor = role === 'consultant' || role === 'consultor';
  const isCliente = role === 'client' || role === 'user';

  return { user, isLoading, role, isAdmin, isConsultor, isCliente };
}