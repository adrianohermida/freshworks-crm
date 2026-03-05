import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { PlayCircle, Copy, CheckCircle2, AlertCircle, Loader2, Code, Terminal } from 'lucide-react';

/**
 * Página para testar endpoints da API Advise
 * Permite fazer requisições e validar respostas
 */
export default function APITesting() {
  const [selectedEndpoint, setSelectedEndpoint] = useState('publications');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [queryParams, setQueryParams] = useState({});
  const [copiedCode, setCopiedCode] = useState(null);

  const endpoints = {
    publications: {
      name: 'Listar Publicações',
      method: 'GET',
      url: '/publications',
      description: 'Obtém lista de publicações da Advise',
      params: [
        { name: 'page', type: 'number', default: '1', description: 'Número da página' },
        { name: 'limit', type: 'number', default: '20', description: 'Itens por página' },
        { name: 'status', type: 'string', description: 'Filtrar por status (importado, processado, pendente)' }
      ]
    },
    publicationById: {
      name: 'Obter Publicação por ID',
      method: 'GET',
      url: '/publications/:id',
      description: 'Obtém detalhes de uma publicação específica',
      params: [
        { name: 'id', type: 'string', required: true, description: 'ID da publicação' }
      ]
    },
    processes: {
      name: 'Listar Processos',
      method: 'GET',
      url: '/processes',
      description: 'Obtém lista de processos jurídicos',
      params: [
        { name: 'page', type: 'number', default: '1' },
        { name: 'limit', type: 'number', default: '20' },
        { name: 'status', type: 'string', description: 'Status do processo (ativo, arquivado, etc)' }
      ]
    },
    intimations: {
      name: 'Listar Intimações',
      method: 'GET',
      url: '/intimations',
      description: 'Obtém lista de intimações',
      params: [
        { name: 'page', type: 'number', default: '1' },
        { name: 'limit', type: 'number', default: '20' },
        { name: 'status', type: 'string', description: 'Status (pendente, recebida, cumprida, cancelada)' }
      ]
    },
    movements: {
      name: 'Listar Movimentações',
      method: 'GET',
      url: '/movements',
      description: 'Obtém movimentações de processos',
      params: [
        { name: 'page', type: 'number', default: '1' },
        { name: 'limit', type: 'number', default: '20' },
        { name: 'processId', type: 'string', description: 'Filtrar por ID do processo' }
      ]
    },
    syncPublications: {
      name: 'Sincronizar Publicações',
      method: 'POST',
      url: '/sync/publications',
      description: 'Força sincronização de publicações com Advise',
      params: [
        { name: 'force', type: 'boolean', default: 'false', description: 'Forçar sincronização completa' }
      ]
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const buildUrl = () => {
    const endpoint = endpoints[selectedEndpoint];
    let url = endpoint.url;
    const params = new URLSearchParams();

    Object.entries(queryParams).forEach(([key, value]) => {
      if (value && value !== '') {
        if (endpoint.url.includes(`:${key}`)) {
          url = url.replace(`:${key}`, value);
        } else {
          params.append(key, value);
        }
      }
    });

    const queryString = params.toString();
    return queryString ? `${url}?${queryString}` : url;
  };

  const testEndpoint = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    try {
      const endpoint = endpoints[selectedEndpoint];
      const url = buildUrl();
      const fullUrl = `/api${url}`;

      const fetchOptions = {
        method: endpoint.method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const res = await fetch(fullUrl, fetchOptions);
      const data = await res.json();

      setResponse({
        status: res.status,
        statusText: res.statusText,
        headers: Object.fromEntries(res.headers),
        body: data,
        url: fullUrl,
        method: endpoint.method
      });
    } catch (err) {
      setError({
        message: err.message,
        stack: err.stack
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentEndpoint = endpoints[selectedEndpoint];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Terminal className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">API Advise Tester</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Teste endpoints um a um e valide respostas</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar - Endpoints */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="text-lg">Endpoints</CardTitle>
              <CardDescription>Selecione um para testar</CardDescription>
            </CardHeader>

            <CardContent className="space-y-2">
              {Object.entries(endpoints).map(([key, endpoint]) => (
                <button
                  key={key}
                  onClick={() => {
                    setSelectedEndpoint(key);
                    setResponse(null);
                    setError(null);
                    setQueryParams({});
                  }}
                  className={`w-full text-left p-3 rounded-lg border-2 transition ${
                    selectedEndpoint === key
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm text-gray-900 dark:text-white">
                        {endpoint.name}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {endpoint.method} {endpoint.url}
                      </p>
                    </div>
                    <Badge variant={endpoint.method === 'GET' ? 'secondary' : 'default'}>
                      {endpoint.method}
                    </Badge>
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Main - Test Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Endpoint Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {currentEndpoint.name}
                </CardTitle>
                <CardDescription>{currentEndpoint.description}</CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Method and URL */}
                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg font-mono text-sm">
                  <span className={`font-bold ${currentEndpoint.method === 'GET' ? 'text-blue-600' : 'text-green-600'}`}>
                    {currentEndpoint.method}
                  </span>
                  {' '}
                  <span className="text-gray-700 dark:text-gray-300">/api{currentEndpoint.url}</span>
                </div>

                {/* Parameters */}
                {currentEndpoint.params.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm">Parâmetros</h4>
                    {currentEndpoint.params.map((param) => (
                      <div key={param.name} className="space-y-1">
                        <label className="text-sm font-medium flex items-center gap-2">
                          {param.name}
                          {param.required && <span className="text-red-500">*</span>}
                          {param.default && <Badge variant="outline" className="text-xs">{param.default}</Badge>}
                        </label>
                        <Input
                          type={param.type === 'number' ? 'number' : 'text'}
                          placeholder={param.description}
                          value={queryParams[param.name] || ''}
                          onChange={(e) => setQueryParams({
                            ...queryParams,
                            [param.name]: e.target.value
                          })}
                          className="text-sm"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Test Button */}
                <Button
                  onClick={testEndpoint}
                  disabled={isLoading}
                  className="w-full gap-2"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Testando...
                    </>
                  ) : (
                    <>
                      <PlayCircle className="w-4 h-4" />
                      Fazer Requisição
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Response */}
            {response && (
              <Card className="border-green-200 bg-green-50 dark:bg-green-900/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2 text-green-900 dark:text-green-100">
                      <CheckCircle2 className="w-5 h-5" />
                      Resposta Recebida
                    </CardTitle>
                    <Badge className="bg-green-600">
                      {response.status} {response.statusText}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* URL e Method */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-gray-900 dark:text-white">Requisição</h4>
                    <div className="bg-white dark:bg-slate-800 p-3 rounded border border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between">
                        <code className="text-xs text-gray-700 dark:text-gray-300">
                          <span className={`font-bold ${response.method === 'GET' ? 'text-blue-600' : 'text-green-600'}`}>
                            {response.method}
                          </span>
                          {' '}{response.url}
                        </code>
                        <button
                          onClick={() => copyToClipboard(`${response.method} ${response.url}`, 'url')}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-slate-700 rounded"
                        >
                          {copiedCode === 'url' ? (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          ) : (
                            <Copy className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Response Body */}
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-gray-900 dark:text-white">Response Body</h4>
                    <div className="bg-white dark:bg-slate-800 p-3 rounded border border-gray-200 dark:border-gray-700 max-h-96 overflow-auto">
                      <pre className="text-xs text-gray-700 dark:text-gray-300 font-mono">
                        {JSON.stringify(response.body, null, 2)}
                      </pre>
                    </div>
                    <button
                      onClick={() => copyToClipboard(JSON.stringify(response.body, null, 2), 'body')}
                      className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      {copiedCode === 'body' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          Copiado!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          Copiar resposta
                        </>
                      )}
                    </button>
                  </div>

                  {/* Response Headers */}
                  <details className="cursor-pointer">
                    <summary className="font-semibold text-sm text-gray-900 dark:text-white hover:text-gray-600">
                      Headers ({Object.keys(response.headers).length})
                    </summary>
                    <div className="mt-2 bg-white dark:bg-slate-800 p-3 rounded border border-gray-200 dark:border-gray-700">
                      <pre className="text-xs text-gray-700 dark:text-gray-300 font-mono overflow-auto max-h-48">
                        {JSON.stringify(response.headers, null, 2)}
                      </pre>
                    </div>
                  </details>
                </CardContent>
              </Card>
            )}

            {/* Error */}
            {error && (
              <Card className="border-red-200 bg-red-50 dark:bg-red-900/20">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-900 dark:text-red-100">
                    <AlertCircle className="w-5 h-5" />
                    Erro na Requisição
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  <div className="bg-white dark:bg-slate-800 p-3 rounded border border-red-200 dark:border-red-700">
                    <p className="font-mono text-sm text-red-700 dark:text-red-300">
                      {error.message}
                    </p>
                  </div>

                  {error.stack && (
                    <details className="cursor-pointer">
                      <summary className="text-xs text-red-600 dark:text-red-400 hover:text-red-700">
                        Ver stack trace
                      </summary>
                      <pre className="mt-2 text-xs text-gray-700 dark:text-gray-300 bg-white dark:bg-slate-800 p-2 rounded overflow-auto max-h-48">
                        {error.stack}
                      </pre>
                    </details>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Documentação */}
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5" />
              Documentação de Endpoints
            </CardTitle>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="examples">Exemplos</TabsTrigger>
                <TabsTrigger value="fields">Campos</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-3 mt-4">
                <div className="space-y-2 text-sm">
                  <p><strong>Publicações:</strong> Obtém notificações de processos jurídicos publicados nos diários oficiais</p>
                  <p><strong>Processos:</strong> Gerencia dados dos processos jurídicos sincronizados</p>
                  <p><strong>Intimações:</strong> Controla citações, intimações e notificações judiciais</p>
                  <p><strong>Movimentações:</strong> Registra andamentos e atualizações de processos</p>
                </div>
              </TabsContent>

              <TabsContent value="examples" className="space-y-3 mt-4">
                <div className="bg-white dark:bg-slate-800 p-3 rounded space-y-2">
                  <code className="text-xs text-gray-700 dark:text-gray-300 block overflow-auto">
                    GET /api/publications?page=1&limit=20
                  </code>
                  <code className="text-xs text-gray-700 dark:text-gray-300 block overflow-auto">
                    GET /api/processes?status=ativo
                  </code>
                  <code className="text-xs text-gray-700 dark:text-gray-300 block overflow-auto">
                    GET /api/intimations?status=pendente
                  </code>
                </div>
              </TabsContent>

              <TabsContent value="fields" className="space-y-3 mt-4">
                <div className="text-sm space-y-2">
                  <p><strong>Publicação:</strong> id, numeroProcesso, dataPublicacao, conteudo, municipio, vara, diario, lido</p>
                  <p><strong>Processo:</strong> id, numeroProcesso, statusProcesso, tribunal, vara, dataDistribuicao, partesProcesso, assunto</p>
                  <p><strong>Intimação:</strong> id, numeroProcesso, tipo, descricao, dataIntimacao, statusIntimacao, fonte</p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}