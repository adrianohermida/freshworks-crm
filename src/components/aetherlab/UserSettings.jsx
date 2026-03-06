import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Lock, Shield, Bell, Database } from 'lucide-react';

export default function UserSettings() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const [loading, setLoading] = useState(false);

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  if (!currentUser) return null;

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Update user profile
      await base44.auth.updateMe({
        // Update fields as needed
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
      {/* Header */}
      <div className={`py-8 px-4 sm:px-6 lg:px-8 transition-colors ${
        isDark ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-gray-50 to-gray-100'
      }`}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Configurações</h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Gerencie sua conta e preferências
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="security">Segurança</TabsTrigger>
            <TabsTrigger value="notifications">Notificações</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="data">Dados</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile">
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle>Informações do Perfil</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Nome Completo</label>
                  <Input value={currentUser.full_name || ''} disabled />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Email</label>
                  <Input value={currentUser.email} disabled />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Função</label>
                  <div className="flex items-center gap-2">
                    <Badge className={currentUser.role === 'admin' ? 'bg-blue-600' : 'bg-gray-600'}>
                      {currentUser.role.toUpperCase()}
                    </Badge>
                  </div>
                </div>
                <Button onClick={handleSaveProfile} disabled={loading}>
                  {loading ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security">
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Segurança da Conta
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`p-4 rounded-lg border ${
                  isDark ? 'border-gray-600 bg-gray-900' : 'border-gray-200 bg-gray-50'
                }`}>
                  <p className="font-semibold mb-2">Alterar Senha</p>
                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Recomenda-se alterar sua senha regularmente
                  </p>
                  <Button variant="outline">Alterar Senha</Button>
                </div>

                <div className={`p-4 rounded-lg border ${
                  isDark ? 'border-gray-600 bg-gray-900' : 'border-gray-200 bg-gray-50'
                }`}>
                  <p className="font-semibold mb-2">Autenticação de Dois Fatores</p>
                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Adicione uma camada extra de segurança à sua conta
                  </p>
                  <Button variant="outline">Ativar 2FA</Button>
                </div>

                <div className={`p-4 rounded-lg border ${
                  isDark ? 'border-gray-600 bg-gray-900' : 'border-gray-200 bg-gray-50'
                }`}>
                  <p className="font-semibold mb-2">Sessões Ativas</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Nenhuma outra sessão ativa
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications">
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Preferências de Notificações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="font-medium text-sm">Notificações de documentos</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="font-medium text-sm">Alertas de segurança</span>
                </label>
                <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="font-medium text-sm">Newsletter e atualizações</span>
                </label>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance">
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Conformidade e Regulamentações
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`p-4 rounded-lg border ${
                  isDark ? 'border-gray-600 bg-gray-900' : 'border-gray-200 bg-gray-50'
                }`}>
                  <p className="font-semibold mb-2">LGPD - Lei Geral de Proteção de Dados</p>
                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Seus dados são processados em conformidade com a LGPD brasileira.
                  </p>
                  <Badge className="bg-green-600 text-white">Compliant</Badge>
                </div>

                <div className={`p-4 rounded-lg border ${
                  isDark ? 'border-gray-600 bg-gray-900' : 'border-gray-200 bg-gray-50'
                }`}>
                  <p className="font-semibold mb-2">GDPR - Regulamento Geral de Proteção de Dados</p>
                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Conformidade com o GDPR europeu para processamento de dados.
                  </p>
                  <Badge className="bg-green-600 text-white">Compliant</Badge>
                </div>

                <div className={`p-4 rounded-lg border ${
                  isDark ? 'border-gray-600 bg-gray-900' : 'border-gray-200 bg-gray-50'
                }`}>
                  <p className="font-semibold mb-2">Assinatura Digital</p>
                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Suas assinaturas seguem as normas ICP-Brasil e padrões internacionais.
                  </p>
                  <Badge className="bg-green-600 text-white">Certificado</Badge>
                </div>

                <div>
                  <Button variant="outline" className="w-full">
                    Baixar Relatório de Conformidade
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Data Tab */}
          <TabsContent value="data">
            <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Dados Pessoais
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className={`p-4 rounded-lg border ${
                  isDark ? 'border-gray-600 bg-gray-900' : 'border-gray-200 bg-gray-50'
                }`}>
                  <p className="font-semibold mb-2">Exportar Meus Dados</p>
                  <p className={`text-sm mb-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Obtenha uma cópia de todos os seus dados em formato JSON
                  </p>
                  <Button variant="outline">Exportar Dados</Button>
                </div>

                <div className={`p-4 rounded-lg border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800`}>
                  <p className="font-semibold mb-2 text-red-900 dark:text-red-200">Deletar Conta</p>
                  <p className={`text-sm mb-4 text-red-800 dark:text-red-300`}>
                    Esta ação é irreversível. Todos os seus dados serão permanentemente deletados.
                  </p>
                  <Button variant="destructive">Deletar Conta</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}