import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Zap, Loader2 } from 'lucide-react';

export default function ProcessEnrichmentPanel() {
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichProgress, setEnrichProgress] = useState(0);
  const [processes, setProcesses] = useState([
    { cnj: '0000001-00.0000.0.00000.0000000', title: 'Processo A', class: 'Ação Civil', subject: 'Responsabilidade Civil', enriched: true, confidence: 98 },
    { cnj: '0000002-00.0000.0.00000.0000000', title: 'Processo B', class: 'Mandado MS', subject: 'Direito Administrativo', enriched: true, confidence: 92 },
    { cnj: '0000003-00.0000.0.00000.0000000', title: 'Processo C', class: null, subject: null, enriched: false, confidence: 0 },
    { cnj: '0000004-00.0000.0.00000.0000000', title: 'Processo D', class: 'Ação Penal', subject: 'Crime Cibernético', enriched: true, confidence: 85 },
  ]);

  const [stats, setStats] = useState({
    total: 4,
    enriched: 3,
    pending: 1,
    avgConfidence: 91.7
  });

  const handleStartEnrichment = async () => {
    setIsEnriching(true);
    setEnrichProgress(0);

    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 300));
      setEnrichProgress(i);
    }

    setStats(prev => ({
      ...prev,
      enriched: prev.total,
      pending: 0
    }));

    setIsEnriching(false);
    setEnrichProgress(0);
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-violet-100 dark:bg-violet-900 rounded-lg">
            <Zap className="w-6 h-6 text-violet-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Enriquecimento de Processos</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Integração com TPU e cálculo de prazos legais</p>
          </div>
        </div>
        <Button
          onClick={handleStartEnrichment}
          disabled={isEnriching}
          className="gap-2 bg-violet-600"
        >
          {isEnriching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
          {isEnriching ? 'Enriquecendo...' : 'Iniciar Enriquecimento'}
        </Button>
      </div>

      {/* PROGRESS */}
      {isEnriching && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Progress value={enrichProgress} />
            <p className="text-sm text-gray-600">Enriquecendo processos {enrichProgress}%...</p>
          </CardContent>
        </Card>
      )}

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-violet-600">{stats.total}</p>
            <p className="text-sm text-gray-600">Total de Processos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-green-600">{stats.enriched}</p>
            <p className="text-sm text-gray-600">Enriquecidos</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-sm text-gray-600">Pendentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-3xl font-bold text-blue-600">{stats.avgConfidence.toFixed(1)}%</p>
            <p className="text-sm text-gray-600">Confiança Média</p>
          </CardContent>
        </Card>
      </div>

      {/* PROCESSES */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Processos Enriquecidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {processes.map((proc) => (
              <div key={proc.cnj} className="border rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold">{proc.title}</p>
                    <p className="text-xs font-mono text-gray-600">{proc.cnj}</p>
                  </div>
                  <Badge className={proc.enriched ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                    {proc.enriched ? 'Enriquecido' : 'Pendente'}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="text-gray-600">Classe</p>
                    <p className="font-semibold">{proc.class || '—'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Assunto</p>
                    <p className="font-semibold">{proc.subject || '—'}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Confiança</p>
                    <div className="flex items-center gap-2">
                      <Progress value={proc.confidence} className="w-16" />
                      <span className="font-semibold">{proc.confidence}%</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FEATURES */}
      <Card className="bg-violet-50 dark:bg-violet-900/20">
        <CardHeader>
          <CardTitle className="text-base">Enriquecimento Automático</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-violet-900 dark:text-violet-100 space-y-2">
          <p>✓ Associação com tabelas TPU (Classes, Movimentos, Assuntos)</p>
          <p>✓ Cálculo de prazos legais baseado em movimentos</p>
          <p>✓ Normalização de órgãos julgadores</p>
          <p>✓ Detecção de processos relacionados (apensos)</p>
          <p>✓ Score de confiança por análise semântica</p>
          <p>✓ Histórico de enriquecimento para auditoria</p>
        </CardContent>
      </Card>
    </div>
  );
}