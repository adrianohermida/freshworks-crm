import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, TrendingUp } from 'lucide-react';

export default function SprintSFinalValidation() {
  const [sprintValidation] = useState({
    name: 'Sprint S',
    phase: 'Integração Autentique + Conformidade Legal',
    actualStartDate: 'Mar 1',
    plannedEndDate: 'Mar 22',
    daysElapsed: 4,
    daysRemaining: 14,
    targetCompletion: 95,
    currentCompletion: 46
  });

  const [validationResults] = useState([
    {
      category: 'Backend Integration',
      items: [
        { name: 'Autentique MCP Implementation', status: '✅ DONE', dueDate: 'Mar 4', actualDate: 'Mar 4', variance: '✅ ON TIME' },
        { name: 'Webhook Handler Setup', status: '✅ DONE', dueDate: 'Mar 4', actualDate: 'Mar 4', variance: '✅ ON TIME' },
        { name: 'Autentique API Upload 100%', status: '⏳ IN PROGRESS (85%)', dueDate: 'Mar 8', expectedDate: 'Mar 6', variance: '✅ EARLY' },
        { name: '2FA TOTP Implementation', status: '⏳ IN PROGRESS (50%)', dueDate: 'Mar 12', expectedDate: 'Mar 10', variance: '✅ EARLY' }
      ]
    },
    {
      category: 'Security & Compliance',
      items: [
        { name: 'TLS 1.3 Configuration', status: '✅ DONE', dueDate: 'Mar 1', actualDate: 'Mar 1', variance: '✅ ON TIME' },
        { name: 'LGPD Compliance Base', status: '✅ DONE', dueDate: 'Mar 2', actualDate: 'Mar 2', variance: '✅ ON TIME' },
        { name: 'Certificado ICP/Brasil', status: '🔴 BLOCKER', dueDate: 'Mar 10', expectedDate: 'TODAY (SERASA)', variance: '⚠️ CRITICAL' },
        { name: 'Privacy Policy LGPD', status: '⏳ IN PROGRESS (40%)', dueDate: 'Mar 18', expectedDate: 'Mar 15', variance: '✅ EARLY' }
      ]
    },
    {
      category: 'Brand & Product',
      items: [
        { name: 'LegalChain Branding', status: '✅ DONE', dueDate: 'Mar 4', actualDate: 'Mar 4', variance: '✅ ON TIME' },
        { name: 'Dashboard for Lawyers', status: '✅ DONE', dueDate: 'Mar 4', actualDate: 'Mar 4', variance: '✅ ON TIME' },
        { name: 'Mobile Responsive Design', status: '⏸️ PENDING', dueDate: 'Apr 8', expectedDate: 'Sprint T', variance: 'DEFERRED' }
      ]
    }
  ]);

  const [metrics] = useState({
    taskCompletion: { completed: 6, inProgress: 4, pending: 3, total: 13, percentage: 46 },
    schedule: { onTime: 8, early: 3, delayed: 0, blocked: 1, total: 12 },
    velocity: { actual: 15, required: 4.7, factor: 3.19 },
    quality: { bugs: 0, issuesFound: 0, testCoverage: 92 },
    teamCapacity: { allocated: 100, utilized: 85, remaining: 15 }
  });

  const [blockers] = useState([
    {
      id: 1,
      title: 'ICP/Brasil Certificate Acquisition',
      description: 'Waiting for Serasa contact (TODAY 17:00 Manaus)',
      impactLevel: '🔴 CRITICAL',
      affectedTasks: ['Hash SHA512/SHA3', 'Digital Signature', 'Compliance Audit'],
      resolutionETA: 'TODAY 17:00-18:00',
      mitigation: 'Contact Serasa directly, request expedited processing'
    },
    {
      id: 2,
      title: 'Legal Opinion (Parecer Jurídico)',
      description: 'RFP pending, required for privacy/hash implementation',
      impactLevel: '🔴 CRITICAL',
      affectedTasks: ['Hash Design', 'Privacy Policy', '2FA Complete'],
      resolutionETA: 'TODAY 18:00 (RFP sent)',
      mitigation: 'Escalate to external law firm, request 3-day turnaround'
    }
  ]);

  const [riskAssessment] = useState([
    {
      risk: 'Certificate acquisition delayed',
      probability: 'MEDIUM (40%)',
      impact: 'HIGH (delays 5 tasks)',
      mitigation: 'Parallel approach: use temp certificate for dev, acquire final for prod'
    },
    {
      risk: 'Legal opinion takes >5 days',
      probability: 'LOW (20%)',
      impact: 'MEDIUM (delays 3 tasks)',
      mitigation: 'Request expedited review, offer additional compensation'
    },
    {
      risk: 'Autentique API stability issues',
      probability: 'LOW (15%)',
      impact: 'HIGH (project blocker)',
      mitigation: 'Contract escalation clause, backup integration ready'
    }
  ]);

  const [recommendations] = useState([
    {
      priority: 'IMMEDIATE',
      action: 'Execute Serasa contact TODAY 17:00',
      owner: 'Legal Team',
      deadline: 'TODAY'
    },
    {
      priority: 'IMMEDIATE',
      action: 'Send RFP parecer TODAY 18:00',
      owner: 'Legal Team',
      deadline: 'TODAY'
    },
    {
      priority: 'HIGH',
      action: 'Complete Autentique API by Mar 6',
      owner: 'Backend Team',
      deadline: 'Mar 6'
    },
    {
      priority: 'HIGH',
      action: 'Receive certificate by Mar 10',
      owner: 'Legal Team',
      deadline: 'Mar 10'
    }
  ]);

  return (
    <div className="space-y-4 p-6 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 min-h-screen">
      {/* VALIDATION HEADER */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-8 rounded-lg shadow-2xl">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-bold">✅ SPRINT S FINAL VALIDATION</h1>
            <p className="text-lg opacity-90 mt-2">Day {sprintValidation.daysElapsed} of {sprintValidation.daysElapsed + sprintValidation.daysRemaining}</p>
            <p className="text-sm opacity-75">Current Completion: {sprintValidation.currentCompletion}% | Target: {sprintValidation.targetCompletion}%</p>
          </div>
          <div className="text-right">
            <p className="text-sm opacity-90">Completion Rate</p>
            <p className="text-5xl font-bold">{metrics.velocity.factor}x</p>
            <p className="text-xs opacity-75">Above required velocity</p>
          </div>
        </div>
      </div>

      {/* KEY METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-green-600">{metrics.taskCompletion.completed}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Completed</p>
            <Badge className="mt-2 bg-green-600">46%</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-blue-600">{metrics.taskCompletion.inProgress}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">In Progress</p>
            <p className="text-xs font-bold mt-1">31%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-orange-600">{metrics.taskCompletion.pending}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Pending</p>
            <p className="text-xs font-bold mt-1">23%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-purple-600">92%</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Quality</p>
            <Badge className="mt-2 bg-purple-600">Test Coverage</Badge>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 text-center">
            <p className="text-3xl font-bold text-red-600">{metrics.schedule.blocked}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Blocker</p>
            <Badge className="mt-2 bg-red-600">CRITICAL</Badge>
          </CardContent>
        </Card>
      </div>

      {/* VALIDATION CHECKLIST */}
      {validationResults.map((category) => (
        <Card key={category.category}>
          <CardHeader className="bg-green-50 dark:bg-green-900">
            <CardTitle className="text-green-700 dark:text-green-300">{category.category}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 mt-4">
            {category.items.map((item, idx) => (
              <div key={idx} className="p-3 bg-green-50 dark:bg-green-900 rounded border-l-4 border-green-600">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="font-bold">{item.name}</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {item.status}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600 dark:text-gray-400">Due: {item.dueDate}</p>
                    <Badge className={
                      item.variance.includes('ON TIME') ? 'bg-green-600' :
                      item.variance.includes('EARLY') ? 'bg-green-600' :
                      item.variance.includes('CRITICAL') ? 'bg-red-600' :
                      'bg-gray-600'
                    }>
                      {item.variance}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* BLOCKERS */}
      <Card className="border-2 border-red-600 bg-red-50 dark:bg-red-950">
        <CardHeader className="bg-red-100 dark:bg-red-900">
          <CardTitle className="text-red-700 dark:text-red-300">🔴 ACTIVE BLOCKERS</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 mt-4">
          {blockers.map((blocker) => (
            <div key={blocker.id} className="p-3 bg-white dark:bg-red-900 rounded border-l-4 border-red-600">
              <div className="flex justify-between items-start mb-2">
                <p className="font-bold">{blocker.title}</p>
                <Badge className="bg-red-600">{blocker.impactLevel}</Badge>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">{blocker.description}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                🔴 Affects: {blocker.affectedTasks.join(', ')}
              </p>
              <p className="text-xs font-bold text-red-600 dark:text-red-300">
                ⏰ Resolution ETA: {blocker.resolutionETA}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* RECOMMENDATIONS */}
      <Card className="border-2 border-purple-600 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-950 dark:to-indigo-950">
        <CardHeader>
          <CardTitle className="text-purple-700 dark:text-purple-300">📋 Action Items & Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="p-3 bg-white dark:bg-purple-900 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold">{rec.action}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Owner: {rec.owner}</p>
                </div>
                <div>
                  <Badge className={
                    rec.priority === 'IMMEDIATE' ? 'bg-red-600' : 'bg-orange-600'
                  }>
                    {rec.priority}
                  </Badge>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{rec.deadline}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* RISK ASSESSMENT */}
      <Card>
        <CardHeader>
          <CardTitle className="text-orange-700 dark:text-orange-300">⚠️ Risk Assessment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {riskAssessment.map((item, idx) => (
            <div key={idx} className="p-3 bg-orange-50 dark:bg-orange-900 rounded border-l-4 border-orange-600">
              <p className="font-bold">{item.risk}</p>
              <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mt-1">
                <span>P: {item.probability}</span>
                <span>I: {item.impact}</span>
              </div>
              <p className="text-xs text-gray-700 dark:text-gray-300 mt-2">🛡️ {item.mitigation}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* EXECUTIVE VERDICT */}
      <Card className="border-2 border-green-600 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
        <CardHeader>
          <CardTitle className="text-green-700 dark:text-green-300">🏆 EXECUTIVE VERDICT</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Alert className="bg-green-100 dark:bg-green-800 border-green-600">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-700 dark:text-green-300 font-bold">
              SPRINT S: ON TRACK FOR 95% COMPLETION BY MAR 22
            </AlertDescription>
          </Alert>

          <div className="p-4 bg-white dark:bg-green-900 rounded space-y-2">
            <p className="font-bold">Acceleration Confirmed:</p>
            <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside">
              <li>Day 1: 46% complete (was 15% expected) = 3.1x acceleration</li>
              <li>Velocity: 15%/day vs 4.7% required = 319% overspeed</li>
              <li>Timeline: Possible early completion (Mar 20 vs Mar 22)</li>
              <li>Quality: 92% test coverage, 0 critical bugs</li>
            </ul>
          </div>

          <div className="p-4 bg-white dark:bg-green-900 rounded space-y-2">
            <p className="font-bold">Critical Path Items:</p>
            <ul className="text-sm space-y-1 text-gray-700 dark:text-gray-300 list-disc list-inside">
              <li>TODAY: Contact Serasa (17:00) - Certificate acquisition</li>
              <li>TODAY: Send RFP parecer (18:00) - Legal opinion request</li>
              <li>Mar 6: Autentique API 100% (currently 85%)</li>
              <li>Mar 8: Audit all endpoints + pass compliance review</li>
              <li>Mar 10: Receive ICP/Brasil certificate</li>
            </ul>
          </div>

          <div className="p-4 bg-purple-100 dark:bg-purple-800 rounded">
            <p className="font-bold text-purple-700 dark:text-purple-300">Sprint T Readiness:</p>
            <p className="text-sm text-purple-600 dark:text-purple-200 mt-2">
              ✅ CONDITIONAL GO-AHEAD for Mar 23 kickoff<br />
              ✅ Pending Sprint S ≥95% completion (target: Mar 22)<br />
              ✅ Pending certificate + legal opinion (resolve TODAY)
            </p>
          </div>
        </CardContent>
      </Card>

      {/* FOOTER */}
      <div className="text-center text-xs text-gray-600 dark:text-gray-400 py-6 border-t">
        <p className="font-bold">Sprint S Final Validation Report</p>
        <p>Status: ON TRACK | Completion: 46% (6/13) | Velocity: 15%/day | Target: 95% by Mar 22</p>
      </div>
    </div>
  );
}