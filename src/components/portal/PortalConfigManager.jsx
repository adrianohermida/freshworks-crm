import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Save } from 'lucide-react';

export default function PortalConfigManager() {
  const queryClient = useQueryClient();
  const [config, setConfig] = useState({
    name: '',
    description: '',
    logo_url: '',
    theme_color: '#3B82F6',
    enable_kb: true,
    enable_ticket_creation: true,
    enable_ticket_tracking: true,
    enable_surveys: false,
    custom_domain: '',
    welcome_message: '',
    is_active: true
  });

  const { data: existingConfig, isLoading } = useQuery({
    queryKey: ['portalConfig'],
    queryFn: async () => {
      const configs = await base44.entities.CustomerPortalConfig.list();
      return configs?.[0] || null;
    }
  });

  React.useEffect(() => {
    if (existingConfig) {
      setConfig(existingConfig);
    }
  }, [existingConfig]);

  const saveMutation = useMutation({
    mutationFn: async (data) => {
      if (existingConfig?.id) {
        return base44.entities.CustomerPortalConfig.update(existingConfig.id, data);
      }
      return base44.entities.CustomerPortalConfig.create(data);
    },
    onSuccess: () => {
      toast.success('✅ Configurações salvas!');
      queryClient.invalidateQueries({ queryKey: ['portalConfig'] });
    },
    onError: (error) => {
      toast.error('❌ Erro: ' + error.message);
    }
  });

  const handleSave = () => {
    if (!config.name.trim()) {
      toast.error('Digite um nome para o portal');
      return;
    }
    saveMutation.mutate(config);
  };

  if (isLoading) {
    return <p className="text-center text-gray-500 py-8">Carregando configurações...</p>;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>⚙️ Configurar Portal do Cliente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Nome do Portal</label>
              <Input
                value={config.name}
                onChange={(e) => setConfig({ ...config, name: e.target.value })}
                placeholder="Ex: Suporte ABC"
                className="mt-1"
              />
            </div>

            <div>
              <label className="text-sm font-medium">Cor do Tema</label>
              <div className="flex gap-2 mt-1">
                <Input
                  type="color"
                  value={config.theme_color}
                  onChange={(e) => setConfig({ ...config, theme_color: e.target.value })}
                  className="w-16 h-10 p-1"
                />
                <Input
                  value={config.theme_color}
                  onChange={(e) => setConfig({ ...config, theme_color: e.target.value })}
                  className="flex-1"
                  placeholder="#3B82F6"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium">Logo (URL)</label>
            <Input
              value={config.logo_url}
              onChange={(e) => setConfig({ ...config, logo_url: e.target.value })}
              placeholder="https://example.com/logo.png"
              className="mt-1"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Descrição</label>
            <Textarea
              value={config.description}
              onChange={(e) => setConfig({ ...config, description: e.target.value })}
              placeholder="Descrição do seu portal"
              className="mt-1 h-24"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Mensagem de Boas-vindas</label>
            <Textarea
              value={config.welcome_message}
              onChange={(e) => setConfig({ ...config, welcome_message: e.target.value })}
              placeholder="Bem-vindo ao nosso centro de atendimento..."
              className="mt-1 h-20"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Domínio Customizado (opcional)</label>
            <Input
              value={config.custom_domain}
              onChange={(e) => setConfig({ ...config, custom_domain: e.target.value })}
              placeholder="support.seudominio.com.br"
              className="mt-1"
            />
          </div>

          <div className="space-y-3 border-t pt-4">
            <h4 className="font-medium text-sm">Recursos do Portal</h4>
            
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={config.enable_kb}
                onCheckedChange={(checked) => setConfig({ ...config, enable_kb: checked })}
              />
              <span className="text-sm">Habilitar Base de Conhecimento</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={config.enable_ticket_creation}
                onCheckedChange={(checked) => setConfig({ ...config, enable_ticket_creation: checked })}
              />
              <span className="text-sm">Habilitar Criação de Tickets</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={config.enable_ticket_tracking}
                onCheckedChange={(checked) => setConfig({ ...config, enable_ticket_tracking: checked })}
              />
              <span className="text-sm">Habilitar Rastreamento de Tickets</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={config.enable_surveys}
                onCheckedChange={(checked) => setConfig({ ...config, enable_surveys: checked })}
              />
              <span className="text-sm">Habilitar Pesquisas de Satisfação</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={config.is_active}
                onCheckedChange={(checked) => setConfig({ ...config, is_active: checked })}
              />
              <span className="text-sm">Portal Ativo</span>
            </label>
          </div>

          <Button
            onClick={handleSave}
            disabled={saveMutation.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 gap-2"
          >
            <Save className="w-4 h-4" />
            Salvar Configurações
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}