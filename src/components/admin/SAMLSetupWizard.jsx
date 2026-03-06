import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SAMLSetupWizard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    entityId: 'https://app.example.com',
    ssoUrl: '',
    certificateFingerprint: '',
    emailAttribute: '',
    encryptionEnabled: true,
    signedRequests: true
  });
  const [metadata, setMetadata] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    const result = await base44.functions.invoke('samlSSOConfigV2', {
      action: 'configure',
      config
    });
    if (result.data.success) {
      setSuccess(true);
      setMetadata(result.data.metadata);
    }
    setLoading(false);
  };

  const downloadMetadata = () => {
    const element = document.createElement('a');
    element.setAttribute('href', 'data:application/xml;charset=utf-8,' + encodeURIComponent(metadata));
    element.setAttribute('download', 'saml-metadata.xml');
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="w-full space-y-6">
      <Tabs value={`step${step}`}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="step1">1. Info</TabsTrigger>
          <TabsTrigger value="step2">2. Config</TabsTrigger>
          <TabsTrigger value="step3">3. Attrs</TabsTrigger>
          <TabsTrigger value="step4">4. Review</TabsTrigger>
        </TabsList>

        <TabsContent value="step1" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>SAML Identity Provider Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Você está configurando autenticação SSO via SAML 2.0. Tenha em mãos os dados do seu IdP.
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label>Entity ID (Service Provider ID)</Label>
                <Input
                  value={config.entityId}
                  onChange={(e) => setConfig({...config, entityId: e.target.value})}
                  placeholder="https://app.example.com"
                />
                <p className="text-xs text-gray-600">Identificador único da sua aplicação</p>
              </div>

              <Button onClick={() => setStep(2)} className="w-full">
                Próximo
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="step2" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Identity Provider Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>SSO URL</Label>
                <Input
                  value={config.ssoUrl}
                  onChange={(e) => setConfig({...config, ssoUrl: e.target.value})}
                  placeholder="https://idp.example.com/sso"
                />
              </div>

              <div className="space-y-2">
                <Label>Certificate Fingerprint (SHA-1)</Label>
                <Textarea
                  value={config.certificateFingerprint}
                  onChange={(e) => setConfig({...config, certificateFingerprint: e.target.value})}
                  placeholder="AA:BB:CC:DD:EE:FF..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setStep(1)} variant="outline">
                  Anterior
                </Button>
                <Button onClick={() => setStep(3)} className="flex-1">
                  Próximo
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="step3" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attribute Mapping</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Email Attribute</Label>
                <Input
                  value={config.emailAttribute}
                  onChange={(e) => setConfig({...config, emailAttribute: e.target.value})}
                  placeholder="http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
                />
              </div>

              <div className="flex gap-2 p-3 bg-blue-50 rounded border border-blue-200 text-sm text-blue-900">
                ℹ️ Mapeie os atributos do seu IdP para os campos da aplicação
              </div>

              <div className="flex gap-2">
                <Button onClick={() => setStep(2)} variant="outline">
                  Anterior
                </Button>
                <Button onClick={() => setStep(4)} className="flex-1">
                  Próximo
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="step4" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Review & Confirm</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3 p-4 bg-gray-50 rounded">
                <div>
                  <p className="text-sm text-gray-600">Entity ID</p>
                  <p className="font-mono text-sm">{config.entityId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">SSO URL</p>
                  <p className="font-mono text-sm">{config.ssoUrl}</p>
                </div>
              </div>

              {success && (
                <Alert className="bg-green-50 border-green-200">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    SAML configurado com sucesso! ✅
                  </AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handleSave}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  '✓ Salvar Configuração'
                )}
              </Button>

              {metadata && (
                <Button onClick={downloadMetadata} variant="outline" className="w-full">
                  📥 Download Metadata
                </Button>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}