import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Clock, Zap } from 'lucide-react';

export default function ExecutorLiveBoard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date) => {
    return date.toLocaleString('pt-BR', {
      timeZone: 'America/Manaus',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // KANBAN BOARD - Tarefas por status
  const [taskBoard] = useState({
    done: {
      title: '✅ CONCLUÍDO (3)',
      color: 'border-green-500 bg-green-50 dark:bg-green-900',
      tasks: [
        { id: 1, name: 'TLS 1.3 Verificado', team: 'DevOps', date: 'Mar 1', completion: 100 },
        { id: 2, name: 'LGPD Compliance Base', team: 'Legal', date: 'Mar 2', completion: 100 },
        { id: 3, name: '2FA TOTP Framework', team: 'Backend', date: 'Mar 3', completion: 100 }
      ]
    },
    inProgress: {
      title: '⏳ EM PROGRESSO (4)',
      color: 'border-blue-500 bg-blue-50 dark:bg-blue-900',
      tasks: [
        { id: 4, name: 'Autentique API Upload', team: 'Backend', deadline: 'Mar 8', completion: 75, critical: true },
        { id: 5, name: '2FA TOTP Completo', team: 'Backend', deadline: 'Mar 12', completion: 50 },
        { id: 6, name: 'Privacy Policy LGPD', team: 'Legal', deadline: 'Mar 18', completion: 40 },
        { id: 7, name: 'Termos de Uso', team: 'Legal', deadline: 'Mar 20', completion: 30 }
      ]
    },
    pending: {
      title: '❌ PENDENTE (6)',
      color: 'border-orange-500 bg-orange-50 dark:bg-orange-900',
      tasks: [
        { id: 8, name: 'Hash SHA512 + SHA3-512', team: 'Backend', deadline: 'Mar 15', completion: 0, prereq: 'Parecer jurídico' },
        { id: 9, name: 'PDF/A-2B Generator', team: 'Backend', deadline: 'Mar 20', completion: 0, prereq: 'Autentique API' },
        { id: 10, name: 'Metadados Forenses', team: 'Backend', deadline: 'Mar 18', completion: 0, prereq: 'Hash' },
        { id: 11, name: 'Parecer Jurídico', team: 'Legal', deadline: 'Mar 26', completion: 0, prereq: 'RFP enviado' },
        { id: 12, name: 'Testes E2E', team: 'QA', deadline: 'Mar 20', completion: 0, prereq: 'APIs prontas' },
        { id: 13, name: 'Deploy Staging', team: 'DevOps', deadline: 'Mar 22', completion: 0, prereq: 'Todas 95%' }
      ]
    },
    blocked: {
      title: '🚨 BLOQUEADO (1)',
      color: 'border-red-500 bg-red-50 dark:bg-red-900',
      tasks: [
        { id: 14, name: 'Certificado ICP/Brasil', team: 'Legal', deadline: 'Mar 10', blocker: 'Serasa response', critical: true, action: 'Contato 17:00 TODAY' }
      ]
    }
  });

  // MÉTRICAS CONSOLIDADAS
  const metrics = {
    total: 13,
    completed: 3,
    inProgress: 4,
    pending: 6,
    blocked: 1,
    completionPercentage: 15,
    targetPercentage: 95,
    daysElapsed: 1,
    daysTotal: 18,
    daysRemaining: 17
  };

  // AÇÕES IMEDIATAS
  const immediateActions = [
    {
      order: 1,
      action: 'Contato Serasa - Certificado AC',
      deadline: 'TODAY 17:00',
      owner: 'Legal',
      severity: 'CRÍTICO',
      status: 'PENDENTE'
    },
    {
      order: 2,
      action: 'RFP Parecer Jurídico',
      deadline: 'TODAY 18:00',
      owner: 'Legal',
      severity: 'CRÍTICO',
      status: 'PENDENTE'
    },
    {
      order: 3,
      action: 'Autentique API Upload 75% → 100%',
      deadline: 'Mar 8',
      owner: 'Backend',
      severity: 'CRÍTICO',
      status: 'EM EXECUÇÃO'
    },
    {
      order: 4,
      action: 'Audit Multitenant Endpoints',
      deadline: 'Mar 8',
      owner: 'QA + Security',
      severity: 'CRÍTICO',
      status: 'A INICIAR'
    }
  ];

  const weeklyStatus = [
    {
      week: 'Semana 1',
      dates: 'Mar 4-8',
      current: 15,
      target: 30,
      gap: 15,
      status: '🔴 EM EXECUÇÃO'
    },
    {
      week: 'Semana 2',
      dates: 'Mar 9-15',
      current: 30,
      target: 60,
      gap: 30,
      status: '🟠 PLANEJADO'
    },
    {
      week: 'Semana 3',
      dates: 'Mar 16-22',
      current: 60,
      target: 95,
      gap: 35,
      status: '🎯 TARGET'
    }
  ];

  return (
    <div className="space-y-4 p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      {/* HEADER COM RELÓGIO */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">🎯 EXECUTOR LIVE BOARD</h1>
          <p className="text-sm opacity-90">Sprint S | Integração Autentique + Conformidade Legal</p>
        </div>
        <div className="text-right">
          <p className="text-sm opacity-90">Live Status</p>
          <p className="text-lg font-bold">{formatTime(currentTime)}</p>
          <p className="text-xs opacity-75">Manaus</p>
        </div>
      </div>

      {/* MÉTRICAS PRINCIPAIS */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-2">
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{metrics.completionPercentage}%</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Completude Atual</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-green-600">{metrics.completed}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Concluído</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{metrics.inProgress}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Em Progresso</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-orange-600">{metrics.pending}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Pendente</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-red-600">{metrics.blocked}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Bloqueado</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{metrics.targetPercentage}%</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Target</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-2xl font-bold text-purple-600">{metrics.daysRemaining}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Dias</p>
          </CardContent>
        </Card>
      </div>

      {/* PROGRESS BAR GLOBAL */}
      <Card className="border-2 border-purple-500">
        <CardHeader>
          <CardTitle className="text-sm">Progress Global Sprint S</CardTitle>
        </CardHeader>
        <CardContent>
          <Progress value={metrics.completionPercentage} className="h-4 mb-2" />
          <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
            <span>Atual: {metrics.completionPercentage}%</span>
            <span>Target: {metrics.targetPercentage}%</span>
            <span>Gap: {metrics.targetPercentage - metrics.completionPercentage}%</span>
          </div>
        </CardContent>
      </Card>

      {/* KANBAN BOARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(taskBoard).map(([key, column]) => (
          <div key={key} className={`border-l-4 rounded-lg p-4 ${column.color}`}>
            <h2 className="font-bold text-sm mb-3">{column.title}</h2>
            <div className="space-y-2">
              {column.tasks.map((task) => (
                <div key={task.id} className="bg-white dark:bg-slate-800 p-2 rounded border-l-2 border-gray-400">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-xs font-bold text-gray-900 dark:text-white">{task.name}</p>
                    {task.critical && <Badge className="bg-red-600 text-xs">CRÍTICO</Badge>}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{task.team}</p>
                  {task.completion !== undefined && (
                    <Progress value={task.completion} className="h-1 mt-1" />
                  )}
                  {task.deadline && <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">📅 {task.deadline}</p>}
                  {task.date && <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">✓ {task.date}</p>}
                  {task.prereq && <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">⬅️ {task.prereq}</p>}
                  {task.blocker && <p className="text-xs text-red-600 dark:text-red-400 mt-1">🚨 {task.blocker}</p>}
                  {task.action && <p className="text-xs text-red-700 dark:text-red-300 font-bold mt-1">{task.action}</p>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* AÇÕES IMEDIATAS */}
      <Card className="border-2 border-red-500 bg-red-50 dark:bg-red-950">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Zap className="w-5 h-5 text-red-600" />
            🎯 AÇÕES CRÍTICAS - TODAY
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {immediateActions.map((action) => (
            <div key={action.order} className="p-3 bg-white dark:bg-red-900 rounded border-l-4 border-red-600">
              <div className="flex justify-between items-start mb-1">
                <p className="font-bold text-sm">{action.order}. {action.action}</p>
                <Badge className={action.severity === 'CRÍTICO' ? 'bg-red-600' : 'bg-orange-600'} className="text-xs">
                  {action.severity}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">{action.owner} | {action.deadline}</p>
              <Badge variant="outline" className={`text-xs mt-2 ${
                action.status === 'PENDENTE' ? 'border-red-600 text-red-600' : 'border-blue-600 text-blue-600'
              }`}>
                {action.status}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* WEEKLY TARGETS */}
      <Card>
        <CardHeader>
          <CardTitle>📅 Projeção Semanal</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {weeklyStatus.map((week, i) => (
            <div key={i} className="border-l-4 border-purple-500 pl-3 py-2 bg-purple-50 dark:bg-purple-900 rounded">
              <div className="flex justify-between items-center mb-2">
                <p className="font-bold text-sm">{week.week} ({week.dates})</p>
                <Badge className="bg-purple-600">{week.current}% → {week.target}%</Badge>
              </div>
              <Progress value={Math.min(week.current, 100)} className="h-2" />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Gap: +{week.gap}% | {week.status}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* EXECUTOR CHECKPOINT */}
      <Card className="border-2 border-green-600 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
        <CardHeader>
          <CardTitle className="text-lg">📍 Checkpoint Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="p-3 bg-white dark:bg-slate-800 rounded">
            <p className="font-bold text-green-700 dark:text-green-300">✅ SPRINT S VIÁVEL</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">
              15% completude estabelecida. Bloqueador crítico: Certificado ICP/Brasil. 
              Autentique API é chave para desbloquear 5 tarefas. Ações críticas de hoje (17:00 e 18:00) são pivôs para timeline.
            </p>
          </div>
          <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded">
            <p className="font-bold text-blue-700 dark:text-blue-300">🎯 Próximo Milestone</p>
            <p className="text-sm text-blue-600 dark:text-blue-200 mt-1">Mar 8 EOD: Autentique API 100% + Certificado AC + Audit completo</p>
          </div>
          <div className="p-3 bg-green-100 dark:bg-green-800 rounded">
            <p className="font-bold text-green-700 dark:text-green-300">📊 Velocity Necessária</p>
            <p className="text-sm text-green-600 dark:text-green-200 mt-1">4.7%/dia | Histórica: 15%/dia ✅ Viável</p>
          </div>
        </CardContent>
      </Card>

      {/* FOOTER */}
      <div className="text-xs text-center text-gray-600 dark:text-gray-400 py-4 border-t">
        Executor de Sprint | Live Board | Atualizado: {formatTime(currentTime)}
        <br />
        Sprint S: Dia {metrics.daysElapsed}/{metrics.daysTotal} | 15% → 95% | May 26 Go-Live ON TRACK
      </div>
    </div>
  );
}