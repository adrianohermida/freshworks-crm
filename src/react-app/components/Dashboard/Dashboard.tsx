import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import Header from '../Header';
import { ChatWidget } from '../ChatWidget';
import { useSupabaseSession } from '../../hooks/useSupabaseSession';
import { useIsAdmin } from '../../hooks/useIsAdmin';

type DashboardTab = 'overview' | 'crm' | 'processos' | 'financeiro' | 'config';

export const Dashboard = () => {
  const session = useSupabaseSession();
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  if (session === undefined) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-dark">
        <Loader2 className="animate-spin text-brand-primary" size={40} />
      </div>
    );
  }

  if (!session) {
    navigate('/login', { replace: true });
    return null;
  }

  if (!isAdmin) {
    navigate('/portal', { replace: true });
    return null;
  }

  return (
    <div className="min-h-screen bg-brand-dark text-white">
      <Header />
      <main className="pt-28 max-w-7xl mx-auto px-4 pb-12">
        <div className="flex gap-2 mb-6">
          {(['overview', 'crm', 'processos', 'financeiro', 'config'] as DashboardTab[]).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg ${activeTab === tab ? 'bg-brand-primary' : 'bg-white/10'}`}>
              {tab}
            </button>
          ))}
        </div>
        <div className="bg-white/5 rounded-xl p-6">Módulo: {activeTab}</div>
      </main>
      <ChatWidget />
    </div>
  );
};
