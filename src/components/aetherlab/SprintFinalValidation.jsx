import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle, Clock, Zap, CheckSquare } from 'lucide-react';

export default function SprintFinalValidation() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  
  const [completionStatus, setCompletionStatus] = useState({
    gtm: 0,
    certs: 0,
    partners: 0,
    i18n: 0,
    multiregion: 0
  });

  const [completedDeliverables, setCompletedDeliverables] = useState({
    gtm: [],
    certs: [],
    partners: [],
    i18n: [],
    multiregion: []
  });

  const taskData = {
    gtm: {
      name: '🌍 Go-to-Market Regional',
      targetCompletion: 100,
      priority: 'CRITICAL',
      daysLeft: 4,
      team: 'Marketing + Product',
      deliverables: [
        'Brasil market page (copy + visuals)',
        'Europe market page (compliance focus)',
        'USA market page (enterprise messaging)',
        'LATAM consolidated strategy'
      ]
    },
    certs: {
      name: '🏆 Certifications Tracker',
      targetCompletion: 100,
      priority: 'HIGH',
      daysLeft: 5,
      team: 'Backend + DevOps',
      deliverables: [
        'SOC 2 Type II automation setup',
        'ISO 27001 tracking dashboard',
        'GDPR compliance checkpoints',
        'Email notifications + status updates'
      ]
    },
    partners: {
      name: '🤝 Enterprise Partnerships',
      targetCompletion: 100,
      priority: 'HIGH',
      daysLeft: 7,
      team: 'Sales + BD',
      deliverables: [
        'Partnership pipeline dashboard',
        'Lead scoring automation',
        'Integration readiness checklist'
      ]
    },
    i18n: {
      name: '🌐 i18n Integration (all pages)',
      targetCompletion: 100,
      priority: 'MEDIUM',
      daysLeft: 10,
      team: 'Frontend',
      deliverables: [
        'Home page translations',
        'Pricing page i18n',
        'Dashboard translations (5 languages)',
        'RTL layout fixes'
      ]
    },
    multiregion: {
      name: '🚀 Multi-region AWS deployment',
      targetCompletion: 100,
      priority: 'MEDIUM',
      daysLeft: 14,
      team: 'DevOps + Infrastructure',
      deliverables: [
        'US-East infrastructure setup',
        'EU-West infrastructure setup',
        'BR-South infrastructure setup',
        'CDN + Load balancing configuration'
      ]
    }
  };

  const toggleDeliverable = (taskId, index) => {
    setCompletedDeliverables(prev => ({
      ...prev,
      [taskId]: prev[taskId].includes(index)
        ? prev[taskId].filter(i => i !== index)
        : [...prev[taskId], index]
    }));
    
    // Update completion percentage
    const maxDeliverables = taskData[taskId].deliverables.length;
    const newCompleted = prev => ({
      ...prev,
      [taskId]: prev[taskId].includes(index)
        ? prev[taskId].filter(i => i !== index)
        : [...prev[taskId], index]
    });
    const updatedCompleted = newCompleted(completedDeliverables);
    const newPercentage = Math.round((updatedCompleted[taskId].length / maxDeliverables) * 100);
    
    setCompletionStatus(prev => ({
      ...prev,
      [taskId]: newPercentage
    }));
  };

  const overallCompletion = Math.round(
    (completionStatus.gtm + completionStatus.certs + completionStatus.partners + completionStatus.i18n + completionStatus.multiregion) / 5
  );

  const sprintTarget = 85;
  const achievedTarget = overallCompletion >= sprintTarget;

  const taskIds = ['gtm', 'certs', 'partners', 'i18n', 'multiregion'];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* LIVE EXECUTION HEADER */}
        <section className={`p-8 rounded-lg border-2 ${achievedTarget ? isDark ? 'bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-green-700' : 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-400' : isDark ? 'bg-gradient-to-r from-red-900/40 to-orange-900/40 border-red-700' : 'bg-gradient-to-r from-red-100 to-orange-100 border-red-400'}`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold flex items-center gap-2">
                {achievedTarget ? <CheckCircle2 className="w-10 h-10 text-green-600" /> : <AlertCircle className="w-10 h-10 text-red-600 animate-pulse" />}
                {achievedTarget ? '✅ SPRINT 5 VALIDATION & PHASE 6 GO' : '🔴 SPRINT 5 FINAL PUSH - LIVE TRACKING'}
              </h1>
              <div className="text-right">
                <p className={`text-4xl font-bold ${achievedTarget ? 'text-green-600' : 'text-orange-600'}`}>
                  {overallCompletion}%
                </p>
                <p className="text-sm">Target: {sprintTarget}%</p>
              </div>
            </div>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              {achievedTarget 
                ? '✅ SPRINT 5 COMPLETE - Phase 6 Kickoff APPROVED for Mar 10' 
                : `🔴 Still need ${sprintTarget - overallCompletion}% | ${4} days to deadline`}
            </p>
          </div>
        </section>

        {/* TASK COMPLETION TRACKER */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Clock className="w-6 h-6" />
            📋 Real-Time Task Completion Tracker
          </h2>

          {taskIds.map((taskId) => {
            const task = taskData[taskId];
            const completion = completionStatus[taskId];
            const isComplete = completion === 100;
            const deliverables = task.deliverables;
            const completedCount = completedDeliverables[taskId].length;

            return (
              <Card 
                key={taskId}
                className={`border-2 ${
                  isComplete
                    ? isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-400'
                    : completion >= 75
                    ? isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-400'
                    : isDark ? 'bg-orange-900/20 border-orange-700' : 'bg-orange-50 border-orange-400'
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="mb-2">{task.name}</CardTitle>
                      <div className="flex gap-2 flex-wrap">
                        <Badge className={task.priority === 'CRITICAL' ? 'bg-red-600' : task.priority === 'HIGH' ? 'bg-orange-600' : 'bg-blue-600'}>
                          {task.priority}
                        </Badge>
                        <Badge className="bg-gray-600">{task.daysLeft}d</Badge>
                        <Badge className="bg-purple-600">{task.team}</Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-orange-600">{completion}%</p>
                      <p className="text-xs">({completedCount}/{deliverables.length} deliverables)</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={completion} className="h-3" />
                  
                  <div className="space-y-2">
                    <h4 className="font-bold">Deliverables ({completedCount}/{deliverables.length}):</h4>
                    {deliverables.map((deliverable, idx) => {
                      const isChecked = completedDeliverables[taskId].includes(idx);
                      return (
                        <div
                          key={idx}
                          onClick={() => toggleDeliverable(taskId, idx)}
                          className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
                            isChecked
                              ? isDark ? 'bg-green-900/30' : 'bg-green-100'
                              : isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          <div className={`w-6 h-6 rounded border-2 flex items-center justify-center ${
                            isChecked ? 'bg-green-600 border-green-600' : 'border-gray-400'
                          }`}>
                            {isChecked && <CheckSquare className="w-4 h-4 text-white" />}
                          </div>
                          <span className={isChecked ? 'line-through text-gray-500' : ''}>{deliverable}</span>
                          {isChecked && <CheckCircle2 className="w-4 h-4 text-green-600 ml-auto" />}
                        </div>
                      );
                    })}
                  </div>

                  <div className="pt-3 border-t border-gray-300 dark:border-gray-700">
                    <p className={`text-sm font-semibold ${isComplete ? 'text-green-600' : 'text-orange-600'}`}>
                      {isComplete ? '✅ COMPLETE - Ready for production' : `${completedCount} of ${deliverables.length} deliverables completed`}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* OVERALL STATUS */}
        <Card className={`border-2 ${achievedTarget ? isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-400' : isDark ? 'bg-orange-900/20 border-orange-700' : 'bg-orange-50 border-orange-400'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-6 h-6" />
              📊 Sprint 5 Overall Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="font-bold text-lg">Sprint 5 Completion</span>
                <span className="text-3xl font-bold">{overallCompletion}%</span>
              </div>
              <Progress value={overallCompletion} className="h-4" />
              <p className="text-xs mt-2">Target: {sprintTarget}% | {achievedTarget ? '✅ TARGET ACHIEVED' : `Need +${sprintTarget - overallCompletion}%`}</p>
            </div>

            <div className="grid md:grid-cols-5 gap-3">
              {taskIds.map((taskId) => (
                <div key={taskId} className={`p-3 rounded-lg border text-center ${
                  completionStatus[taskId] === 100
                    ? isDark ? 'bg-green-900/30 border-green-700' : 'bg-green-100 border-green-500'
                    : isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-100 border-gray-300'
                }`}>
                  <p className="text-2xl font-bold">{completionStatus[taskId]}%</p>
                  <p className="text-xs mt-1">{taskData[taskId].name.split(' ')[0]}</p>
                  {completionStatus[taskId] === 100 && <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto mt-1" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* DECISION GATE */}
        <Card className={`border-2 ${achievedTarget ? isDark ? 'bg-gradient-to-r from-green-900/60 to-emerald-900/60 border-green-600' : 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-600' : isDark ? 'bg-gradient-to-r from-red-900/60 to-orange-900/60 border-red-600' : 'bg-gradient-to-r from-red-100 to-orange-100 border-red-600'}`}>
          <CardContent className="pt-8 space-y-6">
            <h3 className="text-3xl font-bold">
              {achievedTarget ? '✅ SPRINT 5 COMPLETE - PHASE 6 GO DECISION' : '🔴 SPRINT 5 IN PROGRESS - DECISION PENDING'}
            </h3>

            <div className={`space-y-4 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              {achievedTarget ? (
                <>
                  <div className="p-4 rounded-lg bg-opacity-50 border-2 border-green-600">
                    <p className="font-bold mb-2">✅ PHASE 6 KICKOFF: APPROVED</p>
                    <ul className="text-sm space-y-1">
                      <li>✓ Sprint 5 validation complete (85%+)</li>
                      <li>✓ All critical path items delivered</li>
                      <li>✓ Production deployment successful</li>
                      <li>✓ Team ready for Phase 6</li>
                      <li>✓ Mar 10 kickoff GO</li>
                    </ul>
                  </div>
                  <div className="p-4 rounded-lg bg-opacity-50 border-2 border-blue-600">
                    <p className="font-bold mb-2">🚀 PHASE 6 START: Monday, Mar 10, 2026</p>
                    <p className="text-sm">8 Premium Features | 10-week cycle | May 26 launch target</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-4 rounded-lg bg-opacity-50 border-2 border-red-600">
                    <p className="font-bold mb-2">❌ CURRENT STATUS: {overallCompletion}%</p>
                    <p className="text-sm">Need {sprintTarget - overallCompletion}% more to unlock Phase 6</p>
                  </div>
                  <div className="p-4 rounded-lg bg-opacity-50 border-2 border-orange-600">
                    <p className="font-bold mb-2">⏰ TIME REMAINING: {4} days (until Mar 7)</p>
                    <p className="text-sm">Required effort: ~120 hours team-wide to achieve 85%</p>
                  </div>
                  <div className="p-4 rounded-lg bg-opacity-50 border-2 border-yellow-600">
                    <p className="font-bold mb-2">📅 DECISION DATE: Mar 7 EOD</p>
                    <p className="text-sm">If 85% achieved → Phase 6 GO (Mar 10) | If delayed → Phase 6 delayed (Mar 17)</p>
                  </div>
                </>
              )}
            </div>

            {achievedTarget && (
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} border-2 border-green-500`}>
                <p className="font-bold mb-2">📋 NEXT STEPS:</p>
                <ol className="text-sm space-y-1 list-decimal ml-5">
                  <li>Production deployment completed</li>
                  <li>Go-to-Market campaigns launched</li>
                  <li>Enterprise partnerships initiated</li>
                  <li>Phase 6 team assembly finalized</li>
                  <li>Sprint 6 detailed planning starts</li>
                </ol>
              </div>
            )}
          </CardContent>
        </Card>

        {/* FINAL METRICS */}
        {achievedTarget && (
          <Card className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
            <CardHeader>
              <CardTitle>🎯 Project Completion Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-green-600">5/6</p>
                  <p className="text-sm">Phases Complete</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-blue-600">32/40</p>
                  <p className="text-sm">Tasks Complete</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-purple-600">80%</p>
                  <p className="text-sm">Project Progress</p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-orange-600">70d</p>
                  <p className="text-sm">Until Q1 2027 Launch</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}