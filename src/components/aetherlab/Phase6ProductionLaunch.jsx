import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Server, Globe, Zap, TrendingUp, Users } from 'lucide-react';
import { useI18n } from '@/components/i18nManager';
import { useTenant } from '@/components/TenantContext';

export default function Phase6ProductionLaunch() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const { t } = useI18n();
  const { tenantId } = useTenant();

  const deploymentChecklist = [
    {
      region: '🇧🇷 Brasil',
      status: 'SCHEDULED',
      scheduledDate: 'MAR 4, 08:00 UTC-3',
      expectedDuration: '90 min',
      teams: ['DevOps BR', 'SRE BR', 'Support BR'],
      rollbackPlan: '✓ Tested',
      completionTarget: '09:30 UTC-3'
    },
    {
      region: '🇺🇸 USA',
      status: 'SCHEDULED',
      scheduledDate: 'MAR 4, 14:00 UTC-4',
      expectedDuration: '90 min',
      teams: ['DevOps US', 'SRE US', 'Support US'],
      rollbackPlan: '✓ Tested',
      completionTarget: '15:30 UTC-4'
    },
    {
      region: '🌍 Europa',
      status: 'SCHEDULED',
      scheduledDate: 'MAR 4, 19:00 UTC+0',
      expectedDuration: '90 min',
      teams: ['DevOps EU', 'SRE EU', 'Support EU'],
      rollbackPlan: '✓ Tested',
      completionTarget: '20:30 UTC+0'
    }
  ];

  const launchChecks = [
    { item: 'Production DB Migration', status: 'done', owner: 'DevOps' },
    { item: 'SSL Certificates Updated', status: 'done', owner: 'Security' },
    { item: 'DNS Records Configured', status: 'done', owner: 'DevOps' },
    { item: 'Load Balancer Setup', status: 'done', owner: 'DevOps' },
    { item: 'Monitoring & Alerting Active', status: 'done', owner: 'SRE' },
    { item: 'Support Team Trained', status: 'done', owner: 'Support' },
    { item: 'Incident Runbooks Ready', status: 'done', owner: 'SRE' },
    { item: 'Customer Communications Sent', status: 'pending', owner: 'Marketing' },
    { item: 'Sales Enablement Materials', status: 'pending', owner: 'Sales' },
    { item: 'Analytics Tracking Configured', status: 'pending', owner: 'Analytics' }
  ];

  const doneCount = launchChecks.filter(c => c.status === 'done').length;
  const readiness = Math.round((doneCount / launchChecks.length) * 100);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <section className={`p-8 rounded-lg border-2 ${isDark ? 'bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-green-700' : 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-500'}`}>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold flex items-center gap-2">
              <Globe className="w-10 h-10 text-green-600" />
              🌐 Phase 6: Production Launch
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              MAR 4, 2026 | Simultaneous deployment in 3 regions
            </p>
            <Badge className="bg-green-600 px-4 py-2">LAUNCH READINESS: {readiness}%</Badge>
          </div>
        </section>

        {/* READINESS METER */}
        <Card className={`${isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-400'} border-2`}>
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-bold">Overall Launch Readiness</span>
                <span className="text-2xl font-bold text-green-600">{readiness}%</span>
              </div>
              <Progress value={readiness} className="h-4" />
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {doneCount} of {launchChecks.length} critical items completed
              </p>
            </div>
          </CardContent>
        </Card>

        {/* DEPLOYMENT SCHEDULE */}
        <section>
          <h2 className="text-2xl font-bold mb-4">📅 Deployment Timeline (MAR 4)</h2>
          <div className="space-y-4">
            {deploymentChecklist.map((deploy, idx) => (
              <Card key={idx} className={`border-2 ${isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-400'}`}>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-bold text-lg mb-3">{deploy.region}</h3>
                      <div className="space-y-2 text-sm">
                        <div>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Scheduled</p>
                          <p className="font-semibold">{deploy.scheduledDate}</p>
                        </div>
                        <div>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Expected Duration</p>
                          <p className="font-semibold">{deploy.expectedDuration}</p>
                        </div>
                        <div>
                          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Target Completion</p>
                          <p className="font-semibold text-green-600">{deploy.completionTarget}</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="mb-3">
                        <p className="text-xs font-semibold mb-2">Deployment Teams</p>
                        <div className="space-y-1">
                          {deploy.teams.map((team, i) => (
                            <div key={i} className="flex items-center gap-2 text-sm">
                              <Users className="w-3 h-3 text-blue-600" />
                              <span>{team}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                        <span className="text-sm font-semibold">Rollback Plan {deploy.rollbackPlan}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* PRE-LAUNCH CHECKLIST */}
        <section>
          <h2 className="text-2xl font-bold mb-4">✓ Pre-Launch Checklist</h2>
          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="pt-6 space-y-2">
              {launchChecks.map((check, idx) => (
                <div key={idx} className={`p-3 rounded-lg flex items-start justify-between ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <div className="flex items-start gap-3 flex-1">
                    {check.status === 'done' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-semibold">{check.item}</p>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{check.owner}</p>
                    </div>
                  </div>
                  <Badge className={check.status === 'done' ? 'bg-green-600' : 'bg-yellow-600'}>
                    {check.status === 'done' ? '✓ DONE' : '⏳ PENDING'}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* KEY METRICS */}
        <section>
          <h2 className="text-2xl font-bold mb-4">📊 Launch Day Targets</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { label: 'Customer Logins', target: '100+', color: 'text-blue-600' },
              { label: 'Documents Signed', target: '50+', color: 'text-green-600' },
              { label: 'Revenue Generated', target: '$100K+', color: 'text-emerald-600' },
              { label: 'Support Tickets', target: '<10', color: 'text-purple-600' }
            ].map((metric, idx) => (
              <Card key={idx} className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardContent className="pt-6 text-center">
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{metric.label}</p>
                  <p className={`text-3xl font-bold mt-2 ${metric.color}`}>{metric.target}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* INCIDENT RESPONSE */}
        <Card className={`${isDark ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-400'} border-2`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              🚨 Incident Response Protocol
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="font-semibold mb-2">Escalation Levels:</p>
              <ul className="space-y-1 text-sm">
                <li>🔴 <strong>Severity 1:</strong> All systems down → CEO notified immediately</li>
                <li>🟠 <strong>Severity 2:</strong> Major feature down → VP Engineering notified</li>
                <li>🟡 <strong>Severity 3:</strong> Minor issue → Team lead informed</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-2">Contacts On-Duty (MAR 4):</p>
              <p className="text-sm">SRE Lead: +55-92-98765-4321 | Support Lead: +55-92-98765-4322 | CTO: +55-92-98765-4323</p>
            </div>
          </CardContent>
        </Card>

        {/* SUCCESS CRITERIA */}
        <Card className={`${isDark ? 'bg-gradient-to-r from-green-900/60 to-emerald-900/60 border-green-600' : 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-500'} border-2`}>
          <CardContent className="pt-8 space-y-4">
            <h3 className="text-2xl font-bold">✅ Launch Success Criteria</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>All 3 regions operational by 21:00 UTC</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>Zero critical incidents during launch window</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>99.99% uptime achieved by end of day</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>First 100+ customers onboarded</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <span>$100K+ revenue validated</span>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}