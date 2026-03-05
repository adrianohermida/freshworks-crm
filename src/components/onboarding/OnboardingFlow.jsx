import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ChevronRight, CheckCircle2, Target, Zap, BookOpen } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const ONBOARDING_STEPS = [
  {
    step: 1,
    title: '👋 Bem-vindo ao DataJud!',
    description: 'Integrador CNJ para acompanhamento de processos judiciais em tempo real.',
    icon: '🎯',
    content: (
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-300">
          O DataJud conecta você aos dados mais atualizados dos tribunais brasileiros através da API do CNJ.
        </p>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <li className="flex gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>Sincronize processos com um clique</span>
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>Receba notificações de movimentos em tempo real</span>
          </li>
          <li className="flex gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
            <span>Gerencie prazos e publications automaticamente</span>
          </li>
        </ul>
      </div>
    )
  },
  {
    step: 2,
    title: '➕ Adicionar seu Primeiro Processo',
    description: 'Vamos sincronizar um processo do tribunal.',
    icon: '📋',
    content: (
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-300">
          Clique em "Adicionar Processo" e insira o número CNJ de um processo.
        </p>
        <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
          <p className="text-sm font-mono text-blue-900 dark:text-blue-100">
            Formato: NNNNNNN-DD.AAAA.J.TT.OOOO.OOOOOO
          </p>
          <p className="text-xs text-blue-800 dark:text-blue-200 mt-2">
            Exemplo: 0000001-00.0000.0.00035.0000000
          </p>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          O sistema vai buscar automaticamente no DataJud e sincronizar todos os movimentos.
        </p>
      </div>
    )
  },
  {
    step: 3,
    title: '⚙️ Configure suas Preferências',
    description: 'Personalize notificações e autorizações.',
    icon: '🔔',
    content: (
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-300">
          Acesse "Configurações" para:
        </p>
        <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
          <li className="flex gap-2">
            <span className="text-cyan-600">✓</span>
            <span>Habilitar notificações por email/WhatsApp</span>
          </li>
          <li className="flex gap-2">
            <span className="text-cyan-600">✓</span>
            <span>Gerenciar prazos e alertas</span>
          </li>
          <li className="flex gap-2">
            <span className="text-cyan-600">✓</span>
            <span>Testar conectividade com endpoints DataJud</span>
          </li>
          <li className="flex gap-2">
            <span className="text-cyan-600">✓</span>
            <span>Sincronizar tabelas TPU (Assuntos, Classes, Movimentos)</span>
          </li>
        </ul>
      </div>
    )
  }
];

export default function OnboardingFlow() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    // Verificar se usuário já completou onboarding
    const checkOnboarding = async () => {
      try {
        const user = await base44.auth.me();
        const userData = await base44.auth.updateMe({ onboarding_completed: false });
        setIsOpen(!userData?.onboarding_completed);
      } catch {
        setIsOpen(true);
      }
    };

    checkOnboarding();
  }, []);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    try {
      await base44.auth.updateMe({ onboarding_completed: true });
      setCompleted(true);
      setTimeout(() => setIsOpen(false), 1000);
    } catch (error) {
      console.error('Erro ao completar onboarding:', error);
    }
  };

  const step = ONBOARDING_STEPS[currentStep];
  const progress = ((currentStep + 1) / ONBOARDING_STEPS.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-lg dark:bg-gray-800 dark:border-gray-700">
        {completed ? (
          // Success screen
          <div className="text-center py-12 space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                Pronto para começar!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Você está preparado para usar o DataJud ao máximo.
              </p>
            </div>
            <Button
              onClick={() => setIsOpen(false)}
              className="w-full bg-cyan-600 hover:bg-cyan-700"
            >
              Começar Agora
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-4xl">{step.icon}</span>
                <span className="text-sm font-semibold text-cyan-600">
                  Passo {step.step} de {ONBOARDING_STEPS.length}
                </span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {step.title}
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {step.description}
              </p>
            </div>

            {/* Progress bar */}
            <div className="space-y-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-cyan-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Content */}
            <div className="min-h-[200px]">
              {step.content}
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-between">
              <Button
                variant="outline"
                onClick={() => setIsOpen(false)}
                className="dark:border-gray-600 dark:hover:bg-gray-700"
              >
                Pular
              </Button>
              <div className="flex gap-2">
                {currentStep > 0 && (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="dark:border-gray-600 dark:hover:bg-gray-700"
                  >
                    Voltar
                  </Button>
                )}
                <Button
                  onClick={handleNext}
                  className="gap-2 bg-cyan-600 hover:bg-cyan-700"
                >
                  {currentStep === ONBOARDING_STEPS.length - 1 ? (
                    <>Completar</>
                  ) : (
                    <>
                      Próximo
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}