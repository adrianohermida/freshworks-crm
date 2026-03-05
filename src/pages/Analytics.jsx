import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdvancedReportBuilder from '../components/bi/AdvancedReportBuilder';
import MetricsDashboard from '../components/bi/MetricsDashboard';
import PageLayout from '../components/common/PageLayout';
import Analytics from '../components/Analytics';

export default function AnalyticsPage() {
  return (
    <>
      <Analytics eventName="analytics_page_view" />
      <PageLayout title="Análise & BI" subtitle="Relatórios avançados e visualização de dados">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="dashboard">📊 Dashboard BI</TabsTrigger>
            <TabsTrigger value="reports">📈 Relatórios</TabsTrigger>
            <TabsTrigger value="metrics">⚙️ Métricas</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <MetricsDashboard />
          </TabsContent>

          <TabsContent value="reports">
            <AdvancedReportBuilder />
          </TabsContent>

          <TabsContent value="metrics">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
              <p className="text-sm text-blue-800">
                🔧 Gerenciador de métricas será adicionado em breve
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </PageLayout>
    </>
  );
}