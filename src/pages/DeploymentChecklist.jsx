import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckCircle2, AlertCircle, FileText } from 'lucide-react';

export default function DeploymentChecklist() {
  const [checklist, setChecklist] = useState([
    {
      phase: 'Pre-Deployment',
      items: [
        { id: 1, name: 'Executar suite completa de testes QA', checked: false, critical: true },
        { id: 2, name: 'Validar conformidade de schemas TPU', checked: false, critical: true },
        { id: 3, name: 'Testar todos os endpoints de tribunais', checked: false, critical: true },
        { id: 4, name: 'Realizar backup do banco de dados', checked: false, critical: true },
        { id: 5, name: 'Revisar logs de erros e warnings', checked: false, critical: false },
        { id: 6, name: 'Aprovar com stakeholders', checked: false, critical: true }
      ]
    },
    {
      phase: 'Deployment',
      items: [
        { id: 7, name: 'Deploy da versão em staging', checked: false, critical: true },
        { id: 8, name: 'Executar testes de smoke em staging', checked: false, critical: true },
        { id: 9, name: 'Deploy em produção (fora de pico)', checked: false, critical: true },
        { id: 10, name: 'Verificar health checks pós-deploy', checked: false, critical: true },
        { id: 11, name: 'Monitorar performance metrics', checked: false, critical: false }
      ]
    },
    {
      phase: 'Post-Deployment',
      items: [
        { id: 12, name: 'Monitorar por 24h sem incidentes', checked: false, critical: true },
        { id: 13, name: 'Coletar feedback dos usuários', checked: false, critical: false },
        { id: 14, name: 'Documentar lições aprendidas', checked: false, critical: false },
        { id: 15, name: 'Preparar plano de rollback', checked: false, critical: true }
      ]
    }
  ]);

  const toggleItem = (phaseIdx, itemIdx) => {
    const newChecklist = [...checklist];
    newChecklist[phaseIdx].items[itemIdx].checked = !newChecklist[phaseIdx].items[itemIdx].checked;
    setChecklist(newChecklist);
  };

  const getCompletionPercentage = () => {
    const total = checklist.reduce((sum, phase) => sum + phase.items.length, 0);
    const checked = checklist.reduce((sum, phase) => sum + phase.items.filter(i => i.checked).length, 0);
    return total > 0 ? Math.round((checked / total) * 100) : 0;
  };

  const allCriticalComplete = checklist.every(phase =>
    phase.items.filter(i => i.critical).every(i => i.checked)
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* HEADER */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              ✅ Checklist de Deployment
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Plano de rollout e monitoramento pós-deploy
            </p>
          </div>
          <Badge className="bg-cyan-600 text-lg px-4 py-2">Fase 6</Badge>
        </div>

        {/* PROGRESS */}
        <Card className={`border-l-4 ${
          allCriticalComplete ? 'border-l-green-500' : 'border-l-yellow-500'
        }`}>
          <CardContent className="pt-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Progresso Geral</span>
                <span className="text-2xl font-bold">{getCompletionPercentage()}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${
                    allCriticalComplete ? 'bg-green-600' : 'bg-yellow-600'
                  }`}
                  style={{ width: `${getCompletionPercentage()}%` }}
                />
              </div>
              {allCriticalComplete ? (
                <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  Todos os itens críticos foram completados!
                </p>
              ) : (
                <p className="text-sm text-yellow-700 dark:text-yellow-300 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  Existem itens críticos pendentes
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* CHECKLISTS */}
        <div className="space-y-4">
          {checklist.map((phase, phaseIdx) => (
            <Card key={phaseIdx}>
              <CardHeader>
                <CardTitle className="text-base">{phase.phase}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {phase.items.map((item, itemIdx) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-3 rounded hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <Checkbox
                        checked={item.checked}
                        onCheckedChange={() => toggleItem(phaseIdx, itemIdx)}
                        className="w-5 h-5"
                      />
                      <div className="flex-1">
                        <p className={`text-sm ${item.checked ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                          {item.name}
                        </p>
                      </div>
                      {item.critical && (
                        <Badge className="bg-red-600 text-xs">Crítico</Badge>
                      )}
                      {item.checked && (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* ROLLOUT PLAN */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Plano de Rollout
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded border border-blue-200 dark:border-blue-700">
              <p className="font-semibold text-blue-900 dark:text-blue-100 mb-2">1. Staging (4h)</p>
              <ul className="text-sm text-blue-900 dark:text-blue-100 space-y-1 ml-4">
                <li>• Deploy code em staging</li>
                <li>• Executar testes de smoke completos</li>
                <li>• Validar integrações com APIs externas</li>
                <li>• Realizar testes de carga básicos</li>
              </ul>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-700">
              <p className="font-semibold text-green-900 dark:text-green-100 mb-2">2. Produção (1h window)</p>
              <ul className="text-sm text-green-900 dark:text-green-100 space-y-1 ml-4">
                <li>• Deploy em horário fora de pico (entre 2-4 AM)</li>
                <li>• Monitorar health checks</li>
                <li>• Verificar erro rates em tempo real</li>
                <li>• Preparado para rollback em caso de erro crítico</li>
              </ul>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded border border-purple-200 dark:border-purple-700">
              <p className="font-semibold text-purple-900 dark:text-purple-100 mb-2">3. Monitoramento (24h)</p>
              <ul className="text-sm text-purple-900 dark:text-purple-100 space-y-1 ml-4">
                <li>• On-call team por 24h</li>
                <li>• Monitorar logs de erro e warnings</li>
                <li>• Performance metrics no DataDog</li>
                <li>• Coletar feedback de usuários</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* MONITORING */}
        <Card>
          <CardHeader>
            <CardTitle>📊 Monitoramento Pós-Deploy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="font-semibold mb-1">Error Rate</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Alerta se &gt; 0.5% de erro</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="font-semibold mb-1">Response Time</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Alerta se &gt; 500ms P95</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="font-semibold mb-1">CPU / Memory</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Alerta se &gt; 80% uso</p>
              </div>
              <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
                <p className="font-semibold mb-1">API Endpoints</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Alerta se status &ne; 200</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ACTION */}
        {allCriticalComplete && (
          <Card className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700">
            <CardHeader>
              <CardTitle className="text-base text-green-900 dark:text-green-100">
                ✅ Pronto para Deploy!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-green-900 dark:text-green-100">
                Todos os itens críticos foram completados. O sistema está pronto para deploy em produção.
              </p>
              <Button className="w-full bg-green-600 hover:bg-green-700">
                ✅ Realizar Deploy em Produção
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}