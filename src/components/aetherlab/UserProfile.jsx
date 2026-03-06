import React from 'react';
import { useTheme } from 'next-themes';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Shield, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function UserProfile() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  const { data: currentUser } = useQuery({
    queryKey: ['currentUser'],
    queryFn: () => base44.auth.me()
  });

  if (!currentUser) return null;

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
      {/* Header */}
      <div className={`py-8 px-4 sm:px-6 lg:px-8 transition-colors ${
        isDark ? 'bg-gradient-to-r from-gray-900 to-gray-800' : 'bg-gradient-to-r from-gray-50 to-gray-100'
      }`}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Meu Perfil</h1>
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            Visualize as informações da sua conta
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Profile Card */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Informações Pessoais
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Nome Completo</label>
                <p className="text-lg font-medium mt-1">{currentUser.full_name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
                <p className="text-lg font-medium mt-1">{currentUser.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Status */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Status da Conta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Função</label>
                <div className="mt-1">
                  <Badge className={currentUser.role === 'admin' ? 'bg-blue-600' : 'bg-gray-600'}>
                    {currentUser.role.toUpperCase()}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Status</label>
                <div className="mt-1">
                  <Badge className="bg-green-600">Ativo</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Dates */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Histórico da Conta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Data de Criação</label>
              <p className="text-lg font-medium mt-1">
                {format(new Date(currentUser.created_date), 'dd/MM/yyyy HH:mm')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}