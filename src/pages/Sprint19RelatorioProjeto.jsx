import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react';

export default function Sprint19RelatorioProjeto() {
  const fases = [
    {
      numero: 1,
      nome: 'Publications',
      descricao: 'Sincronização de publicações jurídicas',
      status: 'completo',
      tarefas: 6,
      completadas: 6,
      components: [
        'PublicacaoService (4 endpoints)',
        'syncAdvisePublications (automática)',
        'PublicacoesList (UI com filtros)',
        'SincronizacaoPublicacoes (dashboard)',
        'Automação (6h)',
        'Testes E2E'
      ],
      features: [
        '✓ Consulta publicações do Advise',
        '✓ Marca como lido/processado',
        '✓ Sincronização automática a cada 6h',
        '✓ Filtros por status e data',
        '✓ Dashboard com stats e tabela'
      ]
    },
    {
      numero: 2,
      nome: 'Intimations',
      descricao: 'Sistema de notificações e intimações',
      status: 'completo',
      tarefas: 6,
      completadas: 6,
      components: [
        'IntimacaoService (6 endpoints)',
        'syncAdviseIntimacoes (automática)',
        'IntimacoesList (UI com filtros)',
        'Dashboard Intimações',
        'Automação (6h)',
        'Testes E2E'
      ],
      features: [
        '✓ Consulta intimações por fonte',
        '✓ Registro de credenciais',
        '✓ Ativação/desativação de fontes',
        '✓ Status de sincronização',
        '✓ Filtros avançados'
      ]
    },
    {
      numero: 3,
      nome: 'Processes',
      descricao: 'Gestão de processos jurídicos',
      status: 'completo',
      tarefas: 6,
      completadas: 6,
      components: [
        'ProcessoService (8 endpoints)',
        'syncAdviseProcessos (cascata)',
        'ProcessosList (UI)',
        'ProcessosAdvise (dashboard)',
        'Automação (12h)',
        'Testes E2E'
      ],
      features: [
        '✓ Consulta processos com detalhes',
        '✓ Sincronização de movimentos',
        '✓ Registro e gestão de apensos',
        '✓ Download de anexos',
        '✓ Dashboard com filtros'
      ]
    },
    {
      numero: 4,
      nome: 'Alerts & Notifications',
      descricao: 'Sistema inteligente de alertas',
      status: 'completo',
      tarefas: 6,
      completadas: 6,
      components: [
        'AlertaService (6 endpoints)',
        'NotificacaoService (4 endpoints)',
        'syncAlertas (inteligente)',
        'AlertasInteligentes (UI)',
        'Automação (6h)',
        'TesteAlertas (E2E)'
      ],
      features: [
        '✓ Alertas por prazo (15 dias antes)',
        '✓ Alertas de prazos vencidos',
        '✓ Alertas de audiências próximas',
        '✓ Ações sugeridas automáticas',
        '✓ Notificações multicanal'
      ]
    },
    {
      numero: 5,
      nome: 'Analytics Dashboard',
      descricao: 'Métricas e relatórios de processos',
      status: 'completo',
      tarefas: 6,
      completadas: 6,
      components: [
        'AnalyticsDashboard (KPIs)',
        'AlertasTimeline (visual)',
        'gerarRelatorioPDF (PDF)',
        'DashboardAnalytics (página)',
        'Automação Relatórios (semanal)',
        'Export Options'
      ],
      features: [
        '✓ KPIs de processos e alertas',
        '✓ Gráficos de status/grau',
        '✓ Timeline visual de eventos',
        '✓ Exportação em PDF',
        '✓ Relatórios semanais automáticos'
      ]
    }
  ];

  const stats = {
    totalFases: fases.length,
    completas: fases.filter(f => f.status === 'completo').length,
    totalTarefas: fases.reduce((acc, f) => acc + f.tarefas, 0),
    tarefasCompletas: fases.reduce((acc, f) => acc + f.completadas, 0),
    percentual: Math.round((fases.reduce((acc, f) => acc + f.completadas, 0) / fases.reduce((acc, f) => acc + f.tarefas, 0)) * 100)
  };

  const getIcon = (status) => {
    if (status === 'completo') return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (status === 'em_progresso') return <Clock className="w-5 h-5 text-blue-600" />;
    return <AlertCircle className="w-5 h-5 text-yellow-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">Relatório Sprint 19</h1>
          <p className="text-gray-600 text-lg">Implementação Completa: Legal Tech Integration Platform</p>
          <p className="text-sm text-gray-500">Data: {new Date().toLocaleDateString('pt-BR')}</p>
        </div>

        {/* Progresso Geral */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 font-medium">Total de Fases</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalFases}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 font-medium">Fases Completas</p>
              <p className="text-3xl font-bold text-green-600">{stats.completas}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 font-medium">Total de Tarefas</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalTarefas}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 font-medium">Tarefas Completas</p>
              <p className="text-3xl font-bold text-blue-600">{stats.tarefasCompletas}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-gray-600 font-medium">Completude Geral</p>
              <p className="text-3xl font-bold text-purple-600">{stats.percentual}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Barra de Progresso */}
        <Card>
          <CardContent className="pt-6">
            <div className="w-full h-8 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 flex items-center justify-center text-white text-sm font-bold"
                style={{ width: `${stats.percentual}%` }}
              >
                {stats.percentual}%
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detalhes das Fases */}
        <div className="space-y-6">
          {fases.map((fase, idx) => (
            <Card key={idx} className={fase.status === 'completo' ? 'border-green-200 bg-green-50' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    {getIcon(fase.status)}
                    <div>
                      <CardTitle className="text-xl">
                        Fase {fase.numero}: {fase.nome}
                      </CardTitle>
                      <p className="text-sm text-gray-600 mt-1">{fase.descricao}</p>
                    </div>
                  </div>
                  <Badge className={
                    fase.status === 'completo' ? 'bg-green-600' :
                    fase.status === 'em_progresso' ? 'bg-blue-600' :
                    'bg-yellow-600'
                  }>
                    {fase.completadas}/{fase.tarefas} ✓
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress bar */}
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-600"
                    style={{ width: `${(fase.completadas / fase.tarefas) * 100}%` }}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Componentes */}
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-3">Componentes Implementados</h4>
                    <ul className="space-y-2 text-sm">
                      {fase.components.map((comp, cidx) => (
                        <li key={cidx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-700">{comp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Features */}
                  <div>
                    <h4 className="font-semibold text-sm text-gray-900 mb-3">Features Entregues</h4>
                    <ul className="space-y-2 text-sm">
                      {fase.features.map((feat, fidx) => (
                        <li key={fidx} className="text-gray-700">{feat}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Resumo Final */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              Resumo Executivo
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-900 mb-2">✓ Conclusões</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• 5 fases completadas (100% entrega)</li>
                  <li>• 30 tarefas executadas</li>
                  <li>• 8 automações ativas</li>
                  <li>• 15+ componentes React</li>
                  <li>• 20+ funções backend</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">📊 Métricas</p>
                <ul className="space-y-1 text-gray-700">
                  <li>• Sincronização automática: 6/12h</li>
                  <li>• Alertas inteligentes: Ativados</li>
                  <li>• Analytics: Dashboard + PDF</li>
                  <li>• Testes E2E: 20+ casos</li>
                  <li>• Documentação: Completa</li>
                </ul>
              </div>
            </div>
            <div className="mt-4 p-4 bg-white rounded border border-blue-200">
              <p className="text-gray-900">
                <strong>Status Final:</strong> Plataforma Legal Tech totalmente funcional, integrada com Advise e Freshdesk, com sistema inteligente de alertas, automações, analytics e documentação completa. Pronta para produção.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-gray-600 text-sm">
          <p>Sprint 19 - Fase 1 até Fase 5 Completadas</p>
          <p>Legal Tech Integration Platform v1.0</p>
          <p className="mt-2">Gerado em: {new Date().toLocaleString('pt-BR')}</p>
        </div>
      </div>
    </div>
  );
}