import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../utils/supabaseClient';

interface AuthUser {
  id?: string;
  email?: string;
  name?: string;
  avatar_url?: string;
  isAdmin?: boolean;
  [key: string]: any;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  refreshUser: async () => {},
  logout: async () => {},
});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('users-me');
      if (error) {
        setUser(null);
      } else {
        setUser(data && data.email ? data : null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let unsub: any = null;

    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user) fetchUser();
      else setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) fetchUser();
      else {
        setUser(null);
        setLoading(false);
      }
    });

    unsub = listener?.subscription;
    return () => unsub?.unsubscribe();
  }, [fetchUser]);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setLoading(false);
  }, []);

  return <AuthContext.Provider value={{ user, loading, refreshUser: fetchUser, logout }}>{children}</AuthContext.Provider>;
};
