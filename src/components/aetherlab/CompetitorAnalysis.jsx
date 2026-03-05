import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, X, Trophy, Zap, TrendingUp } from 'lucide-react';

export default function CompetitorAnalysis() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const [selectedMetric, setSelectedMetric] = useState('features');

  const competitors = [
    { name: 'DocuChain', logo: '⚡', color: 'purple', unique: true },
    { name: 'Docusign', logo: '📄' },
    { name: 'AdobeSign', logo: '🎨' },
    { name: 'PandaDoc', logo: '🐼' },
    { name: 'SignEasy', logo: '✍️' }
  ];

  const competitiveMatrix = {
    features: [
      { name: '⛓️ Blockchain Público', docuchain: true, others: false, highlight: 'BLOQUEADOR' },
      { name: '🔓 Verificação Sem Login', docuchain: true, others: false, highlight: 'EXCLUSIVE' },
      { name: '⚖️ Cadeia de Custódia Legal', docuchain: true, others: false, highlight: 'UNIQUE' },
      { name: '🇧🇷 Lei 14.063/2020', docuchain: true, others: false, highlight: 'BRASIL' },
      { name: '✍️ Assinatura Digital ICP', docuchain: true, others: true },
      { name: '📋 Templates Customizáveis', docuchain: true, others: true },
      { name: '🔀 Fluxo Multi-nível', docuchain: true, others: true },
      { name: '📱 Mobile App', docuchain: true, others: true },
      { name: '🌍 Multi-idioma', docuchain: true, others: true },
      { name: 'API REST Completa', docuchain: true, others: true }
    ],
    pricing: [
      { metric: 'Starter Grátis', docuchain: 'R$ 0/∞', others: 'Não', winner: 'docuchain' },
      { metric: 'Professional', docuchain: 'R$ 49/mês', others: 'R$ 300+/mês', winner: 'docuchain' },
      { metric: 'Enterprise', docuchain: 'Custom', others: 'R$ 1000+/mês', winner: 'docuchain' },
      { metric: 'Documentos', docuchain: 'Ilimitados', others: 'Limitados', winner: 'docuchain' }
    ],
    support: [
      { metric: 'Suporte 24/7', docuchain: '✅', others: '❌' },
      { metric: 'Onboarding', docuchain: 'Dedicado', others: 'Self-service' },
      { metric: 'SLA 99.99%', docuchain: '✅ Garantido', others: 'Limitado' },
      { metric: 'Compliance Audit', docuchain: 'Anual', others: 'Sob demanda' }
    ]
  };

  const marketPosition = [
    {
      title: 'Blockchain + Assinatura',
      desc: 'Único com blockchain público verificável',
      advantage: 'DOCUCHAIN MONOPOLY'
    },
    {
      title: 'Conformidade Brasil',
      desc: 'Lei 14.063 + ICP-Brasil nativo',
      advantage: 'MARKET LEADER'
    },
    {
      title: 'Preço',
      desc: '10x mais barato que concorrentes',
      advantage: 'DOMINADOR'
    },
    {
      title: 'Acessibilidade',
      desc: 'Sem login para verificação',
      advantage: 'DIFERENCIAL ÚNICO'
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-red-600/10 rounded-2xl blur-3xl" />
          <div className="relative text-center space-y-3 py-8">
            <Trophy className="w-12 h-12 mx-auto text-yellow-500" />
            <h1 className="text-5xl font-black">Análise Competitiva</h1>
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              DocuChain vs Docusign, AdobeSign, PandaDoc, SignEasy
            </p>
            <Badge className="mx-auto bg-yellow-600 px-4 py-2 mt-4">
              🏆 Líder em 4 categorias críticas
            </Badge>
          </div>
        </section>

        {/* TABS */}
        <div className="flex gap-2 flex-wrap justify-center">
          {['features', 'pricing', 'support'].map((tab) => (
            <Button
              key={tab}
              onClick={() => setSelectedMetric(tab)}
              className={`${
                selectedMetric === tab
                  ? 'bg-purple-600 hover:bg-purple-700'
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {tab === 'features' && '⚡ Funcionalidades'}
              {tab === 'pricing' && '💰 Preços'}
              {tab === 'support' && '🤝 Suporte'}
            </Button>
          ))}
        </div>

        {/* COMPARISON TABLE */}
        <Card className={isDark ? 'bg-gray-800 border-gray-700' : 'border-gray-300'}>
          <CardHeader>
            <CardTitle>
              {selectedMetric === 'features' && '⚡ Comparação de Funcionalidades'}
              {selectedMetric === 'pricing' && '💰 Análise de Preços'}
              {selectedMetric === 'support' && '🤝 Qualidade de Suporte'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className={`border-b-2 ${isDark ? 'border-gray-700' : 'border-gray-300'}`}>
                    <th className="text-left p-3 font-bold">{selectedMetric === 'features' ? 'Feature' : 'Métrica'}</th>
                    {competitors.map((comp) => (
                      <th key={comp.name} className="text-center p-3 font-bold">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-2xl">{comp.logo}</span>
                          <span className={comp.unique ? 'text-purple-600 font-black' : ''}>{comp.name}</span>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {competitiveMatrix[selectedMetric]?.map((row, idx) => (
                    <tr
                      key={idx}
                      className={`border-b ${
                        isDark ? 'border-gray-700' : 'border-gray-200'
                      } ${row.highlight ? (isDark ? 'bg-purple-900/20' : 'bg-purple-50') : ''}`}
                    >
                      <td className="p-3 font-semibold">
                        <div className="flex items-center gap-2">
                          {row.name || row.metric}
                          {row.highlight && (
                            <Badge className={
                              row.highlight === 'BLOQUEADOR'
                                ? 'bg-red-600'
                                : row.highlight === 'EXCLUSIVE'
                                ? 'bg-blue-600'
                                : 'bg-purple-600'
                            }>
                              {row.highlight}
                            </Badge>
                          )}
                        </div>
                      </td>
                      {competitors.map((comp, compIdx) => {
                        if (selectedMetric === 'features') {
                          const hasFeature = compIdx === 0 ? row.docuchain : row.others;
                          return (
                            <td key={comp.name} className="text-center p-3">
                              {hasFeature ? (
                                <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto" />
                              ) : (
                                <X className="w-5 h-5 text-gray-400 mx-auto" />
                              )}
                            </td>
                          );
                        } else {
                          const value = compIdx === 0 ? row.docuchain : row.others || 'N/A';
                          return (
                            <td key={comp.name} className="text-center p-3">
                              <span className={row.winner === 'docuchain' && compIdx === 0 ? 'font-bold text-green-600' : ''}>
                                {value}
                              </span>
                            </td>
                          );
                        }
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* MARKET POSITION */}
        <section>
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <Zap className="w-8 h-8 text-yellow-500" />
            Posicionamento de Mercado
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {marketPosition.map((pos, idx) => (
              <Card key={idx} className={`border-2 ${isDark ? 'bg-yellow-900/20 border-yellow-700' : 'bg-yellow-50 border-yellow-400'}`}>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{pos.title}</h3>
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{pos.desc}</p>
                    <Badge className="bg-yellow-600 mt-3">{pos.advantage}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* KEY INSIGHTS */}
        <Card className={`${isDark ? 'bg-gradient-to-r from-purple-900/30 to-blue-900/30 border-purple-700' : 'bg-gradient-to-r from-purple-100 to-blue-100 border-purple-400'} border-2`}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-6 h-6" />
              🎯 Conclusão Estratégica
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="font-bold text-lg mb-2">Por que DocuChain vence:</p>
              <ul className={`space-y-2 ml-4 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                <li>✅ <strong>Blockchain público sem login</strong> — Nenhum concorrente tem isso</li>
                <li>✅ <strong>10x mais barato</strong> — Starter grátis, Pro R$ 49 vs Docusign R$ 300+</li>
                <li>✅ <strong>Lei 14.063 nativo</strong> — Desenvolvido para mercado legal brasileiro</li>
                <li>✅ <strong>Cadeia de custódia legal rastreável</strong> — Válido em qualquer tribunal</li>
              </ul>
            </div>
            <div className={`p-4 rounded-lg ${isDark ? 'bg-purple-900/40' : 'bg-purple-200'}`}>
              <p className="font-bold">🏆 RESULTADO: DocuChain é INCOMPARÁVEL em diferencial + preço + compliance</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}