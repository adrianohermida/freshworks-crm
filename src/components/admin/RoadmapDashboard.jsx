import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import SprintExecutionDashboard from '@/components/repositorio/SprintExecutionDashboard';
import Sprint4Status from '@/components/repositorio/Sprint4Status';
import Sprint5Monitor from '@/components/repositorio/Sprint5Monitor';
import Sprint6Final from '@/components/repositorio/Sprint6Final';
import ProducaoFinal from '@/components/repositorio/ProducaoFinal';
import SprintReviewReport from '@/components/repositorio/SprintReviewReport';
import Sprint7Executor from '@/components/repositorio/Sprint7Executor';
import Sprint8Executor from '@/components/repositorio/Sprint8Executor';

export default function RoadmapDashboard() {
  const [activeRoadmapTab, setActiveRoadmapTab] = useState('sprint4');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">🗺️ Roadmap de Sprints</h2>
        <p className="text-gray-600 dark:text-gray-400">Acompanhamento de todas as etapas do projeto</p>
      </div>

      <Tabs value={activeRoadmapTab} onValueChange={setActiveRoadmapTab} className="w-full">
        <div className="border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
          <div className="flex gap-1 px-0">
            <TabsTrigger value="executor" className="flex gap-1">
              <span>⚙️</span> Sprint Executor
            </TabsTrigger>
            <TabsTrigger value="sprint4" className="flex gap-1">
              <span>4️⃣</span> Sprint 4
            </TabsTrigger>
            <TabsTrigger value="sprint5" className="flex gap-1">
              <span>5️⃣</span> Sprint 5
            </TabsTrigger>
            <TabsTrigger value="sprint6" className="flex gap-1">
              <span>6️⃣</span> Sprint 6 Final
            </TabsTrigger>
            <TabsTrigger value="producao" className="flex gap-1">
              <span>✅</span> Produção
            </TabsTrigger>
            <TabsTrigger value="review" className="flex gap-1">
              <span>📋</span> Review
            </TabsTrigger>
            <TabsTrigger value="sprint7" className="flex gap-1">
              <span>7️⃣</span> Sprint 7 (i18n)
            </TabsTrigger>
            <TabsTrigger value="sprint8" className="flex gap-1">
              <span>🇧🇷</span> Sprint 8 (Brasil)
            </TabsTrigger>
          </div>
        </div>

        <div className="mt-6">
          <TabsContent value="executor">
            <SprintExecutionDashboard />
          </TabsContent>
          <TabsContent value="sprint4">
            <Sprint4Status />
          </TabsContent>
          <TabsContent value="sprint5">
            <Sprint5Monitor />
          </TabsContent>
          <TabsContent value="sprint6">
            <Sprint6Final />
          </TabsContent>
          <TabsContent value="producao">
            <ProducaoFinal />
          </TabsContent>
          <TabsContent value="review">
            <SprintReviewReport />
          </TabsContent>
          <TabsContent value="sprint7">
            <Sprint7Executor />
          </TabsContent>
          <TabsContent value="sprint8">
            <Sprint8Executor />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}