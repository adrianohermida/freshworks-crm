import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Check, Code, BookOpen, AlertCircle, Zap } from 'lucide-react';

export default function APIVerificationDocs() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const [copiedCode, setCopiedCode] = useState(null);

  const baseUrl = typeof window !== 'undefined' 
    ? `${window.location.protocol}//${window.location.host}/api`
    : 'https://your-domain.com/api';

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const CodeBlock = ({ code, language = 'bash', id }) => (
    <div className={`rounded-lg p-4 mb-4 relative ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}>
      <button
        onClick={() => copyToClipboard(code, id)}
        className="absolute top-2 right-2 p-2 hover:bg-gray-700 rounded"
      >
        {copiedCode === id ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <Copy className="w-4 h-4 text-gray-400" />
        )}
      </button>
      <pre className="text-xs font-mono overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-50'} p-6`}>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2">dOC Verification API</h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Public REST API for blockchain document verification
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-4">
          {[
            { label: 'Requests/Hour', value: '100' },
            { label: 'Response Time', value: '< 200ms' },
            { label: 'Uptime', value: '99.99%' },
            { label: 'Version', value: 'v1.0' }
          ].map((stat, idx) => (
            <Card key={idx} className={isDark ? 'bg-gray-900 border-gray-800' : 'bg-white'}>
              <CardContent className="pt-6 text-center">
                <p className="text-2xl font-bold text-blue-600">{stat.value}</p>
                <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {stat.label}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="endpoints" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
            <TabsTrigger value="errors">Errors</TabsTrigger>
          </TabsList>

          {/* Endpoints */}
          <TabsContent value="endpoints" className="space-y-6">
            {/* GET /api/verify/:hash */}
            <Card className={isDark ? 'bg-gray-900 border-gray-800' : 'bg-white'}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Badge className="bg-blue-600">GET</Badge>
                    <code className="text-sm font-mono">/api/verify/:hash</code>
                  </span>
                  <Badge variant="outline">Public</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold mb-2">Description</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Verify a single document by its SHA-256 hash on the blockchain
                  </p>
                </div>

                <div>
                  <p className="font-semibold mb-2">Parameters</p>
                  <div className={`p-3 rounded ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
                    <p className="text-sm font-mono mb-1">hash <span className="text-red-500">*</span></p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      SHA-256 document hash (in path)
                    </p>
                  </div>
                </div>

                <div>
                  <p className="font-semibold mb-2">Response</p>
                  <CodeBlock
                    code={`{
  "success": true,
  "code": "VALID",
  "verification": {
    "hash": "0x1a2b3c...",
    "status": "valid",
    "valid": true,
    "registeredAt": "2026-03-04T10:30:00Z",
    "expiresAt": "2027-03-04T10:30:00Z",
    "daysUntilExpiry": 365,
    "blockchainHash": "0xabc123...",
    "transactionHash": "0xtx123..."
  },
  "timestamp": "2026-03-04T12:00:00Z"
}`}
                    id="verify-response"
                  />
                </div>

                <div>
                  <p className="font-semibold mb-2">Status Codes</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-600">200</Badge>
                      <span>Document found and verified</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-600">404</Badge>
                      <span>Document not found</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-600">429</Badge>
                      <span>Rate limit exceeded</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* POST /api/verify */}
            <Card className={isDark ? 'bg-gray-900 border-gray-800' : 'bg-white'}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Badge className="bg-green-600">POST</Badge>
                    <code className="text-sm font-mono">/api/verify</code>
                  </span>
                  <Badge variant="outline">Batch</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold mb-2">Description</p>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Batch verify up to 100 documents in a single request
                  </p>
                </div>

                <div>
                  <p className="font-semibold mb-2">Request Body</p>
                  <CodeBlock
                    code={`{
  "hashes": [
    "0x1a2b3c...",
    "0x4d5e6f...",
    "0x7g8h9i..."
  ]
}`}
                    id="batch-request"
                  />
                </div>

                <div>
                  <p className="font-semibold mb-2">Response</p>
                  <CodeBlock
                    code={`{
  "success": true,
  "verified": 2,
  "notFound": 1,
  "results": [
    {
      "hash": "0x1a2b3c...",
      "found": true,
      "status": "valid",
      "valid": true
    },
    {
      "hash": "0x4d5e6f...",
      "found": false,
      "status": "not_found"
    }
  ],
  "timestamp": "2026-03-04T12:00:00Z"
}`}
                    id="batch-response"
                  />
                </div>
              </CardContent>
            </Card>

            {/* GET /api/health */}
            <Card className={isDark ? 'bg-gray-900 border-gray-800' : 'bg-white'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge className="bg-purple-600">GET</Badge>
                  <code className="text-sm font-mono">/api/health</code>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={`text-sm mb-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Check API health and status
                </p>
                <CodeBlock
                  code={`{
  "status": "healthy",
  "service": "dOC Verification API",
  "version": "1.0.0",
  "timestamp": "2026-03-04T12:00:00Z"
}`}
                  id="health-response"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Examples */}
          <TabsContent value="examples" className="space-y-6">
            {/* JavaScript Example */}
            <Card className={isDark ? 'bg-gray-900 border-gray-800' : 'bg-white'}>
              <CardHeader>
                <CardTitle>JavaScript/Node.js</CardTitle>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  code={`// Single verification
async function verifyDocument(hash) {
  const response = await fetch(\`${baseUrl}/verify/\${hash}\`);
  const data = await response.json();
  
  if (data.success) {
    console.log(\`Document is \${data.verification.status}\`);
    console.log(\`Registered: \${data.verification.registeredAt}\`);
  }
  return data;
}

// Batch verification
async function batchVerify(hashes) {
  const response = await fetch(\`${baseUrl}/verify\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hashes })
  });
  return response.json();
}`}
                  id="js-example"
                />
              </CardContent>
            </Card>

            {/* cURL Example */}
            <Card className={isDark ? 'bg-gray-900 border-gray-800' : 'bg-white'}>
              <CardHeader>
                <CardTitle>cURL</CardTitle>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  code={`# Single verification
curl -X GET "${baseUrl}/verify/0x1a2b3c4d..."

# Batch verification
curl -X POST "${baseUrl}/verify" \\
  -H "Content-Type: application/json" \\
  -d '{
    "hashes": ["0x1a2b...", "0x4d5e..."]
  }'

# Health check
curl -X GET "${baseUrl}/health"`}
                  id="curl-example"
                />
              </CardContent>
            </Card>

            {/* Python Example */}
            <Card className={isDark ? 'bg-gray-900 border-gray-800' : 'bg-white'}>
              <CardHeader>
                <CardTitle>Python</CardTitle>
              </CardHeader>
              <CardContent>
                <CodeBlock
                  code={`import requests

# Single verification
hash = "0x1a2b3c4d..."
response = requests.get(f"${baseUrl}/verify/{hash}")
data = response.json()

if data['success']:
    print(f"Status: {data['verification']['status']}")
    
# Batch verification
hashes = ["0x1a2b...", "0x4d5e..."]
response = requests.post(f"${baseUrl}/verify", 
  json={"hashes": hashes})
results = response.json()`}
                  id="python-example"
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Errors */}
          <TabsContent value="errors" className="space-y-6">
            <Card className={isDark ? 'bg-gray-900 border-gray-800' : 'bg-white'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600" />
                  Error Responses
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    code: 'MISSING_HASH',
                    status: 400,
                    message: 'Document hash is required',
                    example: '{ "error": "Document hash required", "code": "MISSING_HASH" }'
                  },
                  {
                    code: 'NOT_FOUND',
                    status: 404,
                    message: 'Document not found in blockchain',
                    example: '{ "error": "Document not found", "code": "NOT_FOUND" }'
                  },
                  {
                    code: 'RATE_LIMIT',
                    status: 429,
                    message: 'Rate limit exceeded (100 req/hour)',
                    example: '{ "error": "Rate limit exceeded", "code": "RATE_LIMIT" }'
                  },
                  {
                    code: 'INVALID_REQUEST',
                    status: 400,
                    message: 'Invalid request body',
                    example: '{ "error": "hashes array required", "code": "INVALID_REQUEST" }'
                  },
                  {
                    code: 'INTERNAL_ERROR',
                    status: 500,
                    message: 'Server error',
                    example: '{ "error": "Internal server error", "code": "INTERNAL_ERROR" }'
                  }
                ].map((err, idx) => (
                  <div key={idx} className={`p-4 rounded border-l-4 ${isDark ? 'bg-gray-800 border-l-red-600' : 'bg-red-50 border-l-red-600'}`}>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-mono font-semibold text-sm">{err.code}</p>
                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{err.message}</p>
                      </div>
                      <Badge>{err.status}</Badge>
                    </div>
                    <CodeBlock code={err.example} id={`error-${idx}`} />
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Rate Limiting Info */}
            <Card className={isDark ? 'bg-gray-900 border-gray-800' : 'bg-white'}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  Rate Limiting
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Limit:</strong> 100 requests per hour per IP</p>
                  <p><strong>Headers:</strong> No special headers (limit tracked by IP)</p>
                  <p><strong>Reset:</strong> Hourly rolling window</p>
                  <p className={`mt-3 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    When rate limit is exceeded, the API returns HTTP 429 with code RATE_LIMIT.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className={`p-6 rounded-lg border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-blue-50 border-blue-200'}`}>
          <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
            💡 <strong>Tip:</strong> Use the batch endpoint for verifying multiple documents at once to reduce API calls.
          </p>
        </div>
      </div>
    </div>
  );
}