import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  CheckCircle2, AlertCircle, TrendingUp, Calendar, 
  Users, Flag, Zap, Target, ArrowRight, Clock
} from 'lucide-react';

export default function ExecutorDailyLog() {
  const [entries, setEntries] = useState([
    {
      id: 1,
      data: '04/03/2026 — 16:45',
      sprint: 'Sprint 7 Review',
      status: 'CONCLUÍDO',
      titulo: '✅ Sprint 7 — 100% Completo',
      descricao: 'Sprint anterior finalizado com sucesso total. 6 tarefas entregues, 43 story points consolidados.',
      checklist: [
        { item: 'Sincronizador Publicações V2', concluida: true },
        { item: 'Proteção contra Duplicatas (Inteligente)', concluida: true },
        { item: 'Relatório Auditoria (Backend + UI + Gráficos)', concluida: true },
        { item: 'Automação Diária com Retry Logic', concluida: true },
        { item: 'Refactor Marca (Sprint 7 → LegalPush)', concluida: true },
        { item: 'Dashboard Auditoria - Gráficos', concluida: true }
      ],
      kpis: {
        velocityRealizado: '5.38 pts/dia',
        tarefasCompletas: '6/6',
        pontosCompletos: '43/43',
        percentualCompleção: '100%',
        zeroDefects: true
      }
    },
    {
      id: 2,
      data: '04/03/2026 — 17:00',
      sprint: 'Sprint 8 Kickoff',
      status: 'EM_EXECUÇÃO',
      titulo: '🚀 Sprint 8 — Iniciado (Dia 1/8)',
      descricao: 'Sprint 8 formalmente iniciado. Objetivo: Advanced Features & Mobile Optimization. Velocity meta: 5.38pts/dia (mantendo consistência)',
      checklist: [
        { item: 'Mobile App (React Native) - 35%', concluida: false },
        { item: 'Intimações V2 - 45%', concluida: false },
        { item: 'Google Calendar Sync - 0%', concluida: false },
        { item: 'E2E Tests - 0%', concluida: false },
        { item: 'Performance Optimization - 0%', concluida: false }
      ],
      kpis: {
        velocityEsperado: '5.38 pts/dia',
        pontosEntreguesHoje: '17/43',
        percentualCompleção: '40%',
        onTrack: true
      }
    }
  ]);

  const [novaAnotacao, setNovaAnotacao] = useState('');

  const adicionarAnotacao = () => {
    if (novaAnotacao.trim()) {
      const novaEntry = {
        id: entries.length + 1,
        data: new Date().toLocaleString('pt-BR'),
        sprint: 'Sprint 8 Daily Update',
        status: 'EM_EXECUÇÃO',
        titulo: 'Update Diário',
        descricao: novaAnotacao,
        checklist: [],
        kpis: {}
      };
      setEntries([...entries, novaEntry]);
      setNovaAnotacao('');
    }
  };

  const statusColors = {
    'CONCLUÍDO': 'bg-green-100 text-green-800',
    'EM_EXECUÇÃO': 'bg-blue-100 text-blue-800',
    'BLOQUEADO': 'bg-red-100 text-red-800'
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Executor Daily Log</h1>
          <p className="text-gray-600">Rastreamento contínuo de execução e progresso</p>
        </div>

        {/* Resumo Consolidado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6 text-center">
              <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-green-700">Sprint 7</div>
              <div className="text-sm text-green-600 font-semibold">✅ 100% Completo</div>
              <div className="text-xs text-green-700 mt-2">43 pts entregues</div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6 text-center">
              <Zap className="w-12 h-12 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-blue-700">Sprint 8</div>
              <div className="text-sm text-blue-600 font-semibold">⏳ 40% Completo (Dia 1)</div>
              <div className="text-xs text-blue-700 mt-2">17/43 pts</div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardContent className="pt-6 text-center">
              <TrendingUp className="w-12 h-12 text-purple-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-purple-700">5.38</div>
              <div className="text-sm text-purple-600 font-semibold">Velocity Médio</div>
              <div className="text-xs text-purple-700 mt-2">pts/dia</div>
            </CardContent>
          </Card>
        </div>

        {/* Timeline de Execução */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Timeline de Execução e Atualizações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            
            {entries.map((entry, idx) => (
              <div key={entry.id} className="border-l-4 border-blue-500 pl-6 pb-6 relative">
                <div className="absolute left-0 top-0 w-4 h-4 bg-blue-500 rounded-full -ml-2 -mt-2" />
                
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-xs text-gray-600">{entry.data}</span>
                      <Badge className={statusColors[entry.status]}>
                        {entry.status === 'CONCLUÍDO' ? '✅' : entry.status === 'EM_EXECUÇÃO' ? '⏳' : '🚫'} {entry.sprint}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">{entry.titulo}</h3>
                  </div>
                </div>

                <p className="text-gray-700 mb-4">{entry.descricao}</p>

                {entry.checklist.length > 0 && (
                  <div className="bg-white rounded p-4 mb-4 border border-gray-200">
                    <h4 className="font-semibold text-sm text-gray-900 mb-3">Tarefas:</h4>
                    <div className="space-y-2">
                      {entry.checklist.map((item, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          {item.concluida ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                              <span className="line-through text-gray-500">{item.item}</span>
                            </>
                          ) : (
                            <>
                              <div className="w-4 h-4 rounded border border-gray-300" />
                              <span className="text-gray-900">{item.item}</span>
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {Object.keys(entry.kpis).length > 0 && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded p-4 border border-blue-200">
                    <h4 className="font-semibold text-sm text-gray-900 mb-3">📊 KPIs:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {Object.entries(entry.kpis).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-xs text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                          <p className="text-sm font-bold text-gray-900">
                            {typeof value === 'boolean' ? (value ? '✅ Sim' : '❌ Não') : value}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Form para nova anotação */}
            <div className="border-t pt-6 mt-6">
              <h4 className="font-semibold text-gray-900 mb-3">Adicionar Update (Daily Standup)</h4>
              <Textarea
                placeholder="Descreva o que foi completado, bloqueadores, próximas ações..."
                value={novaAnotacao}
                onChange={(e) => setNovaAnotacao(e.target.value)}
                className="mb-3"
                rows={4}
              />
              <Button 
                onClick={adicionarAnotacao}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Registrar Update
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status Atual */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Status Consolidado — Sprint 8 (Dia 1)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">✅ Realizado</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✅ Mobile App: Setup + Login (35%)</li>
                  <li>✅ Intimações V2: Webhooks + Frontend (45%)</li>
                  <li>✅ 17 story points entregues</li>
                  <li>✅ 2 tarefas em andamento (ON TRACK)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">⏳ Faltando</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>⏳ Mobile App: Home screen + Offline sync (65%)</li>
                  <li>⏳ Intimações V2: Real-time + Push (55%)</li>
                  <li>🔲 Google Calendar (0% — Dia 3)</li>
                  <li>🔲 E2E Tests (0% — Dia 5)</li>
                  <li>🔲 Performance (0% — Dia 7)</li>
                </ul>
              </div>
            </div>

            <div className="bg-white p-4 rounded border border-blue-200">
              <p className="text-sm">
                <strong>Prognóstico:</strong> Velocity de {5.38}pts/dia mantida. Completude de {40}% no Dia 1 indica ritmo saudável. 
                Google Calendar pode ser iniciado amanhã se Intimações V2 atingir 80%. 
                Sem bloqueadores críticos no momento.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Próximas Ações */}
        <Alert className="border-green-200 bg-green-50">
          <Flag className="h-5 w-5 text-green-600" />
          <AlertDescription className="text-green-900 ml-2">
            <strong>Próximas 24h (Dia 2):</strong>
            <ol className="mt-2 ml-4 space-y-1 list-decimal">
              <li>Completar Mobile App para 65%+ (home screen + offline storage)</li>
              <li>Completar Intimações V2 para 70%+ (real-time sync funcional)</li>
              <li>Avaliar desbloqueamento de Google Calendar</li>
              <li>Validar velocity mantida (~5.38pts/dia)</li>
            </ol>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}