import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Zap,
  Shield,
  Gauge,
  FileText,
  BookOpen,
  BarChart3
} from 'lucide-react';

export default function Sprint19Execution() {
  const [tasks, setTasks] = useState([
    { id: 1, name: 'E2E Test Suite', points: 5, status: 'completed', progress: 100, icon: BarChart3 },
    { id: 2, name: 'Security Audit', points: 4, status: 'completed', progress: 100, icon: Shield },
    { id: 3, name: 'Performance Optimization', points: 3, status: 'completed', progress: 100, icon: Gauge },
    { id: 4, name: 'Production Deployment', points: 4, status: 'pending', progress: 0, icon: Zap },
    { id: 5, name: 'API Documentation', points: 2, status: 'pending', progress: 0, icon: FileText },
    { id: 6, name: 'Maintenance Handbook', points: 2, status: 'pending', progress: 0, icon: BookOpen }
  ]);

  const [testResults, setTestResults] = useState(null);
  const [securityResults, setSecurityResults] = useState(null);
  const [perfResults, setPerfResults] = useState(null);
  const [running, setRunning] = useState(false);

  const totalPoints = tasks.reduce((sum, t) => sum + t.points, 0);
  const completedPoints = tasks.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.points, 0);
  const completionPercent = Math.round((completedPoints / totalPoints) * 100);

  const runE2ETests = async () => {
    setRunning(true);
    try {
      const response = await base44.functions.invoke('testing/e2eTestSuite', {});
      setTestResults(response.data);
      if (response.data?.success) {
        setTasks(tasks.map(t => t.id === 1 ? { ...t, status: 'completed', progress: 100 } : t));
      }
    } catch (err) {
      setTestResults({ success: false, error: err.message });
    } finally {
      setRunning(false);
    }
  };

  const runSecurityAudit = async () => {
    setRunning(true);
    try {
      const response = await base44.functions.invoke('security/securityAudit', {});
      setSecurityResults(response.data);
      if (response.data?.success) {
        setTasks(tasks.map(t => t.id === 2 ? { ...t, status: 'completed', progress: 100 } : t));
      }
    } catch (err) {
      setSecurityResults({ success: false, error: err.message });
    } finally {
      setRunning(false);
    }
  };

  const runPerfAudit = async () => {
    setRunning(true);
    try {
      const response = await base44.functions.invoke('performance/lighthouseOptimization', {});
      setPerfResults(response.data);
      if (response.data?.success || response.data?.lighthouseScore >= 90) {
        setTasks(tasks.map(t => t.id === 3 ? { ...t, status: 'completed', progress: 100 } : t));
      }
    } catch (err) {
      setPerfResults({ success: false, error: err.message });
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
        <h1 className="text-3xl font-bold text-gray-900">Sprint 19 — Produção & Finalização</h1>
        <p className="text-gray-600">Validação final, segurança, performance e deploy para produção</p>
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
                {tasks.filter(t => t.status === 'completed').length}
              </div>
              <div className="text-xs text-gray-600">Tarefas Completas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {tasks.filter(t => t.status === 'pending').length}
              </div>
              <div className="text-xs text-gray-600">Pendentes</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <div className="space-y-3">
        {tasks.map(task => {
          const Icon = task.icon;
          return (
            <Card key={task.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <Icon className="w-5 h-5 text-purple-600 mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{task.name}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)} flex items-center gap-1`}>
                          {getStatusIcon(task.status)}
                          {task.status === 'completed' ? 'Concluído' : task.status === 'in_progress' ? 'Em Progresso' : 'Pendente'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{task.points} points</p>
                      {task.progress > 0 && (
                        <Progress value={task.progress} className="h-2 mt-2" />
                      )}
                    </div>
                  </div>
                  {task.id === 1 && (
                    <Button
                      onClick={runE2ETests}
                      disabled={running}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      {running ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Testando...
                        </>
                      ) : (
                        <>
                          <Zap className="w-4 h-4 mr-2" />
                          Rodar Testes
                        </>
                      )}
                    </Button>
                  )}
                  {task.id === 2 && (
                    <Button
                      onClick={runSecurityAudit}
                      disabled={running}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {running ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Auditando...
                        </>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Rodar Audit
                        </>
                      )}
                    </Button>
                  )}
                  {task.id === 3 && (
                    <Button
                      onClick={runPerfAudit}
                      disabled={running}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {running ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Medindo...
                        </>
                      ) : (
                        <>
                          <Gauge className="w-4 h-4 mr-2" />
                          Rodar Performance
                        </>
                      )}
                    </Button>
                  )}
                  {task.id === 4 && (
                    <Button
                      disabled={true}
                      className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    >
                      Próximo...
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Security Audit Results */}
      {securityResults && (
        <Card className={securityResults.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {securityResults.success ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Security Audit — Passou
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  Security Audit — Falhou
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-green-600">{securityResults.passed}</div>
                <div className="text-xs text-gray-600">Passou</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-red-600">{securityResults.failed}</div>
                <div className="text-xs text-gray-600">Falhou</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{securityResults.passRate}%</div>
                <div className="text-xs text-gray-600">Taxa</div>
              </div>
            </div>
            <div className="p-3 bg-white rounded text-sm font-semibold text-gray-900">
              {securityResults.recommendation}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Performance Audit Results */}
      {perfResults && (
        <Card className={perfResults.lighthouseScore >= 90 ? 'border-green-200 bg-green-50' : 'border-yellow-200 bg-yellow-50'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gauge className="w-5 h-5 text-orange-600" />
              Performance Audit — Lighthouse {perfResults.lighthouseScore}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={perfResults.lighthouseScore} className="h-3" />
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-green-600">{perfResults.passed}</div>
                <div className="text-xs text-gray-600">Métricas OK</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{perfResults.failed}</div>
                <div className="text-xs text-gray-600">Lentas</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{perfResults.overallTimeMs}ms</div>
                <div className="text-xs text-gray-600">Tempo Total</div>
              </div>
            </div>
            <div className="p-3 bg-white rounded text-sm font-semibold text-gray-900">
              {perfResults.recommendation}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Test Results */}
      {testResults && (
        <Card className={testResults.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {testResults.success ? (
                <>
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  E2E Tests — Passou
                </>
              ) : (
                <>
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  E2E Tests — Falhou
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-green-600">{testResults.passed}</div>
                <div className="text-xs text-gray-600">Passou</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-red-600">{testResults.failed}</div>
                <div className="text-xs text-gray-600">Falhou</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{testResults.passRate}</div>
                <div className="text-xs text-gray-600">Taxa de Sucesso</div>
              </div>
            </div>
            {testResults.results && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {testResults.results.map((result, i) => (
                  <div key={i} className="flex items-start gap-2 p-2 bg-white rounded text-xs">
                    <span className={result.status.includes('PASS') ? 'text-green-600' : 'text-red-600'}>
                      {result.status}
                    </span>
                    <span className="text-gray-700">{result.name}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Next Steps */}
      <Alert className="border-blue-200 bg-blue-50">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-900 ml-2">
          <strong>Próximos Passos:</strong> Após E2E tests, executar Security Audit (LGPD + Rate-limit) e depois Performance Optimization.
        </AlertDescription>
      </Alert>
    </div>
  );
}