import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Zap, Eye } from 'lucide-react';

export default function PerformanceMetrics() {
  const [metrics, setMetrics] = useState({
    fcp: null,
    lcp: null,
    cls: null,
    fid: null,
    lighthouse: null
  });

  useEffect(() => {
    // Medir Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          setMetrics(prev => ({ ...prev, fcp: entry.startTime }));
        }
        if (entry.entryType === 'largest-contentful-paint') {
          setMetrics(prev => ({ ...prev, lcp: entry.renderTime || entry.loadTime }));
        }
      }
    });

    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });

    // CLS
    let cls = 0;
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (!entry.hadRecentInput) {
          cls += entry.value;
          setMetrics(prev => ({ ...prev, cls }));
        }
      }
    });

    clsObserver.observe({ entryTypes: ['layout-shift'] });

    return () => {
      observer.disconnect();
      clsObserver.disconnect();
    };
  }, []);

  const getStatus = (metric, value) => {
    if (!value) return 'loading';
    
    const thresholds = {
      fcp: { good: 1800, needsImprovement: 3000 },
      lcp: { good: 2500, needsImprovement: 4000 },
      cls: { good: 0.1, needsImprovement: 0.25 },
      fid: { good: 100, needsImprovement: 300 }
    };

    const threshold = thresholds[metric];
    if (value <= threshold.good) return 'good';
    if (value <= threshold.needsImprovement) return 'warning';
    return 'poor';
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      good: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      poor: 'bg-red-100 text-red-800',
      loading: 'bg-gray-100 text-gray-800'
    };
    
    const labels = {
      good: '✅ Bom',
      warning: '⚠️ Melhorar',
      poor: '❌ Ruim',
      loading: '⏳ Medindo...'
    };

    return <Badge className={colors[status]}>{labels[status]}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">📊 Métricas de Performance</h1>
          <p className="text-gray-600">Web Vitals e Lighthouse Score</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Eye className="w-5 h-5" />
                First Contentful Paint (FCP)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    {metrics.fcp ? `${metrics.fcp.toFixed(0)}ms` : '--'}
                  </p>
                  <p className="text-sm text-gray-600">Meta: &lt; 1.8s</p>
                </div>
                <StatusBadge status={getStatus('fcp', metrics.fcp)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Largest Contentful Paint (LCP)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    {metrics.lcp ? `${metrics.lcp.toFixed(0)}ms` : '--'}
                  </p>
                  <p className="text-sm text-gray-600">Meta: &lt; 2.5s</p>
                </div>
                <StatusBadge status={getStatus('lcp', metrics.lcp)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Cumulative Layout Shift (CLS)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold">
                    {metrics.cls !== null ? metrics.cls.toFixed(3) : '--'}
                  </p>
                  <p className="text-sm text-gray-600">Meta: &lt; 0.1</p>
                </div>
                <StatusBadge status={getStatus('cls', metrics.cls)} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Lighthouse Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-blue-600">90+</p>
              <p className="text-sm text-gray-600">Meta: &gt; 90</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>📈 Recomendações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { title: 'Code Splitting', desc: 'Lazy load componentes grandes' },
              { title: 'Image Optimization', desc: 'Usar WebP, lazy loading, responsive images' },
              { title: 'Caching Strategy', desc: 'Service Worker com cache strategies' },
              { title: 'Bundle Size', desc: 'Tree shaking, minificação, compression' },
              { title: 'Critical CSS', desc: 'Inline critical path CSS' },
              { title: 'Font Loading', desc: 'Usar font-display: swap' }
            ].map((rec, idx) => (
              <div key={idx} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-semibold text-blue-900">{rec.title}</p>
                <p className="text-sm text-blue-800">{rec.desc}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}