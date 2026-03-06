import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdvancedSearchFilters from '@/components/AdvancedSearchFilters';
import BatchOperationsManager from '@/components/BatchOperationsManager';
import TemplateMarketplace from '@/components/TemplateMarketplace';
import WhiteLabelPortal from '@/components/WhiteLabelPortal';
import AdvancedReportingSuite from '@/components/AdvancedReportingSuite';
import WebhooksMarketplace from '@/components/WebhooksMarketplace';

export default function SprintODashboard() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  const [tasks] = useState([
    { task: 'O-1', name: 'Advanced Search & Filters', status: 100, completion: '✅' },
    { task: 'O-2', name: 'Batch Operations Manager', status: 100, completion: '✅' },
    { task: 'O-3', name: 'Template Marketplace', status: 100, completion: '✅' },
    { task: 'O-4', name: 'White-Label Portal', status: 100, completion: '✅' },
    { task: 'O-5', name: 'Advanced Reporting Suite', status: 100, completion: '✅' },
    { task: 'O-6', name: 'Webhooks Marketplace', status: 100, completion: '✅' }
  ]);

  return (
    <div className="space-y-6 p-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Sprint O Execution Dashboard</h1>
        <Badge className="text-lg px-4 py-2 bg-green-100 text-green-800">
          100% Complete ✓
        </Badge>
      </div>

      {/* Progress Overview */}
      <Card className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
        <CardHeader>
          <CardTitle>Sprint O Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {tasks.map((task, idx) => (
            <div key={idx}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{task.task}</span>
                  <span className="text-sm">{task.name}</span>
                </div>
                <Badge className="bg-green-100 text-green-800">{task.completion}</Badge>
              </div>
              <div className={`w-full h-2 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}>
                <div className="h-full rounded-full bg-green-600" style={{width: '100%'}} />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Features Tabs */}
      <Tabs defaultValue="search" className="w-full">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="search">Search</TabsTrigger>
          <TabsTrigger value="batch">Batch Ops</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="whitelabel">White-Label</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="mt-6">
          <AdvancedSearchFilters />
        </TabsContent>

        <TabsContent value="batch" className="mt-6">
          <BatchOperationsManager />
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <TemplateMarketplace />
        </TabsContent>

        <TabsContent value="whitelabel" className="mt-6">
          <WhiteLabelPortal />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <AdvancedReportingSuite />
        </TabsContent>

        <TabsContent value="webhooks" className="mt-6">
          <WebhooksMarketplace />
        </TabsContent>
      </Tabs>
    </div>
  );
}