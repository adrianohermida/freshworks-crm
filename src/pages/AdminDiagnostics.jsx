import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminDiagnostics() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const user = await base44.auth.me();
        setUserInfo(user);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Carregando...</div>;
  }

  const isAdmin = userInfo?.role === 'admin';

  return (
    <div className="p-6 space-y-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <h1 className="text-2xl font-bold">Diagnósticos de Admin</h1>

      {error && (
        <Card className="border-red-500">
          <CardContent className="pt-6 flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <p className="font-semibold text-red-600">Erro</p>
              <p className="text-sm">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Informações do Usuário Atual</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Email</p>
              <p className="font-mono text-sm">{userInfo?.email || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Nome</p>
              <p className="font-mono text-sm">{userInfo?.full_name || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Role</p>
              <div className="flex items-center gap-2 mt-1">
                <p className="font-mono text-sm">{userInfo?.role || 'N/A'}</p>
                <Badge className={isAdmin ? 'bg-green-600' : 'bg-gray-600'}>
                  {isAdmin ? '✅ Admin' : '❌ Não é Admin'}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">ID</p>
              <p className="font-mono text-xs truncate">{userInfo?.id || 'N/A'}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={isAdmin ? 'border-green-500' : 'border-orange-500'}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isAdmin ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <AlertCircle className="w-5 h-5 text-orange-600" />}
            Status de Acesso ao Admin Panel
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isAdmin ? (
            <p className="text-green-700 dark:text-green-400">
              ✅ Este usuário <strong>TEM</strong> acesso ao Admin Panel (role = 'admin')
            </p>
          ) : (
            <div className="space-y-3">
              <p className="text-orange-700 dark:text-orange-400">
                ❌ Este usuário <strong>NÃO TEM</strong> acesso ao Admin Panel
              </p>
              <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded text-sm">
                <p className="font-semibold mb-2">Para conceder acesso a adrianohermida@gmail.com:</p>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Acesse o banco de dados da aplicação</li>
                  <li>Encontre o registro do usuário User com email 'adrianohermida@gmail.com'</li>
                  <li>Altere o campo 'role' para 'admin'</li>
                  <li>Salve as alterações</li>
                  <li>O usuário terá acesso ao Admin Panel imediatamente</li>
                </ol>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* RAW DATA */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Dados Brutos do Usuário (Debug)</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="bg-gray-900 dark:bg-black text-green-400 p-4 rounded text-xs overflow-x-auto max-h-64 overflow-y-auto">
            {JSON.stringify(userInfo, null, 2)}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}