import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/layouts/AdminLayout';
import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Trash2, Edit2, Users } from 'lucide-react';
import { useAdminAuth } from '@/components/hooks/useAdminAuth';

export default function AdminUsers() {
  const { user: adminUser, isLoading: authLoading } = useAdminAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    role: 'user'
  });
  const queryClient = useQueryClient();

  const { data: users = [], isLoading } = useQuery({
    queryKey: ['admin_users'],
    queryFn: () => base44.entities.User.list('-created_date', 100),
    enabled: !authLoading
  });

  const createMutation = useMutation({
    mutationFn: async (data) => {
      // Usar convite do base44
      await base44.users.inviteUser(data.email, data.role);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_users'] });
      setFormData({ email: '', full_name: '', role: 'user' });
      setIsCreating(false);
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.User.update(data.id, { role: data.role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_users'] });
      setEditingUser(null);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.User.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin_users'] })
  });

  const handleCreate = (e) => {
    e.preventDefault();
    if (!formData.email.trim()) return;
    createMutation.mutate(formData);
  };

  const filteredUsers = users.filter(u =>
    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const roleColors = {
    admin: 'bg-purple-100 text-purple-800',
    user: 'bg-blue-100 text-blue-800',
    operator: 'bg-green-100 text-green-800'
  };

  if (authLoading) return <div className="flex items-center justify-center h-screen">Carregando...</div>;

  return (
    <AdminLayout user={adminUser} isSuperAdmin={adminUser?.role === 'super_admin'}>
      <ModuleLayout
        title="Gerenciamento de Usuários"
        subtitle="Convidar, gerenciar roles e permissões"
        icon={Users}
        actions={
          <Button onClick={() => setIsCreating(!isCreating)}>
            <Plus className="w-4 h-4 mr-2" />
            Convidar Usuário
          </Button>
        }
      >
        <Card>
          <CardHeader className="pb-3">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por email ou nome..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {isCreating && (
              <form onSubmit={handleCreate} className="p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg space-y-3 border border-cyan-200">
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
                <Input
                  placeholder="Nome completo"
                  value={formData.full_name}
                  onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                />
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({...formData, role: e.target.value})}
                  className="w-full px-3 py-2 border rounded text-sm"
                >
                  <option value="user">Usuário</option>
                  <option value="admin">Admin</option>
                  <option value="operator">Operador</option>
                </select>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">Convidar</Button>
                  <Button type="button" variant="outline" onClick={() => setIsCreating(false)}>Cancelar</Button>
                </div>
              </form>
            )}

            {isLoading ? (
              <div className="text-center py-8">Carregando usuários...</div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Nenhum usuário encontrado</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">Nome</th>
                      <th className="px-4 py-2 text-left font-medium">Email</th>
                      <th className="px-4 py-2 text-left font-medium">Role</th>
                      <th className="px-4 py-2 text-left font-medium">Data Criação</th>
                      <th className="px-4 py-2 text-center font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-4 py-3">{user.full_name || '-'}</td>
                        <td className="px-4 py-3">{user.email}</td>
                        <td className="px-4 py-3">
                          {editingUser?.id === user.id ? (
                            <select
                              value={editingUser.role}
                              onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                              className="px-2 py-1 border rounded text-xs"
                            >
                              <option value="user">Usuário</option>
                              <option value="admin">Admin</option>
                              <option value="operator">Operador</option>
                            </select>
                          ) : (
                            <Badge className={roleColors[user.role] || 'bg-gray-100'}>
                              {user.role}
                            </Badge>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {new Date(user.created_date).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-4 py-3 text-center flex items-center justify-center gap-2">
                          {editingUser?.id === user.id ? (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => updateMutation.mutate(editingUser)}
                              >
                                Salvar
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingUser(null)}
                              >
                                Cancelar
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => setEditingUser(user)}
                              >
                                <Edit2 className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteMutation.mutate(user.id)}
                                className="text-red-600"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </ModuleLayout>
    </AdminLayout>
  );
}