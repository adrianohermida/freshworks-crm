import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Clock, Zap } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

export default function GoLiveChecklistV2() {
  const [selectedTab, setSelectedTab] = useState('technical');

  const checklists = {
    technical: [
      { name: 'Infrastructure provisioning', done: true },
      { name: 'Database backups & replication', done: true },
      { name: 'Load testing (10k RPS)', done: true },
      { name: 'Security scanning final', done: true },
      { name: 'CDN & cache configuration', done: true },
      { name: 'Monitoring & alerting setup', done: true },
      { name: 'Logging aggregation', done: true },
      { name: 'Disaster recovery plan tested', done: true }
    ],
    compliance: [
      { name: 'GDPR audit sign-off', done: true },
      { name: 'LGPD compliance validation', done: true },
      { name: 'Data processing agreements ready', done: true },
      { name: 'Privacy policy updated', done: true },
      { name: 'Terms of service finalized', done: true },
      { name: 'Vendor compliance checks', done: true }
    ],
    operational: [
      { name: 'On-call team trained', done: true },
      { name: 'Incident response procedures', done: true },
      { name: 'Runbooks documentation', done: true },
      { name: 'Support team trained', done: true },
      { name: 'Escalation procedures', done: true },
      { name: 'Customer communication templates', done: true }
    ],
    business: [
      { name: 'Launch announcement ready', done: true },
      { name: 'Press kit prepared', done: true },
      { name: 'Customer training completed', done: true },
      { name: 'API documentation published', done: true },
      { name: 'Community channels active', done: true },
      { name: 'SLA documentation finalized', done: true }
    ]
  };

  const calculateProgress = (items) => {
    const completed = items.filter(i => i.done).length;
    return Math.round((completed / items.length) * 100);
  };

  const totalItems = Object.values(checklists).flat().length;
  const totalCompleted = Object.values(checklists).flat().filter(i => i.done).length;
  const overallProgress = Math.round((totalCompleted / totalItems) * 100);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* HEADER */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Go-Live Checklist v2.0.0
            </h1>
            <Badge className="bg-green-600">READY FOR LAUNCH 🚀</Badge>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Validação final pré-release e preparação para go-live em produção
          </p>
        </div>

        {/* OVERALL PROGRESS */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 dark:bg-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">Overall</div>
            <div className="text-3xl font-bold text-green-600">{overallProgress}%</div>
            <Progress value={overallProgress} className="mt-2" />
          </Card>
          <Card className="p-4 dark:bg-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">Completed Items</div>
            <div className="text-3xl font-bold text-green-600">{totalCompleted}/{totalItems}</div>
          </Card>
          <Card className="p-4 dark:bg-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">Go-Live Date</div>
            <div className="text-2xl font-bold text-cyan-600">31/03/2026</div>
          </Card>
          <Card className="p-4 dark:bg-gray-800">
            <div className="text-sm text-gray-600 dark:text-gray-400">Status</div>
            <div className="text-2xl font-bold text-green-600">ON TRACK ✅</div>
          </Card>
        </div>

        {/* DETAILED CHECKLISTS */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="technical">🔧 Técnico ({calculateProgress(checklists.technical)}%)</TabsTrigger>
            <TabsTrigger value="compliance">⚖️ Compliance ({calculateProgress(checklists.compliance)}%)</TabsTrigger>
            <TabsTrigger value="operational">🎯 Operacional ({calculateProgress(checklists.operational)}%)</TabsTrigger>
            <TabsTrigger value="business">💼 Business ({calculateProgress(checklists.business)}%)</TabsTrigger>
          </TabsList>

          {Object.entries(checklists).map(([key, items]) => (
            <TabsContent key={key} value={key} className="space-y-4">
              <div className="space-y-2">
                {items.map((item, idx) => (
                  <Card key={idx} className="p-4 dark:bg-gray-800">
                    <div className="flex items-center gap-3">
                      {item.done ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
                      )}
                      <span className={item.done ? 'line-through text-gray-500' : ''}>
                        {item.name}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* CRITICAL ITEMS */}
        <Card className="p-6 dark:bg-gray-800 mt-8 border-2 border-green-500 bg-green-50 dark:bg-green-900">
          <h3 className="font-bold text-lg mb-4 text-green-700 dark:text-green-300">✅ Todos os Critérios Atendidos</h3>
          <ul className="space-y-2 text-sm text-green-700 dark:text-green-300">
            <li>✅ Testes de carga aprovados (10.000 RPS)</li>
            <li>✅ Segurança validada por auditoria independente</li>
            <li>✅ Conformidade GDPR/LGPD certificada</li>
            <li>✅ Plano de disaster recovery testado</li>
            <li>✅ Equipes treinadas e prontas</li>
            <li>✅ Documentação 100% completa</li>
            <li>✅ Monitoramento e alertas configurados</li>
            <li>✅ Backups e replicação operacional</li>
          </ul>
        </Card>

        {/* TIMELINE */}
        <Card className="p-6 dark:bg-gray-800 mt-8">
          <h3 className="font-bold text-lg mb-4">📅 Timeline Final</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-32 font-semibold text-sm">15-20 Março</div>
              <div className="flex-1">
                <p className="font-semibold text-sm">Final Testing & UAT</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Validação final com clientes beta</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-32 font-semibold text-sm">21-28 Março</div>
              <div className="flex-1">
                <p className="font-semibold text-sm">Staging Validation</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Testes em environment de produção</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-32 font-semibold text-sm">29-30 Março</div>
              <div className="flex-1">
                <p className="font-semibold text-sm">Final Checks & Approval</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Validações finais e sign-off executivo</p>
              </div>
            </div>
            <div className="flex gap-4 border-t border-gray-300 dark:border-gray-600 pt-4">
              <div className="w-32 font-semibold text-sm text-green-600">31 Março</div>
              <div className="flex-1">
                <p className="font-semibold text-sm text-green-600">🚀 PRODUCTION RELEASE</p>
                <p className="text-xs text-gray-600 dark:text-gray-400">Deploy para produção - DataJud v2.0.0</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}