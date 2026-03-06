import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function FreshDeskCoverageMatrix() {
  const modules = [
    {
      name: 'Tickets',
      coverage: 61.5,
      implemented: 8,
      total: 13,
      status: 'Robusto',
      frontend: '✅ Dashboard completo',
      gaps: ['Merge', 'Split', 'Restore', 'Bulk Export/Import']
    },
    {
      name: 'Contacts',
      coverage: 45,
      implemented: 4.5,
      total: 10,
      status: 'Básico',
      frontend: '✅ CRUD básico',
      gaps: ['Merge', 'Bulk update', 'Custom fields', 'Segmentation']
    },
    {
      name: 'Agents',
      coverage: 50,
      implemented: 5,
      total: 10,
      status: 'Básico',
      frontend: '✅ Lista e status',
      gaps: ['Create/Delete', 'Roles', 'Skills', 'Availability']
    },
    {
      name: 'Conversations',
      coverage: 37.5,
      implemented: 3,
      total: 8,
      status: 'Mínimo',
      frontend: '✅ Resposta simples',
      gaps: ['Internal notes', 'Bulk reply', 'Attachments', 'Mentions']
    },
    {
      name: 'Surveys',
      coverage: 0,
      implemented: 0,
      total: 4,
      status: 'Não implementado',
      frontend: '❌ Não existe',
      gaps: ['Todos os endpoints']
    },
    {
      name: 'Knowledge Base',
      coverage: 10,
      implemented: 0.5,
      total: 5,
      status: 'Mínimo',
      frontend: '⚠️ Componente existe',
      gaps: ['Folders', 'Categories', 'Search', 'Analytics']
    },
    {
      name: 'Time Entries',
      coverage: 25,
      implemented: 1.5,
      total: 6,
      status: 'Básico',
      frontend: '✅ Time tracking simples',
      gaps: ['Update', 'Delete', 'Billing', 'Reports']
    },
    {
      name: 'Custom Fields',
      coverage: 20,
      implemented: 1,
      total: 5,
      status: 'Mínimo',
      frontend: '⚠️ Metadata only',
      gaps: ['CRUD completo', 'Options']
    },
    {
      name: 'Satisfaction',
      coverage: 16.7,
      implemented: 1,
      total: 6,
      status: 'Mínimo',
      frontend: '✅ Reviews',
      gaps: ['Update', 'Delete', 'Bulk', 'Analytics']
    },
    {
      name: 'Webhooks',
      coverage: 50,
      implemented: 4,
      total: 8,
      status: 'Básico',
      frontend: '✅ Gerenciamento',
      gaps: ['Update', 'Test', 'Replay', 'Retry config']
    },
    {
      name: 'Automation',
      coverage: 28.6,
      implemented: 2,
      total: 7,
      status: 'Mínimo',
      frontend: '⚠️ Apply only',
      gaps: ['CRUD', 'Execução manual']
    }
  ];

  const getCoverageColor = (coverage) => {
    if (coverage >= 60) return 'bg-green-100 text-green-900';
    if (coverage >= 40) return 'bg-yellow-100 text-yellow-900';
    if (coverage >= 20) return 'bg-orange-100 text-orange-900';
    return 'bg-red-100 text-red-900';
  };

  const getStatusColor = (status) => {
    if (status === 'Robusto') return 'bg-green-500';
    if (status === 'Básico') return 'bg-yellow-500';
    if (status === 'Mínimo') return 'bg-orange-500';
    return 'bg-red-500';
  };

  const averageCoverage = Math.round(modules.reduce((sum, m) => sum + m.coverage, 0) / modules.length);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Freshdesk API Coverage Matrix</h1>
        <p className="text-gray-600">Status completo da implementação de endpoints Freshdesk v2</p>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Coverage Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-600">34.5</p>
            <p className="text-sm text-gray-600">Endpoints Implementados</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">74</p>
            <p className="text-sm text-gray-600">Total de Endpoints</p>
          </div>
          <div className={`text-center p-4 rounded ${getCoverageColor(averageCoverage)}`}>
            <p className="text-3xl font-bold">{averageCoverage}%</p>
            <p className="text-sm">Cobertura Média</p>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Matrix */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Module Coverage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {modules.map((module, idx) => (
              <div key={idx} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{module.name}</h3>
                      <Badge className={getStatusColor(module.status)}>
                        {module.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{module.frontend}</p>
                  </div>
                  <div className={`text-right px-4 py-2 rounded ${getCoverageColor(module.coverage)}`}>
                    <p className="text-lg font-bold">{module.coverage}%</p>
                    <p className="text-xs">{module.implemented}/{module.total}</p>
                  </div>
                </div>

                {module.gaps.length > 0 && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> Gaps:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {module.gaps.map((gap, gidx) => (
                        <Badge key={gidx} variant="outline" className="text-xs">
                          {gap}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Priority List */}
      <Card>
        <CardHeader>
          <CardTitle>Implementation Priorities (Sprint 11+)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="bg-red-50 border border-red-200 rounded p-3">
            <h4 className="font-semibold text-red-900 mb-2">🔴 Critical (0% coverage)</h4>
            <p className="text-sm text-red-800">Surveys API - Novo módulo completo</p>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded p-3">
            <h4 className="font-semibold text-orange-900 mb-2">🟠 High Priority (&lt;30%)</h4>
            <ul className="text-sm text-orange-800 space-y-1">
              <li>• Knowledge Base: Folders + Search</li>
              <li>• Custom Fields: CRUD completo</li>
              <li>• Automation Rules: Create/Update/Delete</li>
              <li>• Conversations: Internal notes + Attachments</li>
            </ul>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
            <h4 className="font-semibold text-yellow-900 mb-2">🟡 Medium Priority (30-50%)</h4>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Contacts: Merge + Bulk update</li>
              <li>• Agents: Create/Delete + Roles</li>
              <li>• Webhooks: Update + Test</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Frontend Status */}
      <Card>
        <CardHeader>
          <CardTitle>Frontend Components Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '✅', text: 'Dashboard (Tickets)', color: 'green' },
              { icon: '✅', text: 'Ticket CRUD', color: 'green' },
              { icon: '✅', text: 'Contact Manager', color: 'green' },
              { icon: '✅', text: 'Agent List', color: 'green' },
              { icon: '⚠️', text: 'KB Editor', color: 'yellow' },
              { icon: '⚠️', text: 'Custom Fields', color: 'yellow' },
              { icon: '❌', text: 'Surveys UI', color: 'red' },
              { icon: '❌', text: 'Automation Builder', color: 'red' }
            ].map((item, idx) => (
              <div key={idx} className={`border rounded p-3 bg-${item.color}-50`}>
                <p className="text-sm flex items-center gap-2">
                  <span className="text-lg">{item.icon}</span>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}