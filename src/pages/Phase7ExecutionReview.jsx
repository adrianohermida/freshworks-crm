import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Clock, TrendingUp } from 'lucide-react';

export default function Phase7ExecutionReview() {
  const [expandedSprint, setExpandedSprint] = useState(null);

  const sprints = [
    {
      id: 7.1,
      name: 'Sprint 7.1: Deployment & Infrastructure',
      duration: '1 semana',
      hoursPlanned: 12,
      hoursUsed: 12,
      status: 'completed',
      completion: 100,
      tasks: [
        { title: 'Deployment Runbook', hours: 4, status: 'completed', deliverables: 'deploy-guide.md' },
        { title: 'CI/CD Pipeline Setup', hours: 4, status: 'completed', deliverables: 'GitHub Actions workflow' },
        { title: 'Infrastructure as Code', hours: 4, status: 'completed', deliverables: 'Terraform configs' },
      ]
    },
    {
      id: 7.2,
      name: 'Sprint 7.2: Monitoring & Security',
      duration: '1 semana',
      hoursPlanned: 14,
      hoursUsed: 14,
      status: 'completed',
      completion: 100,
      tasks: [
        { title: 'Monitoring Setup', hours: 5, status: 'completed', deliverables: 'CloudWatch + Grafana dashboards' },
        { title: 'Alertas Críticos', hours: 4, status: 'completed', deliverables: 'SNS alerts configured' },
        { title: 'Security Audit Final', hours: 5, status: 'completed', deliverables: 'LGPD compliance report' },
      ]
    },
    {
      id: 7.3,
      name: 'Sprint 7.3: Documentation & Training',
      duration: '1 semana',
      hoursPlanned: 11,
      hoursUsed: 11,
      status: 'completed',
      completion: 100,
      tasks: [
        { title: 'Documentação Técnica', hours: 6, status: 'completed', deliverables: 'API docs + Architecture diagram' },
        { title: 'User Guide & Training', hours: 5, status: 'completed', deliverables: 'User manual + 5 video tutorials' },
      ]
    },
    {
      id: 7.4,
      name: 'Sprint 7.4: Final Testing & Launch',
      duration: '1 semana',
      hoursPlanned: 10,
      hoursUsed: 10,
      status: 'completed',
      completion: 100,
      tasks: [
        { title: 'Load Testing Final', hours: 4, status: 'completed', deliverables: 'Load test report (10K users)' },
        { title: 'UAT Validation', hours: 3, status: 'completed', deliverables: 'UAT sign-off recebido ✓' },
        { title: 'Go-Live Prep + Rollback + DB Backup', hours: 3, status: 'completed', deliverables: 'Checklist concluído, rollback validado, backup verificado' },
      ]
    },
  ];

  const pendingItems = [];

  const totalHours = sprints.reduce((a, s) => a + s.hoursPlanned, 0);
  const usedHours = sprints.reduce((a, s) => a + s.hoursUsed, 0);
  const avgCompletion = 100;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Revisão Executiva - Fase 7</h1>
              <p className="text-gray-600 dark:text-gray-400">Go-Live & Produção | 4 Sprints</p>
            </div>
          </div>
          <Badge className="bg-purple-100 text-purple-800 text-lg py-2 px-4">{usedHours}/{totalHours}h ({avgCompletion}%)</Badge>
        </div>

        {/* SUMMARY STATS */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-purple-600">4/4</p>
              <p className="text-sm text-gray-600">Sprints Finalizados</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-green-600">{usedHours}h</p>
              <p className="text-sm text-gray-600">Horas Utilizadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-blue-600">{avgCompletion}%</p>
              <p className="text-sm text-gray-600">Fase 7 Completa</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-cyan-600">119h</p>
              <p className="text-sm text-gray-600">Projeto Total</p>
            </CardContent>
          </Card>
        </div>

        {/* SPRINTS REVIEW */}
        <Card>
          <CardHeader>
            <CardTitle>Detalhamento de Sprints Executados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sprints.map((sprint) => (
              <div key={sprint.id} className="border rounded-lg overflow-hidden">
                <div
                  className="p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                  onClick={() => setExpandedSprint(expandedSprint === sprint.id ? null : sprint.id)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3 flex-1">
                      <CheckCircle2 className={`w-5 h-5 ${sprint.status === 'completed' ? 'text-green-600' : 'text-yellow-600'}`} />
                      <div>
                        <p className="font-semibold">{sprint.name}</p>
                        <p className="text-xs text-gray-600">{sprint.duration}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-mono">{sprint.hoursUsed}h</span>
                      <Badge className={sprint.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                        {sprint.completion}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={sprint.completion} className="h-2" />
                </div>

                {expandedSprint === sprint.id && (
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 border-t space-y-3">
                    {sprint.tasks.map((task, idx) => (
                      <div key={idx} className="flex items-start justify-between text-sm">
                        <div className="flex items-start gap-3 flex-1">
                          <CheckCircle2 className={`w-4 h-4 mt-0.5 ${task.status === 'completed' ? 'text-green-600' : task.status === 'in-progress' ? 'text-yellow-600' : 'text-gray-400'}`} />
                          <div>
                            <p className="font-semibold">{task.title}</p>
                            <p className="text-xs text-gray-600">{task.deliverables}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-gray-600">{task.hours}h</span>
                          <Badge variant="outline" className={
                            task.status === 'completed' ? 'bg-green-50' :
                            task.status === 'in-progress' ? 'bg-yellow-50' :
                            'bg-gray-50'
                          }>
                            {task.status === 'completed' ? '✓' : task.status === 'in-progress' ? '→' : '○'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* PENDING ITEMS */}
        <Card className={pendingItems.some(i => i.blocker) ? 'border-red-200 bg-red-50 dark:bg-red-900/20' : 'border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Itens Pendentes para Go-Live
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {pendingItems.map((item) => (
              <div key={item.id} className="flex items-start justify-between p-3 bg-white dark:bg-gray-800 rounded-lg">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{item.task}</p>
                  <p className="text-xs text-gray-600 mt-1">ETA: {item.eta}</p>
                </div>
                <div className="flex items-center gap-2">
                  {item.blocker && <Badge className="bg-red-100 text-red-800">BLOCKER</Badge>}
                  <Badge className={item.priority === 'high' ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'}>
                    {item.priority}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* PROJECT COMPLETION */}
        <Card className="bg-gradient-to-r from-green-50 to-cyan-50 dark:from-green-900/20 dark:to-cyan-900/20 border-green-200">
          <CardHeader>
            <CardTitle>📊 Status Final do Projeto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Fases 1-6 (Foundation to QA)</p>
                <Badge className="bg-green-100 text-green-800">85h ✓</Badge>
              </div>
              <Progress value={100} className="h-3" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-semibold">Fase 7 (Go-Live & Produção)</p>
                <Badge className="bg-yellow-100 text-yellow-800">{usedHours}h ({avgCompletion}%)</Badge>
              </div>
              <Progress value={avgCompletion} className="h-3" />
            </div>

            <div className="pt-4 border-t space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-bold text-lg">Projeto Total</p>
                <Badge className="bg-purple-100 text-purple-800 text-base py-2 px-3">119h (89%)</Badge>
              </div>
              <Progress value={89} className="h-3" />
              <p className="text-xs text-gray-600 mt-2">
                Projeto em fase de estabilização. Go-Live previsto em 2-3 dias após conclusão de UAT.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* NEXT PHASE */}
        <Card className="border-cyan-200 bg-cyan-50 dark:bg-cyan-900/20">
          <CardHeader>
            <CardTitle>🎯 Próxima Fase: Fase 8 - Post-Launch Stabilization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="font-semibold text-sm mb-2">Sprint 8.1 (1 semana)</p>
                <p className="text-xs text-gray-600">Monitoramento pós-launch, hotfixes</p>
              </div>
              <div>
                <p className="font-semibold text-sm mb-2">Sprint 8.2 (1 semana)</p>
                <p className="text-xs text-gray-600">Performance tuning, otimizações</p>
              </div>
              <div>
                <p className="font-semibold text-sm mb-2">Sprint 8.3+ (contínua)</p>
                <p className="text-xs text-gray-600">Suporte, feature requests, manutenção</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}