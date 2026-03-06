import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  Zap,
  Wifi,
  Settings,
  Download,
  Loader2
} from 'lucide-react';

/**
 * Página de Validação Sprint 17 - Consolidação de testes e checklist
 */
export default function Sprint17Validation() {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [swStatus, setSwStatus] = useState(null);
  const [manifestStatus, setManifestStatus] = useState(null);
  const [offlineStatus, setOfflineStatus] = useState(null);
  const [isChecking, setIsChecking] = useState(false);

  // Dados do checklist
  const phases = {
    phase1: {
      name: 'Fase 1: Setup Manual Sprint 13',
      description: 'Validar arquivos em public/ e configurações',
      items: [
        { id: 'p1_1', label: 'service-worker.js copiado em public/', required: true },
        { id: 'p1_2', label: 'manifest.json copiado em public/', required: true },
        { id: 'p1_3', label: 'offline.html copiado em public/', required: true },
        { id: 'p1_4', label: 'VAPID keys geradas', required: true },
        { id: 'p1_5', label: 'Icons 9 tamanhos criados em public/', required: true },
        { id: 'p1_6', label: '.env.local configurado com VAPID', required: true }
      ]
    },
    phase2: {
      name: 'Fase 2: Build & Lighthouse',
      description: 'Validar build e performance',
      items: [
        { id: 'p2_1', label: '`npm run build` executa sem erros', required: true },
        { id: 'p2_2', label: '`npm run preview -- --https` funciona', required: true },
        { id: 'p2_3', label: 'Lighthouse PWA score: 90+', required: true },
        { id: 'p2_4', label: 'Lighthouse Performance: 80+', required: true },
        { id: 'p2_5', label: 'Lighthouse Accessibility: 90+', required: true },
        { id: 'p2_6', label: 'Assets estáticos < 5MB', required: true }
      ]
    },
    phase3: {
      name: 'Fase 3: PWA Functionality',
      description: 'Testes de funcionalidade PWA',
      items: [
        { id: 'p3_1', label: 'Service Worker status "activated"', required: true },
        { id: 'p3_2', label: 'Offline page aparece (DevTools offline)', required: true },
        { id: 'p3_3', label: 'Cache storage com 3 caches', required: true },
        { id: 'p3_4', label: 'Push notifications podem ser ativadas', required: true },
        { id: 'p3_5', label: 'Install prompt funciona (mobile)', required: true }
      ]
    },
    phase4: {
      name: 'Fase 4: API Testing',
      description: 'Validar endpoints da API',
      items: [
        { id: 'p4_1', label: 'GET /api/publications retorna dados', required: true },
        { id: 'p4_2', label: 'GET /api/processes retorna dados', required: true },
        { id: 'p4_3', label: 'GET /api/intimations retorna dados', required: true },
        { id: 'p4_4', label: 'Parâmetros de query funcionam corretamente', required: true }
      ]
    },
    phase5: {
      name: 'Fase 5: Documentação',
      description: 'Documentação final de testes',
      items: [
        { id: 'p5_1', label: 'Test report documentado', required: true },
        { id: 'p5_2', label: 'Issues identificadas listadas', required: true },
        { id: 'p5_3', label: 'Fixes aplicadas validadas', required: true },
        { id: 'p5_4', label: 'Sign-off para publicação confirmado', required: true }
      ]
    }
  };

  // Validar Service Worker
  const checkServiceWorker = async () => {
    setIsChecking(true);
    try {
      if ('serviceWorker' in navigator) {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          setSwStatus({
            active: registration.active ? 'active' : 'inactive',
            registered: true,
            scope: registration.scope
          });
        } else {
          setSwStatus({ registered: false, active: 'not-registered' });
        }
      } else {
        setSwStatus({ error: 'Service Worker não suportado' });
      }
    } catch (error) {
      setSwStatus({ error: error.message });
    }
    setIsChecking(false);
  };

  // Validar Manifest
  const checkManifest = async () => {
    setIsChecking(true);
    try {
      const response = await fetch('/manifest.json');
      const data = await response.json();
      setManifestStatus({
        found: true,
        name: data.name,
        icons: data.icons?.length || 0,
        theme_color: data.theme_color
      });
    } catch (error) {
      setManifestStatus({ found: false, error: error.message });
    }
    setIsChecking(false);
  };

  // Validar Offline Page
  const checkOfflineFile = async () => {
    setIsChecking(true);
    try {
      const response = await fetch('/offline.html');
      setOfflineStatus({
        found: response.status === 200,
        status: response.status
      });
    } catch (error) {
      setOfflineStatus({ found: false, error: error.message });
    }
    setIsChecking(false);
  };

  // Toggle tarefa
  const toggleTask = (taskId) => {
    setCompletedTasks(prev =>
      prev.includes(taskId)
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  // Calcular progresso
  const calculateProgress = (phaseItems) => {
    const completed = phaseItems.filter(item => completedTasks.includes(item.id)).length;
    return Math.round((completed / phaseItems.length) * 100);
  };

  // Total progress
  const allTasks = Object.values(phases).flatMap(phase => phase.items);
  const totalProgress = Math.round((completedTasks.length / allTasks.length) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <Zap className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sprint 17 Validation</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Checklist completo para desbloquear publicação nas stores</p>
            </div>
          </div>

          {/* Overall Progress */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Progresso Total</span>
                  <Badge className="bg-blue-600">{totalProgress}%</Badge>
                </div>
                <Progress value={totalProgress} className="h-3" />
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {completedTasks.length} de {allTasks.length} tarefas concluídas
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs de Fases */}
        <Tabs defaultValue="phase1" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="phase1" className="text-xs">Fase 1</TabsTrigger>
            <TabsTrigger value="phase2" className="text-xs">Fase 2</TabsTrigger>
            <TabsTrigger value="phase3" className="text-xs">Fase 3</TabsTrigger>
            <TabsTrigger value="phase4" className="text-xs">Fase 4</TabsTrigger>
            <TabsTrigger value="phase5" className="text-xs">Fase 5</TabsTrigger>
          </TabsList>

          {/* Fase 1 */}
          <TabsContent value="phase1" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  {phases.phase1.name}
                </CardTitle>
                <CardDescription>{phases.phase1.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <Badge>{calculateProgress(phases.phase1.items)}%</Badge>
                  </div>
                  <Progress value={calculateProgress(phases.phase1.items)} />
                </div>

                {/* Checklist */}
                <div className="space-y-2">
                  {phases.phase1.items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800">
                      <Checkbox
                        checked={completedTasks.includes(item.id)}
                        onCheckedChange={() => toggleTask(item.id)}
                      />
                      <span className={completedTasks.includes(item.id) ? 'line-through text-gray-400' : ''}>
                        {item.label}
                      </span>
                      {item.required && <Badge variant="outline" className="ml-auto text-xs">Requerido</Badge>}
                    </div>
                  ))}
                </div>

                {/* Quick checks */}
                <div className="pt-4 border-t space-y-3">
                  <h4 className="font-semibold text-sm">Validações Rápidas</h4>
                  <Button onClick={checkManifest} disabled={isChecking} variant="outline" size="sm" className="w-full">
                    {isChecking ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Download className="w-4 h-4 mr-2" />}
                    Verificar manifest.json
                  </Button>
                  {manifestStatus && (
                    <Alert className={manifestStatus.found ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                      {manifestStatus.found ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <AlertDescription className="text-green-800">
                            ✅ Manifest encontrado: {manifestStatus.name} ({manifestStatus.icons} icons)
                          </AlertDescription>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          <AlertDescription className="text-red-800">
                            ❌ Manifest não encontrado: {manifestStatus.error}
                          </AlertDescription>
                        </>
                      )}
                    </Alert>
                  )}

                  <Button onClick={checkOfflineFile} disabled={isChecking} variant="outline" size="sm" className="w-full">
                    {isChecking ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Wifi className="w-4 h-4 mr-2" />}
                    Verificar offline.html
                  </Button>
                  {offlineStatus && (
                    <Alert className={offlineStatus.found ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                      {offlineStatus.found ? (
                        <>
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                          <AlertDescription className="text-green-800">
                            ✅ offline.html encontrado e acessível
                          </AlertDescription>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-4 h-4 text-red-600" />
                          <AlertDescription className="text-red-800">
                            ❌ offline.html não encontrado
                          </AlertDescription>
                        </>
                      )}
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fase 2 */}
          <TabsContent value="phase2" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  {phases.phase2.name}
                </CardTitle>
                <CardDescription>{phases.phase2.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <Badge>{calculateProgress(phases.phase2.items)}%</Badge>
                  </div>
                  <Progress value={calculateProgress(phases.phase2.items)} />
                </div>

                <div className="space-y-2">
                  {phases.phase2.items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800">
                      <Checkbox
                        checked={completedTasks.includes(item.id)}
                        onCheckedChange={() => toggleTask(item.id)}
                      />
                      <span className={completedTasks.includes(item.id) ? 'line-through text-gray-400' : ''}>
                        {item.label}
                      </span>
                      {item.required && <Badge variant="outline" className="ml-auto text-xs">Requerido</Badge>}
                    </div>
                  ))}
                </div>

                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>
                    Use Chrome DevTools: <strong>Lighthouse tab</strong> → Run audit → Salve report
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fase 3 */}
          <TabsContent value="phase3" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wifi className="w-5 h-5" />
                  {phases.phase3.name}
                </CardTitle>
                <CardDescription>{phases.phase3.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <Badge>{calculateProgress(phases.phase3.items)}%</Badge>
                  </div>
                  <Progress value={calculateProgress(phases.phase3.items)} />
                </div>

                <div className="space-y-2">
                  {phases.phase3.items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800">
                      <Checkbox
                        checked={completedTasks.includes(item.id)}
                        onCheckedChange={() => toggleTask(item.id)}
                      />
                      <span className={completedTasks.includes(item.id) ? 'line-through text-gray-400' : ''}>
                        {item.label}
                      </span>
                      {item.required && <Badge variant="outline" className="ml-auto text-xs">Requerido</Badge>}
                    </div>
                  ))}
                </div>

                <Button onClick={checkServiceWorker} disabled={isChecking} variant="outline" className="w-full">
                  {isChecking ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Wifi className="w-4 h-4 mr-2" />}
                  Verificar Service Worker
                </Button>
                {swStatus && (
                  <Alert className={swStatus.error || !swStatus.registered ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
                    {swStatus.error ? (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                          ❌ Erro: {swStatus.error}
                        </AlertDescription>
                      </>
                    ) : swStatus.registered ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          ✅ Service Worker {swStatus.active} ({swStatus.scope})
                        </AlertDescription>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-red-600" />
                        <AlertDescription className="text-red-800">
                          ❌ Service Worker não registrado
                        </AlertDescription>
                      </>
                    )}
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fase 4 */}
          <TabsContent value="phase4" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {phases.phase4.name}
                </CardTitle>
                <CardDescription>{phases.phase4.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <Badge>{calculateProgress(phases.phase4.items)}%</Badge>
                  </div>
                  <Progress value={calculateProgress(phases.phase4.items)} />
                </div>

                <div className="space-y-2">
                  {phases.phase4.items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800">
                      <Checkbox
                        checked={completedTasks.includes(item.id)}
                        onCheckedChange={() => toggleTask(item.id)}
                      />
                      <span className={completedTasks.includes(item.id) ? 'line-through text-gray-400' : ''}>
                        {item.label}
                      </span>
                      {item.required && <Badge variant="outline" className="ml-auto text-xs">Requerido</Badge>}
                    </div>
                  ))}
                </div>

                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
                  <AlertCircle className="w-4 h-4" />
                  <AlertDescription>
                    Use a página <strong>APITesting</strong> para validar cada endpoint um a um
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fase 5 */}
          <TabsContent value="phase5" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  {phases.phase5.name}
                </CardTitle>
                <CardDescription>{phases.phase5.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progresso</span>
                    <Badge>{calculateProgress(phases.phase5.items)}%</Badge>
                  </div>
                  <Progress value={calculateProgress(phases.phase5.items)} />
                </div>

                <div className="space-y-2">
                  {phases.phase5.items.map(item => (
                    <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800">
                      <Checkbox
                        checked={completedTasks.includes(item.id)}
                        onCheckedChange={() => toggleTask(item.id)}
                      />
                      <span className={completedTasks.includes(item.id) ? 'line-through text-gray-400' : ''}>
                        {item.label}
                      </span>
                      {item.required && <Badge variant="outline" className="ml-auto text-xs">Requerido</Badge>}
                    </div>
                  ))}
                </div>

                {totalProgress === 100 && (
                  <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <AlertDescription className="text-green-800 font-semibold">
                      ✅ Sprint 17 COMPLETO! Pronto para publicação nas stores
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Summary Card */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Resumo do Sprint 17
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{completedTasks.length}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Concluídas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-400">{allTasks.length - completedTasks.length}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Pendentes</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{totalProgress}%</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Progresso</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{Math.ceil((allTasks.length - completedTasks.length) / 5)}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Dias restantes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}