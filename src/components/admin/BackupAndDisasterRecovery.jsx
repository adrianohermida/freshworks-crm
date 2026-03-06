import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Zap } from 'lucide-react';

export default function BackupAndDisasterRecovery() {
  const [selectedTest, setSelectedTest] = useState(null);

  const backups = [
    {
      id: 'BACKUP-001',
      type: 'Full Database',
      timestamp: '2026-03-03 02:00 UTC',
      size: '2.4 GB',
      status: 'COMPLETED',
      location: 'AWS S3 (us-east-1 + eu-west-1)',
      rto: '15 minutes',
      rpo: '1 hour'
    },
    {
      id: 'BACKUP-002',
      type: 'Incremental Database',
      timestamp: '2026-03-03 12:00 UTC',
      size: '450 MB',
      status: 'COMPLETED',
      location: 'AWS S3 + Google Cloud Storage',
      rto: '5 minutes',
      rpo: '15 minutes'
    },
    {
      id: 'BACKUP-003',
      type: 'Application Config',
      timestamp: '2026-03-03 18:00 UTC',
      size: '85 MB',
      status: 'IN_PROGRESS',
      location: 'GitHub (encrypted backup)',
      rto: '2 minutes',
      rpo: '1 hour'
    }
  ];

  const drTests = [
    {
      name: 'Restore from S3 Backup',
      lastRun: '2026-02-28 03:00 UTC',
      duration: '18 minutes',
      status: 'PASS',
      result: 'Database restored successfully with full data integrity'
    },
    {
      name: 'Failover to Replica',
      lastRun: '2026-02-21 22:00 UTC',
      duration: '8 minutes',
      status: 'PASS',
      result: 'Traffic successfully routed to secondary region'
    },
    {
      name: 'Config Rollback Test',
      lastRun: '2026-02-14 15:30 UTC',
      duration: '3 minutes',
      status: 'PASS',
      result: 'Application restored from previous configuration version'
    }
  ];

  const singlePoints = [
    { component: 'Primary Database', status: 'PROTECTED', action: 'Primary + 2 Replicas + S3 Backup' },
    { component: 'API Servers', status: 'PROTECTED', action: 'Multi-region load balancing' },
    { component: 'Cache Layer', status: 'PROTECTED', action: 'Redis Cluster + backup snapshots' },
    { component: 'File Storage', status: 'PROTECTED', action: 'S3 with cross-region replication' }
  ];

  const drPlan = [
    { phase: 'Detection', time: '1-2 min', action: 'Automated monitoring alerts' },
    { phase: 'Response', time: '2-5 min', action: 'Incident commander activation' },
    { phase: 'Recovery', time: '5-15 min', action: 'Database restore or replica failover' },
    { phase: 'Validation', time: '10-20 min', action: 'Data integrity checks' },
    { phase: 'Handback', time: '5-10 min', action: 'Switch back to primary' }
  ];

  return (
    <div className="space-y-6">
      {/* KEY METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="pt-6">
            <p className="text-xs text-blue-600">RTO (Objective)</p>
            <p className="text-2xl font-bold">15 min</p>
            <p className="text-xs text-blue-600 mt-1">Recovery time target</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 dark:bg-purple-900/20">
          <CardContent className="pt-6">
            <p className="text-xs text-purple-600">RPO (Objective)</p>
            <p className="text-2xl font-bold">1 hour</p>
            <p className="text-xs text-purple-600 mt-1">Data loss tolerance</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 dark:bg-green-900/20">
          <CardContent className="pt-6">
            <p className="text-xs text-green-600">Last Test</p>
            <p className="text-2xl font-bold">28 Feb</p>
            <p className="text-xs text-green-600 mt-1">✅ PASSED</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 dark:bg-orange-900/20">
          <CardContent className="pt-6">
            <p className="text-xs text-orange-600">Coverage</p>
            <p className="text-2xl font-bold">100%</p>
            <p className="text-xs text-orange-600 mt-1">All critical systems</p>
          </CardContent>
        </Card>
      </div>

      {/* BACKUPS */}
      <Card>
        <CardHeader>
          <CardTitle>💾 Backup Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {backups.map((backup, idx) => (
            <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-sm">{backup.id}: {backup.type}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {backup.timestamp} | Size: {backup.size}
                  </p>
                </div>
                <Badge className={backup.status === 'COMPLETED' ? 'bg-green-600' : 'bg-blue-600'}>
                  {backup.status}
                </Badge>
              </div>
              {backup.status === 'IN_PROGRESS' && (
                <Progress value={75} className="mb-2 h-1.5" />
              )}
              <p className="text-xs text-gray-700 dark:text-gray-300">
                <strong>Location:</strong> {backup.location}
              </p>
              <p className="text-xs text-gray-700 dark:text-gray-300">
                <strong>RTO:</strong> {backup.rto} | <strong>RPO:</strong> {backup.rpo}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* DR TESTS */}
      <Card>
        <CardHeader>
          <CardTitle>🧪 Disaster Recovery Tests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {drTests.map((test, idx) => (
            <div
              key={idx}
              onClick={() => setSelectedTest(selectedTest === idx ? null : idx)}
              className="p-3 bg-gray-50 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{test.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Last: {test.lastRun} | Duration: {test.duration}
                  </p>
                </div>
                <Badge className="bg-green-600">{test.status}</Badge>
              </div>

              {selectedTest === idx && (
                <div className="mt-2 pt-2 border-t border-gray-300 dark:border-gray-600">
                  <p className="text-xs text-gray-700 dark:text-gray-300">{test.result}</p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* SINGLE POINTS OF FAILURE */}
      <Card>
        <CardHeader>
          <CardTitle>🛡️ Single Points of Failure Protection</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {singlePoints.map((item, idx) => (
            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded text-sm">
              <p className="font-semibold">{item.component}</p>
              <div className="flex items-center gap-2">
                <Badge className="bg-green-600" style={{ fontSize: '10px' }}>Protected</Badge>
                <p className="text-xs text-gray-600 dark:text-gray-400">{item.action}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* DR PROCEDURE */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Disaster Recovery Procedure Timeline
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {drPlan.map((step, idx) => (
            <div key={idx} className="p-2 bg-gray-50 dark:bg-gray-700 rounded">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 text-center w-12">
                  <p className="text-xs font-semibold text-cyan-600">{step.time}</p>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{step.phase}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{step.action}</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* STATUS */}
      <Card className="bg-green-50 dark:bg-green-900/20">
        <CardHeader>
          <CardTitle className="text-base text-green-900 dark:text-green-100">
            ✅ DR Status
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-green-900 dark:text-green-100 space-y-1">
          <p>✅ All backups: <strong>AUTOMATED & VERIFIED</strong></p>
          <p>✅ Disaster recovery tests: <strong>PASSING</strong></p>
          <p>✅ RTO/RPO: <strong>WITHIN TARGETS</strong></p>
          <p>✅ Geographic replication: <strong>ACTIVE (3 regions)</strong></p>
          <p>✅ Emergency contacts: <strong>UPDATED</strong></p>
        </CardContent>
      </Card>
    </div>
  );
}