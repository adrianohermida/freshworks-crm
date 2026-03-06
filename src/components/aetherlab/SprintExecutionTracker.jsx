import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Zap, TrendingUp } from 'lucide-react';

export default function SprintExecutionTracker() {
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

  // SPRINT S EXECUTION TRACKER
  const [sprintS] = useState({
    name: 'Sprint S',
    phase: 'Integração Autentique + Conformidade Legal',
    startDate: 'Mar 4',
    endDate: 'Mar 22',
    totalDays: 18,
    currentDay: 1,
    targetCompletion: 95,
    completionPercentage: 15
  });

  const [completedTasks] = useState([
    {
      id: 1,
      name: 'TLS 1.3 Verificado',
      team: 'DevOps',
      completedDate: 'Mar 1',
      completedTime: '14:30',
      status: '✅ DONE',
      impact: 'SSL/TLS security confirmed'
    },
    {
      id: 2,
      name: 'LGPD Compliance Base',
      team: 'Legal',
      completedDate: 'Mar 2',
      completedTime: '09:15',
      status: '✅ DONE',
      impact: 'LGPD framework foundation ready'
    },
    {
      id: 3,
      name: '2FA TOTP Framework',
      team: 'Backend',
      completedDate: 'Mar 3',
      completedTime: '16:45',
      status: '✅ DONE',
      impact: '2FA authentication scaffold'
    },
    {
      id: 4,
      name: 'LegalChain Branding',
      team: 'Marketing',
      completedDate: 'Mar 4',
      completedTime: '11:20',
      status: '✅ DONE',
      impact: 'Brand repositioned for legal professionals'
    },
    {
      id: 5,
      name: 'Autentique MCP Integration',
      team: 'Backend',
      completedDate: 'Mar 4',
      completedTime: '14:00',
      status: '✅ DONE',
      impact: 'Full API v2 integration implemented'
    },
    {
      id: 6,
      name: 'Webhook Handler Setup',
      team: 'Backend',
      completedDate: 'Mar 4',
      completedTime: '15:30',
      status: '✅ DONE',
      impact: 'Real-time event processing enabled'
    }
  ]);

  const [inProgressTasks] = useState([
    {
      id: 7,
      name: 'Autentique API Upload 100%',
      team: 'Backend',
      progress: 85,
      deadline: 'Mar 8',
      priority: '🔴 CRÍTICO',
      blocker: 'Webhook integration (COMPLETED)',
      nextMilestone: 'Mar 6 - 95%'
    },
    {
      id: 8,
      name: 'Certificado ICP/Brasil',
      team: 'Legal',
      progress: 0,
      deadline: 'Mar 10',
      priority: '🔴 CRÍTICO',
      blocker: 'Serasa contact (TODAY 17:00)',
      nextMilestone: 'TODAY - Contact Serasa'
    },
    {
      id: 9,
      name: '2FA TOTP Completo',
      team: 'Backend',
      progress: 50,
      deadline: 'Mar 12',
      priority: '🟠 ALTA',
      blocker: 'None',
      nextMilestone: 'Mar 8 - 75%'
    },
    {
      id: 10,
      name: 'Privacy Policy LGPD',
      team: 'Legal',
      progress: 40,
      deadline: 'Mar 18',
      priority: '🟠 ALTA',
      blocker: 'Parecer jurídico (RFP TODAY 18:00)',
      nextMilestone: 'Mar 15 - 100%'
    }
  ]);

  const [pendingTasks] = useState([
    {
      id: 11,
      name: 'Hash SHA512 + SHA3-512',
      deadline: 'Mar 15',
      prereq: 'Parecer jurídico',
      team: 'Backend'
    },
    {
      id: 12,
      name: 'PDF/A-2B Generator',
      deadline: 'Mar 20',
      prereq: 'Autentique API 100%',
      team: 'Backend'
    },
    {
      id: 13,
      name: 'Metadados Forenses',
      deadline: 'Mar 18',
      prereq: 'Hash design',
      team: 'Backend'
    }
  ]);

  const [criticalActions] = useState([
    {
      order: 1,
      action: 'Contato Serasa - Certificado AC',
      time: '17:00 TODAY',
      owner: 'Legal',
      status: '⏳ PENDING',
      impact: '🔴 BLOQUEADOR CRÍTICO'
    },
    {
      order: 2,
      action: 'RFP Parecer Jurídico',
      time: '18:00 TODAY',
      owner: 'Legal',
      status: '⏳ PENDING',
      impact: '🔴 DESBLOQUEADOR (5 tarefas)'
    }
  ]);

  const [sprintMetrics] = useState({
    totalTasks: 13,
    completed: 6,
    inProgress: 4,
    pending: 3,
    blocked: 1,
    completionPercentage: Math.round((6 / 13) * 100),
    velocity: 15,
    requiredVelocity: 4.7,
    daysRemaining: 17,
    goLiveOnTrack: true
  });

  return (
    <div className="space-y-4 p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      {/* LIVE HEADER */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8 rounded-lg shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold">🚀 SPRINT EXECUTION LIVE</h1>
            <p className="text-lg opacity-90 mt-2">{sprintS.name} | Day {sprintS.currentDay}/{sprintS.totalDays}</p>
            <p className="text-sm opacity-75">{formatTime(currentTime)} Manaus</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Completude Atual</p>
            <p className="text-6xl font-bold">{sprintMetrics.completionPercentage}%</p>
            <p className="text-xs opacity-75 mt-1">{sprintMetrics.completed}/{sprintMetrics.totalTasks} tasks</p>
          </div>
        </div>
      </div>

      {/* METRICS OVERVIEW */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-green-600">{sprintMetrics.completed}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Concluído</p>
            <Badge className="mt-2 bg-green-600">+3 TODAY</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{sprintMetrics.inProgress}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Progresso</p>
            <p className="text-xs font-bold mt-1">Avg 57.5%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-orange-600">{sprintMetrics.pending}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Pendente</p>
            <p className="text-xs font-bold mt-1">23%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-red-600">{sprintMetrics.blocked}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Bloqueado</p>
            <Badge className="mt-2 bg-red-600">CRÍTICO</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-purple-600">{sprintMetrics.velocity}%</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Velocity</p>
            <p className="text-xs font-bold text-green-600 mt-1">✅ {sprintMetrics.requiredVelocity}% required</p>
          </CardContent>
        </Card>
      </div>

      {/* COMPLETED TODAY - MAJOR WIN */}
      <Card className="border-2 border-green-600 bg-green-50 dark:bg-green-950">
        <CardHeader className="bg-green-100 dark:bg-green-900">
          <CardTitle className="text-green-700 dark:text-green-300">✅ COMPLETED TODAY (6 = 46%)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 mt-4">
          {completedTasks.map((task) => (
            <div key={task.id} className="p-3 bg-white dark:bg-green-900 rounded border-l-4 border-green-600">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <p className="font-bold">{task.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">💡 {task.impact}</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-600 mb-1">{task.team}</Badge>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{task.completedDate} {task.completedTime}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* CRITICAL ACTIONS TODAY */}
      <Card className="border-2 border-red-600 bg-red-50 dark:bg-red-950">
        <CardHeader className="bg-red-100 dark:bg-red-900">
          <CardTitle className="text-red-700 dark:text-red-300">🔴 CRITICAL ACTIONS - TODAY</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 mt-4">
          {criticalActions.map((action) => (
            <div key={action.order} className="p-3 bg-white dark:bg-red-900 rounded border-l-4 border-red-600">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold">{action.order}. {action.action}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{action.impact}</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-red-600 mb-1">{action.status}</Badge>
                  <p className="text-sm font-bold text-red-700 dark:text-red-300">{action.time}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* IN PROGRESS */}
      <Card className="border-l-4 border-blue-600">
        <CardHeader className="bg-blue-50 dark:bg-blue-900">
          <CardTitle className="text-blue-700 dark:text-blue-300">⏳ IN PROGRESS (4/13 = 31%, Avg 57.5%)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 mt-4">
          {inProgressTasks.map((task) => (
            <div key={task.id} className="p-3 bg-blue-50 dark:bg-blue-900 rounded border-l-4 border-blue-600">
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold">{task.name}</p>
                <div>
                  <Badge className="bg-blue-600 mr-2">{task.priority}</Badge>
                  <span className="font-bold text-blue-600">{task.progress}%</span>
                </div>
              </div>
              <Progress value={task.progress} className="h-2 mb-2" />
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
                <span>{task.team} | 📅 {task.deadline}</span>
                <span>{task.nextMilestone}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* PENDING */}
      <Card className="border-l-4 border-orange-600">
        <CardHeader className="bg-orange-50 dark:bg-orange-900">
          <CardTitle className="text-orange-700 dark:text-orange-300">❌ PENDING (3/13 = 23%)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 mt-4">
          {pendingTasks.map((task) => (
            <div key={task.id} className="p-3 bg-orange-50 dark:bg-orange-900 rounded text-sm">
              <p className="font-bold">{task.name}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">⬅️ Prereq: {task.prereq}</p>
              <div className="flex justify-between mt-2 text-xs">
                <span>{task.team}</span>
                <span className="font-bold">📅 {task.deadline}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* EXECUTIVE SUMMARY */}
      <Card className="border-2 border-green-600 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
        <CardHeader>
          <CardTitle className="text-2xl text-green-700 dark:text-green-300">✅ EXECUTION SUMMARY</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-white dark:bg-slate-800 rounded">
            <p className="text-lg font-bold text-green-600 mb-3">TODAY'S ACHIEVEMENTS</p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                LegalChain branding fully implemented
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Autentique MCP integration complete (API v2)
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Webhook handler setup + configuration
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
                Sprint execution tracking dashboard live
              </li>
            </ul>
          </div>

          <div className="p-4 bg-red-100 dark:bg-red-800 rounded border-2 border-red-500">
            <p className="font-bold text-red-700 dark:text-red-300 mb-2">🔴 BLOCKERS TO RESOLVE TODAY</p>
            <p className="text-sm text-red-600 dark:text-red-200">
              17:00 - Contato Serasa (ICP Certificate)<br />
              18:00 - RFP Parecer Jurídico
            </p>
          </div>

          <div className="p-4 bg-blue-100 dark:bg-blue-800 rounded">
            <p className="font-bold text-blue-700 dark:text-blue-300">📊 SPRINT STATUS</p>
            <p className="text-sm text-blue-600 dark:text-blue-200 mt-2">
              ✅ Completude: {sprintMetrics.completionPercentage}% (6/13 tasks)<br />
              ✅ Velocity: {sprintMetrics.velocity}%/dia (Required: {sprintMetrics.requiredVelocity}%)<br />
              ✅ Timeline: ON TRACK for Mar 22 target (95%)<br />
              ✅ Go-Live May 26: ON TRACK
            </p>
          </div>

          <div className="p-4 bg-purple-100 dark:bg-purple-800 rounded">
            <p className="font-bold text-purple-700 dark:text-purple-300">🚀 NEXT 48 HOURS</p>
            <ul className="text-sm space-y-1 text-purple-600 dark:text-purple-200 mt-2">
              <li>✓ Complete Autentique API 100% (Mar 6)</li>
              <li>✓ Receive Certificado AC (Mar 10)</li>
              <li>✓ Audit multitenant endpoints (Mar 8)</li>
              <li>✓ RFP parecer jurídico sent (TODAY)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* FOOTER */}
      <div className="text-center text-xs text-gray-600 dark:text-gray-400 py-6 border-t">
        <p className="font-bold">Sprint S Execution Live Tracker</p>
        <p>Day 1 of 18 | 46% complete (6/13) | Velocity: 15%/day | Target: 95% by Mar 22</p>
        <p className="mt-2 opacity-75">{formatTime(currentTime)} | America/Manaus Timezone</p>
      </div>
    </div>
  );
}