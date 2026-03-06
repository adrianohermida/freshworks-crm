import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useTenant } from '@/components/TenantContext';
import { checkPermission, auditPermissionCheck, enforcePermission } from '@/components/RoleBasedAccess';
import RegistryLayout from '@/components/registry/RegistryLayout';

import RegistryPermissionError from '@/components/registry/RegistryPermissionError.jsx';
import OnboardingWizard from '@/components/registry/OnboardingWizard';
import DocumentRegistry from '@/components/registry/DocumentRegistry';
import ColetasRegistry from '@/components/registry/ColetasRegistry';
import EmailRegistrado from '@/components/registry/EmailRegistrado';
import RegistryHistory from '@/components/registry/RegistryHistory';

export default function BlockchainRegistry() {
  const { tenantId } = useTenant();
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const [activeTab, setActiveTab] = useState('onboarding');
  const [verificando, setVerificando] = useState(false);
  const [permissionError, setPermissionError] = useState(null);
  const queryClient = useQueryClient();

  // Check permissions on mount
  useEffect(() => {
    const validateAccess = async () => {
      try {
        const hasAccess = await checkPermission('read', 'documents');
        if (!hasAccess) {
          setPermissionError('Access Denied: You do not have permission to access documents.');
        }
      } catch (error) {
        setPermissionError('Error validating permissions.');
      }
    };
    validateAccess();
  }, []);

  const { data: registros, isLoading } = useQuery({
    queryKey: ['registrosBlockchain', tenantId],
    queryFn: () => base44.entities.RegistroBlockchain.filter({ tenantId }, '-created_date', 20),
    initialData: [],
    enabled: !!tenantId && !permissionError
  });

  const registrarMutation = useMutation({
    mutationFn: async (dados) => {
      await enforcePermission('create', 'documents');
      const response = await base44.functions.invoke('registrarBlockchain', { ...dados, tenantId });
      await auditPermissionCheck('create', 'documents', { success: true });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrosBlockchain', tenantId] });
      // States for old form removed
    },
    onError: (error) => {
      auditPermissionCheck('create', 'documents', { success: false, error: error.message });
    }
  });

  const assinarMutation = useMutation({
    mutationFn: async (dados) => {
      await enforcePermission('update', 'documents');
      const response = await base44.functions.invoke('assinarDocumentoBlockchain', { ...dados, tenantId });
      await auditPermissionCheck('update', 'documents', { success: true });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrosBlockchain', tenantId] });
      // States for old modal removed
    },
    onError: (error) => {
      auditPermissionCheck('update', 'documents', { success: false, error: error.message });
    }
  });

  // handleRegistrar function removed as the quick registration form is no longer here

  const handleVerificar = async (hash) => {
    setVerificando(true);
    try {
      const response = await base44.functions.invoke('verificarBlockchain', {
        documentoHash: hash
      });
      // setResultadoVerificacao(response.data) removed as the state no longer exists here
    } catch (error) {
      console.error('Error verifying:', error);
    } finally {
      setVerificando(false);
    }
  };

  // getStatusBadge function removed, replaced by RegistryStatusBadge component

  if (permissionError) {
    return (
      <RegistryLayout activeTab={activeTab} onTabChange={setActiveTab}>
        <RegistryPermissionError error={permissionError} />
      </RegistryLayout>
    );
  }

  return (
    <RegistryLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className={`space-y-8 min-h-screen ${isDark ? 'bg-[#081828]' : 'bg-[#f4f7fa]'}`}>
        {/* Tab Content */}
        {activeTab === 'onboarding' && (
          <OnboardingWizard onComplete={() => setActiveTab('document')} />
        )}

        {activeTab === 'document' && (
          <DocumentRegistry />
        )}

        {activeTab === 'collections' && (
          <ColetasRegistry />
        )}

        {activeTab === 'email' && (
          <EmailRegistrado />
        )}

        {activeTab === 'history' && (
          <RegistryHistory registros={registros} isLoading={isLoading} />
        )}
      </div>
    </RegistryLayout>
  );
}