import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Smartphone, Search, Zap, Users } from 'lucide-react';
import AdvancedFilterBuilder from '@/components/filters/AdvancedFilterBuilder';
import WorkflowBuilder from '@/components/workflows/WorkflowBuilder';
import CommunityForumWidget from '@/components/community/CommunityForumWidget';

export default function Sprint15Features() {
  const [filterResults, setFilterResults] = useState(null);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-gray-900">Sprint 15 — Advanced Features</h1>
            <Badge className="bg-green-600">100% Completo</Badge>
          </div>
          <p className="text-gray-600">Mobile MVP · Filtros Avançados · Workflows · Comunidade</p>
        </div>

        {/* Sprint 15 Progress Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: Smartphone, label: 'Mobile Foundation', pts: 4, color: 'text-blue-600', bg: 'bg-blue-50' },
            { icon: Search, label: 'Advanced Filters', pts: 3, color: 'text-purple-600', bg: 'bg-purple-50' },
            { icon: Zap, label: 'Workflow Engine', pts: 3, color: 'text-yellow-600', bg: 'bg-yellow-50' },
            { icon: Users, label: 'Community', pts: 3, color: 'text-green-600', bg: 'bg-green-50' }
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <Card key={i} className={`${item.bg} border-0`}>
                <CardContent className="pt-4 text-center">
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${item.color}`} />
                  <p className={`text-lg font-bold ${item.color}`}>{item.pts}pts</p>
                  <p className="text-xs text-gray-600">{item.label}</p>
                  <Badge className="mt-1 bg-green-600 text-xs">✓ Done</Badge>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Feature Demos */}
        <Tabs defaultValue="filters">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="filters">🔍 Filtros Avançados</TabsTrigger>
            <TabsTrigger value="workflows">⚡ Workflows</TabsTrigger>
            <TabsTrigger value="community">💬 Comunidade</TabsTrigger>
          </TabsList>

          <TabsContent value="filters" className="mt-4 space-y-4">
            <AdvancedFilterBuilder
              entityType="PublicacaoAdvise"
              onFiltersApplied={q => setFilterResults(q)}
            />
            {filterResults && (
              <Card>
                <CardHeader><CardTitle className="text-sm">Query Gerada</CardTitle></CardHeader>
                <CardContent>
                  <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto">
                    {JSON.stringify(filterResults, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="workflows" className="mt-4">
            <WorkflowBuilder />
          </TabsContent>

          <TabsContent value="community" className="mt-4">
            <CommunityForumWidget />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}