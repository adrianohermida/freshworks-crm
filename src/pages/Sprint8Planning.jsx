import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Rocket, Target, AlertCircle, CheckCircle2, TrendingUp } from 'lucide-react';

export default function Sprint8Planning() {
  const sprintGoal = 'Advanced Features & Mobile Optimization';
  
  const tarefas = [
    {
      id: 1,
      nome: 'Integração Intimações V2',
      descricao: 'Sincronização avançada de intimações com filtros e busca',
      prioridade: 'CRITICAL',
      pontosStory: 12,
      dependencias: ['Sprint 7 - Auditoria'],
      equipe: 'Backend + Frontend',
      estimadoDias: 3.5
    },
    {
      id: 2,
      nome: 'Google Calendar Sync',
      descricao: 'Integração automática de prazos legais com Google Calendar',
      prioridade: 'HIGH',
      pontosStory: 8,
      dependencias: [],
      equipe: 'Backend',
      estimadoDias: 2
    },
    {
      id: 3,
      nome: 'Teste E2E Sincronização',
      descricao: 'Cobertura completa de testes para fluxo de importação',
      prioridade: 'HIGH',
      pontosStory: 5,
      dependencias: ['Sprint 7 - Sync V2'],
      equipe: 'QA',
      estimadoDias: 1.5
    },
    {
      id: 4,
      nome: 'Mobile App (React Native)',
      descricao: 'Aplicativo mobile para iOS/Android',
      prioridade: 'CRITICAL',
      pontosStory: 13,
      dependencias: [],
      equipe: 'Mobile Team',
      estimadoDias: 4
    },
    {
      id: 5,
      nome: 'Performance Optimization',
      descricao: 'Otimização de bundle e lazy loading',
      prioridade: 'MEDIUM',
      pontosStory: 5,
      dependencias: [],
      equipe: 'DevOps',
      estimadoDias: 1.5
    }
  ];

  const totalPontos = tarefas.reduce((s, t) => s + t.pontosStory, 0);
  const totalDias = tarefas.reduce((s, t) => s + t.estimadoDias, 0);

  const getPriorityColor = (priority) => {
    const colors = {
      CRITICAL: 'bg-red-100 text-red-800',
      HIGH: 'bg-orange-100 text-orange-800',
      MEDIUM: 'bg-yellow-100 text-yellow-800',
      LOW: 'bg-gray-100 text-gray-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Sprint 8 — Planejamento</h1>
              <p className="text-gray-600 mt-2">12/03 → 19/03/2026 (8 dias)</p>
            </div>
            <Badge className="bg-purple-600 px-4 py-2 text-base">KICKOFF</Badge>
          </div>
          <p className="text-lg text-gray-700 font-medium">🎯 {sprintGoal}</p>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600">{totalPontos}</div>
              <div className="text-xs text-gray-600">Story Points</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600">{tarefas.length}</div>
              <div className="text-xs text-gray-600">Tarefas</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600">{totalDias.toFixed(1)}d</div>
              <div className="text-xs text-gray-600">Dias Estimados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-orange-600">2</div>
              <div className="text-xs text-gray-600">Bloqueadores Potenciais</div>
            </CardContent>
          </Card>
        </div>

        {/* Tarefas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Tarefas do Sprint
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {tarefas.map(tarefa => (
              <div key={tarefa.id} className="border border-gray-200 rounded-lg p-4 space-y-3 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900">{tarefa.nome}</h4>
                      <Badge className={getPriorityColor(tarefa.prioridade)}>
                        {tarefa.prioridade}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{tarefa.descricao}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">{tarefa.pontosStory}</div>
                    <div className="text-xs text-gray-600">pts</div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-xs text-gray-600">
                  <div>
                    <span className="text-gray-500">Equipe:</span>
                    <p className="font-medium">{tarefa.equipe}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Estimado:</span>
                    <p className="font-medium">{tarefa.estimadoDias}d</p>
                  </div>
                  {tarefa.dependencias.length > 0 && (
                    <div>
                      <span className="text-gray-500">Dependências:</span>
                      <p className="font-medium">{tarefa.dependencias.join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Riscos & Mitigações */}
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-700">
              <AlertCircle className="w-5 h-5" />
              Riscos & Mitigações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-3 p-3 bg-white rounded border border-orange-200">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Complexidade Mobile (React Native)</h4>
                <p className="text-sm text-gray-600">Mobile Team com learning curve potencial</p>
                <p className="text-xs text-orange-700 mt-1">✅ Mitigação: Boilerplate pronto, arquitetura pré-planejada</p>
              </div>
            </div>

            <div className="flex gap-3 p-3 bg-white rounded border border-orange-200">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">Integração Google Calendar</h4>
                <p className="text-sm text-gray-600">Rate limits e autenticação OAuth</p>
                <p className="text-xs text-orange-700 mt-1">✅ Mitigação: Caching implementado, fallback manual</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dependências */}
        <Alert className="border-blue-200 bg-blue-50">
          <CheckCircle2 className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-900 ml-2">
            <strong>Dependências Sprint 7 → Sprint 8:</strong>
            <ul className="list-disc list-inside ml-2 mt-1 text-sm">
              <li>Sincronizador Publicações V2 ✅ (input para teste E2E)</li>
              <li>Auditoria de Sincronização ✅ (baseline para monitoramento Mobile)</li>
              <li>Marca LegalPush ✅ (aplicar em mobile app)</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Timeline Crítica */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Caminho Crítico
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-bold text-red-600">1º:</span>
              <span>Mobile App (13pts, 4d) — Inicia Dia 1, EOD Dia 4</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-orange-600">2º:</span>
              <span>Integração Intimações (12pts, 3.5d) — Inicia Dia 2, EOD Dia 5</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-yellow-600">3º:</span>
              <span>Google Calendar (8pts, 2d) — Inicia Dia 4, EOD Dia 6</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-green-600">4º:</span>
              <span>E2E Tests (5pts, 1.5d) — Inicia Dia 5, EOD Dia 6</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-blue-600">5º:</span>
              <span>Performance (5pts, 1.5d) — Inicia Dia 7, EOD Dia 8</span>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center p-6 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-2">🚀 Sprint 8 Pronto para Kickoff</h3>
          <p className="text-gray-600">
            43 Story Points | 5 Tarefas | Caminho Crítico definido | Todas as dependências OK
          </p>
        </div>
      </div>
    </div>
  );
}