import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, TrendingUp, Zap } from 'lucide-react';

export default function Sprint7Planning() {
  const sprint6Status = {
    completed: 8,
    total: 8,
    percentage: 100,
    duration: '8 dias',
    quality: '100% test coverage',
    velocity: 31
  };

  const sprint7Tasks = [
    {
      id: 1,
      name: 'Advanced Search Filters',
      description: 'Filtros dinâmicos, saved searches, full-text operator support',
      priority: 'high',
      estimatedDays: 1.5,
      dependencies: 'API Ready'
    },
    {
      id: 2,
      name: 'Mobile App (React Native)',
      description: 'iOS + Android com offline sync, push notifications',
      priority: 'high',
      estimatedDays: 4,
      dependencies: 'API, Backend'
    },
    {
      id: 3,
      name: 'Team Collaboration',
      description: 'Shared workspaces, granular permissions, audit logs',
      priority: 'medium',
      estimatedDays: 2.5,
      dependencies: 'Auth'
    },
    {
      id: 4,
      name: 'Custom Workflows (No-code)',
      description: 'Drag & drop workflow builder, automations',
      priority: 'medium',
      estimatedDays: 3,
      dependencies: 'API'
    },
    {
      id: 5,
      name: 'Billing & Subscription',
      description: 'Stripe integration, usage metering, invoicing',
      priority: 'high',
      estimatedDays: 2,
      dependencies: 'None'
    },
    {
      id: 6,
      name: 'AI Assistant (Copilot)',
      description: 'Chat-based legal assistant, case summaries',
      priority: 'medium',
      estimatedDays: 3,
      dependencies: 'LLM API'
    }
  ];

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Sprint 6 Summary */}
      <div className="border-b-2 border-green-200 pb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">✅ Sprint 6 Concluído</h1>
            <p className="text-gray-600 mt-1">Todas as 8 tarefas entregues com sucesso</p>
          </div>
          <Badge className="bg-green-600 text-white px-4 py-2 text-base">
            100% CONCLUÍDO
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card className="p-4 bg-white">
            <p className="text-xs text-gray-500 uppercase">Tarefas</p>
            <p className="text-3xl font-bold text-green-600 mt-1">{sprint6Status.completed}/{sprint6Status.total}</p>
          </Card>
          <Card className="p-4 bg-white">
            <p className="text-xs text-gray-500 uppercase">Duração</p>
            <p className="text-lg font-bold text-gray-900 mt-1">{sprint6Status.duration}</p>
          </Card>
          <Card className="p-4 bg-white">
            <p className="text-xs text-gray-500 uppercase">Qualidade</p>
            <p className="text-sm font-bold text-gray-900 mt-1">{sprint6Status.quality}</p>
          </Card>
          <Card className="p-4 bg-white">
            <p className="text-xs text-gray-500 uppercase">Velocity</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{sprint6Status.velocity}</p>
          </Card>
          <Card className="p-4 bg-white">
            <p className="text-xs text-gray-500 uppercase">Status</p>
            <div className="flex items-center gap-2 mt-2">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="font-bold text-green-600">READY</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Sprint 7 Planning */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">🚀 Sprint 7: Platform Expansion</h2>
        
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Período:</strong> 2026-03-12 até 2026-03-19 (8 dias) | <strong>Estimativa:</strong> 16 dias-dev | <strong>Risco:</strong> 🟡 Médio (Mobile)
          </p>
        </div>

        <div className="space-y-3">
          {sprint7Tasks.map(task => (
            <Card key={task.id} className="p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{task.name}</h3>
                    <Badge className={
                      task.priority === 'high' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                    }>
                      {task.priority === 'high' ? '🔴 Alta' : '🟡 Média'}
                    </Badge>
                    <Badge variant="outline">{task.estimatedDays}d</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{task.description}</p>
                  <p className="text-xs text-gray-500 mt-2">Dependências: {task.dependencies}</p>
                </div>
                <Badge className="bg-gray-100 text-gray-800 ml-4">Planejada</Badge>
              </div>
            </Card>
          ))}
        </div>

        {/* Key Metrics */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100">
            <Zap className="w-6 h-6 text-purple-600 mb-2" />
            <p className="font-medium text-gray-900">Estimativa Total</p>
            <p className="text-2xl font-bold text-purple-600 mt-1">16 dias-dev</p>
            <p className="text-xs text-gray-600 mt-1">Para 2 devs = 8 dias</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100">
            <TrendingUp className="w-6 h-6 text-blue-600 mb-2" />
            <p className="font-medium text-gray-900">Velocity</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">+6 pontos</p>
            <p className="text-xs text-gray-600 mt-1">Sprint 6: 31 pontos</p>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-amber-50 to-amber-100">
            <AlertCircle className="w-6 h-6 text-amber-600 mb-2" />
            <p className="font-medium text-gray-900">Risco</p>
            <p className="text-lg font-bold text-amber-600 mt-1">🟡 Médio</p>
            <p className="text-xs text-gray-600 mt-1">Mobile app é novo domínio</p>
          </Card>
        </div>

        {/* Critical Path */}
        <Card className="p-6 mt-6 border-2 border-amber-200">
          <h3 className="font-semibold text-gray-900 mb-3">⚠️ Critical Path</h3>
          <ol className="space-y-2 text-sm text-gray-700">
            <li>1️⃣ <strong>Semana 1:</strong> Search Filters + Billing (1.5d + 2d)</li>
            <li>2️⃣ <strong>Semana 2:</strong> Mobile App + Workflows (4d + 3d paralelo)</li>
            <li>3️⃣ <strong>Contingência:</strong> AI Copilot pode ser adiado se mobile atrasar</li>
          </ol>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex gap-3 justify-center pt-6">
        <button className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition">
          ✅ Validar Sprint 6
        </button>
        <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
          🚀 Iniciar Sprint 7
        </button>
      </div>
    </div>
  );
}