import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { ChevronDown, ChevronUp } from 'lucide-react';

export default function DashboardHierarquia() {
  const [expandedTribunal, setExpandedTribunal] = useState(null);
  const [tribunais, setTribunais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});

  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Buscar tribunais com hierarquia
        const resp = await base44.entities.TribunalHierarquia.list();
        
        // Agrupar por categoria
        const agrupadosPorCategoria = {};
        resp.forEach(t => {
          if (!agrupadosPorCategoria[t.categoria]) {
            agrupadosPorCategoria[t.categoria] = [];
          }
          agrupadosPorCategoria[t.categoria].push({
            ...t,
            processos: Math.floor(Math.random() * 500) + 10 // Mock
          });
        });

        setTribunais(agrupadosPorCategoria);

        // Calcular stats
        const totalProcessos = resp.reduce((sum, t) => sum + (t.total_processos || 0), 0);
        const statsData = {
          totalTribunais: resp.length,
          totalProcessos,
          tribunaisAtivos: resp.filter(t => t.ativo).length,
          distribuicaoPorCategoria: Object.entries(agrupadosPorCategoria).map(([cat, items]) => ({
            categoria: cat.charAt(0).toUpperCase() + cat.slice(1),
            quantidade: items.length
          }))
        };

        setStats(statsData);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, []);

  const COLORS = ['#06b6d4', '#0891b2', '#06b6d4', '#f97316', '#8b5cf6'];

  if (loading) {
    return <div className="p-6">Carregando hierarquia...</div>;
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Hierárquico - Tribunais</h1>
        <p className="text-gray-600 mt-2">Estrutura de tribunais, origens e classes processais</p>
      </div>

      {/* Cards de Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Total de Tribunais</p>
            <p className="text-4xl font-bold text-cyan-600">{stats.totalTribunais || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Processos Sincronizados</p>
            <p className="text-4xl font-bold text-green-600">{stats.totalProcessos?.toLocaleString() || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-gray-600">Tribunais Ativos</p>
            <p className="text-4xl font-bold text-orange-600">{stats.tribunaisAtivos || 0}</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="hierarquia" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="hierarquia">Hierarquia</TabsTrigger>
          <TabsTrigger value="graficos">Gráficos</TabsTrigger>
          <TabsTrigger value="progresso">Progresso</TabsTrigger>
        </TabsList>

        {/* HIERARQUIA */}
        <TabsContent value="hierarquia">
          <Card>
            <CardHeader>
              <CardTitle>Estrutura de Tribunais por Categoria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(tribunais).map(([categoria, items]) => (
                <div key={categoria} className="border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedTribunal(expandedTribunal === categoria ? null : categoria)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 flex justify-between items-center font-semibold"
                  >
                    <span className="capitalize text-lg">{categoria}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600 bg-white dark:bg-gray-700 px-3 py-1 rounded-full">
                        {items.length} tribunais
                      </span>
                      {expandedTribunal === categoria ? <ChevronUp /> : <ChevronDown />}
                    </div>
                  </button>

                  {expandedTribunal === categoria && (
                    <div className="p-4 bg-white dark:bg-gray-900 space-y-3">
                      {items.map((tribunal, idx) => (
                        <div key={idx} className="border-l-4 border-cyan-500 pl-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-semibold">{tribunal.nome_tribunal}</p>
                              <p className="text-sm text-gray-600">{tribunal.codigo_tribunal}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                {tribunal.municipio}, {tribunal.estado}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-cyan-600">{tribunal.total_processos || 0}</p>
                              <p className="text-xs text-gray-600">processos</p>
                              {tribunal.ativo && (
                                <span className="inline-block mt-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                                  Ativo
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* GRÁFICOS */}
        <TabsContent value="graficos">
          <div className="space-y-6">
            {/* Distribuição por Categoria */}
            <Card>
              <CardHeader>
                <CardTitle>Distribuição de Tribunais por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats.distribuicaoPorCategoria || []}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ categoria, quantidade }) => `${categoria}: ${quantidade}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="quantidade"
                    >
                      {(stats.distribuicaoPorCategoria || []).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Tribunais por Distribuição */}
            <Card>
              <CardHeader>
                <CardTitle>Tribunais por Categoria (Horizontal)</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart
                    data={stats.distribuicaoPorCategoria || []}
                    layout="vertical"
                    margin={{ top: 5, right: 30, left: 150, bottom: 5 }}
                  >
                    <XAxis type="number" />
                    <YAxis dataKey="categoria" type="category" width={140} />
                    <Tooltip />
                    <Bar dataKey="quantidade" fill="#06b6d4" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* PROGRESSO */}
        <TabsContent value="progresso">
          <Card>
            <CardHeader>
              <CardTitle>Progresso de Sincronização por Tribunal</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={[
                    { tribunal: 'TJSP', progresso: 95, sincronizado: 4800, pendente: 250 },
                    { tribunal: 'TJRJ', progresso: 87, sincronizado: 3200, pendente: 480 },
                    { tribunal: 'TRF1', progresso: 92, sincronizado: 2100, pendente: 180 },
                    { tribunal: 'TRF2', progresso: 78, sincronizado: 1500, pendente: 420 },
                    { tribunal: 'TRT', progresso: 88, sincronizado: 2800, pendente: 370 }
                  ]}
                  margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
                >
                  <XAxis dataKey="tribunal" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="progresso" stroke="#06b6d4" name="% Progresso" />
                  <Line type="monotone" dataKey="sincronizado" stroke="#10b981" name="Sincronizados" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}