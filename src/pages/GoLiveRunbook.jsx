import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, CheckCircle2, Rocket, Clock } from 'lucide-react';

export default function GoLiveRunbook() {
  const [activePhase, setActivePhase] = useState('pre-launch');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-5xl mx-auto px-4">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Rocket className="w-8 h-8 text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              DataJud Go-Live Runbook
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Procedimentos detalhados para launch de produção GA
          </p>
        </div>

        {/* KEY INFO */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 dark:bg-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">Launch Date</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">2026-03-03</div>
          </Card>
          <Card className="p-4 dark:bg-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
            <div className="text-lg font-bold text-gray-900 dark:text-white">30 minutes</div>
          </Card>
          <Card className="p-4 dark:bg-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">Risk Level</div>
            <div className="text-lg font-bold text-green-600">LOW ✅</div>
          </Card>
          <Card className="p-4 dark:bg-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">Rollback</div>
            <div className="text-lg font-bold text-cyan-600">&lt; 15 min</div>
          </Card>
        </div>

        {/* TIMELINE */}
        <Tabs value={activePhase} onValueChange={setActivePhase} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="pre-launch" className="gap-2">
              <Clock className="w-4 h-4" />
              T-24h
            </TabsTrigger>
            <TabsTrigger value="final-checks">T-1h</TabsTrigger>
            <TabsTrigger value="canary">T-30min</TabsTrigger>
            <TabsTrigger value="rollout">T-10min</TabsTrigger>
            <TabsTrigger value="post-launch">T+24h</TabsTrigger>
          </TabsList>

          {/* T-24h */}
          <TabsContent value="pre-launch" className="space-y-4">
            <Card className="p-6 dark:bg-gray-800">
              <h3 className="font-bold mb-4">PRE-LAUNCH CHECKLIST (T-24h)</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>Final security audit completed</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>Performance tests passed</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>Backups verified</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>DR region synced</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>Monitoring alerting configured</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>Communication templates ready</span>
                </div>
              </div>
            </Card>

            <Alert className="bg-blue-50 dark:bg-blue-900 border-blue-200 dark:border-blue-700">
              <AlertTriangle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-800 dark:text-blue-200">
                Final verification: Admin Panel all green ✅
              </AlertDescription>
            </Alert>
          </TabsContent>

          {/* T-1h */}
          <TabsContent value="final-checks" className="space-y-4">
            <Card className="p-6 dark:bg-gray-800">
              <h3 className="font-bold mb-4">FINAL CHECKS (T-1h)</h3>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold mb-3">Engineering Lead</h4>
                  <ul className="space-y-2 text-sm">
                    <li>✓ Verify Admin Panel all green</li>
                    <li>✓ Confirm backup latest</li>
                    <li>✓ Check database replication lag</li>
                    <li>✓ Verify cache warm</li>
                    <li>✓ DNS verified</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Operations</h4>
                  <ul className="space-y-2 text-sm">
                    <li>✓ Load balancers ready</li>
                    <li>✓ CDN cache purged</li>
                    <li>✓ Monitoring graphs open</li>
                    <li>✓ Slack channels active</li>
                    <li>✓ PagerDuty on-call enabled</li>
                  </ul>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Communications</h4>
                <ul className="space-y-2 text-sm">
                  <li>✓ Update status page: "Maintenance Window"</li>
                  <li>✓ Email: "DataJud GA Launch in 1h"</li>
                  <li>✓ Slack: Notify stakeholders</li>
                </ul>
              </div>
            </Card>
          </TabsContent>

          {/* CANARY */}
          <TabsContent value="canary" className="space-y-4">
            <Card className="p-6 dark:bg-gray-800">
              <h3 className="font-bold mb-4">CANARY DEPLOY (T-30min → T-15min)</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Route 10% traffic to new version. Monitor for 15 minutes.
              </p>

              <div className="space-y-4">
                <div className="bg-cyan-50 dark:bg-cyan-900 border border-cyan-200 dark:border-cyan-700 p-4 rounded">
                  <h4 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-2">
                    Metrics to Monitor
                  </h4>
                  <ul className="text-sm text-cyan-800 dark:text-cyan-200 space-y-1">
                    <li>• HTTP 5xx rate (should be 0%)</li>
                    <li>• Response time (should be &lt;500ms)</li>
                    <li>• Error logs (review for new patterns)</li>
                    <li>• Cache hit rate (should be &gt;75%)</li>
                  </ul>
                </div>

                <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 p-4 rounded">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                    Success Criteria
                  </h4>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    All metrics green for full 15 minutes → Proceed to rollout
                  </p>
                </div>

                <div className="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 p-4 rounded">
                  <h4 className="font-semibold text-red-900 dark:text-red-100 mb-2">
                    If Issue Detected
                  </h4>
                  <ol className="text-sm text-red-800 dark:text-red-200 space-y-1">
                    <li>1. Rollback canary immediately</li>
                    <li>2. Investigate root cause</li>
                    <li>3. Fix in production (hotfix)</li>
                    <li>4. Re-test & re-launch</li>
                  </ol>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* ROLLOUT */}
          <TabsContent value="rollout" className="space-y-4">
            <Card className="p-6 dark:bg-gray-800">
              <h3 className="font-bold mb-4">GRADUAL ROLLOUT (T-15min → T+0)</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900 rounded border border-blue-200 dark:border-blue-700">
                  <div className="w-12 h-12 bg-blue-200 dark:bg-blue-700 rounded flex items-center justify-center font-bold">
                    25%
                  </div>
                  <div>
                    <p className="font-semibold">Route 25% traffic</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Monitor 5 minutes</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900 rounded border border-blue-200 dark:border-blue-700">
                  <div className="w-12 h-12 bg-blue-200 dark:bg-blue-700 rounded flex items-center justify-center font-bold">
                    50%
                  </div>
                  <div>
                    <p className="font-semibold">Route 50% traffic</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Monitor 5 minutes</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900 rounded border border-blue-200 dark:border-blue-700">
                  <div className="w-12 h-12 bg-blue-200 dark:bg-blue-700 rounded flex items-center justify-center font-bold">
                    75%
                  </div>
                  <div>
                    <p className="font-semibold">Route 75% traffic</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Monitor 5 minutes</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900 rounded border border-green-200 dark:border-green-700">
                  <div className="w-12 h-12 bg-green-200 dark:bg-green-700 rounded flex items-center justify-center font-bold">
                    100%
                  </div>
                  <div>
                    <p className="font-semibold">Route 100% traffic</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Continuous monitoring (20 min)</p>
                  </div>
                </div>
              </div>

              <Alert className="bg-green-50 dark:bg-green-900 border-green-200 dark:border-green-700">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Success: No increase in error rate, stable response times, positive user feedback
                </AlertDescription>
              </Alert>
            </Card>
          </TabsContent>

          {/* POST-LAUNCH */}
          <TabsContent value="post-launch" className="space-y-4">
            <Card className="p-6 dark:bg-gray-800">
              <h3 className="font-bold mb-4">POST-LAUNCH (T+24h)</h3>
              
              <div className="bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 p-4 rounded mb-4">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">
                  Success Criteria Checklist
                </h4>
                <ul className="space-y-2 text-sm text-green-800 dark:text-green-200">
                  <li>✅ Zero unplanned downtime</li>
                  <li>✅ Error rate &lt; 1%</li>
                  <li>✅ 99.95% uptime achieved</li>
                  <li>✅ Response times &lt; 500ms (p99)</li>
                  <li>✅ Cache hit rate &gt; 75%</li>
                  <li>✅ User feedback positive</li>
                  <li>✅ No critical bugs</li>
                  <li>✅ All features working</li>
                  <li>✅ Backups completed</li>
                  <li>✅ Monitoring operational</li>
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 p-4 rounded">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  Next Steps
                </h4>
                <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                  <li>• Handoff to Support team</li>
                  <li>• Handoff to Operations</li>
                  <li>• Handoff to Product team</li>
                  <li>• Generate 1-day stability report</li>
                  <li>• Post-mortem (if issues found)</li>
                </ul>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* INCIDENT RESPONSE */}
        <Card className="p-6 dark:bg-gray-800 mt-8">
          <h3 className="font-bold mb-4">INCIDENT RESPONSE</h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="border border-red-200 dark:border-red-700 p-4 rounded">
              <h4 className="font-semibold text-red-700 dark:text-red-400 mb-2">P1 - Critical</h4>
              <p className="text-sm mb-2">Service Down</p>
              <p className="text-sm text-red-600 dark:text-red-400 font-semibold">MTTR: &lt; 5 min</p>
              <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">
                Auto-page oncall. Initiate status page. War room.
              </p>
            </div>

            <div className="border border-orange-200 dark:border-orange-700 p-4 rounded">
              <h4 className="font-semibold text-orange-700 dark:text-orange-400 mb-2">P2 - High</h4>
              <p className="text-sm mb-2">Degraded Service</p>
              <p className="text-sm text-orange-600 dark:text-orange-400 font-semibold">MTTR: &lt; 15 min</p>
              <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">
                Alert + email. Engineering investigates.
              </p>
            </div>

            <div className="border border-yellow-200 dark:border-yellow-700 p-4 rounded">
              <h4 className="font-semibold text-yellow-700 dark:text-yellow-400 mb-2">P3 - Medium</h4>
              <p className="text-sm mb-2">Minor Issue</p>
              <p className="text-sm text-yellow-600 dark:text-yellow-400 font-semibold">MTTR: &lt; 1h</p>
              <p className="text-xs mt-2 text-gray-600 dark:text-gray-400">
                Log issue. Schedule fix. Monitor.
              </p>
            </div>
          </div>
        </Card>

        {/* ROLLBACK */}
        <Alert className="mt-8 bg-red-50 dark:bg-red-900 border-red-200 dark:border-red-700">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            <strong>Rollback Available:</strong> Execute Admin Panel → Backup → Restore in &lt; 15 minutes if needed
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
}