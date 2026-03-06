import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, Clock, AlertCircle, TrendingUp } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function ForenseComplianceRoadmap() {
  const [phases] = useState([
    {
      name: 'SPRINT S (Mar 5-22)',
      phase: '⚡ Autentique Integration',
      completion: 60,
      status: 'ACTIVE',
      tasks: [
        { id: 'AUTH-1', name: 'Integração API Autentique', progress: 30, owner: 'Backend', deadline: 'Mar 10' },
        { id: 'AUTH-2', name: 'Hash SHA512 + SHA3-512', progress: 30, owner: 'Backend', deadline: 'Mar 15' },
        { id: 'AUTH-3', name: 'Privacy Policy LGPD', progress: 40, owner: 'Legal', deadline: 'Mar 18' },
        { id: 'AUTH-4', name: 'Termos de Uso', progress: 30, owner: 'Legal', deadline: 'Mar 20' },
        { id: 'AUTH-5', name: '2FA + TLS 1.3', progress: 50, owner: 'Segurança', deadline: 'Mar 22' },
        { id: 'AUTH-6', name: 'PDF/A Generator', progress: 20, owner: 'Backend', deadline: 'Mar 22' }
      ]
    },
    {
      name: 'SPRINT T (Mar 24-Apr 6)',
      phase: '🔐 Assinatura Digital + Metadados',
      completion: 0,
      status: 'QUEUED',
      tasks: [
        { id: 'AUTH-7', name: 'Assinatura Autentique (SDK)', progress: 0, owner: 'Backend', deadline: 'Mar 28' },
        { id: 'AUTH-8', name: 'Captura Metadados Forenses', progress: 0, owner: 'Backend', deadline: 'Apr 1' },
        { id: 'AUTH-9', name: 'Validador Online (UI)', progress: 0, owner: 'Frontend', deadline: 'Apr 6' }
      ]
    },
    {
      name: 'SPRINT U (Apr 8-May 5)',
      phase: '⚖️ Cadeia de Custódia (CPP 158-A)',
      completion: 0,
      status: 'QUEUED',
      tasks: [
        { id: 'AUTH-10', name: 'Doc 5 Etapas (Coleta→Apresentação)', progress: 0, owner: 'Legal + Backend', deadline: 'Apr 25' },
        { id: 'AUTH-11', name: 'Relatório Técnico Completo', progress: 0, owner: 'Technical Writing', deadline: 'May 2' },
        { id: 'AUTH-12', name: 'Parecer Jurídico (Contrato)', progress: 0, owner: 'Legal', deadline: 'May 5' }
      ]
    },
    {
      name: 'SPRINT V (May 7-26)',
      phase: '✅ Testes + Compliance Final',
      completion: 0,
      status: 'QUEUED',
      tasks: [
        { id: 'AUTH-13', name: 'Teste Admissibilidade Jurídica', progress: 0, owner: 'Legal', deadline: 'May 20' },
        { id: 'AUTH-14', name: 'Auditoria Segurança (3º)', progress: 0, owner: 'Segurança', deadline: 'May 23' },
        { id: 'AUTH-15', name: 'Parecer Final + Go-Live', progress: 0, owner: 'Legal + Exec', deadline: 'May 26' }
      ]
    }
  ]);

  const [timeline] = useState([
    { sprint: 'S', date: 'Mar 5-22', auth: 60, cadeia: 0, testes: 0, total: 15 },
    { sprint: 'T', date: 'Mar 24-Apr 6', auth: 90, cadeia: 30, testes: 0, total: 40 },
    { sprint: 'U', date: 'Apr 8-May 5', auth: 100, cadeia: 80, testes: 20, total: 70 },
    { sprint: 'V', date: 'May 7-26', auth: 100, cadeia: 100, testes: 100, total: 100 }
  ]);

  const [costs] = useState([
    { item: 'Autentique (assinaturas)', cost: '~R$2-5/doc', timing: 'Mar-May (variável)', owner: 'Pay-per-use' },
    { item: 'Parecer Jurídico', cost: 7500, timing: 'Apr 8-May 5', owner: 'Legal Externo' },
    { item: 'Auditoria Segurança', cost: 10000, timing: 'May 7-23', owner: 'Segurança' },
    { item: 'ISO 27001 (pós-launch)', cost: 25000, timing: 'Jun onwards', owner: 'Compliance' }
  ]);

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 min-h-screen">
      <h1 className="text-4xl font-bold">🔐 Roadmap: Conformidade Forense (12 meses)</h1>
      
      {/* Global Progress */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-green-300 bg-green-50 dark:bg-green-950">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-green-600">15%</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Global Progress (Sprint S)</p>
            <Progress value={15} className="mt-2" />
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-blue-600">4</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Sprints (vs 6)</p>
            <p className="text-xs text-green-600 mt-1">⚡ -33% tempo</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-orange-600">R$ 42.5K</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Budget (pay-per-use)</p>
            <p className="text-xs text-green-600 mt-1">✅ -1K vs in-house</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-purple-600">9 semanas</div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Timeline Total</p>
            <p className="text-xs text-green-600 mt-1">✅ De 12 meses</p>
          </CardContent>
        </Card>
      </div>

      {/* Timeline Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Progresso por Sprint (% Completude)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeline}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="sprint" />
            <YAxis label={{ value: 'Completion %', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#8b5cf6" strokeWidth={3} name="Total Completude" />
            <Line type="monotone" dataKey="auth" stroke="#0ea5e9" strokeWidth={2} name="Autentique + Hashing" />
            <Line type="monotone" dataKey="cadeia" stroke="#f59e0b" strokeWidth={2} name="Cadeia de Custódia" />
            <Line type="monotone" dataKey="testes" stroke="#10b981" strokeWidth={2} name="Testes + Compliance" />
          </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Sprint Phases */}
      <div className="space-y-4">
        {phases.map((phase, idx) => (
          <Card key={idx} className="border-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-xl">{phase.name}</CardTitle>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{phase.phase}</p>
                </div>
                <Badge variant={phase.status === 'ACTIVE' ? 'default' : 'secondary'}>
                  {phase.status}
                </Badge>
              </div>
              <Progress value={phase.completion} className="mt-2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {phase.tasks.map((task) => (
                  <div key={task.id} className="flex items-center gap-3 p-2 rounded bg-gray-50 dark:bg-gray-800">
                    <CheckCircle2 className="w-4 h-4 text-gray-400" />
                    <div className="flex-1">
                      <p className="font-sm">{task.id}: {task.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">{task.owner}</p>
                    </div>
                    <Badge variant="outline">{task.deadline}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Budget */}
      <Card>
        <CardHeader>
          <CardTitle>💰 Investimentos Externos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {costs.map((c, idx) => (
              <div key={idx} className="flex justify-between p-2 rounded bg-gray-50 dark:bg-gray-800">
                <div>
                  <p className="font-sm">{c.item}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{c.timing}</p>
                </div>
                <Badge className="bg-green-100 text-green-800">R$ {c.cost.toLocaleString('pt-BR')}</Badge>
              </div>
            ))}
          </div>
          <div className="mt-4 pt-4 border-t font-bold text-lg">Total: R$ {costs.reduce((a, b) => a + b.cost, 0).toLocaleString('pt-BR')}</div>
        </CardContent>
      </Card>

      {/* Next Actions */}
      <Card className="border-green-300 bg-green-50 dark:bg-green-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-green-600" />
            ⚡ Ações Imediatas com Autentique (MAR 5)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="border-l-4 border-green-600 pl-4">
            <p className="font-bold">1. Backend: Integração Autentique</p>
            <p className="text-sm text-gray-600">Docs: https://www.autentique.com.br/api/docs</p>
            <p className="text-sm">- Cadastro API + tokens</p>
            <p className="text-sm">- SDK node/npm (@autentique/sdk)</p>
            <p className="text-sm">- Assinatura digital (PJ já integrado)</p>
          </div>
          <div className="border-l-4 border-blue-600 pl-4">
            <p className="font-bold">2. Backend: Hash SHA512/SHA3-512</p>
            <p className="text-sm">- Antes de enviar para Autentique</p>
            <p className="text-sm">- Armazenar em BD (audit log)</p>
          </div>
          <div className="border-l-4 border-orange-600 pl-4">
            <p className="font-bold">3. Legal: Privacy Policy + Termos</p>
            <p className="text-sm">- LGPD: Consentimento para coleta</p>
            <p className="text-sm">- Menção: "Assinado via Autentique (ICP-Brasil)"</p>
          </div>
          <div className="border-l-4 border-purple-600 pl-4">
            <p className="font-bold">4. Segurança: TLS 1.3 + 2FA TOTP</p>
            <p className="text-sm">- Certificado SSL atual: verificar versão</p>
            <p className="text-sm">- 2FA TOTP: implementar antes de Sprint T</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}