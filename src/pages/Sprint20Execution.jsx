import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  BarChart3,
  Users,
  TrendingUp,
  Code,
  Zap,
  Activity
} from 'lucide-react';

export default function Sprint20Execution() {
  const [phases, setPhases] = useState([
    { id: 1, name: 'Post-Launch Monitoring', points: 5, status: 'completed', progress: 100, icon: BarChart3 },
    { id: 2, name: 'Customer Success', points: 4, status: 'completed', progress: 100, icon: Users },
    { id: 3, name: 'Growth & Expansion', points: 5, status: 'completed', progress: 100, icon: TrendingUp },
    { id: 4, name: 'Advanced Features', points: 4, status: 'completed', progress: 100, icon: Code },
    { id: 5, name: 'Reliability & Scale', points: 3, status: 'completed', progress: 100, icon: Zap }
  ]);

  const [running, setRunning] = useState(false);
  const [results, setResults] = useState(null);

  const totalPoints = phases.reduce((sum, p) => sum + p.points, 0);
  const completedPoints = phases.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.points, 0);
  const completionPercent = Math.round((completedPoints / totalPoints) * 100);

  const runMonitoring = async () => {
    setRunning(true);
    try {
      const response = await base44.functions.invoke('monitoring/postLaunchSetup', {});
      setResults({ type: 'monitoring', data: response.data });
    } catch (err) {
      setResults({ type: 'monitoring', error: err.message });
    } finally {
      setRunning(false);
    }
  };

  const runCustomerSuccess = async () => {
    setRunning(true);
    try {
      const response = await base44.functions.invoke('growth/customerSuccessSetup', {});
      setResults({ type: 'cs', data: response.data });
    } catch (err) {
      setResults({ type: 'cs', error: err.message });
    } finally {
      setRunning(false);
    }
  };

  const runGrowth = async () => {
    setRunning(true);
    try {
      const response = await base44.functions.invoke('growth/growthInitiatives', {});
      setResults({ type: 'growth', data: response.data });
    } catch (err) {
      setResults({ type: 'growth', error: err.message });
    } finally {
      setRunning(false);
    }
  };

  const runFeatures = async () => {
    setRunning(true);
    try {
      const response = await base44.functions.invoke('features/advancedFeaturesSetup', {});
      setResults({ type: 'features', data: response.data });
    } catch (err) {
      setResults({ type: 'features', error: err.message });
    } finally {
      setRunning(false);
    }
  };

  const runReliability = async () => {
    setRunning(true);
    try {
      const response = await base44.functions.invoke('infrastructure/reliabilityScale', {});
      setResults({ type: 'reliability', data: response.data });
    } catch (err) {
      setResults({ type: 'reliability', error: err.message });
    } finally {
      setRunning(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4" />;
      case 'in_progress': return <Loader2 className="w-4 h-4 animate-spin" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-slate-100 min-h-screen">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Sprint 20 — Crescimento & Expansão</h1>
        <p className="text-gray-600">Executando: Monitoramento pós-lançamento, sucesso de clientes e novos recursos</p>
      </div>

      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Progresso do Sprint</span>
            <span className="text-2xl font-bold text-purple-600">{completionPercent}%</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={completionPercent} className="h-3" />
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{completedPoints}</div>
              <div className="text-xs text-gray-600">Points Concluídos</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">{totalPoints}</div>
              <div className="text-xs text-gray-600">Total Points</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {phases.filter(p => p.status === 'completed').length}
              </div>
              <div className="text-xs text-gray-600">Fases Completas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {phases.filter(p => p.status !== 'completed').length}
              </div>
              <div className="text-xs text-gray-600">Em Progresso/Pendente</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phases */}
      <div className="space-y-3">
        {phases.map(phase => {
          const Icon = phase.icon;
          return (
            <Card key={phase.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <Icon className="w-5 h-5 text-purple-600 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{phase.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(phase.status)} flex items-center gap-1`}>
                          {getStatusIcon(phase.status)}
                          {phase.status === 'completed' ? 'Concluído' : phase.status === 'in_progress' ? 'Em Progresso' : 'Pendente'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{phase.points} points</p>
                      {phase.progress > 0 && (
                        <Progress value={phase.progress} className="h-2 mt-2" />
                      )}
                    </div>
                  </div>
                  {phase.id === 1 && (
                    <Button
                      onClick={runMonitoring}
                      disabled={running}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {running ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Setup...
                        </>
                      ) : (
                        <>
                          <Activity className="w-4 h-4 mr-2" />
                          View Results
                        </>
                      )}
                    </Button>
                  )}
                  {phase.id === 2 && (
                    <Button
                      onClick={runCustomerSuccess}
                      disabled={running}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {running ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : ''}
                      View Results
                    </Button>
                  )}
                  {phase.id === 3 && (
                    <Button
                      onClick={runGrowth}
                      disabled={running}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {running ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : ''}
                      View Results
                    </Button>
                  )}
                  {phase.id === 4 && (
                    <Button
                      onClick={runFeatures}
                      disabled={running}
                      className="bg-orange-600 hover:bg-orange-700 text-white"
                    >
                      {running ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : ''}
                      View Results
                    </Button>
                  )}
                  {phase.id === 5 && (
                    <Button
                      onClick={runReliability}
                      disabled={running}
                      className="bg-red-600 hover:bg-red-700 text-white"
                    >
                      {running ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : ''}
                      View Results
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Results */}
      {results && (
        <Card className={results.error ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {results.error ? (
                <>
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  Setup — Erro
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Post-Launch Monitoring — Ativo
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {results.error ? (
              <p className="text-red-800">{results.error}</p>
            ) : (
              <div className="space-y-3">
                {results.data?.monitors?.map((monitor, i) => (
                  <div key={i} className="p-3 bg-white rounded text-sm">
                    <div className="font-medium text-gray-900">{monitor.name}</div>
                    <div className="text-gray-600 text-xs mt-1">{monitor.status}</div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Timeline */}
      <Alert className="border-blue-200 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900 ml-2">
          <strong>Timeline Sprint 20:</strong> Semana 1 (Monitoring), Semana 2 (Customer Success), Semana 3 (Growth), Semana 4 (Advanced Features + Reliability)
        </AlertDescription>
      </Alert>
    </div>
  );
}