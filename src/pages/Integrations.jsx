import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Zap } from 'lucide-react';
import CreateTicketForm from '../components/tickets/CreateTicketForm';
import ContactSelector from '../components/common/ContactSelector';
import AgentAssignmentForm from '../components/common/AgentAssignmentForm';
import WebhookConfiguratorForm from '../components/settings/WebhookConfiguratorForm';
import PageLayout from '../components/common/PageLayout';
import Analytics from '../components/Analytics';

export default function IntegrationsPage() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showContactSelector, setShowContactSelector] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [showAgentForm, setShowAgentForm] = useState(false);
  const [showWebhookForm, setShowWebhookForm] = useState(false);

  const integrations = [
    {
      name: 'Freshdesk Tickets',
      status: 'connected',
      description: 'Sincronização completa de tickets',
      endpoints: 6,
      icon: Zap
    },
    {
      name: 'Freshdesk Contatos',
      status: 'connected',
      description: 'Gerenciamento de contatos',
      endpoints: 3,
      icon: Zap
    },
    {
      name: 'Freshdesk Agentes',
      status: 'connected',
      description: 'Administração de agentes',
      endpoints: 4,
      icon: Zap
    },
    {
      name: 'Webhooks',
      status: 'pending',
      description: 'Eventos em tempo real',
      endpoints: 3,
      icon: AlertCircle
    }
  ];

  return (
    <>
      <Analytics eventName="integrations_page_view" />
      <PageLayout title="Integrações Freshdesk" subtitle="Gerencie todas as integrações com Freshdesk">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Visão Geral</TabsTrigger>
            <TabsTrigger value="tickets">Criar Ticket</TabsTrigger>
            <TabsTrigger value="contacts">Contatos</TabsTrigger>
            <TabsTrigger value="agents">Agentes</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {integrations.map((integration, idx) => {
                const Icon = integration.icon;
                return (
                  <Card key={idx}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5" />
                          <CardTitle className="text-base">{integration.name}</CardTitle>
                        </div>
                        <Badge variant={integration.status === 'connected' ? 'default' : 'secondary'}>
                          {integration.status === 'connected' ? 'Conectado' : 'Pendente'}
                        </Badge>
                      </div>
                      <CardDescription>{integration.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-sm text-gray-600">
                        {integration.endpoints} endpoints disponíveis
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Estatísticas de Integração</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-700">22</div>
                    <div className="text-sm text-green-600">Funções Implementadas</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-700">4</div>
                    <div className="text-sm text-blue-600">Componentes UI</div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-700">96%</div>
                    <div className="text-sm text-purple-600">Completude do Plano</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Create Ticket Tab */}
          <TabsContent value="tickets">
            {showCreateForm ? (
              <CreateTicketForm
                onSuccess={() => setShowCreateForm(false)}
                onCancel={() => setShowCreateForm(false)}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Criar Novo Ticket</CardTitle>
                  <CardDescription>
                    Crie um ticket diretamente no Freshdesk através da integração
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <button
                    onClick={() => setShowCreateForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Novo Ticket
                  </button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Contacts Tab */}
          <TabsContent value="contacts">
            {showContactSelector ? (
              <ContactSelector
                onSelect={(contact) => {
                  console.log('Contato selecionado:', contact);
                  setShowContactSelector(false);
                }}
                onCancel={() => setShowContactSelector(false)}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Gerenciar Contatos</CardTitle>
                  <CardDescription>
                    Busque e gerencie contatos do Freshdesk
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <button
                    onClick={() => setShowContactSelector(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Buscar Contato
                  </button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Agents Tab */}
          <TabsContent value="agents">
            {showAgentForm && selectedTicketId ? (
              <AgentAssignmentForm
                ticketId={selectedTicketId}
                onAssignSuccess={() => {
                  setShowAgentForm(false);
                  setSelectedTicketId(null);
                }}
                onCancel={() => {
                  setShowAgentForm(false);
                  setSelectedTicketId(null);
                }}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Atribuir Agentes</CardTitle>
                  <CardDescription>
                    Atribua agentes a tickets
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <input
                    type="text"
                    placeholder="ID do Ticket"
                    value={selectedTicketId || ''}
                    onChange={(e) => setSelectedTicketId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <button
                    onClick={() => setShowAgentForm(true)}
                    disabled={!selectedTicketId}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  >
                    Atribuir Agente
                  </button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Webhooks Tab */}
          <TabsContent value="webhooks">
            {showWebhookForm ? (
              <WebhookConfiguratorForm
                onSuccess={() => setShowWebhookForm(false)}
                onCancel={() => setShowWebhookForm(false)}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Configurar Webhooks</CardTitle>
                  <CardDescription>
                    Crie webhooks para sincronização automática
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <button
                    onClick={() => setShowWebhookForm(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Novo Webhook
                  </button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </PageLayout>
    </>
  );
}