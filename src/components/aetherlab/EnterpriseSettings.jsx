import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Lock, Users, Shield, Settings } from 'lucide-react';
import SSOConfigManager from '@/components/SSOConfigManager';
import MultiTenantIsolation from '@/components/MultiTenantIsolation';
import ComplianceDashboard from '@/components/ComplianceDashboard';
import SlackIntegrationManager from '@/components/SlackIntegrationManager';
import TeamsIntegrationManager from '@/components/TeamsIntegrationManager';
import GerenciadorWebhooks from '@/components/GerenciadorWebhooks';
import PushNotificationManager from '@/components/PushNotificationManager';
import OfflineSyncManager from '@/components/OfflineSyncManager';

export default function EnterpriseSettings() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className={`min-h-screen flex items-center justify-center p-4 transition-colors ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardContent className="p-8 text-center">
            <Lock className="w-12 h-12 mx-auto mb-4 text-red-600" />
            <h2 className="text-2xl font-bold mb-2">Acesso Restrito</h2>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Apenas administradores podem acessar configurações de empresa.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
      {/* Header */}
      <div className={`py-8 px-4 sm:px-6 lg:px-8 transition-colors ${isDark ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-gray-50 to-gray-100'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold">Configurações Enterprise</h1>
          </div>
          <Badge className="bg-blue-600 mt-2">Admin Panel</Badge>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Tabs defaultValue="sso" className="space-y-6">
          <TabsList className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <TabsTrigger value="sso" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              SSO
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Segurança
            </TabsTrigger>
            <TabsTrigger value="multitenancy" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Multi-Tenant
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Compliance
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Integrações
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Usuários
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Webhooks
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Notificações
            </TabsTrigger>
            <TabsTrigger value="offline" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Offline
            </TabsTrigger>
            </TabsList>

          {/* SSO Tab */}
          <TabsContent value="sso">
            <SSOConfigManager />
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle>Configurações de Segurança</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className={`p-4 rounded-lg border ${isDark ? 'border-gray-600 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
                    <p className="font-semibold mb-2">2FA Enforcement</p>
                    <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Forçar autenticação de dois fatores para todos os usuários
                    </p>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Ativar 2FA obrigatório</span>
                    </label>
                  </div>

                  <div className={`p-4 rounded-lg border ${isDark ? 'border-gray-600 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
                    <p className="font-semibold mb-2">IP Whitelist</p>
                    <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Restringir acesso apenas a IPs específicos
                    </p>
                    <button className="text-sm text-blue-600 hover:underline">Configurar IPs</button>
                  </div>

                  <div className={`p-4 rounded-lg border ${isDark ? 'border-gray-600 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
                    <p className="font-semibold mb-2">Data Encryption</p>
                    <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      AES-256-GCM com rotação automática de chaves
                    </p>
                    <Badge className="bg-green-600 text-xs">Ativo</Badge>
                  </div>

                  <div className={`p-4 rounded-lg border ${isDark ? 'border-gray-600 bg-gray-900' : 'border-gray-200 bg-gray-50'}`}>
                    <p className="font-semibold mb-2">Session Timeout</p>
                    <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Logout automático após inatividade
                    </p>
                    <select className={`w-full px-2 py-1 rounded text-sm ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'} border`}>
                      <option>15 minutos</option>
                      <option>30 minutos</option>
                      <option>1 hora</option>
                      <option>Nunca</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Multi-Tenancy Tab */}
          <TabsContent value="multitenancy">
            <MultiTenantIsolation />
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance">
            <ComplianceDashboard />
          </TabsContent>

          {/* Integrations Tab */}
          <TabsContent value="integrations" className="space-y-6">
            <SlackIntegrationManager />
            <div className="border-t border-gray-700 pt-6" />
            <TeamsIntegrationManager />
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle>Gerenciamento de Usuários</CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Vá para <strong>Usuários</strong> na navegação principal para gerenciar equipe e permissões.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Webhooks Tab */}
          <TabsContent value="webhooks">
            <GerenciadorWebhooks />
          </TabsContent>

          {/* Push Notifications Tab */}
          <TabsContent value="notifications">
            <PushNotificationManager />
          </TabsContent>

          {/* Offline Sync Tab */}
          <TabsContent value="offline">
            <OfflineSyncManager />
          </TabsContent>
          </Tabs>
      </div>
    </div>
  );
}