import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Globe, Check, AlertCircle, Trash2 } from 'lucide-react';
import { useTenant } from '@/components/TenantContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function CustomDomainManager() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const { tenantId } = useTenant();
  const queryClient = useQueryClient();

  const [newDomain, setNewDomain] = useState('');
  const [verificationStatus, setVerificationStatus] = useState({});

  // Fetch domains
  const { data: domains } = useQuery({
    queryKey: ['domains', tenantId],
    queryFn: async () => {
      const tenant = await base44.entities.Tenant.filter({ id: tenantId });
      return tenant[0]?.dominio ? [tenant[0].dominio] : [];
    }
  });

  const addDomainMutation = useMutation({
    mutationFn: async (domain) => {
      // Validate domain format
      if (!domain.match(/^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z0-9]([a-z0-9-]*[a-z0-9])?$/i)) {
        throw new Error('Invalid domain format');
      }

      // Update tenant with new domain
      await base44.entities.Tenant.update(tenantId, { dominio: domain });
      
      // Start verification
      setVerificationStatus(prev => ({
        ...prev,
        [domain]: 'pending'
      }));

      return domain;
    },
    onSuccess: (domain) => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
      setNewDomain('');

      // Simulate verification
      setTimeout(() => {
        setVerificationStatus(prev => ({
          ...prev,
          [domain]: 'verified'
        }));
      }, 3000);
    }
  });

  const verifyDomainMutation = useMutation({
    mutationFn: async (domain) => {
      // Verify DNS records
      setVerificationStatus(prev => ({
        ...prev,
        [domain]: 'verifying'
      }));

      // Simulate DNS verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return domain;
    },
    onSuccess: (domain) => {
      setVerificationStatus(prev => ({
        ...prev,
        [domain]: 'verified'
      }));
    }
  });

  const removeDomainMutation = useMutation({
    mutationFn: async (domain) => {
      await base44.entities.Tenant.update(tenantId, { dominio: null });
      return domain;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['domains'] });
    }
  });

  const getDNSRecords = (domain) => [
    {
      type: 'CNAME',
      name: domain,
      value: `proxy.doc-platform.com`,
      status: verificationStatus[domain] === 'verified' ? 'verified' : 'pending'
    },
    {
      type: 'TXT',
      name: `_acme-challenge.${domain}`,
      value: `doc-platform-verification-${domain}`,
      status: verificationStatus[domain] === 'verified' ? 'verified' : 'pending'
    }
  ];

  return (
    <div className="space-y-6 p-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Globe className="w-8 h-8 text-blue-600" />
          Custom Domain Management
        </h1>
      </div>

      {/* Add Domain */}
      <Card className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
        <CardHeader>
          <CardTitle>Add Custom Domain</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="docs.yourdomain.com"
              value={newDomain}
              onChange={(e) => setNewDomain(e.target.value)}
              className={isDark ? 'bg-gray-800' : ''}
            />
            <Button
              onClick={() => addDomainMutation.mutate(newDomain)}
              disabled={addDomainMutation.isPending || !newDomain}
            >
              Add Domain
            </Button>
          </div>
          <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            You'll need to verify DNS records after adding your domain
          </p>
        </CardContent>
      </Card>

      {/* Active Domains */}
      {domains && domains.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Active Domains</h2>
          {domains.map(domain => (
            <Card key={domain} className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{domain}</CardTitle>
                  <Badge className={
                    verificationStatus[domain] === 'verified'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }>
                    {verificationStatus[domain] === 'verified' ? (
                      <>
                        <Check className="w-3 h-3 mr-1" />
                        Verified
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-3 h-3 mr-1" />
                        Pending Verification
                      </>
                    )}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* DNS Records */}
                <div>
                  <h3 className="font-semibold mb-3">DNS Records</h3>
                  <div className="space-y-3">
                    {getDNSRecords(domain).map((record, idx) => (
                      <div
                        key={idx}
                        className={`p-4 rounded-lg border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-mono text-sm font-semibold">{record.type}</p>
                            <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                              {record.name}
                            </p>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {record.status === 'verified' ? '✓ Verified' : '○ Pending'}
                          </Badge>
                        </div>
                        <div className={`p-2 rounded font-mono text-xs break-words ${isDark ? 'bg-gray-900' : 'bg-gray-100'}`}>
                          {record.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verification Status */}
                {verificationStatus[domain] !== 'verified' && (
                  <Alert className="bg-blue-50 border-blue-200">
                    <AlertCircle className="w-4 h-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                      Add the DNS records above to your domain registrar, then click "Verify DNS"
                    </AlertDescription>
                  </Alert>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  {verificationStatus[domain] !== 'verified' && (
                    <Button
                      onClick={() => verifyDomainMutation.mutate(domain)}
                      disabled={verifyDomainMutation.isPending}
                      variant="outline"
                    >
                      {verifyDomainMutation.isPending ? 'Verifying...' : 'Verify DNS'}
                    </Button>
                  )}

                  <Button
                    onClick={() => removeDomainMutation.mutate(domain)}
                    variant="ghost"
                    className="text-red-600 hover:text-red-700"
                    disabled={removeDomainMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Default Domain Info */}
      <Alert className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-blue-50 border-blue-200'}`}>
        <Globe className={`w-4 h-4 ${isDark ? 'text-blue-400' : 'text-blue-600'}`} />
        <AlertDescription className={isDark ? 'text-blue-200' : 'text-blue-800'}>
          Your default domain is: <span className="font-semibold">docs.doc-platform.io</span>
        </AlertDescription>
      </Alert>
    </div>
  );
}