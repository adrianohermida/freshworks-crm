import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, AlertCircle, Zap, GitBranch, Target } from 'lucide-react';

export default function SprintSLiveExecution() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  const [sprintStatus] = useState({
    sprintName: 'SPRINT S — Autentique Integration',
    startDate: '2026-03-05',
    endDate: '2026-03-22',
    totalDays: 18,
    daysElapsed: 0,
    daysRemaining: 18,
    globalProgress: 28,
    status: 'INITIATING'
  });

  const [criticalities] = useState([
    {
      date: 'MAR 5 (TODAY)',
      tasks: [
        { id: 'C1', task: '🔴 Autentique API: Cadastro + credenciais', owner: 'Backend', status: 'PENDING', priority: 'CRITICAL' },
        { id: 'C2', task: '🔴 Privacy Policy: Finalizar rascunho', owner: 'Legal', status: 'PENDING', priority: 'CRITICAL' },
        { id: 'C3', task: '🔴 DevOps: Validar TLS 1.3 + certificado SSL', owner: 'DevOps', status: 'PENDING', priority: 'CRITICAL' }
      ]
    },
    {
      date: 'MAR 6-10',
      tasks: [
        { id: 'W1', task: '🟡 Backend: SDK Autentique instalado + HelloWorld', owner: 'Backend', status: 'PENDING', priority: 'HIGH' },
        { id: 'W2', task: '🟡 Backend: SHA512 hash implementado', owner: 'Backend', status: 'PENDING', priority: 'HIGH' },
        { id: 'W3', task: '🟡 Legal: Privacy Policy revisado', owner: 'Legal', status: 'PENDING', priority: 'HIGH' }
      ]
    },
    {
      date: 'MAR 11-22',
      tasks: [
        { id: 'W4', task: '🟢 Backend: Teste assinatura via Autentique', owner: 'Backend', status: 'PENDING', priority: 'HIGH' },
        { id: 'W5', task: '🟢 Backend: SHA3-512 implementado', owner: 'Backend', status: 'PENDING', priority: 'HIGH' },
        { id: 'W6', task: '🟢 Segurança: 2FA TOTP em staging', owner: 'Segurança', status: 'PENDING', priority: 'HIGH' },
        { id: 'W7', task: '🟢 Backend: PDF/A-2B geração iniciada', owner: 'Backend', status: 'PENDING', priority: 'MEDIUM' }
      ]
    }
  ]);

  const [executionLog] = useState([
    {
      timestamp: '2026-03-04 18:00 UTC-4',
      action: 'SPRINT PLANNING COMPLETED',
      details: 'Sprint S roadmap finalized. 6 main tasks, 3 blockers identified.',
      status: 'SUCCESS'
    },
    {
      timestamp: '2026-03-05 08:00 UTC-4',
      action: 'SPRINT INITIATION',
      details: 'Sprint S officially starts. Teams notified. Daily standups scheduled.',
      status: 'PENDING'
    },
    {
      timestamp: '2026-03-05 09:00 UTC-4',
      action: 'AUTENTIQUE INTEGRATION KICKOFF',
      details: 'Backend team starting Autentique API credentials setup.',
      status: 'PENDING'
    },
    {
      timestamp: '2026-03-05 10:00 UTC-4',
      action: 'HASH IMPLEMENTATION START',
      details: 'Backend: SHA512 implementation begins. Target: Mar 10 completion.',
      status: 'PENDING'
    }
  ]);

  const [taskBreakdown] = useState([
    {
      id: 'AUTH-1',
      title: 'Autentique API Integration',
      progress: 0,
      subtasks: [
        { task: 'Create Autentique account', status: 'PENDING', dueDate: 'Mar 5' },
        { task: 'Get API credentials + store securely', status: 'PENDING', dueDate: 'Mar 5' },
        { task: 'Install SDK npm (@autentique/sdk)', status: 'PENDING', dueDate: 'Mar 8' },
        { task: 'HelloWorld test (sign simple document)', status: 'PENDING', dueDate: 'Mar 10' }
      ],
      blockedBy: [],
      owner: 'Backend Lead'
    },
    {
      id: 'AUTH-2',
      title: 'SHA512 + SHA3-512 Hash Generation',
      progress: 0,
      subtasks: [
        { task: 'Implement SHA512 (crypto.node)', status: 'PENDING', dueDate: 'Mar 8' },
        { task: 'Implement SHA3-512 (blake3 lib)', status: 'PENDING', dueDate: 'Mar 10' },
        { task: 'Create audit_hash table', status: 'PENDING', dueDate: 'Mar 10' },
        { task: 'Store hashes immutably', status: 'PENDING', dueDate: 'Mar 15' }
      ],
      blockedBy: [],
      owner: 'Backend Lead'
    },
    {
      id: 'AUTH-3',
      title: 'Privacy Policy + LGPD Compliance',
      progress: 40,
      subtasks: [
        { task: 'Draft Privacy Policy (LGPD requirements)', status: 'DONE', dueDate: 'Mar 3' },
        { task: 'Draft Terms of Use (consentimento coleta)', status: 'IN_PROGRESS', dueDate: 'Mar 8' },
        { task: 'Legal review + adjustments', status: 'PENDING', dueDate: 'Mar 18' },
        { task: 'Mention Autentique in all docs', status: 'PENDING', dueDate: 'Mar 18' }
      ],
      blockedBy: [],
      owner: 'Legal Lead'
    },
    {
      id: 'AUTH-4',
      title: '2FA TOTP + TLS 1.3 Security',
      progress: 50,
      subtasks: [
        { task: 'Verify TLS 1.3 on current cert', status: 'DONE', dueDate: 'Mar 4' },
        { task: 'Implement 2FA TOTP (speakeasy npm)', status: 'IN_PROGRESS', dueDate: 'Mar 15' },
        { task: 'E2E test with QR code', status: 'PENDING', dueDate: 'Mar 20' },
        { task: 'Deploy to staging', status: 'PENDING', dueDate: 'Mar 22' }
      ],
      blockedBy: [],
      owner: 'Security Lead'
    },
    {
      id: 'AUTH-5',
      title: 'PDF/A-2B Generator (ISO 19005-2)',
      progress: 20,
      subtasks: [
        { task: 'Evaluate libraries (pdf-lib, pdfkit)', status: 'PENDING', dueDate: 'Mar 12' },
        { task: 'Implement PDF/A-2B compliance', status: 'PENDING', dueDate: 'Mar 18' },
        { task: 'Embed metadata (forensic data)', status: 'PENDING', dueDate: 'Mar 20' },
        { task: 'Test archival validation', status: 'PENDING', dueDate: 'Mar 22' }
      ],
      blockedBy: ['AUTH-1'],
      owner: 'Backend Lead'
    },
    {
      id: 'AUTH-6',
      title: 'Forensic Metadata Capture (IP, User Agent, DNS, etc)',
      progress: 0,
      subtasks: [
        { task: 'Design metadata schema (BD)', status: 'PENDING', dueDate: 'Mar 8' },
        { task: 'Capture IP + User Agent (backend)', status: 'PENDING', dueDate: 'Mar 15' },
        { task: 'DNS/WHOIS resolution', status: 'PENDING', dueDate: 'Mar 18' },
        { task: 'Timestamp sync (UTC atomic clock)', status: 'PENDING', dueDate: 'Mar 22' }
      ],
      blockedBy: ['AUTH-1'],
      owner: 'Backend + DevOps'
    }
  ]);

  const getStatusColor = (status) => {
    if (status === 'DONE') return 'bg-green-100 text-green-800';
    if (status === 'IN_PROGRESS') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    if (priority === 'CRITICAL') return 'border-red-300 bg-red-50 dark:bg-red-950';
    if (priority === 'HIGH') return 'border-orange-300 bg-orange-50 dark:bg-orange-950';
    return 'border-gray-300 bg-gray-50 dark:bg-gray-900';
  };

  return (
    <div className={`p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Sprint Header */}
        <div className="border-b-2 border-blue-500 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Zap className="w-10 h-10 text-orange-500" />
              {sprintStatus.sprintName}
            </h1>
            <div className="text-right">
              <Badge className="bg-blue-100 text-blue-800 mb-2">
                {sprintStatus.status === 'INITIATING' ? '🔴 INITIATING' : 'ACTIVE'}
              </Badge>
              <p className="text-sm text-gray-600 dark:text-gray-400">{sprintStatus.startDate} — {sprintStatus.endDate}</p>
              <p className="text-lg font-bold text-blue-600">{sprintStatus.daysRemaining} days remaining</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold">Global Progress</span>
                <span className="text-sm text-gray-600">{sprintStatus.globalProgress}%</span>
              </div>
              <Progress value={sprintStatus.globalProgress} className="h-3" />
            </div>
          </div>
        </div>

        {/* Critical Timeline */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Target className="w-6 h-6" />
            Critical Path — Next 18 Days
          </h2>
          {criticalities.map((period, idx) => (
            <Card key={idx} className={`${getPriorityColor(period.tasks[0].priority)} border-2`}>
              <CardHeader>
                <CardTitle className="text-lg">{period.date}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {period.tasks.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-2 rounded bg-white/50 dark:bg-gray-800/50">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{item.task}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{item.owner}</p>
                    </div>
                    <Badge className={getStatusColor(item.status)}>
                      {item.status === 'DONE' ? '✓ Done' : item.status === 'IN_PROGRESS' ? '⏳ In Progress' : '○ Pending'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Detailed Task Breakdown */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <GitBranch className="w-6 h-6" />
            Task Execution Details
          </h2>
          {taskBreakdown.map((task) => (
            <Card key={task.id} className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{task.id}: {task.title}</CardTitle>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Owner: {task.owner}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">{task.progress}%</div>
                    <Progress value={task.progress} className="w-32 mt-2" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {task.blockedBy.length > 0 && (
                  <div className="bg-red-50 dark:bg-red-950 p-3 rounded border border-red-300">
                    <p className="text-sm font-semibold text-red-600">🔴 Blockers: {task.blockedBy.join(', ')}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <p className="text-sm font-semibold">Subtasks:</p>
                  {task.subtasks.map((subtask, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 rounded bg-gray-100 dark:bg-gray-700">
                      <div>
                        <p className="text-sm">{subtask.task}</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Due: {subtask.dueDate}</p>
                      </div>
                      <Badge className={getStatusColor(subtask.status)}>
                        {subtask.status === 'DONE' ? '✓' : subtask.status === 'IN_PROGRESS' ? '⏳' : '○'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Execution Log */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Execution Log
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {executionLog.map((log, idx) => (
              <div key={idx} className="border-l-4 border-gray-400 pl-4 py-2">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">{log.action}</p>
                  <Badge className={log.status === 'SUCCESS' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {log.status}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{log.timestamp}</p>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{log.details}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="border-green-300 bg-green-50 dark:bg-green-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              Summary & Next Steps
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-semibold text-sm mb-2">✅ Completed (Pre-Sprint):</p>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Roadmap finalized (Autentique + 9-week timeline)</li>
                <li>• Teams assigned + roles confirmed</li>
                <li>• Blockers identified (2 dependencies tracked)</li>
                <li>• Daily standup schedule confirmed</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-sm mb-2">🔴 Critical Blockers to Resolve TODAY (Mar 5):</p>
              <ul className="text-sm space-y-1 ml-4">
                <li>• Backend: Autentique account + API credentials</li>
                <li>• Legal: Finalize Privacy Policy mention of Autentique</li>
                <li>• DevOps: Validate TLS 1.3 readiness</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-sm mb-2">🎯 Success Criteria (End of Sprint S — Mar 22):</p>
              <ul className="text-sm space-y-1 ml-4">
                <li>✓ Autentique integration working (test signature)</li>
                <li>✓ Hash functions (SHA512 + SHA3-512) in production</li>
                <li>✓ Legal docs (Privacy Policy + Terms) approved</li>
                <li>✓ Security baseline (2FA + TLS 1.3) deployed</li>
                <li>✓ PDF/A generator in development</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}