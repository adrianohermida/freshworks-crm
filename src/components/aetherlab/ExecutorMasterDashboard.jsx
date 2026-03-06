import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Clock, Zap, TrendingUp } from 'lucide-react';

export default function ExecutorMasterDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    return currentTime.toLocaleString('pt-BR', {
      timeZone: 'America/Manaus',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const [executionStatus] = useState({
    sprint: 'S',
    day: 1,
    totalDays: 18,
    completionPercent: 46,
    tasksCompleted: 6,
    tasksTotal: 13,
    velocity: 15
  });

  const [completionSummary] = useState([
    { label: 'Completado', value: 6, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Em Progresso', value: 4, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Pendente', value: 3, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Bloqueado', value: 0, color: 'text-red-600', bg: 'bg-red-50' }
  ]);

  const [criticalActionItems] = useState([
    {
      order: 1,
      action: 'Contato Serasa - ICP/Brasil Certificate',
      time: '17:00 TODAY',
      owner: 'Legal',
      blocker: true,
      status: '⏳ PENDING',
      email: 'serasa-contact@outlook.com',
      urgency: '🔴 CRITICAL'
    },
    {
      order: 2,
      action: 'RFP Parecer Jurídico - External Law Firm',
      time: '18:00 TODAY',
      owner: 'Legal',
      blocker: true,
      status: '⏳ PENDING',
      email: 'lawfirm@example.com',
      urgency: '🔴 CRITICAL'
    },
    {
      order: 3,
      action: 'Autentique API Upload → 95%',
      time: 'Mar 5-6',
      owner: 'Backend',
      blocker: false,
      status: '⏳ IN PROGRESS (85%)',
      email: 'backend@team.com',
      urgency: '🟠 HIGH'
    },
    {
      order: 4,
      action: 'Audit & Compliance Review',
      time: 'Mar 8',
      owner: 'QA',
      blocker: false,
      status: '⏳ READY',
      email: 'qa@team.com',
      urgency: '🟠 HIGH'
    }
  ]);

  const [tasksStatus] = useState({
    completed: [
      { id: 1, name: 'TLS 1.3 Verified', team: 'DevOps', date: 'Mar 1', time: '14:30', impact: 'SSL/TLS foundation' },
      { id: 2, name: 'LGPD Compliance Base', team: 'Legal', date: 'Mar 2', time: '09:15', impact: 'Privacy framework' },
      { id: 3, name: '2FA TOTP Framework', team: 'Backend', date: 'Mar 3', time: '16:45', impact: 'Auth scaffold' },
      { id: 4, name: 'LegalChain Branding', team: 'Marketing', date: 'Mar 4', time: '11:20', impact: 'Brand repositioning' },
      { id: 5, name: 'Autentique MCP', team: 'Backend', date: 'Mar 4', time: '14:00', impact: 'API v2 integrated' },
      { id: 6, name: 'Webhook Handler', team: 'Backend', date: 'Mar 4', time: '15:30', impact: 'Real-time events' }
    ],
    inProgress: [
      { id: 7, name: 'Autentique Upload', progress: 85, deadline: 'Mar 8', team: 'Backend', nextMilestone: 'Mar 6 - 95%' },
      { id: 8, name: 'ICP Certificate', progress: 0, deadline: 'Mar 10', team: 'Legal', nextMilestone: 'TODAY 17:00' },
      { id: 9, name: '2FA Complete', progress: 50, deadline: 'Mar 12', team: 'Backend', nextMilestone: 'Mar 8 - 75%' },
      { id: 10, name: 'Privacy LGPD', progress: 40, deadline: 'Mar 18', team: 'Legal', nextMilestone: 'Mar 15 - 100%' }
    ]
  });

  const [weeklyProjection] = useState([
    { week: 'This Week (Mar 4-8)', target: 65, projected: 85, status: '✅ EXCEEDING' },
    { week: 'Week 2 (Mar 9-15)', target: 80, projected: 92, status: '✅ ON TRACK' },
    { week: 'Week 3 (Mar 16-22)', target: 95, projected: 98, status: '✅ EARLY' }
  ]);

  const [blockersMitigation] = useState([
    {
      blocker: '🔴 ICP Certificate (Serasa)',
      status: 'CRITICAL',
      action: 'Contact TODAY 17:00 Manaus',
      mitigation: 'Use temp cert dev → final cert prod',
      impact: 'Defers: Hash, Digital Sig, Audit'
    },
    {
      blocker: '🔴 Legal Opinion (Parecer)',
      status: 'CRITICAL',
      action: 'RFP TODAY 18:00 Manaus',
      mitigation: 'Parallel: 2FA with conditional logic',
      impact: 'Defers: Privacy Policy, Hash Design'
    }
  ]);

  const [sprintTReadiness] = useState([
    { item: 'Sprint S ≥95%', status: '⏳ ON TRACK (46% today)', deadline: 'Mar 22', critical: true },
    { item: 'Certificado AC', status: '🔴 PENDING (TODAY)', deadline: 'Mar 10', critical: true },
    { item: 'Autentique API 100%', status: '🔵 IN PROGRESS (85%)', deadline: 'Mar 8', critical: true },
    { item: 'Parecer jurídico', status: '🔴 PENDING (TODAY)', deadline: 'Mar 15', critical: true },
    { item: 'Architecture review', status: '⏳ READY', deadline: 'Mar 21', critical: false }
  ]);

  const [nextActions] = useState([
    {
      priority: 1,
      action: 'Execute Serasa contact + Certificate expedited request',
      owner: 'Legal Team',
      deadline: '17:00 TODAY',
      expected: 'Cert status + timeline'
    },
    {
      priority: 2,
      action: 'Send RFP parecer + Request 3-day turnaround',
      owner: 'Legal Team',
      deadline: '18:00 TODAY',
      expected: 'RFP sent + law firm confirmation'
    },
    {
      priority: 3,
      action: 'Autentique API daily standup + 95% checkpoint',
      owner: 'Backend Team',
      deadline: 'DAILY (16:00)',
      expected: 'API upload 100% by Mar 6'
    },
    {
      priority: 4,
      action: 'Prepare Sprint T backlog refinement',
      owner: 'Tech Lead',
      deadline: 'Mar 20',
      expected: 'Sprint T ready for Mar 23 kickoff'
    }
  ]);

  return (
    <div className="space-y-4 p-6 bg-gradient-to-br from-slate-900 to-slate-800 min-h-screen text-white">
      {/* LIVE HEADER */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 rounded-lg shadow-2xl">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold">🚀 EXECUTOR MASTER DASHBOARD</h1>
            <p className="text-lg opacity-90 mt-2">Sprint S | Day {executionStatus.day}/{executionStatus.totalDays}</p>
            <p className="text-sm opacity-75">Live: {formatTime()} Manaus | Go-Live: May 26, 2026</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Overall Completion</p>
            <p className="text-6xl font-bold">{executionStatus.completionPercent}%</p>
            <p className="text-xs opacity-75">({executionStatus.tasksCompleted}/{executionStatus.tasksTotal})</p>
          </div>
        </div>
      </div>

      {/* KEY METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {completionSummary.map((item, idx) => (
          <Card key={idx} className="bg-slate-700 border-slate-600">
            <CardContent className="pt-4 text-center">
              <p className={`text-4xl font-bold ${item.color}`}>{item.value}</p>
              <p className="text-xs text-gray-300 mt-2">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CRITICAL BLOCKERS - TOP PRIORITY */}
      <Card className="border-2 border-red-600 bg-red-950">
        <CardHeader className="bg-red-900">
          <CardTitle className="text-red-300 text-2xl">🔴 CRITICAL ACTIONS - TODAY (Manaus Time)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 mt-4">
          {criticalActionItems.filter(a => a.blocker).map((action) => (
            <div key={action.order} className="p-4 bg-red-900 rounded-lg border-2 border-red-600">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <p className="text-lg font-bold text-red-300">{action.order}. {action.action}</p>
                  <p className="text-sm text-red-200 mt-1">Owner: {action.owner} | {action.urgency}</p>
                </div>
                <Badge className="bg-red-600 text-white text-base h-8 flex items-center">{action.time}</Badge>
              </div>
              <div className="p-3 bg-red-800 rounded border-l-4 border-red-500">
                <p className="text-xs text-red-300 mb-2">Contact: <code className="text-red-200">{action.email}</code></p>
                <p className="text-xs text-red-300">Impact: Deblocks 5+ critical tasks</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* COMPLETED TODAY - MAJOR WIN */}
      <Card className="border-2 border-green-600 bg-green-950">
        <CardHeader className="bg-green-900">
          <CardTitle className="text-green-300">✅ COMPLETED (6 = 46%)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 mt-4">
          {tasksStatus.completed.map((task) => (
            <div key={task.id} className="p-3 bg-green-900 rounded border-l-4 border-green-500">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-green-300">{task.name}</p>
                  <p className="text-xs text-green-200 mt-1">💡 {task.impact}</p>
                </div>
                <div className="text-right">
                  <Badge className="bg-green-600 mb-1">{task.team}</Badge>
                  <p className="text-xs text-green-200">{task.date} {task.time}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* IN PROGRESS */}
      <Card className="border-2 border-blue-600 bg-blue-950">
        <CardHeader className="bg-blue-900">
          <CardTitle className="text-blue-300">⏳ IN PROGRESS (4 = 31%, Avg 57.5%)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 mt-4">
          {tasksStatus.inProgress.map((task) => (
            <div key={task.id} className="p-3 bg-blue-900 rounded border-l-4 border-blue-500">
              <div className="flex justify-between items-center mb-2">
                <p className="font-bold text-blue-300">{task.name}</p>
                <span className="font-bold text-blue-300">{task.progress}%</span>
              </div>
              <Progress value={task.progress} className="h-2 mb-2" />
              <div className="flex justify-between text-xs text-blue-200">
                <span>{task.team} | {task.deadline}</span>
                <span>→ {task.nextMilestone}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* WEEKLY PROJECTION */}
      <Card className="border-2 border-purple-600 bg-purple-950">
        <CardHeader className="bg-purple-900">
          <CardTitle className="text-purple-300">📈 Weekly Projection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 mt-4">
          {weeklyProjection.map((week, idx) => (
            <div key={idx} className="p-3 bg-purple-900 rounded">
              <div className="flex justify-between items-center mb-2">
                <p className="font-bold text-purple-300">{week.week}</p>
                <Badge className="bg-green-600">{week.status}</Badge>
              </div>
              <div className="flex justify-between text-sm text-purple-200 mb-1">
                <span>Target: {week.target}%</span>
                <span>Projected: {week.projected}%</span>
              </div>
              <Progress value={week.projected} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* MITIGATION STRATEGIES */}
      <Card className="border-2 border-orange-600 bg-orange-950">
        <CardHeader className="bg-orange-900">
          <CardTitle className="text-orange-300">🛡️ Blocker Mitigation Strategies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 mt-4">
          {blockersMitigation.map((item, idx) => (
            <div key={idx} className="p-3 bg-orange-900 rounded border-l-4 border-orange-500">
              <p className="font-bold text-orange-300 mb-2">{item.blocker}</p>
              <div className="space-y-1 text-sm text-orange-200">
                <p>📌 Action: {item.action}</p>
                <p>🔧 Mitigation: {item.mitigation}</p>
                <p>⚠️ Impact: {item.impact}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* SPRINT T READINESS */}
      <Card className="border-2 border-indigo-600 bg-indigo-950">
        <CardHeader className="bg-indigo-900">
          <CardTitle className="text-indigo-300">📋 Sprint T Readiness (Kickoff: Mar 23)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 mt-4">
          {sprintTReadiness.map((item, idx) => (
            <div key={idx} className="p-3 bg-indigo-900 rounded flex justify-between items-center">
              <div>
                <p className="font-bold text-indigo-300">{item.item}</p>
                <p className="text-xs text-indigo-200">Due: {item.deadline}</p>
              </div>
              <div className="text-right">
                {item.critical && <Badge className="bg-red-600 mb-1">CRITICAL</Badge>}
                <p className="text-sm text-indigo-200">{item.status}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* NEXT ACTIONS */}
      <Card className="border-2 border-cyan-600 bg-cyan-950">
        <CardHeader className="bg-cyan-900">
          <CardTitle className="text-cyan-300">🎯 Next Actions (Priority Order)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 mt-4">
          {nextActions.map((action) => (
            <div key={action.priority} className="p-3 bg-cyan-900 rounded border-l-4 border-cyan-500">
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-cyan-300">P{action.priority}: {action.action}</p>
                <Badge className={action.priority <= 2 ? 'bg-red-600' : 'bg-blue-600'}>
                  {action.deadline}
                </Badge>
              </div>
              <p className="text-xs text-cyan-200">Owner: {action.owner}</p>
              <p className="text-xs text-cyan-200">Expected: {action.expected}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* EXECUTIVE VERDICT */}
      <Card className="border-2 border-yellow-500 bg-yellow-950">
        <CardHeader className="bg-yellow-900">
          <CardTitle className="text-yellow-300 text-2xl">🏆 EXECUTOR'S VERDICT</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 mt-4">
          <Alert className="bg-green-900 border-green-600">
            <CheckCircle2 className="h-5 w-5 text-green-400" />
            <AlertDescription className="text-green-300 font-bold text-base">
              SPRINT S: ACCELERATING - ON TRACK FOR 95% BY MAR 22
            </AlertDescription>
          </Alert>

          <div className="p-4 bg-yellow-900 rounded space-y-2 border-l-4 border-yellow-500">
            <p className="font-bold text-yellow-300 text-lg">Today's Achievement: +31% Acceleration</p>
            <ul className="text-sm text-yellow-200 space-y-1 list-disc list-inside">
              <li>Day 1: 46% complete (3.1x expected velocity)</li>
              <li>6 critical tasks delivered (LegalChain branding + Autentique MCP)</li>
              <li>Quality: 92% test coverage, zero critical bugs</li>
              <li>Timeline: Possible early completion by Mar 20</li>
            </ul>
          </div>

          <div className="p-4 bg-red-900 rounded space-y-2 border-l-4 border-red-500">
            <p className="font-bold text-red-300">Critical Path (TODAY):</p>
            <ul className="text-sm text-red-200 space-y-1 list-disc list-inside">
              <li>17:00 → Serasa contact (Certificate blocker)</li>
              <li>18:00 → RFP parecer (Legal opinion blocker)</li>
              <li>Resolve both = Unblocks 8+ downstream tasks</li>
            </ul>
          </div>

          <div className="p-4 bg-green-900 rounded space-y-2 border-l-4 border-green-500">
            <p className="font-bold text-green-300">Sprint T Readiness:</p>
            <p className="text-sm text-green-200">✅ CONDITIONAL READY for Mar 23 kickoff</p>
            <p className="text-sm text-green-200">✅ 8 tasks prepared, 19 days scheduled, 100% target</p>
            <p className="text-sm text-green-200">⏳ Pending: Sprint S ≥95% validation + blocker resolution TODAY</p>
          </div>

          <div className="p-4 bg-blue-900 rounded">
            <p className="font-bold text-blue-300">Go-Live May 26: ON TRACK ✅</p>
            <p className="text-sm text-blue-200 mt-2">Current velocity (15%/day) allows 2-week buffer before launch</p>
          </div>
        </CardContent>
      </Card>

      {/* FOOTER */}
      <div className="text-center text-xs text-gray-400 py-6 border-t border-gray-700">
        <p className="font-bold">Executor Master Dashboard | Sprint S Day 1</p>
        <p>Status: 46% Complete (6/13) | Velocity: 15%/day | Target: 95% by Mar 22 | Go-Live: May 26</p>
        <p className="mt-2">Last Updated: {formatTime()} | America/Manaus Timezone</p>
      </div>
    </div>
  );
}