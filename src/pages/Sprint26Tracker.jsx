import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';

export default function Sprint26Tracker() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: 'Post-Launch Monitoring (24h-7d)',
      description: 'Real-time metrics, alerts, dashboards',
      status: 'in_progress',
      progress: 40,
      subtasks: [
        { name: 'Dashboard criado', done: true },
        { name: 'Metrics coletados', done: true },
        { name: 'Alerting ativo', done: false },
        { name: 'Weekly report template', done: false }
      ]
    },
    {
      id: 2,
      title: 'Early User Feedback Collection',
      description: 'Surveys, in-app feedback, sentiment analysis',
      status: 'in_progress',
      progress: 25,
      subtasks: [
        { name: 'Feedback function criada', done: true },
        { name: 'In-app widget', done: false },
        { name: 'Survey template', done: false },
        { name: 'Sentiment dashboard', done: false }
      ]
    },
    {
      id: 3,
      title: 'Performance Optimization',
      description: 'Cache, query optimization, lazy loading',
      status: 'pending',
      progress: 0,
      subtasks: [
        { name: 'Profiling completo', done: false },
        { name: 'Query optimization', done: false },
        { name: 'Lazy loading impl', done: false },
        { name: 'A/B testing setup', done: false }
      ]
    },
    {
      id: 4,
      title: 'Bug Fix Pipeline',
      description: 'P1/P2 fixes, hotpatches, QA',
      status: 'pending',
      progress: 0,
      subtasks: [
        { name: 'Triage process', done: false },
        { name: 'Fix templates', done: false },
        { name: 'Regression tests', done: false },
        { name: 'Hotpatch automation', done: false }
      ]
    },
    {
      id: 5,
      title: 'Scaling Strategy',
      description: 'Capacity planning, auto-scaling, load testing',
      status: 'pending',
      progress: 0,
      subtasks: [
        { name: 'Growth forecast', done: false },
        { name: 'Scaling thresholds', done: false },
        { name: 'Load test params', done: false },
        { name: 'Automation scripts', done: false }
      ]
    },
    {
      id: 6,
      title: 'Feature Roadmap V2',
      description: 'Plan next 3 months based on feedback',
      status: 'pending',
      progress: 0,
      subtasks: [
        { name: 'Feedback analysis', done: false },
        { name: 'Feature prioritization', done: false },
        { name: 'Sprint planning', done: false },
        { name: 'Stakeholder review', done: false }
      ]
    }
  ]);

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const totalTasks = tasks.length;
  const overallProgress = Math.round(
    tasks.reduce((sum, t) => sum + t.progress, 0) / totalTasks
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Sprint 26 - Post-Launch Excellence
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Real-time monitoring, feedback, optimization (7 dias)
          </p>
        </div>

        {/* PROGRESS OVERVIEW */}
        <Card className="p-6 dark:bg-gray-800 mb-8">
          <div className="grid md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Overall Progress</p>
              <p className="text-3xl font-bold text-cyan-600">{overallProgress}%</p>
              <Progress value={overallProgress} className="mt-2" />
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">In Progress</p>
              <p className="text-3xl font-bold text-blue-600">{inProgressTasks}</p>
              <p className="text-xs text-gray-500">{inProgressTasks} of {totalTasks} tasks</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Completed</p>
              <p className="text-3xl font-bold text-green-600">{completedTasks}</p>
              <p className="text-xs text-gray-500">{completedTasks} of {totalTasks} tasks</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Pending</p>
              <p className="text-3xl font-bold text-orange-600">{totalTasks - inProgressTasks - completedTasks}</p>
              <p className="text-xs text-gray-500">To be started</p>
            </div>
          </div>
        </Card>

        {/* TASKS */}
        <Tabs defaultValue="all" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">All Tasks ({totalTasks})</TabsTrigger>
            <TabsTrigger value="in_progress">In Progress ({inProgressTasks})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedTasks})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({totalTasks - inProgressTasks - completedTasks})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            {tasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </TabsContent>

          <TabsContent value="in_progress" className="space-y-4">
            {tasks.filter(t => t.status === 'in_progress').map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {tasks.filter(t => t.status === 'completed').map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            {tasks.filter(t => t.status === 'pending').map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </TabsContent>
        </Tabs>

        {/* SPRINT TIMELINE */}
        <Card className="p-6 dark:bg-gray-800 mt-8">
          <h3 className="font-bold mb-4">Sprint Timeline</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-24 font-semibold text-sm">Day 1-2</div>
              <div>
                <p className="font-semibold">Monitoring Setup</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Dashboard, alerts, real-time tracking</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-24 font-semibold text-sm">Day 2-4</div>
              <div>
                <p className="font-semibold">Feedback Collection</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">User surveys, in-app feedback, sentiment analysis</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-24 font-semibold text-sm">Day 4-6</div>
              <div>
                <p className="font-semibold">Quick Optimizations</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Cache tuning, query optimization, UX fixes</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-24 font-semibold text-sm">Day 6-7</div>
              <div>
                <p className="font-semibold">Roadmap Planning</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Feedback analysis, Sprint 27 planning, stakeholder review</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function TaskCard({ task }) {
  return (
    <Card className="p-6 dark:bg-gray-800">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            {task.status === 'completed' ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : task.status === 'in_progress' ? (
              <AlertCircle className="w-5 h-5 text-blue-600" />
            ) : (
              <Circle className="w-5 h-5 text-gray-400" />
            )}
            <h4 className="font-semibold">{task.title}</h4>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{task.description}</p>
        </div>
        <span className={`text-xs font-semibold px-2 py-1 rounded ${
          task.status === 'completed' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
          task.status === 'in_progress' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
          'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
        }`}>
          {task.status === 'in_progress' ? 'In Progress' : task.status === 'completed' ? 'Completed' : 'Pending'}
        </span>
      </div>

      <Progress value={task.progress} className="mb-4" />

      <div className="grid md:grid-cols-2 gap-2">
        {task.subtasks.map((subtask, idx) => (
          <div key={idx} className="flex items-center gap-2 text-sm">
            {subtask.done ? (
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            ) : (
              <Circle className="w-4 h-4 text-gray-400" />
            )}
            <span className={subtask.done ? 'line-through text-gray-500' : ''}>
              {subtask.name}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}