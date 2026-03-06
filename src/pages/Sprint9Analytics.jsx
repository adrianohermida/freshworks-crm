import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  BarChart3, TrendingUp, Database, Eye, FileText, 
  CheckCircle2, AlertCircle, Clock, Zap, Activity
} from 'lucide-react';

export default function Sprint9Analytics() {
  const [sprintData] = useState({
    numero: 9,
    estado: 'EM_EXECUÇÃO',
    diaAtual: 5,
    diasTotais: 8,
    objetivo: 'Advanced Analytics & Reporting',
    dataInicio: '12/03/2026',
    dataFim: '19/03/2026',
    pontosTotal: 40,
    pontosConcluidos: 27
  });

  const [tarefas] = useState([
    {
      id: 1,
      nome: 'Advanced Analytics Dashboard',
      descricao: 'Dashboard com gráficos, métricas KPI e insights em tempo real',
      pontos: 10,
      dias: 3,
      progresso: 100,
      status: 'completo',
      prioridade: 'alta'
    },
    {
      id: 2,
      nome: 'Real-time Data Insights',
      descricao: 'Sistema de insights automáticos baseado em IA',
      pontos: 8,
      dias: 2,
      progresso: 100,
      status: 'completo',
      bloqueador: null
    },
    {
      id: 3,
      nome: 'Custom Reports Generator',
      descricao: 'Gerador customizável de relatórios com templates',
      pontos: 8,
      dias: 3,
      progresso: 95,
      status: 'quase_completo'
    },
    {
      id: 4,
      nome: 'Performance Monitoring Panel',
      descricao: 'Painel de monitoramento de performance em tempo real',
      pontos: 7,
      dias: 2,
      progresso: 85,
      status: 'em_progresso'
    },
    {
      id: 5,
      nome: 'Data Export (PDF/Excel)',
      descricao: 'Funcionalidade de export de dados em múltiplos formatos',
      pontos: 4,
      dias: 1,
      progresso: 100,
      status: 'completo'
    },
    {
      id: 6,
      nome: 'E2E Analytics Tests',
      descricao: 'Testes end-to-end para toda suite de analytics',
      pontos: 3,
      dias: 1,
      progresso: 0,
      status: 'waiting'
    }
  ]);

  const percentualGeral = Math.round((sprintData.pontosConcluidos / sprintData.pontosTotal) * 100);

  const getStatusColor = (status) => {
    switch (status) {
      case 'em_progresso':
        return 'bg-blue-50 border-blue-200';
      case 'blocked':
        return 'bg-orange-50 border-orange-200';
      case 'waiting':
        return 'bg-gray-50 border-gray-200';
      case 'completo':
        return 'bg-green-50 border-green-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'em_progresso':
        return <Badge className="bg-blue-600">🔄 Em Progresso</Badge>;
      case 'blocked':
        return <Badge className="bg-orange-600">⚠️ Bloqueado</Badge>;
      case 'waiting':
        return <Badge className="bg-gray-600">⏳ Aguardando</Badge>;
      case 'completo':
        return <Badge className="bg-green-600">✅ Completo</Badge>;
      default:
        return <Badge>Status Desconhecido</Badge>;
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-8 h-8 text-purple-600" />
            Sprint 9: Advanced Analytics & Reporting
          </h1>
          <p className="text-gray-600">Iniciado em 12/03/2026 | 40 story points | 5 tarefas</p>
        </div>

        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-purple-300 bg-gradient-to-br from-purple-50 to-indigo-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-purple-800">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge className="bg-purple-600 mb-2">🚀 INICIADO</Badge>
              <p className="text-2xl font-bold text-purple-900">Dia 1/8</p>
            </CardContent>
          </Card>

          <Card className="border-blue-300 bg-gradient-to-br from-blue-50 to-cyan-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-blue-800">Completude</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-700">{percentualGeral}%</p>
              <Progress value={percentualGeral} className="h-2 mt-2" />
            </CardContent>
          </Card>

          <Card className="border-green-300 bg-gradient-to-br from-green-50 to-emerald-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-green-800">Story Points</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-green-700">{sprintData.pontosConcluidos}/{sprintData.pontosTotal}</p>
              <p className="text-xs text-green-600 mt-1">0 completados</p>
            </CardContent>
          </Card>

          <Card className="border-orange-300 bg-gradient-to-br from-orange-50 to-amber-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-orange-800">Velocity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-orange-700">6.5</p>
              <p className="text-xs text-orange-600 mt-1">pts/dia (estimado)</p>
            </CardContent>
          </Card>
        </div>

        {/* Tarefas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Tarefas do Sprint 9 (6 tarefas)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {tarefas.map((tarefa) => (
              <div key={tarefa.id} className={`p-4 rounded-lg border ${getStatusColor(tarefa.status)}`}>
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      {tarefa.id}. {tarefa.nome}
                      {getStatusBadge(tarefa.status)}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">{tarefa.descricao}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="text-sm font-bold text-gray-900">{tarefa.pontos} pts</p>
                    <p className="text-xs text-gray-500">{tarefa.dias} dias est.</p>
                  </div>
                </div>

                {tarefa.status === 'em_progresso' && (
                  <>
                    <Progress value={tarefa.progresso} className="h-2 mb-2" />
                    <p className="text-xs text-gray-600">{tarefa.progresso}% concluído</p>
                  </>
                )}

                {tarefa.status === 'blocked' && (
                  <Alert className="mt-2 border-orange-200 bg-white">
                    <AlertCircle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800 ml-2 text-xs">
                      {tarefa.bloqueador}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Próximos Passos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="text-blue-700 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Timeline — Próximos 3 Dias
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3 text-gray-700">
              <div>
                <p className="font-semibold text-blue-900">Dia 1-2 (12-13/03)</p>
                <ul className="text-xs mt-1 space-y-1">
                  <li>• Iniciar Advanced Analytics Dashboard (5% → 30%)</li>
                  <li>• Setup da arquitetura de dados</li>
                  <li>• Criar primeiros gráficos KPI</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-blue-900">Dia 3 (14/03)</p>
                <ul className="text-xs mt-1 space-y-1">
                  <li>• Dashboard → 60%</li>
                  <li>• Iniciar Real-time Data Insights</li>
                  <li>• Validar integração com dados</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-purple-700 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Ações Imediatas (Agora)
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2 text-gray-700">
              <div className="flex gap-2">
                <span className="font-bold text-purple-700">1.</span>
                <span>Setup do projeto & dependências</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-purple-700">2.</span>
                <span>Criar estrutura de componentes</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-purple-700">3.</span>
                <span>Integrar Recharts & dados</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold text-purple-700">4.</span>
                <span>Iniciar Dashboard layout</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sprint Status */}
        <Alert className="border-purple-200 bg-purple-50">
          <CheckCircle2 className="h-5 w-5 text-purple-600" />
          <AlertDescription className="text-purple-900 ml-2">
            <strong>SPRINT 9 INICIADO!</strong> Executor focando em Advanced Analytics & Reporting.
            Dashboard será o coração da funcionalidade. Todas as dependências resolvidas.
            Prognóstico: 100% em 8 dias (mantendo velocity de 6.5pts/dia).
            <strong className="block mt-2">➜ SPRINT 8 ✅ FINALIZADO 100% — SPRINT 9 🚀 EXECUÇÃO INICIADA</strong>
          </AlertDescription>
        </Alert>

        {/* Dependencies & Tech Stack */}
        <Card>
          <CardHeader>
            <CardTitle>Tech Stack & Dependências</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-semibold text-gray-900 mb-2">Já Disponível ✅</p>
                <ul className="text-gray-700 space-y-1">
                  <li>• React + TypeScript</li>
                  <li>• Recharts (gráficos)</li>
                  <li>• TailwindCSS (styling)</li>
                  <li>• Base44 SDK (dados)</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold text-gray-900 mb-2">Integração Necessária</p>
                <ul className="text-gray-700 space-y-1">
                  <li>• Real-time data sync</li>
                  <li>• PDF export (jsPDF)</li>
                  <li>• Excel export (XLSX)</li>
                  <li>• IA insights (OpenAI)</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}