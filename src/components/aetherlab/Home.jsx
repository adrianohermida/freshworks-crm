import React from 'react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Check, Shield, Zap, Lock, Globe, Lock as LockIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { LanguageSelector } from '@/components/i18nManager';

export default function Home() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#081828]' : 'bg-[#f4f7fa]'}`} style={{ fontFamily: 'Arial, sans-serif' }}>
      
      {/* HERO */}
      <section className={`relative overflow-hidden ${isDark ? 'bg-[#081828]' : 'bg-[#f4f7fa]'}`}>
        {/* Decorative shapes removed - no gradients */}
        
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="space-y-8">
            {/* Language Selector */}
            



            {/* Badge */}
            <div className="flex justify-center">
              <Badge variant="outline" className={`${isDark ? 'border-[#7e57ff] text-[#7e57ff]' : 'border-[#7e57ff] text-[#7e57ff]'} flex items-center gap-2`}>
                <Lock className="w-4 h-4" /> Assinatura Digital Blockchain
              </Badge>
            </div>

            {/* Headline */}
            <div className="text-center space-y-4">
              <h1 className={`text-5xl sm:text-6xl font-black tracking-tight ${isDark ? 'text-white' : 'text-[#081828]'}`} style={{ fontFamily: 'Arial, sans-serif', fontWeight: 'bold' }}>
                Assine documentos com
                <span className="text-[#7e57ff]"> blockchain</span>
              </h1>
              <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-[#081828]/70'}`}>
                Conforme Lei 14.063/2020. Válido em qualquer tribunal. Zero intermediários.
              </p>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={createPageUrl('BlockchainRegistry')}>
                <Button className="bg-[#7e57ff] hover:bg-[#6a4ad1] text-white px-8 h-12 text-base w-full sm:w-auto font-semibold transition">
                  Começar Agora <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <Link to={createPageUrl('Pricing')}>
                <Button variant="outline" className={`px-8 h-12 text-base font-semibold transition hover:bg-[#7e57ff] hover:text-white ${isDark ? 'border-[#7e57ff] text-[#7e57ff]' : 'border-[#7e57ff] text-[#7e57ff] bg-white hover:border-[#7e57ff]'} w-full sm:w-auto`}>
                  Ver Planos
                </Button>
              </Link>
            </div>

            {/* Social Proof */}
            <div className={`flex items-center justify-center gap-3 text-sm ${isDark ? 'text-gray-400' : 'text-[#081828]/60'}`}>
              <div className="flex -space-x-2">
                {[1, 2, 3].map((i) =>
                <div key={i} className={`w-8 h-8 rounded-full ${isDark ? 'bg-gray-800' : 'bg-gray-200'} border ${isDark ? 'border-gray-700' : 'border-gray-300'}`} />
                )}
              </div>
              <span>+500 documentos assinados</span>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t ${isDark ? 'border-[#7e57ff]/20' : 'border-[#7e57ff]/10'}`}>
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {[
          { icon: Shield, title: 'Segurança Máxima', desc: 'Blockchain imutável + ICP-Brasil certificado' },
          { icon: Zap, title: 'Instantâneo', desc: 'Assine e registre em segundos' },
          { icon: Lock, title: 'Privado', desc: 'Sem intermediários, dados sob seu controle' },
          { icon: Globe, title: 'Global', desc: 'Válido em Brasil, Europa e USA' },
          { icon: Check, title: 'Legal', desc: 'Lei 14.063/2020 - GDPR - ESIGN' },
          { icon: Shield, title: 'Transparente', desc: 'Verifique qualquer documento sem login' }].
          map((feature, idx) => {
            const Icon = feature.icon;
            return (
              <Card key={idx} className={`border transition-all hover:shadow-lg ${isDark ? 'bg-[#0f1f2e] border-[#7e57ff]/20 hover:border-[#7e57ff]' : 'bg-white border-[#7e57ff]/20 hover:border-[#7e57ff]'}`}>
                <CardContent className="p-6 space-y-3">
                  <Icon className="w-6 h-6 text-[#7e57ff]" />
                  <div>
                    <h3 className="font-semibold text-base" style={{ fontFamily: 'Arial, sans-serif' }}>{feature.title}</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{feature.desc}</p>
                  </div>
                </CardContent>
              </Card>);

          })}
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t ${isDark ? 'border-[#7e57ff]/20' : 'border-[#7e57ff]/10'}`}>
        <div className="text-center mb-12">
          <h2 className={`text-3xl font-bold mb-3 ${isDark ? 'text-white' : 'text-[#081828]'}`} style={{ fontFamily: 'Arial, sans-serif' }}>Planos para todos</h2>
          <p className={isDark ? 'text-gray-400' : 'text-[#081828]/70'}>Escolha o que melhor se encaixa</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
          { name: 'Starter', price: 'Grátis', features: ['5 documentos/mês', 'Assinatura simples', 'Suporte email'] },
          { name: 'Pro', price: 'R$ 49/mês', highlight: true, features: ['Ilimitado', 'Multi-assinante', 'Fluxo customizado', 'Suporte prioritário'] },
          { name: 'Enterprise', price: 'Custom', features: ['Tudo do Pro', 'SLA 99,99%', 'Gestor dedicado', 'Integrações customizadas'] }].
          map((plan, idx) =>
          <Card
            key={idx}
            className={`border-2 transition-all ${
            plan.highlight ?
            `bg-white border-[#7e57ff] shadow-lg` :
            `border border-[#e5e5e5] bg-white hover:border-[#7e57ff]`}`
            }>

              <CardContent className="p-8 space-y-6">
                <div>
                  <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'Arial, sans-serif' }}>{plan.name}</h3>
                  <p className={`text-3xl font-bold mb-1 ${plan.highlight ? 'text-[#7e57ff]' : ''}`}>{plan.price}</p>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((f, i) =>
                <li key={i} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                )}
                </ul>
                <Button
                className={`w-full font-semibold transition ${
                plan.highlight ?
                'bg-[#7e57ff] text-white hover:bg-[#6a4ad1]' :
                'text-[#7e57ff] border border-[#7e57ff] bg-white hover:bg-[#f4f7fa]'}`
                }
                variant={plan.highlight ? 'default' : 'outline'}>

                  {plan.name === 'Starter' ? 'Começar Grátis' : 'Assinar Agora'}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </section>

      {/* CTA FINAL */}
      <section className={`max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center border-t ${isDark ? 'border-[#7e57ff]/20' : 'border-[#7e57ff]/10'}`}>
        <h2 className={`text-3xl font-bold mb-4 ${isDark ? 'text-white' : 'text-[#081828]'}`} style={{ fontFamily: 'Arial, sans-serif' }}>Pronto para começar?</h2>
        <p className={`text-lg mb-8 ${isDark ? 'text-gray-300' : 'text-[#081828]/70'}`}>
          Assine seu primeiro documento em menos de 2 minutos
        </p>
        <Link to={createPageUrl('BlockchainRegistry')}>
          <Button className="bg-[#7e57ff] hover:bg-[#6a4ad1] text-white px-8 h-12 text-base font-semibold transition">
            Começar Agora <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </section>

      {/* FOOTER */}
      <footer className={`border-t-2 border-[#7e57ff] ${isDark ? 'bg-[#081828]' : 'bg-[#f4f7fa]'}`}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <p className={isDark ? 'text-gray-400' : 'text-[#081828]/70'}>
            © 2026 LegalChain. Assinatura digital em blockchain, conforme Lei 14.063/2020.
          </p>
          <a
            href="https://aetherlab.com.br"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-[#7e57ff] hover:text-[#6b4cc9] transition-colors font-semibold" style={{ fontFamily: 'Arial, sans-serif' }}>

            <span>Desenvolvido por</span>
            <span className="font-bold">Aetherlab Tecnologia Ltda</span>
          </a>
        </div>
      </footer>
    </div>);

}