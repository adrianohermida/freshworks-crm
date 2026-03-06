import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Zap, Settings } from 'lucide-react';
import AdviseConfigForm from '../components/advise/AdviseConfigForm';

const STEPS = {
  SETUP: 'setup',
  CONFIGURE: 'configure',
  SUCCESS: 'success'
};

export default function AdviseIntegrationPage() {
  const [currentStep, setCurrentStep] = useState(STEPS.SETUP);
  const [config, setConfig] = useState(null);
  const queryClient = useQueryClient();

  // Fetch existing config
  const { data: existingConfig } = useQuery({
    queryKey: ['adviseConfig'],
    queryFn: async () => {
      const configs = await base44.entities.AdviseConfig.list();
      return configs.length > 0 ? configs[0] : null;
    }
  });

  useEffect(() => {
    if (existingConfig) {
      setConfig(existingConfig);
      setCurrentStep(STEPS.SUCCESS);
    }
  }, [existingConfig]);

  // Save config mutation
  const saveConfigMutation = useMutation({
    mutationFn: async (configData) => {
      if (config?.id) {
        return await base44.entities.AdviseConfig.update(config.id, configData);
      } else {
        return await base44.entities.AdviseConfig.create(configData);
      }
    },
    onSuccess: (savedConfig) => {
      setConfig(savedConfig);
      setCurrentStep(STEPS.SUCCESS);
      queryClient.invalidateQueries({ queryKey: ['adviseConfig'] });
    }
  });

  const handleSaveConfig = (formData) => {
    saveConfigMutation.mutate(formData);
  };

  const handleResetSetup = () => {
    setCurrentStep(STEPS.SETUP);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
              <Zap className="w-5 h-5 text-orange-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Integração Advise</h1>
          </div>
          <p className="text-gray-600">Configure a sincronização de publicações e processos da plataforma Advise</p>
        </div>

        {/* Steps Indicator */}
        {currentStep !== STEPS.SUCCESS && (
          <div className="mb-8">
            <div className="flex items-center gap-4">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${currentStep === STEPS.SETUP ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                1
              </div>
              <div className="text-sm">
                <p className="font-medium">Bem-vindo</p>
                <p className="text-gray-500 text-xs">Saiba o que você pode fazer</p>
              </div>

              <div className="flex-1 h-px bg-gray-300"></div>

              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${currentStep === STEPS.CONFIGURE ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
                2
              </div>
              <div className="text-sm">
                <p className="font-medium">Configurar</p>
                <p className="text-gray-500 text-xs">Adicione suas credenciais</p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        {currentStep === STEPS.SETUP && (
          <Card>
            <CardHeader>
              <CardTitle>Bem-vindo ao Setup Advise</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium">Necessário: Token da API Advise</p>
                  <p className="text-xs mt-1">Você precisa gerar um token no console do Advise antes de prosseguir.</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">O que você pode fazer:</h3>
                
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Sincronizar Publicações</p>
                      <p className="text-xs text-gray-600">Acompanhe publicações no Diário Oficial e crie tarefas automaticamente</p>
                    </div>
                  </div>

                  <div className="flex gap-3 opacity-50">
                    <CheckCircle2 className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Sincronizar Intimações (Em breve)</p>
                      <p className="text-xs text-gray-600">Monitore intimações e prazos de seus processos</p>
                    </div>
                  </div>

                  <div className="flex gap-3 opacity-50">
                    <CheckCircle2 className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm">Sincronizar Processos (Em breve)</p>
                      <p className="text-xs text-gray-600">Acompanhe andamentos e informações completas dos processos</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-900">
                  <strong>Como obter o Token:</strong> Acesse a plataforma Advise, vá para "Integrações" → "API" e gere um novo token. Copie o valor completo do token.
                </p>
              </div>

              <Button
                onClick={() => setCurrentStep(STEPS.CONFIGURE)}
                className="w-full"
                size="lg"
              >
                Prosseguir para Configuração
              </Button>
            </CardContent>
          </Card>
        )}

        {currentStep === STEPS.CONFIGURE && (
          <AdviseConfigForm
            config={config}
            onSave={handleSaveConfig}
            isLoading={saveConfigMutation.isPending}
          />
        )}

        {currentStep === STEPS.SUCCESS && config && (
          <div className="space-y-6">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="w-8 h-8 text-green-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-green-900 text-lg">Integração Ativada com Sucesso!</h3>
                    <p className="text-green-800 text-sm mt-1">Sua integração Advise está funcionando corretamente.</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Status da Configuração</span>
                  <Badge className={config.statusConexao === 'conectado' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {config.statusConexao === 'conectado' ? '✓ Conectado' : 'Aguardando'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Ambiente</p>
                    <p className="font-medium capitalize">{config.ambiente}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Frequência de Sincronização</p>
                    <p className="font-medium capitalize">{config.frequenciaSync}</p>
                  </div>
                  {config.nomeEmpresa && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">Empresa</p>
                      <p className="font-medium">{config.nomeEmpresa}</p>
                    </div>
                  )}
                  {config.ultimaSincronizacao && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500">Última Sincronização</p>
                      <p className="font-medium">{new Date(config.ultimaSincronizacao).toLocaleString('pt-BR')}</p>
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium mb-2">Módulos Ativos</p>
                  <div className="flex gap-2 flex-wrap">
                    {config.syncPublicacoes && (
                      <Badge className="bg-blue-100 text-blue-800">Publicações</Badge>
                    )}
                    {config.syncIntimacoes && (
                      <Badge className="bg-purple-100 text-purple-800">Intimações</Badge>
                    )}
                    {config.syncProcessos && (
                      <Badge className="bg-green-100 text-green-800">Processos</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => window.location.href = '/Tarefas'}
                variant="outline"
                className="w-full"
              >
                Ver Tarefas
              </Button>
              <Button
                onClick={handleResetSetup}
                variant="outline"
                className="w-full flex items-center justify-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Reconfigurar
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}