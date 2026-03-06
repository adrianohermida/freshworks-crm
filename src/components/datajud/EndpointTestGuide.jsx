import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Copy, Play, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TRIBUNAIS } from '../../functions/utils/tribunaisData';

export default function EndpointTestGuide() {
  const [activeTab, setActiveTab] = useState('intro');
  const [selectedTribunal, setSelectedTribunal] = useState('tjsp');
  const [testType, setTestType] = useState('numero');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  // Parâmetros de teste
  const [numeroProcesso, setNumeroProcesso] = useState('');
  const [classeCodeigo, setClasseCodigo] = useState('');
  const [orgaoJulgador, setOrgaoJulgador] = useState('');
  const [pageSize, setPageSize] = useState('10');
  const [searchAfter, setSearchAfter] = useState('');

  const tribunal = TRIBUNAIS.find(t => t.alias === selectedTribunal);

  const executarTeste = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      let query;

      if (testType === 'numero' && numeroProcesso) {
        query = {
          query: {
            match: {
              numeroProcesso: numeroProcesso
            }
          }
        };
      } else if (testType === 'classe' && classeCodeigo && orgaoJulgador) {
        query = {
          query: {
            bool: {
              must: [
                { match: { 'classe.codigo': parseInt(classeCodeigo) } },
                { match: { 'orgaoJulgador.codigo': parseInt(orgaoJulgador) } }
              ]
            }
          },
          size: parseInt(pageSize)
        };
      } else if (testType === 'paginacao' && classeCodeigo && orgaoJulgador) {
        query = {
          size: parseInt(pageSize),
          query: {
            bool: {
              must: [
                { match: { 'classe.codigo': parseInt(classeCodeigo) } },
                { match: { 'orgaoJulgador.codigo': parseInt(orgaoJulgador) } }
              ]
            }
          },
          sort: [{ '@timestamp': { order: 'asc' } }]
        };

        if (searchAfter) {
          query.search_after = [parseInt(searchAfter)];
        }
      } else {
        setError('Preencha os parâmetros obrigatórios para o tipo de teste selecionado');
        setLoading(false);
        return;
      }

      // Simular chamada à API (em produção, seria uma função backend)
      const response = await fetch(tribunal.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `APIKey ${process.env.REACT_APP_DATAJUD_API_KEY || 'demo'}`
        },
        body: JSON.stringify(query)
      });

      const data = await response.json();
      setResponse({
        status: response.status,
        query,
        hits: data.hits?.total?.value || 0,
        data
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const copiarCodigo = (texto) => {
    navigator.clipboard.writeText(texto);
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="intro">📖 Guia</TabsTrigger>
          <TabsTrigger value="numero">🔍 Por Número</TabsTrigger>
          <TabsTrigger value="classe">📋 Por Classe</TabsTrigger>
          <TabsTrigger value="paginacao">📄 Paginação</TabsTrigger>
        </TabsList>

        {/* TAB: INTRODUÇÃO */}
        <TabsContent value="intro" className="space-y-4 mt-4">
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-bold">🚀 Guia de Teste - API DataJud</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              A API DataJud do CNJ oferece 3 formas principais de consulta. Use as abas para testar cada uma.
            </p>

            <div className="space-y-3">
              <Card className="p-4 bg-blue-50 dark:bg-blue-900">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                  1️⃣ Buscar por Número CNJ
                </h4>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  Pesquise um processo específico usando seu número único (20 dígitos)
                </p>
              </Card>

              <Card className="p-4 bg-green-50 dark:bg-green-900">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                  2️⃣ Buscar por Classe + Órgão
                </h4>
                <p className="text-sm text-green-800 dark:text-green-200">
                  Encontre processos por código da classe processual e órgão julgador
                </p>
              </Card>

              <Card className="p-4 bg-purple-50 dark:bg-purple-900">
                <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                  3️⃣ Paginação com search_after
                </h4>
                <p className="text-sm text-purple-800 dark:text-purple-200">
                  Navegue por grandes volumes de dados de forma eficiente
                </p>
              </Card>
            </div>

            <div className="bg-yellow-50 dark:bg-yellow-900 p-4 rounded-lg border border-yellow-200 dark:border-yellow-700">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>💡 Dica:</strong> Use as abas abaixo para testar cada tipo de consulta. A API retornará dados reais dos tribunais.
              </p>
            </div>
          </Card>
        </TabsContent>

        {/* TAB: BUSCAR POR NÚMERO */}
        <TabsContent value="numero" className="space-y-4 mt-4">
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-bold">🔍 Exemplo 1: Pesquisar por Número de Processo</h3>

            <div className="space-y-4">
              {/* Seletor de Tribunal */}
              <div>
                <label className="text-sm font-medium">Tribunal</label>
                <Select value={selectedTribunal} onValueChange={setSelectedTribunal}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRIBUNAIS.map(t => (
                      <SelectItem key={t.alias} value={t.alias}>
                        {t.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Input do Número */}
              <div>
                <label className="text-sm font-medium">Número do Processo (20 dígitos)</label>
                <Input
                  placeholder="Ex: 00008323520184013202"
                  value={numeroProcesso}
                  onChange={(e) => setNumeroProcesso(e.target.value.replace(/\D/g, '').slice(0, 20))}
                  maxLength="20"
                />
                <p className="text-xs text-gray-500 mt-1">{numeroProcesso.length}/20 dígitos</p>
              </div>

              {/* Query DSL */}
              <div>
                <label className="text-sm font-medium">Query DSL</label>
                <Card className="p-4 bg-gray-900 text-gray-100 font-mono text-xs relative">
                  <button
                    onClick={() => copiarCodigo(JSON.stringify({
                      query: { match: { numeroProcesso } }
                    }, null, 2))}
                    className="absolute top-2 right-2 p-2 hover:bg-gray-700 rounded"
                    title="Copiar"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <pre>{JSON.stringify({
                    query: {
                      match: { numeroProcesso }
                    }
                  }, null, 2)}</pre>
                </Card>
              </div>

              {/* Botão de Execução */}
              <Button
                onClick={executarTeste}
                disabled={loading || !numeroProcesso || numeroProcesso.length !== 20}
                className="w-full gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Executando...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Executar Teste
                  </>
                )}
              </Button>

              {/* Resposta */}
              {response && (
                <Card className="p-4 bg-green-50 dark:bg-green-900 border-green-200">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-900 dark:text-green-100">
                      {response.hits} resultado(s) encontrado(s)
                    </span>
                  </div>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-auto max-h-96">
                    {JSON.stringify(response.data, null, 2)}
                  </pre>
                </Card>
              )}

              {error && (
                <Card className="p-4 bg-red-50 dark:bg-red-900 border-red-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-red-800 dark:text-red-200">{error}</span>
                  </div>
                </Card>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* TAB: BUSCAR POR CLASSE */}
        <TabsContent value="classe" className="space-y-4 mt-4">
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-bold">📋 Exemplo 2: Pesquisar por Classe + Órgão</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Tribunal</label>
                <Select value={selectedTribunal} onValueChange={setSelectedTribunal}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRIBUNAIS.map(t => (
                      <SelectItem key={t.alias} value={t.alias}>
                        {t.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Código da Classe</label>
                  <Input
                    placeholder="Ex: 1116"
                    value={classeCodeigo}
                    onChange={(e) => setClasseCodigo(e.target.value.replace(/\D/g, ''))}
                    type="number"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Código Órgão Julgador</label>
                  <Input
                    placeholder="Ex: 13597"
                    value={orgaoJulgador}
                    onChange={(e) => setOrgaoJulgador(e.target.value.replace(/\D/g, ''))}
                    type="number"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Query DSL</label>
                <Card className="p-4 bg-gray-900 text-gray-100 font-mono text-xs relative">
                  <button
                    onClick={() => copiarCodigo(JSON.stringify({
                      query: {
                        bool: {
                          must: [
                            { match: { 'classe.codigo': parseInt(classeCodeigo) } },
                            { match: { 'orgaoJulgador.codigo': parseInt(orgaoJulgador) } }
                          ]
                        }
                      }
                    }, null, 2))}
                    className="absolute top-2 right-2 p-2 hover:bg-gray-700 rounded"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <pre>{JSON.stringify({
                    query: {
                      bool: {
                        must: [
                          { match: { 'classe.codigo': classeCodeigo || 'XXX' } },
                          { match: { 'orgaoJulgador.codigo': orgaoJulgador || 'XXX' } }
                        ]
                      }
                    }
                  }, null, 2)}</pre>
                </Card>
              </div>

              <Button
                onClick={() => { setTestType('classe'); executarTeste(); }}
                disabled={loading || !classeCodeigo || !orgaoJulgador}
                className="w-full gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Executando...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Executar Teste
                  </>
                )}
              </Button>

              {response && (
                <Card className="p-4 bg-green-50 dark:bg-green-900 border-green-200">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-900 dark:text-green-100">
                      {response.hits} resultado(s) encontrado(s)
                    </span>
                  </div>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-auto max-h-96">
                    {JSON.stringify(response.data, null, 2)}
                  </pre>
                </Card>
              )}

              {error && (
                <Card className="p-4 bg-red-50 dark:bg-red-900 border-red-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-red-800 dark:text-red-200">{error}</span>
                  </div>
                </Card>
              )}
            </div>
          </Card>
        </TabsContent>

        {/* TAB: PAGINAÇÃO */}
        <TabsContent value="paginacao" className="space-y-4 mt-4">
          <Card className="p-6 space-y-4">
            <h3 className="text-lg font-bold">📄 Exemplo 3: Paginação com search_after</h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Tribunal</label>
                <Select value={selectedTribunal} onValueChange={setSelectedTribunal}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TRIBUNAIS.map(t => (
                      <SelectItem key={t.alias} value={t.alias}>
                        {t.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Código da Classe</label>
                  <Input
                    placeholder="Ex: 1116"
                    value={classeCodeigo}
                    onChange={(e) => setClasseCodigo(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Código Órgão Julgador</label>
                  <Input
                    placeholder="Ex: 13597"
                    value={orgaoJulgador}
                    onChange={(e) => setOrgaoJulgador(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Tamanho Página (size)</label>
                  <Input
                    type="number"
                    placeholder="10-10000"
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value)}
                    min="10"
                    max="10000"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Search After (timestamp)</label>
                  <Input
                    placeholder="Deixe vazio para primeira página"
                    value={searchAfter}
                    onChange={(e) => setSearchAfter(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Query DSL</label>
                <Card className="p-4 bg-gray-900 text-gray-100 font-mono text-xs relative">
                  <button
                    onClick={() => {
                      const q = {
                        size: parseInt(pageSize),
                        query: {
                          bool: {
                            must: [
                              { match: { 'classe.codigo': parseInt(classeCodeigo) } },
                              { match: { 'orgaoJulgador.codigo': parseInt(orgaoJulgador) } }
                            ]
                          }
                        },
                        sort: [{ '@timestamp': { order: 'asc' } }]
                      };
                      if (searchAfter) q.search_after = [parseInt(searchAfter)];
                      copiarCodigo(JSON.stringify(q, null, 2));
                    }}
                    className="absolute top-2 right-2 p-2 hover:bg-gray-700 rounded"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                  <pre>{JSON.stringify({
                    size: pageSize || 'XX',
                    query: {
                      bool: {
                        must: [
                          { match: { 'classe.codigo': classeCodeigo || 'XXX' } },
                          { match: { 'orgaoJulgador.codigo': orgaoJulgador || 'XXX' } }
                        ]
                      }
                    },
                    sort: [{ '@timestamp': { order: 'asc' } }],
                    ...(searchAfter && { search_after: [parseInt(searchAfter)] })
                  }, null, 2)}</pre>
                </Card>
              </div>

              <Button
                onClick={() => { setTestType('paginacao'); executarTeste(); }}
                disabled={loading || !classeCodeigo || !orgaoJulgador}
                className="w-full gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Executando...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Executar Teste
                  </>
                )}
              </Button>

              {response && (
                <Card className="p-4 bg-green-50 dark:bg-green-900 border-green-200">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-900 dark:text-green-100">
                      {response.hits} resultado(s) encontrado(s)
                    </span>
                  </div>
                  {response.data.hits?.hits?.[0]?.sort && (
                    <p className="text-xs text-green-800 dark:text-green-200 mb-3">
                      <strong>Próximo search_after:</strong> {response.data.hits.hits[response.data.hits.hits.length - 1]?.sort?.[0] || 'N/A'}
                    </p>
                  )}
                  <pre className="bg-gray-900 text-green-400 p-4 rounded text-xs overflow-auto max-h-96">
                    {JSON.stringify(response.data, null, 2)}
                  </pre>
                </Card>
              )}

              {error && (
                <Card className="p-4 bg-red-50 dark:bg-red-900 border-red-200">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-red-800 dark:text-red-200">{error}</span>
                  </div>
                </Card>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}