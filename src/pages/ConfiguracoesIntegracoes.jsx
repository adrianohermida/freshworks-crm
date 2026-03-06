import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageCircle, Mail, Calendar } from 'lucide-react';
import ResumeLoader from '@/components/common/ResumeLoader';
import WhatsAppConfigPanel from '@/components/settings/WhatsAppConfigPanel';

export default function ConfiguracoesIntegracoes() {
  const [activeTab, setActiveTab] = useState('whatsapp');

  const { data: user, isLoading } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => base44.auth.me(),
  });

  if (isLoading) return <ResumeLoader />;

  // Apenas admin pode acessar
  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] p-6 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <p className="text-[var(--text-secondary)]">Acesso restrito a administradores</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      {/* Header */}
      <div className="bg-[var(--bg-primary)] border-b border-[var(--border-primary)] p-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Integrações</h1>
          <p className="text-[var(--text-secondary)] mt-1">Configure integrações externas e APIs</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        <Tabs defaultValue="whatsapp" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-[var(--bg-primary)] border-b border-[var(--border-primary)]">
            <TabsTrigger value="whatsapp" className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              WhatsApp
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2" disabled>
              <Mail className="w-4 h-4" />
              Email
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2" disabled>
              <Calendar className="w-4 h-4" />
              Calendário
            </TabsTrigger>
          </TabsList>

          <TabsContent value="whatsapp" className="mt-6">
            <WhatsAppConfigPanel />
          </TabsContent>

          <TabsContent value="email" className="mt-6">
            <Card className="bg-[var(--bg-elevated)]">
              <CardContent className="p-6 text-center text-[var(--text-secondary)]">
                Email integrations coming soon
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="calendar" className="mt-6">
            <Card className="bg-[var(--bg-elevated)]">
              <CardContent className="p-6 text-center text-[var(--text-secondary)]">
                Calendar integrations coming soon
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}