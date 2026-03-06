import { useEffect, useState } from 'react';
import { base44 } from '@/api/base44Client';

export function useAdminAuth() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        
        if (!currentUser || currentUser.role !== 'admin') {
          setError('Acesso negado. Apenas administradores podem acessar.');
          setUser(null);
          return;
        }

        setUser(currentUser);
        setError(null);
      } catch (err) {
        setError('Erro ao verificar autenticação');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, isLoading, error, isAdmin: user?.role === 'admin' };
}