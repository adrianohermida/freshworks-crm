import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageSquare, UserPlus, ArrowRight, Bot, User, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import BalcaoConversasList from '@/components/balcao/BalcaoConversasList';
import BalcaoConversaView from '@/components/balcao/BalcaoConversaView';
import BalcaoStats from '@/components/balcao/BalcaoStats';
import ResumeLoader from '@/components/common/ResumeLoader';

export default function BalcaoVirtual() {
  const [conversaSelecionada, setConversaSelecionada] = useState(null);
  const [statusFiltro, setStatusFiltro] = useState('triagem');
  const queryClient = useQueryClient();

  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => base44.auth.me(),
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: () => base44.entities.Escritorio.list(),
    enabled: !!user,
  });

  const { data: conversas = [], isLoading: loadingConversas } = useQuery({
    queryKey: ['balcao-conversas', escritorio?.[0]?.id, statusFiltro],
    queryFn: async () => {
      const result = await base44.entities.Conversa.filter(
        {
          escritorio_id: escritorio[0].id,
          ...(statusFiltro !== 'todas' && { status: statusFiltro })
        },
        '-updated_date',
        100
      );
      return result;
    },
    enabled: !!escritorio?.[0]?.id,
  });

  useEffect(() => {
    if (!escritorio?.[0]?.id) return;
    
    const unsubscribe = base44.entities.Conversa.subscribe((event) => {
      queryClient.invalidateQueries(['balcao-conversas']);
      if (conversaSelecionada?.id === event.id) {
        queryClient.invalidateQueries(['conversa-mensagens', event.id]);
      }
    });

    return unsubscribe;
  }, [escritorio?.[0]?.id, conversaSelecionada?.id]);

  if (loadingUser) return <ResumeLoader />;

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-[var(--bg-elevated)] border-b border-[var(--border-primary)] p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">Balcão Virtual</h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Atendimento integrado - Chat & Tickets
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-7xl mx-auto p-4">
        <BalcaoStats conversas={conversas} />
      </div>

      {/* Tabs de Status */}
      <div className="max-w-7xl mx-auto px-4">
        <Tabs value={statusFiltro} onValueChange={setStatusFiltro}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="triagem">
              <AlertCircle className="w-4 h-4 mr-2" />
              Triagem
            </TabsTrigger>
            <TabsTrigger value="em_atendimento">
              <UserPlus className="w-4 h-4 mr-2" />
              Em Atendimento
            </TabsTrigger>
            <TabsTrigger value="aguardando_cliente">
              <Clock className="w-4 h-4 mr-2" />
              Aguardando
            </TabsTrigger>
            <TabsTrigger value="resolvido">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Resolvido
            </TabsTrigger>
            <TabsTrigger value="todas">Todas</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid md:grid-cols-[400px_1fr] gap-4">
          {/* Lista de Conversas */}
          <BalcaoConversasList
            conversas={conversas}
            isLoading={loadingConversas}
            conversaSelecionada={conversaSelecionada}
            onSelectConversa={setConversaSelecionada}
          />

          {/* Visualização da Conversa */}
          {conversaSelecionada ? (
            <BalcaoConversaView
              conversa={conversaSelecionada}
              user={user}
              escritorioId={escritorio?.[0]?.id}
              onClose={() => setConversaSelecionada(null)}
            />
          ) : (
            <Card className="bg-[var(--bg-elevated)]">
              <CardContent className="p-12 text-center">
                <MessageSquare className="w-16 h-16 text-[var(--text-tertiary)] mx-auto mb-4" />
                <p className="text-[var(--text-secondary)]">
                  Selecione uma conversa para visualizar
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}