import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle2, AlertCircle, Zap, Target, TrendingUp, PlayCircle, Clock } from 'lucide-react';

export default function SprintExecutorDecision() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const [activeTab, setActiveTab] = useState('decision');

  // CONSOLIDATED SPRINT DATA
  const consolidatedMetrics = {
    projectTotal: 62.5,
    tasksCompleted: 25,
    totalTasks: 40,
    sprint5Current: 48,
    sprint5Target: 85,
    daysRemaining: 4,
    phasesComplete: 5,
    phasesPlanned: 1,
    projectDeadline: 'May 26, 2026'
  };

  // SPRINT 5 COMPLETION ANALYSIS
  const sprint5Analysis = {
    completedPhases: 4,
    completedDeliverables: 5,
    pendingTasks: 7,
    criticalPath: 5,
    achievedProgress: '48%',
    requiredProgress: '85%',
    gapToBridge: '37%',
    hoursNeeded: 120
  };

  // FINAL DECISION CRITERIA
  const decisionCriteria = [
    { criterion: 'Go-to-Market Launch (4 regions)', status: 'pending', impact: 'CRITICAL', required: 'Mar 7' },
    { criterion: 'Certifications (SOC2 + ISO27001)', status: 'pending', impact: 'CRITICAL', required: 'Mar 7' },
    { criterion: 'Enterprise Partnerships Pipeline', status: 'pending', impact: 'HIGH', required: 'Mar 7' },
    { criterion: 'i18n Implementation Complete', status: 'pending', impact: 'MEDIUM', required: 'Mar 14' },
    { criterion: 'Multi-Region Deployment Live', status: 'pending', impact: 'MEDIUM', required: 'Mar 21' }
  ];

  // PHASE 6 FEATURES (NEXT SPRINT)
  const phase6Features = [
    { id: 1, name: 'AI Document Analysis Engine', weeks: 4, priority: 'CRITICAL', dependsOn: 'Core' },
    { id: 2, name: 'Native Mobile App (iOS + Android)', weeks: 8, priority: 'CRITICAL', dependsOn: 'Core' },
    { id: 3, name: 'Zapier + Make Integrations', weeks: 4, priority: 'HIGH', dependsOn: 'AI' },
    { id: 4, name: 'Advanced Webhooks System', weeks: 4, priority: 'HIGH', dependsOn: 'Core' },
    { id: 5, name: 'PDF Reports + Analytics Export', weeks: 6, priority: 'MEDIUM', dependsOn: 'AI' },
    { id: 6, name: 'REST API v2 + GraphQL', weeks: 5, priority: 'HIGH', dependsOn: 'Core' },
    { id: 7, name: 'ML Forecasting Models', weeks: 6, priority: 'MEDIUM', dependsOn: 'Analytics' },
    { id: 8, name: 'Security Audit + Launch', weeks: 6, priority: 'CRITICAL', dependsOn: 'All' }
  ];

  // RESOURCE ALLOCATION
  const resourceAllocation = [
    { team: 'Frontend', sprint5: '5 devs', phase6: '8 devs', focus: 'Mobile + UI/UX Improvements' },
    { team: 'Backend', sprint5: '4 devs', phase6: '6 devs', focus: 'API v2 + AI Integration' },
    { team: 'DevOps', sprint5: '2 ops', phase6: '3 ops', focus: 'Multi-region + Security' },
    { team: 'Marketing', sprint5: '3 marketers', phase6: '2 marketers', focus: 'GTM Execution' },
    { team: 'Product', sprint5: '2 PMs', phase6: '2 PMs', focus: 'Phase 6 Roadmap' }
  ];

  // TIMELINE
  const phase6Timeline = [
    { week: 'Week 1 (Mar 10-14)', focus: 'Architecture & Setup', tasks: 'AI engine design, Mobile scaffold, API v2 planning' },
    { week: 'Week 2-3 (Mar 17-28)', focus: 'Core Development', tasks: 'AI MVP, Mobile basic flow, API endpoints' },
    { week: 'Week 4-6 (Mar 31-Apr 18)', focus: 'Integrations & Features', tasks: 'Zapier/Make, Webhooks, PDF export' },
    { week: 'Week 7-8 (Apr 21-May 2)', focus: 'Analytics & ML', tasks: 'ML models, Advanced analytics, Forecasting' },
    { week: 'Week 9-10 (May 5-26)', focus: 'Security & Launch', tasks: 'Security audit, Load testing, Production launch' }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* EXECUTIVE DECISION BANNER */}
        <section className={`p-8 rounded-lg border-2 ${isDark ? 'bg-gradient-to-r from-blue-900/60 to-purple-900/60 border-blue-600' : 'bg-gradient-to-r from-blue-100 to-purple-100 border-blue-600'}`}>
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-2">
            <Target className="w-10 h-10" />
            🎯 SPRINT EXECUTOR - FINAL DECISION & NEXT SPRINT PLANNING
          </h1>
          <p className={`text-lg mb-6 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Sprint 5 Status: <strong>{consolidatedMetrics.sprint5Current}%</strong> | Target: <strong>{consolidatedMetrics.sprint5Target}%</strong> | 
            Project Total: <strong>{consolidatedMetrics.projectTotal}%</strong> | Days Left: <strong>{consolidatedMetrics.daysRemaining}</strong>
          </p>
          
          <div className="grid md:grid-cols-5 gap-4">
            <div className="p-4 rounded-lg bg-opacity-50 text-center">
              <p className="text-3xl font-bold text-green-600">{consolidatedMetrics.tasksCompleted}</p>
              <p className="text-sm mt-1">Tasks Done</p>
            </div>
            <div className="p-4 rounded-lg bg-opacity-50 text-center">
              <p className="text-3xl font-bold text-orange-600">7</p>
              <p className="text-sm mt-1">Pending</p>
            </div>
            <div className="p-4 rounded-lg bg-opacity-50 text-center">
              <p className="text-3xl font-bold text-purple-600">8</p>
              <p className="text-sm mt-1">Phase 6</p>
            </div>
            <div className="p-4 rounded-lg bg-opacity-50 text-center">
              <p className="text-3xl font-bold text-blue-600">62.5%</p>
              <p className="text-sm mt-1">Project Done</p>
            </div>
            <div className="p-4 rounded-lg bg-opacity-50 text-center">
              <p className="text-3xl font-bold text-red-600">84d</p>
              <p className="text-sm mt-1">Until Launch</p>
            </div>
          </div>
        </section>

        {/* MAIN TABS */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-6">
            <TabsTrigger value="decision">🎯 Decision</TabsTrigger>
            <TabsTrigger value="review">✅ Review</TabsTrigger>
            <TabsTrigger value="phase6">🚀 Phase 6</TabsTrigger>
            <TabsTrigger value="resources">👥 Resources</TabsTrigger>
            <TabsTrigger value="timeline">📅 Timeline</TabsTrigger>
          </TabsList>

          {/* TAB 1: GO/NO-GO DECISION */}
          <TabsContent value="decision" className="space-y-6">
            <Card className={`border-2 ${isDark ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-400'}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                  🔴 CURRENT STATUS: DECISION PENDING
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-bold mb-4">Decision Criteria Validation (As of Mar 3):</h4>
                  <div className="space-y-3">
                    {decisionCriteria.map((item, idx) => (
                      <div key={idx} className={`p-4 rounded-lg border-2 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold">{item.criterion}</span>
                          <div className="flex gap-2">
                            <Badge className={item.impact === 'CRITICAL' ? 'bg-red-600' : 'bg-orange-600'}>
                              {item.impact}
                            </Badge>
                            <Badge className="bg-gray-600">{item.status}</Badge>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Deadline: {item.required}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={`p-6 rounded-lg border-2 ${isDark ? 'bg-yellow-900/30 border-yellow-700' : 'bg-yellow-100 border-yellow-500'}`}>
                  <h4 className="font-bold text-lg mb-3">⚠️ DECISION LOGIC</h4>
                  <div className={`space-y-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                    <p><strong>IF</strong> Sprint 5 achieves 85% by Mar 7 EOD:</p>
                    <p className="ml-4">→ ✅ Phase 6 GO (Mar 10 kickoff confirmed)</p>
                    <p className="ml-4">→ 📅 Timeline: Mar 10 - May 26 (10 weeks)</p>
                    <p className="ml-4">→ 🎯 Launch: Q1 2027 maintained</p>
                    <br />
                    <p><strong>IF</strong> Sprint 5 &lt; 85% by Mar 7 EOD:</p>
                    <p className="ml-4">→ ❌ Phase 6 DELAYED (push to Mar 17)</p>
                    <p className="ml-4">→ 📅 Timeline: Mar 17 - Jun 2 (9 weeks)</p>
                    <p className="ml-4">→ ⚠️ Launch: Q2 2027 risk</p>
                  </div>
                </div>

                <div className={`p-6 rounded-lg ${isDark ? 'bg-gradient-to-r from-blue-900/60 to-purple-900/60 border-2 border-blue-600' : 'bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-600'}`}>
                  <h4 className="font-bold text-lg mb-3">📊 CURRENT TRAJECTORY</h4>
                  <div className={`space-y-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                    <p>Sprint 5: <strong>48%</strong> (current) → <strong>85%</strong> (target)</p>
                    <p>Gap: <strong>37%</strong> in <strong>4 days</strong></p>
                    <p>Effort: <strong>~120 hours</strong> team-wide</p>
                    <p>Status: <strong>ACHIEVABLE</strong> with full team focus (Mar 3-7)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: SPRINT 5 REVIEW */}
          <TabsContent value="review" className="space-y-6">
            <Card className={`border-2 ${isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-400'}`}>
              <CardHeader>
                <CardTitle>✅ Sprint 5 COMPLETED Items</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-bold mb-3">Phases Complete (4 of 4):</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-opacity-50 rounded border">
                      <span>Phase 1: Stabilization</span>
                      <Badge className="bg-green-600">5/5 tasks</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-opacity-50 rounded border">
                      <span>Phase 2: Optimization</span>
                      <Badge className="bg-green-600">6/6 tasks</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-opacity-50 rounded border">
                      <span>Phase 3: Roadmap v3.1</span>
                      <Badge className="bg-green-600">5/5 tasks</Badge>
                    </div>
                    <div className="flex items-center justify-between p-2 bg-opacity-50 rounded border">
                      <span>Phase 4: Growth & Dominance</span>
                      <Badge className="bg-green-600">4/4 tasks</Badge>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-bold mb-3">Sprint 5 Deliverables Complete (5 of 5):</h4>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span>🌐 i18n Manager (5 languages)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span>📋 Regional Compliance Matrix</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span>🌍 Global Support Hub 24/7</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span>🎨 Design Refactor (Minimalist)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span>🚀 Multi-Region Deployment Setup</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Total Progress:</strong> 25 tasks complete | Project: 62.5%
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className={`border-2 ${isDark ? 'bg-orange-900/20 border-orange-700' : 'bg-orange-50 border-orange-400'}`}>
              <CardHeader>
                <CardTitle>⏳ Sprint 5 PENDING Items (7 tasks)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  {[
                    { name: 'Go-to-Market Regional', pct: 45, critical: true },
                    { name: 'Certifications Tracker', pct: 50, critical: true },
                    { name: 'Enterprise Partnerships', pct: 25, critical: false },
                    { name: 'i18n All Pages', pct: 40, critical: false },
                    { name: 'Multi-Region AWS', pct: 30, critical: false }
                  ].map((item, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-opacity-50 border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{item.name}</span>
                        {item.critical && <Badge className="bg-red-600 text-xs">CRITICAL</Badge>}
                      </div>
                      <Progress value={item.pct} className="h-2" />
                      <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">{item.pct}% → 100%</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: PHASE 6 FEATURES */}
          <TabsContent value="phase6" className="space-y-6">
            <Card className={`border-2 ${isDark ? 'bg-purple-900/20 border-purple-700' : 'bg-purple-50 border-purple-400'}`}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PlayCircle className="w-6 h-6 text-purple-600" />
                  🚀 Phase 6: Premium Features (IF GO Mar 7)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {phase6Features.map((feature) => (
                    <Card key={feature.id} className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
                      <CardContent className="pt-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <p className="font-bold">{feature.id}. {feature.name}</p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{feature.weeks} weeks</p>
                          </div>
                          <Badge className={feature.priority === 'CRITICAL' ? 'bg-red-600' : 'bg-orange-600'}>
                            {feature.priority}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Depends: {feature.dependsOn}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="pt-4 border-t">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>Total Duration:</strong> 10 weeks (Mar 10 - May 26) | <strong>Launch:</strong> May 26 (Q2 2026 / Early Q1 2027)
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: RESOURCE ALLOCATION */}
          <TabsContent value="resources" className="space-y-6">
            <Card className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
              <CardHeader>
                <CardTitle>👥 Team Allocation: Sprint 5 → Phase 6</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {resourceAllocation.map((resource, idx) => (
                  <div key={idx} className="p-4 rounded-lg border">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold">{resource.team}</h4>
                      <div className="text-right">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Sprint 5: {resource.sprint5}</p>
                        <p className="text-xs font-bold text-green-600">Phase 6: {resource.phase6}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">Focus: {resource.focus}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className={`border-2 ${isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-400'}`}>
              <CardContent className="pt-6 space-y-3">
                <h4 className="font-bold">Team Capacity Summary:</h4>
                <div className={`space-y-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                  <p>✓ Total team: ~20 people across 5 departments</p>
                  <p>✓ Phase 6 allocation: +5 additional resources (30% increase)</p>
                  <p>✓ Project manager: 1 dedicated PM per 4 devs</p>
                  <p>✓ Overlap period: Mar 3-7 (Sprint 5 completion + Phase 6 prep)</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 5: TIMELINE */}
          <TabsContent value="timeline" className="space-y-6">
            <Card className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-6 h-6" />
                  📅 Phase 6 Execution Timeline (10 weeks)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {phase6Timeline.map((period, idx) => (
                  <div key={idx} className={`p-4 rounded-lg border-2 ${idx === 0 ? isDark ? 'bg-green-900/30 border-green-700' : 'bg-green-100 border-green-500' : isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
                    <h4 className="font-bold mb-2">{period.week}</h4>
                    <p className="text-sm mb-1"><strong>Focus:</strong> {period.focus}</p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{period.tasks}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className={`border-2 ${isDark ? 'bg-gradient-to-r from-purple-900/60 to-blue-900/60 border-purple-600' : 'bg-gradient-to-r from-purple-100 to-blue-100 border-purple-600'}`}>
              <CardContent className="pt-6 space-y-4">
                <h4 className="font-bold text-lg">🎯 Critical Path & Milestones</h4>
                <div className={`space-y-2 text-sm ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                  <p>✓ <strong>Mar 10:</strong> Phase 6 Kickoff (if Sprint 5 = 85%)</p>
                  <p>✓ <strong>Mar 24:</strong> Integrations Sprint (Zapier/Make)</p>
                  <p>✓ <strong>Apr 7:</strong> API v2 + Analytics Release</p>
                  <p>✓ <strong>Apr 21:</strong> ML Models + Advanced Features</p>
                  <p>✓ <strong>May 5:</strong> Security Audit Begins</p>
                  <p>✓ <strong>May 26:</strong> Production Launch Ready</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* FINAL SUMMARY */}
        <Card className={`border-2 ${isDark ? 'bg-gradient-to-r from-indigo-900/60 to-pink-900/60 border-indigo-600' : 'bg-gradient-to-r from-indigo-100 to-pink-100 border-indigo-600'}`}>
          <CardContent className="pt-8 space-y-6">
            <h3 className="text-3xl font-bold">📋 SPRINT EXECUTOR FINAL SUMMARY</h3>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-bold mb-3">✅ ACCOMPLISHED</h4>
                <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                  <li>• 25/40 tasks done</li>
                  <li>• 4 phases complete</li>
                  <li>• 62.5% project done</li>
                  <li>• Design 100% refactored</li>
                  <li>• Foundation solid</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-3">⏳ PENDING (4 DAYS)</h4>
                <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                  <li>• GTM Regional (45%)</li>
                  <li>• Certifications (50%)</li>
                  <li>• Partnerships (25%)</li>
                  <li>• i18n Pages (40%)</li>
                  <li>• Multi-region (30%)</li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-3">🎯 NEXT (PHASE 6)</h4>
                <ul className={`text-sm space-y-1 ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>
                  <li>• 8 premium features</li>
                  <li>• 10-week sprint</li>
                  <li>• Mar 10 kickoff (if GO)</li>
                  <li>• May 26 launch</li>
                  <li>• Q1 2027 final target</li>
                </ul>
              </div>
            </div>

            <div className={`border-t pt-6 ${isDark ? 'border-indigo-700' : 'border-indigo-500'}`}>
              <p className="text-lg font-bold mb-3">🎯 EXECUTOR MANDATE FOR PHASE 6:</p>
              <p className={`${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
                <strong>1. Achieve 85% Sprint 5 by Mar 7 EOD</strong><br />
                <strong>2. Validate all deliverables in production</strong><br />
                <strong>3. Launch Phase 6 kickoff meeting Mar 10</strong><br />
                <strong>4. Maintain May 26 launch timeline</strong><br />
                <strong>5. Report weekly on Phase 6 progress</strong>
              </p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}