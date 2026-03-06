import React, { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { Send, X, MessageCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);
  const [conversation, setConversation] = useState(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleStartChat = async () => {
    if (!contactInfo?.email) {
      // Mostrar form para coletar informações de contato
      return;
    }

    setIsLoading(true);
    try {
      // Buscar ou criar contato
      const existingContact = await base44.entities.FreshsalesContact.list({
        email: contactInfo.email
      });

      let contact = existingContact[0];
      if (!contact) {
        contact = await base44.entities.FreshsalesContact.create({
          first_name: contactInfo.first_name,
          email: contactInfo.email,
          source: 'chat_widget',
          status: 'prospect',
          tenant_id: Deno.env.get('BASE44_APP_ID')
        });
      }

      // Criar conversa
      const newConversation = await base44.entities.ChatConversation.create({
        contact_id: contact.id,
        widget_source: 'website',
        channel: 'chat',
        status: 'active',
        tenant_id: Deno.env.get('BASE44_APP_ID')
      });

      setConversation(newConversation);
      setMessages([{
        id: 'initial',
        sender: 'agent',
        content: `Olá ${contactInfo.first_name}! Como posso ajudá-lo?`,
        timestamp: new Date()
      }]);
    } catch (error) {
      console.error('Error starting chat:', error);
      setMessages([{
        id: 'error',
        sender: 'agent',
        content: 'Desculpe, houve um erro ao iniciar o chat. Tente novamente.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !conversation) return;

    const userMessage = {
      id: Date.now().toString(),
      sender: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Adicionar mensagem à conversa
      await base44.entities.ChatConversation.update(conversation.id, {
        messages: [...(conversation.messages || []), userMessage],
        last_message_at: new Date().toISOString()
      });

      // Invocar Freddy para gerar resposta
      const response = await base44.functions.invoke('freddy', {
        action: 'analyze_conversation',
        conversation_id: conversation.id
      });

      const agentMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        content: response.recommended_action || 'Como posso ajudá-lo mais?',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, agentMessage]);
      setConversation(prev => ({
        ...prev,
        freddy_insights: response
      }));
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: (Date.now() + 2).toString(),
        sender: 'agent',
        content: 'Desculpe, houve um erro. Um agente você responderá em breve.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-cyan-500 to-teal-500 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Abrir chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 max-w-full bg-white dark:bg-slate-900 rounded-lg shadow-2xl flex flex-col h-96 border border-slate-200 dark:border-slate-700">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-teal-500 text-white p-4 rounded-t-lg flex justify-between items-center">
        <h3 className="font-semibold">Chat de Atendimento</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="hover:opacity-80 transition-opacity"
          aria-label="Fechar chat"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4 space-y-3">
        {messages.length === 0 && !contactInfo ? (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-slate-600 dark:text-slate-300">
              Deixe suas informações para iniciar uma conversa.
            </p>
            <Input
              placeholder="Seu nome"
              onChange={(e) => setContactInfo({...contactInfo, first_name: e.target.value})}
              className="text-sm"
            />
            <Input
              type="email"
              placeholder="Seu email"
              onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
              className="text-sm"
            />
            <Button
              onClick={handleStartChat}
              disabled={isLoading || !contactInfo?.email}
              className="w-full bg-gradient-to-r from-cyan-500 to-teal-500"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Iniciar Chat'}
            </Button>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs px-3 py-2 rounded-lg ${
                    msg.sender === 'user'
                      ? 'bg-cyan-500 text-white rounded-br-none'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-bl-none'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-2 items-center">
                <div className="bg-slate-200 dark:bg-slate-700 rounded-full p-2">
                  <Loader2 className="w-4 h-4 animate-spin text-slate-500" />
                </div>
              </div>
            )}
            <div ref={scrollRef} />
          </>
        )}
      </ScrollArea>

      {/* Input */}
      {contactInfo && (
        <div className="border-t border-slate-200 dark:border-slate-700 p-3 flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Digite sua mensagem..."
            disabled={isLoading}
            className="text-sm"
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            size="icon"
            className="bg-cyan-500 hover:bg-cyan-600"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}