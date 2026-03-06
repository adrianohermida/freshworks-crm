import React from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, Zap } from 'lucide-react';

export default function ArchitecturePlan() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  const plano = {
    'Fase 1: Design System': [
      { item: 'Tokens de Design (cores, spacing, tipografia)', status: '🔄', dificuldade: 'Média', dias: 1 },
      { item: 'Componentes Base (Button, Input, Card)', status: '✅', dificuldade: 'Fácil', dias: 0.5 },
      { item: 'Temas Dark/Light completos', status: '✅', dificuldade: 'Média', dias: 0.5 }
    ],
    'Fase 2: Mobile-First': [
      { item: 'Refatorar Layout com mobile breakpoints', status: '🔄', dificuldade: 'Alta', dias: 2 },
      { item: 'Criar BottomNavigation para mobile', status: '✅', dificuldade: 'Média', dias: 0.5 },
      { item: 'Adaptive Images & Icons', status: '🔄', dificuldade: 'Média', dias: 1 },
      { item: 'Touch-friendly interactions', status: '🔄', dificuldade: 'Média', dias: 1 }
    ],
    'Fase 3: Performance': [
      { item: 'Code splitting por rota', status: '⏳', dificuldade: 'Alta', dias: 2 },
      { item: 'Lazy loading de imagens', status: '⏳', dificuldade: 'Média', dias: 1 },
      { item: 'Cache strategy otimizado', status: '⏳', dificuldade: 'Alta', dias: 1.5 },
      { item: 'Web Vitals optimization', status: '⏳', dificuldade: 'Alta', dias: 2 }
    ],
    'Fase 4: Componentes Premium': [
      { item: 'Hero Sections animados', status: '⏳', dificuldade: 'Média', dias: 1 },
      { item: 'Cards com hover effects', status: '⏳', dificuldade: 'Fácil', dias: 0.5 },
      { item: 'Modals & Drawers responsivos', status: '⏳', dificuldade: 'Média', dias: 1 },
      { item: 'Loading states & Skeletons', status: '⏳', dificuldade: 'Fácil', dias: 0.5 }
    ],
    'Fase 5: Multitenant UI': [
      { item: 'Tenant branding customizável', status: '⏳', dificuldade: 'Alta', dias: 2 },
      { item: 'White-label layouts', status: '⏳', dificuldade: 'Alta', dias: 2 },
      { item: 'Dynamic sidebars por tenant', status: '⏳', dificuldade: 'Média', dias: 1.5 }
    ]
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-4 md:p-6`}>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold mb-2 flex items-center gap-2">
            <Zap className="w-8 h-8 text-yellow-500" />
            Plano de Reestruturação Frontend
          </h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Mobile-First • Responsivo • Design Sensacional • Multitenant
          </p>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Duração Total', value: '~12 dias', icon: '⏱️' },
            { label: 'Fases', value: '5', icon: '📋' },
            { label: 'Componentes', value: '25+', icon: '🧩' },
            { label: 'Breakpoints', value: '5', icon: '📱' }
          ].map((m, i) => (
            <Card key={i} className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardContent className="pt-6 text-center">
                <p className="text-2xl mb-1">{m.icon}</p>
                <p className="text-xs text-gray-500 mb-1">{m.label}</p>
                <p className="font-bold">{m.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Plano Detalhado */}
        <div className="space-y-6">
          {Object.entries(plano).map(([fase, items]) => (
            <Card key={fase} className={`border-2 ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{fase}</span>
                  <Badge className="bg-blue-600">{items.length} items</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {items.map((item, idx) => (
                    <div key={idx} className={`p-3 rounded-lg flex justify-between items-center border ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.item}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">{item.dificuldade}</Badge>
                          <Badge variant="outline" className="text-xs">⏱️ {item.dias}d</Badge>
                        </div>
                      </div>
                      <span className="text-xl">{item.status}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Breakpoints */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle>📱 Breakpoints Mobile-First</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { name: 'Mobile', size: '320px', tw: 'default' },
                { name: 'Tablet SM', size: '640px', tw: 'sm' },
                { name: 'Tablet MD', size: '768px', tw: 'md' },
                { name: 'Desktop', size: '1024px', tw: 'lg' },
                { name: 'Ultra', size: '1280px', tw: 'xl' }
              ].map((bp, i) => (
                <div key={i} className={`p-3 rounded-lg text-center ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className="font-mono font-bold text-sm">{bp.name}</p>
                  <p className="text-xs text-gray-500">{bp.size}</p>
                  <p className="text-xs font-mono text-purple-600">{bp.tw}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Padrões */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle>✨ Padrões de Implementação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-blue-50'} border-l-4 border-blue-600`}>
              <p className="font-semibold text-sm mb-1">🎯 Mobile-First Approach</p>
              <p className="text-xs">Começar com CSS para mobile (menos de 640px), depois expandir para tablets e desktops com media queries crescentes</p>
            </div>

            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-purple-50'} border-l-4 border-purple-600`}>
              <p className="font-semibold text-sm mb-1">🧩 Componentes Compostos</p>
              <p className="text-xs">Usar composição de componentes pequenos (atoms) para criar componentes maiores (molecules, organisms)</p>
            </div>

            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-green-50'} border-l-4 border-green-600`}>
              <p className="font-semibold text-sm mb-1">🎨 Design Tokens</p>
              <p className="text-xs">Centralizar cores, spacing, tipografia em tokens para garantir consistência visual</p>
            </div>

            <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-yellow-50'} border-l-4 border-yellow-600`}>
              <p className="font-semibold text-sm mb-1">⚡ Performance First</p>
              <p className="text-xs">Lazy load, code splitting, imagens otimizadas, CSS-in-JS otimizado</p>
            </div>
          </CardContent>
        </Card>

        {/* Timeline */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
          <CardHeader>
            <CardTitle>📅 Timeline de Implementação</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { semana: 'Semana 1', fase: 'Fase 1-2', progress: 60 },
                { semana: 'Semana 2', fase: 'Fase 3-4', progress: 30 },
                { semana: 'Semana 3', fase: 'Fase 5 + Polish', progress: 10 }
              ].map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium text-sm">{s.semana}: {s.fase}</span>
                    <span className="text-sm text-gray-500">{s.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-300 dark:bg-gray-600 h-2 rounded">
                    <div
                      className="bg-purple-600 h-2 rounded transition-all"
                      style={{ width: `${s.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}