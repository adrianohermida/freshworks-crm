import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Users, Shield, AlertCircle, CheckCircle2, Search } from 'lucide-react';
import UserManagementCard from '@/components/UserManagementCard';
import InviteUserModal from '@/components/InviteUserModal';

export default function UserManagement() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const [searchTerm, setSearchTerm] = useState('');
  const [filtroRole, setFiltroRole] = useState('todos');
  const [mensagem, setMensagem] = useState(null);
  const queryClient = useQueryClient();

  const { data: usuarioAtual } = useQuery({
    queryKey: ['usuario-atual'],
    queryFn: async () => {
      const user = await base44.auth.me();
      return user;
    }
  });

  const { data: usuarios = [], isLoading, refetch } = useQuery({
    queryKey: ['usuarios'],
    queryFn: async () => {
      const response = await base44.functions.invoke('gerenciarUsuarios', {
        acao: 'listar'
      });
      return response.data.dados || [];
    }
  });

  const atualizarRoleMutation = useMutation({
    mutationFn: async ({ usuarioId, novoRole }) => {
      const response = await base44.functions.invoke('gerenciarUsuarios', {
        acao: 'atualizarRole',
        usuarioId,
        novoRole
      });
      return response.data;
    },
    onSuccess: () => {
      refetch();
      setMensagem({
        tipo: 'sucesso',
        texto: 'Role atualizado com sucesso!'
      });
      setTimeout(() => setMensagem(null), 3000);
    },
    onError: (error) => {
      setMensagem({
        tipo: 'erro',
        texto: error.message || 'Erro ao atualizar role'
      });
    }
  });

  const deletarMutation = useMutation({
    mutationFn: async (usuarioId) => {
      const response = await base44.functions.invoke('gerenciarUsuarios', {
        acao: 'deletar',
        usuarioId
      });
      return response.data;
    },
    onSuccess: () => {
      refetch();
      setMensagem({
        tipo: 'sucesso',
        texto: 'Usuário deletado com sucesso!'
      });
      setTimeout(() => setMensagem(null), 3000);
    },
    onError: (error) => {
      setMensagem({
        tipo: 'erro',
        texto: error.message || 'Erro ao deletar usuário'
      });
    }
  });

  const usuariosFiltrados = usuarios.filter(u => {
    const matchSearch = u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchRole = filtroRole === 'todos' || u.role === filtroRole;
    return matchSearch && matchRole;
  });

  if (!usuarioAtual?.role === 'admin') {
    return (
      <div className={`min-h-screen p-6 transition-colors ${isDark ? 'bg-gray-950' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
        <div className="max-w-4xl mx-auto">
          <div className={`rounded-lg border-l-4 p-6 ${
            isDark 
              ? 'bg-red-900/20 border-l-red-500 border-gray-700' 
              : 'bg-red-50 border-l-red-600'
          }`}>
            <div className="flex gap-3">
              <AlertCircle className={`w-6 h-6 flex-shrink-0 ${isDark ? 'text-red-300' : 'text-red-600'}`} aria-hidden="true" />
              <div>
                <h3 className={`font-semibold transition-colors ${isDark ? 'text-red-300' : 'text-red-900'}`}>
                  Acesso Negado
                </h3>
                <p className={`text-sm mt-1 transition-colors ${isDark ? 'text-red-200' : 'text-red-700'}`}>
                  Apenas administradores podem acessar esta página
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen p-6 transition-colors ${isDark ? 'bg-gray-950' : 'bg-gradient-to-br from-slate-50 to-slate-100'}`}>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className={`text-3xl font-bold flex items-center gap-2 transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
              <Users className="w-8 h-8" aria-hidden="true" />
              Gerenciamento de Usuários
            </h1>
            <p className={`text-sm mt-1 transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Gerencie permissões e acesso de usuários à plataforma
            </p>
          </div>
          <InviteUserModal onSuccess={() => refetch()} />
        </div>

        {/* Mensagens */}
        {mensagem && (
          <div className={`rounded-lg border p-4 flex gap-3 ${
            mensagem.tipo === 'sucesso'
              ? isDark
                ? 'bg-green-900/20 border-green-500'
                : 'bg-green-50 border-green-300'
              : isDark
              ? 'bg-red-900/20 border-red-500'
              : 'bg-red-50 border-red-300'
          }`}>
            {mensagem.tipo === 'sucesso' ? (
              <CheckCircle2 className={`w-5 h-5 flex-shrink-0 ${isDark ? 'text-green-300' : 'text-green-600'}`} aria-hidden="true" />
            ) : (
              <AlertCircle className={`w-5 h-5 flex-shrink-0 ${isDark ? 'text-red-300' : 'text-red-600'}`} aria-hidden="true" />
            )}
            <p className={`text-sm ${
              mensagem.tipo === 'sucesso'
                ? isDark ? 'text-green-300' : 'text-green-700'
                : isDark ? 'text-red-300' : 'text-red-700'
            }`}>
              {mensagem.texto}
            </p>
          </div>
        )}

        {/* Filtros */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle className={`transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Buscar e Filtrar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} aria-hidden="true" />
              <Input
                placeholder="Buscar por email ou nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`pl-10 ${isDark ? 'bg-gray-700 border-gray-600 text-white' : ''}`}
              />
            </div>

            <div className="flex gap-2 flex-wrap">
              {['todos', 'admin', 'user'].map(role => (
                <button
                  key={role}
                  onClick={() => setFiltroRole(role)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filtroRole === role
                      ? 'bg-blue-600 text-white'
                      : isDark
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {role === 'todos' ? '📊 Todos' : role === 'admin' ? '👑 Admin' : '👤 Usuários'}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="p-4">
              <p className={`text-xs transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Total de Usuários
              </p>
              <p className={`text-2xl font-bold mt-2 transition-colors ${isDark ? 'text-blue-400' : 'text-blue-600'}`}>
                {usuarios.length}
              </p>
            </CardContent>
          </Card>

          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="p-4">
              <p className={`text-xs transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Administradores
              </p>
              <p className={`text-2xl font-bold mt-2 transition-colors ${isDark ? 'text-purple-400' : 'text-purple-600'}`}>
                {usuarios.filter(u => u.role === 'admin').length}
              </p>
            </CardContent>
          </Card>

          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="p-4">
              <p className={`text-xs transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Usuários Regulares
              </p>
              <p className={`text-2xl font-bold mt-2 transition-colors ${isDark ? 'text-green-400' : 'text-green-600'}`}>
                {usuarios.filter(u => u.role === 'user').length}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Lista de Usuários */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle className={`transition-colors ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Usuários Encontrados ({usuariosFiltrados.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className={`text-center ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 mb-3 mx-auto" aria-hidden="true"></div>
                  Carregando usuários...
                </div>
              </div>
            ) : usuariosFiltrados.length === 0 ? (
              <p className={`text-center py-8 transition-colors ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Nenhum usuário encontrado
              </p>
            ) : (
              <div className="space-y-3">
                {usuariosFiltrados.map(usuario => (
                  <UserManagementCard
                    key={usuario.id}
                    usuario={usuario}
                    usuarioAtual={usuarioAtual}
                    onAtualizarRole={(id, role) => atualizarRoleMutation.mutate({ usuarioId: id, novoRole: role })}
                    onDeletar={(id) => deletarMutation.mutate(id)}
                    isLoading={atualizarRoleMutation.isPending || deletarMutation.isPending}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}