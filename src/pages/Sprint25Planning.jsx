import React from 'react';
import { Rocket, Mail, MessageSquare, Users, Zap, BarChart3, Shield } from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function Sprint25Planning() {
  const fases = [
    {
      numero: 1,
      nome: 'Notificações Avançado - Email',
      descricao: 'Sistema de templates e envios de email',
      tarefas: [
        'Email templates customizáveis',
        'Sistema de filas de envio',
        'Rastreamento de leitura',
        'A/B testing de templates'
      ],
      duracao: '3 dias',
      prioridade: 'alta',
      estimado: 25
    },
    {
      numero: 2,
      nome: 'Notificações Avançado - SMS & Push',
      descricao: 'SMS via Twilio e Push notifications refinadas',
      tarefas: [
        'Integração Twilio SMS',
        'SMS templates',
        'FCM push notifications aprimorado',
        'Delivery tracking'
      ],
      duracao: '3 dias',
      prioridade: 'alta',
      estimado: 25
    },
    {
      numero: 3,
      nome: 'Portal de Colaboração - Core',
      descricao: 'Sistema de comentários e compartilhamento',
      tarefas: [
        'Sistema de comentários',
        'Compartilhamento de documentos',
        'Permissões granulares',
        'Histórico de colaboração'
      ],
      duracao: '4 dias',
      prioridade: 'média',
      estimado: 35
    },
    {
      numero: 4,
      nome: 'Mobile & Otimizações',
      descricao: 'Preparação para mobile e performance',
      tarefas: [
        'API mobile-optimized',
        'Offline-first sync',
        'PWA aprimorado',
        'Performance testing'
      ],
      duracao: '3 dias',
      prioridade: 'média',
      estimado: 30
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <Rocket className="w-10 h-10 text-violet-600" />
            Sprint 25 - Notificações & Colaboração
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">Próxima fase: Finalizar Sprint 23 + Executar Sprint 25</p>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-600" />
              <span className="text-green-600 font-semibold">Sprint 22: ✅ 100%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-orange-600" />
              <span className="text-orange-600 font-semibold">Sprint 23: ⏳ 31% (FASE 1 CONCLUÍDA)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-blue-600" />
              <span className="text-blue-600 font-semibold">Sprint 24: ✅ 100%</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-violet-600" />
              <span className="text-violet-600 font-semibold">Sprint 25: 🔜 PLANEJADO</span>
            </div>
          </div>
        </div>

        {/* Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Fases</p>
            <p className="text-3xl font-bold text-violet-600">4</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Tarefas</p>
            <p className="text-3xl font-bold text-violet-600">16</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Horas Estimadas</p>
            <p className="text-3xl font-bold text-orange-600">115h</p>
          </Card>
          <Card className="p-4">
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Duração</p>
            <p className="text-3xl font-bold text-green-600">~4 sem</p>
          </Card>
        </div>

        {/* Fases */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">📋 4 Fases - Notificações & Colaboração</h2>
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
                      <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                      <span className="text-gray-700 dark:text-gray-300">{tarefa}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 font-semibold pt-3 border-t">
                  <span>⏱️ {fase.duracao}</span>
                  <span>📊 ~{fase.estimado}h</span>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Technical Stack */}
        <Card className="p-6 bg-gradient-to-r from-violet-50 to-purple-50 dark:from-violet-950 dark:to-purple-950">
          <h2 className="text-2xl font-bold mb-6">🛠️ Stack Técnico Sprint 25</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Mail className="w-5 h-5" /> Email & Notificações
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• Resend Email API</li>
                <li>• Email templates JSX</li>
                <li>• Twilio SMS integration</li>
                <li>• Firebase Cloud Messaging</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Users className="w-5 h-5" /> Colaboração
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• Sistema de comentários</li>
                <li>• Mention system (@user)</li>
                <li>• Permissões granulares</li>
                <li>• Real-time sync</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5" /> Performance
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• Offline-first architecture</li>
                <li>• Service worker aprimorado</li>
                <li>• Response streaming</li>
                <li>• Image optimization</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5" /> Segurança
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• Rate limiting</li>
                <li>• Permissões RBAC</li>
                <li>• Audit logging</li>
                <li>• Encryption</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Timeline */}
        <Card className="p-6 border-t-4 border-violet-500">
          <h2 className="text-2xl font-bold mb-4">📅 Timeline Sprint 25</h2>
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

        {/* Dependências */}
        <Card className="p-6 bg-amber-50 dark:bg-amber-950 border-amber-300">
          <h2 className="text-2xl font-bold mb-4">⚠️ Dependências Sprint 25</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-lg">✅</span>
              <div>
                <p className="font-semibold">Sprint 24 (API Advise)</p>
                <p className="text-gray-600 dark:text-gray-400">COMPLETO - Nenhuma dependência bloqueante</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">⏳</span>
              <div>
                <p className="font-semibold">Sprint 23 Fase 2+ (Notificações)</p>
                <p className="text-gray-600 dark:text-gray-400">Fase 1 completada, iniciar Fase 2 desta semana</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-lg">🔑</span>
              <div>
                <p className="font-semibold">Secrets necessários</p>
                <p className="text-gray-600 dark:text-gray-400">TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, RESEND_API_KEY (já configured)</p>
              </div>
            </div>
          </div>
        </Card>

        {/* Success Criteria */}
        <Card className="p-6 bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
          <h2 className="text-2xl font-bold mb-4">✅ Critérios de Sucesso Sprint 25</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex gap-3">
              <span className="text-2xl">📧</span>
              <div>
                <p className="font-semibold">Email System</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Templates + Tracking 100% funcional</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">💬</span>
              <div>
                <p className="font-semibold">SMS & Push</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Twilio + FCM integrados</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">👥</span>
              <div>
                <p className="font-semibold">Colaboração</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Comentários + Mentions funcionais</p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="text-2xl">📱</span>
              <div>
                <p className="font-semibold">Mobile Ready</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">PWA otimizado + Offline</p>
              </div>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <Card className="p-6 bg-gradient-to-r from-violet-600 to-purple-600 text-white border-0">
          <h2 className="text-2xl font-bold mb-2">🚀 Próximas Etapas</h2>
          <p className="text-violet-100 mb-4">Sprint 25 iniciará após Sprint 23 ser completado (~2 semanas). Estimativa total: 4 semanas com padrão de alta qualidade</p>
          <div className="flex gap-3">
            <button className="px-6 py-2 bg-white text-violet-600 rounded-lg hover:bg-violet-50 font-semibold transition-all">
              Ver Roadmap Completo
            </button>
            <button className="px-6 py-2 bg-violet-700 text-white rounded-lg hover:bg-violet-800 font-semibold transition-all border border-white border-opacity-30">
              Detalhes Fase 1
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}