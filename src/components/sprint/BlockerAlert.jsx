import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, TrendingDown, Clock } from 'lucide-react';

export default function BlockerAlert() {
  const [blockers] = useState([
    {
      id: 1,
      severity: 'high',
      title: 'Auth Refactor Needed',
      description: 'Team Collaboration feature requires backend authentication refactor for granular permissions',
      impact: 'Blocks Task #3 (Team Collab)',
      status: 'pending',
      assignee: 'Dev 2',
      estimatedResolution: '2026-03-14',
      mitigation: 'Parallel with Billing work, refactor plan ready'
    },
    {
      id: 2,
      severity: 'medium',
      title: 'LLM API Setup',
      description: 'AI Copilot requires OpenAI/Claude API configuration and rate limiting',
      impact: 'Delays Task #6 (Copilot)',
      status: 'in_progress',
      assignee: 'DevOps',
      estimatedResolution: '2026-03-17',
      mitigation: 'Can move to Sprint 8 if Mobile overruns'
    },
    {
      id: 3,
      severity: 'medium',
      title: 'Mobile Dev Learning Curve',
      description: 'React Native development is new domain for current team',
      impact: 'Highest risk for Sprint 7 schedule',
      status: 'risk',
      assignee: 'Dev 1 + Dev 2',
      estimatedResolution: '2026-03-19',
      mitigation: 'Pre-loaded boilerplate, 4-day allocation, contingency buffer'
    }
  ]);

  const getSeverityColor = (severity) => {
    switch(severity) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'resolved': return '✅';
      case 'in_progress': return '⏳';
      case 'pending': return '⚠️';
      case 'risk': return '🚨';
      default: return '❓';
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-gray-900">🚨 Blockers & Risks</h2>
          <p className="text-sm text-gray-600">
            {blockers.filter(b => b.status !== 'resolved').length} active items
          </p>
        </div>
        <Badge className="bg-red-100 text-red-800">
          {blockers.filter(b => b.severity === 'high').length} High Priority
        </Badge>
      </div>

      {/* Blockers List */}
      <div className="space-y-3">
        {blockers.map(blocker => (
          <Card key={blocker.id} className={`p-4 border-l-4 ${
            blocker.severity === 'high' ? 'border-l-red-600 bg-red-50' :
            blocker.severity === 'medium' ? 'border-l-yellow-600 bg-yellow-50' :
            'border-l-blue-600 bg-blue-50'
          }`}>
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-start gap-2">
                <AlertCircle className={`w-5 h-5 flex-shrink-0 mt-0.5 ${
                  blocker.severity === 'high' ? 'text-red-600' :
                  blocker.severity === 'medium' ? 'text-yellow-600' :
                  'text-blue-600'
                }`} />
                <div>
                  <h3 className="font-semibold text-gray-900">{getStatusIcon(blocker.status)} {blocker.title}</h3>
                  <p className="text-sm text-gray-700 mt-1">{blocker.description}</p>
                </div>
              </div>
              <Badge className={getSeverityColor(blocker.severity)}>
                {blocker.severity.toUpperCase()}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3 text-xs text-gray-600">
              <div>
                <p className="font-medium text-gray-900">Impact</p>
                <p>{blocker.impact}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Assignee</p>
                <p>{blocker.assignee}</p>
              </div>
              <div>
                <p className="font-medium text-gray-900">ETA</p>
                <p className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {blocker.estimatedResolution}
                </p>
              </div>
              <div>
                <p className="font-medium text-gray-900">Status</p>
                <p>{blocker.status.toUpperCase()}</p>
              </div>
            </div>

            <div className="mt-3 p-2 bg-white rounded border border-gray-200">
              <p className="text-xs text-gray-600">
                <strong>Mitigation:</strong> {blocker.mitigation}
              </p>
            </div>
          </Card>
        ))}
      </div>

      {/* Action Items */}
      <Card className="p-4 bg-blue-50 border border-blue-200">
        <h4 className="font-semibold text-gray-900 mb-2">✅ Required Actions</h4>
        <ul className="space-y-1 text-sm text-gray-700">
          <li>• Prioritize Auth refactor with Dev 2 (resolve by day 3)</li>
          <li>• Setup LLM API in parallel (DevOps team)</li>
          <li>• Monitor Mobile progress closely (daily standup)</li>
          <li>• If Mobile overruns > 1 day, move Copilot to Sprint 8</li>
        </ul>
      </Card>
    </div>
  );
}