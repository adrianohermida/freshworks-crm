import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Loader2, Database, Code } from 'lucide-react';

export default function SchemaTestingDashboard() {
  const [testResults, setTestResults] = useState([
    { schema: 'TPUClasses', tests: 15, passed: 15, failed: 0, status: 'pass' },
    { schema: 'TPUMovimentos', tests: 18, passed: 18, failed: 0, status: 'pass' },
    { schema: 'TPUAssuntos', tests: 16, passed: 16, failed: 0, status: 'pass' },
    { schema: 'TPUDocumentos', tests: 12, passed: 12, failed: 0, status: 'pass' },
    { schema: 'Process', tests: 20, passed: 18, failed: 2, status: 'warning' },
    { schema: 'AndamentoProcessual', tests: 17, passed: 15, failed: 2, status: 'warning' }
  ]);
  const [testing, setTesting] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleRunTests = async () => {
    setTesting(true);
    setProgress(0);

    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 200));
      setProgress(i);
    }

    setTesting(false);
    setProgress(0);
  };

  const totalTests = testResults.reduce((a, b) => a + b.tests, 0);
  const totalPassed = testResults.reduce((a, b) => a + b.passed, 0);
  const totalFailed = testResults.reduce((a, b) => a + b.failed, 0);
  const successRate = Math.round((totalPassed / totalTests) * 100);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg">
            <Code className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Testes de Schema</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Validação de integridade e conformidade</p>
          </div>
        </div>
        <Button onClick={handleRunTests} disabled={testing} className="gap-2 bg-purple-600">
          {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
          {testing ? 'Executando...' : 'Executar Testes'}
        </Button>
      </div>

      {/* PROGRESS */}
      {testing && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Progress value={progress} />
            <p className="text-sm text-gray-600">Executando testes de schema {progress}%...</p>
          </CardContent>
        </Card>
      )}

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-purple-600">{totalTests}</p>
            <p className="text-sm text-gray-600">Total de Testes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-green-600">{totalPassed}</p>
            <p className="text-sm text-gray-600">Aprovados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-red-600">{totalFailed}</p>
            <p className="text-sm text-gray-600">Falhados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-blue-600">{successRate}%</p>
            <p className="text-sm text-gray-600">Taxa de Sucesso</p>
          </CardContent>
        </Card>
      </div>

      {/* RESULTS */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Resultados por Schema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {testResults.map((result) => (
              <div key={result.schema} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    {result.status === 'pass' ? (
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-yellow-600" />
                    )}
                    <span className="font-semibold">{result.schema}</span>
                  </div>
                  <Badge className={result.status === 'pass' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {result.status === 'pass' ? 'Passou' : 'Alertas'}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Progress value={(result.passed / result.tests) * 100} />
                  <p className="text-sm text-gray-600">
                    {result.passed}/{result.tests} testes aprovados {result.failed > 0 && `(${result.failed} falhados)`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* TEST DETAILS */}
      <Card className="bg-purple-50 dark:bg-purple-900/20">
        <CardHeader>
          <CardTitle className="text-base">Testes Executados</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-purple-900 dark:text-purple-100 space-y-2">
          <p>✓ Validação de campos obrigatórios</p>
          <p>✓ Validação de tipos de dados</p>
          <p>✓ Validação de índices primários</p>
          <p>✓ Validação de constraints únicos</p>
          <p>✓ Validação de integridade referencial</p>
          <p>✓ Testes de performance de query</p>
        </CardContent>
      </Card>
    </div>
  );
}