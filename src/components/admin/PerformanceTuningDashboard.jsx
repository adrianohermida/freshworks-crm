import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Zap } from 'lucide-react';

export default function PerformanceTuningDashboard() {
  const [selectedQuery, setSelectedQuery] = useState(null);

  const slowQueries = [
    {
      id: 1,
      name: 'fetchProcesses (no index)',
      duration: 2340,
      executions: 1847,
      impact: 'HIGH',
      optimization: 'Add index on cnj_number + status'
    },
    {
      id: 2,
      name: 'listAndamentos (n+1 problem)',
      duration: 1520,
      executions: 3421,
      impact: 'CRITICAL',
      optimization: 'Use JOIN instead of multiple queries'
    },
    {
      id: 3,
      name: 'searchDeadlines (full table scan)',
      duration: 980,
      executions: 892,
      impact: 'HIGH',
      optimization: 'Add composite index on process_id + deadline_date'
    },
    {
      id: 4,
      name: 'syncTPUData (memory leak)',
      duration: 5600,
      executions: 24,
      impact: 'CRITICAL',
      optimization: 'Stream large datasets instead of loading in memory'
    }
  ];

  const cacheMetrics = [
    { name: 'Redis Cache', hitRate: 87, size: 456, ttl: '24h' },
    { name: 'Query Cache', hitRate: 62, size: 234, ttl: '1h' },
    { name: 'Session Cache', hitRate: 94, size: 128, ttl: '30m' }
  ];

  const recommendations = [
    {
      area: 'Database',
      priority: 'CRITICAL',
      action: 'Add 3 missing indexes',
      impact: '~40% query improvement',
      status: 'PENDING'
    },
    {
      area: 'API',
      priority: 'HIGH',
      action: 'Implement request pagination',
      impact: '~25% bandwidth savings',
      status: 'PENDING'
    },
    {
      area: 'Frontend',
      priority: 'MEDIUM',
      action: 'Enable code splitting & lazy loading',
      impact: '~35% faster page load',
      status: 'IN_PROGRESS'
    },
    {
      area: 'Cache',
      priority: 'MEDIUM',
      action: 'Increase Redis memory to 2GB',
      impact: '~15% hit rate improvement',
      status: 'PENDING'
    }
  ];

  return (
    <div className="space-y-6">
      {/* SUMMARY */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="pt-6">
            <p className="text-sm text-blue-600 dark:text-blue-400">Slow Queries</p>
            <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-1">{slowQueries.length}</p>
            <p className="text-xs text-blue-600 mt-2">Need optimization</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 dark:bg-purple-900/20">
          <CardContent className="pt-6">
            <p className="text-sm text-purple-600 dark:text-purple-400">Cache Hit Rate</p>
            <p className="text-3xl font-bold text-purple-900 dark:text-purple-100 mt-1">81%</p>
            <p className="text-xs text-purple-600 mt-2">Average across caches</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 dark:bg-green-900/20">
          <CardContent className="pt-6">
            <p className="text-sm text-green-600 dark:text-green-400">Potential Speedup</p>
            <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-1">~2.5x</p>
            <p className="text-xs text-green-600 mt-2">With all recommendations</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 dark:bg-orange-900/20">
          <CardContent className="pt-6">
            <p className="text-sm text-orange-600 dark:text-orange-400">Critical Issues</p>
            <p className="text-3xl font-bold text-orange-900 dark:text-orange-100 mt-1">2</p>
            <p className="text-xs text-orange-600 mt-2">Require immediate attention</p>
          </CardContent>
        </Card>
      </div>

      {/* SLOW QUERIES */}
      <Card>
        <CardHeader>
          <CardTitle>🐢 Slow Query Analysis</CardTitle>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Queries taking &gt; 500ms to execute</p>
        </CardHeader>
        <CardContent className="space-y-3">
          {slowQueries.map(query => (
            <div
              key={query.id}
              onClick={() => setSelectedQuery(selectedQuery === query.id ? null : query.id)}
              className="p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold text-sm">{query.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Avg: {query.duration}ms | Executions: {query.executions.toLocaleString()}
                  </p>
                </div>
                <Badge className={query.impact === 'CRITICAL' ? 'bg-red-600' : 'bg-orange-600'}>
                  {query.impact}
                </Badge>
              </div>

              {selectedQuery === query.id && (
                <div className="mt-3 p-2 bg-white dark:bg-gray-800 rounded text-sm">
                  <p className="font-semibold text-gray-900 dark:text-white mb-1">Recommended Fix:</p>
                  <p className="text-gray-700 dark:text-gray-300">{query.optimization}</p>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* CACHE METRICS */}
      <Card>
        <CardHeader>
          <CardTitle>💾 Cache Performance</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cacheMetrics.map((cache, idx) => (
            <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="font-semibold text-sm mb-2">{cache.name}</p>
              <div className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
                <p>Hit Rate: <span className="font-semibold text-green-600">{cache.hitRate}%</span></p>
                <p>Size: {cache.size}MB</p>
                <p>TTL: {cache.ttl}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* OPTIMIZATION RECOMMENDATIONS */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Optimization Roadmap
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {recommendations.map((rec, idx) => (
            <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-700 rounded border-l-4" style={{
              borderColor: rec.priority === 'CRITICAL' ? '#dc2626' : rec.priority === 'HIGH' ? '#f97316' : '#eab308'
            }}>
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="font-semibold text-sm">{rec.area}: {rec.action}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">Impact: {rec.impact}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={
                    rec.priority === 'CRITICAL' ? 'bg-red-600' :
                    rec.priority === 'HIGH' ? 'bg-orange-600' :
                    'bg-yellow-600'
                  } style={{ fontSize: '11px' }}>
                    {rec.priority}
                  </Badge>
                  {rec.status === 'IN_PROGRESS' && (
                    <Badge className="bg-blue-600" style={{ fontSize: '11px' }}>
                      IN PROGRESS
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ACTION ITEMS */}
      <Card className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700">
        <CardHeader>
          <CardTitle className="text-base text-yellow-900 dark:text-yellow-100">
            🎯 Immediate Actions (Next 48h)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-yellow-900 dark:text-yellow-100">
            <CheckCircle2 className="w-4 h-4" />
            <span>Add database indexes (listAndamentos N+1 fix)</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-yellow-900 dark:text-yellow-100">
            <AlertCircle className="w-4 h-4" />
            <span>Refactor syncTPUData with streaming (memory issue)</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-yellow-900 dark:text-yellow-100">
            <AlertCircle className="w-4 h-4" />
            <span>Implement API pagination for large datasets</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}