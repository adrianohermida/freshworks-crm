import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, MapPin, FileText, Gavel, BookOpen, Eye, Zap } from 'lucide-react';
import TPUViewer from '../components/datajud/TPUViewer';
import TPUMetricsCollector from '../components/datajud/TPUMetricsCollector';
import TPUSyncPanel from '../components/datajud/TPUSyncPanel';
import TPUStatusDashboard from '../components/datajud/TPUStatusDashboard';

const ADMIN_TABS = [
  { id: 'visualizador', label: 'Dados TPU', icon: Eye },
  { id: 'metrics', label: 'Métricas', icon: Zap },
  { id: 'sync', label: 'Sincronização', icon: Database },
  { id: 'tpu', label: 'TPU SQL', icon: Gavel },
  { id: 'juizo', label: 'Juízos', icon: FileText },
  { id: 'serventia', label: 'Serventias', icon: MapPin },
  { id: 'tjsp', label: 'TJSP', icon: MapPin },
  { id: 'docs', label: 'Docs', icon: BookOpen }
];

export default function DatajudAdminPanel() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900">Administração DataJud + CNJ</h1>
          <p className="text-slate-600 mt-1">Importações TPU, Serventias, Juízos e Sincronização</p>
        </div>

        {/* TPU Status */}
        <div className="mb-6">
          <TPUStatusDashboard />
        </div>

        {/* Admin Navigation */}
        <Tabs defaultValue="visualizador" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 md:grid-cols-8 bg-white shadow">
            {ADMIN_TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <TabsTrigger key={tab.id} value={tab.id} className="gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="hidden md:inline text-xs">{tab.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {/* Tab Contents */}
          <TabsContent value="visualizador">
            <TPUViewer />
          </TabsContent>

          <TabsContent value="metrics">
            <TPUMetricsCollector />
          </TabsContent>

          <TabsContent value="sync">
            <TPUSyncPanel />
          </TabsContent>

          <TabsContent value="tpu">
            <TPUStatusDashboard />
          </TabsContent>

          <TabsContent value="juizo">
            <TPUStatusDashboard />
          </TabsContent>

          <TabsContent value="serventia">
            <TPUStatusDashboard />
          </TabsContent>

          <TabsContent value="tjsp">
            <TPUStatusDashboard />
          </TabsContent>

          <TabsContent value="docs">
            <TPUStatusDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}