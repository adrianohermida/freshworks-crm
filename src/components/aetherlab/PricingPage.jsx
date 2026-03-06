import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';

export default function PricingPage() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const [billingPeriod, setBillingPeriod] = useState('monthly');

  const plans = [
    {
      name: 'Starter',
      price: 0,
      yearlyPrice: 0,
      description: 'Para teste e uso leve',
      cta: 'Começar Grátis',
      highlight: false,
      features: [
        { name: 'Documentos/mês', value: '5' },
        { name: 'Assinadores', value: '1' },
        { name: 'Validade blockchain', value: '✓' },
        { name: 'ICP-Brasil', value: '✓' },
        { name: 'Fluxo customizado', value: '✗' },
        { name: 'Suporte', value: 'Email' },
        { name: 'API', value: '✗' }
      ]
    },
    {
      name: 'Professional',
      price: 49,
      yearlyPrice: 490,
      description: 'Para profissionais e pequenas empresas',
      cta: 'Começar Agora',
      highlight: true,
      features: [
        { name: 'Documentos/mês', value: 'Ilimitado' },
        { name: 'Assinadores', value: 'Ilimitado' },
        { name: 'Validade blockchain', value: '✓' },
        { name: 'ICP-Brasil', value: '✓' },
        { name: 'Fluxo customizado', value: '✓' },
        { name: 'Suporte', value: 'Prioritário' },
        { name: 'API', value: '✓' }
      ]
    },
    {
      name: 'Enterprise',
      price: null,
      yearlyPrice: null,
      description: 'Para grandes organizações',
      cta: 'Contato Vendas',
      highlight: false,
      features: [
        { name: 'Documentos/mês', value: 'Customizado' },
        { name: 'Assinadores', value: 'Customizado' },
        { name: 'Validade blockchain', value: '✓' },
        { name: 'ICP-Brasil', value: '✓' },
        { name: 'Fluxo customizado', value: '✓' },
        { name: 'Suporte', value: '24/7 Dedicado' },
        { name: 'API', value: '✓ Customizada' }
      ]
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
      {/* HEADER */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Preços simples e transparentes</h1>
        <p className={`text-lg mb-8 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          Sem surpresas. Cancele quando quiser.
        </p>

        {/* BILLING TOGGLE */}
        <div className={`inline-flex items-center gap-2 p-1 rounded-lg ${isDark ? 'bg-gray-900 border border-gray-800' : 'bg-gray-100 border border-gray-300'}`}>
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-4 py-2 rounded transition ${
              billingPeriod === 'monthly'
                ? 'bg-white dark:bg-gray-800 font-semibold'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Mensal
          </button>
          <button
            onClick={() => setBillingPeriod('yearly')}
            className={`px-4 py-2 rounded transition ${
              billingPeriod === 'yearly'
                ? 'bg-white dark:bg-gray-800 font-semibold'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            Anual
            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded">-20%</span>
          </button>
        </div>
      </section>

      {/* PRICING CARDS */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`border-2 transition ${
                plan.highlight
                  ? `bg-gradient-to-b ${isDark ? 'from-gray-800 to-gray-900 border-orange-500' : 'from-orange-50 to-white border-orange-500'} md:scale-105`
                  : `border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`
              }`}
            >
              <CardContent className="p-8 space-y-6">
                {/* NAME */}
                <div>
                  {plan.highlight && (
                    <Badge className="bg-orange-500 text-white mb-3">Mais popular</Badge>
                  )}
                  <h3 className="text-2xl font-bold mb-1">{plan.name}</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    {plan.description}
                  </p>
                </div>

                {/* PRICE */}
                <div>
                  {plan.price !== null ? (
                    <>
                      <div className="text-4xl font-bold mb-1">
                        R$ {billingPeriod === 'monthly' ? plan.price : plan.yearlyPrice}
                      </div>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        {billingPeriod === 'monthly' ? 'por mês' : 'por ano'}
                      </p>
                    </>
                  ) : (
                    <div className="text-4xl font-bold">Custom</div>
                  )}
                </div>

                {/* CTA */}
                <Button
                  className={`w-full h-10 ${
                    plan.highlight
                      ? 'bg-gradient-to-r from-orange-500 to-purple-600 text-white hover:opacity-90'
                      : 'border'
                  }`}
                  variant={plan.highlight ? 'default' : 'outline'}
                >
                  {plan.cta}
                </Button>

                {/* FEATURES */}
                <div className="space-y-3">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm">
                      {feature.value === '✓' ? (
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : feature.value === '✗' ? (
                        <X className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      ) : (
                        <span className="w-5 h-5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{feature.name}</span>
                        <span className={`ml-auto block text-right font-medium ${
                          feature.value === '✓' ? 'text-green-600' : feature.value === '✗' ? 'text-gray-400' : ''
                        }`}>
                          {typeof feature.value === 'string' && feature.value !== '✓' && feature.value !== '✗'
                            ? feature.value
                            : ''}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-gray-200 dark:border-gray-800">
        <h2 className="text-3xl font-bold mb-12 text-center">Perguntas frequentes</h2>
        
        <div className="space-y-6">
          {[
            { q: 'Posso cancelar quando quiser?', a: 'Sim, sem taxas. Cancele a qualquer momento na sua conta.' },
            { q: 'Qual a diferença entre planos?', a: 'Starter é grátis para teste. Pro para profissionais. Enterprise para corporações com necessidades customizadas.' },
            { q: 'Os documentos são realmente válidos em tribunal?', a: 'Sim, Lei 14.063/2020 + ICP-Brasil certificado = força probante total em qualquer tribunal brasileiro.' },
            { q: 'Há limite de documentos?', a: 'Starter tem 5/mês. Pro e Enterprise ilimitado.' }
          ].map((item, idx) => (
            <div key={idx} className={`p-6 rounded-lg border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
              <h3 className="font-semibold mb-2">{item.q}</h3>
              <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`border-t ${isDark ? 'border-gray-800 bg-gray-900/50' : 'border-gray-200 bg-gray-50'}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm">
          <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>
            © 2026 DocuChain. Assinatura digital em blockchain.
          </p>
        </div>
      </footer>
    </div>
  );
}