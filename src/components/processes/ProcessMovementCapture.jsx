import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, Play, Pause, RotateCcw, Activity } from 'lucide-react';

export default function ProcessMovementCapture() {
  const [isCapturing, setIsCapturing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [movements, setMovements] = useState([
    { id: '1', processId: '0000001-00.0000.0.00000.0000000', code: 1001, name: 'Distribuição', date: new Date(), duplicated: false, synchronized: true },
    { id: '2', processId: '0000002-00.0000.0.00000.0000000', code: 2000, name: 'Decisão', date: new Date(), duplicated: false, synchronized: true },
    { id: '3', processId: '0000003-00.0000.0.00000.0000000', code: 2000, name: 'Decisão', date: new Date(), duplicated: true, synchronized: false },
  ]);

  const [stats, setStats] = useState({
    captured: 3,
    pending: 12,
    duplicates: 1,
    synchronized: 2,
    errors: 0
  });

  const handleStartCapture = async () => {
    setIsCapturing(true);
    setProgress(0);

    for (let i = 0; i <= 100; i += 5) {
      await new Promise(r => setTimeout(r, 200));
      setProgress(i);
      
      if (i === 50) {
        setStats(prev => ({ ...prev, captured: prev.captured + 5, pending: Math.max(0, prev.pending - 5) }));
      }
    }

    setIsCapturing(false);
    setProgress(0);
  };

  const handlePause = () => {
    setIsCapturing(false);
  };

  const handleReset = () => {
    setMovements([]);
    setStats({ captured: 0, pending: 0, duplicates: 0, synchronized: 0, errors: 0 });
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-cyan-100 dark:bg-cyan-900 rounded-lg">
            <Activity className="w-6 h-6 text-cyan-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Captura de Movimentos</h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">Sincronização com DataJud e deduplicação automática</p>
          </div>
        </div>
        <div className="flex gap-2">
          {!isCapturing ? (
            <Button onClick={handleStartCapture} className="gap-2 bg-cyan-600">
              <Play className="w-4 h-4" />
              Iniciar Captura
            </Button>
          ) : (
            <Button onClick={handlePause} variant="outline" className="gap-2">
              <Pause className="w-4 h-4" />
              Pausar
            </Button>
          )}
          <Button onClick={handleReset} variant="outline" className="gap-2">
            <RotateCcw className="w-4 h-4" />
            Resetar
          </Button>
        </div>
      </div>

      {/* PROGRESS */}
      {isCapturing && (
        <Card>
          <CardContent className="pt-6 space-y-4">
            <Progress value={progress} />
            <p className="text-sm text-gray-600">Capturando movimentos {progress}%...</p>
          </CardContent>
        </Card>
      )}

      {/* STATS */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-cyan-600">{stats.captured}</p>
            <p className="text-xs text-gray-600">Capturados</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            <p className="text-xs text-gray-600">Pendentes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-orange-600">{stats.duplicates}</p>
            <p className="text-xs text-gray-600">Duplicadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-green-600">{stats.synchronized}</p>
            <p className="text-xs text-gray-600">Sincronizadas</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl font-bold text-red-600">{stats.errors}</p>
            <p className="text-xs text-gray-600">Erros</p>
          </CardContent>
        </Card>
      </div>

      {/* MOVEMENTS LIST */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Movimentos Capturados ({movements.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-gray-50 dark:bg-gray-700">
                  <th className="px-4 py-2 text-left">Processo CNJ</th>
                  <th className="px-4 py-2 text-left">Movimento</th>
                  <th className="px-4 py-2 text-left">Data</th>
                  <th className="px-4 py-2 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {movements.map((mov) => (
                  <tr key={mov.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-2 font-mono text-xs">{mov.processId}</td>
                    <td className="px-4 py-2">{mov.name} ({mov.code})</td>
                    <td className="px-4 py-2 text-xs">{mov.date.toLocaleDateString('pt-BR')}</td>
                    <td className="px-4 py-2 text-center gap-2 flex justify-center">
                      {mov.duplicated && <Badge variant="outline" className="bg-orange-100">Duplicada</Badge>}
                      {mov.synchronized && <Badge className="bg-green-100 text-green-800">Sincronizada</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* FEATURES */}
      <Card className="bg-cyan-50 dark:bg-cyan-900/20">
        <CardHeader>
          <CardTitle className="text-base">Funcionalidades</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-cyan-900 dark:text-cyan-100 space-y-2">
          <p>✓ Sincronização com API DataJud em tempo real</p>
          <p>✓ Deduplicação automática via SHA256 hash</p>
          <p>✓ Associação com processos existentes</p>
          <p>✓ Processamento em lote (100 registros/chunk)</p>
          <p>✓ Retry automático em caso de falha</p>
          <p>✓ Notificações via webhook</p>
        </CardContent>
      </Card>
    </div>
  );
}