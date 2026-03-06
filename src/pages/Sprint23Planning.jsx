import React from 'react';
import { Rocket, Users, BarChart3, Zap, Globe, Lock, Settings } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function Sprint23Planning() {
  const fases = [
    {
      numero: 1,
      nome: 'Integração com Escavador',
      descricao: 'API de buscas jurídicas externas',
      tarefas: [
        'Setup Escavador API credentials',
        'Endpoint de busca de jurisprudência',
        'Cache de resultados de jurisprudência',
        'Dashboard de pesquisas históricas'
      ],
      duracao: '40h',
      prioridade: 'alta'
    },
    {
      numero: 2,
      nome: 'Sistema de Notificações Avançado',
      descricao: 'Multi-channel notifications com templates',
      tarefas: [
        'Email templates customizáveis',
        'SMS gateway integration',
        'Push notifications refinado',
        'Webhook callbacks para eventos'
      ],
      duracao: '35h',
      prioridade: 'alta'
    },
    {
      numero: 3,
      nome: 'Portal de Colaboração',
      descricao: 'Ferramenta para trabalho em equipe',
      tarefas: [
        'Sistema de comentários em processos',
        'Compartilhamento de documentos',
        'Menções e atribuições de tarefas',
        'Histórico de colaboração'
      ],
      duracao: '45h',
      prioridade: 'média'
    },
    {
      numero: 4,
      nome: 'Mobile App Preview',
      descricao: 'Preparação para aplicativo mobile',
      tarefas: [
        'API mobile-optimized',
        'Offline-first architecture',
        'PWA melhorado com service worker',
        'Testes de performance mobile'
      ],
      duracao: '50h',
      prioridade: 'média'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Rocket className="w-10 h-10 text-purple-600" />
            Sprint 23 - Roadmap Estratégico
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">Integrações Avançadas & Colaboração</p>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-600" />
              <span className="text-green-600 font-semibold">Sprint 22: 100% Completo</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-purple-600" />
              <span className="text-purple-600 font-semibold">Sprint 23: Planejado</span>
            </div>
          </div>
        </div>

        {/* Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Fases</p>
            <p className="text-3xl font-bold text-blue-600">4</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Tarefas</p>
            <p className="text-3xl font-bold text-purple-600">16</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Duração</p>
            <p className="text-3xl font-bold text-orange-600">~170h</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Timeline</p>
            <p className="text-3xl font-bold text-green-600">4 sem</p>
          </Card>
        </div>

        {/* Fases */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">📋 4 Fases Planejadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fases.map((fase) => (
              <Card key={fase.numero} className={`p-6 border-l-4 ${
                fase.prioridade === 'alta' ? 'border-red-500' : 'border-yellow-500'
              }`}>
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-bold">Fase {fase.numero}: {fase.nome}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    fase.prioridade === 'alta' 
                      ? 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                      : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
                  }`}>
                    {fase.prioridade.toUpperCase()}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{fase.descricao}</p>
                <div className="space-y-2 mb-4">
                  {fase.tarefas.map((tarefa, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                      <span className="text-gray-700 dark:text-gray-300">{tarefa}</span>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400 font-semibold">
                  ⏱️ {fase.duracao}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Stack Técnico */}
        <Card className="p-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
          <h2 className="text-2xl font-bold mb-6">🛠️ Stack Técnico Sprint 23</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5" /> Integrações Externas
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• Escavador API (jurisprudência)</li>
                <li>• Twilio SMS Gateway</li>
                <li>• Firebase Cloud Messaging</li>
                <li>• SendGrid Email Templates</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="w-5 h-5" /> Colaboração
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• WebSocket real-time updates</li>
                <li>• Comment threading</li>
                <li>• User mentions & notifications</li>
                <li>• Activity timeline</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Settings className="w-5 h-5" /> Mobile
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• React Native base setup</li>
                <li>• Offline data sync</li>
                <li>• Push notification handling</li>
                <li>• Mobile-first API</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5" /> Segurança Mobile
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• Biometric authentication</li>
                <li>• Secure storage (Keychain)</li>
                <li>• SSL pinning</li>
                <li>• App integrity verification</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Timeline */}
        <Card className="p-6 border-t-4 border-purple-500">
          <h2 className="text-2xl font-bold mb-4">📅 Timeline Sprint 23</h2>
          <div className="space-y-4">
            {fases.map((fase) => (
              <div key={fase.numero} className="flex gap-4">
                <div className="w-32 font-semibold text-sm flex-shrink-0">Semana {fase.numero}</div>
                <div className="flex-1">
                  <div className={`px-4 py-3 rounded-lg font-semibold ${
                    fase.prioridade === 'alta'
                      ? 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200'
                      : 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200'
                  }`}>
                    {fase.nome} ({fase.duracao})
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Success Criteria */}
        <Card className="p-6 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
          <h2 className="text-2xl font-bold mb-4">✅ Critérios de Sucesso</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <span className="text-2xl">🔍</span>
              <div>
                <p className="font-semibold">Integração Escavador</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">50+ buscas/dia, &lt;98% uptime</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">📬</span>
              <div>
                <p className="font-semibold">Notificações</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">4 channels ativos, 99% delivery</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">👥</span>
              <div>
                <p className="font-semibold">Colaboração</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Real-time sync, &lt;100ms latency</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">📱</span>
              <div>
                <p className="font-semibold">Mobile</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">PWA estável, 95%+ performance</p>
              </div>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <Card className="p-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
          <h2 className="text-2xl font-bold mb-2">🚀 Próximo Ciclo</h2>
          <p className="text-purple-100 mb-4">Sprint 23 iniciará com foco em integrações estratégicas e preparação para mobile</p>
          <div className="flex gap-3">
            <button className="px-6 py-2 bg-white text-purple-600 rounded-lg hover:bg-purple-50 font-semibold transition-all">
              Ver Detalhes
            </button>
            <button className="px-6 py-2 bg-purple-700 text-white rounded-lg hover:bg-purple-800 font-semibold transition-all border border-white border-opacity-30">
              Iniciar Sprint 23
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}