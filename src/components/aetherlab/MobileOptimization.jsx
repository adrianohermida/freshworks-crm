import React, { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Smartphone, Zap, Network, BarChart3, CheckCircle2, AlertCircle } from 'lucide-react';

export default function MobileOptimization() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  const [metrics, setMetrics] = useState({
    bundleSize: 245,
    memoryUsage: 48,
    loadTime: 2.3,
    fps: 58,
    cacheHitRate: 89
  });

  const [optimizations, setOptimizations] = useState([
    {
      id: 1,
      name: 'Image Optimization',
      status: 'completed',
      impact: '+15% performance',
      description: 'WebP conversion + lazy loading'
    },
    {
      id: 2,
      name: 'Code Splitting',
      status: 'completed',
      impact: '-40KB bundle',
      description: 'Dynamic imports for routes'
    },
    {
      id: 3,
      name: 'Service Worker Caching',
      status: 'active',
      impact: '+3x faster loads',
      description: 'Offline-first with sync'
    },
    {
      id: 4,
      name: 'Touch Gesture Optimization',
      status: 'active',
      impact: '+12% responsiveness',
      description: 'Swipe, pinch, long-press'
    },
    {
      id: 5,
      name: 'Mobile-specific UI Components',
      status: 'in-progress',
      impact: 'Pending',
      description: 'Bottom sheet, optimized forms'
    }
  ]);

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-100 text-green-800',
      active: 'bg-blue-100 text-blue-800',
      'in-progress': 'bg-yellow-100 text-yellow-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6 p-6 max-w-5xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Smartphone className="w-8 h-8 text-blue-600" />
          Mobile Optimization
        </h1>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {[
          { label: 'Bundle Size', value: `${metrics.bundleSize}KB`, icon: Zap, status: 'good' },
          { label: 'Memory', value: `${metrics.memoryUsage}MB`, icon: BarChart3, status: 'good' },
          { label: 'Load Time', value: `${metrics.loadTime}s`, icon: Zap, status: 'good' },
          { label: 'FPS', value: `${metrics.fps}fps`, icon: Smartphone, status: 'excellent' },
          { label: 'Cache Hit', value: `${metrics.cacheHitRate}%`, icon: CheckCircle2, status: 'good' }
        ].map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <Card key={idx} className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className={`text-xs font-medium opacity-70 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {metric.label}
                    </p>
                    <p className="text-2xl font-bold mt-2">{metric.value}</p>
                  </div>
                  <Icon className="w-6 h-6 opacity-20" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Optimizations */}
      <div>
        <h2 className="text-xl font-bold mb-4">Active Optimizations</h2>
        <div className="space-y-3">
          {optimizations.map(opt => (
            <Card key={opt.id} className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{opt.name}</h3>
                      <Badge className={getStatusColor(opt.status)}>
                        {opt.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {opt.impact}
                      </Badge>
                    </div>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      {opt.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Device Support */}
      <Card className={isDark ? 'bg-gray-900 border-gray-800' : ''}>
        <CardHeader>
          <CardTitle>Device Support</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'iPhone 15', os: 'iOS 17+', support: '✓' },
              { name: 'Samsung S24', os: 'Android 14+', support: '✓' },
              { name: 'iPad Air', os: 'iPadOS 17+', support: '✓' },
              { name: 'Pixel 8', os: 'Android 14+', support: '✓' }
            ].map((device, idx) => (
              <div key={idx} className={`p-4 rounded-lg border text-sm ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                <p className="font-semibold">{device.name}</p>
                <p className={`text-xs opacity-70 mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  {device.os}
                </p>
                <p className="text-green-600 font-semibold">{device.support}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}