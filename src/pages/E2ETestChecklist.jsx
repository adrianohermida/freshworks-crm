import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle } from 'lucide-react';

export default function E2ETestChecklist() {
  const [checklist, setChecklist] = useState({
    // Admin Panel
    admin_users: false,
    admin_tenants: false,
    admin_integrations: false,
    admin_monitoring: false,

    // Process Management
    process_sync: false,
    process_detail: false,
    process_parts: false,
    process_movements: false,

    // Deadline Management
    deadline_from_movement: false,
    deadline_from_publication: false,
    deadline_alerts: false,

    // Agenda Integration
    agenda_create: false,
    agenda_deadline_link: false,
    agenda_alert: false,

    // DataJud Integration
    datajud_connect: false,
    datajud_sync: false,
    datajud_retry: false,

    // TPU Integration
    tpu_import: false,
    tpu_deduplicate: false,
    tpu_display: false,

    // Google Sheets
    sheets_export: false,
    sheets_import: false,

    // Notifications
    notifications_email: false,
    notifications_whatsapp: false,
    notifications_real_time: false
  });

  const testCategories = [
    {
      name: 'Admin Panel',
      tests: ['admin_users', 'admin_tenants', 'admin_integrations', 'admin_monitoring']
    },
    {
      name: 'Process Management',
      tests: ['process_sync', 'process_detail', 'process_parts', 'process_movements']
    },
    {
      name: 'Deadline Management',
      tests: ['deadline_from_movement', 'deadline_from_publication', 'deadline_alerts']
    },
    {
      name: 'Agenda Integration',
      tests: ['agenda_create', 'agenda_deadline_link', 'agenda_alert']
    },
    {
      name: 'DataJud Sync',
      tests: ['datajud_connect', 'datajud_sync', 'datajud_retry']
    },
    {
      name: 'TPU Sync',
      tests: ['tpu_import', 'tpu_deduplicate', 'tpu_display']
    },
    {
      name: 'Google Sheets',
      tests: ['sheets_export', 'sheets_import']
    },
    {
      name: 'Notifications',
      tests: ['notifications_email', 'notifications_whatsapp', 'notifications_real_time']
    }
  ];

  const testDescriptions = {
    admin_users: 'CRUD de usuários, atribuição de roles',
    admin_tenants: 'Listar, suspender, deletar tenants',
    admin_integrations: 'Configurar DataJud, TPU, Google Sheets',
    admin_monitoring: 'Timeline de eventos, real-time refresh',
    process_sync: 'Sincronização com DataJud',
    process_detail: 'Abrir detalhes do processo',
    process_parts: 'Visualizar e adicionar partes',
    process_movements: 'Timeline de movimentações',
    deadline_from_movement: 'Criar prazo a partir de movimentação',
    deadline_from_publication: 'Criar prazo a partir de publicação',
    deadline_alerts: 'Receber alerta 24h antes',
    agenda_create: 'Criar novo evento na agenda',
    agenda_deadline_link: 'Vincular evento ao prazo',
    agenda_alert: 'Notificação de evento próximo',
    datajud_connect: 'Conexão com API DataJud',
    datajud_sync: 'Sincronização automática',
    datajud_retry: 'Retentar sincronização com erro',
    tpu_import: 'Importar tabelas TPU',
    tpu_deduplicate: 'Deduplicação de movimentações',
    tpu_display: 'Exibir dados enriquecidos',
    sheets_export: 'Exportar processos para Google Sheets',
    sheets_import: 'Importar dados do Google Sheets',
    notifications_email: 'Enviar notificações por email',
    notifications_whatsapp: 'Enviar notificações por WhatsApp',
    notifications_real_time: 'Notificações em tempo real'
  };

  const toggleTest = (testKey) => {
    setChecklist({ ...checklist, [testKey]: !checklist[testKey] });
  };

  const completed = Object.values(checklist).filter(Boolean).length;
  const total = Object.keys(checklist).length;
  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            E2E Test Checklist
          </h1>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <Badge className="bg-green-100 text-green-800 text-lg">
              {completed}/{total} ({percentage}%)
            </Badge>
          </div>
        </div>

        <div className="space-y-6">
          {testCategories.map((category) => (
            <Card key={category.name}>
              <CardHeader>
                <CardTitle className="text-lg">{category.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {category.tests.map((testKey) => (
                    <button
                      key={testKey}
                      onClick={() => toggleTest(testKey)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition text-left"
                    >
                      {checklist[testKey] ? (
                        <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className={`font-medium ${checklist[testKey] ? 'line-through text-gray-500' : 'text-gray-900 dark:text-white'}`}>
                          {testKey.replace(/_/g, ' ').toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {testDescriptions[testKey]}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-6 bg-cyan-50 dark:bg-cyan-900/20 border-cyan-200">
          <CardContent className="pt-6">
            <h3 className="font-bold text-cyan-900 dark:text-cyan-100 mb-2">
              ✓ Sprint 11 Ready for Production
            </h3>
            <p className="text-sm text-cyan-800 dark:text-cyan-200">
              {percentage === 100
                ? 'Todos os testes passaram! Pronto para deploy em produção.'
                : `${total - completed} testes ainda precisam ser validados.`}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}