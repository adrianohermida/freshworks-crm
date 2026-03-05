import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { useTheme } from 'next-themes';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Users, Settings, BarChart3, FileText, Lock, Zap, Database } from 'lucide-react';

function QuickStats({ isDark }) {
  const { data: auditLogs = [] } = useQuery({
    queryKey: ['adminStatsLogs'],
    queryFn: () => base44.entities.AuditLog.list('-timestamp', 500),
    initialData: []
  });

  const { data: users = [] } = useQuery({
    queryKey: ['adminStatsUsers'],
    queryFn: () => base44.entities.User.list(),
    initialData: []
  });

  const usuariosAtivos = new Set(auditLogs.map(log => log.usuario)).size;
  const documentosAssinados = auditLogs.filter(log => log.acao === 'DOCUMENTO_ASSINADO').length;

  return (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{usuariosAtivos}</div>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Usuários Ativos</p>
          </div>
        </CardContent>
      </Card>
      <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{documentosAssinados}</div>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Documentos Assinados</p>
          </div>
        </CardContent>
      </Card>
      <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
        <CardContent className="pt-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">100%</div>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Compliance Status</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AdminHub() {
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
              Apenas administradores podem acessar este painel.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const adminSections = [
    {
      title: 'Usuários & Permissões',
      icon: Users,
      color: 'blue',
      items: [
        { label: 'Gerenciar Usuários', path: 'UserManagement' },
        { label: 'Permissões & Roles', path: 'EnterpriseSettings', section: 'security' },
        { label: 'Convites Pendentes', path: 'UserManagement' }
      ]
    },
    {
      title: 'Configurações',
      icon: Settings,
      color: 'purple',
      items: [
        { label: 'Configurações Enterprise', path: 'EnterpriseSettings' },
        { label: 'SSO & Autenticação', path: 'EnterpriseSettings', section: 'sso' },
        { label: 'Webhooks', path: 'EnterpriseSettings', section: 'webhooks' }
      ]
    },
    {
      title: 'Segurança & Compliance',
      icon: Shield,
      color: 'red',
      items: [
        { label: 'Audit Logs', path: 'EnterpriseSettings', section: 'compliance' },
        { label: 'Compliance LGPD/GDPR', path: 'ComplianceCenter' },
        { label: 'Certificados & Criptografia', path: 'EnterpriseSettings' }
      ]
    },
    {
      title: 'Analytics & Relatórios',
      icon: BarChart3,
      color: 'green',
      items: [
        { label: 'Dashboard Analytics', path: 'DashboardAnalytics' },
        { label: 'Relatórios de Assinatura', path: 'DashboardAnalytics' },
        { label: 'Métricas de Performance', path: 'DashboardAnalytics' }
      ]
    },
    {
      title: 'Documentos & Templates',
      icon: FileText,
      color: 'yellow',
      items: [
        { label: 'Biblioteca de Templates', path: 'BibliotecaTemplates' },
        { label: 'Documentos Registrados', path: 'MeusDocumentos' },
        { label: 'Histórico de Versões', path: 'MeusDocumentos' }
      ]
    },
    {
      title: 'Integrações',
      icon: Zap,
      color: 'orange',
      items: [
        { label: 'Integrações Ativas', path: 'EnterpriseSettings', section: 'integrations' },
        { label: 'Configurar Zapier', path: 'EnterpriseSettings' },
        { label: 'WhatsApp Business', path: 'EnterpriseSettings' }
      ]
    },
    {
      title: 'Blockchain & Registro',
      icon: Database,
      color: 'indigo',
      items: [
        { label: 'Registro Blockchain', path: 'BlockchainRegistry' },
        { label: 'Verificação de Hash', path: 'BlockchainRegistry' },
        { label: 'Histórico de Transações', path: 'MeusDocumentos' }
      ]
    }
  ];

  const colorClasses = {
    blue: 'hover:border-blue-300 dark:hover:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20',
    purple: 'hover:border-purple-300 dark:hover:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-900/20',
    red: 'hover:border-red-300 dark:hover:border-red-800 hover:bg-red-50 dark:hover:bg-red-900/20',
    green: 'hover:border-green-300 dark:hover:border-green-800 hover:bg-green-50 dark:hover:bg-green-900/20',
    yellow: 'hover:border-yellow-300 dark:hover:border-yellow-800 hover:bg-yellow-50 dark:hover:bg-yellow-900/20',
    orange: 'hover:border-orange-300 dark:hover:border-orange-800 hover:bg-orange-50 dark:hover:bg-orange-900/20',
    indigo: 'hover:border-indigo-300 dark:hover:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/20'
  };

  const iconColorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    purple: 'text-purple-600 dark:text-purple-400',
    red: 'text-red-600 dark:text-red-400',
    green: 'text-green-600 dark:text-green-400',
    yellow: 'text-yellow-600 dark:text-yellow-400',
    orange: 'text-orange-600 dark:text-orange-400',
    indigo: 'text-indigo-600 dark:text-indigo-400'
  };

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
      {/* Header */}
      <div className={`py-8 px-4 sm:px-6 lg:px-8 transition-colors ${
        isDark ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-gray-50 to-gray-100'
      }`}>
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold">Admin Hub</h1>
          </div>
          <Badge className="bg-blue-600 mt-2">Sistema Administrativo</Badge>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {adminSections.map((section) => {
            const Icon = section.icon;
            return (
              <Card
                key={section.title}
                className={`transition-all cursor-pointer border-2 ${
                  isDark
                    ? `bg-gray-800 border-gray-700 ${colorClasses[section.color]}`
                    : `border-gray-200 ${colorClasses[section.color]}`
                }`}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Icon className={`w-6 h-6 ${iconColorClasses[section.color]}`} />
                    <CardTitle>{section.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {section.items.map((item) => (
                    <Link
                      key={item.label}
                      to={createPageUrl(item.path)}
                      className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                        isDark
                          ? 'hover:bg-gray-700 text-gray-300'
                          : 'hover:bg-gray-100 text-gray-700'
                      }`}
                    >
                      → {item.label}
                    </Link>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Stats */}
        <QuickStats isDark={isDark} />
      </div>
    </div>
  );
}