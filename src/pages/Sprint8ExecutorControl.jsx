import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2, Clock, AlertCircle, Zap, TrendingUp, 
  Calendar, Users, Target, Flag, ArrowRight
} from 'lucide-react';

export default function Sprint8ExecutorControl() {
  const sprintInfo = {
    numero: 8,
    objetivo: 'Advanced Features & Mobile Optimization',
    dataInicio: '12/03/2026',
    dataFim: '19/03/2026',
    diaAtual: 1,
    diasTotais: 8
  };

  // Tarefas detalhadas do Sprint 8
  const [tarefas, setTarefas] = useState([
    {
      id: 1,
      nome: 'Mobile App (React Native)',
      descricao: 'Implementar app mobile para iOS/Android',
      pontos: 13,
      responsavel: 'dev-team',
      percentualConclusao: 35,
      status: 'em_progresso',
      subtarefas: [
        { id: 'mobile-1', nome: 'Setup React Native & env', concluida: true },
        { id: 'mobile-2', nome: 'Implementar tela de login', concluida: true },
        { id: 'mobile-3', nome: 'Implementar tela de home', concluida: false },
        { id: 'mobile-4', nome: 'Sync offline & storage', concluida: false },
        { id: 'mobile-5', nome: 'Testes unitários', concluida: false }
      ],
      bloqueadores: []
    },
    {
      id: 2,
      nome: 'Intimações V2 - Integração Avançada',
      descricao: 'Integração avançada com endpoints de intimações',
      pontos: 13,
      responsavel: 'backend-team',
      percentualConclusao: 45,
      status: 'em_progresso',
      subtarefas: [
        { id: 'intim-1', nome: 'Implementar webhooks', concluida: true },
        { id: 'intim-2', nome: 'Frontend para filtros', concluida: true },
        { id: 'intim-3', nome: 'Sincronização em tempo real', concluida: false },
        { id: 'intim-4', nome: 'Notificações push', concluida: false }
      ],
      bloqueadores: []
    },
    {
      id: 3,
      nome: 'Google Calendar Sync',
      descricao: 'Sincronização com Google Calendar para prazos',
      pontos: 8,
      responsavel: 'backend-team',
      percentualConclusao: 0,
      status: 'nao_iniciada',
      subtarefas: [
        { id: 'cal-1', nome: 'Implementar OAuth Google', concluida: false },
        { id: 'cal-2', nome: 'Mapear prazos para eventos', concluida: false },
        { id: 'cal-3', nome: 'Testes de integração', concluida: false }
      ],
      bloqueadores: ['Aguardando aprovação de escopo']
    },
    {
      id: 4,
      nome: 'Testes E2E Completos',
      descricao: 'Testes end-to-end para fluxos críticos',
      pontos: 5,
      responsavel: 'qa-team',
      percentualConclusao: 0,
      status: 'nao_iniciada',
      subtarefas: [
        { id: 'e2e-1', nome: 'Setup Cypress/Playwright', concluida: false },
        { id: 'e2e-2', nome: 'Testes de publicações', concluida: false },
        { id: 'e2e-3', nome: 'Testes de intimações', concluida: false }
      ],
      bloqueadores: ['Aguardando conclusão de Intimações V2']
    },
    {
      id: 5,
      nome: 'Performance & Otimização',
      descricao: 'Otimizar performance e reduzir bundle',
      pontos: 4,
      responsavel: 'platform-team',
      percentualConclusao: 0,
      status: 'nao_iniciada',
      subtarefas: [
        { id: 'perf-1', nome: 'Lighthouse audit', concluida: false },
        { id: 'perf-2', nome: 'Code splitting', concluida: false },
        { id: 'perf-3', nome: 'Cache optimization', concluida: false }
      ],
      bloqueadores: []
    }
  ]);

  // Cálculos dinâmicos
  const pontosTotal = tarefas.reduce((sum, t) => sum + t.pontos, 0);
  const pontosConcluidos = tarefas.reduce((sum, t) => {
    const progresso = (t.pontos * t.percentualConclusao) / 100;
    return sum + progresso;
  }, 0);
  
  const percentualGeral = Math.round((pontosConcluidos / pontosTotal) * 100);
  const tarefasCompletas = tarefas.filter(t => t.percentualConclusao === 100).length;
  const tarefasEmProgresso = tarefas.filter(t => t.percentualConclusao > 0 && t.percentualConclusao < 100).length;
  const tarefasPendentes = tarefas.filter(t => t.percentualConclusao === 0).length;

  const toggleSubtarefa = (tarefaId, subtarefaId) => {
    setTarefas(tarefas.map(tarefa => {
      if (tarefa.id === tarefaId) {
        const novasSubtarefas = tarefa.subtarefas.map(sub => 
          sub.id === subtarefaId ? { ...sub, concluida: !sub.concluida } : sub
        );
        const subconcluidasCount = novasSubtarefas.filter(s => s.concluida).length;
        const novoPercentual = Math.round((subconcluidasCount / novasSubtarefas.length) * 100);
        
        return {
          ...tarefa,
          subtarefas: novasSubtarefas,
          percentualConclusao: novoPercentual,
          status: novoPercentual === 0 ? 'nao_iniciada' : (novoPercentual === 100 ? 'concluida' : 'em_progresso')
        };
      }
      return tarefa;
    }));
  };

  const statusBadgeColor = {
    concluida: 'bg-green-100 text-green-800',
    em_progresso: 'bg-blue-100 text-blue-800',
    nao_iniciada: 'bg-gray-100 text-gray-800',
    bloqueada: 'bg-red-100 text-red-800'
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Sprint 8 — Executor Control Center</h1>
          <p className="text-gray-600">Monitoramento e Execução em Tempo Real</p>
        </div>

        {/* Informações Sprint */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-4 h-4 text-blue-600" />
                <span className="text-xs text-gray-600">Objetivo</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">{sprintInfo.objetivo}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <span className="text-xs text-gray-600">Período</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">{sprintInfo.dataInicio} → {sprintInfo.dataFim}</p>
              <p className="text-xs text-gray-600">Dia {sprintInfo.diaAtual}/{sprintInfo.diasTotais}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-orange-600" />
                <span className="text-xs text-gray-600">Velocity</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">{(percentualGeral / sprintInfo.diaAtual).toFixed(1)}%</p>
              <p className="text-xs text-gray-600">Por dia</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                <span className="text-xs text-gray-600">Total Sprint</span>
              </div>
              <p className="text-sm font-semibold text-gray-900">{pontosTotal} pts</p>
              <p className="text-xs text-gray-600">{tarefas.length} tarefas</p>
            </CardContent>
          </Card>
        </div>

        {/* Progresso Geral */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                Progresso Geral do Sprint
              </span>
              <span className="text-3xl font-bold text-blue-600">{percentualGeral}%</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={percentualGeral} className="h-4" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-gray-600 mb-1">Pontos Completados</p>
                <p className="text-2xl font-bold text-green-600">{Math.round(pontosConcluidos)}/{pontosTotal}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Tarefas Completas</p>
                <p className="text-2xl font-bold text-green-600">{tarefasCompletas}/{tarefas.length}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Em Andamento</p>
                <p className="text-2xl font-bold text-blue-600">{tarefasEmProgresso}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 mb-1">Pendentes</p>
                <p className="text-2xl font-bold text-orange-600">{tarefasPendentes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alertas e Bloqueadores */}
        {tarefas.some(t => t.bloqueadores.length > 0) && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <AlertDescription className="text-red-900 ml-2">
              <strong>Bloqueadores Identificados:</strong>
              <ul className="mt-2 space-y-1 ml-4 list-disc">
                {tarefas.map(t => 
                  t.bloqueadores.length > 0 && (
                    <li key={t.id}><strong>{t.nome}:</strong> {t.bloqueadores.join(', ')}</li>
                  )
                )}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {/* Tarefas Detalhadas */}
        <div className="space-y-4">
          {tarefas.map((tarefa, idx) => (
            <Card key={tarefa.id} className={tarefa.status === 'concluida' ? 'border-green-200 bg-green-50' : 'border-gray-200'}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg font-bold text-gray-400">#{idx + 1}</span>
                      <CardTitle className="text-lg">{tarefa.nome}</CardTitle>
                      <Badge className={statusBadgeColor[tarefa.status]}>
                        {tarefa.status === 'em_progresso' ? '⏳ Em Andamento' : 
                         tarefa.status === 'concluida' ? '✅ Completa' :
                         tarefa.status === 'bloqueada' ? '🚫 Bloqueada' : '⏸️ Não Iniciada'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{tarefa.descricao}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{tarefa.percentualConclusao}%</div>
                    <div className="text-xs text-gray-600">{tarefa.pontos} pts</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={tarefa.percentualConclusao} className="h-2" />
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-900">Subtarefas:</h4>
                  {tarefa.subtarefas.map(sub => (
                    <div key={sub.id} className="flex items-center gap-3 p-2 rounded hover:bg-gray-50">
                      <Checkbox
                        checked={sub.concluida}
                        onCheckedChange={() => toggleSubtarefa(tarefa.id, sub.id)}
                        className="w-5 h-5"
                      />
                      <span className={`flex-1 text-sm ${sub.concluida ? 'line-through text-gray-400' : 'text-gray-900'}`}>
                        {sub.nome}
                      </span>
                      {sub.concluida && <CheckCircle2 className="w-4 h-4 text-green-600" />}
                    </div>
                  ))}
                </div>

                {tarefa.bloqueadores.length > 0 && (
                  <div className="bg-red-50 border border-red-200 rounded p-3">
                    <p className="text-xs font-semibold text-red-900 mb-1">⚠️ Bloqueadores:</p>
                    <ul className="text-xs text-red-800 space-y-1">
                      {tarefa.bloqueadores.map((b, i) => <li key={i}>• {b}</li>)}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Próximas Ações */}
        <Card className="border-purple-200 bg-purple-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-purple-700">
              <Flag className="w-5 h-5" />
              Próximas Ações Prioritárias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded bg-white">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700">1</div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Completar Mobile App (Dia 1-3)</p>
                  <p className="text-sm text-gray-600">Alvo: 65% → 100% | Subtarefas: Home screen + Offline sync</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded bg-white">
                <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700">2</div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Completar Intimações V2 (Dia 1-3)</p>
                  <p className="text-sm text-gray-600">Alvo: 45% → 100% | Subtarefas: Sync real-time + Push notifications</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded bg-white">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-sm font-bold text-green-700">3</div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">Iniciar Google Calendar (Dia 3)</p>
                  <p className="text-sm text-gray-600">Desbloqueador: Após Intimações V2 completa</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded bg-white">
                <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-sm font-bold text-orange-700">4</div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">E2E Tests (Dia 5)</p>
                  <p className="text-sm text-gray-600">Desbloqueador: Após features principais completas</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Status Final */}
        <Alert className={`border-${percentualGeral >= 40 ? 'green' : 'orange'}-200 bg-${percentualGeral >= 40 ? 'green' : 'orange'}-50`}>
          <CheckCircle2 className={`h-5 w-5 text-${percentualGeral >= 40 ? 'green' : 'orange'}-600`} />
          <AlertDescription className={`text-${percentualGeral >= 40 ? 'green' : 'orange'}-900 ml-2`}>
            <strong>Status Dia 1:</strong> {percentualGeral}% concluído | {pontosConcluidos.toFixed(0)}/{pontosTotal} story points entregues | {tarefasEmProgresso} tarefas em andamento | {tarefasPendentes} pendentes | 
            <br/>
            <strong>Prognóstico:</strong> {percentualGeral >= 40 ? '✅ ON TRACK — Mantendo velocity de 5pts/dia, sprint será completado no prazo' : '⚠️ MONITOR — Acelerar execução nos próximos 2 dias'}
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}