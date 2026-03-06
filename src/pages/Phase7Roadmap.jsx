import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Rocket, Shield, TrendingUp, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function Phase7Roadmap() {
  const [expandedTask, setExpandedTask] = useState(null);

  const sprints = [
    {
      name: 'Sprint 7.1: Deployment & Infrastructure',
      duration: '1 semana',
      hours: 12,
      icon: Rocket,
      tasks: [
        { id: 1, title: 'Deployment Runbook', hours: 4, status: 'ready', description: 'Guia passo-a-passo para deploy em produção' },
        { id: 2, title: 'CI/CD Pipeline Setup', hours: 4, status: 'ready', description: 'GitHub Actions ou similar para auto-deploy' },
        { id: 3, title: 'Infrastructure as Code', hours: 4, status: 'ready', description: 'Terraform/CloudFormation para reproduzibilidade' },
      ]
    },
    {
      name: 'Sprint 7.2: Monitoring & Security',
      duration: '1 semana',
      hours: 14,
      icon: Shield,
      tasks: [
        { id: 4, title: 'Monitoring Setup', hours: 5, status: 'ready', description: 'CloudWatch + Prometheus + Grafana' },
        { id: 5, title: 'Alertas Críticos', hours: 4, status: 'ready', description: 'Notificações para falhas, latência, erros' },
        { id: 6, title: 'Security Audit Final', hours: 5, status: 'ready', description: 'Validação de LGPD, CSRF, SQL Injection' },
      ]
    },
    {
      name: 'Sprint 7.3: Documentation & Knowledge Transfer',
      duration: '1 semana',
      hours: 11,
      icon: FileText,
      tasks: [
        { id: 7, title: 'Documentação Técnica', hours: 6, status: 'ready', description: 'API docs, Architecture, Database schema' },
        { id: 8, title: 'User Guide & Training', hours: 5, status: 'ready', description: 'Manual de usuário, tutoriais em vídeo' },
      ]
    },
    {
      name: 'Sprint 7.4: Final Testing & Launch',
      duration: '1 semana',
      hours: 10,
      icon: CheckCircle2,
      tasks: [
        { id: 9, title: 'Load Testing Final', hours: 4, status: 'ready', description: 'Teste com 10K+ usuários simultâneos' },
        { id: 10, title: 'UAT Validation', hours: 3, status: 'ready', description: 'Teste de aceitação com stakeholders' },
        { id: 11, title: 'Go-Live Prep', hours: 3, status: 'ready', description: 'Checklist final, rollback plan, comunicação' },
      ]
    },
  ];

  const risks = [
    { id: 1, risk: 'Degradação de Performance', probability: 'medium', impact: 'high', mitigation: 'Load testing e cache strategy' },
    { id: 2, risk: 'Data Migration Issues', probability: 'low', impact: 'critical', mitigation: 'Backup e dry-run antes do go-live' },
    { id: 3, risk: 'Security Vulnerabilities', probability: 'low', impact: 'critical', mitigation: 'Security audit + penetration testing' },
    { id: 4, risk: 'User Adoption Issues', probability: 'medium', impact: 'medium', mitigation: 'Training completo e suporte pós-launch' },
  ];

  const successCriteria = [
    { metric: 'System Uptime', target: '99.9%', status: 'on-track' },
    { metric: 'Response Time (p95)', target: '< 500ms', status: 'on-track' },
    { metric: 'Error Rate', target: '< 0.1%', status: 'on-track' },
    { metric: 'User Adoption', target: '80% within 30 days', status: 'pending' },
    { metric: 'Support Tickets', target: '< 5/day after stabilization', status: 'pending' },
    { metric: 'Test Coverage', target: '98%+', status: 'achieved' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-100 dark:bg-cyan-900 rounded-lg">
              <Rocket className="w-6 h-6 text-cyan-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Fase 7: Go-Live & Produção</h1>
              <p className="text-gray-600 dark:text-gray-400">4 sprints de preparação para produção | 34 horas</p>
            </div>
          </div>
          <Badge className="bg-cyan-100 text-cyan-800 text-lg py-2 px-4">34h Planejadas</Badge>
        </div>

        {/* SPRINTS ROADMAP */}
        <div className="space-y-4">
          {sprints.map((sprint, idx) => {
            const IconComponent = sprint.icon;
            return (
              <Card key={idx} className="hover:shadow-lg transition-shadow">
                <CardHeader className="cursor-pointer" onClick={() => setExpandedTask(expandedTask === idx ? null : idx)}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded">
                        <IconComponent className="w-5 h-5 text-cyan-600" />
                      </div>
                      <div>
                        <CardTitle className="text-base">{sprint.name}</CardTitle>
                        <p className="text-xs text-gray-600 mt-1">{sprint.duration} • {sprint.hours}h</p>
                      </div>
                    </div>
                    <Badge className="bg-cyan-100 text-cyan-800">{sprint.tasks.length} tasks</Badge>
                  </div>
                </CardHeader>

                {expandedTask === idx && (
                  <CardContent className="space-y-3">
                    {sprint.tasks.map((task) => (
                      <div key={task.id} className="border rounded-lg p-3 bg-gray-50 dark:bg-gray-800">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-semibold text-sm">{task.title}</p>
                          <span className="text-xs text-gray-600 font-mono">{task.hours}h</span>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{task.description}</p>
                        <Badge variant="outline" className="bg-green-50">Ready</Badge>
                      </div>
                    ))}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>

        {/* SUCCESS CRITERIA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Critérios de Sucesso
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {successCriteria.map((criteria, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm">{criteria.metric}</p>
                  <p className="text-xs text-gray-600">Target: {criteria.target}</p>
                </div>
                <Badge className={
                  criteria.status === 'achieved' ? 'bg-green-100 text-green-800' :
                  criteria.status === 'on-track' ? 'bg-blue-100 text-blue-800' :
                  'bg-yellow-100 text-yellow-800'
                }>
                  {criteria.status === 'achieved' ? '✓ Achieved' : 
                   criteria.status === 'on-track' ? '→ On-Track' : 
                   '○ Pending'}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* RISK MATRIX */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5" />
              Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {risks.map((risk) => (
                <div key={risk.id} className="border rounded-lg p-4">
                  <p className="font-semibold text-sm mb-2">{risk.risk}</p>
                  <div className="space-y-2 text-xs mb-3">
                    <p className="flex items-center gap-2">
                      <span className="w-20">Probability:</span>
                      <Badge variant="outline" className={
                        risk.probability === 'high' ? 'bg-red-50' :
                        risk.probability === 'medium' ? 'bg-yellow-50' :
                        'bg-green-50'
                      }>{risk.probability}</Badge>
                    </p>
                    <p className="flex items-center gap-2">
                      <span className="w-20">Impact:</span>
                      <Badge variant="outline" className={
                        risk.impact === 'critical' ? 'bg-red-50' :
                        risk.impact === 'high' ? 'bg-orange-50' :
                        'bg-yellow-50'
                      }>{risk.impact}</Badge>
                    </p>
                  </div>
                  <p className="text-xs text-gray-600 bg-gray-50 dark:bg-gray-800 p-2 rounded">
                    <span className="font-semibold">Mitigation:</span> {risk.mitigation}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* TIMELINE */}
        <Card>
          <CardHeader>
            <CardTitle>Timeline de Execução</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sprints.map((sprint, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="w-32 text-xs font-semibold truncate">Sprint 7.{idx + 1}</div>
                <div className="flex-1">
                  <Progress value={((idx + 1) / sprints.length) * 100} className="h-3" />
                </div>
                <span className="text-xs text-gray-600 w-12 text-right">{sprint.hours}h</span>
              </div>
            ))}
            <div className="mt-4 pt-4 border-t">
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Total Fase 7:</span> 34 horas em 4 semanas
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-semibold">Projeto Completo:</span> 119 horas (85h Fases 1-6 + 34h Fase 7)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ACTION */}
        <div className="flex gap-3 justify-center">
          <Button className="bg-cyan-600 hover:bg-cyan-700 gap-2 px-6">
            <Rocket className="w-4 h-4" />
            Iniciar Fase 7 - Sprint 7.1
          </Button>
        </div>
      </div>
    </div>
  );
}