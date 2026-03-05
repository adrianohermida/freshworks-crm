import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function Sprint14Status() {
  const sprintGoals = [
    { id: 1, name: 'SAML/SSO Integration', status: 'in_progress', progress: 40, effort: '8h', priority: 'HIGH' },
    { id: 2, name: 'Advanced Analytics (ML)', status: 'completed', progress: 100, effort: '12h', priority: 'HIGH' },
    { id: 3, name: 'Custom Branding Engine', status: 'in_progress', progress: 30, effort: '6h', priority: 'MEDIUM' },
    { id: 4, name: 'Webhooks V3 API', status: 'in_progress', progress: 45, effort: '8h', priority: 'MEDIUM' },
    { id: 5, name: 'Rate Limiting System', status: 'in_progress', progress: 40, effort: '4h', priority: 'MEDIUM' },
    { id: 6, name: 'White-label Solution', status: 'planned', progress: 0, effort: '10h', priority: 'HIGH' }
  ];

  const phase1Summary = {
    sprints: 5,
    modules: 6,
    pages: 23,
    adminPages: 9,
    functions: 50,
    coverage: 98
  };

  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    in_progress: 'bg-blue-100 text-blue-800',
    planned: 'bg-gray-100 text-gray-800'
  };

  const statusIcons = {
    completed: <CheckCircle2 className="w-4 h-4" />,
    in_progress: <Clock className="w-4 h-4" />,
    planned: <AlertCircle className="w-4 h-4" />
  };

  const totalProgress = (sprintGoals.reduce((sum, goal) => sum + goal.progress, 0) / sprintGoals.length).toFixed(0);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sprint 14 - Enterprise Features</h1>
          <p className="text-gray-600 mt-1">Phase 2: Expandindo para soluções enterprise</p>
        </div>

        {/* Phase 1 Completion Card */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200">
          <CardHeader>
            <CardTitle className="text-green-900">✅ Phase 1 Finalizado com Sucesso</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{phase1Summary.sprints}</p>
                <p className="text-xs text-green-700">Sprints</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{phase1Summary.modules}</p>
                <p className="text-xs text-green-700">Módulos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{phase1Summary.pages}</p>
                <p className="text-xs text-green-700">Páginas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{phase1Summary.adminPages}</p>
                <p className="text-xs text-green-700">Admin Pages</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{phase1Summary.functions}</p>
                <p className="text-xs text-green-700">Funções</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{phase1Summary.coverage}%</p>
                <p className="text-xs text-green-700">Coverage</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sprint Progress */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Sprint 14 Progress</span>
              <Badge className="bg-blue-600">{totalProgress}%</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={parseInt(totalProgress)} className="h-3" />
            <p className="text-sm text-gray-600 mt-2">
              {sprintGoals.filter(g => g.status === 'completed').length} completos • 
              {sprintGoals.filter(g => g.status === 'in_progress').length} em progresso • 
              {sprintGoals.filter(g => g.status === 'planned').length} planejados
            </p>
          </CardContent>
        </Card>

        {/* Sprint Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Sprint Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sprintGoals.map((goal) => (
              <div key={goal.id} className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="mt-1">{statusIcons[goal.status]}</div>
                    <div>
                      <p className="font-semibold text-sm">{goal.name}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge className={statusColors[goal.status]}>
                          {goal.status === 'completed' ? 'Concluído' : goal.status === 'in_progress' ? 'Em Progresso' : 'Planejado'}
                        </Badge>
                        <Badge className="bg-purple-100 text-purple-800">{goal.effort}</Badge>
                        <Badge className={goal.priority === 'HIGH' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}>
                          {goal.priority}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">{goal.progress}%</p>
                  </div>
                </div>
                <Progress value={goal.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Current Focus */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">🎯 Current Focus</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-blue-900">
            <p className="font-semibold">SAML/SSO Integration (25% completo)</p>
            <ul className="text-sm space-y-1 ml-4">
              <li>✓ Backend SSO function scaffolding</li>
              <li>⏳ SAML provider configuration</li>
              <li>⏳ Login flow integration</li>
              <li>⏳ User sync from directory</li>
            </ul>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Sprint Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3">
                <Badge className="bg-green-600">✓</Badge>
                <div>
                  <p className="font-semibold">Semana 1: SSO Basics (25%)</p>
                  <p className="text-gray-600">Backend scaffold + provider config</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-600">→</Badge>
                <div>
                  <p className="font-semibold">Semana 2: Advanced Analytics (0%)</p>
                  <p className="text-gray-600">ML models + predictive dashboards</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-gray-600">⏳</Badge>
                <div>
                  <p className="font-semibold">Semana 3: Branding + Webhooks (0%)</p>
                  <p className="text-gray-600">Custom themes + API v3</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-gray-600">⏳</Badge>
                <div>
                  <p className="font-semibold">Semana 4: White-label + Polish (0%)</p>
                  <p className="text-gray-600">White-label solution + testing</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-blue-600">48h</p>
              <p className="text-xs text-gray-600">Total Effort</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-purple-600">6</p>
              <p className="text-xs text-gray-600">Features</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-green-600">4</p>
              <p className="text-xs text-gray-600">Semanas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold text-orange-600">4.2x</p>
              <p className="text-xs text-gray-600">Impact</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}