import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Brain, Globe, Smartphone, Zap } from 'lucide-react';

export default function Sprint13Roadmap() {
  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'Predictive Analytics',
      description: 'ML-powered predictions para desfecho de casos jurídicos',
      status: 'planning',
      timeline: '2-3 semanas',
      components: ['PredictiveModel.jsx', 'metricsCollector.js']
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Multi-Language Support',
      description: 'i18n com PT-BR, EN, ES completo',
      status: 'planning',
      timeline: '1-2 semanas',
      components: ['LanguageSelector.jsx', 'translations mapping']
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: 'Mobile App Native',
      description: 'iOS/Android via React Native',
      status: 'planning',
      timeline: '4-6 semanas',
      components: ['MobileOptimization.jsx', 'PWA support']
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Global Expansion',
      description: 'Multi-jurisdiction, compliance, scaling',
      status: 'planning',
      timeline: '3-4 semanas',
      components: ['Region configs', 'Compliance rules']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          🚀 Sprint 13 Roadmap
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Advanced Features & Global Expansion (10-15 semanas estimadas)
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {features.map((feature, i) => (
            <Card key={i} className="border-purple-200 dark:border-purple-800">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-purple-600">{feature.icon}</div>
                    <div>
                      <CardTitle>{feature.title}</CardTitle>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Timeline</span>
                  <Badge variant="outline">{feature.timeline}</Badge>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Componentes:</p>
                  <div className="space-y-1">
                    {feature.components.map((comp, j) => (
                      <p key={j} className="text-xs text-gray-600 dark:text-gray-400">
                        • {comp}
                      </p>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Timeline */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>📅 Timeline Detalhado</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 border-l-4 border-purple-600 bg-purple-50 dark:bg-purple-900/20">
                <p className="font-medium text-purple-900 dark:text-purple-100">Semana 1-2: Predictive Analytics Setup</p>
                <p className="text-sm text-purple-800 dark:text-purple-200">ML model integration, training data, API endpoints</p>
              </div>
              <div className="p-3 border-l-4 border-blue-600 bg-blue-50 dark:bg-blue-900/20">
                <p className="font-medium text-blue-900 dark:text-blue-100">Semana 2-3: i18n Implementation</p>
                <p className="text-sm text-blue-800 dark:text-blue-200">Language selector, translation strings, RTL support</p>
              </div>
              <div className="p-3 border-l-4 border-green-600 bg-green-50 dark:bg-green-900/20">
                <p className="font-medium text-green-900 dark:text-green-100">Semana 4-7: Mobile Native Development</p>
                <p className="text-sm text-green-800 dark:text-green-200">React Native setup, iOS/Android builds, app store submission</p>
              </div>
              <div className="p-3 border-l-4 border-orange-600 bg-orange-50 dark:bg-orange-900/20">
                <p className="font-medium text-orange-900 dark:text-orange-100">Semana 8-10: Global Expansion</p>
                <p className="text-sm text-orange-800 dark:text-orange-200">Multi-jurisdiction configs, compliance rules, CDN setup</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}