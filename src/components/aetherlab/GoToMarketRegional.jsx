import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, Target, Globe, DollarSign, Users, Zap } from 'lucide-react';

export default function GoToMarketRegional() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const [selectedMarket, setSelectedMarket] = useState('br');

  const markets = [
    {
      id: 'br',
      name: '🇧🇷 Brasil',
      region: 'LATAM',
      status: 'ACTIVE',
      launchDate: 'Aug 2026',
      pricing: 'R$ 0 / R$ 49 / Custom',
      target: '$8M ARR',
      strategy: [
        'Parcerias com Cartórios Digitais',
        'Integração CNJ obrigatória',
        'Marketing jurídico + compliance',
        'Suporte em Português 24/7'
      ],
      marketSize: '$2.5B',
      competitors: 3,
      positionStrategy: 'Lei 14.063 nativa + mais barato'
    },
    {
      id: 'eu',
      name: '🌍 Europa',
      region: 'EMEA',
      status: 'ACTIVE',
      launchDate: 'Sept 2026',
      pricing: '€0 / €39 / Custom',
      target: '$6M ARR',
      strategy: [
        'eIDAS compliance marketing',
        'GDPR como diferencial',
        'Parcerias notariais EU',
        'Suporte multilíngue (5 idiomas)'
      ],
      marketSize: '$4.2B',
      competitors: 5,
      positionStrategy: 'Blockchain + compliance europeu'
    },
    {
      id: 'us',
      name: '🇺🇸 USA',
      region: 'Americas',
      status: 'LAUNCHING',
      launchDate: 'Oct 2026',
      pricing: '$0 / $49 / Custom',
      target: '$10M ARR',
      strategy: [
        'ESIGN Act positioning',
        'Enterprise partnerships (Microsoft, Google)',
        'Suporte em Inglês 24/7',
        'State-by-state compliance strategy'
      ],
      marketSize: '$6B',
      competitors: 6,
      positionStrategy: '10x cheaper + blockchain'
    },
    {
      id: 'mx',
      name: '🇲🇽 México',
      region: 'LATAM',
      status: 'PLANNED',
      launchDate: 'Q4 2026',
      pricing: '$0 / $39 / Custom',
      target: '$2M ARR',
      strategy: [
        'Ley de Firma Electrónica',
        'Integración Banxico',
        'Notariado digital local',
        'Suporte em Espanhol'
      ],
      marketSize: '$800M',
      competitors: 2,
      positionStrategy: 'Conforme + económico'
    }
  ];

  const selectedMarketData = markets.find(m => m.id === selectedMarket);

  const globalMetrics = [
    { label: 'Mercados Alvo', value: '4', icon: Globe },
    { label: 'TAM Total', value: '$13.5B', icon: DollarSign },
    { label: 'Target ARR', value: '$26M', icon: TrendingUp },
    { label: 'Status', value: '3 Active', icon: Zap }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <section className={`p-8 rounded-lg border-2 ${isDark ? 'bg-gradient-to-r from-orange-900/40 to-red-900/40 border-orange-700' : 'bg-gradient-to-r from-orange-100 to-red-100 border-orange-400'}`}>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold flex items-center gap-2">
              <Target className="w-10 h-10 text-orange-600" />
              🎯 Go-to-Market Regional
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Estratégia de lançamento por mercado com pricing localizado e compliance
            </p>
          </div>
        </section>

        {/* GLOBAL METRICS */}
        <div className="grid md:grid-cols-4 gap-4">
          {globalMetrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <Card key={idx} className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardContent className="pt-6 text-center">
                  <Icon className="w-6 h-6 mx-auto mb-2 text-orange-600" />
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{metric.label}</p>
                  <p className="text-2xl font-bold mt-2">{metric.value}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* MARKET SELECTOR */}
        <section>
          <h2 className="text-2xl font-bold mb-4">🗺️ Mercados por Região</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {markets.map((market) => (
              <Card
                key={market.id}
                onClick={() => setSelectedMarket(market.id)}
                className={`cursor-pointer border-2 transition-all ${
                  selectedMarket === market.id
                    ? isDark
                      ? 'bg-orange-900/40 border-orange-700'
                      : 'bg-orange-50 border-orange-500'
                    : isDark
                    ? 'bg-gray-800 border-gray-700'
                    : 'border-gray-200'
                }`}
              >
                <CardContent className="pt-4">
                  <h3 className="font-bold text-lg mb-2">{market.name}</h3>
                  <Badge className={
                    market.status === 'ACTIVE'
                      ? 'bg-green-600'
                      : market.status === 'LAUNCHING'
                      ? 'bg-blue-600'
                      : 'bg-gray-600'
                  }>
                    {market.status === 'ACTIVE' ? '✓' : market.status === 'LAUNCHING' ? '🚀' : '📅'} {market.status}
                  </Badge>
                  <p className={`text-xs mt-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{market.launchDate}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* MARKET DETAILS */}
        {selectedMarketData && (
          <section>
            <h2 className="text-2xl font-bold mb-4">📊 {selectedMarketData.name} - Detalhes</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle>Mercado & Competição</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold mb-1">TAM (Total Addressable Market)</p>
                    <p className="text-2xl font-bold text-orange-600">{selectedMarketData.marketSize}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1">Competidores Diretos</p>
                    <p className="text-2xl font-bold">{selectedMarketData.competitors}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <p className="text-xs font-semibold">Posicionamento</p>
                    <p className="font-bold mt-2">{selectedMarketData.positionStrategy}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle>Pricing & Revenue</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold mb-2">Preços Localizados</p>
                    <p className="font-bold text-lg">{selectedMarketData.pricing}</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold mb-1">Target ARR</p>
                    <p className="text-2xl font-bold text-green-600">{selectedMarketData.target}</p>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-semibold">Progresso Launch</span>
                      <span className="text-xs font-bold">60%</span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                </CardContent>
              </Card>

              <Card className={`md:col-span-2 ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
                <CardHeader>
                  <CardTitle>Go-to-Market Strategy</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                    {selectedMarketData.strategy.map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-600 rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* LAUNCH TIMELINE */}
        <Card className={`${isDark ? 'bg-gradient-to-r from-orange-900/40 to-yellow-900/40 border-orange-700' : 'bg-gradient-to-r from-orange-100 to-yellow-100 border-orange-400'} border-2`}>
          <CardContent className="pt-8 space-y-4">
            <h3 className="text-2xl font-bold">📅 Timeline de Launches</h3>
            <div className="space-y-3">
              {[
                { period: 'Aug 2026', market: 'Brasil', status: 'ACTIVE' },
                { period: 'Sept 2026', market: 'Europa', status: 'ACTIVE' },
                { period: 'Oct 2026', market: 'USA', status: 'LAUNCHING' },
                { period: 'Q4 2026', market: 'México', status: 'PLANNED' }
              ].map((launch, idx) => (
                <div key={idx} className={`p-3 rounded-lg flex justify-between items-center ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <span className="font-bold">{launch.period} → {launch.market}</span>
                  <Badge className={
                    launch.status === 'ACTIVE'
                      ? 'bg-green-600'
                      : launch.status === 'LAUNCHING'
                      ? 'bg-blue-600'
                      : 'bg-gray-600'
                  }>
                    {launch.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}