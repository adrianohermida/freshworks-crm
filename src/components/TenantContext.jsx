import React, { createContext, useContext, useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';

const TenantContext = createContext();

export function TenantProvider({ children }) {
  const [user, setUser] = useState(null);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initTenant = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        
        // Get user's tenant settings if available
        if (currentUser?.email) {
          try {
            const tenantSettings = await base44.entities.TenantSettings.filter({
              created_by: currentUser.email
            });
            if (tenantSettings.length > 0) {
              setTenant(tenantSettings[0]);
            } else {
              // Default tenant structure if none exists
              setTenant({
                tenant_id: 'default',
                company_name: 'Default Tenant',
                plan: 'free',
                owner: currentUser.email
              });
            }
          } catch (err) {
            // If TenantSettings not available, use minimal structure
            setTenant({
              tenant_id: 'default',
              company_name: 'Default Tenant',
              plan: 'free',
              owner: currentUser.email
            });
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    initTenant();
  }, []);

  return (
    <TenantContext.Provider value={{ user, tenant, loading, error }}>
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (!context) {
    throw new Error('useTenant must be used within TenantProvider');
  }
  return context;
}

export function useAdminOnly() {
  const { user, loading } = useTenant();
  
  if (loading) return null;
  
  if (!user || user.role !== 'admin') {
    throw new Error('Admin access required');
  }
  
  return user;
}

export function useTenantUser() {
  const { user, tenant } = useTenant();
  return { user, tenant };
}