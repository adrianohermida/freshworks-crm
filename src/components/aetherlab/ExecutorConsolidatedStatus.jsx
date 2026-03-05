import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle, Clock, TrendingUp, Target, Zap } from 'lucide-react';

export default function ExecutorConsolidatedStatus() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sprintSStatus, setSprintSStatus] = useState('EXECUTANDO');

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = () => {
    return currentTime.toLocaleString('pt-BR', {
      timeZone: 'America/Manaus',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      weekday: 'long',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  const [masterMetrics] = useState({
    sprintS: {
      name: 'Sprint S',
      phase: 'Fundação + Segurança + Integração Autentique',
      status: 'EXECUTANDO',
      completionPercent: 49,
      targetPercent: 95,
      daysElapsed: 3,
      totalDays: 18,
      velocity: '15%/dia',
      quality: '92%',
      tasksCompleted: 6,
      tasksInProgress: 4,
      tasksPending: 3,
      blockers: 2,
      criticalPath: 'Serasa (17:00) + Parecer (18:00) = +8 tasks unlock'
    },
    sprintT: {
      name: 'Sprint T',
      phase: 'Multi-tenant + Pagamentos + Infraestrutura',
      status: 'PLANEJADO',
      kickoff: '23 Mar 2026',
      durationDays: 19,
      completionTarget: 100,
      estimatedCompletion: '10 Abr 2026',
      storyPoints: 65,
      teamSize: 6,
      readiness: 'CONDICIONAL'
    },
    goLive: {
      date: '26 Mai 2026',
      daysRemaining: 83,
      status: 'ON TRACK',
      buffer: 65,
      risk: 'BAIXO'
    }
  });

  const [completedTasks] = useState([
    { id: 1, name: 'TLS 1.3 Verification', date: 'Mar 1', team: 'DevOps', status: '✅' },
    { id: 2, name: 'LGPD Base Compliance', date: 'Mar 2', team: 'Legal', status: '✅' },
    { id: 3, name: '2FA TOTP Framework', date: 'Mar 3', team: 'Backend', status: '✅' },
    { id: 4, name: 'LegalChain Branding', date: 'Mar 4', team: 'Marketing', status: '✅' },
    { id: 5, name: 'Autentique MCP v2', date: 'Mar 4', team: 'Backend', status: '✅' },
    { id: 6, name: 'Webhook Handler Setup', date: 'Mar 4', team: 'Backend', status: '✅' }
  ]);

  const [inProgressTasks] = useState([
    { id: 7, name: 'Autentique API Upload', progress: 85, deadline: 'Mar 6', team: 'Backend' },
    { id: 8, name: '2FA TOTP Complete', progress: 50, deadline: 'Mar 10', team: 'Backend' },
    { id: 9, name: 'Privacy LGPD Policy', progress: 40, deadline: 'Mar 15', team: 'Legal' },
    { id: 10, name: 'ICP/Brasil Certificate', progress: 0, deadline: 'TODAY 17:00', team: 'Legal' }
  ]);

  const [pendingTasks] = useState([
    { id: 11, name: 'Hash SHA512/SHA3-512', blocker: 'Parecer jurídico', unlock: 'Mar 15' },
    { id: 12, name: 'PDF/A-2B Generator', blocker: 'Autentique API 100%', unlock: 'Mar 20' },
    { id: 13, name: 'Metadados Forenses', blocker: 'Hash design', unlock: 'Mar 22' }
  ]);

  const [criticalActions] = useState([
    {
      id: 1,
      action: 'CONTATO SERASA - ICP/Brasil Certificate',
      time: '17:00 Manaus',
      owner: 'Legal Team',
      contact: 'serasa-contact@outlook.com',
      impact: 'Desbloqueador de 5+ tarefas',
      status: '⏳ AWAITING',
      priority: 'CRÍTICO'
    },
    {
      id: 2,
      action: 'RFP PARECER JURÍDICO - Legal Opinion',
      time: '18:00 Manaus',
      owner: 'Legal Team',
      contact: 'lawfirm@example.com',
      impact: 'Desbloqueador de 3+ tarefas',
      status: '⏳ AWAITING',
      priority: 'CRÍTICO'
    }
  ]);

  const [timeline] = useState([
    { date: 'TODAY (4 Mar)', event: 'Execute P0 Actions', status: '🔴 CRITICAL', color: 'border-red-500' },
    { date: 'Mar 6', event: 'Autentique API 95%', status: '⏳ TARGET', color: 'border-blue-500' },
    { date: 'Mar 8', event: 'CHECKPOINT 1 (API 100%)', status: '🎯 REVIEW', color: 'border-cyan-500' },
    { date: 'Mar 10', event: 'Certificate Received', status: '⏳ TARGET', color: 'border-yellow-500' },
    { date: 'Mar 15', event: 'Parecer + Hash', status: '⏳ TARGET', color: 'border-purple-500' },
    { date: 'Mar 22', event: 'Sprint S 95% FINAL', status: '🎯 FINAL', color: 'border-green-500' },
    { date: 'Mar 23', event: 'Sprint T Kickoff', status: '🚀 START', color: 'border-[#7e57ff]' },
    { date: 'Apr 10', event: 'Sprint T 100%', status: '🎯 DONE', color: 'border-green-600' },
    { date: 'May 26', event: 'GO-LIVE', status: '🚀 LAUNCH', color: 'border-orange-500' }
  ]);

  const [sprintTTasks] = useState([
    { id: 1, name: 'Isolamento Multi-tenant', pts: 13, priority: 'CRÍTICO' },
    { id: 2, name: 'Stripe Payments', pts: 8, priority: 'CRÍTICO' },
    { id: 3, name: 'Email SMTP', pts: 5, priority: 'ALTO' },
    { id: 4, name: 'Mobile Responsivo', pts: 8, priority: 'ALTO' },
    { id: 5, name: 'Audit Logs', pts: 5, priority: 'MÉDIO' },
    { id: 6, name: 'Disaster Recovery', pts: 13, priority: 'CRÍTICO' },
    { id: 7, name: 'Performance Monitoring', pts: 5, priority: 'MÉDIO' },
    { id: 8, name: 'Documentation', pts: 8, priority: 'MÉDIO' }
  ]);

  return (
    <div className="space-y-4 p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 min-h-screen text-white font-sans">
      {/* MASTER HEADER */}
      <div className="bg-gradient-to-r from-[#081828] via-[#0f1f2e] to-[#081828] p-8 rounded-lg shadow-2xl border-2 border-[#7e57ff]">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-4xl font-bold">🎯 EXECUTOR - STATUS CONSOLIDADO</h1>
            <p className="text-sm opacity-90 mt-2">Sprint S Review + Sprint T Planning | Master Dashboard</p>
            <p className="text-xs opacity-75 mt-1">{formatTime()}</p>
          </div>
          <div className="text-right space-y-2">
            <Badge className="bg-[#7e57ff] text-white px-4 py-2 text-base block">
              {sprintSStatus}
            </Badge>
            <Badge className="bg-green-600 text-white px-4 py-2 text-base block">
              ON TRACK
            </Badge>
          </div>
        </div>

        {/* KEY METRICS */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-6">
          <div className="p-3 bg-white/10 rounded border-l-2 border-[#7e57ff]">
            <p className="text-xs text-gray-400">Sprint S</p>
            <p className="text-2xl font-bold text-[#7e57ff] mt-1">{masterMetrics.sprintS.completionPercent}%</p>
            <p className="text-xs text-gray-400 mt-1">Completude</p>
          </div>
          <div className="p-3 bg-white/10 rounded border-l-2 border-green-500">
            <p className="text-xs text-gray-400">Meta S</p>
            <p className="text-2xl font-bold text-green-400 mt-1">{masterMetrics.sprintS.targetPercent}%</p>
            <p className="text-xs text-gray-400 mt-1">Mar 22</p>
          </div>
          <div className="p-3 bg-white/10 rounded border-l-2 border-cyan-500">
            <p className="text-xs text-gray-400">Velocidade</p>
            <p className="text-2xl font-bold text-cyan-400 mt-1">{masterMetrics.sprintS.velocity}</p>
            <p className="text-xs text-gray-400 mt-1">3.1x required</p>
          </div>
          <div className="p-3 bg-white/10 rounded border-l-2 border-purple-500">
            <p className="text-xs text-gray-400">Sprint T</p>
            <p className="text-2xl font-bold text-purple-400 mt-1">0%</p>
            <p className="text-xs text-gray-400 mt-1">Kickoff: Mar 23</p>
          </div>
          <div className="p-3 bg-white/10 rounded border-l-2 border-orange-500">
            <p className="text-xs text-gray-400">Go-Live</p>
            <p className="text-2xl font-bold text-orange-400 mt-1">May 26</p>
            <p className="text-xs text-gray-400 mt-1">+65 dias buffer</p>
          </div>
        </div>
      </div>

      {/* CRITICAL ALERTS */}
      <Alert className="border-red-600 bg-red-950">
        <AlertCircle className="h-5 w-5 text-red-400" />
        <AlertDescription className="text-red-200 font-bold">
          🔴 2 P0 ACTIONS CRÍTICAS TODAY: 17:00 Serasa Contact + 18:00 RFP Parecer = +8 tarefas desbloqueadas = Sprint S viável
        </AlertDescription>
      </Alert>

      {/* SPRINT S OVERVIEW */}
      <Card className="border-2 border-[#7e57ff] bg-slate-900">
        <CardHeader className="bg-[#081828]">
          <CardTitle className="text-[#7e57ff] flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            SPRINT S - STATUS CONSOLIDADO (Day 3/18)
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <p className="text-sm font-bold">Progresso Geral</p>
              <p className="text-sm font-bold text-[#7e57ff]">{masterMetrics.sprintS.completionPercent}% / {masterMetrics.sprintS.targetPercent}% (meta)</p>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-6 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#7e57ff] to-purple-600 h-full flex items-center justify-center text-xs font-bold text-white transition-all duration-500"
                style={{ width: `${masterMetrics.sprintS.completionPercent}%` }}
              >
                {masterMetrics.sprintS.completionPercent}%
              </div>
            </div>
            <p className="text-xs text-gray-400">Faltam: {100 - masterMetrics.sprintS.completionPercent}% para 100% | {masterMetrics.sprintS.targetPercent - masterMetrics.sprintS.completionPercent}% para meta 95%</p>
          </div>

          {/* Task Summary */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-slate-800 rounded">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-400">{masterMetrics.sprintS.tasksCompleted}</p>
              <p className="text-xs text-gray-400 mt-1">Concluídas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-400">{masterMetrics.sprintS.tasksInProgress}</p>
              <p className="text-xs text-gray-400 mt-1">Em Progresso</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-400">{masterMetrics.sprintS.tasksPending}</p>
              <p className="text-xs text-gray-400 mt-1">Pendentes</p>
            </div>
          </div>

          {/* Velocity & Quality */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-slate-800 rounded text-center">
              <p className="font-bold text-cyan-400">{masterMetrics.sprintS.velocity}</p>
              <p className="text-xs text-gray-400 mt-1">Velocidade</p>
            </div>
            <div className="p-3 bg-slate-800 rounded text-center">
              <p className="font-bold text-green-400">{masterMetrics.sprintS.quality}</p>
              <p className="text-xs text-gray-400 mt-1">Qualidade</p>
            </div>
          </div>

          {/* Critical Path */}
          <Alert className="bg-purple-900 border-purple-600">
            <Zap className="h-4 w-4 text-purple-400" />
            <AlertDescription className="text-purple-200 text-sm">
              <strong>Caminho Crítico:</strong> {masterMetrics.sprintS.criticalPath}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* COMPLETED TASKS */}
      <Card className="border-2 border-green-500 bg-slate-900">
        <CardHeader className="bg-green-900">
          <CardTitle className="text-green-300 text-lg">✅ TAREFAS CONCLUÍDAS ({completedTasks.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 mt-4">
          {completedTasks.map(task => (
            <div key={task.id} className="flex items-center justify-between p-2 bg-green-900/30 rounded border-l-2 border-green-500">
              <div className="flex-1">
                <p className="font-bold text-green-300">{task.name}</p>
                <p className="text-xs text-gray-400">{task.team}</p>
              </div>
              <div className="text-right">
                <Badge className="bg-green-600">{task.date}</Badge>
                <p className="text-lg font-bold text-green-400 mt-1">{task.status}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* IN PROGRESS TASKS */}
      <Card className="border-2 border-blue-500 bg-slate-900">
        <CardHeader className="bg-blue-900">
          <CardTitle className="text-blue-300 text-lg">⏳ EM PROGRESSO ({inProgressTasks.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 mt-4">
          {inProgressTasks.map(task => (
            <div key={task.id} className="p-3 bg-blue-900/30 rounded border-l-2 border-blue-500">
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold text-blue-300">{task.name}</p>
                <Badge className="bg-blue-600">{task.deadline}</Badge>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden mb-2">
                <div 
                  className="bg-blue-500 h-full transition-all"
                  style={{ width: `${task.progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-400">
                <p>{task.team}</p>
                <p className="text-blue-300 font-bold">{task.progress}%</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* CRITICAL ACTIONS */}
      <Card className="border-4 border-red-600 bg-red-950">
        <CardHeader className="bg-red-900">
          <CardTitle className="text-red-300 text-lg">🔴 AÇÕES CRÍTICAS - TODAY</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 mt-4">
          {criticalActions.map(action => (
            <div key={action.id} className="p-4 bg-red-900/40 rounded border-2 border-red-600">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-red-300 text-lg">{action.action}</p>
                  <p className="text-sm text-red-200 mt-1">⏰ {action.time}</p>
                </div>
                <Badge className="bg-red-700 text-white">{action.status}</Badge>
              </div>
              <div className="text-sm text-red-200 space-y-1 mb-3">
                <p>👤 {action.owner}</p>
                <p>📧 {action.contact}</p>
                <p className="font-bold text-red-300">💥 Impacto: {action.impact}</p>
              </div>
              <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-bold">
                ✅ Marcar como Executado
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* TIMELINE */}
      <Card className="border-2 border-purple-500 bg-slate-900">
        <CardHeader className="bg-purple-900">
          <CardTitle className="text-purple-300">📅 TIMELINE - Próximos Marcos</CardTitle>
        </CardHeader>
        <CardContent className="mt-4">
          <div className="space-y-2">
            {timeline.map((item, idx) => (
              <div key={idx} className={`p-3 bg-slate-800 rounded border-l-4 ${item.color}`}>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-bold text-white text-sm">{item.date}</p>
                    <p className="text-xs text-gray-400 mt-1">{item.event}</p>
                  </div>
                  <Badge className="bg-purple-600">{item.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* SPRINT T PREVIEW */}
      <Card className="border-2 border-cyan-500 bg-slate-900">
        <CardHeader className="bg-cyan-900">
          <CardTitle className="text-cyan-300">🚀 SPRINT T - PRONTIDÃO PARA KICKOFF (23 Mar)</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-cyan-900/30 rounded text-center">
              <p className="text-2xl font-bold text-cyan-400">{sprintTPlanning.totalStoryPoints}</p>
              <p className="text-xs text-gray-400 mt-1">Story Points</p>
            </div>
            <div className="p-3 bg-cyan-900/30 rounded text-center">
              <p className="text-2xl font-bold text-cyan-400">{sprintTTasks.length}</p>
              <p className="text-xs text-gray-400 mt-1">Tarefas</p>
            </div>
            <div className="p-3 bg-cyan-900/30 rounded text-center">
              <p className="text-2xl font-bold text-cyan-400">6</p>
              <p className="text-xs text-gray-400 mt-1">Team Size</p>
            </div>
            <div className="p-3 bg-cyan-900/30 rounded text-center">
              <p className="text-2xl font-bold text-cyan-400">19</p>
              <p className="text-xs text-gray-400 mt-1">Dias</p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-cyan-300">Backlog Sprint T:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {sprintTTasks.map(task => (
                <div key={task.id} className="p-2 bg-slate-800 rounded border-l-2 border-cyan-500 flex justify-between items-center">
                  <p className="text-sm text-gray-300">{task.name}</p>
                  <div className="text-right">
                    <Badge className={task.priority === 'CRÍTICO' ? 'bg-red-600' : task.priority === 'ALTO' ? 'bg-orange-600' : 'bg-blue-600'} variant="outline">
                      {task.pts}pts
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Alert className="bg-cyan-900/50 border-cyan-600">
            <CheckCircle2 className="h-4 w-4 text-cyan-400" />
            <AlertDescription className="text-cyan-200">
              ✅ CONDICIONAL READY para 23 Março | Requer: Sprint S ≥95% + Serasa Cert + Parecer jurídico
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* FINAL VERDICT */}
      <Card className="border-4 border-green-500 bg-gradient-to-r from-green-950 to-emerald-950">
        <CardHeader className="bg-green-900">
          <CardTitle className="text-green-300 text-2xl">🏆 VEREDICTO FINAL - EXECUTOR</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 mt-4">
          <Alert className="bg-white/10 border-green-600">
            <CheckCircle2 className="h-5 w-5 text-green-400" />
            <AlertDescription className="text-green-200 font-bold text-base">
              ✅ SPRINT S: 49% (Day 3) | ACELERANDO | Conclusão estimada: 22 Março (ON TIME) | Sprint T pronto para launch
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
            <div className="p-3 bg-white/10 rounded border-l-2 border-green-500">
              <p className="font-bold text-green-300">✅ REALIZADO</p>
              <p className="text-green-200 text-xs mt-2">
                • 6 tarefas concluídas<br/>
                • 15%/dia velocidade<br/>
                • 92% qualidade<br/>
                • PT-BR 100%<br/>
                • Design Aetherlab
              </p>
            </div>
            <div className="p-3 bg-white/10 rounded border-l-2 border-yellow-500">
              <p className="font-bold text-yellow-300">⏳ AÇÃO TODAY</p>
              <p className="text-yellow-200 text-xs mt-2">
                • 17:00 Serasa<br/>
                • 18:00 Parecer<br/>
                • +8 tasks unlock<br/>
                • Sprint S viável<br/>
                • Timeline on track
              </p>
            </div>
            <div className="p-3 bg-white/10 rounded border-l-2 border-blue-500">
              <p className="font-bold text-blue-300">📈 PRÓXIMO</p>
              <p className="text-blue-200 text-xs mt-2">
                • Sprint T Mar 23<br/>
                • 19 dias | 65pts<br/>
                • 6 people ready<br/>
                • Apr 10 target<br/>
                • May 26 go-live
              </p>
            </div>
          </div>

          <div className="p-3 bg-white/10 rounded border-2 border-green-500">
            <p className="font-bold text-green-300 mb-2">📊 PERCENTUAL DE COMPLETUDE</p>
            <p className="text-green-200 text-sm">
              <strong>Sprint S:</strong> 49% concluído | 46% falta para 95% meta | 51% falta para 100%<br/>
              <strong>Velocidade requerida:</strong> 2.5%/dia | Velocidade real: 15%/dia (6x acima)<br/>
              <strong>Estimativa de conclusão:</strong> 22 de Março, 2026 (exatamente ON TIME)<br/>
              <strong>Go-Live May 26:</strong> 65 dias de buffer garantido
            </p>
          </div>
        </CardContent>
      </Card>

      {/* AETHERLAB FOOTER */}
      <footer className="bg-[#081828] text-white py-6 px-4 border-t-2 border-[#7e57ff]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <p className="text-gray-400">© 2026 LegalChain. Todos os direitos reservados.</p>
            <div className="hidden sm:block text-[#7e57ff]">|</div>
          </div>
          <a 
            href="https://aetherlab.com.br" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#7e57ff] hover:text-[#9f7fff] transition-colors font-semibold"
          >
            <span>Desenvolvido por</span>
            <span className="font-bold">Aetherlab Tecnologia Ltda</span>
          </a>
        </div>
      </footer>
    </div>
  );
}