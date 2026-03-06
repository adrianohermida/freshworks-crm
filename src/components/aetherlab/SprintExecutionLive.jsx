import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2, AlertCircle, Clock, Zap } from 'lucide-react';

export default function SprintExecutionLive() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const [completedItems, setCompletedItems] = useState({});

  const sprint5FinalTasks = [
    {
      id: 'gtm',
      title: 'Go-to-Market Regional (4 mercados)',
      daysLeft: 4,
      completion: 45,
      subtasks: [
        { name: 'Brasil market page - copy + visuals', done: false },
        { name: 'Europe market page - compliance focus', done: false },
        { name: 'USA market page - enterprise messaging', done: false },
        { name: 'LATAM strategy page - consolidation', done: false }
      ]
    },
    {
      id: 'certs',
      title: 'Certifications Tracker (automations)',
      daysLeft: 5,
      completion: 50,
      subtasks: [
        { name: 'SOC 2 Type II automation setup', done: false },
        { name: 'ISO 27001 tracking dashboard', done: false },
        { name: 'GDPR compliance checkpoints', done: false },
        { name: 'Email notifications + status updates', done: false }
      ]
    },
    {
      id: 'partners',
      title: 'Enterprise Partnerships (pipeline)',
      daysLeft: 7,
      completion: 25,
      subtasks: [
        { name: 'Partnership pipeline dashboard', done: false },
        { name: 'Lead scoring automation', done: false },
        { name: 'Integration readiness checklist', done: false }
      ]
    },
    {
      id: 'i18n',
      title: 'i18n Integration (all pages)',
      daysLeft: 10,
      completion: 40,
      subtasks: [
        { name: 'Update Home + Pricing pages', done: false },
        { name: 'Dashboard translations (5 langs)', done: false },
        { name: 'RTL layout fixes (Arabic/Hebrew)', done: false },
        { name: 'Language switcher in all headers', done: false }
      ]
    },
    {
      id: 'multiregion',
      title: 'Multi-region deployment (AWS setup)',
      daysLeft: 14,
      completion: 30,
      subtasks: [
        { name: 'US-East infrastructure', done: false },
        { name: 'EU-West infrastructure', done: false },
        { name: 'BR-South infrastructure', done: false },
        { name: 'Load balancing + CDN config', done: false }
      ]
    }
  ];

  const toggleSubtask = (taskId, subtaskIndex) => {
    const key = `${taskId}-${subtaskIndex}`;
    setCompletedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const calculateTaskCompletion = (task) => {
    const completed = task.subtasks.filter((_, idx) => 
      completedItems[`${task.id}-${idx}`]
    ).length;
    return Math.round((completed / task.subtasks.length) * 100);
  };

  const overallCompletion = Math.round(
    sprint5FinalTasks.reduce((acc, task) => acc + calculateTaskCompletion(task), 0) / sprint5FinalTasks.length
  );

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* LIVE HEADER */}
        <section className={`p-8 rounded-lg border-2 ${isDark ? 'bg-gradient-to-r from-red-900/40 to-orange-900/40 border-red-700' : 'bg-gradient-to-r from-red-100 to-orange-100 border-red-400'}`}>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold flex items-center gap-2">
                <Zap className="w-10 h-10 text-red-600 animate-pulse" />
                🔴 SPRINT 5 FINAL WEEK - LIVE EXECUTION
              </h1>
              <div className="text-right">
                <p className="text-3xl font-bold text-red-600">{overallCompletion}%</p>
                <p className="text-sm">Overall Completion</p>
              </div>
            </div>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              5 Critical Items | 4 Days to Final Deadline (Mar 7) | 62.5% → Target 85%
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-red-600 animate-pulse">URGENT</Badge>
              <Badge className="bg-orange-600">Est. 120 hours remaining</Badge>
              <Badge className="bg-yellow-600">Full team focus</Badge>
            </div>
          </div>
        </section>

        {/* DAILY FOCUS */}
        <Card className={`border-2 ${isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-400'}`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-6 h-6" />
              Today's Focus (Mar 3)
            </CardTitle>
          </CardHeader>
          <CardContent className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
            <p className="font-bold">Priority 1: Go-to-Market Regional (45% → 70%)</p>
            <p className="text-sm ml-4">Complete Brasil + Europe market pages with final copy & visuals</p>
            
            <p className="font-bold mt-4">Priority 2: Enterprise Partnerships (25% → 50%)</p>
            <p className="text-sm ml-4">Build partnership pipeline dashboard with lead scoring</p>
          </CardContent>
        </Card>

        {/* TASK BREAKDOWN */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">📋 Task Execution Board</h2>
          {sprint5FinalTasks.map((task, idx) => {
            const taskCompletion = calculateTaskCompletion(task);
            const isUrgent = task.daysLeft <= 5;
            
            return (
              <Card 
                key={task.id} 
                className={`border-2 ${
                  isUrgent
                    ? isDark ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-400'
                    : isDark ? 'bg-gray-900 border-gray-800' : 'border-gray-200'
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="mb-2">{task.title}</CardTitle>
                      <div className="flex gap-2 flex-wrap">
                        <Badge className={isUrgent ? 'bg-red-600' : 'bg-blue-600'}>
                          {isUrgent ? '🔴 CRITICAL' : '📌 HIGH'}
                        </Badge>
                        <Badge className="bg-gray-600">{task.daysLeft} days</Badge>
                        <Badge className="bg-purple-600">{taskCompletion}% complete</Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Progress value={taskCompletion} className="h-3" />
                  <div className="space-y-2">
                    {task.subtasks.map((subtask, sidx) => {
                      const key = `${task.id}-${sidx}`;
                      const isChecked = completedItems[key] || false;
                      return (
                        <div key={sidx} className="flex items-center gap-3 p-2 rounded hover:bg-opacity-50 hover:bg-gray-200 dark:hover:bg-gray-800 transition">
                          <Checkbox 
                            checked={isChecked}
                            onCheckedChange={() => toggleSubtask(task.id, sidx)}
                            className="w-5 h-5"
                          />
                          <span className={isChecked ? 'line-through text-gray-500' : ''}>
                            {subtask.name}
                          </span>
                          {isChecked && <CheckCircle2 className="w-4 h-4 text-green-600 ml-auto" />}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </section>

        {/* DAILY TIMELINE */}
        <Card className={`border-2 ${isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-400'}`}>
          <CardHeader>
            <CardTitle>📅 Execution Timeline (Mar 3-7)</CardTitle>
          </CardHeader>
          <CardContent className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
            <div className="grid md:grid-cols-5 gap-3">
              <div className={`p-3 rounded-lg border-2 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
                <p className="font-bold">Mon (3)</p>
                <p className="text-xs">Go-to-Market: Brasil + Europe</p>
                <p className="text-xs">Partners: Pipeline start</p>
              </div>
              <div className={`p-3 rounded-lg border-2 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
                <p className="font-bold">Tue (4)</p>
                <p className="text-xs">Go-to-Market: USA page</p>
                <p className="text-xs">Certs: SOC 2 dashboard</p>
              </div>
              <div className={`p-3 rounded-lg border-2 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
                <p className="font-bold">Wed (5)</p>
                <p className="text-xs">Certs: ISO setup complete</p>
                <p className="text-xs">i18n: Home + Pricing</p>
              </div>
              <div className={`p-3 rounded-lg border-2 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
                <p className="font-bold">Thu (6)</p>
                <p className="text-xs">Partners: Dashboard live</p>
                <p className="text-xs">i18n: Dashboard trans.</p>
              </div>
              <div className={`p-3 rounded-lg border-2 ${isDark ? 'bg-green-800 border-green-600' : 'bg-green-100 border-green-500'} font-bold`}>
                <p>Fri (7)</p>
                <p className="text-xs">QA + Production</p>
                <p className="text-xs">85% Sprint 5 ✅</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CRITICAL PATH */}
        <Card className={`border-2 ${isDark ? 'bg-gradient-to-r from-orange-900/60 to-red-900/60 border-orange-600' : 'bg-gradient-to-r from-orange-100 to-red-100 border-orange-600'}`}>
          <CardContent className="pt-8 space-y-4">
            <h3 className="text-2xl font-bold">⚡ Critical Path to 85%</h3>
            <div className={`space-y-2 ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>
              <p><strong>❌ If not done by Fri:</strong> Phase 6 kickoff delayed (Mar 17 instead of Mar 10)</p>
              <p><strong>⏰ Timeline impact:</strong> -1 week = harder to hit May 26 launch</p>
              <p><strong>✅ If done on time:</strong> Full 10-week Phase 6 cycle | Q1 2027 launch on track</p>
            </div>
          </CardContent>
        </Card>

        {/* STATUS SUMMARY */}
        <Card className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
          <CardHeader>
            <CardTitle>📊 Real-Time Status</CardTitle>
          </CardHeader>
          <CardContent className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-orange-600">{overallCompletion}%</p>
                <p className="text-sm">Current Sprint 5 Exec</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">5</p>
                <p className="text-sm">Critical Tasks Active</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-600">4d</p>
                <p className="text-sm">Until Final Deadline</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}