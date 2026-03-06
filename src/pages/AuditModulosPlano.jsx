import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle2, Clock, AlertCircle, Zap } from 'lucide-react';

export default function AuditModulosPlano() {
  const modulos = [
    { nome: 'Dashboard', impl: 30, prioridade: 4, pts: 8, status: '🔴 Mock' },
    { nome: 'Publicações/Advise', impl: 60, prioridade: 4, pts: 13, status: '🟡 Parcial' },
    { nome: 'Intimações', impl: 10, prioridade: 5, pts: 21, status: '🔴 Mock' },
    { nome: 'Processos', impl: 10, prioridade: 4, pts: 16, status: '🔴 Mock' },
    { nome: 'Tarefas/Prazos', impl: 20, prioridade: 3, pts: 13, status: '🔴 Mock' },
    { nome: 'Google Calendar', impl: 5, prioridade: 3, pts: 8, status: '🔴 Mock' },
    { nome: 'Relatórios', impl: 0, prioridade: 2, pts: 8, status: '🔴 Mock' },
    { nome: 'Alertas Inteligentes', impl: 0, prioridade: 3, pts: 13, status: '🔴 Mock' },
    { nome: 'Analytics/Auditoria', impl: 30, prioridade: 2, pts: 8, status: '🔴 Mock' },
    { nome: 'Real-time Sync', impl: 40, prioridade: 4, pts: 13, status: '🟡 Parcial' }
  ];

  const sprints = [
    {
      numero: 10,
      tema: 'FUNDAÇÃO',
      dias: 8,
      pts: 40,
      tarefas: [
        '✅ Sync Publicações V2 robusto',
        '✅ Sync Intimações (novo)',
        '✅ Sync Processos (novo)',
        '✅ Sistema de Prazos Automáticos',
        '✅ Alertas Inteligentes',
        '✅ Dashboard com dados reais',
        '✅ Tabelas de listagem'
      ]
    },
    {
      numero: 11,
      tema: 'INTEGRAÇÕES',
      dias: 8,
      pts: 41,
      tarefas: [
        '✅ Google Calendar (bidirecional)',
        '✅ Google Workspace',
        '✅ Notificações (Email + Push)',
        '✅ Freshdesk Integration',
        '✅ Tarefas Automáticas',
        '✅ Analytics Dashboard',
        '✅ PDF/CSV Export'
      ]
    },
    {
      numero: 12,
      tema: 'POLIMENTO',
      dias: 8,
      pts: 40,
      tarefas: [
        '✅ Busca Avançada Multimodal',
        '✅ Otimizações de Query',
        '✅ Cache Inteligente',
        '✅ Performance Mobile',
        '✅ Testes E2E',
        '✅ Validação Robusta',
        '✅ Documentação'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Audit de Módulos & Plano Incremental</h1>
          <p className="text-gray-600">Avaliação de funcionalidade atual e roadmap de implementação 100%</p>
        </div>

        {/* Resumo Executivo */}
        <Alert className="border-red-200 bg-red-50">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-900 ml-2">
            <strong>Status Geral:</strong> Módulos estão 70% em stage "mock" (dados fake, sem integração real). Precisamos implementação 100% de funcionalidade backend + frontend. Estimado: 3 sprints (Sprint 10-12) = 121 story points.
          </AlertDescription>
        </Alert>

        {/* Tabela de Módulos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Matriz de Implementação por Módulo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold">Módulo</th>
                    <th className="text-center py-3 px-4 font-semibold">Impl %</th>
                    <th className="text-center py-3 px-4 font-semibold">Prioridade</th>
                    <th className="text-center py-3 px-4 font-semibold">Pts</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {modulos.map((m, i) => (
                    <tr key={i} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{m.nome}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all ${m.impl > 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ width: `${m.impl}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-600">{m.impl}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="text-lg">{'⭐'.repeat(m.prioridade)}</span>
                      </td>
                      <td className="py-3 px-4 text-center font-semibold">{m.pts}</td>
                      <td className="py-3 px-4">{m.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm">
              <strong>Total:</strong> 121 story points | <strong>Velocidade:</strong> 5 pts/dia | <strong>Estimado:</strong> 3 sprints (24 dias)
            </div>
          </CardContent>
        </Card>

        {/* Problemas Críticos */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="text-red-700">🚨 Problemas Críticos Identificados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Backend - Funções</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>❌ Falta implementação completa dos endpoints Advise (70% apenas)</li>
                <li>❌ Sem tratamento robusto de erros e retry automático</li>
                <li>❌ Sem cache/memoização de dados pesados</li>
                <li>❌ Rate limit básico, não por usuário</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Frontend - Dashboard & Listas</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>❌ Dashboard com queries desativadas (`enabled: false`)</li>
                <li>❌ Sem paginação, busca avançada ou filtros funcionais</li>
                <li>❌ Progresso fake em sincronizadores</li>
                <li>❌ Sem loading states, error handling ou retry</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Dados & Integração</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>❌ Dados mock em produção (Alertas, Tarefas)</li>
                <li>❌ Sem validação de dados antes de salvar</li>
                <li>❌ WebSocket conexão instável para real-time</li>
                <li>❌ Google Calendar/Workspace sem integração real</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Plano de Sprints */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900">📈 Roadmap: 3 Sprints de Implementação</h2>
          
          {sprints.map((sprint) => (
            <Card key={sprint.numero} className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Sprint {sprint.numero}: {sprint.tema}</span>
                  <Badge className="bg-blue-600">{sprint.pts} pts | {sprint.dias} dias</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {sprint.tarefas.map((t, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-800">
                      <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                      {t}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Wins */}
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-700">⚡ Quick Wins (Dia 5 Sprint 10)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-green-900 mb-2">Impacto Alto (30% funcionalidade):</p>
                <ul className="space-y-1 text-green-800">
                  <li>✅ Remover `enabled: false` do Dashboard</li>
                  <li>✅ Retry robusto em syncPublicacoesManual</li>
                  <li>✅ Criar syncIntimacoes básico</li>
                  <li>✅ Calcular prazos automáticos</li>
                  <li>✅ Alertas inteligentes ativados</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-green-900 mb-2">Esforço Baixo (20% trabalho):</p>
                <ul className="space-y-1 text-green-800">
                  <li>🕐 Dia 1: Dashboard queries</li>
                  <li>🕐 Dia 2: Sync Intimações</li>
                  <li>🕐 Dia 3: Prazos automáticos</li>
                  <li>🕐 Dia 4: Alertas</li>
                  <li>🕐 Dia 5: Testing + fix</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Timeline de Conclusão
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <span className="font-semibold">Sprint 10: Fundação</span>
                <span className="text-sm text-gray-600">5-12 Março</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <span className="font-semibold">Sprint 11: Integrações</span>
                <span className="text-sm text-gray-600">12-19 Março</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <span className="font-semibold">Sprint 12: Polimento</span>
                <span className="text-sm text-gray-600">19-26 Março</span>
              </div>
              <div className="mt-4 p-4 bg-green-100 border-2 border-green-600 rounded-lg text-center font-bold text-green-900">
                ✅ CONCLUSÃO ESTIMADA: 14 de Abril, 2026
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notas */}
        <Alert>
          <Zap className="h-5 w-5 text-yellow-600" />
          <AlertDescription className="ml-2 space-y-2 text-sm">
            <p><strong>1.</strong> Não comece Sprint 11 até Sprint 10 estar 100% — integrações dependem de dados sincronizados</p>
            <p><strong>2.</strong> Google OAuth requer app connector setup → 4h de setup</p>
            <p><strong>3.</strong> Rate limit do Advise é agressivo → implementar cache desde Sprint 10</p>
            <p><strong>4.</strong> LGPD é obrigatório → implementar auditoria desde Sprint 10, não deixar para Sprint 12</p>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}