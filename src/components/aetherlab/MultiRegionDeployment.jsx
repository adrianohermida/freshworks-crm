import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { MapPin, Server, Zap, Shield, TrendingUp, CheckCircle2 } from 'lucide-react';
import { useI18n } from '@/components/i18nManager';
import { useTenant } from '@/components/TenantContext';
import { checkPermission } from '@/components/RoleBasedAccess';

export default function MultiRegionDeployment() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const [selectedRegion, setSelectedRegion] = useState('us-east');
  const { t } = useI18n();
  const { tenantId } = useTenant();

  const regions = [
    {
      id: 'us-east',
      name: '🇺🇸 US-EAST',
      location: 'Virginia, USA',
      latency: '1ms',
      status: 'ACTIVE',
      servers: 12,
      uptime: '99.99%',
      features: ['Primary US market', 'ESIGN compliance', 'Auto-scaling'],
      dataCenter: 'AWS us-east-1'
    },
    {
      id: 'eu-west',
      name: '🌍 EU-WEST',
      location: 'Dublin, Ireland',
      latency: '2ms',
      status: 'ACTIVE',
      servers: 15,
      uptime: '99.99%',
      features: ['GDPR compliant', 'eIDAS ready', 'Data sovereignty'],
      dataCenter: 'AWS eu-west-1'
    },
    {
      id: 'sa-north',
      name: '🇧🇷 SA-NORTH',
      location: 'São Paulo, Brasil',
      latency: '1ms',
      status: 'ACTIVE',
      servers: 10,
      uptime: '99.99%',
      features: ['Lei 14.063 native', 'ICP-Brasil cert', 'CNJ integration'],
      dataCenter: 'AWS sa-east-1'
    },
    {
      id: 'apac-south',
      name: '🌏 APAC-SOUTH',
      location: 'Singapore',
      latency: '3ms',
      status: 'COMING',
      servers: 8,
      uptime: '99.98%',
      features: ['Asia expansion', 'Local compliance', 'Low latency'],
      dataCenter: 'AWS ap-southeast-1'
    },
    {
      id: 'uk-london',
      name: '🇬🇧 UK-LONDON',
      location: 'London, UK',
      latency: '2ms',
      status: 'COMING',
      servers: 8,
      uptime: 'TBD',
      features: ['UK eIDAS equiv', 'FCA compliance', 'Post-Brexit'],
      dataCenter: 'AWS eu-london-1'
    },
    {
      id: 'ca-central',
      name: '🇨🇦 CA-CENTRAL',
      location: 'Toronto, Canada',
      latency: '2ms',
      status: 'PLANNED',
      servers: 6,
      uptime: 'TBD',
      features: ['Canada market', 'PIPEDA compliance', 'North America hub'],
      dataCenter: 'AWS ca-central-1'
    }
  ];

  const selectedData = regions.find(r => r.id === selectedRegion);

  const globalMetrics = [
    { label: 'Servidores Globais', value: '59', icon: Server },
    { label: 'Regiões Ativas', value: '3/6', icon: MapPin },
    { label: 'Uptime Médio', value: '99.99%', icon: Zap },
    { label: 'Latência Global', value: '<100ms', icon: TrendingUp }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <section className={`p-8 rounded-lg border-2 ${isDark ? 'bg-gradient-to-r from-blue-900/40 to-cyan-900/40 border-blue-700' : 'bg-gradient-to-r from-blue-100 to-cyan-100 border-blue-400'}`}>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold flex items-center gap-2">
              <MapPin className="w-10 h-10 text-blue-600" />
              🌐 Multi-Region Deployment
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Infraestrutura global distribuída em 6 regiões com low-latency
            </p>
          </div>
        </section>

        {/* GLOBAL METRICS */}
        <div className="grid md:grid-cols-4 gap-4">
          {globalMetrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <Card key={idx} className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardContent className="pt-6">
                  <Icon className="w-6 h-6 mb-2 text-blue-600" />
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{metric.label}</p>
                  <p className="text-2xl font-bold mt-2">{metric.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* REGION SELECTOR */}
        <section>
          <h2 className="text-2xl font-bold mb-4">🗺️ Regiões de Deployment</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {regions.map((region) => (
              <Card
                key={region.id}
                onClick={() => setSelectedRegion(region.id)}
                className={`cursor-pointer border-2 transition-all ${
                  selectedRegion === region.id
                    ? isDark
                      ? 'bg-blue-900/40 border-blue-700'
                      : 'bg-blue-50 border-blue-500'
                    : isDark
                    ? 'bg-gray-800 border-gray-700'
                    : 'border-gray-200'
                }`}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-bold text-lg">{region.name}</h3>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{region.location}</p>
                    </div>
                    <Badge className={
                      region.status === 'ACTIVE'
                        ? 'bg-green-600'
                        : region.status === 'COMING'
                        ? 'bg-blue-600'
                        : 'bg-gray-600'
                    }>
                      {region.status === 'ACTIVE' ? '✓' : region.status === 'COMING' ? '⏳' : '📅'} {region.status}
                    </Badge>
                  </div>
                  <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>⏱️ {region.latency}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* REGION DETAILS */}
        {selectedData && (
          <section>
            <h2 className="text-2xl font-bold mb-4">📊 Detalhes: {selectedData.name}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle>Características Técnicas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Servidores</span>
                      <span className="font-bold">{selectedData.servers}</span>
                    </div>
                    <Progress value={(selectedData.servers / 15) * 100} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="font-semibold">Uptime</span>
                      <span className="font-bold text-green-600">{selectedData.uptime}</span>
                    </div>
                    <Progress value={parseFloat(selectedData.uptime)} className="h-2" />
                  </div>
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <p className="text-xs font-semibold">Data Center</p>
                    <p className="font-bold">{selectedData.dataCenter}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <p className="text-xs font-semibold">Latência</p>
                    <p className="font-bold text-blue-600">{selectedData.latency}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle>Funcionalidades & Compliance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className={`space-y-3 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                    {selectedData.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* DEPLOYMENT STATUS */}
        <Card className={`${isDark ? 'bg-gradient-to-r from-green-900/40 to-blue-900/40 border-green-700' : 'bg-gradient-to-r from-green-100 to-blue-100 border-green-400'} border-2`}>
          <CardContent className="pt-8 space-y-4">
            <h3 className="text-2xl font-bold">✅ Rollout Status</h3>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-bold">Phase 1: 3 Regiões Ativas</span>
                  <span className="text-green-600 font-bold">100%</span>
                </div>
                <Progress value={100} className="h-3" />
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>US-EAST, EU-WEST, SA-NORTH</p>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-bold">Phase 2: 2 Regiões Coming (Out/2026)</span>
                  <span className="text-blue-600 font-bold">50%</span>
                </div>
                <Progress value={50} className="h-3" />
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>APAC-SOUTH, UK-LONDON</p>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-bold">Phase 3: 1 Região Planned (2027)</span>
                  <span className="text-purple-600 font-bold">0%</span>
                </div>
                <Progress value={0} className="h-3" />
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>CA-CENTRAL</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}