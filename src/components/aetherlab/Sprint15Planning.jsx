import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, AlertCircle, ArrowRight, Zap } from 'lucide-react';

export default function Sprint15Planning() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  const sprint14Tasks = [
    { name: 'Certificado ICP-Brasil', status: '✅', progress: 100 },
    { name: 'Fluxo de Aprovação Multi-Level', status: '✅', progress: 100 },
    { name: 'Dashboard Compliance LGPD/GDPR', status: '✅', progress: 100 },
    { name: 'Export/Import Documentos', status: '✅', progress: 100 },
    { name: 'API REST Completa', status: '✅', progress: 100 }
  ];

  const sprint15Roadmap = [
    {
      id: 1,
      name: 'Sistema de Templates Avançado',
      desc: 'Variáveis dinâmicas, condicionais e loops',
      complexity: 'Média',
      days: 1.5,
      icon: '📝',
      status: '✅ CONCLUÍDO'
    },
    {
      id: 2,
      name: 'Coleta Digital com Prova de Origem',
      desc: 'Registro de screenshots, vídeos e sensores',
      complexity: 'Alta',
      days: 2,
      icon: '📹',
      status: '✅ CONCLUÍDO'
    },
    {
      id: 3,
      name: 'Notificações Eletrônicas com Rastreamento',
      desc: 'Entrega garantida com prova de recebimento',
      complexity: 'Média',
      days: 1.5,
      icon: '📧',
      status: '✅ CONCLUÍDO'
    },
    {
      id: 4,
      name: 'Sistema de Webhooks Avançado',
      desc: 'Eventos em tempo real com retry automático',
      complexity: 'Média',
      days: 1.5,
      icon: '🪝',
      status: '✅ CONCLUÍDO'
    },
    {
      id: 5,
      name: 'Integração com Observatório Nacional',
      desc: 'Timestamp verificado e autoridades certificadoras',
      complexity: 'Alta',
      days: 2,
      icon: '🔬',
      status: '✅ CONCLUÍDO'
    },
    {
      id: 6,
      name: 'Analytics Avançado + Relatórios',
      desc: 'Dashboards de uso, ROI e conformidade',
      complexity: 'Média',
      days: 1.5,
      icon: '📊',
      status: '✅ CONCLUÍDO'
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">🎯 Sprint 15 Planning</h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Revisão Sprint 14 → Roadmap Sprint 15: Coletas Digitais & Compliance
          </p>
        </div>

        {/* Sprint 14 - Conclusão */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            Sprint 14: Certificados + API (100% COMPLETO)
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {sprint14Tasks.map((task, idx) => (
              <Card key={idx} className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{task.name}</span>
                    <Badge className="bg-green-600">{task.status}</Badge>
                  </div>
                  <div className="w-full bg-gray-300 h-2 rounded">
                    <div className="bg-green-500 h-2 rounded" style={{ width: '100%' }} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className={`p-4 rounded-lg ${isDark ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
            <p className={`text-sm ${isDark ? 'text-green-300' : 'text-green-800'}`}>
              ✅ Sprint 14 completado! Todas as tarefas entregues com qualidade. Progresso total do projeto: ~87%
            </p>
          </div>
        </section>

        {/* Sprint 15 - Roadmap */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            Sprint 15: Coletas, Webhooks & Analytics (100% COMPLETO)
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {sprint15Roadmap.map((task) => (
              <Card key={task.id} className={isDark ? 'bg-gray-800 border-gray-700' : 'border-gray-200'}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{task.icon}</span>
                      <div>
                        <CardTitle className="text-lg">{task.name}</CardTitle>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                          {task.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-center">
                    <Badge 
                      className={task.complexity === 'Alta' ? 'bg-red-600' : task.complexity === 'Média' ? 'bg-yellow-600' : 'bg-green-600'}
                    >
                      {task.complexity}
                    </Badge>
                    <div className="flex items-center gap-2">
                      {task.status.includes('EM EXECUÇÃO') && <Badge className="bg-blue-600">{task.status}</Badge>}
                      {task.status.includes('AGENDADO') && <Badge className="bg-gray-600">{task.status}</Badge>}
                      <span className="text-sm text-gray-500">⏱️ {task.days} dias</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
            <p className="text-sm text-green-800 dark:text-green-300">
              ✅ Sprint 15 completado em ~9.5 dias! Todas as tarefas entregues. Progresso total: ~91%
            </p>
          </div>
        </section>

        {/* Timeline Visual */}
        <section>
          <h2 className="text-2xl font-bold mb-4">📅 Timeline de Desenvolvimento</h2>
          <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <div className="space-y-4">
              {[
                { sprint: 'Sprint 13', status: '✅ Finalizado', date: '03/03/2026' },
                { sprint: 'Sprint 14', status: '✅ Finalizado', date: '03/03/2026' },
                { sprint: 'Sprint 15', status: '🔄 Iniciando', date: '03/03/2026' },
                { sprint: 'Sprint 16', status: '⏳ Planejado', date: '18/03/2026' }
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="w-32 font-semibold">{item.sprint}</div>
                  <div className="flex-1 h-2 bg-purple-600 rounded opacity-70" />
                  <div className="text-sm">{item.status}</div>
                  <div className="w-32 text-right text-gray-500 text-sm">{item.date}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Key Achievements */}
        <section>
          <h2 className="text-2xl font-bold mb-4">🏆 Conquistas do Projeto</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { value: '95K+', label: 'Documentos Assinados', icon: '📄' },
              { value: '500+', label: 'Empresas Ativas', icon: '🏢' },
              { value: '87%', label: 'Projeto Completo', icon: '✅' }
            ].map((item, idx) => (
              <Card key={idx} className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl mb-2">{item.icon}</p>
                  <p className="text-2xl font-bold text-purple-600">{item.value}</p>
                  <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{item.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <div className="flex gap-4">
          <Button className="bg-purple-600 hover:bg-purple-700 gap-2">
            <ArrowRight className="w-4 h-4" />
            Iniciar Sprint 15 Agora
          </Button>
          <Button variant="outline">Ver Backlog Completo</Button>
        </div>
      </div>
    </div>
  );
}