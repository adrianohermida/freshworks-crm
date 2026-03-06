import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowRight, Zap, Shield, TrendingUp } from 'lucide-react';

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);

  const steps = [
    {
      number: 1,
      title: 'Bem-vindo ao Freshdesk Manager',
      description: 'Vamos configurar sua plataforma em 5 minutos',
      icon: Zap,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            O Freshdesk Manager é sua solução completa para gerenciar tickets, contatos e agentes.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Principais recursos:</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li>✅ Dashboard com KPIs em tempo real</li>
              <li>✅ Sincronização com Freshdesk</li>
              <li>✅ Análise de tickets com IA</li>
              <li>✅ Suporte offline completo</li>
              <li>✅ Multi-idioma e tema escuro</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      number: 2,
      title: 'Conectar Freshdesk',
      description: 'Autorize o acesso aos seus dados',
      icon: Shield,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Sua API key do Freshdesk já está configurada. Você pode sincronizar dados agora:
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">Status:</h3>
            <p className="text-sm text-green-800">✅ Freshdesk API conectada</p>
          </div>
          <Button className="w-full bg-green-600 hover:bg-green-700">
            Sincronizar Tickets Agora
          </Button>
        </div>
      )
    },
    {
      number: 3,
      title: 'Explorar Dashboard',
      description: 'Veja suas métricas e dados em tempo real',
      icon: TrendingUp,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            O Dashboard mostra um resumo completo:
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-3 rounded border">
              <p className="text-xs text-gray-600">Total de Tickets</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border">
              <p className="text-xs text-gray-600">Abertos</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border">
              <p className="text-xs text-gray-600">Resolvidos</p>
              <p className="text-2xl font-bold">0</p>
            </div>
            <div className="bg-gray-50 p-3 rounded border">
              <p className="text-xs text-gray-600">Pendentes</p>
              <p className="text-2xl font-bold">0</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3">Os dados aparecerão após sincronização</p>
        </div>
      )
    },
    {
      number: 4,
      title: 'Próximos Passos',
      description: 'Configure suas preferências',
      icon: Zap,
      content: (
        <div className="space-y-4">
          <p className="text-gray-600">
            Personalize a plataforma conforme suas necessidades:
          </p>
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium">Ir para Configurações</p>
                <p className="text-sm text-gray-600">Configure automações, templates e webhooks</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium">Explorar Documentação</p>
                <p className="text-sm text-gray-600">Leia nossos guias e melhores práticas</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <p className="font-medium">Entrar em Contato</p>
                <p className="text-sm text-gray-600">Equipe de suporte pronta para ajudar</p>
              </div>
            </div>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep - 1];
  const Icon = currentStepData.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">🎉 Bem-vindo!</h1>
          <p className="text-gray-600">Vamos começar com o Freshdesk Manager</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {steps.map((step, idx) => (
              <div
                key={idx}
                className={`flex-1 h-2 mx-1 rounded-full ${
                  idx + 1 <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 text-center">
            Passo {currentStep} de {steps.length}
          </p>
        </div>

        {/* Card */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                <Icon className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
                <p className="text-gray-600 text-sm">{currentStepData.description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {currentStepData.content}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="flex-1"
          >
            ← Anterior
          </Button>
          <Button
            onClick={() => {
              if (currentStep === steps.length) {
                window.location.href = '/?page=Dashboard';
              } else {
                setCurrentStep(Math.min(steps.length, currentStep + 1));
              }
            }}
            className="flex-1 bg-blue-600 hover:bg-blue-700"
          >
            {currentStep === steps.length ? (
              <>Ir para Dashboard</>
            ) : (
              <>
                Próximo <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>

        {/* Skip */}
        <button
          onClick={() => window.location.href = '/?page=Dashboard'}
          className="w-full mt-4 text-gray-600 hover:text-gray-900 text-sm"
        >
          Pular onboarding
        </button>
      </div>
    </div>
  );
}