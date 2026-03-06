import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, TrendingUp } from 'lucide-react';

export default function GlobalExpansionPlanner() {
  const [selectedRegion, setSelectedRegion] = useState(null);

  const regions = [
    {
      id: 'br',
      name: 'Brasil (Headquarters)',
      status: 'ACTIVE',
      launch: 'Q1 2026',
      users: 150,
      growth: '+200%',
      strategy: 'Focus on Legal Tech market in São Paulo, Rio, Brasília',
      localization: ['pt-BR', 'Local payment methods', 'Compliance: Lei Geral de Proteção de Dados'],
      revenue: '$5,000'
    },
    {
      id: 'latam',
      name: 'Latin America (México, Argentina, Chile)',
      status: 'PLANNED',
      launch: 'Q3 2026',
      users: 0,
      growth: 'TBD',
      strategy: 'Expand to Spanish-speaking markets with localized compliance',
      localization: ['es-MX', 'es-AR', 'Local integrations', 'Compliance: GDPR equivalent'],
      revenue: '$0 (Projected: $15,000)'
    },
    {
      id: 'europe',
      name: 'Europe (Spain, Portugal, Germany)',
      status: 'PLANNED',
      launch: 'Q4 2026',
      users: 0,
      growth: 'TBD',
      strategy: 'Enter European market with GDPR compliance and multi-language support',
      localization: ['es-ES', 'pt-PT', 'de-DE', 'GDPR compliance', 'DPA agreements'],
      revenue: '$0 (Projected: $25,000)'
    },
    {
      id: 'usa',
      name: 'North America (USA, Canada)',
      status: 'RESEARCH',
      launch: 'Q2 2027',
      users: 0,
      growth: 'TBD',
      strategy: 'Expand to English-speaking markets with US-specific legal tech focus',
      localization: ['en-US', 'en-CA', 'SOC 2 compliance', 'US payment methods'],
      revenue: '$0 (Projected: $50,000+)'
    }
  ];

  const roadmap = [
    { quarter: 'Q1 2026', actions: ['Launch MVP', 'Initial users onboarding', 'Validate product-market fit'] },
    { quarter: 'Q2 2026', actions: ['Scale Brazil operations', 'Reach 500 users', 'Prepare Latin America expansion'] },
    { quarter: 'Q3 2026', actions: ['Launch in Mexico', 'Scale to 1,000 users', 'Begin Europe localization'] },
    { quarter: 'Q4 2026', actions: ['Launch in Spain/Portugal', 'Reach 2,500 users', 'Plan USA entry'] },
    { quarter: 'Q1 2027', actions: ['European scaling', 'Reach 5,000 users', 'USA market research'] },
    { quarter: 'Q2 2027', actions: ['USA launch soft', 'Target 10,000 users', 'Plan Asia expansion'] }
  ];

  const getTotalRevenue = () => {
    return regions.reduce((sum, r) => {
      if (r.status === 'ACTIVE') {
        const match = r.revenue.match(/\$([0-9,]+)/);
        return sum + (match ? parseInt(match[1].replace(',', '')) : 0);
      }
      return sum;
    }, 0);
  };

  return (
    <div className="space-y-6">
      {/* METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="pt-6">
            <p className="text-xs text-blue-600">Total Users (Active)</p>
            <p className="text-2xl font-bold">{regions.filter(r => r.status === 'ACTIVE').reduce((s, r) => s + r.users, 0)}</p>
          </CardContent>
        </Card>

        <Card className="bg-green-50 dark:bg-green-900/20">
          <CardContent className="pt-6">
            <p className="text-xs text-green-600">Current Revenue</p>
            <p className="text-2xl font-bold">${getTotalRevenue().toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card className="bg-purple-50 dark:bg-purple-900/20">
          <CardContent className="pt-6">
            <p className="text-xs text-purple-600">Active Regions</p>
            <p className="text-2xl font-bold">{regions.filter(r => r.status === 'ACTIVE').length}</p>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 dark:bg-orange-900/20">
          <CardContent className="pt-6">
            <p className="text-xs text-orange-600">Planned Regions</p>
            <p className="text-2xl font-bold">{regions.filter(r => r.status === 'PLANNED' || r.status === 'RESEARCH').length}</p>
          </CardContent>
        </Card>
      </div>

      {/* REGIONS */}
      <Card>
        <CardHeader>
          <CardTitle>🌍 Regional Expansion Strategy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {regions.map(region => (
            <div
              key={region.id}
              onClick={() => setSelectedRegion(selectedRegion === region.id ? null : region.id)}
              className="p-3 bg-gray-50 dark:bg-gray-700 rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-semibold">{region.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    Launch: {region.launch} | Users: {region.users} | Growth: {region.growth}
                  </p>
                </div>
                <Badge className={
                  region.status === 'ACTIVE' ? 'bg-green-600' :
                  region.status === 'PLANNED' ? 'bg-blue-600' :
                  'bg-gray-600'
                }>
                  {region.status}
                </Badge>
              </div>

              {selectedRegion === region.id && (
                <div className="mt-3 pt-3 border-t border-gray-300 dark:border-gray-600 space-y-2">
                  <div>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Strategy:</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{region.strategy}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Localization Requirements:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {region.localization.map((item, i) => (
                        <Badge key={i} variant="outline" style={{ fontSize: '10px' }}>{item}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Revenue Projection:</p>
                    <p className="text-sm text-green-600 font-semibold">{region.revenue}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ROADMAP */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            12-Month Expansion Roadmap
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {roadmap.map((item, idx) => (
            <div key={idx} className="p-3 bg-gray-50 dark:bg-gray-700 rounded">
              <p className="font-semibold text-sm mb-2">{item.quarter}</p>
              <ul className="text-xs space-y-1 text-gray-600 dark:text-gray-400">
                {item.actions.map((action, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-green-600" />
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* FINANCIAL PROJECTION */}
      <Card className="bg-green-50 dark:bg-green-900/20">
        <CardHeader>
          <CardTitle className="text-base text-green-900 dark:text-green-100">
            💰 Revenue Projection
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-green-900 dark:text-green-100 space-y-2">
          <p><strong>Q1 2026:</strong> $5,000 (Brasil)</p>
          <p><strong>Q2 2026:</strong> $15,000 (Brasil + Mexico)</p>
          <p><strong>Q4 2026:</strong> $45,000 (Brasil + Mexico + Europe)</p>
          <p><strong>Q2 2027:</strong> $125,000+ (All regions + USA launch)</p>
        </CardContent>
      </Card>
    </div>
  );
}