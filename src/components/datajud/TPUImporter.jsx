import React, { useState, useRef, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, Database, Loader2, FileJson, RefreshCw, Gauge, WifiOff, AlertTriangle, AlertCircle, CheckCircle2, File } from 'lucide-react';
import { toast } from 'sonner';
import DataJudTPUDebugTerminal from './DataJudTPUDebugTerminal';
import TPUMetricsCollector from './TPUMetricsCollector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const TABELAS_TPU = [
  { type: 'classes', label: 'Classes Processuais', icon: '📋' },
  { type: 'assuntos', label: 'Assuntos Processuais', icon: '📚' },
  { type: 'movimentos', label: 'Movimentos Processuais', icon: '⚙️' },
  { type: 'documentos', label: 'Documentos Processuais', icon: '📄' }
];

export default function TPUImporter() {
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  
  const [selectedEntity, setSelectedEntity] = useState('TPUClasse');
  const [jsonText, setJsonText] = useState('');
  const [importing, setImporting] = useState(false);
  const [stats, setStats] = useState({});
  const [showDebug, setShowDebug] = useState(false);
  const [debugLogs, setDebugLogs] = useState([]);
  const [arquivoSelecionado, setArquivoSelecionado] = useState(null);

  // Query para schema TPU
  const { data: schemaTpu, isLoading: loadingSchema } = useQuery({
    queryKey: ['tpu_schema'],
    queryFn: async () => {
      try {
        const res = await base44.functions.invoke('coletarSchemaTPU', {});
        return res?.data;
      } catch (err) {
        console.error('[TPUImporter] Erro ao coletar schema:', err);
        return null;
      }
    },
    refetchInterval: false,
    retry: 1,
  });

  // Counts via schema
  const tpuStats = useMemo(() => {
    if (!schemaTpu?.tabelas) return { classes: 0, assuntos: 0, movimentos: 0, documentos: 0 };
    return {
      classes:    schemaTpu.tabelas.classes?.total_local_banco ?? 0,
      assuntos:   schemaTpu.tabelas.assuntos?.total_local_banco ?? 0,
      movimentos: schemaTpu.tabelas.movimentos?.total_local_banco ?? 0,
      documentos: schemaTpu.tabelas.documentos?.total_local_banco ?? 0,
    };
  }, [schemaTpu]);

  const syncSgtMutation = useMutation({
    mutationFn: async () => {
      setShowDebug(true);
      setDebugLogs([]);

      const addLog = (tipo, mensagem, detalhes = '', response = null, stackTrace = '') => {
        setDebugLogs(prev => [...prev, {
          timestamp: new Date().toLocaleTimeString('pt-BR'),
          tipo,
          mensagem,
          detalhes,
          response,
          stackTrace,
          erro_code: tipo === 'erro' ? detalhes.split('\n')[0] : null,
        }]);
      };

      try {
         addLog('info', 'Iniciando sincronização TPU via SGT...', 'Coleta de Classes, Assuntos, Movimentos e Documentos');

         const res = await base44.functions.invoke('sincronizarTpuViaSgt', { 
           tipos: ['classes', 'assuntos', 'movimentos', 'documentos']
         });

         if (res.data) {
           addLog('sucesso', 'Sincronização concluída com sucesso', 
             `Total criados: ${res.data.totalCriados} | Duplicatas: ${res.data.totalDuplicatas}`,
             res.data
           );

           // Log detalhado por tipo
           Object.entries(res.data.detalhes || {}).forEach(([tipo, detalhe]) => {
             const status = detalhe.erros > 0 ? 'erro' : 'sucesso';
             addLog(status, `${tipo}`, 
               `Coletados: ${detalhe.coletados} | Criados: ${detalhe.criados} | Duplicatas: ${detalhe.duplicatas} | Tempo: ${detalhe.tempo_ms}ms`
             );
           });
         }
         return res.data;
      } catch (err) {
        const errorMsg = err.response?.data?.error || err.message || 'Erro desconhecido';
        const stackTrace = err.stack || err.response?.data?.stackTrace || '';

        addLog('erro', 'Erro ao sincronizar TPU via SGT', errorMsg, err.response?.data, stackTrace);
        throw err;
      }
    },
    onSuccess: (data) => {
      toast.success(`Sync TPU concluído: +${data.totalCriados} novos`);
      queryClient.invalidateQueries({ queryKey: ['tpu_schema'] });
    },
    onError: (err) => {
      toast.error('Erro ao sincronizar. Verifique o terminal de debug.');
    }
  });

  const handleImport = async () => {
    if (!arquivoSelecionado) { 
      toast.error('Selecione um arquivo SQL'); 
      return; 
    }

    setImporting(true);
    setShowDebug(true);
    setDebugLogs([]);

    const addLog = (tipo, mensagem, detalhes = '', progresso = 0) => {
      setDebugLogs(prev => [...prev, {
        timestamp: new Date().toLocaleTimeString('pt-BR'),
        tipo,
        mensagem,
        detalhes,
        progresso,
        erro_code: tipo === 'erro' ? detalhes.split('\n')[0] : null
      }]);
    };

    try {
      addLog('info', 'Iniciando importação SQL', `Arquivo: ${arquivoSelecionado.name}`);
      addLog('info', 'Lendo arquivo...', `Tamanho: ${(arquivoSelecionado.size / 1024 / 1024).toFixed(2)}MB`, 10);

      const leitor = new FileReader();
      leitor.onload = async (e) => {
        try {
          const conteudo = e.target.result;
          addLog('info', 'Arquivo carregado na memória', `${conteudo.length} caracteres`, 20);

          const temClasses = /INSERT\s+INTO\s+"?(?:tpu_)?classes?"?/i.test(conteudo);
          const temAssuntos = /INSERT\s+INTO\s+"?(?:tpu_)?assuntos?"?/i.test(conteudo);
          const temMovimentos = /INSERT\s+INTO\s+"?(?:tpu_)?movimentos?"?/i.test(conteudo);
          const temDocumentos = /INSERT\s+INTO\s+"?(?:tpu_)?documentos?"?/i.test(conteudo);
          const algumDetectado = temClasses || temAssuntos || temMovimentos || temDocumentos;

          if (temClasses) addLog('sucesso', 'Tabela Classes detectada', '✓ INSERT encontrado', 30);
          if (temAssuntos) addLog('sucesso', 'Tabela Assuntos detectada', '✓ INSERT encontrado', 40);
          if (temMovimentos) addLog('sucesso', 'Tabela Movimentos detectada', '✓ INSERT encontrado', 50);
          if (temDocumentos) addLog('sucesso', 'Tabela Documentos detectada', '✓ INSERT encontrado', 60);
          if (!algumDetectado) {
            const preview = conteudo.substring(0, 400);
            addLog('aviso', 'Nenhuma tabela TPU detectada localmente', `Preview: ${preview}`);
          }

          addLog('info', 'Enviando arquivo para servidor', 'Executando importação...', 70);

          const formData = new FormData();
          formData.append('arquivo', arquivoSelecionado, arquivoSelecionado.name);

          const res = await fetch(`/api/functions/importarTPUSql`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
          });
          const data = await res.json();
          
          if (data?.status === 'sucesso' || data?.status === 'parcial') {
            addLog('sucesso', 'Importação concluída com sucesso', 
              `Total importado: ${data.total.importado} | Duplicatas: ${data.total.duplicatas || 0}`, 100);
            
            Object.entries(data.porTabela || {}).forEach(([tabela, info]) => {
              addLog(info.importados > 0 ? 'sucesso' : 'aviso', `Tabela: ${tabela}`, 
                `Extraídos: ${info.registros_extraidos}, Importados: ${info.importados}, Duplicatas: ${info.duplicatas || 0}, Erros: ${info.erros}`);
            });

            setArquivoSelecionado(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
            queryClient.invalidateQueries({ queryKey: ['tpu_schema'] });
            toast.success(`✓ ${data.total.importado} registros importados`);
          } else {
            addLog('erro', 'Erro ao importar', data?.error || 'Resposta inválida');
            if (data?.preview_sql) addLog('info', 'Preview SQL (início)', data.preview_sql.substring(0, 300));
            toast.error(data?.error || 'Erro ao importar arquivo');
          }
        } catch (importErr) {
          const errMsg = importErr.response?.data?.error || importErr.message || 'Erro desconhecido';
          addLog('erro', 'Erro na importação', errMsg);
          toast.error(errMsg);
        } finally {
          setImporting(false);
        }
      };
      leitor.readAsText(arquivoSelecionado);
    } catch (error) {
      addLog('erro', 'Erro ao processar arquivo', error.message || 'Erro desconhecido');
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <Tabs defaultValue="sync" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="metrics" className="flex items-center gap-2">
            <Gauge className="w-4 h-4" />
            <span className="hidden sm:inline">Métricas</span>
          </TabsTrigger>
          <TabsTrigger value="sync">Sincronização</TabsTrigger>
          <TabsTrigger value="import">Importação</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics" className="space-y-4">
          <TPUMetricsCollector />
        </TabsContent>

        <TabsContent value="sync" className="space-y-4">
          {loadingSchema && (
            <div className="flex items-center gap-2 text-sm text-gray-500 p-3 bg-slate-50 rounded-lg">
              <Loader2 className="w-4 h-4 animate-spin" />
              Buscando métricas da API CNJ TPU...
            </div>
          )}
          {schemaTpu?.resumo && (
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <FileJson className="w-4 h-4" />
                  📊 Métricas CNJ/TPU
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <p className="text-slate-600 font-medium">Tabelas Acessíveis</p>
                  <p className="text-lg font-bold text-green-600">{schemaTpu.resumo.tabelas_acessiveis}/{schemaTpu.resumo.total_tabelas}</p>
                </div>
                <div>
                  <p className="text-slate-600 font-medium">Registros Locais</p>
                  <p className="text-lg font-bold text-blue-600">{(schemaTpu.resumo.total_registros_local || 0).toLocaleString('pt-BR')}</p>
                </div>
                <div>
                  <p className="text-slate-600 font-medium">API CNJ</p>
                  <p className={`text-lg font-bold ${schemaTpu.resumo.api_funcional ? 'text-green-600' : 'text-red-600'}`}>
                    {schemaTpu.resumo.api_funcional ? '✓ Online' : '✗ Offline'}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {TABELAS_TPU.map((tabela) => {
              const schemaInfo = schemaTpu?.tabelas?.[tabela.type];
              const localCount = tpuStats[tabela.type] ?? 0;
              const apiOk = schemaInfo?.status === 'acessivel';
              const apiErro = schemaInfo && schemaInfo.status !== 'acessivel';
              const semDados = !loadingSchema && localCount === 0;
              const contadorIncerto = !loadingSchema && !schemaTpu;

              let borderClass = 'border-slate-200';
              let statusIcon = null;
              let statusBadge = null;

              if (loadingSchema) {
                borderClass = 'border-slate-200';
              } else if (apiErro) {
                borderClass = 'border-red-300 bg-red-50';
                statusIcon = <WifiOff className="w-3.5 h-3.5 text-red-500" />;
                statusBadge = <Badge className="bg-red-100 text-red-700 text-xs">API offline</Badge>;
              } else if (contadorIncerto) {
                borderClass = 'border-amber-300 bg-amber-50';
                statusIcon = <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />;
                statusBadge = <Badge className="bg-amber-100 text-amber-700 text-xs">Não verificado</Badge>;
              } else if (semDados && apiOk) {
                borderClass = 'border-amber-300 bg-amber-50';
                statusIcon = <AlertCircle className="w-3.5 h-3.5 text-amber-500" />;
                statusBadge = <Badge className="bg-amber-100 text-amber-700 text-xs">Vazio</Badge>;
              } else if (apiOk && localCount > 0) {
                borderClass = 'border-green-200';
                statusIcon = <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />;
                statusBadge = <Badge className="bg-green-100 text-green-700 text-xs">Sincronizado</Badge>;
              }

              const reconectarMutation = useMutation({
                mutationFn: async () => {
                  try {
                    const res = await base44.functions.invoke('buscarTPU', { 
                      tipo: tabela.type,
                      pagina: 1,
                      limite: 1
                    });
                    return res?.data;
                  } catch (err) {
                    throw err;
                  }
                },
                onSuccess: (data) => {
                  toast.success(`✓ ${tabela.label}: ${data?.total || 0} registros`);
                  queryClient.invalidateQueries({ queryKey: ['tpu_schema'] });
                },
                onError: (err) => {
                  const errMsg = err.response?.data?.error || err.message || 'Erro desconhecido';
                  toast.error(`✗ ${tabela.label}: ${errMsg}`);
                }
              });

              return (
                <Card key={tabela.type} className={`${borderClass} transition-colors`}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center justify-between gap-1">
                      <span>{tabela.icon} {tabela.label}</span>
                      {statusIcon}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {loadingSchema ? (
                      <div className="flex items-center gap-2 text-gray-400">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span className="text-sm">...</span>
                      </div>
                    ) : (
                      <div className={`text-2xl font-bold ${contadorIncerto ? 'text-amber-500' : 'text-slate-800'}`}>
                        {localCount.toLocaleString('pt-BR')}
                        {contadorIncerto && <span className="text-sm font-normal text-amber-400 ml-1">?</span>}
                      </div>
                    )}
                    <p className="text-xs text-gray-500">registros locais</p>
                    {statusBadge}
                    {schemaInfo && apiOk && (
                      <p className="text-xs text-green-600">CNJ: {schemaInfo.amostra_registros} amostras ✓</p>
                    )}
                    {apiErro && (
                      <p className="text-xs text-red-500">Sem conexão com CNJ</p>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => reconectarMutation.mutate()}
                      disabled={reconectarMutation.isPending || loadingSchema}
                      className="w-full mt-2 text-xs"
                    >
                      {reconectarMutation.isPending ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          Reconectando...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Reconectar
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {schemaTpu && !schemaTpu.resumo?.api_funcional && (
            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
              <WifiOff className="w-4 h-4 flex-shrink-0" />
              <span>API CNJ TPU offline. Use a importação SQL para carregar dados.</span>
            </div>
          )}
          {!schemaTpu && !loadingSchema && (
            <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-700">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>Métricas não verificadas. Clique em "Métricas" para verificar o status da API CNJ.</span>
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <RefreshCw className="w-5 h-5" />
                Sincronizar com CNJ (SGT)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">
                Busca automaticamente as tabelas mais atualizadas do CNJ via SOAP/WSDL
              </p>
              <Button
                onClick={() => syncSgtMutation.mutate()}
                disabled={syncSgtMutation.isPending}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {syncSgtMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sincronizando...
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sincronizar TPU Agora
                  </>
                )}
              </Button>
              
              {showDebug && (
                <div className="mt-4">
                  <DataJudTPUDebugTerminal 
                    logs={debugLogs}
                    isLoading={syncSgtMutation.isPending}
                    onClear={() => {
                      setDebugLogs([]);
                      setShowDebug(false);
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="import" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <File className="w-5 h-5" />
                Importar SQL (PostgreSQL/MySQL)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-3">
                  Carregue arquivo SQL com tabelas TPU (Classes, Assuntos, Movimentos, Documentos). Máximo 500MB.
                </p>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => {
                  const arquivo = e.target.files?.[0];
                  if (arquivo) {
                    setArquivoSelecionado(arquivo);
                  }
                }}
                accept=".sql,.txt"
                className="hidden"
                disabled={importing}
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                disabled={importing}
                variant="outline"
                className="w-full"
              >
                <Upload className="w-4 h-4 mr-2" />
                Selecionar arquivo SQL
              </Button>

              {arquivoSelecionado && (
                <Button
                  onClick={handleImport}
                  disabled={importing}
                  className="bg-cyan-600 hover:bg-cyan-700 w-full"
                >
                  {importing
                    ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Importando...</>
                    : <><Upload className="w-4 h-4 mr-2" />Importar {arquivoSelecionado.name}</>}
                </Button>
              )}

              {showDebug && (
                <div className="mt-4">
                  <DataJudTPUDebugTerminal 
                    logs={debugLogs}
                    isLoading={importing}
                    onClear={() => {
                      setDebugLogs([]);
                      setShowDebug(false);
                    }}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}