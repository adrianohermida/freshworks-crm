import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Clock, TrendingUp, Play, Pause } from 'lucide-react';

export default function ExecutorControlCenter() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [sprintSStatus, setSprintSStatus] = useState('ACTIVE');
  const [sprintTStatus, setSprintTStatus] = useState('PENDING');

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
      day: '2-digit',
      month: '2-digit'
    });
  };

  const [sprintSData, setSprintSData] = useState({
    name: 'Sprint S',
    phase: 'Integração Autentique + Conformidade Legal',
    startDate: 'Mar 1',
    endDate: 'Mar 22',
    daysElapsed: 3,
    totalDays: 18,
    tasksCompleted: 6,
    tasksInProgress: 4,
    tasksPending: 3,
    totalTasks: 13,
    completionPercent: 46,
    velocity: 15,
    requiredVelocity: 4.7,
    quality: 92,
    criticalBlockers: 2,
    goLiveDate: 'May 26, 2026'
  });

  const [sprintTData, setSprintTData] = useState({
    name: 'Sprint T',
    phase: 'Multi-tenant + Payments + Infrastructure',
    plannedStart: 'Mar 23',
    plannedEnd: 'Apr 10',
    plannedDays: 19,
    tasksPlanned: 8,
    storyPoints: 57,
    readiness: 'CONDITIONAL',
    requirements: [
      { item: 'Sprint S ≥95%', status: 'PENDING', critical: true },
      { item: 'Serasa Certificate', status: 'PENDING', critical: true },
      { item: 'Legal Opinion', status: 'PENDING', critical: true }
    ]
  });

  const [criticalActions, setCriticalActions] = useState([
    {
      id: 1,
      priority: 'P0',
      action: 'CONTATO SERASA - Certificate',
      time: '17:00 TODAY',
      status: 'AWAITING',
      owner: 'Legal Team',
      contact: 'serasa-contact@outlook.com',
      blocker: true,
      affects: 5
    },
    {
      id: 2,
      priority: 'P0',
      action: 'RFP PARECER JURÍDICO',
      time: '18:00 TODAY',
      status: 'AWAITING',
      owner: 'Legal Team',
      contact: 'lawfirm@example.com',
      blocker: true,
      affects: 3
    }
  ]);

  const [taskProgress, setTaskProgress] = useState([
    { category: 'Completed', count: 6, percent: 46, color: 'bg-green-600', status: '✅' },
    { category: 'In Progress', count: 4, percent: 31, color: 'bg-blue-600', status: '⏳' },
    { category: 'Pending', count: 3, percent: 23, color: 'bg-orange-600', status: '❌' }
  ]);

  const handleExecuteAction = (actionId) => {
    setCriticalActions(prev =>
      prev.map(a => a.id === actionId ? { ...a, status: 'EXECUTED' } : a)
    );
  };

  const handleCompleteTask = (count) => {
    setSprintSData(prev => ({
      ...prev,
      tasksCompleted: prev.tasksCompleted + count,
      tasksInProgress: prev.tasksInProgress - count,
      completionPercent: Math.round(((prev.tasksCompleted + count) / prev.totalTasks) * 100)
    }));
  };

  const handleInitSprintT = () => {
    if (sprintSData.completionPercent >= 95) {
      setSprintTStatus('ACTIVE');
    } else {
      alert(`Sprint S must be ≥95% complete. Current: ${sprintSData.completionPercent}%`);
    }
  };

  return (
    <div className="space-y-4 p-6 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 min-h-screen text-white font-mono">
      {/* LIVE EXECUTOR STATUS */}
      <div className="bg-gradient-to-r from-[#7e57ff] via-purple-700 to-[#7e57ff] p-6 rounded-lg shadow-2xl border-2 border-purple-400">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold">⚡ CENTRAL DE CONTROLE DO EXECUTOR</h1>
            <p className="text-sm opacity-90 mt-2">Painel de Execução de Sprint em Tempo Real | {formatTime()}</p>
          </div>
          <div className="text-right">
            <Badge className={`text-lg px-4 py-2 ${sprintSStatus === 'ACTIVE' ? 'bg-green-600' : 'bg-orange-600'}`}>
              {sprintSStatus === 'ACTIVE' ? 'ATIVO' : 'INATIVO'}
            </Badge>
            <p className="text-xs opacity-75 mt-2">Status Sprint S</p>
          </div>
        </div>
      </div>

      {/* SPRINT S LIVE METRICS */}
      <Card className="border-2 border-[#7e57ff] bg-slate-900">
        <CardHeader className="bg-[#081828]">
          <CardTitle className="text-[#7e57ff]">📊 MÉTRICAS SPRINT S - AO VIVO (Dia {sprintSData.daysElapsed}/{sprintSData.totalDays})</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-6">
            <div className="p-3 bg-blue-900 rounded text-center">
              <p className="text-3xl font-bold text-green-400">{sprintSData.completionPercent}%</p>
              <p className="text-xs text-gray-400 mt-1">Concluído</p>
            </div>
            <div className="p-3 bg-blue-900 rounded text-center">
              <p className="text-3xl font-bold text-green-400">{sprintSData.tasksCompleted}</p>
              <p className="text-xs text-gray-400 mt-1">Feito</p>
            </div>
            <div className="p-3 bg-blue-900 rounded text-center">
              <p className="text-3xl font-bold text-blue-400">{sprintSData.tasksInProgress}</p>
              <p className="text-xs text-gray-400 mt-1">Em Progresso</p>
            </div>
            <div className="p-3 bg-blue-900 rounded text-center">
              <p className="text-3xl font-bold text-orange-400">{sprintSData.tasksPending}</p>
              <p className="text-xs text-gray-400 mt-1">Pendente</p>
            </div>
            <div className="p-3 bg-blue-900 rounded text-center">
              <p className="text-3xl font-bold text-purple-400">{sprintSData.velocity}%</p>
              <p className="text-xs text-gray-400 mt-1">Velocidade/Dia</p>
            </div>
            <div className="p-3 bg-blue-900 rounded text-center">
              <p className="text-3xl font-bold text-yellow-400">{sprintSData.quality}%</p>
              <p className="text-xs text-gray-400 mt-1">Qualidade</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <p className="text-sm font-bold text-gray-300">Progresso Geral</p>
            <div className="w-full bg-slate-700 rounded-full h-8 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-[#7e57ff] to-purple-600 h-full flex items-center justify-center transition-all duration-500"
                style={{ width: `${sprintSData.completionPercent}%` }}
              >
                <span className="text-xs font-bold text-white">{sprintSData.completionPercent}%</span>
              </div>
            </div>
            <p className="text-xs text-gray-400">Meta: 95% até 22 de Mar | Ritmo Atual: Conclusão antecipada possível</p>
          </div>
        </CardContent>
      </Card>

      {/* TASK BREAKDOWN */}
      <div className="grid grid-cols-3 gap-3">
        {taskProgress.map((task, idx) => (
          <Card key={idx} className="border-2 border-[#7e57ff] bg-slate-900">
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{task.status}</p>
                <p className="text-3xl font-bold mt-2">{task.count}</p>
                <p className="text-xs text-gray-400 mt-1">{task.category === 'Completed' ? 'Concluído' : task.category === 'In Progress' ? 'Em Progresso' : 'Pendente'}</p>
                <div className="mt-2 h-1 bg-slate-700 rounded-full overflow-hidden">
                  <div className={`${task.color} h-full`} style={{ width: `${task.percent}%` }}></div>
                </div>
                <p className="text-xs text-gray-400 mt-1">{task.percent}%</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* P0 CRITICAL ACTIONS */}
      <Card className="border-4 border-red-600 bg-red-950">
        <CardHeader className="bg-red-900">
          <CardTitle className="text-red-300 text-2xl">🔴 AÇÕES CRÍTICAS P0 (EXECUTAR HOJE)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 mt-4">
          {criticalActions.map(action => (
            <div key={action.id} className="p-4 bg-red-900 rounded-lg border-l-4 border-red-400">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-bold text-red-300 text-lg">{action.action}</p>
                  <p className="text-sm text-red-200">📍 {action.time}</p>
                </div>
                <Badge className={action.status === 'EXECUTED' ? 'bg-green-600' : 'bg-red-600'}>
                  {action.status}
                </Badge>
              </div>

              <div className="text-sm text-red-200 space-y-1 mb-3">
                <p>📧 {action.contact}</p>
                <p>👤 {action.owner}</p>
                <p className="font-bold">💥 Afeta: {action.affects} tarefas</p>
              </div>

              {action.status !== 'EXECUTED' && (
                <Button 
                  onClick={() => handleExecuteAction(action.id)}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-bold"
                >
                  ✅ Marcar como Executado
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* SPRINT S CHECKLIST */}
      <Card className="border-2 border-green-500 bg-slate-900">
        <CardHeader className="bg-green-900">
          <CardTitle className="text-green-300">✅ LISTA DE VERIFICAÇÃO SPRINT S</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 mt-4">
          <div className="p-3 bg-green-900 rounded text-sm text-green-200">
            <p className="font-bold mb-2">Meta: 95% até 22 de Mar</p>
            <p>Atual: {sprintSData.completionPercent}%</p>
            <p className="text-xs text-green-300 mt-1">
              {sprintSData.completionPercent >= 95 
                ? '✅ Pronto para Sprint T' 
                : `⏳ Faltam ${95 - sprintSData.completionPercent}%`}
            </p>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-gray-300">Ações Rápidas:</p>
            <Button 
              onClick={() => handleCompleteTask(1)}
              className="w-full bg-[#7e57ff] hover:bg-purple-700 text-white"
            >
              ➕ Concluir 1 Tarefa (+7.7%)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* SPRINT T READINESS */}
      <Card className="border-2 border-purple-500 bg-slate-900">
        <CardHeader className="bg-[#081828]">
          <CardTitle className="text-[#7e57ff]">📋 PRONTIDÃO SPRINT T (Início: 23 de Mar)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 mt-4">
          <div className="p-3 bg-purple-900 rounded">
            <p className="font-bold text-purple-300">{sprintTData.name}: {sprintTData.phase}</p>
            <p className="text-sm text-purple-200 mt-2">
              {sprintTData.plannedDays} days | {sprintTData.tasksPlanned} tasks | {sprintTData.storyPoints} story points
            </p>
            <Badge className={`mt-2 ${sprintTData.readiness === 'ACTIVE' ? 'bg-green-600' : 'bg-orange-600'}`}>
              {sprintTStatus === 'ACTIVE' ? 'ACTIVE ✅' : 'PENDING ⏳'}
            </Badge>
          </div>

          <div className="space-y-2">
            <p className="font-bold text-gray-300">Prerequisites:</p>
            {sprintTData.requirements.map((req, idx) => (
              <div key={idx} className="p-2 bg-purple-800 rounded text-sm text-purple-200">
                <p className="flex justify-between">
                  <span>{req.item}</span>
                  <span className={req.status === 'COMPLETED' ? 'text-green-400 font-bold' : 'text-orange-400'}>
                    {req.status}
                  </span>
                </p>
              </div>
            ))}
          </div>

          {sprintSData.completionPercent >= 95 ? (
            <Button 
              onClick={handleInitSprintT}
              className="w-full bg-[#7e57ff] hover:bg-purple-700 text-white font-bold"
            >
              🚀 INICIAR SPRINT T AGORA
            </Button>
          ) : (
            <Alert className="bg-orange-900 border-orange-600">
              <AlertCircle className="h-5 w-5 text-orange-400" />
              <AlertDescription className="text-orange-200">
                Sprint S deve estar ≥95% para iniciar Sprint T. Atual: {sprintSData.completionPercent}%
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* CHECKPOINT TIMELINE */}
      <Card className="border-2 border-[#7e57ff] bg-slate-900">
        <CardHeader className="bg-[#081828]">
          <CardTitle className="text-[#7e57ff]">📅 LINHA DO TEMPO DE MARCOS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
            <div className="p-2 bg-[#1a2d42] rounded text-center">
              <p className="text-xs text-[#7e57ff]">HOJE</p>
              <p className="text-lg font-bold text-[#7e57ff]">46%</p>
              <p className="text-xs text-gray-400">Linha de Base</p>
            </div>
            <div className="p-2 bg-[#1a2d42] rounded text-center">
              <p className="text-xs text-[#7e57ff]">6 Mar</p>
              <p className="text-lg font-bold text-[#7e57ff]">65%</p>
              <p className="text-xs text-gray-400">Meta</p>
            </div>
            <div className="p-2 bg-[#1a2d42] rounded text-center">
              <p className="text-xs text-[#7e57ff]">8 Mar</p>
              <p className="text-lg font-bold text-[#7e57ff]">80%</p>
              <p className="text-xs text-gray-400">Ponto de Controle</p>
            </div>
            <div className="p-2 bg-[#1a2d42] rounded text-center">
              <p className="text-xs text-[#7e57ff]">15 Mar</p>
              <p className="text-lg font-bold text-[#7e57ff]">90%</p>
              <p className="text-xs text-gray-400">Meta</p>
            </div>
            <div className="p-2 bg-[#1a2d42] rounded text-center">
              <p className="text-xs text-[#7e57ff]">22 Mar</p>
              <p className="text-lg font-bold text-green-400">95%</p>
              <p className="text-xs text-gray-400">FINAL</p>
            </div>
            <div className="p-2 bg-[#1a2d42] rounded text-center">
              <p className="text-xs text-[#7e57ff]">26 Mai</p>
              <p className="text-lg font-bold text-[#7e57ff]">100%</p>
              <p className="text-xs text-gray-400">Lançamento</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GO-LIVE STATUS */}
      <Card className="border-2 border-yellow-500 bg-slate-900">
        <CardHeader className="bg-yellow-900">
          <CardTitle className="text-yellow-300">🚀 STATUS DO LANÇAMENTO: {sprintSData.goLiveDate}</CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Alert className="bg-green-900 border-green-600">
            <CheckCircle2 className="h-5 w-5 text-green-400" />
            <AlertDescription className="text-green-200">
              ✅ NO CRONOGRAMA | Velocidade atual = 15%/dia | Conclusão projetada: 15 de Abr | Buffer: 41 dias
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* FINAL VERDICT */}
      <Card className="border-4 border-green-500 bg-gradient-to-r from-green-950 to-emerald-950">
        <CardHeader className="bg-green-900">
          <CardTitle className="text-green-300 text-2xl">🏆 VEREDICTO DO EXECUTOR</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 mt-4">
          <Alert className="bg-white/10 border-green-600">
            <CheckCircle2 className="h-5 w-5 text-green-400" />
            <AlertDescription className="text-green-200 font-bold">
              SPRINT S: ACELERANDO À FRENTE DO CRONOGRAMA | {sprintSData.completionPercent}% CONCLUÍDO (Dia {sprintSData.daysElapsed})
            </AlertDescription>
          </Alert>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div className="p-3 bg-white/10 rounded border-l-2 border-green-500">
              <p className="font-bold text-green-300">✅ Realizações</p>
              <p className="text-green-200 text-xs mt-1">
                {sprintSData.tasksCompleted} tarefas feitas | {sprintSData.velocity}%/dia velocidade | {sprintSData.quality}% qualidade
              </p>
            </div>
            <div className="p-3 bg-white/10 rounded border-l-2 border-orange-500">
              <p className="font-bold text-orange-300">⚡ Caminho Crítico</p>
              <p className="text-orange-200 text-xs mt-1">
                17:00 Serasa + 18:00 Parecer = Desbloqueador {criticalActions.reduce((a, b) => a + b.affects, 0)} tarefas
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-400 text-center pt-2 border-t border-gray-700">
            Painel em Tempo Real | Atualizado: {formatTime()} Manaus
          </p>
        </CardContent>
      </Card>
    </div>
  );
}