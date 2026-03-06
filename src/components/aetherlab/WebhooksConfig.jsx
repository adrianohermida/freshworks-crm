import React from 'react';
import { useTheme } from 'next-themes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GerenciadorWebhooksAvancado from '@/components/GerenciadorWebhooksAvancado';
import EventStreamingManager from '@/components/EventStreamingManager';
import { Zap, Activity } from 'lucide-react';

export default function WebhooksConfigPage() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-50'} p-6`}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
            <Zap className="w-10 h-10 text-purple-600" />
            Webhooks & Event Streaming
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Configure webhooks for real-time event notifications and monitor system activity
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="webhooks" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="webhooks" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Webhooks
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Event Stream
            </TabsTrigger>
          </TabsList>

          {/* Webhooks Tab */}
          <TabsContent value="webhooks" className="mt-8">
            <GerenciadorWebhooksAvancado />
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="mt-8">
            <EventStreamingManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}