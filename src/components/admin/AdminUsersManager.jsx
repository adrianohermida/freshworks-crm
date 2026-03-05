import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { base44 } from '@/api/base44Client';
import { Users, Plus, Edit, Trash2, Search, Shield } from 'lucide-react';

export default function AdminUsersManager() {
  const [users, setUsers] = useState([]);
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showDialog, setShowDialog] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    role: 'user',
    workspace_id: '',
    workspace_role: 'member',
    status: 'active'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [usersData, workspacesData] = await Promise.all([
        base44.entities.User.list(),
        base44.entities.Workspace.list()
      ]);
      setUsers(usersData || []);
      setWorkspaces(workspacesData || []);
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveUser = async () => {
    try {
      if (editingUser) {
        await base44.entities.User.update(editingUser.id, formData);
        setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
      } else {
        const newUser = await base44.entities.User.create(formData);
        setUsers([...users, newUser]);
      }
      resetForm();
    } catch (err) {
      console.error('Erro ao salvar usuário:', err);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (confirm('Tem certeza que deseja deletar este usuário?')) {
      try {
        await base44.entities.User.delete(userId);
        setUsers(users.filter(u => u.id !== userId));
      } catch (err) {
        console.error('Erro ao deletar usuário:', err);
      }
    }
  };

  const handleEditUser = (user) => {
    setEditingUser(user);
    setFormData({
      full_name: user.full_name || '',
      email: user.email || '',
      role: user.role || 'user',
      workspace_id: user.workspace_id || '',
      workspace_role: user.workspace_role || 'member',
      status: user.status || 'active'
    });
    setShowDialog(true);
  };

  const resetForm = () => {
    setEditingUser(null);
    setFormData({
      full_name: '',
      email: '',
      role: 'user',
      workspace_id: '',
      workspace_role: 'member',
      status: 'active'
    });
    setShowDialog(false);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role) => {
    const colors = {
      admin: 'bg-red-600',
      moderator: 'bg-purple-600',
      user: 'bg-blue-600',
      viewer: 'bg-gray-600'
    };
    return colors[role] || 'bg-gray-600';
  };

  const getWorkspaceName = (workspaceId) => {
    return workspaces.find(w => w.id === workspaceId)?.name || 'N/A';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Gerenciamento de Usuários</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">{users.length} usuários totais</p>
          </div>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4" />
              Novo Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold block mb-2">Nome Completo *</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700"
                  placeholder="João Silva"
                />
              </div>

              <div>
                <label className="text-sm font-semibold block mb-2">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  disabled={!!editingUser}
                  className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700 disabled:opacity-50"
                  placeholder="joao@example.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold block mb-2">Role Global</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700"
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold block mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700"
                  >
                    <option value="active">Ativo</option>
                    <option value="inactive">Inativo</option>
                    <option value="pending_invitation">Pendente</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold block mb-2">Workspace</label>
                <select
                  value={formData.workspace_id}
                  onChange={(e) => setFormData({ ...formData, workspace_id: e.target.value })}
                  className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700"
                >
                  <option value="">Sem Workspace</option>
                  {workspaces.map(ws => (
                    <option key={ws.id} value={ws.id}>{ws.name}</option>
                  ))}
                </select>
              </div>

              {formData.workspace_id && (
                <div>
                  <label className="text-sm font-semibold block mb-2">Role no Workspace</label>
                  <select
                    value={formData.workspace_role}
                    onChange={(e) => setFormData({ ...formData, workspace_role: e.target.value })}
                    className="w-full border rounded px-3 py-2 text-sm dark:bg-gray-800 dark:border-gray-700"
                  >
                    <option value="guest">Guest</option>
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                    <option value="owner">Owner</option>
                  </select>
                </div>
              )}

              <div className="flex gap-2 pt-4">
                <Button onClick={handleSaveUser} className="flex-1 bg-blue-600">
                  {editingUser ? 'Atualizar' : 'Criar'} Usuário
                </Button>
                <Button onClick={resetForm} variant="outline" className="flex-1">
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* FILTERS */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="border rounded-lg px-4 py-2 dark:bg-gray-800 dark:border-gray-700"
        >
          <option value="all">Todas as Roles</option>
          <option value="admin">Admin</option>
          <option value="moderator">Moderator</option>
          <option value="user">User</option>
          <option value="viewer">Viewer</option>
        </select>
      </div>

      {/* USERS TABLE */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold">Nome</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Role Global</th>
                  <th className="text-left py-3 px-4 font-semibold">Workspace</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-right py-3 px-4 font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map(user => (
                  <tr key={user.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="py-3 px-4">
                      <div className="font-medium">{user.full_name}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-mono text-xs text-gray-600 dark:text-gray-400">{user.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <Badge className={getRoleColor(user.role)}>
                        {user.role === 'admin' && <Shield className="w-3 h-3 mr-1" />}
                        {user.role}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm">{getWorkspaceName(user.workspace_id)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        className={
                          user.status === 'active' ? 'bg-green-600' :
                          user.status === 'inactive' ? 'bg-gray-600' : 'bg-yellow-600'
                        }
                      >
                        {user.status === 'active' ? 'Ativo' : user.status === 'inactive' ? 'Inativo' : 'Pendente'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                          className="text-blue-600"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Nenhum usuário encontrado
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* STATS */}
      <Card className="bg-blue-50 dark:bg-blue-900/20">
        <CardContent className="pt-6">
          <div className="grid grid-cols-4 gap-4">
            <div>
              <p className="text-2xl font-bold text-blue-600">{users.length}</p>
              <p className="text-xs text-gray-600">Total Usuários</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{users.filter(u => u.role === 'admin').length}</p>
              <p className="text-xs text-gray-600">Admins</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{users.filter(u => u.status === 'active').length}</p>
              <p className="text-xs text-gray-600">Ativos</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">{workspaces.length}</p>
              <p className="text-xs text-gray-600">Workspaces</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}