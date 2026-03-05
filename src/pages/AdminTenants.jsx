import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/components/admin/layouts/AdminLayout';
import ModuleLayout from '@/components/layouts/ModuleLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Trash2, Eye } from 'lucide-react';
import { useAdminAuth } from '@/components/hooks/useAdminAuth';

export default function AdminTenants() {
  const { user: adminUser, isLoading: authLoading } = useAdminAuth();
  const [selectedTenant, setSelectedTenant] = useState(null);
  const queryClient = useQueryClient();

  const { data: tenants = [], isLoading } = useQuery({
    queryKey: ['admin_tenants'],
    queryFn: () => base44.entities.TenantSettings.list('-created_at', 100),
    enabled: !authLoading
  });

  const updateMutation = useMutation({
    mutationFn: (data) => base44.entities.TenantSettings.update(data.id, { status: data.status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin_tenants'] })
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.TenantSettings.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin_tenants'] })
  });

  const planColors = {
    free: 'bg-gray-100 text-gray-800',
    professional: 'bg-blue-100 text-blue-800',
    enterprise: 'bg-purple-100 text-purple-800'
  };

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    suspended: 'bg-yellow-100 text-yellow-800',
    cancelled: 'bg-red-100 text-red-800'
  };

  if (authLoading) return <div className="flex items-center justify-center h-screen">Carregando...</div>;

  return (
    <AdminLayout user={adminUser} isSuperAdmin={adminUser?.role === 'super_admin'}>
      <ModuleLayout
        title="Gerenciamento de Tenants"
        subtitle="Controlar tenants, planos e status"
        icon={Building2}
      >
        <Card>
          <CardContent className="pt-6">
            {isLoading ? (
              <div className="text-center py-8">Carregando tenants...</div>
            ) : tenants.length === 0 ? (
              <div className="text-center py-8 text-gray-500">Nenhum tenant</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 dark:bg-gray-800">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium">Empresa</th>
                      <th className="px-4 py-2 text-left font-medium">Plano</th>
                      <th className="px-4 py-2 text-left font-medium">Status</th>
                      <th className="px-4 py-2 text-left font-medium">Usuários</th>
                      <th className="px-4 py-2 text-left font-medium">Data Criação</th>
                      <th className="px-4 py-2 text-center font-medium">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenants.map(tenant => (
                      <tr key={tenant.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="px-4 py-3 font-medium">{tenant.company_name}</td>
                        <td className="px-4 py-3">
                          <Badge className={planColors[tenant.plan]}>{tenant.plan}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <Badge className={statusColors[tenant.status]}>{tenant.status}</Badge>
                        </td>
                        <td className="px-4 py-3">{tenant.usage?.users_count || 0} / {tenant.max_users}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">
                          {new Date(tenant.created_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-4 py-3 text-center flex items-center justify-center gap-2">
                          <Button size="sm" variant="ghost" onClick={() => setSelectedTenant(tenant)}>
                            <Eye className="w-4 h-4" />
                          </Button>
                          {tenant.status !== 'suspended' ? (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateMutation.mutate({id: tenant.id, status: 'suspended'})}
                              className="text-yellow-600"
                            >
                              Suspender
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => updateMutation.mutate({id: tenant.id, status: 'active'})}
                              className="text-green-600"
                            >
                              Ativar
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteMutation.mutate(tenant.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {selectedTenant && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{selectedTenant.company_name} - Detalhes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Tenant ID</p>
                  <p className="font-mono text-sm">{selectedTenant.tenant_id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Plano</p>
                  <p>{selectedTenant.plan}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Máx. Usuários</p>
                  <p>{selectedTenant.max_users}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Máx. Processos</p>
                  <p>{selectedTenant.max_processes}</p>
                </div>
                {selectedTenant.usage && (
                  <>
                    <div>
                      <p className="text-sm text-gray-600">Usuários Usados</p>
                      <p>{selectedTenant.usage.users_count}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Processos Usados</p>
                      <p>{selectedTenant.usage.processes_count}</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </ModuleLayout>
    </AdminLayout>
  );
}