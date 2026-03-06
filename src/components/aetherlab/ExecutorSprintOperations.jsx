import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { 
  CheckCircle2, AlertCircle, Clock, Zap, TrendingUp, Save, 
  RefreshCw, Trash2, Plus, ChevronDown, ChevronUp 
} from 'lucide-react';

export default function ExecutorSprintOperations() {
  const [expandedTask, setExpandedTask] = useState(null);
  
  const [sprintStatus, setSprintStatus] = useState({
    name: 'Sprint S',
    startDate: 'Mar 4, 2026',
    endDate: 'Mar 22, 2026',
    currentDay: 1,
    totalDays: 18,
    globalCompletion: 15
  });

  const [tasks, setTasks] = useState([
    // CONCLUÍDOS
    {
      id: 1,
      task: 'TLS 1.3 Verificado',
      owner: 'DevOps',
      status: 'completed',
      progress: 100,
      deadline: 'Mar 1',
      startDate: 'Feb 25',
      description: 'Implementação e validação de TLS 1.3 em produção',
      subtasks: [
        { name: 'Configuração nginx', done: true },
        { name: 'Certificados SSL/TLS', done: true },
        { name: 'Testes performance', done: true }
      ],
      notes: 'Concluído sem issues'
    },
    {
      id: 2,
      task: '2FA TOTP Framework',
      owner: 'Backend',
      status: 'completed',
      progress: 100,
      deadline: 'Mar 3',
      startDate: 'Feb 28',
      description: 'Framework de autenticação TOTP para 2FA',
      subtasks: [
        { name: 'Gerador TOTP', done: true },
        { name: 'Validador TOTP', done: true },
        { name: 'Testes unitários', done: true }
      ],
      notes: 'Pronto para integração com login'
    },
    {
      id: 3,
      task: 'LGPD Compliance Rascunho',
      owner: 'Legal',
      status: 'completed',
      progress: 100,
      deadline: 'Mar 2',
      startDate: 'Feb 26',
      description: 'Documento inicial de conformidade LGPD',
      subtasks: [
        { name: 'Análise requisitos LGPD', done: true },
        { name: 'Mapeamento dados pessoais', done: true },
        { name: 'Rascunho documento', done: true }
      ],
      notes: 'Aguardando parecer jurídico para finalização'
    },

    // EM PROGRESSO
    {
      id: 4,
      task: 'Autentique API GraphQL',
      owner: 'Backend',
      status: 'in_progress',
      progress: 30,
      deadline: 'Mar 8',
      startDate: 'Mar 3',
      description: 'Integração GraphQL com API v2 da Autentique',
      subtasks: [
        { name: 'Setup GraphQL client', done: true },
        { name: 'Queries autenticação', done: false },
        { name: 'Mutations upload PDF', done: false },
        { name: 'Error handling', done: false }
      ],
      notes: 'Em andamento. Queries de auth funcionando.',
      blockers: 'Aguardando documentação API v2 completa'
    },
    {
      id: 5,
      task: '2FA TOTP Completo',
      owner: 'Backend',
      status: 'in_progress',
      progress: 50,
      deadline: 'Mar 12',
      startDate: 'Mar 4',
      description: 'Integração completa de 2FA TOTP no login',
      subtasks: [
        { name: 'QR code gerador', done: true },
        { name: 'Tela setup 2FA', done: false },
        { name: 'Backup codes', done: false },
        { name: 'Testes E2E', done: false }
      ],
      notes: 'Framework pronto, faltam integrações UI'
    },
    {
      id: 6,
      task: 'Privacy Policy LGPD',
      owner: 'Legal',
      status: 'in_progress',
      progress: 40,
      deadline: 'Mar 18',
      startDate: 'Mar 2',
      description: 'Política de Privacidade conforme Lei 13.709 (LGPD)',
      subtasks: [
        { name: 'Template LGPD', done: true },
        { name: 'Sessão dados pessoais', done: true },
        { name: 'Sessão direitos titulares', done: false },
        { name: 'Revisão jurídica', done: false }
      ],
      notes: 'Estrutura aprovada por Legal, falta preenchimento'
    },
    {
      id: 7,
      task: 'Termos de Uso Finais',
      owner: 'Legal',
      status: 'in_progress',
      progress: 30,
      deadline: 'Mar 20',
      startDate: 'Mar 4',
      description: 'Documento de Termos de Uso com cláusulas legais',
      subtasks: [
        { name: 'Estrutura base', done: true },
        { name: 'Cláusulas assinatura digital', done: false },
        { name: 'Responsabilidades', done: false },
        { name: 'Aprovação conselho', done: false }
      ],
      notes: 'Aguardando conclusão parecer jurídico'
    },

    // PENDENTES
    {
      id: 8,
      task: 'Hash SHA512 + SHA3-512',
      owner: 'Backend',
      status: 'pending',
      progress: 0,
      deadline: 'Mar 15',
      startDate: 'Mar 9',
      description: 'Gerador de hash duplo (SHA512 + SHA3-512)',
      subtasks: [
        { name: 'Implementação SHA512', done: false },
        { name: 'Implementação SHA3-512', done: false },
        { name: 'Validador', done: false },
        { name: 'Testes', done: false }
      ],
      notes: 'Depende de aprovação da estratégia criptográfica',
      dependencies: ['Documento Parecer Jurídico']
    },
    {
      id: 9,
      task: 'PDF/A-2B Generator',
      owner: 'Backend',
      status: 'pending',
      progress: 0,
      deadline: 'Mar 20',
      startDate: 'Mar 15',
      description: 'Gerador de PDF/A-2B para documentos digitalizados',
      subtasks: [
        { name: 'Setup iText7', done: false },
        { name: 'Converter PDF → PDF/A-2B', done: false },
        { name: 'Metadados documento', done: false },
        { name: 'Validação', done: false }
      ],
      notes: 'Aguarda finalização Autentique API',
      dependencies: ['Autentique API GraphQL']
    },
    {
      id: 10,
      task: 'Metadados Forenses',
      owner: 'Backend',
      status: 'pending',
      progress: 0,
      deadline: 'Mar 18',
      startDate: 'Mar 12',
      description: 'Captura de metadados forenses do documento',
      subtasks: [
        { name: 'Collector GPS/Timestamp', done: false },
        { name: 'Captura IP + Browser', done: false },
        { name: 'Storage encriptado', done: false },
        { name: 'API consulta', done: false }
      ],
      notes: '',
      dependencies: ['Hash SHA512 + SHA3-512']
    },
    {
      id: 11,
      task: 'Parecer Jurídico',
      owner: 'Legal',
      status: 'pending',
      progress: 0,
      deadline: 'Mar 26',
      startDate: 'Mar 4',
      description: 'Parecer jurídico sobre conformidade Lei 14.063/2020',
      subtasks: [
        { name: 'RFP enviado para consultora', done: false },
        { name: 'Recebimento parecer', done: false },
        { name: 'Revisão interna', done: false },
        { name: 'Aprovação conselho', done: false }
      ],
      notes: 'RFP será enviado hoje (Mar 4)',
      blockers: 'Aguardando resposta consultora jurídica'
    },
    {
      id: 12,
      task: 'Testes E2E',
      owner: 'QA',
      status: 'pending',
      progress: 0,
      deadline: 'Mar 20',
      startDate: 'Mar 16',
      description: 'Suite completa de testes end-to-end',
      subtasks: [
        { name: 'Setup Cypress', done: false },
        { name: 'Testes upload', done: false },
        { name: 'Testes assinatura', done: false },
        { name: 'Testes validação', done: false }
      ],
      notes: 'Depende de conclusão de tarefas backend',
      dependencies: ['Autentique API GraphQL', 'Hash SHA512 + SHA3-512']
    },
    {
      id: 13,
      task: 'Deploy Staging',
      owner: 'DevOps',
      status: 'pending',
      progress: 0,
      deadline: 'Mar 22',
      startDate: 'Mar 20',
      description: 'Deploy de Sprint S em ambiente staging',
      subtasks: [
        { name: 'Build Docker', done: false },
        { name: 'Deploy GCP Cloud Run', done: false },
        { name: 'Testes smoke', done: false },
        { name: 'Validação performance', done: false }
      ],
      notes: '',
      dependencies: ['Testes E2E', 'Privacy Policy LGPD']
    },

    // BLOQUEADOS
    {
      id: 14,
      task: 'Certificado ICP/Brasil',
      owner: 'Legal + DevOps',
      status: 'blocked',
      progress: 0,
      deadline: 'Mar 10',
      startDate: 'Feb 28',
      description: 'Aquisição e instalação de Certificado Digital ICP-Brasil',
      subtasks: [
        { name: 'RFP enviado para Serasa', done: false },
        { name: 'Validação documentação PJ', done: false },
        { name: 'Recebimento certificado', done: false },
        { name: 'Instalação em KMS', done: false }
      ],
      notes: 'BLOQUEADOR CRÍTICO - Aguardando resposta Serasa',
      blockerReason: 'Serasa não respondeu ainda. Seguimento necessário hoje.',
      severity: 'CRÍTICO'
    }
  ]);

  // Calcular métricas
  const metrics = {
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    pending: tasks.filter(t => t.status === 'pending').length,
    blocked: tasks.filter(t => t.status === 'blocked').length,
    total: tasks.length
  };

  const completion = Math.round((metrics.completed / metrics.total) * 100);
  const avgProgress = Math.round(
    (tasks.reduce((sum, t) => sum + t.progress, 0) / metrics.total)
  );

  const handleTaskUpdate = (taskId, updates) => {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, ...updates } : t));
  };

  const handleSubtaskToggle = (taskId, subtaskIndex) => {
    setTasks(tasks.map(t => {
      if (t.id === taskId) {
        const newSubtasks = [...t.subtasks];
        newSubtasks[subtaskIndex].done = !newSubtasks[subtaskIndex].done;
        const doneCount = newSubtasks.filter(s => s.done).length;
        const newProgress = Math.round((doneCount / newSubtasks.length) * 100);
        return { ...t, subtasks: newSubtasks, progress: newProgress };
      }
      return t;
    }));
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-600';
      case 'in_progress': return 'bg-blue-600';
      case 'pending': return 'bg-orange-600';
      case 'blocked': return 'bg-red-600';
      default: return 'bg-gray-600';
    }
  };

  const getStatusLabel = (status) => {
    switch(status) {
      case 'completed': return '✅ Concluído';
      case 'in_progress': return '⏳ Em Progresso';
      case 'pending': return '❌ Pendente';
      case 'blocked': return '🚨 Bloqueado';
      default: return 'Desconhecido';
    }
  };

  return (
    <div className="space-y-4 p-6 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 min-h-screen">
      {/* HEADER */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">🚀 Executor Sprint - Operations Panel</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {sprintStatus.name} • Dia {sprintStatus.currentDay}/{sprintStatus.totalDays} • {sprintStatus.startDate} - {sprintStatus.endDate}
          </p>
        </div>
        <div className="text-right space-y-2">
          <p className="text-4xl font-bold text-blue-600">{completion}%</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">Completude Global</p>
          <Button className="gap-2 text-sm"><RefreshCw className="w-4 h-4" /> Atualizar</Button>
        </div>
      </div>

      {/* QUICK SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card>
          <CardContent className="pt-4">
            <p className="text-xs font-bold text-gray-600">TOTAL</p>
            <p className="text-3xl font-bold">{metrics.total}</p>
            <p className="text-xs text-gray-600 mt-1">tarefas</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-400">
          <CardContent className="pt-4">
            <p className="text-xs font-bold text-green-700">✅ CONCLUÍDO</p>
            <p className="text-3xl font-bold text-green-600">{metrics.completed}</p>
            <p className="text-xs text-green-600 mt-1">{Math.round((metrics.completed/metrics.total)*100)}%</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-400">
          <CardContent className="pt-4">
            <p className="text-xs font-bold text-blue-700">⏳ PROGRESSO</p>
            <p className="text-3xl font-bold text-blue-600">{metrics.inProgress}</p>
            <p className="text-xs text-blue-600 mt-1">Avg: {avgProgress}%</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-400">
          <CardContent className="pt-4">
            <p className="text-xs font-bold text-orange-700">❌ PENDENTE</p>
            <p className="text-3xl font-bold text-orange-600">{metrics.pending}</p>
            <p className="text-xs text-orange-600 mt-1">{Math.round((metrics.pending/metrics.total)*100)}%</p>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-400">
          <CardContent className="pt-4">
            <p className="text-xs font-bold text-red-700">🚨 BLOQUEADO</p>
            <p className="text-3xl font-bold text-red-600">{metrics.blocked}</p>
            <p className="text-xs text-red-600 mt-1">CRÍTICO</p>
          </CardContent>
        </Card>
      </div>

      {/* PROGRESS BAR */}
      <Card>
        <CardContent className="pt-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm font-bold">
              <span>Progresso Geral</span>
              <span>{completion}%</span>
            </div>
            <Progress value={completion} className="h-3" />
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
              {metrics.completed}/{metrics.total} tarefas concluídas • Avg progress: {avgProgress}%
            </p>
          </div>
        </CardContent>
      </Card>

      {/* TASKS BY STATUS */}
      {['blocked', 'in_progress', 'pending', 'completed'].map(status => {
        const statusTasks = tasks.filter(t => t.status === status);
        if (statusTasks.length === 0) return null;

        const statusLabels = {
          blocked: { label: '🚨 BLOQUEADOS', icon: AlertCircle, color: 'border-red-500 bg-red-50 dark:bg-red-950' },
          in_progress: { label: '⏳ EM PROGRESSO', icon: Clock, color: 'border-blue-500 bg-blue-50 dark:bg-blue-950' },
          pending: { label: '❌ PENDENTES', icon: AlertCircle, color: 'border-orange-500 bg-orange-50 dark:bg-orange-950' },
          completed: { label: '✅ CONCLUÍDOS', icon: CheckCircle2, color: 'border-green-500 bg-green-50 dark:bg-green-950' }
        };

        const config = statusLabels[status];
        const Icon = config.icon;

        return (
          <Card key={status} className={`border-2 ${config.color}`}>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Icon className="w-5 h-5" />
                {config.label} ({statusTasks.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {statusTasks.map(task => (
                <div key={task.id} className="border rounded-lg overflow-hidden bg-white dark:bg-slate-800">
                  <button
                    onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
                    className="w-full p-3 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-slate-700 transition"
                  >
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{task.task}</span>
                        <Badge className={getStatusColor(task.status)} className="text-xs">
                          {task.progress}%
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {task.owner} • Deadline: {task.deadline}
                      </p>
                    </div>
                    {expandedTask === task.id ? <ChevronUp /> : <ChevronDown />}
                  </button>

                  {expandedTask === task.id && (
                    <div className="border-t p-3 space-y-3 bg-gray-50 dark:bg-slate-700">
                      <div>
                        <p className="text-sm font-semibold mb-2">Descrição</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{task.description}</p>
                      </div>

                      <div>
                        <p className="text-sm font-semibold mb-2">Progresso: {task.progress}%</p>
                        <Progress value={task.progress} className="h-2" />
                      </div>

                      {task.subtasks && (
                        <div>
                          <p className="text-sm font-semibold mb-2">Subtarefas</p>
                          <div className="space-y-1">
                            {task.subtasks.map((subtask, idx) => (
                              <div key={idx} className="flex items-center gap-2 p-1 bg-white dark:bg-slate-800 rounded">
                                <Checkbox
                                  checked={subtask.done}
                                  onCheckedChange={() => handleSubtaskToggle(task.id, idx)}
                                />
                                <span className={`text-sm ${subtask.done ? 'line-through text-gray-500' : ''}`}>
                                  {subtask.name}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {task.notes && (
                        <div>
                          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">📝 Notas</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{task.notes}</p>
                        </div>
                      )}

                      {task.blockers && (
                        <div className="p-2 bg-red-100 dark:bg-red-800 rounded border border-red-300 dark:border-red-600">
                          <p className="text-sm font-semibold text-red-700 dark:text-red-300">🚨 Bloqueadores</p>
                          <p className="text-sm text-red-600 dark:text-red-200">{task.blockers}</p>
                        </div>
                      )}

                      {task.blockerReason && (
                        <div className="p-2 bg-red-100 dark:bg-red-800 rounded border border-red-300 dark:border-red-600">
                          <p className="text-sm font-semibold text-red-700 dark:text-red-300">⚠️ Razão do Bloqueio</p>
                          <p className="text-sm text-red-600 dark:text-red-200">{task.blockerReason}</p>
                        </div>
                      )}

                      {task.dependencies && (
                        <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded border border-blue-300 dark:border-blue-600">
                          <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">🔗 Dependências</p>
                          <ul className="text-sm text-blue-600 dark:text-blue-200">
                            {task.dependencies.map((dep, idx) => (
                              <li key={idx}>• {dep}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex gap-2 pt-2">
                        {status !== 'completed' && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleTaskUpdate(task.id, { 
                              status: 'completed', 
                              progress: 100 
                            })}
                          >
                            <CheckCircle2 className="w-4 h-4 mr-1" />
                            Marcar Concluído
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleTaskUpdate(task.id, { 
                            status: 'in_progress',
                            progress: Math.min(50, task.progress)
                          })}
                        >
                          <Clock className="w-4 h-4 mr-1" />
                          Iniciar
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}

      {/* FOOTER */}
      <div className="text-xs text-center text-gray-600 dark:text-gray-400 py-4 border-t">
        Painel de Operações • Última atualização: {new Date().toLocaleString('pt-BR')} • Status: EXECUTANDO
      </div>
    </div>
  );
}