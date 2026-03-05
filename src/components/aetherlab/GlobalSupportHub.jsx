import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MessageCircle, Mail, Phone, Clock, Globe, Zap, Users } from 'lucide-react';
import { useI18n, LanguageSelector } from '@/components/i18nManager';

export default function GlobalSupportHub() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('chat');
  const [selectedRegion, setSelectedRegion] = useState('global');

  const supportChannels = [
    {
      id: 'chat',
      name: '💬 Live Chat',
      icon: MessageCircle,
      status: '24/7 Online',
      avgResponse: '2 min',
      languages: 5,
      availability: true
    },
    {
      id: 'email',
      name: '📧 Email Support',
      icon: Mail,
      status: '24/7 Response',
      avgResponse: '1 hour',
      languages: 5,
      availability: true
    },
    {
      id: 'phone',
      name: '☎️ Phone Support',
      icon: Phone,
      status: 'Business Hours',
      avgResponse: '5 min',
      languages: 5,
      availability: true
    }
  ];

  const regions = [
    {
      code: 'global',
      name: '🌍 Global',
      timezone: 'UTC',
      status: '24/7',
      team: 'Multi-regional'
    },
    {
      code: 'br',
      name: '🇧🇷 Brasil',
      timezone: 'BRT (GMT-3)',
      status: '24/7',
      team: 'São Paulo + Rio'
    },
    {
      code: 'eu',
      name: '🌍 Europa',
      timezone: 'CET (GMT+1)',
      status: '24/7',
      team: 'Dublin + Frankfurt'
    },
    {
      code: 'us',
      name: '🇺🇸 USA',
      timezone: 'EST (GMT-5)',
      status: '24/7',
      team: 'New York + San Francisco'
    }
  ];

  const helpCategories = [
    { icon: '⚙️', title: 'Primeiros Passos', count: 12 },
    { icon: '🔗', title: 'Blockchain & Assinatura', count: 24 },
    { icon: '⚖️', title: 'Conformidade Legal', count: 18 },
    { icon: '🔐', title: 'Segurança & Privacidade', count: 15 },
    { icon: '🌐', title: 'API & Integrações', count: 21 },
    { icon: '💰', title: 'Billing & Planos', count: 10 }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <section className={`p-8 rounded-lg border-2 ${isDark ? 'bg-gradient-to-r from-green-900/40 to-emerald-900/40 border-green-700' : 'bg-gradient-to-r from-green-100 to-emerald-100 border-green-400'}`}>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-4xl font-bold flex items-center gap-2">
                  <Globe className="w-10 h-10 text-green-600" />
                  🌍 Global Support Hub
                </h1>
                <p className={`text-lg mt-2 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  Suporte 24/7 em 5 idiomas para clientes globais
                </p>
              </div>
              <div className="flex gap-2">
                <Badge className="bg-green-600">✓ 24/7 ONLINE</Badge>
              </div>
            </div>
            <div className="mt-6">
              <p className="font-semibold mb-3">Selecione idioma:</p>
              <LanguageSelector />
            </div>
          </div>
        </section>

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-green-600">24/7</p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Disponibilidade</p>
            </CardContent>
          </Card>
          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-blue-600">5</p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Idiomas</p>
            </CardContent>
          </Card>
          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-purple-600">4</p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Regiões</p>
            </CardContent>
          </Card>
          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="pt-6 text-center">
              <p className="text-3xl font-bold text-orange-600">2min</p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Tempo Médio</p>
            </CardContent>
          </Card>
        </div>

        {/* REGION SELECTOR */}
        <section>
          <h2 className="text-2xl font-bold mb-4">🌐 Suporte por Região</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {regions.map((region) => (
              <Card
                key={region.code}
                onClick={() => setSelectedRegion(region.code)}
                className={`cursor-pointer border-2 transition-all ${
                  selectedRegion === region.code
                    ? isDark
                      ? 'bg-blue-900/40 border-blue-700'
                      : 'bg-blue-50 border-blue-500'
                    : isDark
                    ? 'bg-gray-800 border-gray-700 hover:border-blue-600'
                    : 'border-gray-200 hover:border-blue-400'
                }`}
              >
                <CardContent className="pt-4">
                  <h3 className="font-bold text-lg mb-2">{region.name}</h3>
                  <div className={`space-y-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    <p>🕐 {region.timezone}</p>
                    <p className="font-semibold text-green-600">✓ {region.status}</p>
                    <p>👥 {region.team}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* SUPPORT CHANNELS */}
        <section>
          <h2 className="text-2xl font-bold mb-4">📞 Canais de Suporte</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {supportChannels.map((channel) => {
              const Icon = channel.icon;
              return (
                <Card key={channel.id} className={`${isDark ? 'bg-gray-800 border-gray-700' : 'border-gray-200'} border-2`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Icon className="w-5 h-5" />
                      {channel.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">{channel.status}</span>
                    </div>
                    <div className={`p-3 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Tempo Médio</p>
                      <p className="font-bold">{channel.avgResponse}</p>
                    </div>
                    <Badge className="bg-blue-600">{channel.languages} idiomas</Badge>
                    <Button className="w-full" variant="outline">Iniciar</Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* HELP CENTER */}
        <section>
          <h2 className="text-2xl font-bold mb-4">📚 Help Center</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {helpCategories.map((category, idx) => (
              <Card key={idx} className={`${isDark ? 'bg-gray-800 border-gray-700 hover:border-blue-600' : 'border-gray-200 hover:border-blue-400'} border-2 cursor-pointer transition-colors`}>
                <CardContent className="pt-6">
                  <p className="text-4xl mb-3">{category.icon}</p>
                  <h3 className="font-bold text-lg mb-2">{category.title}</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {category.count} artigos
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* QUICK CONTACT */}
        <Card className={`${isDark ? 'bg-gradient-to-r from-purple-900/40 to-blue-900/40 border-purple-700' : 'bg-gradient-to-r from-purple-100 to-blue-100 border-purple-400'} border-2`}>
          <CardContent className="pt-8">
            <h3 className="text-2xl font-bold mb-4">✉️ Fale Conosco Agora</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <Input placeholder="Seu nome" className={isDark ? 'bg-gray-800 border-gray-700' : ''} />
              <Input placeholder="Seu email" type="email" className={isDark ? 'bg-gray-800 border-gray-700' : ''} />
              <textarea
                placeholder="Sua mensagem"
                className={`col-span-2 p-3 rounded-lg ${isDark ? 'bg-gray-800 border border-gray-700 text-white' : 'border border-gray-300'}`}
                rows="4"
              />
              <Button className="col-span-2 bg-blue-600 hover:bg-blue-700">Enviar Mensagem</Button>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}