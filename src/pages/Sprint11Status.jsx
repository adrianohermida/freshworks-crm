import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Clock, TrendingUp, Rocket } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function Sprint11Status() {
  const [selectedTab, setSelectedTab] = useState('all');

  const tasks = [
    {
      id: 1,
      name: 'Performance Optimization Phase 1',
      description: 'Query optimization, cache tuning, lazy loading',
      status: 'planned',
      progress: 0,
      priority: 'critical',
      subtasks: [
        { name: 'Analyze slow queries (DataJud API)', done: false },
        { name: 'Implement query caching strategy', done: false },
        { name: 'Lazy load process list components', done: false },
        { name: 'Cache warming for hot data', done: false },
        { name: 'Performance benchmarks', done: false }
      ]
    },
    {
      id: 2,
      name: 'Mobile Responsiveness Final Pass',
      description: 'Complete mobile UX improvements and testing',
      status: 'planned',
      progress: 0,
      priority: 'critical',
      subtasks: [
        { name: 'Mobile viewport tests (all pages)', done: false },
        { name: 'Touch interaction optimization', done: false },
        { name: 'Mobile navigation refinement', done: false },
        { name: 'iOS/Android testing', done: false },
        { name: 'Mobile performance audit', done: false }
      ]
    },
    {
      id: 3,
      name: 'Monitoring & Alerting Setup',
      description: 'Production monitoring, error tracking, alerting',
      status: 'planned',
      progress: 0,
      priority: 'high',
      subtasks: [
        { name: 'Sentry error tracking integration', done: false },
        { name: 'DataDog monitoring dashboards', done: false },
        { name: 'Alert thresholds & escalation', done: false },
        { name: 'Log aggregation (CloudWatch/ELK)', done: false },
        { name: 'Incident response runbook', done: false }
      ]
    },
    {
      id: 4,
      name: 'Advanced Filtering & Search',
      description: 'Enhanced process filtering and full-text search',
      status: 'planned',
      progress: 0,
      priority: 'high',
      subtasks: [
        { name: 'Full-text search implementation', done: false },
        { name: 'Advanced filter UI (multiple criteria)', done: false },
        { name: 'Saved filters/views', done: false },
        { name: 'Search performance optimization', done: false },
        { name: 'Filter validation & testing', done: false }
      ]
    },
    {
      id: 5,
      name: 'Bulk Actions & Automation',
      description: 'Bulk process operations and workflow automation',
      status: 'planned',
      progress: 0,
      priority: 'medium',
      subtasks: [
        { name: 'Bulk action toolbar UI', done: false },
        { name: 'Batch sync operations', done: false },
        { name: 'Workflow automation rules engine', done: false },
        { name: 'Scheduled sync automation', done: false },
        { name: 'Bulk action testing & validation', done: false }
      ]
    },
    {
      id: 6,
      name: 'Documentation & Knowledge Base',
      description: 'User and developer documentation',
      status: 'planned',
      progress: 0,
      priority: 'medium',
      subtasks: [
        { name: 'User guide creation (in-app help)', done: false },
        { name: 'API documentation (REST + SDK)', done: false },
        { name: 'Deployment guide for partners', done: false },
        { name: 'Troubleshooting guide', done: false },
        { name: 'FAQ and knowledge base', done: false }
      ]
    }
  ];

  const statistics = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    planned: tasks.filter(t => t.status === 'planned').length
  };

  const overallProgress = 0; // Just started

  const filteredTasks = selectedTab === 'all' ? tasks : tasks.filter(t => t.status === selectedTab);

  const getPriorityColor = (priority) => {
    const colors = {
      critical: 'bg-red-600',
      high: 'bg-orange-600',
      medium: 'bg-yellow-600'
    };
    return colors[priority] || 'bg-gray-600';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Rocket className="w-8 h-8 text-cyan-600" />
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Sprint 11 - Performance & Features Phase 1
                </h1>
              </div>
              <p className="text-gray-600 dark:text-gray-400">
                Query optimization, mobile refinement, monitoring setup, advanced filtering
              </p>
            </div>
            <Badge className="bg-blue-600 px-4 py-2 text-lg">STARTING TODAY 🚀</Badge>
          </div>
        </div>

        {/* STATISTICS */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <Card className="p-4 dark:bg-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">Overall Progress</div>
            <div className="text-3xl font-bold text-cyan-600">{overallProgress}%</div>
            <Progress value={overallProgress} className="mt-2" />
          </Card>
          <Card className="p-4 dark:bg-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</div>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">{statistics.total}</div>
          </Card>
          <Card className="p-4 dark:bg-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">Planned</div>
            <div className="text-3xl font-bold text-blue-600">{statistics.planned}</div>
          </Card>
          <Card className="p-4 dark:bg-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">Duration</div>
            <div className="text-3xl font-bold text-purple-600">2 weeks</div>
            <p className="text-xs text-gray-600 mt-1">07 Mar - 20 Mar</p>
          </Card>
          <Card className="p-4 dark:bg-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">Dependency</div>
            <div className="text-lg font-bold text-green-600">Sprint 10</div>
            <p className="text-xs text-gray-600 mt-1">Must complete 95%+</p>
          </Card>
        </div>

        {/* CRITICAL PATH */}
        <Card className="p-6 dark:bg-gray-800 mb-8 border-l-4 border-l-yellow-500">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-yellow-600" />
            Critical Path - First Week
          </h3>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Badge className="bg-red-600 mt-1">P1</Badge>
              <div>
                <p className="font-semibold">Days 1-3: Sprint 10 Completion & Production Stability</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Wait for Sprint 10 post-deploy monitoring to complete. Ensure production is stable (error rate {`<`} 0.1%)
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="bg-orange-600 mt-1">P2</Badge>
              <div>
                <p className="font-semibold">Days 3-5: Query Analysis & Performance Baseline</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Analyze DataJud API performance, identify slow queries, establish performance baseline for Sprint 11
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Badge className="bg-yellow-600 mt-1">P2</Badge>
              <div>
                <p className="font-semibold">Days 5-7: Monitoring Setup & Mobile Testing</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Configure Sentry/DataDog, complete mobile responsiveness tests across all pages
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* TASKS TABS */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="all">Todos ({tasks.length})</TabsTrigger>
            <TabsTrigger value="planned">Planejado ({statistics.planned})</TabsTrigger>
            <TabsTrigger value="in_progress">Em Progresso ({statistics.in_progress})</TabsTrigger>
            <TabsTrigger value="completed">Concluído ({statistics.completed})</TabsTrigger>
          </TabsList>

          <TabsContent value={selectedTab} className="space-y-4">
            {filteredTasks.map((task) => (
              <Card key={task.id} className="p-6 dark:bg-gray-800">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
                      {task.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {task.description}
                    </p>
                  </div>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority.toUpperCase()}
                  </Badge>
                </div>

                {/* PROGRESS BAR */}
                <div className="mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-semibold">{task.progress}%</span>
                  </div>
                  <Progress value={task.progress} className="h-2" />
                </div>

                {/* SUBTASKS */}
                <div className="space-y-2">
                  {task.subtasks.map((subtask, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      {subtask.done ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      )}
                      <span className={subtask.done ? 'line-through text-gray-500' : ''}>
                        {subtask.name}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>

        {/* DEPENDENCIES */}
        <Card className="p-6 dark:bg-gray-800 mt-8 border-l-4 border-l-blue-500">
          <h3 className="font-bold text-lg mb-4">📌 Key Dependencies & Blockers</h3>
          <div className="space-y-3">
            <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
              <p className="text-sm font-semibold text-red-900 dark:text-red-100">
                🚨 BLOCKER: Sprint 10 Must Complete 95%
              </p>
              <p className="text-xs text-red-800 dark:text-red-200 mt-1">
                Cannot start Sprint 11 optimization work until production is stable (post-deploy monitoring complete)
              </p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                📊 Data Needed: Performance Baseline
              </p>
              <p className="text-xs text-blue-800 dark:text-blue-200 mt-1">
                Need baseline metrics from Day 1 of production (DataDog, Sentry) before optimization work
              </p>
            </div>
          </div>
        </Card>

        {/* SUCCESS CRITERIA */}
        <Card className="p-6 dark:bg-gray-800 mt-6 border-l-4 border-l-green-500">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            Sprint 11 Success Criteria
          </h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Query response time reduced by 30% (DataJud API calls)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Mobile responsiveness 100% on all pages (iOS/Android tested)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Monitoring & alerting fully operational (Sentry + DataDog)</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Advanced filtering UI complete and tested</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-600">✓</span>
              <span>Documentation coverage {`>`} 90%</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  );
}