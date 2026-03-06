import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Activity, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function AnalyticsDashboard() {
  const [periodo, setPeriodo] = useState('30'); // dias

  // Buscar processos para análise
  const { data: processos = [], isLoading: loadingProcessos } = useQuery({
    queryKey: ['processos-analytics'],
    queryFn: () => base44.entities.ProcessoAdvise.list('-dataSincronizacao', 100)
  });

  // Buscar movimentos
  const { data: movimentos = [], isLoading: loadingMovimentos } = useQuery({
    queryKey: ['movimentos-analytics'],
    queryFn: () => base44.entities.MovimentoProcesso.list('-dataMovimento', 100)
  });

  // Buscar alertas
  const { data: alertas = [] } = useQuery({
    queryKey: ['alertas-analytics'],
    queryFn: () => base44.entities.Alerta.list('-dataOcorrencia', 100)
  });

  // Buscar prazos
  const { data: prazos = [] } = useQuery({
    queryKey: ['prazos-analytics'],
    queryFn: () => base44.entities.PrazoProcessual.list('-dataVencimento', 100)
  });

  // Calcular data limite
  const periodoNum = parseInt(periodo);
  const dataLimite = subDays(new Date(), periodoNum);

  // Filtrar por período
  const processosFiltrados = processos.filter(p => 
    new Date(p.dataSincronizacao) >= dataLimite
  );

  const movimentosFiltrados = movimentos.filter(m =>
    new Date(m.dataMovimento) >= dataLimite
  );

  const alertasFiltrados = alertas.filter(a =>
    new Date(a.dataOcorrencia) >= dataLimite
  );

  // Dados para gráficos
  const statusProcessos = processos.reduce((acc, p) => {
    const item = acc.find(x => x.name === p.statusProcesso);
    if (item) {
      item.value++;
    } else {
      acc.push({ name: p.statusProcesso || 'indefinido', value: 1 });
    }
    return acc;
  }, []);

  const grauProcessos = processos.reduce((acc, p) => {
    const item = acc.find(x => x.name === p.grau);
    if (item) {
      item.value++;
    } else {
      acc.push({ name: p.grau || 'indefinido', value: 1 });
    }
    return acc;
  }, []);

  const severidadeAlertas = alertas.reduce((acc, a) => {
    const item = acc.find(x => x.name === a.severidade);
    if (item) {
      item.value++;
    } else {
      acc.push({ name: a.severidade || 'indefinido', value: 1 });
    }
    return acc;
  }, []);

  // Atividade diária (últimos 7 dias)
  const ultimosSete = Array.from({ length: 7 }, (_, i) => {
    const data = subDays(new Date(), 6 - i);
    return {
      data: format(data, 'dd/MMM', { locale: ptBR }),
      movimentos: movimentos.filter(m => {
        const mData = new Date(m.dataMovimento);
        return mData.toDateString() === data.toDateString();
      }).length,
      alertas: alertas.filter(a => {
        const aData = new Date(a.dataOcorrencia);
        return aData.toDateString() === data.toDateString();
      }).length
    };
  });

  const cores = ['#3b82f6', '#ef4444', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'];

  // KPIs
  const kpis = [
    {
      label: 'Processos Ativos',
      valor: processos.filter(p => p.statusProcesso === 'ativo').length,
      total: processos.length,
      icon: Activity,
      color: 'blue'
    },
    {
      label: 'Prazos Vencidos',
      valor: prazos.filter(p => p.status === 'vencido').length,
      total: prazos.length,
      icon: AlertTriangle,
      color: 'red'
    },
    {
      label: 'Alertas Críticos',
      valor: alertas.filter(a => a.severidade === 'critica').length,
      total: alertas.length,
      icon: AlertTriangle,
      color: 'red'
    },
    {
      label: 'Alertas Resolvidos',
      valor: alertas.filter(a => a.resolvido).length,
      total: alertas.length,
      icon: CheckCircle2,
      color: 'green'
    }
  ];

  const isLoading = loadingProcessos || loadingMovimentos;

  return (
    <div className="space-y-6">
      {/* Header com Período */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics</h2>
        <select
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="7">Últimos 7 dias</option>
          <option value="30">Últimos 30 dias</option>
          <option value="90">Últimos 90 dias</option>
          <option value="365">Último ano</option>
        </select>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => {
          const Icon = kpi.icon;
          const percent = kpi.total > 0 ? Math.round((kpi.valor / kpi.total) * 100) : 0;
          
          return (
            <Card key={idx}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 font-medium">{kpi.label}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{kpi.valor}</p>
                    <p className="text-xs text-gray-500 mt-1">{percent}% do total</p>
                  </div>
                  <Icon className={`w-8 h-8 text-${kpi.color}-400`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status dos Processos */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status dos Processos</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusProcessos}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusProcessos.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Grau de Jurisdição */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Distribuição por Grau</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={grauProcessos}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#3b82f6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Atividade Semanal */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Atividade Semanal</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={ultimosSete}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="data" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="movimentos"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Movimentações"
                    />
                    <Line
                      type="monotone"
                      dataKey="alertas"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="Alertas"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Severidade Alertas */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Alertas por Severidade</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={severidadeAlertas}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Resumo Período */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Resumo do Período</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-gray-600">Processos sincronizados</span>
                  <Badge variant="outline">{processosFiltrados.length}</Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-gray-600">Movimentações</span>
                  <Badge variant="outline">{movimentosFiltrados.length}</Badge>
                </div>
                <div className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm text-gray-600">Alertas criados</span>
                  <Badge className="bg-yellow-100 text-yellow-800">{alertasFiltrados.length}</Badge>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-sm text-gray-600">Prazos vencidos</span>
                  <Badge className="bg-red-100 text-red-800">
                    {prazos.filter(p => p.status === 'vencido').length}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}