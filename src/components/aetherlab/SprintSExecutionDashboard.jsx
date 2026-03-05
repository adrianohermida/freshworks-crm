import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, AlertCircle, Zap } from 'lucide-react';

export default function SprintSExecutionDashboard() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  const [tasks] = useState([
    {
      id: 'AUTH-1',
      name: 'Integração API Autentique',
      owner: 'Backend',
      progress: 30,
      status: 'IN_PROGRESS',
      deadline: 'Mar 10',
      description: 'Cadastro API + SDK npm + primeiros testes',
      blockers: [],
      subtasks: [
        { name: 'Criar conta Autentique + API keys', status: 'DONE' },
        { name: 'Instalar SDK (@autentique/sdk)', status: 'IN_PROGRESS' },
        { name: 'Teste de assinatura simples', status: 'PENDING' }
      ]
    },
    {
      id: 'AUTH-2',
      name: 'Hash SHA512 + SHA3-512',
      owner: 'Backend',
      progress: 30,
      status: 'IN_PROGRESS',
      deadline: 'Mar 15',
      description: 'Geração dupla de hash + armazenamento em BD',
      blockers: [],
      subtasks: [
        { name: 'Implementar SHA512 (crypto node)', status: 'DONE' },
        { name: 'Implementar SHA3-512 (blake3)', status: 'IN_PROGRESS' },
        { name: 'Armazenar em tabela audit_hash', status: 'PENDING' }
      ]
    },
    {
      id: 'AUTH-3',
      name: 'Privacy Policy + Termos (LGPD)',
      owner: 'Legal',
      progress: 40,
      status: 'IN_PROGRESS',
      deadline: 'Mar 18',
      description: 'Documentação legal conforme LGPD + consentimento',
      blockers: [],
      subtasks: [
        { name: 'Rascunho Privacy Policy', status: 'DONE' },
        { name: 'Termos de Uso (consentimento de coleta)', status: 'IN_PROGRESS' },
        { name: 'Revisar com jurista', status: 'PENDING' }
      ]
    },
    {
      id: 'AUTH-4',
      name: '2FA TOTP + TLS 1.3',
      owner: 'Segurança',
      progress: 50,
      status: 'IN_PROGRESS',
      deadline: 'Mar 22',
      description: 'Autenticação de dois fatores + certificado SSL moderno',
      blockers: [],
      subtasks: [
        { name: 'Verificar versão TLS atual', status: 'DONE' },
        { name: 'Implementar 2FA TOTP (speakeasy)', status: 'IN_PROGRESS' },
        { name: 'Teste e-2-e com QR code', status: 'PENDING' }
      ]
    },
    {
      id: 'AUTH-5',
      name: 'PDF/A Generator',
      owner: 'Backend',
      progress: 20,
      status: 'PENDING',
      deadline: 'Mar 22',
      description: 'Geração de PDF/A-2B para arquivamento',
      blockers: ['AUTH-1'],
      subtasks: [
        { name: 'Avaliar libraries (pdf-lib, pdfkit)', status: 'PENDING' },
        { name: 'Implementar PDF/A-2B compliance', status: 'PENDING' },
        { name: 'Embutir metadados forenses', status: 'PENDING' }
      ]
    },
    {
      id: 'AUTH-6',
      name: 'Captura Metadados Forenses',
      owner: 'Backend',
      progress: 0,
      status: 'PENDING',
      deadline: 'Mar 22',
      description: 'IP, User Agent, DNS, timestamps, URLs navegadas',
      blockers: ['AUTH-1'],
      subtasks: [
        { name: 'Criar schema BD para metadados', status: 'PENDING' },
        { name: 'Capturar IP + User Agent', status: 'PENDING' },
        { name: 'Rastreamento de URLs (opcional HTTP Archive)', status: 'PENDING' }
      ]
    }
  ]);

  const [metrics] = useState({
    overallProgress: 28,
    completedTasks: 0,
    inProgressTasks: 4,
    pendingTasks: 2,
    blockerCount: 2,
    daysRemaining: 17,
    sprintStart: '2026-03-05',
    sprintEnd: '2026-03-22'
  });

  const statusColors = {
    DONE: 'bg-green-100 text-green-800',
    IN_PROGRESS: 'bg-blue-100 text-blue-800',
    PENDING: 'bg-gray-100 text-gray-800'
  };

  const getStatusIcon = (status) => {
    if (status === 'DONE') return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    if (status === 'IN_PROGRESS') return <Clock className="w-4 h-4 text-blue-600" />;
    return <AlertCircle className="w-4 h-4 text-gray-600" />;
  };

  return (
    <div className={`p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Zap className="w-8 h-8 text-orange-500" />
            SPRINT S — Autentique Integration
          </h1>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Mar 5-22, 2026</p>
            <p className="text-lg font-semibold">{metrics.daysRemaining} days remaining</p>
          </div>
        </div>

        {/* Global Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600">{metrics.overallProgress}%</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Overall Progress</p>
              <Progress value={metrics.overallProgress} className="mt-2" />
            </CardContent>
          </Card>

          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600">{metrics.completedTasks}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Completed</p>
            </CardContent>
          </Card>

          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600">{metrics.inProgressTasks}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">In Progress</p>
            </CardContent>
          </Card>

          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-yellow-600">{metrics.pendingTasks}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Pending</p>
            </CardContent>
          </Card>

          <Card className={`border-red-300 bg-red-50 dark:bg-red-950 ${isDark ? 'border-gray-700' : ''}`}>
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-red-600">{metrics.blockerCount}</div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Blockers</p>
            </CardContent>
          </Card>
        </div>

        {/* Critical Path - Today Actions */}
        <Card className="border-green-300 bg-green-50 dark:bg-green-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-green-600" />
              🎯 AÇÕES CRÍTICAS DE HOJE (Mar 5)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              <span className="font-bold">1. Backend:</span> Criar conta Autentique + receber API keys
            </p>
            <p className="text-sm">
              <span className="font-bold">2. Backend:</span> Instalar SDK npm (@autentique/sdk) + teste inicial
            </p>
            <p className="text-sm">
              <span className="font-bold">3. Legal:</span> Finalizar Privacy Policy + Termos com menção Autentique
            </p>
            <p className="text-sm">
              <span className="font-bold">4. DevOps:</span> Validar versão TLS + certificado SSL atual
            </p>
          </CardContent>
        </Card>

        {/* Detailed Task List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Task Breakdown</h2>
          {tasks.map((task) => (
            <Card key={task.id} className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(task.status)}
                      <CardTitle className="text-lg">{task.id}: {task.name}</CardTitle>
                      <Badge variant={task.status === 'DONE' ? 'default' : 'secondary'}>
                        {task.owner}
                      </Badge>
                      <Badge className={statusColors[task.status]}>
                        {task.status === 'IN_PROGRESS' ? 'In Progress' : task.status === 'DONE' ? 'Done' : 'Pending'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{task.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">Deadline: {task.deadline}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold">Progress</span>
                    <span className="text-sm text-gray-600">{task.progress}%</span>
                  </div>
                  <Progress value={task.progress} />
                </div>

                {task.blockers.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-950 p-2 rounded text-sm">
                    <p className="font-semibold text-red-600">⚠️ Blockers:</p>
                    <p className="text-red-700">{task.blockers.join(', ')}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-semibold mb-2">Subtasks:</p>
                  <ul className="space-y-1">
                    {task.subtasks.map((subtask, idx) => (
                      <li key={idx} className="text-sm flex items-center gap-2">
                        {getStatusIcon(subtask.status)}
                        <span>{subtask.name}</span>
                        <Badge className={statusColors[subtask.status]}>
                          {subtask.status === 'DONE' ? '✓' : subtask.status === 'IN_PROGRESS' ? '⏳' : '○'}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Risk Assessment */}
        <Card className="border-orange-300 bg-orange-50 dark:bg-orange-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              ⚠️ Risk Assessment
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              <span className="font-bold">Risk 1:</span> PDF/A-2B library compatibility (novo em pipeline)
            </p>
            <p className="text-sm">
              <span className="font-bold">Risk 2:</span> Autentique API response time em produção
            </p>
            <p className="text-sm">
              <span className="font-bold">Risk 3:</span> TLS 1.3 compatibility com clientes antigos
            </p>
            <p className="text-sm mt-3">
              <span className="font-bold">Mitigation:</span> Testes diários + daily standups + rollback plan pronto
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}