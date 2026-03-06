import React from 'react';
import { useTenant } from '@/components/TenantContext';
import { AlertCircle } from 'lucide-react';

export function ProtectedRoute({ children, requiredRole = null }) {
  const { user, tenant, loading } = useTenant();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user || !tenant) {
    return (
      <div className="flex items-center justify-center h-screen bg-red-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600 font-semibold">Acesso não autorizado</p>
          <p className="text-red-500 text-sm mt-2">Por favor, faça login novamente</p>
        </div>
      </div>
    );
  }

  if (requiredRole === 'admin' && user.role !== 'admin') {
    return (
      <div className="flex items-center justify-center h-screen bg-yellow-50">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-yellow-600 mx-auto mb-4" />
          <p className="text-yellow-600 font-semibold">Acesso restrito</p>
          <p className="text-yellow-600 text-sm mt-2">Apenas administradores podem acessar esta página</p>
        </div>
      </div>
    );
  }

  return children;
}

export function AdminOnly({ children }) {
  const { user } = useTenant();
  if (user?.role !== 'admin') return null;
  return children;
}

export function TenantOwnerOnly({ children }) {
  const { user, tenant } = useTenant();
  if (!user || !tenant || user.email !== tenant.owner) return null;
  return children;
}