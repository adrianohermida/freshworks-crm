import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2, AlertTriangle, TrendingUp, Calendar, Zap,
  Target, Flag, Clock, BarChart3, ChevronDown, ChevronUp,
  AlertCircle, ArrowRight
} from 'lucide-react';

export default function ExecutorDailyProgressTracker() {
  const [expandedDays, setExpandedDays] = useState({ dia1: true });
  const [currentTime] = useState('10:30');

  const toggleDay = (day) => {
    setExpandedDays(prev => ({ ...prev, [day]: !prev[day] }));
  };

  // ========================
  // DADOS CONSOLIDADOS
  // ========================
  const projectMetrics = {
    totalSprints: 11,
    sprintsCompletos: 3, // Sprint 7, 8, 9
    sprintsEmExecucao: 1, // Sprint 10
    sprint10Completude: 18,
    pontosTotais: 121,
    pontosEntregues: 126,
    velocidadeMedia: 5.35,
    proximoSprintInicio: '05/03/2026'
  };

  const completudeGeral = Math.round(((projectMetrics.pontosEntregues) / projectMetrics.pontosTotais) * 100);

  // Progresso por Sprint
  const sprintProgress = [
    { numero: 7, estado: 'COMPLETO', completude: 100, pontos: '43/43', velocity: 5.38 },
    { numero: 8, estado: 'COMPLETO', completude: 100, pontos: '43/43', velocity: 5.38 },
    { numero: 9, estado: 'COMPLETO', completude: 100, pontos: '40/40', velocity: 5.35 },
    { numero: 10, estado: 'EM_EXECUÇÃO', completude: 18, pontos: '7/38', velocity: 5.35 }
  ];

  // Timeline de execução
  const dailyTimeline = [
    {
      dia: 'Dia 1 (05/03)',
      status: '🔄 EM EXECUÇÃO',
      completude: 18,
      objetivos: [
        { nome: 'E2E Tests Sprint 9 (3 pts)', status: '✅ COMPLETO', tempo: '08:00-08:25' },
        { nome: 'Auth OAuth2 (2.4 pts)', status: '✅ COMPLETO', tempo: '08:30-10:30' },
        { nome: 'Rate Limiting Setup (2.4 pts)', status: '✅ COMPLETO', tempo: '09:00-10:30' },
        { nome: 'Auth Middleware (restante)', status: '🔄 ~1.5h', tempo: '10:30-12:00' },
        { nome: 'RBAC Rules', status: '⏳ ~2.5h', tempo: '13:00-15:30' }
      ],
      metricas: {
        pontosEntregues: '7/38',
        percentual: 18,
        tarefasAtivas: 2,
        bloqueadores: 0
      }
    },
    {
      dia: 'Dia 2 (06/03)',
      status: '⏳ PLANEJADO',
      completude: 0,
      objetivos: [
        { nome: 'Auth finalizar (RBAC + Login UI)', status: '⏳ 90% Auth desbloqueador', tempo: '08:00-12:00' },
        { nome: 'Encryption (paralelo - 8 pts)', status: '⏳ Pode iniciar', tempo: '09:00-17:00' },
        { nome: 'Audit Log (8 pts)', status: '🔐 Desbloqueado Auth', tempo: '13:00-17:00' },
        { nome: 'Rate Limiting finalizar', status: '⏳ Testes', tempo: '08:00-11:00' }
      ],
      metricas: {
        pontosEntregues: '13-16/38 (acumulado)',
        percentual: 34,
        tarefasAtivas: 3,
        bloqueadores: 1
      }
    },
    {
      dia: 'Dia 3 (07/03)',
      status: '⏳ PLANEJADO',
      completude: 0,
      objetivos: [
        { nome: 'Audit Log finalizar (8 pts)', status: '🔐 Desbloqueador LGPD', tempo: '08:00-17:00' },
        { nome: 'Encryption (continuar)', status: '🔄 Progresso', tempo: '09:00-17:00' },
        { nome: 'LGPD (8 pts)', status: '🔐 Desbloqueado Audit', tempo: '13:00-17:00' }
      ],
      metricas: {
        pontosEntregues: '21-24/38 (acumulado)',
        percentual: 57,
        tarefasAtivas: 3,
        bloqueadores: 0
      }
    },
    {
      dia: 'Dia 4-5 (08-09/03)',
      status: '⏳ PLANEJADO',
      completude: 0,
      objetivos: [
        { nome: 'Encryption finalizar (8 pts)', status: '⏳ Em andamento', tempo: '08:00-17:00' },
        { nome: 'LGPD finalizar (8 pts)', status: '⏳ Em andamento', tempo: '08:00-17:00' },
        { nome: 'Integration Testing', status: '⏳ Testes cruzados', tempo: '09:00-17:00' }
      ],
      metricas: {
        pontosEntregues: '31-34/38 (acumulado)',
        percentual: 82,
        tarefasAtivas: 2,
        bloqueadores: 0
      }
    },
    {
      dia: 'Dia 6-8 (10-12/03)',
      status: '⏳ PLANEJADO',
      completude: 0,
      objetivos: [
        { nome: 'E2E Analytics Tests finalizar', status: '⏳ Compliance', tempo: '08:00-12:00' },
        { nome: 'QA & Bug fixes', status: '⏳ Validação', tempo: '13:00-17:00' },
        { nome: 'Sprint 10 Finalização', status: '✅ 100% esperado', tempo: '10-12/03' }
      ],
      metricas: {
        pontosEntregues: '38/38 (100%)',
        percentual: 100,
        tarefasAtivas: 0,
        bloqueadores: 0
      }
    }
  ];

  // Checklist do Executor
  const executorChecklist = [
    { item: 'Sprint 9 finalizado 100%', concluido: true },
    { item: 'E2E Tests completados', concluido: true },
    { item: 'Sprint 10 kickoff executado', concluido: true },
    { item: 'Auth OAuth2 + JWT implemented', concluido: true },
    { item: 'Rate Limiting setup iniciado', concluido: true },
    { item: 'Auth Middleware finalizar', concluido: false },
    { item: 'RBAC Rules implementar', concluido: false },
    { item: 'Rate Limiting testes', concluido: false },
    { item: 'Audit Log iniciar (Dia 2)', concluido: false },
    { item: 'Encryption iniciar (Dia 2)', concluido: false },
    { item: 'LGPD implementar (Dia 3)', concluido: false }
  ];

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* HEADER PRINCIPAL */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-gray-900">Executor Daily Progress Tracker</h1>
            <div className="text-right">
              <p className="text-sm text-gray-600">📅 05/03/2026 — {currentTime}</p>
              <p className="text-lg font-bold text-blue-700">Dia 1/8 Sprint 10</p>
            </div>
          </div>
          <p className="text-gray-600">Rastreamento em tempo real de execução, completude e ações pendentes</p>
        </div>

        {/* ================== COMPLETUDE GERAL DO PROJETO ================== */}
        <Card className="border-purple-300 bg-gradient-to-br from-purple-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-purple-600" />
              📊 COMPLETUDE GERAL DO PROJETO
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              <div className="bg-white p-4 rounded border border-purple-200">
                <p className="text-sm text-purple-700 font-semibold mb-2">Completude Total</p>
                <p className="text-4xl font-bold text-purple-700">{completudeGeral}%</p>
                <Progress value={completudeGeral} className="h-3 mt-2" />
              </div>
              <div className="bg-white p-4 rounded border border-green-200">
                <p className="text-sm text-green-700 font-semibold mb-2">Sprints Completados</p>
                <p className="text-4xl font-bold text-green-700">{projectMetrics.sprintsCompletos}/{projectMetrics.totalSprints}</p>
                <p className="text-xs text-green-600 mt-1">(7, 8, 9)</p>
              </div>
              <div className="bg-white p-4 rounded border border-blue-200">
                <p className="text-sm text-blue-700 font-semibold mb-2">Sprints em Execução</p>
                <p className="text-4xl font-bold text-blue-700">{projectMetrics.sprintsEmExecucao}/{projectMetrics.totalSprints}</p>
                <p className="text-xs text-blue-600 mt-1">(10: {projectMetrics.sprint10Completude}%)</p>
              </div>
              <div className="bg-white p-4 rounded border border-orange-200">
                <p className="text-sm text-orange-700 font-semibold mb-2">Story Points</p>
                <p className="text-4xl font-bold text-orange-700">{projectMetrics.pontosEntregues}/{projectMetrics.pontosTotais}</p>
                <p className="text-xs text-orange-600 mt-1">Entregues</p>
              </div>
              <div className="bg-white p-4 rounded border border-teal-200">
                <p className="text-sm text-teal-700 font-semibold mb-2">ETA Final</p>
                <p className="text-2xl font-bold text-teal-700">26/03</p>
                <p className="text-xs text-teal-600 mt-1">✅ On Track</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ================== PROGRESSO POR SPRINT ================== */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              📈 Progresso por Sprint
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sprintProgress.map((sprint) => (
              <div key={sprint.numero} className={`p-4 rounded border ${
                sprint.estado === 'COMPLETO' ? 'bg-green-50 border-green-300' : 'bg-blue-50 border-blue-300'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-gray-900">Sprint {sprint.numero}</h4>
                  <div className="flex items-center gap-2">
                    <Badge className={sprint.estado === 'COMPLETO' ? 'bg-green-600' : 'bg-blue-600'}>
                      {sprint.estado === 'COMPLETO' ? '✅' : '🚀'} {sprint.completude}%
                    </Badge>
                  </div>
                </div>
                <Progress value={sprint.completude} className="h-2 mb-2" />
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mt-2">
                  <div><strong>Pontos:</strong> {sprint.pontos}</div>
                  <div><strong>Velocity:</strong> {sprint.velocity} pts/dia</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ================== TIMELINE DIÁRIA ================== */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              ⏱️ TIMELINE EXECUTIVA — Sprint 10 (8 dias)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dailyTimeline.map((day, idx) => (
              <div key={idx} className="border rounded-lg overflow-hidden">
                <div 
                  className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 cursor-pointer hover:from-blue-100 hover:to-blue-200"
                  onClick={() => toggleDay(`dia${idx}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{day.dia} — {day.status}</h4>
                      <p className="text-sm text-gray-600 mt-1">{day.objetivos.length} objetivos</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-2xl font-bold text-blue-700">{day.completude}%</p>
                        <p className="text-xs text-blue-600">{day.metricas.pontosEntregues}</p>
                      </div>
                      {expandedDays[`dia${idx}`] ? <ChevronUp /> : <ChevronDown />}
                    </div>
                  </div>
                </div>

                {expandedDays[`dia${idx}`] && (
                  <div className="p-4 bg-white border-t border-blue-200 space-y-3">
                    {day.objetivos.map((obj, objIdx) => (
                      <div key={objIdx} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">{obj.nome}</p>
                          <p className="text-xs text-gray-600 mt-1">⏰ {obj.tempo}</p>
                        </div>
                        <Badge variant="outline">{obj.status}</Badge>
                      </div>
                    ))}
                    <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
                      <p className="text-sm text-gray-700">
                        <strong>Métricas:</strong> {day.metricas.pontosEntregues} | 
                        <strong> Tarefas:</strong> {day.metricas.tarefasAtivas} | 
                        <strong> Bloqueadores:</strong> {day.metricas.bloqueadores}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ================== CHECKLIST EXECUTOR ================== */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flag className="w-5 h-5" />
              ✅ CHECKLIST DO EXECUTOR
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {executorChecklist.map((item, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2">
                {item.concluido ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <span className="line-through text-gray-500 text-sm">{item.item}</span>
                  </>
                ) : (
                  <>
                    <div className="w-5 h-5 rounded border border-gray-400 flex-shrink-0" />
                    <span className="text-gray-900 text-sm font-medium">{item.item}</span>
                  </>
                )}
              </div>
            ))}
            <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
              <p className="text-sm text-gray-700">
                <strong>Progresso:</strong> {executorChecklist.filter(i => i.concluido).length}/{executorChecklist.length} itens completados
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ================== PRÓXIMAS AÇÕES CRÍTICAS ================== */}
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-5 w-5 text-orange-600" />
          <AlertDescription className="text-orange-900 ml-2 space-y-2">
            <div>
              <strong>🎯 PRÓXIMAS 4 HORAS (10:30-14:30):</strong>
              <ol className="mt-2 ml-4 space-y-1 text-sm list-decimal">
                <li>Auth Middleware finalizar (~1.5h) — Desbloqueador crítico</li>
                <li>RBAC Rules Engine iniciar (~2.5h)</li>
                <li>Rate Limiting testes & validação</li>
                <li>Daily standup & status update</li>
              </ol>
            </div>
          </AlertDescription>
        </Alert>

        {/* ================== STATUS CONSOLIDADO ================== */}
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <AlertDescription className="text-green-900 ml-2 space-y-3">
            <div>
              <strong>✅ SPRINT 10 — DIA 1 EM EXECUÇÃO</strong>
              <p className="text-sm mt-1">
                Completude: 18% (7/38 pts) | Velocity: 5.35 pts/dia ✅ | 
                Tarefas ativas: 2 | Bloqueadores: 0 | Status: ON TRACK 🚀
              </p>
            </div>
            <div>
              <strong>📊 PROJETO GERAL:</strong>
              <p className="text-sm mt-1">
                Completude: 70% (126/121 pts) | Sprints: 3/11 completados | 
                ETA: 26/03/2026 | Prognóstico: 100% conforme planejado
              </p>
            </div>
            <div>
              <strong>⏰ PRÓXIMA ATUALIZAÇÃO:</strong> 14:30 (fim do expediente Dia 1)
            </div>
          </AlertDescription>
        </Alert>

      </div>
    </div>
  );
}