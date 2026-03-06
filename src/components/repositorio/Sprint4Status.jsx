import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, AlertCircle, Play } from 'lucide-react';

export default function Sprint4Status() {
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  const executarSprint4 = async () => {
    setLoading(true);
    try {
      const res = await base44.functions.invoke('completarSprint3Compliance', {});
      setResultado(res.data);
    } catch (err) {
      console.error('Erro:', err);
      setResultado({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold">🚀 Sprint 4 - Dashboard Hierárquico</h1>
        <p className="text-gray-600 mt-2">Visualização completa da estrutura tribunal → origem → classe com analytics</p>
      </div>

      <Tabs defaultValue="sprint3-validacao" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sprint3-validacao">Sprint 3 (Validação Final)</TabsTrigger>
          <TabsTrigger value="sprint4-tarefas">Sprint 4 (Em Execução)</TabsTrigger>
          <TabsTrigger value="roadmap">Roadmap 2026</TabsTrigger>
        </TabsList>

        {/* SPRINT 3 - VALIDAÇÃO */}
        <TabsContent value="sprint3-validacao">
          <Card>
            <CardHeader>
              <CardTitle>Conclusão Sprint 3 - Multi-Tenant Compliance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-green-50 dark:bg-green-900 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-2xl font-bold text-green-600">✅ 100%</p>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Tarefas</p>
                  <p className="text-2xl font-bold text-blue-600">4/4</p>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Testes</p>
                  <p className="text-2xl font-bold text-purple-600">4/4</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600">Conformidade</p>
                  <p className="text-2xl font-bold text-orange-600">100%</p>
                </div>
              </div>

              <div className="space-y-3 border-t pt-4">
                <p className="font-semibold text-lg">✅ Tarefas Concluídas:</p>
                {[
                  { titulo: 'Row-Level Security Completo', desc: 'ProcessoUsuario isolando por email' },
                  { titulo: 'Isolamento Multi-Tenant', desc: '4 validações - sem vazamento de dados' },
                  { titulo: 'Compliance CNJ/LGPD', desc: 'Auditoria via AuditLog implementada' },
                  { titulo: 'Testes de Segurança', desc: 'validarIsolamentoMultiTenant com 4 testes' }
                ].map((t, idx) => (
                  <div key={idx} className="flex gap-3 p-3 bg-green-50 dark:bg-green-900 rounded-lg border border-green-200">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-sm">{t.titulo}</p>
                      <p className="text-xs text-gray-600">{t.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button onClick={executarSprint4} disabled={loading} className="w-full gap-2">
                <Play className="w-4 h-4" />
                {loading ? 'Validando...' : 'Validar Conclusão Sprint 3'}
              </Button>

              {resultado && (
                <div className="bg-cyan-50 dark:bg-cyan-900 border border-cyan-200 rounded-lg p-4">
                  <p className="font-semibold text-cyan-900 dark:text-cyan-100 mb-3">✅ Resultado:</p>
                  <div className="space-y-2 text-sm">
                    <p><strong>Status:</strong> {resultado.status}</p>
                    <p><strong>Completude:</strong> {resultado.completude?.percentual}</p>
                    <p><strong>Conformidade:</strong> {resultado.metricas?.conformidade}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* SPRINT 4 */}
        <TabsContent value="sprint4-tarefas">
          <Card>
            <CardHeader>
              <CardTitle>Sprint 4 - Dashboard Hierárquico (Em Execução)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-purple-50 dark:bg-purple-900 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Progresso</p>
                  <p className="text-3xl font-bold text-purple-600">80%</p>
                  <p className="text-xs text-gray-600 mt-2">4/5 tarefas</p>
                </div>
                <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Tarefas</p>
                  <p className="text-3xl font-bold text-yellow-600">5</p>
                </div>
                <div className="bg-cyan-50 dark:bg-cyan-900 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Duração Est.</p>
                  <p className="text-3xl font-bold text-cyan-600">1d</p>
                </div>
              </div>

              <div className="space-y-3 border-t pt-4">
                <p className="font-semibold text-lg">📋 Tarefas Sprint 4:</p>
                {[
                  { title: 'Dashboard Hierárquico Visual', status: 'done', desc: 'Tribunal → Origem → Classe (DashboardHierarquia.jsx)' },
                  { title: 'Gráficos de Distribuição', status: 'done', desc: 'Pie chart, bar chart com Recharts' },
                  { title: 'Progresso de Sincronização', status: 'done', desc: 'Line chart com % progresso/tribunal' },
                  { title: 'Stats & Métricas', status: 'done', desc: 'Cards com total tribunais, processos, ativos' },
                  { title: 'Testes E2E do Dashboard', status: 'todo', desc: 'Validar performance e responsividade' }
                ].map((t, idx) => (
                  <div key={idx} className="flex gap-3 p-3 rounded-lg border" style={{
                    backgroundColor: t.status === 'done' ? '#f0fdf4' : '#fffbeb',
                    borderColor: t.status === 'done' ? '#bbf7d0' : '#fcd34d'
                  }}>
                    {t.status === 'done' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Circle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{t.title}</p>
                      <p className="text-xs text-gray-600">{t.desc}</p>
                    </div>
                    <span className="text-xs font-bold" style={{color: t.status === 'done' ? '#16a34a' : '#d97706'}}>
                      {t.status === 'done' ? '✅' : '⏳'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ROADMAP */}
        <TabsContent value="roadmap">
          <Card>
            <CardHeader>
              <CardTitle>🗺️ Roadmap Completo 2026</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-left">Sprint</th>
                      <th className="px-4 py-2 text-left">Fase</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">% Completo</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-2">
                    {[
                      { sprint: 1, fase: 'Foundação (Entidades, Sync, Interface)', status: '✅ CONCLUÍDO', pct: 100 },
                      { sprint: 2, fase: 'Busca Avançada (Litigante, Filtros, Cache)', status: '✅ CONCLUÍDO', pct: 100 },
                      { sprint: 3, fase: 'Multi-Tenant (RLS, Compliance, Testes)', status: '✅ CONCLUÍDO', pct: 100 },
                      { sprint: 4, fase: 'Dashboard Hierárquico (Vizuais, Gráficos)', status: '🚀 EM EXECUÇÃO', pct: 80 },
                      { sprint: 5, fase: 'Sincronização Contínua (Webhooks, Fallback)', status: '⏳ PLANEJADO', pct: 0 },
                      { sprint: 6, fase: 'Otimizações GA (Performance, Mobile)', status: '⏳ PLANEJADO', pct: 0 }
                    ].map((r, idx) => (
                      <tr key={idx} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-4 py-3 font-bold">Sprint {r.sprint}</td>
                        <td className="px-4 py-3">{r.fase}</td>
                        <td className="px-4 py-3 text-center">{r.status}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all" 
                                style={{
                                  width: `${r.pct}%`,
                                  backgroundColor: r.pct === 100 ? '#10b981' : r.pct >= 50 ? '#f59e0b' : '#ef4444'
                                }}
                              />
                            </div>
                            <span className="text-xs font-bold">{r.pct}%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 rounded-lg p-4 mt-4">
                <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">📊 Progresso Geral do Repositório:</p>
                <div className="space-y-2 text-sm text-blue-900 dark:text-blue-100">
                  <p><strong>Sprints Concluídos:</strong> 3/6 (50%)</p>
                  <p><strong>Sprints em Execução:</strong> 1/6 (Sprint 4)</p>
                  <p><strong>Completude Geral:</strong> ~60% do plano</p>
                  <p><strong>ETA Conclusão:</strong> Final de Março 2026</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}