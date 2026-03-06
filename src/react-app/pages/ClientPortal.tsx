import Header from '../components/Header';
import { ChatWidget } from '../components/ChatWidget';
import { useSupabaseSession } from '../hooks/useSupabaseSession';
import { Loader2 } from 'lucide-react';

function ClientPortal() {
  const session = useSupabaseSession();

  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark">
        <Loader2 className="animate-spin text-brand-primary" size={40} />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark text-white">
        Faça login para acessar seu portal.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <Header />
      <main className="pt-28 max-w-5xl mx-auto px-4 pb-16">
        <h1 className="text-3xl font-bold mb-4">Portal do Cliente</h1>
        <p className="text-white/70">Bem-vindo, {session.user.email}.</p>
      </main>
      <ChatWidget />
    </div>
  );
}

export default ClientPortal;
