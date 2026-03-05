import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, X, Zap, Lock, Globe, Briefcase, TrendingUp, Shield, Layers } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

export default function LandingPagePremium() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const [selectedPlan, setSelectedPlan] = useState('professional');

  // Fetch pricing plans from API
  const { data: plansData = [] } = useQuery({
    queryKey: ['pricingPlans'],
    queryFn: () => base44.entities.Plano.list()
  });

  const competitors = [
    { name: 'DocuChain', logo: '⚡', color: 'purple', unique: true },
    { name: 'Docusing', logo: '📄' },
    { name: 'SignEasy', logo: '✍️' },
    { name: 'PandaDoc', logo: '🐼' },
    { name: 'AdobeSign', logo: '📋' }
  ];

  const features = [
    {
      name: 'Blockchain Pública Verificável',
      docuchain: true,
      docusing: false,
      signeasy: false,
      pandadoc: false,
      adobesign: false,
      icon: '⛓️',
      highlight: 'Diferencial Único'
    },
    {
      name: 'Verificação Sem Login',
      docuchain: true,
      docusing: false,
      signeasy: false,
      pandadoc: false,
      adobesign: false,
      icon: '🔓',
      highlight: 'Bloqueador'
    },
    {
      name: 'Cadeia de Custódia Legal',
      docuchain: true,
      docusing: false,
      signeasy: false,
      pandadoc: false,
      adobesign: false,
      icon: '⚖️',
      highlight: 'Exclusive'
    },
    {
      name: 'Lei 14.063/2020 Compliant',
      docuchain: true,
      docusing: false,
      signeasy: false,
      pandadoc: false,
      adobesign: false,
      icon: '🇧🇷',
      highlight: 'Brazil First'
    },
    {
      name: 'Assinatura Digital ICP-Brasil',
      docuchain: true,
      docusing: true,
      signeasy: false,
      pandadoc: false,
      adobesign: false
    },
    {
      name: 'Templates Customizáveis',
      docuchain: true,
      docusing: true,
      signeasy: true,
      pandadoc: true,
      adobesign: true
    },
    {
      name: 'Fluxo de Aprovação Multi-nível',
      docuchain: true,
      docusing: true,
      signeasy: true,
      pandadoc: true,
      adobesign: true
    },
    {
      name: 'Notificação Eletrônica',
      docuchain: true,
      docusing: true,
      signeasy: true,
      pandadoc: true,
      adobesign: true
    },
    {
      name: 'Integração com Processos Judiciais',
      docuchain: true,
      docusing: false,
      signeasy: false,
      pandadoc: false,
      adobesign: false,
      highlight: 'Exclusive'
    },
    {
      name: 'API REST Completa',
      docuchain: true,
      docusing: true,
      signeasy: false,
      pandadoc: true,
      adobesign: true
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
      {/* HERO SECTION */}
      <section className={`py-20 px-6 ${isDark ? 'bg-gradient-to-b from-purple-900/30 to-transparent' : 'bg-gradient-to-b from-purple-100 to-white'}`}>
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <div className="inline-block">
            <Badge className="bg-purple-600 text-white px-4 py-2">
              🚀 Líder em Blockchain + Assinatura Digital
            </Badge>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold">
            Documentos com <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">Blockchain Pública</span>
          </h1>
          <p className={`text-xl max-w-3xl mx-auto ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Verificação sem login • Cadeia de custódia legal • Conformidade Lei 14.063 • A escolha dos profissionais de direito
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button size="lg" className="bg-purple-600 hover:bg-purple-700">
              Começar Agora
            </Button>
            <Button size="lg" variant="outline">
              Ver Demo
            </Button>
          </div>
        </div>
      </section>

      {/* DIFERENCIAL ÚNICO */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">O Que Nos Diferencia</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: '⛓️',
              title: 'Blockchain Verificável',
              desc: 'Qualquer pessoa verifica documentos sem login. Concorrentes não têm isso.'
            },
            {
              icon: '🔓',
              title: 'Acesso Público',
              desc: 'URL compartilhável /verify/[hash] — o bloqueador para Docusing, PandaDoc, AdobeSign'
            },
            {
              icon: '⚖️',
              title: 'Cadeia de Custódia Legal',
              desc: 'Timeline completa + certificado digital = aprovado para tribunais brasileiros'
            }
          ].map((item, idx) => (
            <Card key={idx} className={isDark ? 'bg-gray-800 border-gray-700' : 'border-gray-300'}>
              <CardContent className="pt-6 text-center space-y-3">
                <div className="text-4xl">{item.icon}</div>
                <h3 className="font-bold text-lg">{item.title}</h3>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* COMPARAÇÃO COMPETITIVA */}
      <section className={`py-16 px-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Análise Competitiva — DocuChain vs Concorrentes</h2>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
              Comparação detalhada de funcionalidades essenciais
            </p>
          </div>

          {/* Table */}
          <div className={`rounded-lg overflow-hidden border ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={isDark ? 'bg-gray-800' : 'bg-gray-200'}>
                    <th className={`text-left p-4 font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      Funcionalidade
                    </th>
                    {competitors.map((comp) => (
                      <th key={comp.name} className={`text-center p-4 font-bold ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        <div className="flex flex-col items-center gap-2">
                          <span className="text-2xl">{comp.logo}</span>
                          <span className={comp.unique ? 'text-purple-600' : ''}>{comp.name}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {features.map((feature, idx) => (
                    <tr key={idx} className={`border-t ${isDark ? 'border-gray-700' : 'border-gray-300'} ${feature.highlight ? (isDark ? 'bg-purple-900/20' : 'bg-purple-50') : ''}`}>
                      <td className={`p-4 font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                        <div className="flex items-center gap-2">
                          {feature.icon && <span>{feature.icon}</span>}
                          {feature.name}
                          {feature.highlight && (
                            <Badge className={feature.highlight === 'Bloqueador' ? 'bg-red-600' : 'bg-purple-600'} size="sm">
                              {feature.highlight}
                            </Badge>
                          )}
                        </div>
                      </td>
                      {competitors.map((comp) => {
                        const key = comp.name.toLowerCase().replace(/[- ]/g, '');
                        const hasFeature = feature[key];
                        return (
                          <td key={comp.name} className="text-center p-4">
                            {hasFeature ? (
                              <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-gray-400 mx-auto" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Key Takeaway */}
          <Card className={`border-2 ${isDark ? 'bg-purple-900/20 border-purple-700' : 'bg-purple-50 border-purple-400'}`}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <Zap className="w-6 h-6 text-purple-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold mb-2">🎯 Por Que Escolher DocuChain?</h4>
                  <ul className={`space-y-1 text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                    <li>✅ <strong>Blockchain pública sem login</strong> — Diferencial que nenhum concorrente tem</li>
                    <li>✅ <strong>Compatível com Lei 14.063</strong> — Desenvolvido para mercado brasileiro</li>
                    <li>✅ <strong>Cadeia de custódia legal</strong> — Aceito em tribunais</li>
                    <li>✅ <strong>Integração com processos judiciais</strong> — Único com essa capacidade</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* PRICING */}
      <section className="py-16 px-6 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">Planos Simples e Transparentes</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {plansData.map((plan) => (
            <Card 
              key={plan.name} 
              className={`transition ${plan.popular ? (isDark ? 'bg-purple-900/30 border-purple-600 scale-105' : 'bg-purple-50 border-purple-400 scale-105') : (isDark ? 'bg-gray-800 border-gray-700' : '')}`}
            >
              <CardHeader>
                <CardTitle>{plan.nomePlano}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">
                  {plan.custom ? 'Custom' : `R$ ${plan.precoMensal}`}
                  {!plan.custom && <span className="text-sm">/mês</span>}
                </div>
                <ul className="space-y-2 text-sm">
                  {(plan.features || []).map((f, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className={plan.popular ? 'bg-purple-600 hover:bg-purple-700 w-full' : 'w-full'} variant={plan.popular ? 'default' : 'outline'}>
                  {plan.custom ? 'Falar com Time' : 'Começar'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className={`py-16 px-6 ${isDark ? 'bg-gradient-to-r from-purple-900/30 to-blue-900/30' : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'}`}>
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold">Pronto Para Revolucionar Sua Assinatura Digital?</h2>
          <p className={isDark ? 'text-gray-300' : 'text-white/90'}>
            Junte-se aos líderes do mercado que já confiam em DocuChain
          </p>
          <Link to={createPageUrl('BlockchainRegistry')}>
            <Button size="lg" className={isDark ? 'bg-white text-purple-600 hover:bg-gray-100' : ''}>
              Comece Grátis Agora
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}