import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';

export default function TenantOverview({ isSuperAdmin }) {
  const { data: tenants = [] } = useQuery({
    queryKey: ['admin_tenants'],
    queryFn: () => base44.entities.TenantSettings.list('-created_at', 10),
    enabled: isSuperAdmin
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

  if (!isSuperAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Seu Tenant
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Acesso como administrador de tenant
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Tenants Recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {tenants.length === 0 ? (
            <p className="text-sm text-gray-500">Nenhum tenant</p>
          ) : (
            tenants.map(tenant => (
              <div key={tenant.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="font-medium text-sm text-gray-900 dark:text-white">
                    {tenant.company_name}
                  </p>
                  <p className="text-xs text-gray-500">{tenant.tenant_id}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={planColors[tenant.plan]}>
                    {tenant.plan}
                  </Badge>
                  <Badge className={statusColors[tenant.status]}>
                    {tenant.status}
                  </Badge>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}