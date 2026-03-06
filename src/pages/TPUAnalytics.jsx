import React from 'react';
import { Scale } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TPUAnalyticsDashboard from '@/components/datajud/TPUAnalyticsDashboard';
import TPUViewer from '@/components/datajud/TPUViewer';
import TPUSyncPanel from '@/components/datajud/TPUSyncPanel';

/**
 * TPUAnalytics - Página dedicada a análises, exploração e automações TPU
 * Apresenta distribuição de classes, assuntos, movimentos, tendências e workflows
 */
export default function TPUAnalytics() {
  const ANALYTICS_TABS = [
    { id: 'analytics', label: '📊 Analytics', component: TPUAnalyticsDashboard },
    { id: 'structure', label: '🏗️ Estrutura', component: TPUViewer },
    { id: 'automacoes', label: '⚡ Sincronização', component: TPUSyncPanel }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <Scale className="w-8 h-8 text-[#212373]" />
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Analytics & Automações TPU</h1>
            <p className="text-slate-600 mt-1">Visualize distribuição de dados, estrutura hierárquica e crie workflows inteligentes</p>
          </div>
        </div>

        {/* Analytics Navigation */}
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white shadow">
            {ANALYTICS_TABS.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tab Contents */}
          {ANALYTICS_TABS.map(tab => {
            const Component = tab.component;
            return (
              <TabsContent key={tab.id} value={tab.id} className="bg-white rounded-lg shadow p-6">
                <Component />
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}