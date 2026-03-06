import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle, Clock, Zap, Play, CheckSquare } from 'lucide-react';

export default function Sprint11Execution() {
  const [activeTask, setActiveTask] = useState(null);
  const [completedTasks, setCompletedTasks] = useState(0);

  const sprintData = {
    number: 11,
    status: 'EXECUTING',
    startDate: '2026-03-10',
    currentDate: '2026-03-04',
    progressDays: 0,
    totalDays: 14,
    theme: 'SECURITY FINALIZATION & STABILITY',
    storyPoints: {
      total: 32,
      completed: 0,
      inProgress: 0
    }
  };

  const tasksByPhase = [
    {
      phase: 'PHASE 1: CARRYOVER COMPLETION (5 days)',
      tasks: [
        {
          id: 's10-carry-1',
          title: 'Rate Limiting Tests',
          pts: 1,
          status: 'READY',
          assignee: 'Executor',
          dueDate: '03/11',
          function: 'rateLimiterTests.js'
        },
        {
          id: 's10-carry-2',
          title: 'Encryption Key Rotation',
          pts: 2,
          status: 'READY',
          assignee: 'Executor',
          dueDate: '03/12',
          function: 'encryptionKeyRotation.js'
        },
        {
          id: 's10-carry-3',
          title: 'LGPD Audit Trail Finalization',
          pts: 3,
          status: 'READY',
          assignee: 'Executor',
          dueDate: '03/14',
          function: 'lgpdAuditTrailFinals.js'
        }
      ]
    },
    {
      phase: 'PHASE 2: NEW SECURITY FEATURES (5 days)',
      tasks: [
        {
          id: 's11-new-1',
          title: 'CORS Protection Implementation',
          pts: 2,
          status: 'PLANNED',
          dueDate: '03/15'
        },
        {
          id: 's11-new-2',
          title: 'Rate Limiter Middleware Tests',
          pts: 3,
          status: 'PLANNED',
          dueDate: '03/17'
        },
        {
          id: 's11-new-3',
          title: 'Field Encryption for Sensitive Data',
          pts: 5,
          status: 'PLANNED',
          dueDate: '03/19'
        }
      ]
    },
    {
      phase: 'PHASE 3: TESTING & VALIDATION (4 days)',
      tasks: [
        {
          id: 's11-test-1',
          title: 'E2E Security Tests Suite',
          pts: 8,
          status: 'PLANNED',
          dueDate: '03/21'
        },
        {
          id: 's11-test-2',
          title: 'Load Testing (100K+ concurrent)',
          pts: 4,
          status: 'PLANNED',
          dueDate: '03/22'
        },
        {
          id: 's11-test-3',
          title: 'Database Query Performance Tests',
          pts: 2,
          status: 'PLANNED',
          dueDate: '03/22'
        },
        {
          id: 's11-test-4',
          title: 'Cache Strategy Validation',
          pts: 1,
          status: 'PLANNED',
          dueDate: '03/23'
        }
      ]
    }
  ];

  const handleStartTask = (taskId) => {
    setActiveTask(taskId);
  };

  const handleCompleteTask = (taskId) => {
    setCompletedTasks(prev => prev + 1);
    setActiveTask(null);
  };

  const currentCompletion = (completedTasks / 32) * 100;

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="border-b pb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Sprint 11 Execution Board</h1>
            <p className="text-gray-600 mt-1">Live Progress • Day 0/14 • 3 Phases</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-purple-600">{currentCompletion.toFixed(0)}%</div>
            <p className="text-sm text-gray-600">{completedTasks}/32 pts</p>
          </div>
        </div>
      </div>

      {/* Overall Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Sprint Completion</span>
                <span className="text-sm font-bold">{currentCompletion.toFixed(0)}%</span>
              </div>
              <Progress value={currentCompletion} className="h-3" />
            </div>
            <div className="grid grid-cols-3 gap-4 text-center pt-4">
              <div>
                <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                <p className="text-xs text-gray-600">Completed</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">{sprintData.storyPoints.total}</div>
                <p className="text-xs text-gray-600">Total Points</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-yellow-600">{sprintData.storyPoints.total - completedTasks}</div>
                <p className="text-xs text-gray-600">Remaining</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Phases */}
      {tasksByPhase.map((phaseGroup, phaseIdx) => (
        <Card key={phaseIdx}>
          <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
            <CardTitle className="text-lg">{phaseGroup.phase}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-3">
              {phaseGroup.tasks.map((task, taskIdx) => (
                <div
                  key={task.id}
                  className={`p-4 border rounded-lg transition-all ${
                    task.status === 'READY'
                      ? 'bg-blue-50 border-blue-300 cursor-pointer hover:shadow-md'
                      : task.status === 'COMPLETED'
                      ? 'bg-green-50 border-green-300'
                      : 'bg-gray-50 border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {task.status === 'COMPLETED' ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600" />
                        ) : task.status === 'READY' ? (
                          <Play className="w-5 h-5 text-blue-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-gray-400" />
                        )}
                        <span className="font-medium">{task.title}</span>
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {task.function && `Function: ${task.function}`}
                        {task.dueDate && ` • Due: ${task.dueDate}`}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <span className="text-sm font-bold text-purple-600">{task.pts}pts</span>
                      {task.status === 'READY' && (
                        <Button
                          onClick={() => handleStartTask(task.id)}
                          size="sm"
                          variant="default"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          Start
                        </Button>
                      )}
                      {activeTask === task.id && (
                        <Button
                          onClick={() => handleCompleteTask(task.id)}
                          size="sm"
                          variant="default"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          ✓ Complete
                        </Button>
                      )}
                    </div>
                  </div>
                  {activeTask === task.id && (
                    <div className="mt-3 pt-3 border-t text-xs text-gray-600">
                      <div className="animate-pulse">
                        Executing: {task.title} • Validate completion above
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Success Criteria */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <CheckSquare className="w-5 h-5" />
            Sprint 11 Success Criteria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>100% auth endpoints with RBAC validated</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Encryption on all sensitive data (LGPD-ready)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Rate limiting working (50 req/min)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Load test: 100K+ concurrent (p99 &lt; 500ms)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>E2E tests: 90%+ coverage</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Zero security vulnerabilities (OWASP)</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Project Status */}
      <Alert className="border-blue-200 bg-blue-50">
        <AlertCircle className="w-4 h-4 text-blue-700" />
        <AlertDescription className="text-blue-900">
          <strong>Project Status After Sprint 11:</strong> 92% completude. Only Sprint 12 (Growth & Scaling) + Sprint 13 (Final Polish) remain. ETA: March 26, 2026.
        </AlertDescription>
      </Alert>
    </div>
  );
}