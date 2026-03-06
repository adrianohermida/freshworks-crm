import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, TrendingUp, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const CORES = ['#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

export default function DashboardFinanceiro() {
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  if (userLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--brand-primary)]" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <p className="text-red-600 font-medium">Acesso restrito ao administrativo</p>
      </div>
    );
  }

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: () => base44.entities.Escritorio.list(),
    enabled: !!user
  });

  const { data: transacoes = [] } = useQuery({
    queryKey: ['transacoes-dashboard'],
    queryFn: () => base44.entities.TransacaoFinanceira.filter({
      escritorio_id: escritorio?.[0]?.id
    }),
    enabled: !!escritorio?.[0]?.id
  });

  const { data: honorarios = [] } = useQuery({
    queryKey: ['honorarios-dashboard'],
    queryFn: () => base44.entities.Honorario.filter({
      escritorio_id: escritorio?.[0]?.id
    }),
    enabled: !!escritorio?.[0]?.id
  });

  // Calcular métricas
  const totalReceita = transacoes
    .filter(t => t.tipo === 'receita')
    .reduce((sum, t) => sum + (t.valor || 0), 0);

  const totalDespesa = transacoes
    .filter(t => ['custa', 'despesa'].includes(t.tipo))
    .reduce((sum, t) => sum + (t.valor || 0), 0);

  const totalHonorarios = honorarios.reduce((sum, h) => sum + (h.valor_total || 0), 0);
  const totalHonorariosPago = honorarios.reduce((sum, h) => sum + (h.valor_pago || 0), 0);

  const lucro = totalReceita - totalDespesa - totalHonorarios;

  // Dados por tipo
  const porTipo = [
    { name: 'Receitas', value: totalReceita },
    { name: 'Despesas', value: totalDespesa },
    { name: 'Honorários', value: totalHonorarios }
  ].filter(d => d.value > 0);

  // Dados por status
  const porStatus = [
    {
      name: 'Pago',
      value: transacoes.filter(t => t.status === 'pago').length
    },
    {
      name: 'Pendente',
      value: transacoes.filter(t => t.status === 'pendente').length
    },
    {
      name: 'Vencido',
      value: transacoes.filter(t => t.status === 'vencido').length
    }
  ];

  const statusHonorarios = [
    { status: 'pago', count: honorarios.filter(h => h.status === 'pago').length },
    { status: 'parcialmente_pago', count: honorarios.filter(h => h.status === 'parcialmente_pago').length },
    { status: 'pendente', count: honorarios.filter(h => h.status === 'pendente').length }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[var(--text-primary)] mb-8">Dashboard Financeiro</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Receita Total</p>
                <p className="text-2xl font-bold text-green-600">R$ {totalReceita.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Despesa Total</p>
                <p className="text-2xl font-bold text-red-600">R$ {totalDespesa.toFixed(2)}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Honorários</p>
                <p className="text-2xl font-bold text-blue-600">R$ {totalHonorarios.toFixed(2)}</p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={lucro >= 0 ? 'bg-green-50' : 'bg-red-50'}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Lucro/Prejuízo</p>
                <p className={`text-2xl font-bold ${lucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  R$ {lucro.toFixed(2)}
                </p>
              </div>
              <CheckCircle2 className={`w-8 h-8 ${lucro >= 0 ? 'text-green-500' : 'text-red-500'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos */}
      <Tabs defaultValue="receitas" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="receitas">Receitas vs Despesas</TabsTrigger>
          <TabsTrigger value="tipos">Por Tipo</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
        </TabsList>

        <TabsContent value="receitas" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Fluxo de Caixa</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { name: 'Receitas', value: totalReceita },
                  { name: 'Despesas', value: totalDespesa },
                  { name: 'Honorários', value: totalHonorarios }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tipos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Tipo</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={porTipo}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: R$ ${value.toFixed(0)}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {porTipo.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Transações por Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {porStatus.map(item => (
                    <div key={item.name} className="flex items-center justify-between p-3 rounded-lg border">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-2xl font-bold">{item.value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Honorários por Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {statusHonorarios.map(item => (
                    <div key={item.status} className="flex items-center justify-between p-3 rounded-lg border">
                      <p className="font-medium capitalize">{item.status.replace(/_/g, ' ')}</p>
                      <p className="text-2xl font-bold">{item.count}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}