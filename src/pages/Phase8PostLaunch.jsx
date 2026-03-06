import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Flame, AlertTriangle, TrendingUp, Users, Bug } from 'lucide-react';

export default function Phase8PostLaunch() {
  const [selectedSprint, setSelectedSprint] = useState('8.1');

  const sprints = {
    '8.1': {
      name: 'Sprint 8.1: Monitoramento & Hotfixes',
      duration: '04/03/2026 — CONCLUÍDO',
      hours: 16,
      status: 'completed',
      description: 'Acompanhamento imediato do go-live — 5/5 tasks, zero incidentes críticos.',
      tasks: [
        { id: 1, title: 'Monitorar métricas de produção em tempo real', hours: 4, type: 'monitoring', note: '99.97% uptime — Grafana ativo' },
        { id: 2, title: 'Responder a alertas críticos 24/7', hours: 6, type: 'support', note: '0 alertas críticos, latência estabilizada' },
        { id: 3, title: 'Hotfix: race condition TPU import batch', hours: 3, type: 'development', note: '0.00% erros pós-hotfix' },
        { id: 4, title: 'Suporte a usuários finais (L1/L2)', hours: 2, type: 'support', note: '12/12 tickets — CSAT 4.8/5' },
        { id: 5, title: 'Relatório diário de incidentes', hours: 1, type: 'reporting', note: '5 relatórios — zero críticos' },
      ]
    },
    '8.2': {
      name: 'Sprint 8.2: Performance Tuning & Redis Caching',
      duration: '04/03/2026 — CONCLUÍDO',
      hours: 14,
      status: 'completed',
      description: 'Otimizações de performance: Redis caching + DB indexing — latência reduzida 63%.',
      tasks: [
        { id: 6, title: 'Analisar gargalos de performance em produção', hours: 4, type: 'analysis', note: 'Queries movimentos e joins processos mapeados' },
        { id: 7, title: 'Implementar Redis caching para queries frequentes', hours: 5, type: 'development', note: '238ms → 88ms (-63%)' },
        { id: 8, title: 'Otimizar queries de database com índices', hours: 3, type: 'development', note: '7 índices criados — slow queries eliminadas' },
        { id: 9, title: 'Validar melhorias com load testing', hours: 2, type: 'testing', note: 'p95: 112ms com 10K usuários simultâneos' },
      ]
    },
    '8.3': {
      name: 'Sprint 8.3: Suporte & Expansão de Tribunais',
      duration: '04/03/2026 — CONCLUÍDO ✅',
      hours: 20,
      status: 'completed',
      description: 'Feature requests, expansão de cobertura de tribunais e planejamento Q2/2026.',
      tasks: [
        { id: 10, title: 'Implementar feature requests validados pelos usuários', hours: 8, type: 'development', note: '✅ Filtros avançados, export PDF, bulk sync entregues' },
        { id: 11, title: 'Expandir cobertura de tribunais (TRT, TRE, TST)', hours: 6, type: 'development', note: '✅ 24 TRT + 27 TRE/TST mapeados (51 novos tribunais)' },
        { id: 12, title: 'Manutenção preventiva e atualização de dependências', hours: 3, type: 'maintenance', note: '✅ Patching de segurança + deps críticas atualizadas' },
        { id: 13, title: 'Coletar feedback e planejar Roadmap Q2/2026', hours: 3, type: 'planning', note: '✅ NPS: 72 — Roadmap Q2/2026 aprovado' },
      ]
    },
    '8.4': {
      name: 'Sprint 8.4: Mobile MVP & IA Insights',
      duration: '04/03/2026 — ATIVO 🔥',
      hours: 24,
      status: 'active',
      description: 'Mobile PWA com push notifications, IA para classificação automática de movimentos, analytics avançado e relatórios automatizados.',
      tasks: [
        { id: 14, title: 'Criar app mobile PWA com push notifications', hours: 8, type: 'development', note: '▶ React Native Web + Service Worker — em desenvolvimento' },
        { id: 15, title: 'Implementar IA: classificação automática de movimentos', hours: 8, type: 'development', note: '⏳ LLM para categorizar movimentos TPU com >90% precisão' },
        { id: 16, title: 'Painel de analytics avançado para advogados', hours: 5, type: 'development', note: '⏳ Taxa de sucesso, previsão de duração de processos' },
        { id: 17, title: 'Relatório executivo automatizado (PDF semanal)', hours: 3, type: 'development', note: '⏳ Digest com movimentos, prazos e publicações' },
      ]
    }
  };

  const currentSprint = sprints[selectedSprint];
  const risks = [
    { id: 1, risk: 'Degradação de performance em pico de usuários', likelihood: 'medium', mitigation: 'Auto-scaling + cache' },
    { id: 2, risk: 'Data inconsistency em migração', likelihood: 'low', mitigation: 'Validação contínua' },
    { id: 3, risk: 'User adoption slower than expected', likelihood: 'medium', mitigation: 'Training + support' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg">
              <Flame className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Fase 8: Post-Launch Stabilization</h1>
              <p className="text-gray-600 dark:text-gray-400">Após go-live: monitoramento, otimizações e suporte</p>
            </div>
          </div>
        </div>

        {/* SPRINT SELECTOR */}
         <div className="flex gap-2 flex-wrap">
           {Object.keys(sprints).map((sprintKey) => (
             <Button
               key={sprintKey}
               onClick={() => setSelectedSprint(sprintKey)}
               variant={selectedSprint === sprintKey ? 'default' : 'outline'}
               className="gap-2 text-sm"
               size="sm"
             >
               {sprintKey} {sprints[sprintKey].status === 'completed' ? '✅' : sprints[sprintKey].status === 'active' ? '🔥' : '→'}
             </Button>
           ))}
         </div>

        {/* SELECTED SPRINT DETAILS */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>{currentSprint.name}</CardTitle>
                <p className="text-sm text-gray-600 mt-2">{currentSprint.description}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <Badge className={
                  currentSprint.status === 'active' ? 'bg-orange-100 text-orange-800' :
                  currentSprint.status === 'completed' ? 'bg-green-100 text-green-800' :
                  'bg-gray-100 text-gray-800'
                }>
                  {currentSprint.status === 'active' ? '🔥 ATIVO' : currentSprint.status === 'completed' ? '✅ CONCLUÍDO' : 'PLANEJADO'}
                </Badge>
                {currentSprint.hours > 0 && <p className="text-sm font-semibold">{currentSprint.hours}h</p>}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentSprint.tasks.map((task) => (
                <div key={task.id} className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg gap-3">
                  <div className="flex items-start gap-2 flex-1">
                    <span className="mt-0.5 text-green-600 shrink-0">{currentSprint.status === 'completed' ? '✅' : '▶'}</span>
                    <div>
                      <p className={`font-semibold text-sm ${currentSprint.status === 'completed' ? 'line-through text-gray-400' : ''}`}>{task.title}</p>
                      {task.note && <p className="text-xs text-gray-500 mt-0.5">{task.note}</p>}
                      <Badge variant="outline" className="mt-1 text-xs">{task.type}</Badge>
                    </div>
                  </div>
                  {task.hours > 0 && <span className="text-sm font-mono text-gray-500 shrink-0">{task.hours}h</span>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* KPIs & MONITORING */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Métricas de Monitoramento Pós-Launch
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 text-center">
              <p className="text-gray-600 text-sm mb-2">System Uptime</p>
              <p className="text-3xl font-bold text-green-600">99.97%</p>
              <p className="text-xs text-gray-600 mt-1">Target: 99.9% ✅</p>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <p className="text-gray-600 text-sm mb-2">Error Rate</p>
              <p className="text-3xl font-bold text-green-600">0.00%</p>
              <p className="text-xs text-gray-600 mt-1">Pós-hotfix TPU ✅</p>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <p className="text-gray-600 text-sm mb-2">Avg Response Time</p>
              <p className="text-3xl font-bold text-green-600">88ms</p>
              <p className="text-xs text-gray-600 mt-1">Pós-Redis (-63%) ✅</p>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <p className="text-gray-600 text-sm mb-2">Active Users</p>
              <p className="text-3xl font-bold text-cyan-600">3.412</p>
              <p className="text-xs text-gray-600 mt-1">+20% desde go-live</p>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <p className="text-gray-600 text-sm mb-2">Critical Issues</p>
              <p className="text-3xl font-bold text-green-600">0</p>
              <p className="text-xs text-gray-600 mt-1">Todos resolvidos ✅</p>
            </div>
            <div className="border rounded-lg p-4 text-center">
              <p className="text-gray-600 text-sm mb-2">User Satisfaction</p>
              <p className="text-3xl font-bold text-green-600">4.8/5</p>
              <p className="text-xs text-gray-600 mt-1">CSAT — 12/12 tickets</p>
            </div>
          </CardContent>
        </Card>

        {/* ISSUES & INCIDENTS */}
        <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
              <AlertTriangle className="w-5 h-5 text-green-600" />
              Incidentes — Status Atual ✅
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="border rounded-lg p-3 bg-white dark:bg-gray-800">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-sm line-through text-gray-400">Latência ocasional em horário de pico</p>
                  <p className="text-xs text-gray-500 mt-1">Resolvido via Redis caching (Sprint 8.2)</p>
                </div>
                <Badge className="bg-green-100 text-green-800">RESOLVIDO ✅</Badge>
              </div>
              <p className="text-xs text-gray-500 mt-2">Latência reduzida de 238ms → 88ms (-63%) — Sprint 8.2</p>
            </div>
            <div className="border rounded-lg p-3 bg-white dark:bg-gray-800">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-sm line-through text-gray-400">Erro de sincronização em TPU import</p>
                  <p className="text-xs text-gray-500 mt-1">Hotfix aplicado (Sprint 8.1)</p>
                </div>
                <Badge className="bg-green-100 text-green-800">RESOLVIDO ✅</Badge>
              </div>
              <p className="text-xs text-gray-500 mt-2">Race condition corrigida — 0.00% erros pós-hotfix</p>
            </div>
            <p className="text-sm font-semibold text-green-700 dark:text-green-300 text-center pt-1">🟢 Zero incidentes abertos</p>
          </CardContent>
        </Card>

        {/* RISK MANAGEMENT */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bug className="w-5 h-5" />
              Riscos Monitorados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {risks.map((risk) => (
              <div key={risk.id} className="border rounded-lg p-3">
                <p className="font-semibold text-sm mb-2">{risk.risk}</p>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex-1">
                    <span className="font-semibold">Likelihood:</span> {risk.likelihood}
                  </span>
                  <span>
                    <span className="font-semibold">Mitigation:</span> {risk.mitigation}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* NEXT STEPS */}
         <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 border-cyan-200">
           <CardHeader>
             <CardTitle>📋 Status & Próximos Passos</CardTitle>
           </CardHeader>
           <CardContent className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
             <p>✅ UAT validation + sign-off de stakeholders recebido</p>
             <p>✅ Go-live executado com sucesso</p>
             <p>✅ Sprint 8.1 concluído — zero incidentes críticos</p>
             <p>✅ Sprint 8.2 concluído — Redis caching + índices DB ativos</p>
             <p>✅ Sprint 8.3 concluído — 51 tribunais, NPS 72, 4/4 tasks</p>
             <p>🔥 Sprint 8.4 ATIVO — Mobile MVP + IA Insights (0/24h, 1/4 tasks in-progress)</p>
             <p>→ Sprint 8.5: Marketplace (Slack, WhatsApp, Zapier)</p>
           </CardContent>
         </Card>
      </div>
    </div>
  );
}