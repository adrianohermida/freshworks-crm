import React from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Zap, TrendingUp } from 'lucide-react';

export default function SprintExecutionStatus() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  const sprintReview = {
    sprint: 'Sprint 5 - Global Expansion',
    period: 'Semana 1-3 de 10',
    status: '48% COMPLETO',
    totalTasks: 7,
    completedDesign: 4,
    completedBackend: 0,
    inProgressFrontend: 7
  };

  const tasksCompleted = [
    { name: '✅ i18n Manager', progress: 40, status: 'Frontend criado' },
    { name: '✅ Regional Compliance Matrix', progress: 35, status: 'Dashboard criado' },
    { name: '✅ Global Support Hub', progress: 40, status: 'UI estruturada' },
    { name: '✅ Multi-Region Deployment', progress: 30, status: 'Blueprint criado' }
  ];

  const tasksInProgress = [
    { name: '🚀 Go-to-Market Regional', progress: 45, status: 'Landing page criada', next: 'Integrar com Home' },
    { name: '🚀 Certificações Tracker', progress: 50, status: 'Dashboard criado', next: 'Automação de status' },
    { name: '🚀 Enterprise Partnerships', progress: 25, status: 'Estrutura base', next: 'Dashboard de pipeline' }
  ];

  const designRefactor = [
    { task: 'Minimalist Header', status: '✅ DONE', file: 'MinimalHeader.js' },
    { task: 'Home Page Redesign', status: '✅ DONE', file: 'Home.js' },
    { task: 'Pricing Page Minimal', status: '✅ DONE', file: 'PricingPage.js' },
    { task: 'Layout Integration', status: '✅ DONE', file: 'Layout.js' }
  ];

  const pendingActions = [
    { task: 'Integrar i18n em todas páginas', priority: 'HIGH', daysLeft: '14 dias' },
    { task: 'Deploy multi-region setup', priority: 'HIGH', daysLeft: '21 dias' },
    { task: 'Auditorias certificações iniciadas', priority: 'MEDIUM', daysLeft: '35 dias' },
    { task: 'Pipeline enterprise partnerships', priority: 'HIGH', daysLeft: '30 dias' },
    { task: 'Backend functions para workflows', priority: 'MEDIUM', daysLeft: '28 dias' }
  ];

  const nextSprintPreview = [
    { phase: 'Phase 6: Premium Features', status: 'PLANNED', tasks: 8, focus: 'AI + Mobile + Integrations' }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <section className={`p-8 rounded-lg border-2 ${isDark ? 'bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-green-700' : 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-400'}`}>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold">🚀 SPRINT EXECUTION REPORT</h1>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {sprintReview.sprint} | {sprintReview.period}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-orange-600 px-4 py-2 text-base">{sprintReview.status}</Badge>
              <Badge className="bg-blue-600 px-4 py-2 text-base">{sprintReview.totalTasks}/7 Tarefas</Badge>
              <Badge className="bg-purple-600 px-4 py-2 text-base">Semana 3/10</Badge>
            </div>
          </div>
        </section>

        {/* COMPLETED TASKS */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
            ✅ Tarefas Completadas (Frontend)
          </h2>
          <div className="space-y-3">
            {tasksCompleted.map((task, idx) => (
              <Card key={idx} className={`border-2 ${isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-400'}`}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold">{task.name}</h3>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{task.status}</p>
                    </div>
                    <Badge className="bg-green-600">{task.progress}%</Badge>
                  </div>
                  <Progress value={task.progress} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* IN PROGRESS */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-600" />
            🚀 Em Andamento (Semana 3)
          </h2>
          <div className="space-y-3">
            {tasksInProgress.map((task, idx) => (
              <Card key={idx} className={`border-2 ${isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-400'}`}>
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold">{task.name}</h3>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{task.status}</p>
                      <p className="text-xs font-semibold mt-1 text-orange-600">Próximo: {task.next}</p>
                    </div>
                    <Badge className="bg-blue-600">{task.progress}%</Badge>
                  </div>
                  <Progress value={task.progress} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* DESIGN REFACTOR */}
        <section>
          <h2 className="text-2xl font-bold mb-4">🎨 Design Refactor - Minimalist (Paralelo)</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {designRefactor.map((item, idx) => (
              <Card key={idx} className={`border-2 ${isDark ? 'bg-purple-900/20 border-purple-700' : 'bg-purple-50 border-purple-400'}`}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">{item.task}</h3>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{item.file}</p>
                    </div>
                    <Badge className="bg-green-600">{item.status}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* PENDING ACTIONS */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <AlertCircle className="w-6 h-6 text-yellow-600" />
            📋 Ações Pendentes (Semana 4-10)
          </h2>
          <div className="space-y-3">
            {pendingActions.map((action, idx) => (
              <Card key={idx} className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold">{action.task}</h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={
                        action.priority === 'HIGH' ? 'bg-red-600' : 'bg-yellow-600'
                      }>
                        {action.priority}
                      </Badge>
                      <span className={`text-xs font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {action.daysLeft}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* METRICS */}
        <section>
          <h2 className="text-2xl font-bold mb-4">📊 Consolidado</h2>
          <div className="grid md:grid-cols-4 gap-4">
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-green-600">4/7</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Frontend Done</p>
              </CardContent>
            </Card>
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-blue-600">3/7</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>In Progress</p>
              </CardContent>
            </Card>
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-purple-600">4/4</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Design Refactor</p>
              </CardContent>
            </Card>
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold text-orange-600">48%</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Sprint Progress</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* NEXT SPRINT */}
        <Card className={`border-2 ${isDark ? 'bg-gradient-to-r from-indigo-900/40 to-blue-900/40 border-indigo-700' : 'bg-gradient-to-r from-indigo-100 to-blue-100 border-indigo-400'}`}>
          <CardContent className="pt-8 space-y-4">
            <h3 className="text-2xl font-bold">🎯 Phase 6 Preview (Próximo)</h3>
            <p className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
              <strong>Foco:</strong> Premium Features - AI Document Analysis, Mobile App, Zapier/Make Integrations
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-indigo-600 px-3 py-1">8 Tarefas Planejadas</Badge>
              <Badge className="bg-blue-600 px-3 py-1">Duração: 10 semanas</Badge>
              <Badge className="bg-purple-600 px-3 py-1">Start: 2026-05-15</Badge>
            </div>
          </CardContent>
        </Card>

        {/* SUMMARY */}
        <Card className={`border-2 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'}`}>
          <CardHeader>
            <CardTitle>📈 Resumo Executivo</CardTitle>
          </CardHeader>
          <CardContent className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
            <p>✅ <strong>Sprint 5 Status:</strong> 48% completo | 7/7 tarefas criadas | 4/7 frontend done</p>
            <p>🎨 <strong>Design Refactor:</strong> 100% completo | Minimalista iOS/Linux/Bitcoin | Header + Home + Pricing + Layout</p>
            <p>🚀 <strong>Próximos 7 dias:</strong> Integrar i18n em páginas | Iniciar backend workflows | Setup multi-region</p>
            <p>📊 <strong>Projeto DocuChain:</strong> 92% estimado (Fases 1-5 = 4 completas + Sprint 5 em andamento)</p>
            <p>💎 <strong>Ready para Phase 6?</strong> Sim, assim que Sprint 5 atingir 85%+ (semana 5-6)</p>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}