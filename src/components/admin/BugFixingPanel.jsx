import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { AlertCircle, CheckCircle2, Clock } from 'lucide-react';

export default function BugFixingPanel() {
  const [bugs, setBugs] = useState([
    {
      id: 'BUG-001',
      title: 'ProcessMovementCapture: Duplicated movements on retry',
      severity: 'CRITICAL',
      status: 'FIXED',
      verified: true,
      description: 'Movements were being duplicated when sync failed and retried.',
      fix: 'Added idempotency check with hash validation before insert'
    },
    {
      id: 'BUG-002',
      title: 'ProcessEnrichmentPanel: Low confidence enrich skipped',
      severity: 'HIGH',
      status: 'FIXED',
      verified: false,
      description: 'Processes with confidence < 50% were not being enriched.',
      fix: 'Adjusted threshold to 30% and added manual override'
    },
    {
      id: 'BUG-003',
      title: 'AdminDashboardv2: Tab navigation lag with 18 tabs',
      severity: 'MEDIUM',
      status: 'IN_PROGRESS',
      verified: false,
      description: 'Tab switching causes 500ms+ delay on slow machines.',
      fix: 'Implement lazy loading and memoization for tab content'
    },
    {
      id: 'BUG-004',
      title: 'DeploymentChecklist: Critical items not blocking deploy',
      severity: 'CRITICAL',
      status: 'PENDING',
      verified: false,
      description: 'User can deploy even with critical items unchecked.',
      fix: 'Add validation to prevent deployment if critical items not completed'
    },
    {
      id: 'BUG-005',
      title: 'MonitoringDashboard: Memory leak in auto-refresh',
      severity: 'HIGH',
      status: 'PENDING',
      verified: false,
      description: 'Long-running monitoring causes increasing memory usage.',
      fix: 'Clean up interval on component unmount and limit history array'
    },
    {
      id: 'BUG-006',
      title: 'DocumentationHub: API examples outdated',
      severity: 'LOW',
      status: 'PENDING',
      verified: false,
      description: 'Some endpoint examples reference old parameter names.',
      fix: 'Update examples to match current API v2.0'
    }
  ]);

  const toggleBugFix = (id) => {
    setBugs(bugs.map(bug =>
      bug.id === id ? { ...bug, verified: !bug.verified } : bug
    ));
  };

  const stats = {
    total: bugs.length,
    fixed: bugs.filter(b => b.status === 'FIXED').length,
    inProgress: bugs.filter(b => b.status === 'IN_PROGRESS').length,
    pending: bugs.filter(b => b.status === 'PENDING').length,
    verified: bugs.filter(b => b.verified && b.status === 'FIXED').length,
    critical: bugs.filter(b => b.severity === 'CRITICAL').length
  };

  const getSeverityColor = (severity) => {
    if (severity === 'CRITICAL') return 'bg-red-600';
    if (severity === 'HIGH') return 'bg-orange-600';
    if (severity === 'MEDIUM') return 'bg-yellow-600';
    return 'bg-blue-600';
  };

  const getStatusIcon = (status) => {
    if (status === 'FIXED') return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    if (status === 'IN_PROGRESS') return <Clock className="w-4 h-4 text-blue-600" />;
    return <AlertCircle className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="space-y-6">
      {/* SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
        <Card className="bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="pt-6">
            <p className="text-xs text-blue-600">Total Issues</p>
            <p className="text-2xl font-bold mt-1">{stats.total}</p>
          </CardContent>
        </Card>

        <Card className="bg-red-50 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <p className="text-xs text-red-600">Critical</p>
            <p className="text-2xl font-bold mt-1">{stats.critical}</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 dark:bg-green-900/20">
          <CardContent className="pt-6">
            <p className="text-xs text-green-600">Fixed</p>
            <p className="text-2xl font-bold mt-1">{stats.fixed}</p>
          </CardContent>
        </Card>

        <Card className="bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="pt-6">
            <p className="text-xs text-blue-600">In Progress</p>
            <p className="text-2xl font-bold mt-1">{stats.inProgress}</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-50 dark:bg-gray-700">
          <CardContent className="pt-6">
            <p className="text-xs text-gray-600">Pending</p>
            <p className="text-2xl font-bold mt-1">{stats.pending}</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 dark:bg-purple-900/20">
          <CardContent className="pt-6">
            <p className="text-xs text-purple-600">Verified</p>
            <p className="text-2xl font-bold mt-1">{stats.verified}/{stats.fixed}</p>
          </CardContent>
        </Card>
      </div>

      {/* CRITICAL ISSUES ALERT */}
      {stats.critical > 0 && (
        <Card className="border-l-4 border-l-red-600 bg-red-50 dark:bg-red-900/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900 dark:text-red-100">
                  {stats.critical} Critical Issue{stats.critical !== 1 ? 's' : ''} Detected
                </p>
                <p className="text-sm text-red-800 dark:text-red-200 mt-1">
                  These must be fixed before next deployment.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* BUG LIST */}
      <Card>
        <CardHeader>
          <CardTitle>🐛 Known Issues & Fixes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {bugs.map(bug => (
            <div key={bug.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
              <div className="flex items-start gap-3">
                {bug.status === 'FIXED' && (
                  <div className="mt-1">
                    <Checkbox
                      checked={bug.verified}
                      onCheckedChange={() => toggleBugFix(bug.id)}
                      className="w-5 h-5"
                    />
                  </div>
                )}
                {bug.status !== 'FIXED' && (
                  <div className="mt-1">
                    {getStatusIcon(bug.status)}
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex items-start gap-2 mb-1">
                    <p className="font-semibold text-sm">{bug.id}: {bug.title}</p>
                    <Badge className={getSeverityColor(bug.severity)} style={{ fontSize: '11px' }}>
                      {bug.severity}
                    </Badge>
                    <Badge className={
                      bug.status === 'FIXED' ? 'bg-green-600' :
                      bug.status === 'IN_PROGRESS' ? 'bg-blue-600' :
                      'bg-gray-600'
                    } style={{ fontSize: '11px' }}>
                      {bug.status}
                    </Badge>
                  </div>

                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">{bug.description}</p>

                  <div className="p-2 bg-white dark:bg-gray-600 rounded text-xs">
                    <p className="font-semibold text-gray-900 dark:text-white mb-1">Fix Applied:</p>
                    <p className="text-gray-700 dark:text-gray-300">{bug.fix}</p>
                  </div>

                  {bug.status === 'FIXED' && bug.verified && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Fix verified in testing
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* RELEASE NOTES */}
      <Card>
        <CardHeader>
          <CardTitle>📝 Release Notes (v1.0.0)</CardTitle>
        </CardHeader>
        <CardContent className="text-sm space-y-2">
          <p><strong>Fixed Issues:</strong></p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-1">
            {bugs.filter(b => b.status === 'FIXED').map(b => (
              <li key={b.id}>{b.title.split(':')[1]?.trim() || b.title}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}