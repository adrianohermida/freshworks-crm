import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { base44 } from '@/api/base44Client';
import { 
  Bell, FileText, Scale, AlertCircle, Calendar, 
  TrendingUp, Activity, Menu, Search 
} from 'lucide-react';

export default function MobileHomeScreen() {
  const [stats, setStats] = useState({
    intimacoesPendentes: 0,
    publicacoesNovas: 0,
    prazosProximos: 0,
    processosAtivos: 0
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const currentUser = await base44.auth.me();
      setUser(currentUser);

      const [intimacoes, publicacoes, prazos, processos] = await Promise.all([
        base44.entities.IntimacaoAdvise.filter({ statusIntimacao: 'pendente' }),
        base44.entities.PublicacaoAdvise.filter({ lido: false }),
        base44.entities.PrazoProcessual.filter({ status: 'aberto' }),
        base44.entities.ProcessoAdvise.filter({ statusProcesso: 'ativo' })
      ]);

      setStats({
        intimacoesPendentes: intimacoes.length,
        publicacoesNovas: publicacoes.length,
        prazosProximos: prazos.length,
        processosAtivos: processos.length
      });
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { icon: FileText, label: 'Publicações', count: stats.publicacoesNovas, color: 'bg-blue-500', path: '/PublicacoesAdvise' },
    { icon: Bell, label: 'Intimações', count: stats.intimacoesPendentes, color: 'bg-red-500', path: '/Intimacoes' },
    { icon: Scale, label: 'Processos', count: stats.processosAtivos, color: 'bg-green-500', path: '/ProcessosAdvise' },
    { icon: AlertCircle, label: 'Prazos', count: stats.prazosProximos, color: 'bg-orange-500', path: '/Tarefas' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      {/* Mobile Header */}
      <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-slate-800 rounded-lg">
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-lg font-bold">LegalPush</h1>
              <p className="text-xs text-slate-400">Olá, {user?.full_name || 'Usuário'}</p>
            </div>
          </div>
          <button className="p-2 hover:bg-slate-800 rounded-lg">
            <Search className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4 pb-20">
        {/* Quick Stats */}
        <Card className="bg-gradient-to-br from-indigo-600 to-purple-600 border-none text-white">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Resumo do Dia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                <p className="text-xs opacity-90">Intimações</p>
                <p className="text-2xl font-bold">{stats.intimacoesPendentes}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                <p className="text-xs opacity-90">Publicações</p>
                <p className="text-2xl font-bold">{stats.publicacoesNovas}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                <p className="text-xs opacity-90">Prazos</p>
                <p className="text-2xl font-bold">{stats.prazosProximos}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-lg">
                <p className="text-xs opacity-90">Processos</p>
                <p className="text-2xl font-bold">{stats.processosAtivos}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Ações Rápidas</h3>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action, idx) => (
              <Card 
                key={idx} 
                className="bg-slate-800 border-slate-700 hover:bg-slate-750 cursor-pointer transition-all"
                onClick={() => window.location.href = action.path}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`${action.color} p-3 rounded-lg`}>
                      <action.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-400">{action.label}</p>
                      <p className="text-xl font-bold text-white">{action.count}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide">Atividades Recentes</h3>
          <Card className="bg-slate-800 border-slate-700">
            <CardContent className="p-4 space-y-3">
              {[
                { icon: Bell, text: 'Nova intimação recebida', time: '2h atrás', color: 'text-red-400' },
                { icon: FileText, text: '3 publicações sincronizadas', time: '5h atrás', color: 'text-blue-400' },
                { icon: Calendar, text: 'Prazo se aproximando', time: '1d atrás', color: 'text-orange-400' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 pb-3 border-b border-slate-700 last:border-0 last:pb-0">
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                  <div className="flex-1">
                    <p className="text-sm text-white">{item.text}</p>
                    <p className="text-xs text-slate-400">{item.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Performance Badge */}
        <Card className="bg-gradient-to-r from-green-600 to-emerald-600 border-none text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs opacity-90">Performance Mensal</p>
                <p className="text-2xl font-bold">95%</p>
              </div>
              <TrendingUp className="w-8 h-8 opacity-80" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-700 px-4 py-3">
        <div className="flex justify-around items-center">
          {[
            { icon: Activity, label: 'Início', active: true },
            { icon: FileText, label: 'Docs' },
            { icon: Bell, label: 'Alertas' },
            { icon: Scale, label: 'Processos' }
          ].map((item, idx) => (
            <button key={idx} className="flex flex-col items-center gap-1">
              <item.icon className={`w-6 h-6 ${item.active ? 'text-indigo-400' : 'text-slate-400'}`} />
              <span className={`text-xs ${item.active ? 'text-indigo-400' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}