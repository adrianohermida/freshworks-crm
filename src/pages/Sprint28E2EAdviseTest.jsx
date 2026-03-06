import React, { useState, useRef, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Play, AlertCircle, CheckCircle2, Loader, Zap } from 'lucide-react';

export default function Sprint28E2EAdviseTest() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debtAnalysis, setDebtAnalysis] = useState([]);
  const [manualToken, setManualToken] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [allResults, setAllResults] = useState(null);
  const [diasAtras, setDiasAtras] = useState(3);
  const terminalRef = useRef(null);

  // Utilitários de data
  const obterDataHoje = () => {
    const hoje = new Date();
    return hoje.toISOString().split('T')[0];
  };

  const obterDataDiasAtras = (dias) => {
    const data = new Date();
    data.setDate(data.getDate() - dias);
    return data.toISOString().split('T')[0];
  };

  const addLog = (type, message, data = null, metadata = {}) => {
    const timestamp = new Date().toLocaleTimeString();
    const logEntry = {
      id: Date.now(),
      type,
      timestamp,
      message,
      data,
      metadata
    };
    setLogs(prev => [...prev, logEntry]);
  };

  // Validadores de resposta baseado no script Google Apps fornecido
  const validatePublicacaoResponse = (data) => {
    const errors = [];
    
    // Estrutura esperada: { itens: [...], paginacao: {...}, status: {...} }
    if (!data.itens || !Array.isArray(data.itens)) {
      errors.push('Resposta deve conter array "itens"');
    }
    
    // Validar paginação
    if (!data.paginacao || typeof data.paginacao !== 'object') {
      errors.push('Resposta deve conter objeto "paginacao"');
    } else {
      const pagFields = ['paginaAtual', 'paginaTotal', 'registrosPorPagina', 'registrosTotal'];
      const missingPag = pagFields.filter(f => !(f in data.paginacao));
      if (missingPag.length > 0) {
        errors.push(`Campos paginacao faltando: ${missingPag.join(', ')}`);
      }
    }
    
    // Validar status
    if (!data.status || typeof data.status !== 'object') {
      errors.push('Resposta deve conter objeto "status"');
    } else if (data.status.codigo !== 200) {
      errors.push(`Status esperado 200, recebido: ${data.status.codigo}`);
    }
    
    // Validar campos de publicação conforme script Google Apps
    if (data.itens && data.itens.length > 0) {
      const item = data.itens[0];
      const requiredFields = ['numero', 'nomeDiario', 'dataPublicacao', 'cidadeComarcaDescricao', 'varaDescricao', 'conteudo'];
      const missingFields = requiredFields.filter(field => !(field in item));
      if (missingFields.length > 0) {
        errors.push(`Campos obrigatórios faltando: ${missingFields.join(', ')}`);
      }
    }
    
    return errors;
  };

  const testConsultarPublicacoes = async (token, page = 1) => {
    addLog('info', '📋 Teste 1: Consultar Publicações do Contratante (GET)');
    addLog('info', 'ℹ️ Endpoint para gerenciar publicações de clientes (terceiros) contratados');
    
    try {
      const dataFim = obterDataHoje();
      const dataInicio = obterDataDiasAtras(diasAtras);
      
      // Endpoint: consulta-paginada para buscar publicações com paginação
      const baseUrl = 'https://api.advise.com.br/core/v1/publicacoes-clientes/consulta-paginada';
      
      // Parâmetros: 10 por página
      const params = new URLSearchParams({
        campos: '*',
        RegistrosPorPagina: '10',
        paginaAtual: String(page),
        DataInicioMovimento: dataInicio,
        DataFimMovimento: dataFim
      });
      
      const fullUrl = `${baseUrl}?${params.toString()}`;
      
      addLog('info', '🔗 URL Construída:', {
        baseUrl: baseUrl,
        params: Object.fromEntries(params),
        fullUrl: fullUrl
      }, {
        endpoint: baseUrl,
        method: 'GET',
        parametersProvided: true
      });
      
      const startTime = performance.now();
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });
      const duration = (performance.now() - startTime).toFixed(2);
      
      const responseText = await response.text();
      addLog('info', `📥 Resposta Bruta (Status ${response.status}):`, {
        statusCode: response.status,
        contentType: response.headers.get('content-type'),
        bodyLength: responseText.length,
        body: responseText.substring(0, 5000)
      });
      
      let responseData;
      try {
        responseData = responseText ? JSON.parse(responseText) : {};
      } catch (parseError) {
        addLog('error', '❌ Erro ao fazer parse de JSON', {
          error: parseError.message,
          responseText: responseText.substring(0, 500)
        });
        return {
          success: false,
          endpoint: 'publicacoes-contratante',
          error: `JSON Parse Error: ${parseError.message}`,
          rawResponse: responseText.substring(0, 500)
        };
      }
      
      if (response.status !== 200) {
        addLog('error', `❌ Status ${response.status} ao consultar publicações do contratante`, {
          statusCode: response.status,
          statusText: response.statusText,
          response: responseData
        }, {
          endpoint: baseUrl,
          method: 'GET',
          duration: `${duration}ms`,
          httpStatus: response.status
        });
        
        return {
          success: false,
          endpoint: 'publicacoes-contratante',
          error: `HTTP ${response.status}: ${responseData.status?.erros?.[0]?.mensagem || 'Erro desconhecido'}`,
          details: responseData
        };
      }
      
      // Validar resposta conforme estrutura esperada
      const validationErrors = validatePublicacaoResponse(responseData);
      
      if (validationErrors.length > 0) {
        addLog('warn', '⚠️ Resposta com desvios da especificação:', {
          validationErrors,
          itemCount: responseData.itens?.length || 0,
          sampleStructure: responseData.itens?.[0] || {}
        });
        
        return {
          success: false,
          endpoint: 'publicacoes-contratante',
          error: 'Resposta não atende especificação',
          errors: validationErrors,
          data: responseData
        };
      }
      
      addLog('success', `✅ Consulta bem-sucedida: ${responseData.itens.length} publicações (página ${page}/${responseData.paginacao.paginaTotal})`, {
        itemsCount: responseData.itens.length,
        paginacao: responseData.paginacao,
        sample: responseData.itens.length > 0 ? {
          numero: responseData.itens[0].numero,
          nomeDiario: responseData.itens[0].nomeDiario,
          dataPublicacao: responseData.itens[0].dataPublicacao
        } : null
      }, {
        endpoint: baseUrl,
        method: 'GET',
        duration: `${duration}ms`,
        httpStatus: 200,
        publicacionsFound: responseData.itens.length,
        pagination: `${page}/${responseData.paginacao.paginaTotal}`
      });
      
      return {
        success: true,
        endpoint: 'publicacoes-contratante',
        data: responseData,
        errors: []
      };
      
    } catch (error) {
      addLog('error', '❌ Erro ao consultar publicações', {
        message: error.message,
        stack: error.stack
      }, {
        endpoint: 'consultar-publicacoes',
        method: 'GET',
        error: error.message
      });
      
      return {
        success: false,
        endpoint: 'consultar-publicacoes',
        error: error.message
      };
    }
  };

  const testMarcarLido = async (token, idMovProcessoCliente) => {
    addLog('info', '📌 Teste 2: Marcar Publicação como Lido (PUT)');
    
    if (!idMovProcessoCliente) {
      addLog('warn', '⚠️ Sem ID de publicação para marcar como lido');
      return { success: false, error: 'Sem ID disponível' };
    }
    
    try {
      const url = 'https://sandbox-api.advise.com.br/core/v1/publicacoes-clientes/marcar-lidos';
      const body = {
        itens: [
          {
            idMovProcessoCliente: idMovProcessoCliente
          }
        ]
      };
      
      addLog('info', '📤 Body enviado:', body, {
        endpoint: url,
        method: 'PUT',
        action: 'marcar-lidos'
      });
      
      const startTime = performance.now();
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const duration = (performance.now() - startTime).toFixed(2);
      
      const responseData = await response.json();
      
      if (response.status !== 200) {
        addLog('error', `❌ Status ${response.status} ao marcar como lido`, {
          status: response.status,
          response: responseData
        }, {
          endpoint: url,
          method: 'PUT',
          duration: `${duration}ms`,
          statusCode: response.status
        });
        
        return {
          success: false,
          endpoint: 'marcar-lidos',
          error: `Status ${response.status}`
        };
      }
      
      addLog('success', `✅ Publicação marcada como lida`, {
        response: responseData
      }, {
        endpoint: url,
        method: 'PUT',
        duration: `${duration}ms`,
        status: 200
      });
      
      return {
        success: true,
        endpoint: 'marcar-lidos',
        data: responseData
      };
      
    } catch (error) {
      addLog('error', '❌ Erro ao marcar como lido', {
        message: error.message
      }, {
        endpoint: 'marcar-lidos',
        method: 'PUT',
        error: error.message
      });
      
      return {
        success: false,
        endpoint: 'marcar-lidos',
        error: error.message
      };
    }
  };

  const recuperarConteudoCompleto = async (token, item) => {
    try {
      // Tenta múltiplos endpoints
      const endpoints = [
        `https://api.advise.com.br/core/v1/publicacoes-clientes/${item.idMovUsuarioCliente}`,
        `https://api.advise.com.br/core/v1/publicacoes-clientes/${item.id}`,
        `https://api.advise.com.br/core/v1/publicacoes/${item.idPublicacao}`
      ];

      for (const url of endpoints) {
        try {
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json'
            }
          });

          if (response.ok) {
            const data = await response.json();
            const conteudo = data.conteudo || data.despacho || data.inteiro_teor || '';
            if (conteudo) {
              return conteudo;
            }
          }
        } catch (e) {
          continue;
        }
      }
      
      return null;
    } catch (error) {
      console.error(`Erro ao recuperar conteúdo: ${error.message}`);
      return null;
    }
  };

  const testDesmarcarLido = async (token, idMovProcessoCliente) => {
    addLog('info', '📌 Teste 3: Desmarcar Publicação como Lido (PUT)');
    
    if (!idMovProcessoCliente) {
      addLog('warn', '⚠️ Sem ID de publicação para desmarcar como lido');
      return { success: false, error: 'Sem ID disponível' };
    }
    
    try {
      const url = 'https://sandbox-api.advise.com.br/core/v1/publicacoes-clientes/desmarcar-lidos';
      const body = {
        itens: [
          {
            idMovProcessoCliente: idMovProcessoCliente
          }
        ]
      };
      
      addLog('info', '📤 Body enviado:', body, {
        endpoint: url,
        method: 'PUT',
        action: 'desmarcar-lidos'
      });
      
      const startTime = performance.now();
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });
      const duration = (performance.now() - startTime).toFixed(2);
      
      const responseData = await response.json();
      
      if (response.status !== 200) {
        addLog('error', `❌ Status ${response.status} ao desmarcar como lido`, {
          status: response.status,
          response: responseData
        }, {
          endpoint: url,
          method: 'PUT',
          duration: `${duration}ms`,
          statusCode: response.status
        });
        
        return {
          success: false,
          endpoint: 'desmarcar-lidos',
          error: `Status ${response.status}`
        };
      }
      
      addLog('success', `✅ Publicação desmarcada como lida`, {
        response: responseData
      }, {
        endpoint: url,
        method: 'PUT',
        duration: `${duration}ms`,
        status: 200
      });
      
      return {
        success: true,
        endpoint: 'desmarcar-lidos',
        data: responseData
      };
      
    } catch (error) {
      addLog('error', '❌ Erro ao desmarcar como lido', {
        message: error.message
      }, {
        endpoint: 'desmarcar-lidos',
        method: 'PUT',
        error: error.message
      });
      
      return {
        success: false,
        endpoint: 'desmarcar-lidos',
        error: error.message
      };
    }
  };

  const runE2ETests = async () => {
    if (!manualToken.trim()) {
      alert('Cole o token JWT da API Advise');
      return;
    }
    
    setLogs([]);
    setDebtAnalysis([]);
    setLoading(true);
    const results = [];
    
    try {
      addLog('info', '🚀 Iniciando testes E2E - Endpoints de Publicações');
      addLog('info', `📅 Período: últimos ${diasAtras} dias | 📊 10 registros por página`);
      
      // Teste 1: Consultar Publicações (página 1)
      const consultaResult = await testConsultarPublicacoes(manualToken, currentPage);
      results.push(consultaResult);
      
      // Armazenar resultado e recuperar conteúdo completo
      if (consultaResult.success) {
        addLog('info', '🔄 Recuperando conteúdo completo das publicações...');
        
        // Enriquecer cada publicação com conteúdo completo
        const itensEnriquecidos = await Promise.all(
          consultaResult.data.itens.map(async (item) => {
            const conteudoCompleto = await recuperarConteudoCompleto(manualToken, item);
            return {
              ...item,
              conteudoCompleto: conteudoCompleto || item.conteudo || 'Conteúdo não disponível'
            };
          })
        );

        setAllResults({
          ...consultaResult.data,
          itens: itensEnriquecidos
        });
        setTotalPages(consultaResult.data.paginacao.paginaTotal);
        
        addLog('success', `✅ ${itensEnriquecidos.length} publicações enriquecidas com conteúdo completo`);
      }
      
      // Se a consulta foi bem-sucedida e há publicações, testar marcar/desmarcar
      if (consultaResult.success && consultaResult.data.itens.length > 0) {
        const publicacao = consultaResult.data.itens[0];
        const idMovProcessoCliente = publicacao.idMovProcessoCliente || publicacao.id;
        
        // Teste 2: Marcar como Lido
        const marcarResult = await testMarcarLido(manualToken, idMovProcessoCliente);
        results.push(marcarResult);
        
        // Teste 3: Desmarcar como Lido
        const desmarcarResult = await testDesmarcarLido(manualToken, idMovProcessoCliente);
        results.push(desmarcarResult);
      }
      
      // Gerar relatório de débito
      generateDebtReport(results);
      
      addLog('info', '✅ Testes E2E concluídos');
      
    } finally {
      setLoading(false);
    }
  };

  const generateDebtReport = (results) => {
    const debt = [];
    
    results.forEach(result => {
      if (!result.success) {
        debt.push({
          severity: 'critical',
          endpoint: result.endpoint,
          title: `Falha em ${result.endpoint}`,
          description: result.error || 'Erro desconhecido',
          status: 'failed'
        });
      } else if (result.errors && result.errors.length > 0) {
        debt.push({
          severity: 'high',
          endpoint: result.endpoint,
          title: `Desvios em ${result.endpoint}`,
          description: result.errors.join('; '),
          status: 'warnings'
        });
      } else {
        debt.push({
          severity: 'low',
          endpoint: result.endpoint,
          title: `✅ ${result.endpoint}`,
          description: 'Teste aprovado',
          status: 'passed'
        });
      }
    });
    
    setDebtAnalysis(debt);
  };

  const copyLog = (log) => {
    const text = `[${log.timestamp}] ${log.message}\n${log.data ? JSON.stringify(log.data, null, 2) : ''}`;
    navigator.clipboard.writeText(text);
  };

  const exportAllLogs = () => {
    const text = logs.map(l => `[${l.timestamp}] ${l.message}\n${l.data ? JSON.stringify(l.data, null, 2) : ''}`).join('\n---\n');
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">🧪 E2E Test - Advise API (Publicações)</h1>
        <p className="text-gray-600 mb-6">Teste completo dos endpoints de publicações conforme documentação</p>

        {/* Token Input */}
        <Card className="p-6 mb-6 border-purple-200 bg-purple-50">
          <label className="block text-sm font-medium text-gray-700 mb-3">Token JWT Advise</label>
          <textarea
            value={manualToken}
            onChange={(e) => setManualToken(e.target.value)}
            placeholder="Cole seu token JWT completo..."
            className="w-full h-20 p-3 border border-purple-300 rounded text-xs font-mono bg-white"
          />
        </Card>

        {/* Control */}
        <Card className="p-6 mb-6 border-blue-200 bg-blue-50">
          <div className="mb-4 flex gap-4 items-center">
            <label className="text-sm font-medium text-gray-700">Dias a pesquisar:</label>
            <input
              type="number"
              min="1"
              max="365"
              value={diasAtras}
              onChange={(e) => setDiasAtras(Math.max(1, parseInt(e.target.value) || 3))}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
            />
          </div>
          <div className="flex gap-4 flex-wrap">
            <Button
              onClick={runE2ETests}
              disabled={loading || !manualToken.trim()}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? <><Loader className="w-4 h-4 mr-2 animate-spin" />Executando...</> : <><Play className="w-4 h-4 mr-2" />Executar Testes</>}
            </Button>
            <Button onClick={exportAllLogs} variant="outline" disabled={logs.length === 0}>
              <Copy className="w-4 h-4 mr-2" />
              Copiar Logs
            </Button>
            
            {/* Paginação */}
            {totalPages > 0 && (
              <div className="flex gap-2 items-center ml-auto">
                <Button 
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
                  disabled={currentPage === 1}
                  variant="outline"
                  size="sm"
                >
                  ← Anterior
                </Button>
                <span className="text-sm font-medium text-gray-700">
                  Página {currentPage} de {totalPages}
                </span>
                <Button 
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} 
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="sm"
                >
                  Próxima →
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="terminal" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="terminal">Terminal</TabsTrigger>
            <TabsTrigger value="status">Status Testes</TabsTrigger>
          </TabsList>

          <TabsContent value="terminal">
            <Card className="p-6 bg-gray-900 text-gray-100 font-mono text-sm max-h-[600px] overflow-y-auto">
              {logs.length === 0 ? (
                <div className="text-gray-500 text-center py-8">Clique em Executar Testes...</div>
              ) : (
                logs.map((log, idx) => (
                  <div key={`log-${idx}`} className="mb-3 border-b border-gray-700 pb-3">
                    <div className="text-gray-400">[{log.timestamp}]</div>
                    <div className={log.type === 'success' ? 'text-green-400' : log.type === 'error' ? 'text-red-400' : log.type === 'warn' ? 'text-yellow-400' : 'text-blue-400'}>
                      {log.message}
                    </div>
                    {log.data && <pre className="mt-1 bg-gray-800 p-2 rounded text-xs overflow-auto max-h-40">{JSON.stringify(log.data, null, 2)}</pre>}
                  </div>
                ))
              )}
            </Card>
          </TabsContent>

          <TabsContent value="status">
            <div className="space-y-4">
              <Card className="p-6">
                {debtAnalysis.length === 0 ? (
                  <div className="text-center text-gray-500 py-8">Execute testes para ver status...</div>
                ) : (
                  <div className="space-y-3">
                    {debtAnalysis.map((item, idx) => (
                      <div
                        key={`debt-${idx}`}
                        className={`p-4 rounded border-l-4 ${
                          item.severity === 'critical' ? 'bg-red-50 border-red-500' :
                          item.severity === 'high' ? 'bg-yellow-50 border-yellow-500' :
                          'bg-green-50 border-green-500'
                        }`}
                      >
                        <h3 className="font-bold text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-700 mt-1">{item.description}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              {/* Publicações Recuperadas */}
              {allResults && allResults.itens && (
                <Card className="p-6 border-purple-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">📋 Publicações Recuperadas (Página {currentPage})</h3>
                  <div className="space-y-6 max-h-[800px] overflow-y-auto">
                    {allResults.itens.map((item, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded border border-gray-200 space-y-3">
                        {/* Campos principais */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                          <div><strong>Diário:</strong> <span className="text-gray-700">{item.nomeDiario || 'N/A'}</span></div>
                          <div><strong>Processo:</strong> <span className="font-mono text-gray-700">{item.numero || 'N/A'}</span></div>
                          <div><strong>Data Publicação:</strong> <span className="text-gray-700">{item.dataPublicacao ? new Date(item.dataPublicacao).toLocaleDateString('pt-BR') : 'N/A'}</span></div>
                          <div><strong>Comarca:</strong> <span className="text-gray-700">{item.cidadeComarcaDescricao || 'N/A'}</span></div>
                          <div><strong>Vara:</strong> <span className="text-gray-700">{item.varaDescricao || 'N/A'}</span></div>
                          <div><strong>Disponibilização:</strong> <span className="text-gray-700">{item.dataHoraMovimento ? new Date(item.dataHoraMovimento).toLocaleString('pt-BR') : 'N/A'}</span></div>
                        </div>

                        {/* Campos secundários */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs border-t border-gray-300 pt-2">
                          <div><strong>Palavras-chave:</strong> <span className="text-gray-700">{item.palavrasChave?.map(p => p.palavraChave).join(', ') || 'N/A'}</span></div>
                          <div><strong>Caderno:</strong> <span className="text-gray-700">{item.nomeCadernoDiario || 'N/A'}</span></div>
                          <div><strong>Contratante:</strong> <span className="text-gray-700">{item.nomeCliente || 'N/A'}</span></div>
                          <div><strong>Usuário:</strong> <span className="text-gray-700">{item.nomeUsuarioCliente || 'N/A'}</span></div>
                          <div><strong>Edição:</strong> <span className="text-gray-700">{item.edicaoDiario || 'N/A'}</span></div>
                          <div><strong>Página Inicial:</strong> <span className="text-gray-700">{item.paginaInicialPublicacao || 'N/A'}</span></div>
                          <div><strong>Página Final:</strong> <span className="text-gray-700">{item.paginaFinalPublicacao || 'N/A'}</span></div>
                        </div>

                        {/* Despacho */}
                        {(item.despacho) && (
                          <div className="text-xs border-t border-gray-300 pt-2">
                            <strong>Despacho:</strong>
                            <div className="bg-white p-2 rounded mt-1 border border-gray-300 text-gray-600 max-h-24 overflow-y-auto">
                              {item.despacho}
                            </div>
                          </div>
                        )}

                        {/* Conteúdo Completo */}
                        {(item.conteudoCompleto || item.conteudo) && (
                          <div className="text-xs border-t border-gray-300 pt-2">
                            <strong>Conteúdo:</strong>
                            <div className="bg-white p-2 rounded mt-1 border border-gray-300 text-gray-600 max-h-56 overflow-y-auto whitespace-pre-wrap break-words font-mono text-xs">
                              {item.conteudoCompleto || item.conteudo || 'Conteúdo não disponível'}
                            </div>
                            <p className="text-xs text-gray-500 mt-1">Caracteres: {(item.conteudoCompleto || item.conteudo || '').length.toLocaleString('pt-BR')}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}