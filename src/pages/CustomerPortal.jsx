import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomerPortal() {
  const [activeTab, setActiveTab] = useState('browse'); // browse, create, track
  const [searchEmail, setSearchEmail] = useState('');
  const [searchId, setSearchId] = useState('');
  const [formData, setFormData] = useState({
    subject: '',
    description: '',
    email: '',
    name: '',
    priority: 'medium'
  });

  // Fetch KnowledgeBase articles
  const { data: articles = [], isLoading: articlesLoading } = useQuery({
    queryKey: ['kb-articles'],
    queryFn: async () => {
      try {
        return await base44.entities.KnowledgeBase.filter({ is_published: true });
      } catch {
        return [];
      }
    }
  });

  // Search tickets by ID or Email
  const { data: foundTickets = [], refetch: searchTickets } = useQuery({
    queryKey: ['customer-tickets', searchEmail, searchId],
    queryFn: async () => {
      if (!searchEmail && !searchId) return [];
      try {
        const tickets = await base44.entities.Ticket.list();
        return tickets.filter(t => 
          (searchEmail && t.contact_email?.toLowerCase().includes(searchEmail.toLowerCase())) ||
          (searchId && t.freshdesk_id?.includes(searchId))
        );
      } catch {
        return [];
      }
    },
    enabled: false
  });

  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.email || !formData.description) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    try {
      await base44.entities.Ticket.create({
        subject: formData.subject,
        description: formData.description,
        contact_email: formData.email,
        contact_name: formData.name,
        priority: formData.priority,
        status: 'open'
      });
      toast.success('Ticket criado com sucesso! Você receberá uma resposta em breve.');
      setFormData({ subject: '', description: '', email: '', name: '', priority: 'medium' });
      setActiveTab('track');
    } catch (error) {
      toast.error('Erro ao criar ticket');
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'open': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'resolved': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'closed': return <CheckCircle className="w-4 h-4 text-gray-500" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">Portal de Suporte</h1>
          <p className="text-slate-600 dark:text-slate-400">Crie, acompanhe e obtenha ajuda com seus tickets</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap justify-center">
          {[
            { id: 'browse', label: '📚 Base de Conhecimento' },
            { id: 'create', label: '✏️ Criar Ticket' },
            { id: 'track', label: '🔍 Rastrear Ticket' }
          ].map(tab => (
            <Button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              variant={activeTab === tab.id ? 'default' : 'outline'}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        
        {/* Browse KB */}
        {activeTab === 'browse' && (
          <div className="space-y-4">
            {articlesLoading ? (
              <div className="text-center py-8">Carregando artigos...</div>
            ) : articles.length > 0 ? (
              articles.map(article => (
                <Card key={article.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{article.title}</CardTitle>
                        <CardDescription>{article.category}</CardDescription>
                      </div>
                      <Badge variant="outline">{article.views_count} visualizações</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">{article.content}</p>
                    {article.tags && article.tags.length > 0 && (
                      <div className="mt-4 flex gap-1 flex-wrap">
                        {article.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  Nenhum artigo publicado no momento.
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Create Ticket */}
        {activeTab === 'create' && (
          <Card>
            <CardHeader>
              <CardTitle>Criar um Novo Ticket</CardTitle>
              <CardDescription>Descreva seu problema e entraremos em contato em breve</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateTicket} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Nome</label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Email *</label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="seu@email.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Assunto *</label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                    placeholder="Resumo do problema"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Descrição *</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Descreva seu problema em detalhes"
                    className="min-h-32"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Prioridade</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({...formData, priority: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>

                <Button type="submit" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Ticket
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Track Ticket */}
        {activeTab === 'track' && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Rastrear Seu Ticket</CardTitle>
                <CardDescription>Busque pelo email ou ID do ticket</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Seu email"
                    value={searchEmail}
                    onChange={(e) => setSearchEmail(e.target.value)}
                  />
                  <Button onClick={() => searchTickets()}>
                    <Search className="w-4 h-4" />
                  </Button>
                </div>

                <div className="text-center text-sm text-muted-foreground">OU</div>

                <div className="flex gap-2">
                  <Input
                    placeholder="ID do ticket"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                  />
                  <Button onClick={() => searchTickets()}>
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results */}
            {foundTickets.length > 0 && (
              <div className="space-y-4">
                {foundTickets.map(ticket => (
                  <Card key={ticket.id} className="border-l-4 border-l-blue-500">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusIcon(ticket.status)}
                            <CardTitle className="text-lg">{ticket.subject}</CardTitle>
                          </div>
                          <CardDescription>
                            ID: {ticket.freshdesk_id} • Criado em {new Date(ticket.created_date).toLocaleDateString('pt-BR')}
                          </CardDescription>
                        </div>
                        <Badge variant={ticket.priority === 'urgent' ? 'destructive' : 'secondary'}>
                          {ticket.priority}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Status</p>
                          <p className="text-sm font-medium capitalize">{ticket.status}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Última atualização</p>
                          <p className="text-sm font-medium">{new Date(ticket.updated_date).toLocaleDateString('pt-BR')}</p>
                        </div>
                      </div>
                      {ticket.description && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-xs text-muted-foreground mb-2">Descrição</p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{ticket.description}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}