import React, { useState } from 'react';
import { CheckCircle2, Circle, AlertCircle, Lock, Zap, Users, FileText } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function LaunchChecklist() {
  const [checklist, setChecklist] = useState({
    security: [
      { id: 1, label: 'Auth validation em todas as páginas', status: 'done' },
      { id: 2, label: 'Role-based access control (RBAC)', status: 'done' },
      { id: 3, label: 'Error handling & input validation', status: 'done' },
      { id: 4, label: 'API keys & secrets safeguarded', status: 'done' },
      { id: 5, label: 'XSS/CSRF protection', status: 'done' }
    ],
    features: [
      { id: 1, label: 'Dashboard com KPIs', status: 'done' },
      { id: 2, label: 'Ticket management (CRUD)', status: 'done' },
      { id: 3, label: 'Contact sync & management', status: 'done' },
      { id: 4, label: 'AI-powered ticket analysis', status: 'done' },
      { id: 5, label: 'Bulk operations', status: 'done' },
      { id: 6, label: 'Advanced filtering & search', status: 'done' },
      { id: 7, label: 'Real-time updates', status: 'done' },
      { id: 8, label: 'SLA monitoring', status: 'done' },
      { id: 9, label: 'Agent performance analytics', status: 'done' },
      { id: 10, label: 'Mobile responsiveness', status: 'done' }
    ],
    documentation: [
      { id: 1, label: 'API documentation', status: 'done' },
      { id: 2, label: 'User guide', status: 'done' },
      { id: 3, label: 'Administrator guide', status: 'done' },
      { id: 4, label: 'Troubleshooting guide', status: 'done' },
      { id: 5, label: 'Release notes', status: 'done' }
    ],
    performance: [
      { id: 1, label: 'Ticket list: <500ms', status: 'done' },
      { id: 2, label: 'Contact list: <500ms', status: 'done' },
      { id: 3, label: 'Charts rendering: <1s', status: 'done' },
      { id: 1, label: 'Bundle size optimized', status: 'done' }
    ]
  });

  const toggleItem = (category, id) => {
    setChecklist(prev => ({
      ...prev,
      [category]: prev[category].map(item =>
        item.id === id
          ? { ...item, status: item.status === 'done' ? 'pending' : 'done' }
          : item
      )
    }));
  };

  const getStats = (category) => {
    const items = checklist[category];
    const done = items.filter(i => i.status === 'done').length;
    const total = items.length;
    return { done, total, percentage: Math.round((done / total) * 100) };
  };

  const categories = [
    { key: 'security', label: 'Security & Auth', icon: Lock, color: 'text-red-500' },
    { key: 'features', label: 'Feature Completeness', icon: Zap, color: 'text-blue-500' },
    { key: 'documentation', label: 'Documentation', icon: FileText, color: 'text-green-500' },
    { key: 'performance', label: 'Performance', icon: Users, color: 'text-purple-500' }
  ];

  const allStats = Object.values(checklist).flatMap(items => items);
  const allDone = allStats.filter(i => i.status === 'done').length;
  const totalItems = allStats.length;
  const overallPercentage = Math.round((allDone / totalItems) * 100);

  return (
    <div className="space-y-6 p-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🚀 Launch Checklist - Sprint 29</h1>
        <p className="text-muted-foreground mb-4">Validação completa para Go-Live</p>
        
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Overall Progress</p>
              <p className="text-3xl font-bold">{overallPercentage}%</p>
              <p className="text-sm opacity-90 mt-1">{allDone}/{totalItems} items complete</p>
            </div>
            <div className="text-5xl">✅</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map(category => {
          const stats = getStats(category.key);
          const Icon = category.icon;

          return (
            <Card key={category.key}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon className={`w-5 h-5 ${category.color}`} />
                  {category.label}
                </CardTitle>
                <CardDescription>
                  {stats.done}/{stats.total} items ({stats.percentage}%)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {checklist[category.key].map(item => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 p-2 rounded hover:bg-muted cursor-pointer"
                      onClick={() => toggleItem(category.key, item.id)}
                    >
                      {item.status === 'done' ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                      )}
                      <span className={item.status === 'done' ? 'line-through text-muted-foreground' : ''}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="border-green-200 bg-green-50 dark:bg-green-950">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
            <CheckCircle2 className="w-5 h-5" />
            Go-Live Status
          </CardTitle>
        </CardHeader>
        <CardContent className="text-green-700 dark:text-green-300">
          {overallPercentage === 100 ? (
            <div>
              <p className="font-semibold mb-2">✅ Sistema pronto para produção!</p>
              <p className="text-sm">Todos os critérios de lançamento foram validados. Aprovado para Go-Live.</p>
              <Button className="mt-4 bg-green-600 hover:bg-green-700">
                Autorizar Go-Live
              </Button>
            </div>
          ) : (
            <p className="text-sm">Completar todos os itens para liberar Go-Live</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}