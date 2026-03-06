import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Copy, Download, ChevronDown, ChevronUp } from 'lucide-react';

export default function SyncErrorReport({ tableKey, metrics = {} }) {
  const [expanded, setExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const errors = metrics.errors || [];

  if (errors.length === 0) {
    return null;
  }

  const generateErrorReport = () => {
    return errors
      .map((error, idx) => `
=== ERRO #${idx + 1} ===
Tabela: ${tableKey}
Data/Hora: ${error.timestamp || new Date().toISOString()}
Status: ${error.status || 'DESCONHECIDO'}

📡 REQUISIÇÃO API:
${JSON.stringify(error.request || {}, null, 2)}

📊 RESPOSTA:
${JSON.stringify(error.response || {}, null, 2)}

🔍 TRACE DO ERRO:
${error.stack || error.message || 'Sem detalhes de trace'}

💬 Mensagem: ${error.message || 'Sem mensagem'}

---`)
      .join('\n');
  };

  const fullReport = generateErrorReport();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(fullReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadReport = () => {
    const element = document.createElement('a');
    const file = new Blob([fullReport], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `erro-sync-${tableKey}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-3 mt-4 pt-4 border-t border-red-200 dark:border-red-700">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-3 bg-red-50 dark:bg-red-900 rounded-lg hover:bg-red-100 dark:hover:bg-red-800 transition-colors"
      >
        <div className="flex items-center gap-2 text-left">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
          <div>
            <p className="font-semibold text-red-900 dark:text-red-100">
              ⚠️ {errors.length} Erro(s) de Sincronização
            </p>
            <p className="text-xs text-red-700 dark:text-red-300">
              Clique para expandir relatório completo
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-5 h-5 text-red-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-red-600" />
        )}
      </button>

      {expanded && (
        <div className="space-y-3 bg-red-50 dark:bg-red-900 p-4 rounded-lg border border-red-200 dark:border-red-700">
          {/* Botões de Ação */}
          <div className="flex gap-2 flex-wrap">
            <Button
              size="sm"
              onClick={copyToClipboard}
              className="gap-2 bg-red-600 hover:bg-red-700"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copiado!' : 'Copiar Relatório'}
            </Button>
            <Button
              size="sm"
              onClick={downloadReport}
              variant="outline"
              className="gap-2 border-red-300 text-red-700 dark:text-red-300"
            >
              <Download className="w-4 h-4" />
              Baixar TXT
            </Button>
          </div>

          {/* Lista de Erros */}
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {errors.map((error, idx) => (
              <Card key={idx} className="bg-white dark:bg-gray-800 border-red-300 dark:border-red-700">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-red-700 dark:text-red-300">
                    Erro #{idx + 1} - {error.message || 'Erro desconhecido'}
                  </CardTitle>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {error.timestamp || new Date().toISOString()}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {/* Requisição */}
                  {error.request && (
                    <div className="bg-blue-50 dark:bg-blue-900 p-3 rounded border border-blue-200 dark:border-blue-700">
                      <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">📡 Requisição API:</p>
                      <pre className="text-xs bg-white dark:bg-gray-700 p-2 rounded overflow-x-auto text-gray-800 dark:text-gray-200 max-h-32 overflow-y-auto">
                        {JSON.stringify(error.request, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* Resposta */}
                  {error.response && (
                    <div className="bg-purple-50 dark:bg-purple-900 p-3 rounded border border-purple-200 dark:border-purple-700">
                      <p className="font-semibold text-purple-900 dark:text-purple-100 mb-2">📊 Resposta:</p>
                      <pre className="text-xs bg-white dark:bg-gray-700 p-2 rounded overflow-x-auto text-gray-800 dark:text-gray-200 max-h-32 overflow-y-auto">
                        {JSON.stringify(error.response, null, 2)}
                      </pre>
                    </div>
                  )}

                  {/* Trace/Stack */}
                  {(error.stack || error.trace) && (
                    <div className="bg-red-50 dark:bg-red-900 p-3 rounded border border-red-200 dark:border-red-700">
                      <p className="font-semibold text-red-900 dark:text-red-100 mb-2">🔍 Stack Trace:</p>
                      <pre className="text-xs bg-white dark:bg-gray-700 p-2 rounded overflow-x-auto text-gray-800 dark:text-gray-200 max-h-40 overflow-y-auto font-mono">
                        {error.stack || error.trace || error.message}
                      </pre>
                    </div>
                  )}

                  {/* Status */}
                  {error.status && (
                    <div className="bg-yellow-50 dark:bg-yellow-900 p-2 rounded border border-yellow-200 dark:border-yellow-700">
                      <p className="text-xs font-mono">
                        <strong>Status Code:</strong> {error.status}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Relatório Completo em Texto */}
          <Card className="bg-white dark:bg-gray-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">📋 Relatório Completo em Texto</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-gray-50 dark:bg-gray-900 p-3 rounded overflow-x-auto max-h-48 overflow-y-auto text-gray-800 dark:text-gray-200 font-mono">
                {fullReport}
              </pre>
            </CardContent>
          </Card>

          {/* Débito Técnico - para corrigir depois */}
          <Alert className="bg-yellow-50 dark:bg-yellow-900 border-yellow-300 dark:border-yellow-700">
            <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <AlertDescription className="text-yellow-800 dark:text-yellow-200">
              <strong>Débito Técnico Registrado:</strong> {errors.length} erro(s) encontrado(s) na sincronização de{' '}
              <code className="bg-yellow-100 dark:bg-yellow-800 px-2 py-1 rounded text-xs">{tableKey}</code>
              . Relatório acima contém toda a informação necessária para correção.
            </AlertDescription>
          </Alert>
        </div>
      )}
    </div>
  );
}