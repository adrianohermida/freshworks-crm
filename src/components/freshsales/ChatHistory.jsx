import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Clock, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function ChatHistory({ conversations }) {
  const [selectedConversation, setSelectedConversation] = useState(null);

  const activeConversations = conversations.filter(c => c.status === 'active');
  const closedConversations = conversations.filter(c => c.status === 'closed');

  const ConversationCard = ({ conversation }) => {
    const statusColors = {
      active: 'bg-green-100 text-green-800',
      closed: 'bg-slate-100 text-slate-800',
      waiting_response: 'bg-yellow-100 text-yellow-800'
    };

    return (
      <Card
        className="bg-white dark:bg-slate-800 cursor-pointer hover:shadow-md transition-shadow border-slate-200 dark:border-slate-700"
        onClick={() => setSelectedConversation(conversation)}
      >
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-sm">{conversation.subject}</CardTitle>
              <p className="text-xs text-slate-500 mt-1">Canal: {conversation.channel}</p>
            </div>
            <Badge className={statusColors[conversation.status]}>
              {conversation.status}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-2 text-xs">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Clock className="w-3 h-3" />
            {formatDistanceToNow(new Date(conversation.last_message_at), {
              addSuffix: true,
              locale: ptBR
            })}
          </div>

          {conversation.freddy_insights && (
            <div className="bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-slate-700 dark:to-slate-700 p-2 rounded">
              <p className="font-semibold text-cyan-900 dark:text-cyan-300 mb-1">
                Insights Freddy
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                Sentimento: {conversation.freddy_insights.sentiment}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Conversations List */}
      <div className="lg:col-span-1">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="active" className="flex-1">
              Ativos ({activeConversations.length})
            </TabsTrigger>
            <TabsTrigger value="closed" className="flex-1">
              Fechados ({closedConversations.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-3 mt-4">
            {activeConversations.length === 0 ? (
              <Card className="bg-white dark:bg-slate-800">
                <CardContent className="pt-6 text-center text-slate-500 text-sm">
                  Nenhuma conversa ativa
                </CardContent>
              </Card>
            ) : (
              activeConversations.map((conv) => (
                <ConversationCard key={conv.id} conversation={conv} />
              ))
            )}
          </TabsContent>

          <TabsContent value="closed" className="space-y-3 mt-4">
            {closedConversations.length === 0 ? (
              <Card className="bg-white dark:bg-slate-800">
                <CardContent className="pt-6 text-center text-slate-500 text-sm">
                  Nenhuma conversa fechada
                </CardContent>
              </Card>
            ) : (
              closedConversations.map((conv) => (
                <ConversationCard key={conv.id} conversation={conv} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Conversation Details */}
      <div className="lg:col-span-2">
        {selectedConversation ? (
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 h-full">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{selectedConversation.subject}</CardTitle>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
                    Canal: {selectedConversation.channel}
                  </p>
                </div>
                <Badge className="bg-gradient-to-r from-cyan-500 to-teal-500">
                  {selectedConversation.message_count} mensagens
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Messages */}
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 space-y-3 max-h-64 overflow-y-auto">
                {selectedConversation.messages?.map((msg, idx) => (
                  <div key={idx} className={`flex gap-2 ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}>
                    <div className={`max-w-xs px-3 py-2 rounded-lg ${
                      msg.sender === 'user'
                        ? 'bg-cyan-500 text-white'
                        : 'bg-white dark:bg-slate-600 text-slate-900 dark:text-white'
                    }`}>
                      <p className="text-xs">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Freddy Analysis */}
              {selectedConversation.freddy_insights && (
                <div className="bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-slate-700 dark:to-slate-700 p-4 rounded-lg border border-cyan-200 dark:border-cyan-500">
                  <p className="font-semibold text-cyan-900 dark:text-cyan-300 mb-2">
                    ✨ Análise Freddy
                  </p>
                  <div className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    <p><strong>Sentimento:</strong> {selectedConversation.freddy_insights.sentiment}</p>
                    <p><strong>Intent:</strong> {selectedConversation.freddy_insights.intent}</p>
                    <p><strong>Potencial Lead:</strong> {selectedConversation.freddy_insights.lead_potential}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 flex items-center justify-center h-full">
            <CardContent className="text-center text-slate-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Selecione uma conversa para ver os detalhes</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}