import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useSupabaseSession } from '../hooks/useSupabaseSession';

interface AuthProtectProps {
  children: ReactNode;
}

function AuthProtect({ children }: AuthProtectProps) {
  const session = useSupabaseSession();

  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <Loader2 className="animate-spin text-brand-primary" size={36} />
      </div>
    );
  }

  if (!session?.user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default AuthProtect;
