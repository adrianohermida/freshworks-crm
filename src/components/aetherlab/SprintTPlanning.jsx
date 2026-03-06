import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Target } from 'lucide-react';

export default function SprintTPlanning() {
  const [sprintS] = useState({
    name: 'Sprint S',
    status: 'IN PROGRESS',
    completionTarget: 95,
    currentCompletion: 46,
    endDate: 'Mar 22',
    daysRemaining: 18,
    velocity: 15
  });

  const [sprintT] = useState({
    name: 'Sprint T',
    phase: 'Conformidade Total + Infrastructure Scaling',
    startDate: 'Mar 23',
    endDate: 'Apr 10',
    totalDays: 19,
    status: 'READY - Pending Sprint S Validation',
    targetCompletion: 100
  });

  const [dependenciesFromS] = useState([
    {
      id: 1,
      name: 'Certificado ICP/Brasil',
      status: 'BLOCKER',
      requiredFor: ['Hash SHA512/SHA3', 'Assinatura Digital', 'Compliance Audit'],
      deadline: 'Mar 10',
      riskLevel: 'CRÍTICO'
    },
    {
      id: 2,
      name: 'Autentique API 100%',
      status: 'IN PROGRESS (85%)',
      requiredFor: ['PDF/A-2B Generator', 'Document Verification'],
      deadline: 'Mar 8',
      riskLevel: 'ALTO'
    },
    {
      id: 3,
      name: 'Parecer Jurídico',
      status: 'PENDING RFP (TODAY)',
      requiredFor: ['Privacy Policy', 'Compliance Framework'],
      deadline: 'Mar 15',
      riskLevel: 'ALTO'
    }
  ]);

  const [sprintTTasks] = useState([
    {
      id: 1,
      name: 'Multi-Tenant Isolation 100%',
      category: 'Infrastructure',
      prerequisite: 'Autentique API 100% (Mar 8)',
      deadline: 'Mar 30',
      team: 'Backend',
      storyPoints: 13,
      priority: 'CRITICAL'
    },
    {
      id: 2,
      name: 'Payment Processing Stripe',
      category: 'Payments',
      prerequisite: 'None',
      deadline: 'Apr 5',
      team: 'Backend',
      storyPoints: 8,
      priority: 'HIGH'
    },
    {
      id: 3,
      name: 'Email Notifications SMTP',
      category: 'Notifications',
      prerequisite: 'Multi-Tenant (Mar 30)',
      deadline: 'Apr 3',
      team: 'Backend',
      storyPoints: 5,
      priority: 'MEDIUM'
    },
    {
      id: 4,
      name: 'Mobile Responsive Design',
      category: 'Frontend',
      prerequisite: 'None',
      deadline: 'Apr 8',
      team: 'Frontend',
      storyPoints: 8,
      priority: 'HIGH'
    },
    {
      id: 5,
      name: 'Advanced Audit Logs',
      category: 'Compliance',
      prerequisite: 'Parecer Jurídico (Mar 15)',
      deadline: 'Apr 2',
      team: 'Backend',
      storyPoints: 5,
      priority: 'HIGH'
    },
    {
      id: 6,
      name: 'Disaster Recovery Plan',
      category: 'Infrastructure',
      prerequisite: 'Multi-Tenant (Mar 30)',
      deadline: 'Apr 10',
      team: 'DevOps',
      storyPoints: 13,
      priority: 'CRITICAL'
    },
    {
      id: 7,
      name: 'Performance Monitoring',
      category: 'Monitoring',
      prerequisite: 'None',
      deadline: 'Mar 28',
      team: 'DevOps',
      storyPoints: 5,
      priority: 'MEDIUM'
    },
    {
      id: 8,
      name: 'Documentation Complete',
      category: 'Documentation',
      prerequisite: 'All technical tasks',
      deadline: 'Apr 9',
      team: 'Tech Writer',
      storyPoints: 8,
      priority: 'HIGH'
    }
  ]);

  const [readinessChecklist] = useState([
    {
      item: 'Sprint S ≥ 95% complete',
      status: 'IN PROGRESS',
      dueDate: 'Mar 22',
      critical: true
    },
    {
      item: 'Certificado ICP/Brasil in hand',
      status: 'PENDING',
      dueDate: 'Mar 10',
      critical: true
    },
    {
      item: 'Autentique API 100%',
      status: 'IN PROGRESS (85%)',
      dueDate: 'Mar 8',
      critical: true
    },
    {
      item: 'Architecture review cleared',
      status: 'PENDING',
      dueDate: 'Mar 21',
      critical: false
    },
    {
      item: 'Team allocated & ready',
      status: 'READY',
      dueDate: 'Mar 23',
      critical: false
    }
  ]);

  const totalStoryPoints = sprintTTasks.reduce((sum, task) => sum + task.storyPoints, 0);
  const criticalTasks = sprintTTasks.filter(t => t.priority === 'CRITICAL').length;

  return (
    <div className="space-y-4 p-6 bg-gradient-to-br from-indigo-50 to-purple-100 dark:from-indigo-950 dark:to-purple-900 min-h-screen">
      {/* SPRINT TRANSITION HEADER */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-8 rounded-lg shadow-2xl">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold">📋 SPRINT T PLANNING</h1>
            <p className="text-lg opacity-90 mt-2">Conformidade Total + Infrastructure Scaling</p>
            <p className="text-sm opacity-75">Status: Ready to kickoff (pending Sprint S validation)</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Scheduled Start</p>
            <p className="text-3xl font-bold">Mar 23</p>
            <Badge className="mt-2 bg-yellow-500">CONDITIONAL</Badge>
          </div>
        </div>
      </div>

      {/* SPRINT S COMPLETION CHECK */}
      <Card className="border-2 border-orange-600 bg-orange-50 dark:bg-orange-950">
        <CardHeader className="bg-orange-100 dark:bg-orange-900">
          <CardTitle className="text-orange-700 dark:text-orange-300">🔄 Sprint S Transition Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 bg-white dark:bg-orange-900 rounded text-center">
              <p className="text-2xl font-bold text-orange-600">{sprintS.currentCompletion}%</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Current</p>
            </div>
            <div className="p-3 bg-white dark:bg-orange-900 rounded text-center">
              <p className="text-2xl font-bold text-orange-600">{sprintS.completionTarget}%</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Target</p>
            </div>
            <div className="p-3 bg-white dark:bg-orange-900 rounded text-center">
              <p className="text-2xl font-bold text-orange-600">{sprintS.daysRemaining}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Days Left</p>
            </div>
            <div className="p-3 bg-white dark:bg-orange-900 rounded text-center">
              <p className="text-2xl font-bold text-orange-600">{sprintS.velocity}%</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Velocity</p>
            </div>
          </div>

          <Alert className="bg-yellow-100 dark:bg-yellow-800 border-yellow-600">
            <AlertCircle className="h-4 w-4 text-yellow-700 dark:text-yellow-300" />
            <AlertDescription className="text-yellow-700 dark:text-yellow-300">
              Sprint T can only kickoff when Sprint S reaches ≥95% completion (target: Mar 22)
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* CRITICAL DEPENDENCIES FROM SPRINT S */}
      <Card className="border-2 border-red-600">
        <CardHeader className="bg-red-50 dark:bg-red-900">
          <CardTitle className="text-red-700 dark:text-red-300">🔗 Critical Dependencies (Sprint S → Sprint T)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 mt-4">
          {dependenciesFromS.map((dep) => (
            <div key={dep.id} className="p-3 bg-red-50 dark:bg-red-900 rounded border-l-4 border-red-600">
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold">{dep.name}</p>
                <Badge className={
                  dep.status === 'BLOCKER' ? 'bg-red-600' : 'bg-orange-600'
                }>
                  {dep.status}
                </Badge>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                Required for: {dep.requiredFor.join(', ')}
              </p>
              <div className="flex justify-between text-xs">
                <span>Deadline: {dep.deadline}</span>
                <span className="font-bold text-red-600">Risk: {dep.riskLevel}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* SPRINT T TASKS */}
      <Card>
        <CardHeader className="bg-indigo-50 dark:bg-indigo-900">
          <CardTitle className="text-indigo-700 dark:text-indigo-300">
            📝 Sprint T Backlog ({sprintTTasks.length} tasks, {totalStoryPoints} pts)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 mt-4">
          {sprintTTasks.map((task) => (
            <div key={task.id} className="p-3 bg-indigo-50 dark:bg-indigo-900 rounded border-l-4 border-indigo-600">
              <div className="flex justify-between items-start mb-1">
                <p className="font-bold">{task.name}</p>
                <Badge className={
                  task.priority === 'CRITICAL' ? 'bg-red-600' :
                  task.priority === 'HIGH' ? 'bg-orange-600' :
                  'bg-blue-600'
                }>
                  {task.priority} ({task.storyPoints} pts)
                </Badge>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                {task.category} | {task.team}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                ⬅️ Prereq: {task.prerequisite || 'None'} | 📅 {task.deadline}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* READINESS CHECKLIST */}
      <Card className="border-2 border-green-600">
        <CardHeader className="bg-green-50 dark:bg-green-900">
          <CardTitle className="text-green-700 dark:text-green-300">✅ Sprint T Readiness Checklist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 mt-4">
          {readinessChecklist.map((check, idx) => (
            <div key={idx} className="p-3 bg-white dark:bg-green-900 rounded flex justify-between items-center">
              <div>
                <p className="font-semibold">{check.item}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Due: {check.dueDate}</p>
              </div>
              <div className="flex items-center gap-2">
                {check.critical && <Badge className="bg-red-600">CRITICAL</Badge>}
                <Badge className={
                  check.status === 'READY' ? 'bg-green-600' :
                  check.status === 'IN PROGRESS' ? 'bg-blue-600' :
                  'bg-gray-600'
                }>
                  {check.status}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* CRITICAL PATH */}
      <Card className="border-2 border-purple-600 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950">
        <CardHeader>
          <CardTitle className="text-purple-700 dark:text-purple-300">🎯 Sprint T Critical Path</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="p-3 bg-white dark:bg-purple-900 rounded">
            <p className="font-bold mb-2">Week 1 (Mar 23-29): Foundation</p>
            <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside">
              <li>Multi-Tenant Isolation kickoff</li>
              <li>Performance Monitoring setup</li>
              <li>Payment Stripe integration start</li>
            </ul>
          </div>
          <div className="p-3 bg-white dark:bg-purple-900 rounded">
            <p className="font-bold mb-2">Week 2 (Mar 30-Apr 5): Integration</p>
            <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside">
              <li>Multi-Tenant 100% completion</li>
              <li>Email Notifications SMTP</li>
              <li>Disaster Recovery planning</li>
              <li>Payment Processing 100%</li>
            </ul>
          </div>
          <div className="p-3 bg-white dark:bg-purple-900 rounded">
            <p className="font-bold mb-2">Week 3 (Apr 6-10): Polish & Docs</p>
            <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside">
              <li>Mobile Responsive refinements</li>
              <li>Documentation completion</li>
              <li>Final testing & validation</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* VELOCITY PROJECTION */}
      <Card>
        <CardHeader>
          <CardTitle className="text-indigo-700 dark:text-indigo-300">📊 Sprint T Velocity Projection</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900 rounded text-center">
              <p className="text-lg font-bold text-indigo-600">{totalStoryPoints}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Total Story Points</p>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900 rounded text-center">
              <p className="text-lg font-bold text-indigo-600">{criticalTasks}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Critical Tasks</p>
            </div>
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900 rounded text-center">
              <p className="text-lg font-bold text-indigo-600">{totalStoryPoints / 19}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">Points/Day Target</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FOOTER */}
      <div className="text-center text-xs text-gray-600 dark:text-gray-400 py-6 border-t">
        <p className="font-bold">Sprint T Planning Dashboard</p>
        <p>Kickoff: Mar 23 (conditional) | Duration: 19 days | Target: 100% completion by Apr 10</p>
        <p className="mt-2 opacity-75">Depends on Sprint S ≥95% by Mar 22</p>
      </div>
    </div>
  );
}