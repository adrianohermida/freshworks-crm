import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, Key, Users, CheckCircle2, AlertCircle, Copy, Eye, EyeOff } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function EnterpriseSSOConfig() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const queryClient = useQueryClient();

  const [ssoConfig, setSsoConfig] = useState({
    provider: 'saml',
    entityId: '',
    ssoUrl: '',
    x509Cert: '',
    enabled: false,
    autoProvisioning: false,
    mappings: {
      email: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
      firstName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname',
      lastName: 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname',
      role: 'role'
    }
  });

  const [showCert, setShowCert] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [copiedField, setCopiedField] = useState(null);

  // Fetch existing SSO config
  const { data: existingConfig, isLoading } = useQuery({
    queryKey: ['ssoConfig'],
    queryFn: async () => {
      try {
        const response = await base44.functions.invoke('getSSOConfig', {});
        return response.data;
      } catch (error) {
        return null;
      }
    }
  });

  const saveMutation = useMutation({
    mutationFn: async (config) => {
      return await base44.functions.invoke('saveSSOConfig', { config });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ssoConfig'] });
    }
  });

  const testMutation = useMutation({
    mutationFn: async (config) => {
      return await base44.functions.invoke('testSSOConnection', { config });
    },
    onSuccess: (data) => {
      setTestResult({ success: true, message: data.data.message || 'Connection successful!' });
      setTimeout(() => setTestResult(null), 5000);
    },
    onError: (error) => {
      setTestResult({ success: false, message: error.message || 'Connection failed' });
    }
  });

  const handleCopyToClipboard = (value, field) => {
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const generateMetadataURL = () => {
    return `${window.location.origin}/saml/metadata`;
  };

  const handleSave = async () => {
    await saveMutation.mutateAsync(ssoConfig);
  };

  const handleTest = async () => {
    await testMutation.mutateAsync(ssoConfig);
  };

  return (
    <div className="space-y-6 p-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Shield className="w-8 h-8 text-blue-600" />
          Enterprise SSO Configuration
        </h1>
        <Badge variant={ssoConfig.enabled ? 'default' : 'secondary'}>
          {ssoConfig.enabled ? 'Enabled' : 'Disabled'}
        </Badge>
      </div>

      {testResult && (
        <Alert className={testResult.success ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}>
          <AlertCircle className={`w-4 h-4 ${testResult.success ? 'text-green-600' : 'text-red-600'}`} />
          <AlertDescription className={testResult.success ? 'text-green-800' : 'text-red-800'}>
            {testResult.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Service Provider Information */}
      <Card className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Service Provider Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Metadata URL</label>
            <div className="flex items-center gap-2">
              <Input
                value={generateMetadataURL()}
                readOnly
                className={isDark ? 'bg-gray-800' : 'bg-gray-50'}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopyToClipboard(generateMetadataURL(), 'metadata')}
              >
                {copiedField === 'metadata' ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Share this with your IdP administrator
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Assertion Consumer Service (ACS) URL</label>
            <div className="flex items-center gap-2">
              <Input
                value={`${window.location.origin}/saml/acs`}
                readOnly
                className={isDark ? 'bg-gray-800' : 'bg-gray-50'}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleCopyToClipboard(`${window.location.origin}/saml/acs`, 'acs')}
              >
                {copiedField === 'acs' ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Identity Provider Configuration */}
      <Card className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Identity Provider Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2">Provider</label>
            <select
              value={ssoConfig.provider}
              onChange={(e) => setSsoConfig({ ...ssoConfig, provider: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg ${isDark ? 'bg-gray-800 border-gray-700' : 'border-gray-300'}`}
            >
              <option value="saml">SAML 2.0</option>
              <option value="oauth">OAuth 2.0</option>
              <option value="oidc">OpenID Connect</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">Entity ID / Client ID</label>
            <Input
              value={ssoConfig.entityId}
              onChange={(e) => setSsoConfig({ ...ssoConfig, entityId: e.target.value })}
              placeholder="https://idp.example.com/entity"
              className={isDark ? 'bg-gray-800' : ''}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">SSO URL / Authorization Endpoint</label>
            <Input
              value={ssoConfig.ssoUrl}
              onChange={(e) => setSsoConfig({ ...ssoConfig, ssoUrl: e.target.value })}
              placeholder="https://idp.example.com/sso"
              className={isDark ? 'bg-gray-800' : ''}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-semibold">X.509 Certificate</label>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCert(!showCert)}
              >
                {showCert ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
            <textarea
              value={ssoConfig.x509Cert}
              onChange={(e) => setSsoConfig({ ...ssoConfig, x509Cert: e.target.value })}
              placeholder="-----BEGIN CERTIFICATE-----..."
              className={`w-full px-3 py-2 border rounded-lg font-mono text-sm ${isDark ? 'bg-gray-800 border-gray-700' : 'border-gray-300'}`}
              rows={showCert ? 6 : 2}
            />
          </div>
        </CardContent>
      </Card>

      {/* Attribute Mapping */}
      <Card className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Attribute Mapping
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(ssoConfig.mappings).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-semibold mb-2 capitalize">{key}</label>
              <Input
                value={value}
                onChange={(e) => setSsoConfig({
                  ...ssoConfig,
                  mappings: { ...ssoConfig.mappings, [key]: e.target.value }
                })}
                placeholder={`SAML attribute for ${key}`}
                className={isDark ? 'bg-gray-800' : ''}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Advanced Options */}
      <Card className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
        <CardHeader>
          <CardTitle>Advanced Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={ssoConfig.enabled}
              onChange={(e) => setSsoConfig({ ...ssoConfig, enabled: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-semibold">Enable SSO</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={ssoConfig.autoProvisioning}
              onChange={(e) => setSsoConfig({ ...ssoConfig, autoProvisioning: e.target.checked })}
              className="w-4 h-4 rounded"
            />
            <span className="text-sm font-semibold">Auto-provision Users</span>
          </label>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          onClick={handleTest}
          variant="outline"
          disabled={testMutation.isPending}
        >
          {testMutation.isPending ? 'Testing...' : 'Test Connection'}
        </Button>
        <Button
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {saveMutation.isPending ? 'Saving...' : 'Save Configuration'}
        </Button>
      </div>
    </div>
  );
}