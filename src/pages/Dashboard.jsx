import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Clock, CheckCircle, Zap, TrendingUp, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { PieChart, Pie, Cell, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { toast } from 'sonner';

// Dashboard Components
import KPICard from '../components/dashboard/KPICard';
import StatusChart from '../components/dashboard/StatusChart';
import PriorityChart from '../components/dashboard/PriorityChart';
import TimelineChart from '../components/dashboard/TimelineChart';
import AgentPerformanceList from '../components/dashboard/AgentPerformanceList';
import SentimentCard from '../components/dashboard/SentimentCard';
import AgentResolutionMetrics from '../components/dashboard/AgentResolutionMetrics';
import SLAComplianceCard from '../components/dashboard/SLAComplianceCard';
import AnalyticsTrendingChart from '../components/dashboard/AnalyticsTrendingChart';

// Tickets Components
import SLAMonitor from '../components/tickets/SLAMonitor';
import SentimentAnalysis from '../components/tickets/SentimentAnalysis';
import ReportGenerator from '../components/tickets/ReportGenerator';

// Common Components
import PageLayout from '../components/common/PageLayout';
import Analytics from '../components/Analytics';



export default function DashboardPage() {
  const { data: tickets = [], isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => {
      try {
        return await base44.entities.Ticket.list();
      } catch (error) {
        console.error('Erro ao carregar tickets:', error);
        return [];
      }
    },
    initialData: [],
    refetchInterval: 30000,
    staleTime: 10000
  });

  // Estatísticas (memoized para performance)
  const stats = useMemo(() => ({
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open').length,
    pending: tickets.filter(t => t.status === 'pending').length,
    resolved: tickets.filter(t => t.status === 'resolved').length,
    closed: tickets.filter(t => t.status === 'closed').length,
    urgent: tickets.filter(t => t.priority === 'urgent').length,
    avgResolutionTime: calculateAvgResolutionTime(tickets)
  }), [tickets]);

  // Dados para gráficos (memoized)
  const statusData = useMemo(() => [
    { name: 'Aberto', value: stats.open, fill: COLORS.open },
    { name: 'Pendente', value: stats.pending, fill: COLORS.pending },
    { name: 'Resolvido', value: stats.resolved, fill: COLORS.resolved },
    { name: 'Fechado', value: stats.closed, fill: COLORS.closed }
  ], [stats]);

  const priorityData = useMemo(() => [
    { name: 'Urgente', value: tickets.filter(t => t.priority === 'urgent').length },
    { name: 'Alta', value: tickets.filter(t => t.priority === 'high').length },
    { name: 'Média', value: tickets.filter(t => t.priority === 'medium').length },
    { name: 'Baixa', value: tickets.filter(t => t.priority === 'low').length }
  ], [tickets]);

  const timelineData = useMemo(() => generateTimelineData(tickets), [tickets]);
  const agentPerformance = useMemo(() => getAgentPerformance(tickets), [tickets]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 animate-pulse">
            <div className="h-10 bg-slate-200 dark:bg-slate-700 rounded w-1/4 mb-2" />
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!tickets || tickets.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">Nenhum ticket encontrado</h2>
            <p className="text-gray-600 mb-4">Sincronize seus tickets do Freshdesk para começar</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Recarregar
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <Analytics eventName="dashboard_view" properties={{ ticketCount: tickets.length }} />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">Dashboard</h1>
            <p className="text-slate-600 dark:text-slate-400">Visão geral de tickets e performance</p>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatCard
              icon={<AlertCircle className="w-6 h-6" />}
              label="Total de Tickets"
              value={stats.total}
              color="bg-blue-50 dark:bg-blue-900/20"
              textColor="text-blue-600"
            />
            <StatCard
              icon={<Clock className="w-6 h-6" />}
              label="Abertos"
              value={stats.open}
              color="bg-red-50 dark:bg-red-900/20"
              textColor="text-red-600"
              sublabel="Em atendimento"
            />
            <StatCard
              icon={<TrendingUp className="w-6 h-6" />}
              label="Pendentes"
              value={stats.pending}
              color="bg-amber-50 dark:bg-amber-900/20"
              textColor="text-amber-600"
            />
            <StatCard
              icon={<CheckCircle className="w-6 h-6" />}
              label="Resolvidos"
              value={stats.resolved}
              color="bg-green-50 dark:bg-green-900/20"
              textColor="text-green-600"
            />
            <StatCard
              icon={<Zap className="w-6 h-6" />}
              label="Urgentes"
              value={stats.urgent}
              color="bg-purple-50 dark:bg-purple-900/20"
              textColor="text-purple-600"
            />
          </div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Status Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Status</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Priority Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Prioridade</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#0f766e" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Sentiment Analysis */}
          <div className="mb-8">
            <SentimentAnalysis tickets={tickets} />
          </div>

          {/* Timeline & Agent Performance */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
             <TimelineChart data={timelineData} />
             <SLAMonitor tickets={tickets} />
             <AgentPerformanceList agents={agentPerformance} />
             <AgentResolutionMetrics tickets={tickets} />
           </div>

           {/* SLA Compliance */}
            <div className="mb-8">
              <SLAComplianceCard tickets={tickets} />
            </div>

            {/* Analytics Trending */}
            <div className="mb-8">
              <AnalyticsTrendingChart />
            </div>

           {/* Report Generator */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Gerar Relatórios & Exportar</CardTitle>
              <div className="flex gap-2">
                <ReportGenerator tickets={tickets} />
                <ExportButton />
              </div>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 dark:text-gray-400">
              Exporte dados de tickets em PDF ou CSV com métricas completas, análise de sentimento e desempenho de agentes.
            </CardContent>
          </Card>

          {/* Analytics Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumo Analítico</CardTitle>
            </CardHeader>
            <CardContent>
              <AnalyticsSummary tickets={tickets} />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}

function ExportButton() {
  const handleExport = async () => {
    try {
      const response = await base44.functions.invoke('exportTickets', { 
        format: 'csv'
      });

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      toast.success('Dados exportados com sucesso!');
    } catch (error) {
      toast.error('Erro ao exportar: ' + error.message);
    }
  };

  return (
    <button 
      onClick={handleExport}
      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
    >
      Exportar CSV
    </button>
  );
}

function AnalyticsSummary({ tickets }) {
  const analytics = useMemo(() => {
    const resolved = tickets.filter(t => t.status === 'resolved');
    const avgResolutionTime = resolved.length > 0
      ? resolved.reduce((sum, t) => {
          const created = new Date(t.created_date);
          const updated = new Date(t.updated_date);
          return sum + (updated - created);
        }, 0) / resolved.length / (1000 * 60 * 60)
      : 0;

    const overdueSLA = tickets.filter(t => {
      const created = new Date(t.created_date);
      const now = new Date();
      const ageHours = (now - created) / (1000 * 60 * 60);
      return ageHours > 24 && t.status !== 'resolved';
    }).length;

    return {
      avgResolutionTime: avgResolutionTime.toFixed(2),
      overdueSLA,
      resolutionRate: tickets.length > 0 
        ? ((resolved.length / tickets.length) * 100).toFixed(1)
        : 0
    };
  }, [tickets]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Tempo Médio de Resolução</p>
        <p className="text-2xl font-bold text-blue-600">{analytics.avgResolutionTime}h</p>
      </div>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Taxa de Resolução</p>
        <p className="text-2xl font-bold text-green-600">{analytics.resolutionRate}%</p>
      </div>
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">SLA em Risco</p>
        <p className="text-2xl font-bold text-red-600">{analytics.overdueSLA}</p>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, color, textColor, sublabel }) {
  return (
    <Card className={`${color} border-0`}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{label}</p>
            <p className={`text-3xl font-bold ${textColor} mt-2`}>{value}</p>
            {sublabel && <p className="text-xs text-gray-500 mt-1">{sublabel}</p>}
          </div>
          <div className={`${textColor} opacity-20`}>{icon}</div>
        </div>
      </CardContent>
    </Card>
  );
}

const COLORS = {
  open: '#ef4444',
  pending: '#f59e0b',
  resolved: '#10b981',
  closed: '#6b7280'
};

function calculateAvgResolutionTime(tickets) {
  const resolved = tickets.filter(t => t.status === 'resolved');
  if (resolved.length === 0) return 0;
  
  const times = resolved.map(t => {
    const created = new Date(t.created_date);
    const updated = new Date(t.updated_date);
    return (updated - created) / (1000 * 60 * 60); // hours
  });
  
  return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
}

function generateTimelineData(tickets) {
  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateStr = format(date, 'dd/MM', { locale: ptBR });
    
    const created = tickets.filter(t => 
      format(new Date(t.created_date), 'dd/MM', { locale: ptBR }) === dateStr
    ).length;
    
    const resolved = tickets.filter(t => 
      t.status === 'resolved' && format(new Date(t.updated_date), 'dd/MM', { locale: ptBR }) === dateStr
    ).length;
    
    last7Days.push({ date: dateStr, created, resolved });
  }
  return last7Days;
}

function getAgentPerformance(tickets) {
  const agentMap = {};
  
  tickets.forEach(ticket => {
    if (ticket.assigned_agent_name) {
      agentMap[ticket.assigned_agent_name] = (agentMap[ticket.assigned_agent_name] || 0) + 1;
    }
  });
  
  return Object.entries(agentMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}