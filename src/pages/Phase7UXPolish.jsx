import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Palette, Zap, Users, Code } from 'lucide-react';

export default function Phase7UXPolish() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      category: 'Performance',
      name: 'Lazy Loading em Tabelas Grandes',
      description: 'Implementar virtualization para tabelas com 1000+ registros',
      status: 'todo',
      priority: 'high',
      effort: '3h',
      assignee: 'Dev'
    },
    {
      id: 2,
      category: 'Performance',
      name: 'Cache de Queries com React Query',
      description: 'Otimizar cache de requests DataJud e TPU',
      status: 'todo',
      priority: 'high',
      effort: '4h',
      assignee: 'Dev'
    },
    {
      id: 3,
      category: 'Accessibility',
      name: 'WCAG 2.1 AA Compliance',
      description: 'Implementar ARIA labels, keyboard navigation, screen reader support',
      status: 'todo',
      priority: 'high',
      effort: '5h',
      assignee: 'Dev'
    },
    {
      id: 4,
      category: 'Accessibility',
      name: 'Teste de Acessibilidade Automático',
      description: 'Adicionar axe-core para testes automáticos de a11y',
      status: 'todo',
      priority: 'medium',
      effort: '2h',
      assignee: 'QA'
    },
    {
      id: 5,
      category: 'Design',
      name: 'Dark Mode Completo',
      description: 'Refinar todos os componentes no tema escuro',
      status: 'in_progress',
      priority: 'medium',
      effort: '4h',
      assignee: 'Design'
    },
    {
      id: 6,
      category: 'Design',
      name: 'Mobile Responsive Refinement',
      description: 'Testar e refinar em dispositivos móveis (iOS/Android)',
      status: 'todo',
      priority: 'high',
      effort: '6h',
      assignee: 'Design'
    },
    {
      id: 7,
      category: 'Onboarding',
      name: 'Guia de Usuário Interativo',
      description: 'Tutorial passo-a-passo para primeiros usuários',
      status: 'todo',
      priority: 'medium',
      effort: '5h',
      assignee: 'Doc'
    },
    {
      id: 8,
      category: 'Onboarding',
      name: 'Video Tutorial (3 partes)',
      description: 'Gravar vídeos: Setup, DataJud, Admin Panel',
      status: 'todo',
      priority: 'low',
      effort: '8h',
      assignee: 'Content'
    }
  ]);

  const categories = {
    'Performance': { icon: Zap, color: 'text-yellow-600', bg: 'bg-yellow-50 dark:bg-yellow-900/20' },
    'Accessibility': { icon: Users, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    'Design': { icon: Palette, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    'Onboarding': { icon: Code, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20' }
  };

  const toggleTask = (id) => {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, status: t.status === 'todo' ? 'done' : 'todo' } : t
    ));
  };

  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const totalTasks = tasks.length;
  const completionRate = Math.round((completedTasks / totalTasks) * 100);

  const groupedTasks = {
    'Performance': tasks.filter(t => t.category === 'Performance'),
    'Accessibility': tasks.filter(t => t.category === 'Accessibility'),
    'Design': tasks.filter(t => t.category === 'Design'),
    'Onboarding': tasks.filter(t => t.category === 'Onboarding')
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Fase 7: UX Polish & Optimization</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Melhorias de performance, acessibilidade e onboarding</p>
        </div>
        <Badge className="bg-blue-600 text-lg px-4 py-2">EM EXECUÇÃO</Badge>
      </div>

      {/* PROGRESS */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold">Completude Geral</span>
                <span className="text-2xl font-bold text-blue-600">{completionRate}%</span>
              </div>
              <Progress value={completionRate} className="h-4" />
              <p className="text-xs text-gray-600 mt-2">{completedTasks}/{totalTasks} tarefas concluídas</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TASKS BY CATEGORY */}
      {Object.entries(groupedTasks).map(([category, categoryTasks]) => {
        const categoryConfig = categories[category];
        const Icon = categoryConfig.icon;
        const categoryCompletion = categoryTasks.length > 0
          ? Math.round((categoryTasks.filter(t => t.status === 'done').length / categoryTasks.length) * 100)
          : 0;

        return (
          <Card key={category} className={categoryConfig.bg}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${categoryConfig.color}`} />
                  <span>{category}</span>
                  <Badge variant="outline">{categoryTasks.length} tarefas</Badge>
                </CardTitle>
                <span className="text-sm font-semibold">{categoryCompletion}%</span>
              </div>
              <Progress value={categoryCompletion} className="h-2 mt-2" />
            </CardHeader>
            <CardContent className="space-y-2">
              {categoryTasks.map(task => (
                <div
                  key={task.id}
                  onClick={() => toggleTask(task.id)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    task.status === 'done'
                      ? 'bg-gray-100 dark:bg-gray-700 border-gray-300'
                      : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-blue-400'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      task.status === 'done'
                        ? 'bg-green-600 border-green-600'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}>
                      {task.status === 'done' && (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm ${task.status === 'done' ? 'line-through text-gray-600' : ''}`}>
                        {task.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{task.description}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        <Badge
                          className={`text-[10px] ${
                            task.priority === 'high'
                              ? 'bg-red-600'
                              : task.priority === 'medium'
                              ? 'bg-orange-600'
                              : 'bg-blue-600'
                          }`}
                        >
                          {task.priority === 'high' ? '🔴' : task.priority === 'medium' ? '🟠' : '🔵'} {task.priority}
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">⏱️ {task.effort}</Badge>
                        <Badge variant="outline" className="text-[10px] ml-auto">👤 {task.assignee}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}

      {/* TIMELINE */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            📅 Timeline Estimada
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded">
            <p className="font-semibold text-sm mb-2">Sprint Duration: 3-4 dias</p>
            <div className="space-y-1 text-sm">
              <p>• <strong>Dia 1:</strong> Performance + Dark Mode Completo</p>
              <p>• <strong>Dia 2:</strong> Acessibilidade (WCAG 2.1 AA)</p>
              <p>• <strong>Dia 3:</strong> Mobile Responsive + Testes</p>
              <p>• <strong>Dia 4:</strong> Onboarding + Documentação</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* METRICS */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20">
        <CardHeader>
          <CardTitle className="text-base">Objetivos da Fase 7</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Performance: <strong>Lazy Loading</strong> + <strong>Cache Optimization</strong></span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Acessibilidade: <strong>WCAG 2.1 AA</strong> compliant + keyboard navigation</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Design: <strong>Dark Mode 100%</strong> + Mobile-first responsiveness</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
            <span>Onboarding: <strong>Interactive Tutorial</strong> + Video guides</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}