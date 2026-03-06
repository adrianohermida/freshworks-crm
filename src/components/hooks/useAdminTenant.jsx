import { useContext } from 'react';
import { TenantContext } from '@/components/TenantContext';

export function useAdminTenant() {
  const { user, tenant } = useContext(TenantContext);

  if (!user || !tenant) {
    throw new Error('useAdminTenant deve ser usado dentro de TenantProvider');
  }

  const isAdmin = user.role === 'admin';
  const isSuperAdmin = user.role === 'super_admin';
  const isOperator = user.role === 'operator';

  const canViewTenant = isSuperAdmin || (isAdmin && user.email === tenant.owner_email);
  const canEditTenant = isSuperAdmin || (isAdmin && user.email === tenant.owner_email);
  const canManageUsers = isSuperAdmin || (isAdmin && user.email === tenant.owner_email);
  const canDeleteTenant = isSuperAdmin;

  return {
    user,
    tenant,
    isAdmin,
    isSuperAdmin,
    isOperator,
    canViewTenant,
    canEditTenant,
    canManageUsers,
    canDeleteTenant,
    tenantId: tenant.tenant_id
  };
}