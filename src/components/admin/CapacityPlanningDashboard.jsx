import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function CapacityPlanningDashboard() {
  const [selectedScenario, setSelectedScenario] = useState('conservative');

  const projectionData = [
    { month: 'Mar 2026', users: 150, processes: 5000, apiCalls: 250000 },
    { month: 'Jun 2026', users: 450, processes: 18000, apiCalls: 850000 },
    { month: 'Sep 2026', users: 1200, processes: 52000, apiCalls: 2400000 },
    { month: 'Dec 2026', users: 2500, processes: 120000, apiCalls: 5200000 }
  ];

  const scenarios = {
    conservative: {
      growth: '20% quarterly',
      cpuNeeded: '4 vCPU → 16 vCPU',
      memoryNeeded: '8 GB → 32 GB',
      storageNeeded: '50 GB → 500 GB',
      dbScaling: 'Primary + 2 Read Replicas',
      cost: '$3,500/month → $12,000/month'
    },
    moderate: {
      growth: '50% quarterly',
      cpuNeeded: '4 vCPU → 32 vCPU',
      memoryNeeded: '8 GB → 64 GB',
      storageNeeded: '50 GB → 1 TB',
      dbScaling: 'Primary + 3 Read Replicas + Sharding',
      cost: '$3,500/month → $28,000/month'
    },
    aggressive: {
      growth: '100% quarterly',
      cpuNeeded: '4 vCPU → 64 vCPU',
      memoryNeeded: '8 GB → 128 GB',
      storageNeeded: '50 GB → 2 TB',
      dbScaling: 'Multi-region with Global Read Replicas',
      cost: '$3,500/month → $65,000/month'
    }
  };

  const currentScenario = scenarios[selectedScenario];

  const scaling = [
    {
      resource: 'API Servers',
      current: '2',
      in3m: '4',
      in6m: '8',
      in12m: '16',
      action: 'Auto-scaling enabled'
    },
    {
      resource: 'Database',
      current: '1 Primary',
      in3m: '1 Primary + 1 Replica',
      in6m: '1 Primary + 2 Replicas',
      in12m: 'Multi-region + Sharding',
      action: 'Progressive replication'
    },
    {
      resource: 'Cache Layer',
      current: '512MB',
      in3m: '2GB',
      in6m: '8GB',
      in12m: '32GB + Cluster',
      action: 'Redis cluster setup'
    },
    {
      resource: 'Storage',
      current: '50GB',
      in3m: '150GB',
      in6m: '500GB',
      in12m: '2TB + Archive',
      action: 'Tiered storage with S3'
    }
  ];

  const risks = [
    {
      title: 'Database Bottleneck',
      probability: 'HIGH',
      impact: 'CRITICAL',
      mitigation: 'Implement read replicas and query optimization by Q2'
    },
    {
      title: 'Memory Saturation',
      probability: 'MEDIUM',
      impact: 'HIGH',
      mitigation: 'Monitor cache hit rates and increase Redis capacity'
    },
    {
      title: 'Regional Latency',
      probability: 'MEDIUM',
      impact: 'MEDIUM',
      mitigation: 'Plan multi-region deployment by Q4'
    },
    {
      title: 'Cost Explosion',
      probability: 'LOW',
      impact: 'CRITICAL',
      mitigation: 'Optimize resource usage and implement cost controls'
    }
  ];

  return (
    <div className="space-y-6">
      {/* SCENARIO SELECTOR */}
      <div className="flex gap-3">
        {['conservative', 'moderate', 'aggressive'].map(scenario => (
          <button
            key={scenario}
            onClick={() => setSelectedScenario(scenario)}
            className={`px-4 py-2 rounded font-semibold text-sm transition ${
              selectedScenario === scenario
                ? 'bg-cyan-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
            }`}
          >
            {scenario.charAt(0).toUpperCase() + scenario.slice(1)}
          </button>
        ))}
      </div>

      {/* CURRENT SCENARIO */}
      <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20">
        <CardHeader>
          <CardTitle className="capitalize">{selectedScenario} Growth Scenario</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          {Object.entries(currentScenario).map(([key, value]) => (
            <div key={key}>
              <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase">
                {key.replace(/([A-Z])/g, ' $1')}
              </p>
              <p className="font-semibold mt-1">{value}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* GROWTH PROJECTION */}
      <Card>
        <CardHeader>
          <CardTitle>📈 Growth Projection (12 months)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={projectionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="users" stroke="#3b82f6" name="Users" />
              <Line type="monotone" dataKey="processes" stroke="#8b5cf6" strokeWidth={2} name="Processes" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* RESOURCE SCALING */}
      <Card>
        <CardHeader>
          <CardTitle>🔄 Resource Scaling Timeline</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {scaling.map((item, idx) => (
            <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="font-semibold text-sm mb-2">{item.resource}</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                <div>
                  <p className="text-gray-500">Now</p>
                  <p className="font-semibold">{item.current}</p>
                </div>
                <div>
                  <p className="text-gray-500">3 months</p>
                  <p className="font-semibold">{item.in3m}</p>
                </div>
                <div>
                  <p className="text-gray-500">6 months</p>
                  <p className="font-semibold">{item.in6m}</p>
                </div>
                <div>
                  <p className="text-gray-500">12 months</p>
                  <p className="font-semibold">{item.in12m}</p>
                </div>
                <div>
                  <p className="text-gray-500">Action</p>
                  <p className="font-semibold text-blue-600">{item.action}</p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* RISK ASSESSMENT */}
      <Card>
        <CardHeader>
          <CardTitle>⚠️ Risk Assessment & Mitigation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {risks.map((risk, idx) => (
            <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-700 rounded border-l-4 border-l-orange-500">
              <div className="flex items-start justify-between mb-2">
                <p className="font-semibold text-sm">{risk.title}</p>
                <div className="flex gap-1">
                  <Badge className={risk.probability === 'HIGH' ? 'bg-red-600' : 'bg-yellow-600'} style={{ fontSize: '10px' }}>
                    {risk.probability}
                  </Badge>
                  <Badge className={risk.impact === 'CRITICAL' ? 'bg-red-600' : 'bg-orange-600'} style={{ fontSize: '10px' }}>
                    {risk.impact}
                  </Badge>
                </div>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">{risk.mitigation}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* RECOMMENDATIONS */}
      <Card className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
        <CardHeader>
          <CardTitle className="text-base text-green-900 dark:text-green-100">
            ✅ Recommended Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-green-900 dark:text-green-100 space-y-2">
          <p>• <strong>Q1 2026:</strong> Implement read replicas and start caching optimization</p>
          <p>• <strong>Q2 2026:</strong> Enable auto-scaling and monitor cost trends</p>
          <p>• <strong>Q3 2026:</strong> Plan multi-region setup and conduct load testing</p>
          <p>• <strong>Q4 2026:</strong> Execute global deployment and finalize DR strategy</p>
        </CardContent>
      </Card>
    </div>
  );
}