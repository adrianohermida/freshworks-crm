import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Code, BookOpen, Key, FileJson, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function APIDocumentation() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  const [copied, setCopied] = useState(null);

  const apiEndpoints = [
    {
      method: 'POST',
      path: '/api/v1/registros/blockchain',
      description: 'Register document on blockchain',
      auth: 'Bearer Token',
      rate: '100 req/min'
    },
    {
      method: 'GET',
      path: '/api/v1/registros/{id}/verify',
      description: 'Verify document hash',
      auth: 'Bearer Token',
      rate: '1000 req/min'
    },
    {
      method: 'POST',
      path: '/api/v1/coletas/digital',
      description: 'Create digital collection',
      auth: 'Bearer Token',
      rate: '50 req/min'
    },
    {
      method: 'GET',
      path: '/api/v1/notificacoes',
      description: 'List notifications',
      auth: 'Bearer Token',
      rate: '500 req/min'
    }
  ];

  const codeExample = `curl -X POST https://api.doc-platform.io/api/v1/registros/blockchain \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "documentoHash": "abc123...",
    "documentoNome": "Contract.pdf",
    "tipoDocumento": "contrato"
  }'`;

  const handleCopy = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopied(field);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6 p-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-blue-600" />
          API Documentation
        </h1>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="auth">Authentication</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4">
          <Card className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
            <CardHeader>
              <CardTitle>API Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Base URL</h3>
                <code className={`block p-3 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'} font-mono text-sm`}>
                  https://api.doc-platform.io/api/v1
                </code>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Version</h3>
                <p>Current API Version: <Badge>v1.0.0</Badge></p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Rate Limits</h3>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  <li>Standard: 100 requests per minute</li>
                  <li>File Upload: 50 requests per minute</li>
                  <li>Blockchain: 20 requests per minute</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Endpoints */}
        <TabsContent value="endpoints" className="space-y-4">
          {apiEndpoints.map((endpoint, idx) => (
            <Card key={idx} className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={
                        endpoint.method === 'GET'
                          ? 'bg-blue-100 text-blue-800'
                          : endpoint.method === 'POST'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-purple-100 text-purple-800'
                      }>
                        {endpoint.method}
                      </Badge>
                      <code className="font-mono text-sm font-semibold">{endpoint.path}</code>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {endpoint.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs pt-3 border-t" style={{borderColor: isDark ? '#374151' : '#e5e7eb'}}>
                  <div>
                    <p className="opacity-70">Authentication</p>
                    <p className="font-semibold">{endpoint.auth}</p>
                  </div>
                  <div>
                    <p className="opacity-70">Rate Limit</p>
                    <p className="font-semibold">{endpoint.rate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Examples */}
        <TabsContent value="examples" className="space-y-4">
          <Card className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                cURL Example
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'} overflow-auto`}>
                <code className="font-mono text-xs whitespace-pre-wrap break-words">
                  {codeExample}
                </code>
              </div>
              <Button
                onClick={() => handleCopy(codeExample, 'curl')}
                variant="outline"
                size="sm"
                className="mt-3 gap-2"
              >
                <Copy className="w-4 h-4" />
                {copied === 'curl' ? 'Copied!' : 'Copy'}
              </Button>
            </CardContent>
          </Card>

          <Card className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileJson className="w-5 h-5" />
                Response Example
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'} overflow-auto`}>
                <code className="font-mono text-xs text-green-600">{`{
  "success": true,
  "registroId": "reg_123456",
  "hash": "0x1a2b3c...",
  "timestamp": "2026-03-04T10:30:00Z",
  "blockchain": "ethereum",
  "blockNumber": 19541234
}`}</code>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Authentication */}
        <TabsContent value="auth" className="space-y-4">
          <Card className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Bearer Token Authentication
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Include your API key in the Authorization header:
              </p>
              <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
                <code className="font-mono text-sm">
                  Authorization: Bearer sk_live_xxxxxxxxxxxxx
                </code>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Get Your API Key</h3>
                <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Navigate to Settings → API Keys to generate and manage your API keys.
                </p>
                <Button className="gap-2">
                  <Key className="w-4 h-4" />
                  Generate API Key
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}