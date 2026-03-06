import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Zap, Shield, BookOpen } from 'lucide-react';

export default function DeploymentGuide() {
  const [activeStep, setActiveStep] = useState('pre-deployment');

  const steps = {
    'pre-deployment': {
      title: '🔍 Pré-Deployment',
      checks: [
        { item: 'Todos os testes passando', status: 'done' },
        { item: 'LGPD compliance check', status: 'done' },
        { item: 'Security scan (OWASP)', status: 'done' },
        { item: 'Performance profiling', status: 'done' },
        { item: 'Backup do banco de dados', status: 'done' },
        { item: 'Rollback plan documentado', status: 'done' }
      ]
    },
    'deployment': {
      title: '🚀 Deployment',
      checks: [
        { item: 'Build Docker image', status: 'pending' },
        { item: 'Push para container registry', status: 'pending' },
        { item: 'Update Kubernetes manifests', status: 'pending' },
        { item: 'Execute migration scripts', status: 'pending' },
        { item: 'Health check endpoints', status: 'pending' },
        { item: 'Smoke tests em prod', status: 'pending' }
      ]
    },
    'post-deployment': {
      title: '✅ Pós-Deployment',
      checks: [
        { item: 'Monitorar logs e métricas', status: 'todo' },
        { item: 'Validar SLA metrics', status: 'todo' },
        { item: 'Feedback dos usuários', status: 'todo' },
        { item: 'Documentar issues', status: 'todo' },
        { item: 'Playbook de incident', status: 'todo' }
      ]
    }
  };

  const getIcon = (status) => {
    switch(status) {
      case 'done': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'pending': return <Zap className="w-5 h-5 text-yellow-600" />;
      case 'todo': return <AlertCircle className="w-5 h-5 text-gray-400" />;
      default: return null;
    }
  };

  const currentStep = steps[activeStep];

  return (
    <div className="space-y-4">
      {/* Navigation */}
      <div className="flex gap-2 flex-wrap">
        {Object.keys(steps).map(key => (
          <button
            key={key}
            onClick={() => setActiveStep(key)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition ${
              activeStep === key
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {steps[key].title.split(' ')[0]}
          </button>
        ))}
      </div>

      {/* Checklist */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{currentStep.title}</h2>
        
        <div className="space-y-3">
          {currentStep.checks.map((check, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">{check.item}</span>
              <div className="flex items-center gap-2">
                {getIcon(check.status)}
                <Badge className={
                  check.status === 'done' ? 'bg-green-100 text-green-800' :
                  check.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-gray-100 text-gray-800'
                }>
                  {check.status === 'done' ? 'Feito' : check.status === 'pending' ? 'Em progresso' : 'A fazer'}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {activeStep === 'pre-deployment' && (
          <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800">
              ✅ <strong>Pronto para deploy!</strong> Todos os pré-requisitos foram atendidos.
            </p>
          </div>
        )}

        {activeStep === 'deployment' && (
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ <strong>Deploy em andamento.</strong> Monitorar logs em tempo real.
            </p>
          </div>
        )}

        {activeStep === 'post-deployment' && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              🔍 <strong>Validação pós-deploy.</strong> Aguardando métricas de 24h.
            </p>
          </div>
        )}
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-4 cursor-pointer hover:shadow-lg transition">
          <Shield className="w-6 h-6 text-blue-600 mb-2" />
          <p className="text-xs font-medium text-gray-900">Security</p>
          <p className="text-xs text-gray-500 mt-1">Guia de segurança</p>
        </Card>
        
        <Card className="p-4 cursor-pointer hover:shadow-lg transition">
          <BookOpen className="w-6 h-6 text-green-600 mb-2" />
          <p className="text-xs font-medium text-gray-900">Docs</p>
          <p className="text-xs text-gray-500 mt-1">Documentação</p>
        </Card>

        <Card className="p-4 cursor-pointer hover:shadow-lg transition">
          <Zap className="w-6 h-6 text-yellow-600 mb-2" />
          <p className="text-xs font-medium text-gray-900">Incident</p>
          <p className="text-xs text-gray-500 mt-1">Playbook</p>
        </Card>

        <Card className="p-4 cursor-pointer hover:shadow-lg transition">
          <AlertCircle className="w-6 h-6 text-red-600 mb-2" />
          <p className="text-xs font-medium text-gray-900">Support</p>
          <p className="text-xs text-gray-500 mt-1">Contato SRE</p>
        </Card>
      </div>
    </div>
  );
}