import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import { useI18n, LanguageSelector } from '@/components/i18nManager';

export default function Pricing() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const [billingPeriod, setBillingPeriod] = useState('monthly');
  const { t } = useI18n();

  // Fetch pricing plans from API
  const { data: plans = [] } = useQuery({
    queryKey: ['pricingPlans'],
    queryFn: () => base44.entities.Plano.list()
  });

  return (
    <div className={`min-h-screen transition-colors ${isDark ? 'bg-[#081828]' : 'bg-[#f4f7fa]'} py-20 px-4`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <LanguageSelector />
          </div>
          <h1 className={`text-4xl font-bold mb-6 ${isDark ? 'text-white' : 'text-[#081828]'}`}>Planos Simples e Transparentes</h1>
           <p className={`text-lg mb-8 ${isDark ? 'text-gray-400' : 'text-[#081828]/70'}`}>
             Escolha o plano ideal para suas necessidades de assinatura digital
           </p>

           {/* Billing Toggle */}
           <div className={`inline-flex rounded-lg p-1 ${isDark ? 'bg-[#0f1f2e]' : 'bg-white border border-[#7e57ff]/20'}`}>
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-6 py-2 rounded-md font-semibold transition ${
                billingPeriod === 'monthly'
                  ? 'bg-[#7e57ff] text-white'
                  : isDark ? 'text-gray-400' : 'text-[#081828]/70'
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`px-6 py-2 rounded-md font-semibold transition ${
                billingPeriod === 'yearly'
                  ? 'bg-[#7e57ff] text-white'
                  : isDark ? 'text-gray-400' : 'text-[#081828]/70'
              }`}
            >
              Anual (20% off)
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.length > 0 ? plans.map((plan, idx) => (
            <div
              key={idx}
              className={`rounded-2xl transition-all duration-300 ${
                 plan.nomePlano === 'Professional'
                   ? isDark ? 'bg-gradient-to-b from-[#1a2d42] to-[#0f1f2e] border-2 border-[#7e57ff] scale-105' : 'bg-gradient-to-b from-[#f4f7fa] to-white border-2 border-[#7e57ff] scale-105'
                   : isDark ? 'bg-[#0f1f2e] border border-[#7e57ff]/20 hover:border-[#7e57ff]' : 'bg-white border border-[#7e57ff]/20 hover:border-[#7e57ff]'
               } p-8`}
            >
              {/* Badge */}
              {plan.nomePlano === 'Professional' && (
                <Badge className="mb-4 bg-[#7e57ff]">⭐ Mais Popular</Badge>
              )}

              {/* Plan Name & Price */}
              <h3 className="text-2xl font-bold mb-2">{plan.nomePlano}</h3>

              <div className="mb-8">
                {plan.precoMensal ? (
                  <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold">R${plan.precoMensal}</span>
                    <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>/mês</span>
                  </div>
                ) : (
                  <div className="text-2xl font-bold">Preço Customizado</div>
                )}
              </div>

              {/* CTA Button */}
              <Button
                className={`w-full mb-8 py-6 text-lg font-semibold ${
                  plan.nomePlano === 'Professional'
                    ? 'bg-[#7e57ff] hover:bg-purple-700 text-white'
                    : isDark ? 'bg-[#1a2d42] hover:bg-[#0f1f2e] text-[#7e57ff] border border-[#7e57ff]/30' : 'bg-gray-100 hover:bg-gray-200 text-[#7e57ff]'
                }`}
              >
                {plan.precoMensal ? 'Assinar' : 'Contato Vendas'}
              </Button>

              {/* Features List */}
              <div className="space-y-4">
                {(plan.features || []).map((feature, fidx) => (
                  <div key={fidx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )) : <p className="col-span-3 text-center text-gray-500">Carregando planos...</p>}
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className={`text-2xl font-bold text-center mb-8 ${isDark ? 'text-white' : 'text-[#081828]'}`}>Perguntas Frequentes</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Posso mudar de plano a qualquer momento?',
                a: 'Sim! Você pode fazer upgrade ou downgrade a qualquer momento. Ajustes são processados no próximo ciclo de faturamento.'
              },
              {
                q: 'Qual é a taxa por assinatura blockchain?',
                a: 'Não há taxa adicional. Todas as assinaturas incluem registro blockchain automático.'
              },
              {
                q: 'Oferecem período de teste?',
                a: 'Sim, 30 dias grátis para planos pagos. Plano Free é gratuito para sempre.'
              }
            ].map((faq, idx) => (
              <div key={idx} className={`${isDark ? 'bg-[#0f1f2e] border border-[#7e57ff]/20' : 'bg-white border border-[#7e57ff]/20'} rounded-lg p-6`}>
                <h4 className="font-semibold mb-2">{faq.q}</h4>
                <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}