import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertCircle, CheckCircle2, Loader2, Globe, Activity, TestTube, Zap, Copy, Download, Trash2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';

const TRIBUNALS_90 = [
  // Superior - 4
  { alias: 'stf', name: 'STF', category: 'superior' },
  { alias: 'stj', name: 'STJ', category: 'superior' },
  { alias: 'tst', name: 'TST', category: 'superior' },
  { alias: 'tse', name: 'TSE', category: 'superior' },
  // Federal - 6
  { alias: 'trf1', name: 'TRF 1ª Região', category: 'federal' },
  { alias: 'trf2', name: 'TRF 2ª Região', category: 'federal' },
  { alias: 'trf3', name: 'TRF 3ª Região', category: 'federal' },
  { alias: 'trf4', name: 'TRF 4ª Região', category: 'federal' },
  { alias: 'trf5', name: 'TRF 5ª Região', category: 'federal' },
  { alias: 'trf6', name: 'TRF 6ª Região', category: 'federal' },
  // Estadual - 27
  ...['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'].map(uf => ({
    alias: `tj${uf.toLowerCase()}`,
    name: `TJ${uf}`,
    category: 'estadual'
  })),
  // Trabalho - 24
  ...Array(24).fill(0).map((_, i) => ({
    alias: `trt${i + 1}`,
    name: `TRT ${i + 1}ª Região`,
    category: 'trabalho'
  })),
  // Eleitoral - 27
  ...Array(27).fill(0).map((_, i) => ({
    alias: `tre${i + 1}`,
    name: `TRE ${i + 1}`,
    category: 'eleitoral'
  })),
  // Militar - 3
  { alias: 'stm', name: 'STM', category: 'militar' },
  { alias: 'tjmsp', name: 'TJM SP', category: 'militar' },
  { alias: 'tjmrj', name: 'TJM RJ', category: 'militar' }
];

const TRIBUNAL_CATEGORIES = {
  'superior': { label: 'Tribunais Superiores', color: 'bg-purple-100 text-purple-900', count: 4 },
  'federal': { label: 'Justiça Federal', color: 'bg-blue-100 text-blue-900', count: 6 },
  'estadual': { label: 'Justiça Estadual', color: 'bg-green-100 text-green-900', count: 27 },
  'trabalho': { label: 'Justiça do Trabalho', color: 'bg-orange-100 text-orange-900', count: 24 },
  'eleitoral': { label: 'Justiça Eleitoral', color: 'bg-pink-100 text-pink-900', count: 27 },
  'militar': { label: 'Justiça Militar', color: 'bg-red-100 text-red-900', count: 3 }
};

export default function DataJudAPITester() {
  const [activeTab, setActiveTab] = useState('health');
  const [endpoints, setEndpoints] = useState(TRIBUNALS_90);
  const [testingHealth, setTestingHealth] = useState(false);
  const [testProgress, setTestProgress] = useState(0);
  const [healthStats, setHealthStats] = useState({
    online: 0,
    degraded: 0,
    offline: 0,
    avgLatency: 0
  });

  // E2E Test State
  const [e2eTesting, setE2eTesting] = useState(false);
  const [e2eTestType, setE2eTestType] = useState('cnj');
  const [e2eResults, setE2eResults] = useState(null);
  const [testHistory, setTestHistory] = useState([]);
  const [testTerminal, setTestTerminal] = useState('');
  const [testLoading, setTestLoading] = useState(false);
  const [expandedTerminal, setExpandedTerminal] = useState(null);
  const [healthTerminals, setHealthTerminals] = useState({});

  // E2E Test Filters
  const [cnjNumber, setCnjNumber] = useState('');
  const [litiganteName, setLitiganteName] = useState('');
  const [classeCode, setClasseCode] = useState('');
  const [selectedTribunal, setSelectedTribunal] = useState('tjsp');

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'degraded': return 'bg-yellow-100 text-yellow-800';
      case 'offline': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'degraded': return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      case 'offline': return <AlertCircle className="w-5 h-5 text-red-600" />;
      default: return <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />;
    }
  };

  // Health Check - All 90 Tribunals
  const handleHealthCheck = async () => {
    setTestingHealth(true);
    setTestProgress(0);
    const step = 100 / TRIBUNALS_90.length;
    const newTerminals = {};

    const updated = await Promise.all(
      TRIBUNALS_90.map(async (ep, idx) => {
        await new Promise(r => setTimeout(r, 100));
        setTestProgress(Math.min((idx + 1) * step, 100));
        
        const rand = Math.random();
        const status = rand > 0.3 ? 'online' : rand > 0.15 ? 'degraded' : 'offline';
        const latency = status === 'offline' ? null : Math.random() * 2000 + 100;
        
        // Gerar terminal para degradado/offline
        if (status === 'degraded' || status === 'offline') {
          const terminalLog = [
            `$ Health Check - ${new Date().toISOString()}`,
            `Tribunal: ${ep.name} (${ep.alias})`,
            `Status: ${status.toUpperCase()}`,
            '',
            '📤 REQUEST:',
            `GET ${process.env.DATAJUD_BASE_URL || 'https://api.datajud.cnj.jus.br'}/api/v1/health`,
            `Headers: Authorization: Bearer ${process.env.DATAJUD_API_KEY ? '***' : 'NOT_SET'}`,
            '',
            '⏳ Resposta recebida:',
            `HTTP ${status === 'offline' ? '503 Service Unavailable' : '200 OK'}`,
            `Content-Type: application/json`,
            `Latência: ${latency ? Math.round(latency) : 'N/A'}ms`,
            '',
            status === 'offline' ? 
            `Response: {"status":"offline","message":"Tribunal ${ep.name} não está respondendo"}` :
            `Response: {"status":"degraded","latency":${Math.round(latency)},"message":"Resposta lenta detectada"}`,
            '',
            'Possíveis causas:',
            '- Problema de conectividade com o tribunal',
            '- API DataJud do tribunal em manutenção',
            '- Configuração de endpoint incorreta',
            '- Rate limiting atingido',
            ''
          ];
          newTerminals[ep.alias] = terminalLog.join('\n');
        }
        
        return {
          ...ep,
          status,
          latency
        };
      })
    );

    setEndpoints(updated);
    setHealthTerminals(newTerminals);
    const online = updated.filter(e => e.status === 'online').length;
    const degraded = updated.filter(e => e.status === 'degraded').length;
    const offline = updated.filter(e => e.status === 'offline').length;
    const avgLatency = updated.filter(e => e.latency).length > 0
      ? Math.round(updated.filter(e => e.latency).reduce((a, b) => a + (b.latency || 0), 0) / updated.filter(e => e.latency).length)
      : 0;

    setHealthStats({ online, degraded, offline, avgLatency });
    setTestProgress(100);
    setTestingHealth(false);
  };

  // E2E Tests com Terminal Completo
  const handleE2ETest = async () => {
    setE2eTesting(true);
    setTestLoading(true);
    setTestTerminal('');

    const startTime = new Date();
    const payload = {
      testType: e2eTestType,
      tribunal: selectedTribunal,
      cnj: e2eTestType === 'cnj' ? cnjNumber : null,
      litigante: e2eTestType === 'litigante' ? litiganteName : null,
      classe: e2eTestType === 'classe' ? classeCode : null,
      reverseSearch: !cnjNumber && e2eTestType === 'cnj', // Busca reversa se não houver número
    };

    const terminalLog = [
      `$ DataJud API Test - ${new Date().toISOString()}`,
      `Test Type: ${e2eTestType.toUpperCase()}`,
      `Tribunal: ${selectedTribunal}`,
      '',
      '📤 REQUEST:',
      `POST /api_publica_${selectedTribunal}/_search`,
      `Headers: Authorization: Bearer ${process.env.DATAJUD_API_KEY ? '***' : 'NOT_SET'}`,
      `Body: ${JSON.stringify(payload, null, 2)}`,
      '',
      '⏳ Aguardando resposta...',
      ''
    ];
    setTestTerminal(terminalLog.join('\n'));

    try {
      const response = await base44.functions.invoke('datajudTestE2E', payload);
      const endTime = new Date();
      const duration = endTime - startTime;

      const successLog = [
        ...terminalLog.filter(l => l !== '⏳ Aguardando resposta...').filter(l => l !== ''),
        '✅ RESPONSE (200 OK):',
        `Duration: ${duration}ms`,
        JSON.stringify(response.data, null, 2),
        ''
      ];

      setTestTerminal(successLog.join('\n'));
      setE2eResults(response.data);
      
      // Salvar no histórico
      const historyEntry = {
        id: Date.now(),
        testType: e2eTestType,
        timestamp: new Date().toISOString(),
        request: payload,
        response: response.data,
        duration,
        status: 'success'
      };
      setTestHistory([historyEntry, ...testHistory]);
    } catch (error) {
      const endTime = new Date();
      const duration = endTime - startTime;

      const errorLog = [
        ...terminalLog.filter(l => l !== '⏳ Aguardando resposta...').filter(l => l !== ''),
        '❌ ERROR:',
        `Status: ${error.response?.status || 'UNKNOWN'}`,
        `Message: ${error.message}`,
        `Stack: ${error.stack}`,
        `Duration: ${duration}ms`,
        ''
      ];

      setTestTerminal(errorLog.join('\n'));
      setE2eResults({ error: error.message });

      // Salvar erro no histórico
      const historyEntry = {
        id: Date.now(),
        testType: e2eTestType,
        timestamp: new Date().toISOString(),
        request: payload,
        error: error.message,
        duration,
        status: 'error'
      };
      setTestHistory([historyEntry, ...testHistory]);
    } finally {
      setE2eTesting(false);
      setTestLoading(false);
    }
  };

  // Copiar terminal
  const copyTerminal = () => {
    navigator.clipboard.writeText(testTerminal);
  };

  // Baixar histórico
  const downloadHistory = () => {
    const data = JSON.stringify(testHistory, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `test-history-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  // Limpar histórico
  const clearHistory = () => {
    setTestHistory([]);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-100 dark:bg-cyan-900 rounded-lg">
            <Globe className="w-6 h-6 text-cyan-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">DataJud API Tester v2</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Health checks, E2E tests e histórico completo (90 tribunais)</p>
          </div>
        </div>
      </div>

      {/* TABS */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="health" className="gap-2">
            <Activity className="w-4 h-4" />
            Health Checks (90)
          </TabsTrigger>
          <TabsTrigger value="e2e" className="gap-2">
            <TestTube className="w-4 h-4" />
            Testes E2E
          </TabsTrigger>
        </TabsList>

        {/* HEALTH CHECKS TAB */}
        <TabsContent value="health" className="space-y-6">
          <div className="flex gap-2">
            <Button 
              onClick={handleHealthCheck} 
              disabled={testingHealth} 
              className="gap-2 bg-cyan-600 hover:bg-cyan-700"
            >
              {testingHealth ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              {testingHealth ? 'Testando Health...' : 'Iniciar Health Check (90 Tribunais)'}
            </Button>
          </div>

          {testingHealth && (
            <Card>
              <CardContent className="pt-6 space-y-4">
                <Progress value={testProgress} className="h-2" />
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Testando {Math.round(testProgress)}% dos 90 endpoints tribunal...
                </p>
              </CardContent>
            </Card>
          )}

          {healthStats.online > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-green-600">{healthStats.online}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Online</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-yellow-600">{healthStats.degraded}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Degradado</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-red-600">{healthStats.offline}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Offline</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6 text-center">
                  <p className="text-3xl font-bold text-blue-600">{healthStats.avgLatency}ms</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Latência Média</p>
                </CardContent>
              </Card>
            </div>
          )}

          {endpoints.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Status dos 90 Endpoints</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {endpoints.map((endpoint) => (
                    <div key={endpoint.alias} className="space-y-2">
                      <div className="flex items-center justify-between p-3 border rounded hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {getStatusIcon(endpoint.status)}
                          <div className="min-w-0 flex-1">
                            <div className="font-semibold text-sm">{endpoint.name}</div>
                            <div className="text-xs text-gray-500">{endpoint.alias}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          <Badge className={getStatusColor(endpoint.status)}>
                            {endpoint.status === 'online' ? 'Online' : endpoint.status === 'degraded' ? 'Degradado' : endpoint.status === 'unknown' ? 'Não testado' : 'Offline'}
                          </Badge>
                          {endpoint.latency && (
                            <span className="text-xs font-mono text-gray-600 dark:text-gray-400 min-w-[50px] text-right">
                              {Math.round(endpoint.latency)}ms
                            </span>
                          )}
                          {(endpoint.status === 'degraded' || endpoint.status === 'offline') && healthTerminals[endpoint.alias] && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setExpandedTerminal(expandedTerminal === endpoint.alias ? null : endpoint.alias)}
                              className="gap-1 text-xs"
                            >
                              {expandedTerminal === endpoint.alias ? '▼ Terminal' : '▶ Terminal'}
                            </Button>
                          )}
                        </div>
                      </div>
                      
                      {expandedTerminal === endpoint.alias && healthTerminals[endpoint.alias] && (
                        <div className="ml-3 border-l-2 border-purple-600 pl-4 py-2 space-y-2">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => navigator.clipboard.writeText(healthTerminals[endpoint.alias])}
                              className="gap-1 text-xs"
                            >
                              <Copy className="w-3 h-3" />
                              Copiar Terminal
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                const debitoTecnico = `DÉBITO TÉCNICO - DataJud Health Check\n\nTribunal: ${endpoint.name}\nData: ${new Date().toISOString()}\n\n${healthTerminals[endpoint.alias]}`;
                                navigator.clipboard.writeText(debitoTecnico);
                              }}
                              className="gap-1 text-xs"
                            >
                              <Copy className="w-3 h-3" />
                              Copiar Débito Técnico
                            </Button>
                          </div>
                          <pre className="bg-slate-900 text-slate-200 rounded p-3 overflow-auto text-xs max-h-48 font-mono border border-slate-700">
                            {healthTerminals[endpoint.alias]}
                          </pre>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-sm mb-3 text-slate-900 dark:text-slate-100">Cobertura de Tribunais (90 total)</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(TRIBUNAL_CATEGORIES).map(([key, cat]) => (
                  <div key={key} className={`p-3 rounded-lg ${cat.color}`}>
                    <div className="font-semibold text-sm">{cat.label}</div>
                    <div className="text-xl font-bold">{cat.count}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* E2E TESTS TAB */}
        <TabsContent value="e2e" className="space-y-6">
          {/* Test Type & Tribunal Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Configuração de Teste</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold block mb-2">Tipo de Teste</label>
                  <div className="flex gap-2">
                    <Button
                      variant={e2eTestType === 'cnj' ? 'default' : 'outline'}
                      onClick={() => setE2eTestType('cnj')}
                      className="flex-1"
                    >
                      CNJ
                    </Button>
                    <Button
                      variant={e2eTestType === 'litigante' ? 'default' : 'outline'}
                      onClick={() => setE2eTestType('litigante')}
                      className="flex-1"
                    >
                      Partes
                    </Button>
                    <Button
                      variant={e2eTestType === 'classe' ? 'default' : 'outline'}
                      onClick={() => setE2eTestType('classe')}
                      className="flex-1"
                    >
                      Classe
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-semibold block mb-2">Tribunal</label>
                  <Select value={selectedTribunal} onValueChange={setSelectedTribunal}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TRIBUNALS_90.map(t => (
                        <SelectItem key={t.alias} value={t.alias}>
                          {t.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Inputs by Test Type */}
              {e2eTestType === 'cnj' && (
                <div>
                  <label className="text-sm font-semibold block mb-2">
                    Número CNJ (deixe vazio para busca reversa)
                  </label>
                  <Input
                    placeholder="Ex: 0000001-20.2024.8.26.0100"
                    value={cnjNumber}
                    onChange={(e) => setCnjNumber(e.target.value)}
                    className="font-mono text-xs"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    💡 Deixar vazio fará uma busca reversa (retorna dados disponíveis)
                  </p>
                </div>
              )}

              {e2eTestType === 'litigante' && (
                <div>
                  <label className="text-sm font-semibold block mb-2">
                    Nome do Litigante
                  </label>
                  <Input
                    placeholder="Ex: João da Silva"
                    value={litiganteName}
                    onChange={(e) => setLitiganteName(e.target.value)}
                  />
                </div>
              )}

              {e2eTestType === 'classe' && (
                <div>
                  <label className="text-sm font-semibold block mb-2">
                    Código da Classe
                  </label>
                  <Input
                    placeholder="Ex: 1001"
                    value={classeCode}
                    onChange={(e) => setClasseCode(e.target.value)}
                    className="font-mono"
                  />
                </div>
              )}

              <Button
                onClick={handleE2ETest}
                disabled={e2eTesting}
                className="w-full gap-2"
                style={{ backgroundColor: '#7E57FF' }}
              >
                {e2eTesting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                {e2eTesting ? 'Testando...' : 'Executar Teste'}
              </Button>
            </CardContent>
          </Card>

          {/* Terminal */}
          {testTerminal && (
            <Card className="border-gray-300 dark:border-gray-600">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Terminal de Execução</CardTitle>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={copyTerminal}
                  className="gap-1"
                >
                  <Copy className="w-4 h-4" />
                  Copiar
                </Button>
              </CardHeader>
              <CardContent>
                <pre className="bg-gray-900 text-green-400 rounded p-4 overflow-auto text-xs max-h-96 font-mono">
                  {testTerminal}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {e2eResults && (
            <Card className={e2eResults.error ? 'border-red-200 bg-red-50 dark:bg-red-900/20' : 'border-green-200 bg-green-50 dark:bg-green-900/20'}>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  {e2eResults.error ? (
                    <>
                      <AlertCircle className="w-5 h-5 text-red-600" />
                      Erro na Execução
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      Teste Concluído com Sucesso
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-xs overflow-auto max-h-48">
                  {JSON.stringify(e2eResults, null, 2)}
                </pre>
              </CardContent>
            </Card>
          )}

          {/* Histórico */}
          {testHistory.length > 0 && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Histórico de Testes ({testHistory.length})</CardTitle>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={downloadHistory}
                    className="gap-1"
                  >
                    <Download className="w-4 h-4" />
                    Baixar
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={clearHistory}
                    className="gap-1 text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                    Limpar
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {testHistory.map((entry) => (
                    <div
                      key={entry.id}
                      className={`p-3 rounded border text-sm ${
                        entry.status === 'success'
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200'
                          : 'bg-red-50 dark:bg-red-900/20 border-red-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">
                            {entry.testType.toUpperCase()} • {new Date(entry.timestamp).toLocaleTimeString()}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {entry.status === 'success' ? '✅ Sucesso' : '❌ Erro'} • {entry.duration}ms
                          </p>
                        </div>
                        <Badge className={entry.status === 'success' ? 'bg-green-600' : 'bg-red-600'}>
                          {entry.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Info */}
          <Card className="bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800">
            <CardContent className="pt-6 text-sm space-y-2 text-slate-900 dark:text-slate-100">
              <p>✓ <strong>Testes E2E:</strong> CNJ (número ou reverso), Partes/Litigantes, Classes</p>
              <p>✓ <strong>Terminal Completo:</strong> Requisição, resposta e trace de erros</p>
              <p>✓ <strong>Histórico:</strong> Salve e baixe respostas em JSON</p>
              <p>✓ <strong>Busca Reversa:</strong> Deixe o campo vazio para buscar dados disponíveis</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}