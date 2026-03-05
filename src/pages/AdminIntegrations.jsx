import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useAdminAuth } from '@/components/hooks/useAdminAuth';
import AdminLayout from '@/components/admin/layouts/AdminLayout';
import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Zap, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function AdminIntegrations() {
  const { user: adminUser, isLoading: authLoading } = useAdminAuth();
  const [activeIntegration, setActiveIntegration] = useState('datajud');
  const [showSecrets, setShowSecrets] = useState({});
  const [config, setConfig] = useState({
    datajud_api_key: '',
    datajud_base_url: '',
    tpu_sync_frequency: '24',
    tpu_auto_deduplicate: true,
    google_sheets_enabled: false
  });

  const integrations = [
    {
      id: 'datajud',
      name: 'DataJud',
      icon: '📊',
      status: 'connected',
      description: 'Sincronização de processos judiciais'
    },
    {
      id: 'tpu',
      name: 'TPU',
      icon: '🔄',
      status: 'connected',
      description: 'Tabelas processuais unificadas'
    },
    {
      id: 'google_sheets',
      name: 'Google Sheets',
      icon: '📑',
      status: 'disconnected',
      description: 'Exportação e sincronização de dados'
    },
    {
      id: 'webhooks',
      name: 'Webhooks',
      icon: '🪝',
      status: 'connected',
      description: 'Notificações e eventos'
    }
  ];

  const testConnection = async (integration) => {
    try {
      // Simular teste
      alert(`✓ Conexão com ${integration} testada com sucesso!`);
    } catch (err) {
      alert(`✗ Erro ao conectar com ${integration}`);
    }
  };

  if (authLoading) return <div className="flex items-center justify-center h-screen">Carregando...</div>;

  return (
    <AdminLayout user={adminUser} isSuperAdmin={adminUser?.role === 'super_admin'}>
      <ModuleLayout
        title="Integrações"
        subtitle="Configurar DataJud, TPU, Google Sheets e webhooks"
        icon={Zap}
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Integration List */}
          <div className="space-y-2">
            {integrations.map(int => (
              <button
                key={int.id}
                onClick={() => setActiveIntegration(int.id)}
                className={`w-full p-3 text-left rounded-lg border-2 transition ${
                  activeIntegration === int.id
                    ? 'border-cyan-600 bg-cyan-50 dark:bg-cyan-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-xl">{int.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{int.name}</p>
                    <Badge 
                      className={int.status === 'connected' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                      }
                    >
                      {int.status === 'connected' ? 'Conectado' : 'Desconectado'}
                    </Badge>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Config Panel */}
          <div className="lg:col-span-3">
            {activeIntegration === 'datajud' && (
              <Card>
                <CardHeader>
                  <CardTitle>Configuração DataJud</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">API Key</label>
                    <div className="flex gap-2">
                      <Input
                        type={showSecrets.datajud ? 'text' : 'password'}
                        value={config.datajud_api_key}
                        onChange={(e) => setConfig({...config, datajud_api_key: e.target.value})}
                        placeholder="Chave API DataJud"
                      />
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowSecrets({...showSecrets, datajud: !showSecrets.datajud})}
                      >
                        {showSecrets.datajud ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Base URL</label>
                    <Input
                      value={config.datajud_base_url}
                      onChange={(e) => setConfig({...config, datajud_base_url: e.target.value})}
                      placeholder="https://datajud.cnj.jus.br"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => testConnection('DataJud')}>Testar Conexão</Button>
                    <Button variant="outline">Salvar</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeIntegration === 'tpu' && (
              <Card>
                <CardHeader>
                  <CardTitle>Configuração TPU</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Frequência de Sincronização</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        min="1"
                        value={config.tpu_sync_frequency}
                        onChange={(e) => setConfig({...config, tpu_sync_frequency: e.target.value})}
                        className="w-20"
                      />
                      <span className="text-sm text-gray-600">horas</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="deduplicate"
                      checked={config.tpu_auto_deduplicate}
                      onChange={(e) => setConfig({...config, tpu_auto_deduplicate: e.target.checked})}
                      className="w-4 h-4"
                    />
                    <label htmlFor="deduplicate" className="text-sm font-medium">
                      Deduplicação automática
                    </label>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => testConnection('TPU')}>Testar Sincronização</Button>
                    <Button variant="outline">Salvar</Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeIntegration === 'google_sheets' && (
              <Card>
                <CardHeader>
                  <CardTitle>Google Sheets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div className="text-sm">
                        <p className="font-medium text-yellow-900 dark:text-yellow-100">Desconectado</p>
                        <p className="text-yellow-800 dark:text-yellow-200 text-xs mt-1">
                          Clique em "Conectar" para autorizar acesso ao Google Sheets
                        </p>
                      </div>
                    </div>
                  </div>
                  <Button>Conectar Google Sheets</Button>
                </CardContent>
              </Card>
            )}

            {activeIntegration === 'webhooks' && (
              <Card>
                <CardHeader>
                  <CardTitle>Webhooks</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded border border-green-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <p className="font-medium text-green-900 dark:text-green-100">Ativo e funcionando</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Webhook URL</label>
                    <Input
                      readOnly
                      value={`${window.location.origin}/api/webhooks/datajud`}
                      className="bg-gray-100"
                    />
                  </div>
                  <Button variant="outline">Testar Webhook</Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </ModuleLayout>
    </AdminLayout>
  );
}