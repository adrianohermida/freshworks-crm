import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  CheckCircle2, CheckCircle, AlertCircle, TrendingUp, Calendar,
  Zap, Target, Flag, Clock, Users, ArrowRight, Activity
} from 'lucide-react';

export default function ExecutorSprintDashboard() {
  const [sprintAtual] = useState({
    numero: 9,
    estado: 'EM_EXECUÇÃO',
    diaAtual: 5,
    diasTotais: 8,
    objetivo: 'Advanced Analytics & Reporting',
    dataInicio: '12/03/2026',
    dataFim: '19/03/2026'
  });

  const [tarefasStatus] = useState({
    completadas: [
      { nome: 'Advanced Analytics Dashboard', pontos: 10, progresso: 100, status: 'completo' },
      { nome: 'Real-time Data Insights', pontos: 8, progresso: 100, status: 'completo' },
      { nome: 'Data Export (PDF/Excel)', pontos: 4, progresso: 100, status: 'completo' }
    ],
    emProgresso: [
      { nome: 'Custom Reports Generator', pontos: 8, progresso: 95, status: 'quase_completo', dias: 1 },
      { nome: 'Performance Monitoring Panel', pontos: 7, progresso: 85, status: 'em_progresso', dias: 1 }
    ],
    pendentes: [
      { nome: 'E2E Analytics Tests', pontos: 3, progresso: 0, status: 'waiting', desbloqueadorDia: 6 }
    ]
  });

  const pontosTotal = 40;
  const pontosConcluidos = 27; // Dia 5: 27/40 pts - Dashboard + Insights + Export (100%), Reports (95%), Performance (85%)
  const percentualGeral = Math.round((pontosConcluidos / pontosTotal) * 100);

  const sprint8 = {
    numero: 8,
    estado: 'COMPLETO',
    percentual: 100,
    pontos: '43/43',
    tarefas: '6/6',
    velocity: '6.5pts/dia'
  };

  const sprint10Planejado = {
    numero: 10,
    objetivo: 'Security & Compliance',
    pontos: 38,
    tarefas: 5,
    inicioEstimado: '20/03/2026',
    status: 'PRÉ-PLANEJAMENTO'
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header Principal */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">Executor Sprint Dashboard</h1>
          <p className="text-gray-600">Monitoramento completo de execução e planejamento contínuo</p>
        </div>

        {/* Status dos 3 Sprints */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Sprint 8 - Concluído */}
          <Card className="border-green-300 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-green-800">
                <CheckCircle2 className="w-5 h-5" />
                Sprint {sprint8.numero}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status</span>
                <Badge className="bg-green-600">✅ COMPLETO</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Completude</span>
                <span className="text-2xl font-bold text-green-700">{sprint8.percentual}%</span>
              </div>
              <Progress value={100} className="h-3" />
              <div className="text-xs text-gray-700 space-y-1 border-t pt-3">
                <p><strong>Pontos:</strong> {sprint8.pontos}</p>
                <p><strong>Tarefas:</strong> {sprint8.tarefas}</p>
                <p><strong>Velocity:</strong> {sprint8.velocity}</p>
              </div>
            </CardContent>
          </Card>

          {/* Sprint 8 - Em Execução */}
          <Card className="border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
                <Zap className="w-5 h-5" />
                Sprint {sprintAtual.numero}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status</span>
                <Badge className="bg-blue-600">⏳ EM EXECUÇÃO</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Dia {sprintAtual.diaAtual}/{sprintAtual.diasTotais}</span>
                <span className="text-2xl font-bold text-blue-700">{percentualGeral}%</span>
              </div>
              <Progress value={percentualGeral} className="h-3" />
              <div className="text-xs text-gray-700 space-y-1 border-t pt-3">
                <p><strong>Pontos:</strong> {pontosConcluidos}/{pontosTotal}</p>
                <p><strong>Velocity:</strong> ~5.38pts/dia</p>
                <p><strong>Prognóstico:</strong> 100% em {sprintAtual.diasTotais} dias</p>
              </div>
            </CardContent>
          </Card>

          {/* Sprint 9 - Em Execução */}
          <Card className="border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-blue-800">
                <Zap className="w-5 h-5" />
                Sprint {sprintAtual.numero}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status</span>
                <Badge className="bg-blue-600">🚀 INICIADO</Badge>
              </div>
              <div className="text-sm text-gray-700">
                <p className="font-semibold text-blue-900 mb-2">{sprintAtual.objetivo}</p>
              </div>
              <div className="text-xs text-gray-700 space-y-1 border-t pt-3">
                <p><strong>Pontos:</strong> 3/{pontosTotal}</p>
                <p><strong>Dia:</strong> {sprintAtual.diaAtual}/{sprintAtual.diasTotais}</p>
                <p><strong>Prognóstico:</strong> 100% em {sprintAtual.diasTotais} dias</p>
              </div>
            </CardContent>
          </Card>

          {/* Sprint 10 - Planejado */}
          <Card className="border-purple-300 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 text-purple-800">
                <Flag className="w-5 h-5" />
                Sprint {sprint10Planejado.numero}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Status</span>
                <Badge className="bg-purple-600">📋 PLANEJADO</Badge>
              </div>
              <div className="text-sm text-gray-700">
                <p className="font-semibold text-purple-900 mb-2">{sprint10Planejado.objetivo}</p>
              </div>
              <div className="text-xs text-gray-700 space-y-1 border-t pt-3">
                <p><strong>Pontos:</strong> {sprint10Planejado.pontos}</p>
                <p><strong>Tarefas:</strong> {sprint10Planejado.tarefas}</p>
                <p><strong>Início:</strong> {sprint10Planejado.inicioEstimado}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sprint 9 - Detalhamento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Detalhamento Sprint 9 — Dia {sprintAtual.diaAtual}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Resumo Geral */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-green-50 p-4 rounded border border-green-200">
                <p className="text-xs text-green-700 font-semibold mb-1">Completadas</p>
                <p className="text-3xl font-bold text-green-700">3</p>
                <p className="text-xs text-green-600">tarefas 100%</p>
              </div>
              <div className="bg-blue-50 p-4 rounded border border-blue-200">
                <p className="text-xs text-blue-700 font-semibold mb-1">Em Progresso</p>
                <p className="text-3xl font-bold text-blue-700">2</p>
                <p className="text-xs text-blue-600">tarefas ativas</p>
              </div>
              <div className="bg-orange-50 p-4 rounded border border-orange-200">
                <p className="text-xs text-orange-700 font-semibold mb-1">Pendentes</p>
                <p className="text-3xl font-bold text-orange-700">1</p>
                <p className="text-xs text-orange-600">E2E Tests</p>
              </div>
              <div className="bg-purple-50 p-4 rounded border border-purple-200">
                <p className="text-xs text-purple-700 font-semibold mb-1">Velocity</p>
                <p className="text-3xl font-bold text-purple-700">5.4</p>
                <p className="text-xs text-purple-600">pts/dia</p>
              </div>
            </div>

            {/* Tarefas em Progresso */}
            {/* Tarefas Completadas */}
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">✅ Tarefas Completadas (3/6)</h4>
              {tarefasStatus.completadas.map((tarefa, idx) => (
                <div key={idx} className="bg-green-50 p-4 rounded border border-green-200">
                  <div className="flex justify-between items-center mb-3">
                    <h5 className="font-semibold text-gray-900">{tarefa.nome}</h5>
                    <span className="text-sm font-bold text-green-700">✅ {tarefa.progresso}%</span>
                  </div>
                  <Progress value={tarefa.progresso} className="h-2 mb-2" />
                  <p className="text-xs text-gray-600">{tarefa.pontos} pts | Concluído</p>
                </div>
              ))}
            </div>

            {/* Tarefas em Progresso */}
            {tarefasStatus.emProgresso.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">🔄 Em Andamento (2/6)</h4>
                {tarefasStatus.emProgresso.map((tarefa, idx) => (
                  <div key={idx} className={`p-4 rounded border ${tarefa.status === 'quase_completo' ? 'bg-amber-50 border-amber-200' : 'bg-blue-50 border-blue-200'}`}>
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-semibold text-gray-900">{tarefa.nome}</h5>
                      <span className={`text-sm font-bold ${tarefa.status === 'quase_completo' ? 'text-amber-700' : 'text-blue-700'}`}>
                        {tarefa.progresso}%
                      </span>
                    </div>
                    <Progress value={tarefa.progresso} className="h-2 mb-2" />
                    <p className="text-xs text-gray-600">Estimado: {tarefa.dias} dias | {tarefa.pontos} pts</p>
                  </div>
                ))}
              </div>
            )}

            {/* Tarefas Pendentes */}
            {tarefasStatus.pendentes.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-gray-900">🔲 Tarefas Pendentes (1/6)</h4>
                {tarefasStatus.pendentes.map((tarefa, idx) => (
                  <div key={idx} className="bg-gray-50 p-4 rounded border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <h5 className="font-semibold text-gray-900">{tarefa.nome}</h5>
                      <Badge className="bg-gray-100 text-gray-800">Dia {tarefa.desbloqueadorDia}</Badge>
                    </div>
                    <p className="text-xs text-gray-600">{tarefa.pontos} pts | Ativação final</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Timeline de Atividades */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Timeline — Próximos 7 Dias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { dia: 'Dia 1 (12/03)', status: '✅ COMPLETO', atividades: ['Setup + Dashboard 5%', 'Arquitetura'], percentual: 7 },
                { dia: 'Dia 2-3 (13-14/03)', status: '✅ COMPLETO', atividades: ['Dashboard 100%', 'KPI Charts'], percentual: 25 },
                { dia: 'Dia 4 (15/03)', status: '✅ COMPLETO', atividades: ['Real-time Insights 100%', 'Data Export 100%'], percentual: 45 },
                { dia: 'Dia 5 (16/03)', status: '🔄 EM EXECUÇÃO', atividades: ['Reports 95%', 'Performance Panel 85%'], percentual: 67 },
                { dia: 'Dia 6-8 (17-19/03)', status: '⏳ PLANEJADO', atividades: ['E2E Tests (Dia 6)', 'Validação Final', 'QA'], percentual: 0 }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4">
                  <div className="flex-shrink-0 w-20 text-sm font-semibold text-gray-600">{item.dia}</div>
                  <div className="flex-1">
                    <Badge className={
                      item.status.includes('COMPLETADO') ? 'bg-green-100 text-green-800' :
                      item.status.includes('EM EXECUÇÃO') ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }>
                      {item.status}
                    </Badge>
                    <ul className="text-sm text-gray-700 mt-2 space-y-1">
                      {item.atividades.map((ativ, i) => (
                        <li key={i}>• {ativ}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* KPIs e Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-700">✅ Métricas de Sucesso</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Sprint 7 Completude</span>
                <span className="font-bold text-green-700">100%</span>
              </div>
              <div className="flex justify-between">
                <span>Sprint 7 Defects</span>
                <span className="font-bold text-green-700">0</span>
              </div>
              <div className="flex justify-between">
                <span>Velocity Mantida</span>
                <span className="font-bold text-green-700">5.38pts/dia</span>
              </div>
              <div className="flex justify-between">
                <span>Sprint 8 Prognóstico</span>
                <span className="font-bold text-green-700">100% ON TRACK</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-700">📊 Próximas Ações (24h)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2 text-gray-700">
              <div className="flex gap-2">
                <span className="font-bold text-green-700">✅</span>
                <span>Dashboard e Insights completados (100%)</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-green-700">✅</span>
                <span>Data Export implementado (100%)</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-blue-700">→</span>
                <span>Reports (95%) e Performance (85%) finalizando</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-blue-700">→</span>
                <span>E2E Tests (Dia 6) + Validação Final (Dia 7-8)</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Status Final */}
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <AlertDescription className="text-blue-900 ml-2">
            <strong>STATUS CONSOLIDADO — SPRINT 9 ACELERADO (Dia 5/8):</strong> Executor em alta performance. 
            <strong>Completude: 67%</strong> (27/40 pts). ✅ Dashboard 100%. ✅ Insights 100%. ✅ Export 100%.
            🔄 Reports 95%. 🔄 Performance Panel 85%. Velocity: 5.4pts/dia (acelerado).
            Prognóstico Final: 100% em 7 dias (1 dia antes do prazo).
            <strong className="block mt-2">➜ SPRINT 9 EM RETA FINAL — PREPARANDO SPRINT 10 🚀</strong>
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}