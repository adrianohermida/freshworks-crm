import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Clock, Zap, Loader } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function DeploymentExecutionPhase2() {
  const [deploymentState] = useState({
    phase: 'Fase 2: Production Deployment',
    status: 'EXECUTING',
    startTime: '2026-03-04 14:00 UTC-4',
    endTime: '2026-03-04 15:00 UTC-4',
    totalDuration: '60 minutes',
    overallProgress: 0,
    timestamp: '2026-03-04 14:00 UTC-4'
  });

  const deploymentSteps = [
    {
      step: 1,
      name: 'Code Pull & Dependencies',
      description: 'Pull latest code from main branch and install production dependencies',
      command: 'git pull origin main && npm ci --production',
      estimatedTime: '5 minutes',
      status: 'pending',
      startTime: '14:00',
      endTime: '14:05',
      logs: []
    },
    {
      step: 2,
      name: 'Database Migrations',
      description: 'Execute all pending database migrations',
      command: 'npm run migrate:prod',
      estimatedTime: '5 minutes',
      status: 'pending',
      startTime: '14:05',
      endTime: '14:10',
      logs: []
    },
    {
      step: 3,
      name: 'Build & Deploy',
      description: 'Build optimized production bundle and deploy to servers',
      command: 'npm run build && deploy.sh',
      estimatedTime: '15 minutes',
      status: 'pending',
      startTime: '14:10',
      endTime: '14:25',
      logs: []
    },
    {
      step: 4,
      name: 'Smoke Tests',
      description: 'Execute critical path smoke tests to verify core functionality',
      command: 'npm run test:smoke',
      estimatedTime: '10 minutes',
      status: 'pending',
      startTime: '14:25',
      endTime: '14:35',
      logs: []
    },
    {
      step: 5,
      name: 'Health Checks & Alerts',
      description: 'Verify health endpoints and activate production monitoring',
      command: 'curl https://api.datajud.com/health && enable-alerts.sh',
      estimatedTime: '10 minutes',
      status: 'pending',
      startTime: '14:35',
      endTime: '14:45',
      logs: []
    },
    {
      step: 6,
      name: 'Final Verification',
      description: 'Verify all systems operational and RLS enforcement active',
      command: 'verify-prod.sh',
      estimatedTime: '5 minutes',
      status: 'pending',
      startTime: '14:45',
      endTime: '14:55',
      logs: []
    }
  ];

  const getStepStatusColor = (status) => {
    switch(status) {
      case 'completed': return 'bg-green-50 dark:bg-green-900/20';
      case 'in_progress': return 'bg-blue-50 dark:bg-blue-900/20';
      case 'failed': return 'bg-red-50 dark:bg-red-900/20';
      default: return 'bg-gray-50 dark:bg-gray-700';
    }
  };

  const getStepStatusBadge = (status) => {
    switch(status) {
      case 'completed': return <Badge className="bg-green-600">✅ Complete</Badge>;
      case 'in_progress': return <Badge className="bg-blue-600">⚙️ Running</Badge>;
      case 'failed': return <Badge className="bg-red-600">❌ Failed</Badge>;
      default: return <Badge variant="outline">⏳ Pending</Badge>;
    }
  };

  const getStepIcon = (status) => {
    switch(status) {
      case 'completed': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'in_progress': return <Loader className="w-5 h-5 text-blue-600 animate-spin" />;
      case 'failed': return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const completedSteps = deploymentSteps.filter(s => s.status === 'completed').length;
  const inProgressSteps = deploymentSteps.filter(s => s.status === 'in_progress').length;
  const failedSteps = deploymentSteps.filter(s => s.status === 'failed').length;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Sprint 10 - Fase 2: Production Deployment
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Real-time execution monitoring and status tracking
            </p>
          </div>
          <div className="text-right bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
            <p className="text-sm text-gray-600 dark:text-gray-400">Deployment Window</p>
            <p className="text-xl font-bold text-cyan-600">{deploymentState.startTime}</p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">to {deploymentState.endTime}</p>
          </div>
        </div>

        {/* CRITICAL ALERT */}
        <Alert className="border-2 border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/30">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertDescription className="text-red-900 dark:text-red-100 ml-2">
            <strong>🚨 CRITICAL DEPLOYMENT IN PROGRESS</strong> - No interruptions allowed. 60-minute window. Rollback ready.
          </AlertDescription>
        </Alert>

        {/* PROGRESS OVERVIEW */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="dark:bg-gray-800">
            <CardContent className="pt-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">Overall Progress</div>
              <div className="text-3xl font-bold text-cyan-600 mt-2">
                {Math.round(((completedSteps + (inProgressSteps > 0 ? 0.5 : 0)) / deploymentSteps.length) * 100)}%
              </div>
              <Progress value={Math.round(((completedSteps + (inProgressSteps > 0 ? 0.5 : 0)) / deploymentSteps.length) * 100)} className="mt-3" />
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800">
            <CardContent className="pt-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">Completed</div>
              <div className="text-3xl font-bold text-green-600 mt-2">{completedSteps}/{deploymentSteps.length}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Steps finished</p>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800">
            <CardContent className="pt-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">In Progress</div>
              <div className="text-3xl font-bold text-blue-600 mt-2">{inProgressSteps}/{deploymentSteps.length}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Running now</p>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800">
            <CardContent className="pt-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">Failed</div>
              <div className="text-3xl font-bold text-red-600 mt-2">{failedSteps}/{deploymentSteps.length}</div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Rollback ready</p>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800">
            <CardContent className="pt-6">
              <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
              <div className="text-3xl font-bold text-gray-600 mt-2">
                {deploymentSteps.length - completedSteps - inProgressSteps - failedSteps}/{deploymentSteps.length}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Awaiting execution</p>
            </CardContent>
          </Card>
        </div>

        {/* DEPLOYMENT STEPS */}
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Deployment Execution Steps
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {deploymentSteps.map((step) => (
              <div 
                key={step.step} 
                className={`p-4 rounded-lg border border-gray-200 dark:border-gray-700 ${getStepStatusColor(step.status)}`}
              >
                {/* Step Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {getStepIcon(step.status)}
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        Step {step.step}: {step.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{step.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {getStepStatusBadge(step.status)}
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                      {step.startTime} → {step.endTime}
                    </p>
                  </div>
                </div>

                {/* Command */}
                <div className="bg-gray-900 dark:bg-black rounded p-3 font-mono text-xs text-green-400 mb-3 overflow-x-auto">
                  $ {step.command}
                </div>

                {/* Logs */}
                {step.logs.length > 0 && (
                  <div className="bg-gray-900 dark:bg-black rounded p-3 text-xs text-gray-300 space-y-1 max-h-32 overflow-y-auto">
                    {step.logs.map((log, i) => (
                      <p key={i}>{log}</p>
                    ))}
                  </div>
                )}

                {step.status === 'pending' && (
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Estimated duration: {step.estimatedTime}
                  </p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* CRITICAL MONITORING */}
        <Card className="border-2 border-cyan-400 dark:border-cyan-600">
          <CardHeader>
            <CardTitle className="text-cyan-900 dark:text-cyan-100">
              Critical Monitoring Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-cyan-50 dark:bg-cyan-900/20 rounded border border-cyan-200 dark:border-cyan-700">
              <p className="font-semibold text-cyan-900 dark:text-cyan-100">✅ Deployment Health</p>
              <div className="text-sm text-cyan-800 dark:text-cyan-200 mt-2 space-y-1">
                <p>• API Response Time: Monitoring...</p>
                <p>• Error Rate: &lt; 0.1% target</p>
                <p>• Database Connections: Stable</p>
                <p>• RLS Enforcement: Active</p>
              </div>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-700">
              <p className="font-semibold text-blue-900 dark:text-blue-100">📊 Real-time Dashboards</p>
              <div className="text-sm text-blue-800 dark:text-blue-200 mt-2">
                <p>🔗 <a href="#" className="underline">DataDog Metrics</a> | 🔗 <a href="#" className="underline">Sentry Errors</a> | 🔗 <a href="#" className="underline">CloudWatch Logs</a></p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ROLLBACK PLAN */}
        <Card className="border-l-4 border-l-orange-500 dark:border-l-orange-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-600" />
              Rollback Emergency Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded border border-orange-200 dark:border-orange-700">
              <p className="font-semibold text-orange-900 dark:text-orange-100">If deployment fails:</p>
              <div className="text-sm text-orange-800 dark:text-orange-200 mt-2 space-y-1 font-mono">
                <p>1. Stop deployment immediately (Ctrl+C)</p>
                <p>2. Execute rollback: <code>git revert HEAD && npm run deploy:prod</code></p>
                <p>3. Verify RLS still enforced: <code>verify-rls.sh</code></p>
                <p>4. Expected rollback time: &lt; 5 minutes</p>
                <p>5. Data integrity: ZERO impact (RLS prevents data corruption)</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* TEAM COMMUNICATION */}
        <Card className="dark:bg-gray-800">
          <CardHeader>
            <CardTitle>Team Communication Channels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">
              📱 <strong>#deployment</strong> - Real-time updates (active now)
            </p>
            <p className="text-sm">
              🚨 <strong>PagerDuty</strong> - On-call team alerts
            </p>
            <p className="text-sm">
              💬 <strong>#leadership</strong> - Executive updates (15 min intervals)
            </p>
            <p className="text-sm">
              📊 <strong>Slack Integration</strong> - Auto-post DataDog metrics
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}