import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2, Database, Bell, Shield, Settings, Users } from 'lucide-react';

export default function AdminSettings({ selectedUserType = 'admin', onUserTypeChange = () => {} }) {
  const [activeTab, setActiveTab] = useState('system');
  const [backupStatus, setBackupStatus] = useState('idle');
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleBackup = async () => {
    setBackupStatus('running');
    await new Promise(resolve => setTimeout(resolve, 2000));
    setBackupStatus('success');
    setTimeout(() => setBackupStatus('idle'), 3000);
  };

  const systemSettings = [
    { label: 'Timezone', value: 'America/Manaus', editable: true },
    { label: 'Language', value: 'Português (Brasil)', editable: true },
    { label: 'Theme', value: 'Light/Dark Auto', editable: true },
    { label: 'API Version', value: 'v1.0.0', editable: false },
    { label: 'Database Status', value: 'Connected', editable: false, status: 'success' }
  ];

  const featureFlags = [
    { name: 'Advanced Analytics', enabled: true, description: 'Análises avançadas e relatórios' },
    { name: 'WebSocket Sync', enabled: true, description: 'Sincronização em tempo real' },
    { name: 'AI Insights', enabled: false, description: 'Insights com IA' },
    { name: 'Beta Features', enabled: false, description: 'Acesso a recursos beta' },
    { name: 'Webhooks V2', enabled: true, description: 'API Webhooks v2' }
  ];

  const securitySettings = [
    { label: 'Two-Factor Auth', enabled: true, icon: Shield },
    { label: 'Session Timeout', value: '30 minutos', editable: true },
    { label: 'Password Policy', value: 'Strong', editable: true },
    { label: 'Last Audit Log', value: new Date().toLocaleDateString('pt-BR'), editable: false },
    { label: 'RLS Enforcement', enabled: true, icon: Shield }
  ];

  const notificationSettings = [
    { type: 'Email', enabled: true, frequency: 'Imediato' },
    { type: 'In-App', enabled: true, frequency: 'Imediato' },
    { type: 'SMS', enabled: false, frequency: 'N/A' },
    { type: 'Slack', enabled: true, frequency: 'Diário' }
  ];

  return (
    <div className="space-y-6">
      {/* Multi-tenant User Type Toggle */}
      <div className="flex items-center justify-between bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div>
          <p className="font-semibold text-sm text-blue-900">Visualizar como</p>
          <p className="text-xs text-blue-700 mt-1">Acompanhe a experiência de cada tipo de usuário</p>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-blue-600" />
          <select
            value={selectedUserType}
            onChange={(e) => onUserTypeChange(e.target.value)}
            className="text-sm font-medium border border-blue-300 bg-white rounded px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            <option value="admin">Admin</option>
            <option value="user">Usuário</option>
            <option value="viewer">Visualizador</option>
          </select>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {[
          { id: 'system', label: 'Sistema', icon: Settings },
          { id: 'security', label: 'Segurança', icon: Shield },
          { id: 'notifications', label: 'Notificações', icon: Bell },
          { id: 'backup', label: 'Backup', icon: Database }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-cyan-600 text-cyan-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* System Settings */}
      {activeTab === 'system' && (
        <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {systemSettings.map((setting, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{setting.label}</p>
                      <p className="text-sm text-gray-600">{setting.value}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {setting.status === 'success' && <CheckCircle2 className="w-5 h-5 text-green-600" />}
                      {setting.editable && (
                        <Button variant="outline" size="sm">Editar</Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Feature Flags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {featureFlags.map((flag, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{flag.name}</p>
                      <p className="text-xs text-gray-600">{flag.description}</p>
                    </div>
                    <Badge className={flag.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                      {flag.enabled ? 'Ativo' : 'Inativo'}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className={maintenanceMode ? 'border-orange-300 bg-orange-50' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Modo Manutenção</span>
                  <Badge className={maintenanceMode ? 'bg-orange-600' : 'bg-green-600'}>
                    {maintenanceMode ? 'ATIVO' : 'INATIVO'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Ativa o modo manutenção para impedir acesso dos usuários durante atualizações.
                </p>
                <Button
                  onClick={() => setMaintenanceMode(!maintenanceMode)}
                  className={maintenanceMode ? 'bg-orange-600' : 'bg-green-600'}
                >
                  {maintenanceMode ? 'Desativar Modo Manutenção' : 'Ativar Modo Manutenção'}
                </Button>
              </CardContent>
            </Card>
        </div>
      )}

      {/* Security Settings */}
      {activeTab === 'security' && (
        <Card>
            <CardHeader>
              <CardTitle>Configurações de Segurança</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {securitySettings.map((setting, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{setting.label}</p>
                    <p className="text-xs text-gray-600">{setting.value || (setting.enabled ? 'Ativo' : 'Inativo')}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {setting.enabled && <Shield className="w-5 h-5 text-green-600" />}
                    {setting.editable && <Button variant="outline" size="sm">Editar</Button>}
                  </div>
                </div>
              ))}
            </CardContent>
        </Card>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <Card>
            <CardHeader>
              <CardTitle>Canais de Notificação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {notificationSettings.map((notif, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded border">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{notif.type}</p>
                    <p className="text-xs text-gray-600">Frequência: {notif.frequency}</p>
                  </div>
                  <Badge className={notif.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                    {notif.enabled ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              ))}
            </CardContent>
        </Card>
      )}

      {/* Backup */}
      {activeTab === 'backup' && (
        <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Backup & Recuperação</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 rounded border border-blue-200">
                  <p className="text-sm text-blue-900 font-semibold">ℹ️ Backup Automático</p>
                  <p className="text-xs text-blue-700 mt-1">Backups automáticos executados diariamente às 02:00</p>
                </div>

                <div className="space-y-2">
                  <p className="font-semibold text-sm">Último Backup</p>
                  <p className="text-sm text-gray-600">{new Date().toLocaleString('pt-BR')}</p>
                  <p className="text-xs text-gray-500">Status: <Badge className="bg-green-100 text-green-800 ml-2">Sucesso</Badge></p>
                </div>

                <Button
                  onClick={handleBackup}
                  disabled={backupStatus === 'running'}
                  className="w-full"
                >
                  {backupStatus === 'running' ? 'Executando...' : 'Executar Backup Manual'}
                </Button>

                {backupStatus === 'success' && (
                  <div className="p-3 bg-green-50 rounded border border-green-200 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                    <p className="text-sm text-green-700">Backup executado com sucesso!</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Histórico de Backups</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {[...Array(5)].map((_, idx) => {
                    const date = new Date();
                    date.setDate(date.getDate() - idx);
                    return (
                      <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span>{date.toLocaleDateString('pt-BR')} - {date.toLocaleTimeString('pt-BR')}</span>
                        <Badge className="bg-green-100 text-green-800">Sucesso</Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}