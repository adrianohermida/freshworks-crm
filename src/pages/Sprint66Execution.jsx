import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { CheckCircle2, AlertCircle, Zap, Rocket, BarChart3 } from 'lucide-react';

export default function Sprint66Execution() {
  const [expandedFase, setExpandedFase] = useState(1);

  const sprint66Data = {
    numero: 66,
    titulo: 'Production Deployment + Multi-tenant Scaling + Performance',
    duracao: '5 dias (40h)',
    progresso: 100,
    iniciada: '2026-03-05',
    concluida: '2026-03-09',
    meta: '100% production-ready + multi-tenant scaling + performance optimization'
  };

  const fases = [
    {
      numero: 1,
      nome: 'Production Deployment & Infrastructure',
      status: 'concluido',
      duracao: '2 dias (16h)',
      progresso: 100,
      tarefas: [
        {
          id: 1,
          nome: 'Configurar CI/CD pipeline',
          status: 'concluido',
          descricao: 'GitHub Actions + Deno Deploy automático',
          horas: 4,
          dataInicio: '2026-03-05',
          dataConclusao: '2026-03-05'
        },
        {
          id: 2,
          nome: 'Setup base de dados production',
          status: 'concluido',
          descricao: 'Migração dados, backup automático, replicação',
          horas: 4,
          dataInicio: '2026-03-06',
          dataConclusao: '2026-03-06'
        },
        {
          id: 3,
          nome: 'Configurar HTTPS & SSL certificates',
          status: 'concluido',
          descricao: 'Let\'s Encrypt + auto-renewal',
          horas: 2,
          dataInicio: '2026-03-06',
          dataConclusao: '2026-03-06'
        },
        {
          id: 4,
          nome: 'Implementar monitoring & alertas production',
          status: 'concluido',
          descricao: 'Datadog/New Relic + PagerDuty para on-call',
          horas: 4,
          dataInicio: '2026-03-06',
          dataConclusao: '2026-03-07'
        },
        {
          id: 5,
          nome: 'Testes de carga e stress testing',
          status: 'concluido',
          descricao: 'Validar 1000+ req/s, failover automático',
          horas: 2,
          dataInicio: '2026-03-07',
          dataConclusao: '2026-03-07'
        }
      ]
    },
    {
      numero: 2,
      nome: 'Multi-tenant Architecture & Isolation',
      status: 'concluido',
      duracao: '1.5 dias (12h)',
      progresso: 100,
      tarefas: [
        {
          id: 6,
          nome: 'Implementar isolamento de dados por tenant',
          status: 'concluido',
          descricao: 'Row-level security + tenant context em queries',
          horas: 4,
          dataInicio: '2026-03-07',
          dataConclusao: '2026-03-07'
        },
        {
          id: 7,
          nome: 'Criar sistema de billing & metering',
          status: 'concluido',
          descricao: 'Rastreamento de uso, quotas, rate limits por tenant',
          horas: 4,
          dataInicio: '2026-03-07',
          dataConclusao: '2026-03-07'
        },
        {
          id: 8,
          nome: 'Implementar tenant onboarding automático',
          status: 'concluido',
          descricao: 'Auto-provisionamento de workspace, dados iniciais',
          horas: 2,
          dataInicio: '2026-03-08',
          dataConclusao: '2026-03-08'
        },
        {
          id: 9,
          nome: 'Validar isolamento & compliance',
          status: 'concluido',
          descricao: 'Testes de data leakage, GDPR compliance',
          horas: 2,
          dataInicio: '2026-03-08',
          dataConclusao: '2026-03-08'
        }
      ]
    },
    {
      numero: 3,
      nome: 'Performance Optimization & Scaling',
      status: 'concluido',
      duracao: '1.5 dias (12h)',
      progresso: 100,
      tarefas: [
        {
          id: 10,
          nome: 'Otimizar queries de banco de dados',
          status: 'concluido',
          descricao: 'Índices, query plans, caching em redis',
          horas: 3,
          dataInicio: '2026-03-08',
          dataConclusao: '2026-03-08'
        },
        {
          id: 11,
          nome: 'Implementar CDN para assets',
          status: 'concluido',
          descricao: 'CloudFlare / Vercel Edge para imagens, JS, CSS',
          horas: 2,
          dataInicio: '2026-03-08',
          dataConclusao: '2026-03-08'
        },
        {
          id: 12,
          nome: 'Otimizar bundle React & deps',
          status: 'concluido',
          descricao: 'Tree-shaking, code splitting, lazy loading',
          horas: 2,
          dataInicio: '2026-03-08',
          dataConclusao: '2026-03-08'
        },
        {
          id: 13,
          nome: 'Implementar auto-scaling infrastructure',
          status: 'concluido',
          descricao: 'Kubernetes + HPA baseado em CPU/RAM',
          horas: 3,
          dataInicio: '2026-03-08',
          dataConclusao: '2026-03-08'
        },
        {
          id: 14,
          nome: 'Validação final e go-live production',
          status: 'concluido',
          descricao: 'Testes finais, sign-off, go-live checklist',
          horas: 2,
          dataInicio: '2026-03-09',
          dataConclusao: '2026-03-09'
        }
      ]
    }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case 'concluido': return 'bg-green-100 border-l-4 border-l-green-600 text-green-900';
      case 'em_andamento': return 'bg-blue-100 border-l-4 border-l-blue-600 text-blue-900';
      default: return 'bg-gray-100 border-l-4 border-l-gray-400 text-gray-900';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'concluido': return '✅';
      case 'em_andamento': return '🚀';
      default: return '⏳';
    }
  };

  const totalTarefas = fases.reduce((acc, f) => acc + f.tarefas.length, 0);
  const tarefasConcluidas = fases.reduce((acc, f) => 
    acc + f.tarefas.filter(t => t.status === 'concluido').length, 0
  );
  const tarefasEmAndamento = fases.reduce((acc, f) => 
    acc + f.tarefas.filter(t => t.status === 'em_andamento').length, 0
  );

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-purple-50 to-pink-50 min-h-screen">
      <div>
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <Rocket className="w-10 h-10 text-purple-600" />
          Sprint 66 - Production Deploy + Multi-tenant + Performance
        </h1>
        <p className="text-lg text-gray-600">Production-ready deployment | Multi-tenant isolation | Performance optimization</p>
      </div>

      <Card className="p-6 bg-gradient-to-r from-purple-600 to-pink-700 text-white border-0 shadow-lg">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-3xl font-bold">Sprint 66 - Iniciando 5 de Março</h2>
            <p className="text-purple-100 mt-1">{tarefasConcluidas} concluídas | {tarefasEmAndamento} em andamento | {totalTarefas - tarefasConcluidas - tarefasEmAndamento} planejadas</p>
          </div>
          <span className="text-5xl font-bold text-purple-200">100%</span>
        </div>

        <div className="w-full h-3 bg-purple-300 rounded-full overflow-hidden mb-6">
          <div className="h-full bg-white transition-all" style={{ width: '100%' }} />
        </div>

        <div className="grid grid-cols-5 gap-4">
          <div><p className="text-purple-200 text-sm">Completas</p><p className="text-3xl font-bold">{tarefasConcluidas}/{totalTarefas}</p></div>
          <div><p className="text-purple-200 text-sm">Em Andamento</p><p className="text-3xl font-bold">{tarefasEmAndamento}</p></div>
          <div><p className="text-purple-200 text-sm">Pendentes</p><p className="text-3xl font-bold">{totalTarefas - tarefasConcluidas - tarefasEmAndamento}</p></div>
          <div><p className="text-purple-200 text-sm">Total de Horas</p><p className="text-3xl font-bold">40h</p></div>
          <div><p className="text-purple-200 text-sm">Duração</p><p className="text-3xl font-bold">5 dias</p></div>
        </div>
      </Card>

      <div className="space-y-4">
        {fases.map((fase) => (
          <Card
            key={fase.numero}
            className={`p-6 cursor-pointer transition-all border-l-4 ${
              expandedFase === fase.numero
                ? 'border-l-purple-600 bg-white shadow-lg'
                : 'border-l-gray-300 bg-gray-50 hover:bg-white'
            }`}
            onClick={() => setExpandedFase(expandedFase === fase.numero ? null : fase.numero)}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-purple-600" />
                  Fase {fase.numero}: {fase.nome}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {fase.duracao} | {getStatusIcon(fase.status)} {fase.status.replace('_', ' ').toUpperCase()}
                </p>
              </div>
              <span className="text-2xl font-bold text-gray-500">{fase.progresso}%</span>
            </div>

            <div className="w-full h-2 bg-gray-300 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-pink-600 transition-all" style={{ width: `${fase.progresso}%` }} />
            </div>

            {expandedFase === fase.numero && (
              <div className="mt-4 space-y-2 border-t pt-4">
                {fase.tarefas.map((tarefa) => (
                  <div key={tarefa.id} className={`p-4 rounded-lg ${getStatusColor(tarefa.status)}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="font-bold text-sm">{getStatusIcon(tarefa.status)} {tarefa.nome}</p>
                        <p className="text-xs opacity-75 mt-1">{tarefa.descricao}</p>
                        {tarefa.dataInicio && !tarefa.dataConclusao && (
                          <p className="text-xs opacity-75 mt-1">🚀 Iniciado em {tarefa.dataInicio}</p>
                        )}
                      </div>
                      <span className="text-xs font-semibold bg-white bg-opacity-50 px-2 py-1 rounded">{tarefa.horas}h</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        ))}
      </div>

      <Card className="p-6 border-2 border-purple-300 bg-purple-50">
        <h2 className="text-lg font-bold text-purple-900 mb-3">📋 Objetivos Sprint 66</h2>
        <div className="space-y-3">
          <div className="flex gap-3 items-start">
            <AlertCircle className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-purple-900">Production Deployment</p>
              <p className="text-sm text-gray-700">CI/CD, infraestrutura, monitoramento — go live com confiança</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <Zap className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-purple-900">Multi-tenant Isolation</p>
              <p className="text-sm text-gray-700">Row-level security, billing, onboarding automático</p>
            </div>
          </div>
          <div className="flex gap-3 items-start">
            <BarChart3 className="w-5 h-5 text-purple-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-bold text-purple-900">Performance & Scaling</p>
              <p className="text-sm text-gray-700">1000+ req/s, 90+ Lighthouse score, auto-scaling</p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-r from-purple-600 to-pink-700 text-white border-0 shadow-lg">
        <h2 className="text-xl font-bold mb-4">🎯 KPIs Sprint 66</h2>
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-white bg-opacity-20 p-3 rounded">
            <p className="text-sm opacity-90">Uptime Target</p>
            <p className="text-2xl font-bold">99.9%</p>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded">
            <p className="text-sm opacity-90">Latência P95</p>
            <p className="text-2xl font-bold">&lt;200ms</p>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded">
            <p className="text-sm opacity-90">Lighthouse Score</p>
            <p className="text-2xl font-bold">&gt;90</p>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded">
            <p className="text-sm opacity-90">Tenants Suportados</p>
            <p className="text-2xl font-bold">∞ (Scaling)</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-500">
        <h2 className="text-xl font-bold text-purple-900 mb-4">🗺️ Contexto: Evolução do Produto</h2>
        <div className="space-y-2 text-sm">
          <p><strong className="text-green-900">✅ Sprint 64:</strong> Integração Advise Phase 1 (95% completo)</p>
          <p><strong className="text-blue-900">✅ Sprint 65:</strong> E2E Tests + Sync + Dashboard (80% → 100% completude)</p>
          <p><strong className="text-purple-900">🚀 Sprint 66 (ATUAL):</strong> Production Deploy + Multi-tenant + Performance | 40h | 14 tarefas</p>
          <p><strong className="text-gray-900">⏳ Sprint 67+:</strong> Advanced features, Global expansion, Enterprise SLA</p>
        </div>
      </Card>
    </div>
  );
}