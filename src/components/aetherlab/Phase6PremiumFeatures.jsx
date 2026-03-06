import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Zap, Brain, Smartphone, Workflow, CheckCircle2 } from 'lucide-react';

export default function Phase6PremiumFeatures() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const [selectedTask, setSelectedTask] = useState('ai');

  const phase6Tasks = [
    {
      id: 'ai',
      name: 'AI Document Analysis',
      icon: Brain,
      status: 'PLANNED',
      progress: 0,
      priority: 'CRITICAL',
      startDate: 'Mar 10, 2026',
      targetDate: 'Apr 7, 2026',
      subtasks: [
        'AI classification (contrato/acordo/formulário)',
        'Auto-fill fields com LLM',
        'Risk analysis integrado',
        'Sentiment analysis de partes'
      ],
      description: 'Integração com LLM para análise, classificação e preenchimento automático de documentos'
    },
    {
      id: 'mobile',
      name: 'Mobile App (iOS + Android)',
      icon: Smartphone,
      status: 'PLANNED',
      progress: 0,
      priority: 'CRITICAL',
      startDate: 'Mar 17, 2026',
      targetDate: 'May 5, 2026',
      subtasks: [
        'App nativa com React Native',
        'Biometric auth (Face ID + fingerprint)',
        'Offline signing support',
        'Push notifications'
      ],
      description: 'Aplicativo mobile nativo com suporte a assinatura biométrica e offline'
    },
    {
      id: 'integrations',
      name: 'Zapier + Make Integrations',
      icon: Workflow,
      status: 'PLANNED',
      progress: 0,
      priority: 'HIGH',
      startDate: 'Mar 24, 2026',
      targetDate: 'Apr 21, 2026',
      subtasks: [
        'Zapier app published',
        'Make.com connector',
        'Webhook automations',
        'Template workflows'
      ],
      description: 'Integração com Zapier e Make para automações no-code'
    },
    {
      id: 'webhooks',
      name: 'Advanced Webhooks',
      icon: Zap,
      status: 'PLANNED',
      progress: 0,
      priority: 'MEDIUM',
      startDate: 'Mar 31, 2026',
      targetDate: 'Apr 28, 2026',
      subtasks: [
        'Webhook retry logic',
        'Event filtering',
        'Rate limiting',
        'Dashboard de eventos'
      ],
      description: 'Sistema avançado de webhooks com retry e monitoramento'
    },
    {
      id: 'reports',
      name: 'PDF Reports & Export',
      icon: Zap,
      status: 'PLANNED',
      progress: 0,
      priority: 'MEDIUM',
      startDate: 'Apr 7, 2026',
      targetDate: 'Apr 28, 2026',
      subtasks: [
        'Relatórios em PDF',
        'Export para Excel',
        'Scheduled reports',
        'Custom branding'
      ],
      description: 'Geração de relatórios customizados em PDF e exportação de dados'
    },
    {
      id: 'analytics',
      name: 'Advanced Analytics',
      icon: Zap,
      status: 'PLANNED',
      progress: 0,
      priority: 'MEDIUM',
      startDate: 'Apr 14, 2026',
      targetDate: 'May 12, 2026',
      subtasks: [
        'Dashboard de analytics',
        'Forecasting com ML',
        'Custom dashboards',
        'Email reports automáticos'
      ],
      description: 'Analytics avançado com ML para previsões e insights'
    },
    {
      id: 'api',
      name: 'REST API v2',
      icon: Zap,
      status: 'PLANNED',
      progress: 0,
      priority: 'HIGH',
      startDate: 'Apr 21, 2026',
      targetDate: 'May 26, 2026',
      subtasks: [
        'API documentation completa',
        'SDK em Node.js e Python',
        'API key management',
        'Rate limiting robusto'
      ],
      description: 'API REST v2 com documentação completa e SDKs'
    },
    {
      id: 'security',
      name: 'Security Audit & Penetration',
      icon: Zap,
      status: 'PLANNED',
      progress: 0,
      priority: 'CRITICAL',
      startDate: 'Apr 28, 2026',
      targetDate: 'Jun 9, 2026',
      subtasks: [
        'Penetration testing',
        'Security audit completo',
        'Compliance verification',
        'Bug bounty program'
      ],
      description: 'Auditoria de segurança completa e teste de penetração'
    }
  ];

  const selectedTaskData = phase6Tasks.find(t => t.id === selectedTask);

  const timeline = [
    { week: 'Sem 1-2', focus: 'AI + Mobile kickoff', status: '▓░░░░░░░░' },
    { week: 'Sem 3-4', focus: 'AI beta + Mobile alpha', status: '░▓░░░░░░░' },
    { week: 'Sem 5-6', focus: 'Integrations + API', status: '░░▓░░░░░░' },
    { week: 'Sem 7-8', focus: 'Analytics + Reports', status: '░░░▓░░░░░' },
    { week: 'Sem 9-10', focus: 'Security audit + Launch', status: '░░░░▓░░░░' }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <section className={`p-8 rounded-lg border-2 ${isDark ? 'bg-gradient-to-r from-indigo-900/40 to-blue-900/40 border-indigo-700' : 'bg-gradient-to-r from-indigo-100 to-blue-100 border-indigo-400'}`}>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold flex items-center gap-2">
              <Brain className="w-10 h-10" />
              🚀 Phase 6 - Premium Features
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              AI Document Analysis + Mobile App + Integrations + Advanced Features | Start: Mar 10, 2026 | Duration: 10 weeks
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-indigo-600">8 Critical Tasks</Badge>
              <Badge className="bg-blue-600">40+ Subtasks</Badge>
              <Badge className="bg-purple-600">70 Days</Badge>
            </div>
          </div>
        </section>

        {/* TIMELINE */}
        <section>
          <h2 className="text-2xl font-bold mb-4">📅 Faseamento - 10 Semanas</h2>
          <div className="space-y-3">
            {timeline.map((t, idx) => (
              <div key={idx} className={`p-4 rounded-lg border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-300'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold">{t.week}</span>
                  <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{t.focus}</span>
                </div>
                <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div className="bg-indigo-600 h-full" style={{width: t.status}}></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* TASKS GRID */}
        <section>
          <h2 className="text-2xl font-bold mb-4">🎯 8 Tarefas Críticas</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {phase6Tasks.map((task) => {
              const Icon = task.icon;
              return (
                <Card
                  key={task.id}
                  onClick={() => setSelectedTask(task.id)}
                  className={`cursor-pointer border-2 transition ${
                    selectedTask === task.id
                      ? isDark
                        ? 'bg-indigo-900/40 border-indigo-700'
                        : 'bg-indigo-50 border-indigo-500'
                      : isDark
                      ? 'bg-gray-900 border-gray-800'
                      : 'border-gray-200'
                  }`}
                >
                  <CardContent className="pt-4">
                    <Icon className="w-6 h-6 mb-2 text-indigo-600" />
                    <h3 className="font-bold text-sm mb-1">{task.name}</h3>
                    <Badge className={
                      task.priority === 'CRITICAL'
                        ? 'bg-red-600'
                        : 'bg-orange-600'
                    }>
                      {task.priority}
                    </Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* TASK DETAILS */}
        {selectedTaskData && (
          <section>
            <h2 className="text-2xl font-bold mb-4">📊 {selectedTaskData.name}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
                <CardHeader>
                  <CardTitle>Timeline & Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold">Start Date</p>
                    <p className="font-bold">{selectedTaskData.startDate}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Target Date</p>
                    <p className="font-bold text-indigo-600">{selectedTaskData.targetDate}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold mb-2">Progress</p>
                    <Progress value={selectedTaskData.progress} className="h-2" />
                    <p className="text-xs mt-1">0%</p>
                  </div>
                </CardContent>
              </Card>

              <Card className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                    {selectedTaskData.description}
                  </p>
                </CardContent>
              </Card>

              <Card className={`md:col-span-2 ${isDark ? 'bg-gray-900 border-gray-800' : ''}`}>
                <CardHeader>
                  <CardTitle>Subtasks ({selectedTaskData.subtasks.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                    {selectedTaskData.subtasks.map((sub, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-indigo-600 rounded-full" />
                        {sub}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* SUMMARY */}
        <Card className={`border-2 ${isDark ? 'bg-gradient-to-r from-indigo-900/60 to-blue-900/60 border-indigo-600' : 'bg-gradient-to-r from-indigo-100 to-blue-100 border-indigo-600'}`}>
          <CardContent className="pt-8 space-y-4">
            <h3 className="text-2xl font-bold">💎 Phase 6 - Premium Features Roadmap</h3>
            <div className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
              <p><strong>🎯 Objetivo:</strong> Transformar DocuChain em plataforma premium com AI, mobile e integrações robustas</p>
              <p><strong>📅 Timeline:</strong> 10 semanas (Mar 10 - May 26, 2026)</p>
              <p><strong>🚀 Deliverables:</strong> 8 features críticas + 40+ subtasks</p>
              <p><strong>💰 Impact:</strong> Unlock enterprise contracts + 10x user engagement + Premium pricing</p>
              <p className="text-lg font-bold mt-4">✨ Resultado esperado: DocuChain como #1 plataforma de assinatura digital + AI no Brasil e América Latina</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}