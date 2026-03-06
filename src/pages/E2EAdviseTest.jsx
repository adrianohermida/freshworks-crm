import React, { useState, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Play, Loader } from 'lucide-react';

export default function E2EAdviseTest() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debtAnalysis, setDebtAnalysis] = useState([]);
  const [manualToken, setManualToken] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [allResults, setAllResults] = useState(null);
  const [diasAtras, setDiasAtras] = useState(3);

  const obterDataHoje = () => new Date().toISOString().split('T')[0];
  const obterDataDiasAtras = (dias) => {
    const data = new Date();
    data.setDate(data.getDate() - dias);
    return data.toISOString().split('T')[0];
  };

  const addLog = (type, message, data = null) => {
    setLogs(prev => [...prev, { id: Date.now(), type, timestamp: new Date().toLocaleTimeString(), message, data }]);
  };

  const validatePublicacaoResponse = (data) => {
    const errors = [];
    if (!data.itens || !Array.isArray(data.itens)) errors.push('Resposta deve conter array "itens"');
    if (!data.paginacao) errors.push('Resposta deve conter objeto "paginacao"');
    else {
      ['paginaAtual','paginaTotal','registrosPorPagina','registrosTotal'].filter(f => !(f in data.paginacao)).forEach(f => errors.push(`Campo paginacao faltando: ${f}`));
    }
    if (!data.status || data.status.codigo !== 200) errors.push(`Status esperado 200, recebido: ${data.status?.codigo}`);
    return errors;
  };

  const testConsultarPublicacoes = async (token, page = 1) => {
    addLog('info', '📋 Teste 1: Consultar Publicações (GET /core/v1/publicacoes-clientes/consulta-paginada)');
    try {
      const params = new URLSearchParams({ campos: '*', RegistrosPorPagina: '10', paginaAtual: String(page), DataInicioMovimento: obterDataDiasAtras(diasAtras), DataFimMovimento: obterDataHoje() });
      const url = `https://api.advise.com.br/core/v1/publicacoes-clientes/consulta-paginada?${params}`;
      addLog('info', `🔗 URL: ${url}`);
      const t = performance.now();
      const resp = await fetch(url, { headers: { 'Authorization': `Bearer ${token}` } });
      const duration = (performance.now() - t).toFixed(0);
      const text = await resp.text();
      addLog('info', `📥 HTTP ${resp.status} (${duration}ms) — ${text.length} chars`);
      let data;
      try { data = JSON.parse(text); } catch { addLog('error', '❌ JSON inválido', { body: text.substring(0, 500) }); return { success: false, endpoint: 'consulta-paginada', error: 'JSON inválido' }; }
      if (resp.status !== 200) { addLog('error', `❌ HTTP ${resp.status}`, data); return { success: false, endpoint: 'consulta-paginada', error: `HTTP ${resp.status}`, details: data }; }
      const erros = validatePublicacaoResponse(data);
      if (erros.length) { addLog('warn', '⚠️ Desvios:', erros); return { success: false, endpoint: 'consulta-paginada', errors: erros, data }; }
      addLog('success', `✅ ${data.itens.length} publicações — pág ${page}/${data.paginacao.paginaTotal}`);
      return { success: true, endpoint: 'consulta-paginada', data, errors: [] };
    } catch (e) { addLog('error', `❌ Erro: ${e.message}`); return { success: false, endpoint: 'consulta-paginada', error: e.message }; }
  };

  const testMarcarLido = async (token, id) => {
    addLog('info', `📌 Teste 2: Marcar como Lido (PUT) — id: ${id}`);
    if (!id) return { success: false, error: 'Sem ID' };
    try {
      const resp = await fetch('https://api.advise.com.br/core/v1/publicacoes-clientes/marcar-lidos', { method: 'PUT', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ itens: [{ idMovProcessoCliente: id }] }) });
      const data = await resp.json();
      if (resp.status !== 200) { addLog('error', `❌ HTTP ${resp.status}`, data); return { success: false, endpoint: 'marcar-lidos', error: `HTTP ${resp.status}` }; }
      addLog('success', '✅ Marcado como lido', data);
      return { success: true, endpoint: 'marcar-lidos', data };
    } catch (e) { addLog('error', `❌ ${e.message}`); return { success: false, endpoint: 'marcar-lidos', error: e.message }; }
  };

  const testDesmarcarLido = async (token, id) => {
    addLog('info', `📌 Teste 3: Desmarcar Lido (PUT) — id: ${id}`);
    if (!id) return { success: false, error: 'Sem ID' };
    try {
      const resp = await fetch('https://api.advise.com.br/core/v1/publicacoes-clientes/desmarcar-lidos', { method: 'PUT', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ itens: [{ idMovProcessoCliente: id }] }) });
      const data = await resp.json();
      if (resp.status !== 200) { addLog('error', `❌ HTTP ${resp.status}`, data); return { success: false, endpoint: 'desmarcar-lidos', error: `HTTP ${resp.status}` }; }
      addLog('success', '✅ Desmarcado como lido', data);
      return { success: true, endpoint: 'desmarcar-lidos', data };
    } catch (e) { addLog('error', `❌ ${e.message}`); return { success: false, endpoint: 'desmarcar-lidos', error: e.message }; }
  };

  const runE2ETests = async () => {
    if (!manualToken.trim()) { alert('Cole o token JWT'); return; }
    setLogs([]); setDebtAnalysis([]); setLoading(true);
    const results = [];
    try {
      addLog('info', `🚀 Iniciando E2E — últimos ${diasAtras} dias`);
      const r1 = await testConsultarPublicacoes(manualToken, currentPage);
      results.push(r1);
      if (r1.success) {
        setAllResults(r1.data); setTotalPages(r1.data.paginacao.paginaTotal);
        if (r1.data.itens.length > 0) {
          const id = r1.data.itens[0].idMovProcessoCliente || r1.data.itens[0].id;
          results.push(await testMarcarLido(manualToken, id));
          results.push(await testDesmarcarLido(manualToken, id));
        }
      }
      setDebtAnalysis(results.map(r => ({ severity: r.success ? 'low' : 'critical', title: r.success ? `✅ ${r.endpoint}` : `❌ ${r.endpoint}`, description: r.success ? 'Aprovado' : (r.error || r.errors?.join('; ') || 'Erro') })));
      addLog('info', '✅ Testes concluídos');
    } finally { setLoading(false); }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-1">🧪 E2E Test — Advise API</h1>
      <p className="text-gray-500 text-sm mb-6">Teste direto dos endpoints de publicações</p>
      <Card className="p-4 mb-4 bg-purple-50 border-purple-200">
        <label className="block text-sm font-medium mb-2">Token JWT Advise</label>
        <textarea value={manualToken} onChange={e => setManualToken(e.target.value)} placeholder="Cole o token JWT..." className="w-full h-16 p-2 border rounded text-xs font-mono" />
      </Card>
      <Card className="p-4 mb-4 bg-blue-50 border-blue-200">
        <div className="flex gap-4 items-center flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Dias:</label>
            <input type="number" min="1" max="365" value={diasAtras} onChange={e => setDiasAtras(+e.target.value || 3)} className="w-16 px-2 py-1 border rounded text-sm" />
          </div>
          <Button onClick={runE2ETests} disabled={loading || !manualToken.trim()} className="bg-blue-600 hover:bg-blue-700">
            {loading ? <><Loader className="w-4 h-4 mr-1 animate-spin" />Executando...</> : <><Play className="w-4 h-4 mr-1" />Executar</>}
          </Button>
          <Button variant="outline" onClick={() => { const t = logs.map(l => `[${l.timestamp}] ${l.message}\n${l.data ? JSON.stringify(l.data, null, 2) : ''}`).join('\n---\n'); navigator.clipboard.writeText(t); }} disabled={!logs.length}><Copy className="w-4 h-4 mr-1" />Copiar Logs</Button>
          {totalPages > 0 && <div className="flex gap-2 items-center ml-auto">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>← Ant</Button>
            <span className="text-sm">{currentPage}/{totalPages}</span>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>Próx →</Button>
          </div>}
        </div>
      </Card>
      <Tabs defaultValue="terminal">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="terminal">Terminal</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
        </TabsList>
        <TabsContent value="terminal">
          <Card className="p-4 bg-gray-900 text-gray-100 font-mono text-xs max-h-[500px] overflow-y-auto">
            {!logs.length ? <div className="text-gray-500 text-center py-8">Aguardando execução...</div> : logs.map((l, i) => (
              <div key={i} className="mb-2 pb-2 border-b border-gray-700">
                <span className="text-gray-500">[{l.timestamp}] </span>
                <span className={l.type === 'success' ? 'text-green-400' : l.type === 'error' ? 'text-red-400' : l.type === 'warn' ? 'text-yellow-400' : 'text-blue-300'}>{l.message}</span>
                {l.data && <pre className="mt-1 bg-gray-800 p-1 rounded text-xs overflow-auto max-h-32">{typeof l.data === 'string' ? l.data : JSON.stringify(l.data, null, 2)}</pre>}
              </div>
            ))}
          </Card>
        </TabsContent>
        <TabsContent value="status">
          <div className="space-y-3">
            {!debtAnalysis.length ? <Card className="p-8 text-center text-gray-500">Execute testes para ver status</Card> : debtAnalysis.map((d, i) => (
              <Card key={i} className={`p-4 border-l-4 ${d.severity === 'critical' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'}`}>
                <p className="font-bold">{d.title}</p>
                <p className="text-sm text-gray-600">{d.description}</p>
              </Card>
            ))}
            {allResults?.itens && (
              <Card className="p-4">
                <h3 className="font-bold mb-3">📋 Publicações ({allResults.itens.length})</h3>
                <div className="space-y-4 max-h-[600px] overflow-y-auto">
                  {allResults.itens.map((item, idx) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded border text-xs space-y-2">
                      <div className="grid grid-cols-2 gap-1">
                        <div><strong>Diário:</strong> {item.nomeDiario || 'N/A'}</div>
                        <div><strong>Processo:</strong> {item.numero || 'N/A'}</div>
                        <div><strong>Data:</strong> {item.dataPublicacao ? new Date(item.dataPublicacao).toLocaleDateString('pt-BR') : 'N/A'}</div>
                        <div><strong>Comarca:</strong> {item.cidadeComarcaDescricao || 'N/A'}</div>
                      </div>
                      {item.conteudo && <div><strong>Conteúdo:</strong><div className="bg-white border p-2 rounded mt-1 max-h-32 overflow-y-auto font-mono">{item.conteudo}</div></div>}
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}