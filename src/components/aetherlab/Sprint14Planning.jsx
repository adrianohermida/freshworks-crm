import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Clock, AlertCircle, ArrowRight } from 'lucide-react';

export default function Sprint14Planning() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  const sprint13Tasks = [
    { name: 'Integração CNJ', status: '✅', progress: 100 },
    { name: 'Integração TJSP', status: '✅', progress: 100 },
    { name: 'Dashboard de Processos', status: '✅', progress: 100 },
    { name: 'Gerador de Relatórios', status: '✅', progress: 100 },
    { name: 'Automações Entity', status: '✅', progress: 100 },
    { name: 'Cache + Indexação', status: '✅', progress: 100 },
    { name: 'WebSocket Real-time', status: '✅', progress: 100 },
    { name: 'Mobile Responsiveness', status: '✅', progress: 100 }
  ];

  const sprint14Roadmap = [
    {
      id: 1,
      name: 'Assinatura com Certificado ICP-Brasil',
      desc: 'Integração com certificados digitais válidos',
      complexity: 'Alta',
      days: 2,
      icon: '🔐',
      status: '✅ CONCLUÍDO'
    },
    {
      id: 2,
      name: 'Fluxo de Aprovação Multi-Level',
      desc: 'Assinatura sequencial por múltiplos signatários',
      complexity: 'Média',
      days: 1.5,
      icon: '👥',
      status: '✅ CONCLUÍDO'
    },
    {
      id: 3,
      name: 'Dashboard de Compliance LGPD/GDPR',
      desc: 'Relatórios de conformidade regulatória',
      complexity: 'Média',
      days: 1.5,
      icon: '📋',
      status: '✅ CONCLUÍDO'
    },
    {
      id: 4,
      name: 'Export/Import de Documentos',
      desc: 'Suporte a múltiplos formatos',
      complexity: 'Baixa',
      days: 1,
      icon: '📤',
      status: '✅ CONCLUÍDO'
    },
    {
      id: 5,
      name: 'API REST Completa',
      desc: 'Endpoints públicos para integração',
      complexity: 'Alta',
      days: 2,
      icon: '🔌',
      status: '✅ CONCLUÍDO'
    },
    {
      id: 6,
      name: 'Sistema de Templates Avançado',
      desc: 'Variáveis dinâmicas e condicionais',
      complexity: 'Média',
      days: 1.5,
      icon: '📝',
      status: '⏳ Sprint 15'
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">🎯 Sprint Planning</h1>
          <p className={`${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Revisão Sprint 13 → Planejamento Sprint 14
          </p>
        </div>

        {/* Sprint 13 - Conclusão */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            Sprint 13: Integrações Judiciais (100% COMPLETO)
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            {sprint13Tasks.map((task, idx) => (
              <Card key={idx} className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <span>{task.name}</span>
                    <Badge className="bg-green-600">{task.status}</Badge>
                  </div>
                  <div className="w-full bg-gray-300 h-2 rounded mt-2">
                    <div className="bg-green-500 h-2 rounded" style={{ width: '100%' }} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className={`p-4 rounded-lg ${isDark ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
            <p className={`text-sm ${isDark ? 'text-green-300' : 'text-green-800'}`}>
              ✅ Todas as tarefas de Sprint 13 concluídas com sucesso!
            </p>
          </div>
        </section>

        {/* Sprint 14 - Roadmap */}
        <section>
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-green-500" />
            Sprint 14: Certificados + Compliance (100% COMPLETO)
          </h2>

          <div className="grid md:grid-cols-2 gap-4">
            {sprint14Roadmap.map((task) => (
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
                      {task.status && <Badge className="bg-blue-600">{task.status}</Badge>}
                      <span className="text-sm text-gray-500">⏱️ {task.days} dias</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-6 p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
            <p className="text-sm text-green-800 dark:text-green-300">
              ✅ Sprint 14 finalizado em ~7.5 dias | Completude: 100%
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
                { sprint: 'Sprint 15', status: '🔄 Iniciando', date: '03/03/2026' }
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

        {/* Call to Action */}
        <div className="flex gap-4">
          <Button className="bg-purple-600 hover:bg-purple-700 gap-2">
            <ArrowRight className="w-4 h-4" />
            Iniciar Sprint 14 Agora
          </Button>
          <Button variant="outline">Revisar Sprint 13 Detalhes</Button>
        </div>
      </div>
    </div>
  );
}