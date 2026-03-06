import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Shield, Award, Briefcase, Globe, Lock, BarChart3 } from 'lucide-react';

export default function ComplianceLaw() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  const laws = [
    {
      id: 1,
      title: 'Lei 14.063/2020',
      country: '🇧🇷 Brasil',
      icon: '⚖️',
      status: 'COMPLIANT',
      description: 'Lei da Assinatura Eletrônica Brasileira',
      details: [
        'Assinatura eletrônica tem validade equivalente ao documento original em papel',
        'Reconhecida em qualquer tribunal brasileiro',
        'Força probante integral para contratos, documentos legais e processos',
        'Compatível com regulamento de Micropoder 2.200-2'
      ],
      implementation: [
        '✅ Certificado digital ICP-Brasil (nível máximo)',
        '✅ Timestamp de Observatório Nacional',
        '✅ Cadeia de custódia rastreável',
        '✅ Auditoria completa de ações'
      ]
    },
    {
      id: 2,
      title: 'LGPD (Lei 13.709/2018)',
      country: '🇧🇷 Brasil',
      icon: '🔒',
      status: 'COMPLIANT',
      description: 'Lei Geral de Proteção de Dados Pessoais',
      details: [
        'Proteção integral de dados pessoais de titulares',
        'Direitos garantidos: acesso, retificação, exclusão',
        'Consentimento explícito e informado obrigatório',
        'Relatórios de impacto de privacidade',
        'Notificação de incidentes em 72 horas'
      ],
      implementation: [
        '✅ Criptografia AES-256 em repouso',
        '✅ TLS 1.3 em transmissão',
        '✅ Data residency Brasil (opcional)',
        '✅ DPO (Encarregado de Proteção de Dados)',
        '✅ Processamento legítimo documentado'
      ]
    },
    {
      id: 3,
      title: 'GDPR (UE Regulation 2016/679)',
      country: '🌍 Europa',
      icon: '📋',
      status: 'COMPLIANT',
      description: 'General Data Protection Regulation',
      details: [
        'Regulação pan-europeia de proteção de dados',
        'Aplicável a qualquer processamento de dados de residentes EU',
        'Multas até €20 milhões ou 4% do revenue anual',
        'Direito ao esquecimento (right to erasure)',
        'Portabilidade de dados'
      ],
      implementation: [
        '✅ Privacy by Design implementado',
        '✅ Data Processing Agreement (DPA)',
        '✅ Standard Contractual Clauses (SCCs)',
        '✅ Multi-region data residency (EU servers)',
        '✅ GDPR-ready infrastructure'
      ]
    },
    {
      id: 4,
      title: 'eIDAS (EU Regulation 910/2014)',
      country: '🌍 Europa',
      icon: '🔐',
      status: 'COMPLIANT',
      description: 'Identificação Eletrônica, Autenticação e Serviços de Confiança',
      details: [
        'Regulação européia para assinatura eletrônica transfronteiriça',
        'Reconhecimento mútuo de assinaturas digitais entre países EU',
        'Qualified Electronic Signature (QES) com validade legal integral',
        'Serviços de confiança qualificados certificados'
      ],
      implementation: [
        '✅ Certificado QES-ready',
        '✅ eIDAS-registered trust service provider',
        '✅ Transnational signature recognition',
        '✅ European infrastructure compliance'
      ]
    },
    {
      id: 5,
      title: 'ICP-Brasil (Infraestrutura PKI)',
      country: '🇧🇷 Brasil',
      icon: '🏛️',
      status: 'CERTIFICADO',
      description: 'Certificação Digital Governamental Brasileira',
      details: [
        'Autoridade Certificadora raiz governamental brasileira',
        'Nível máximo de segurança e confiabilidade',
        'Certificados válidos por lei em qualquer contexto',
        'Auditoria contínua por órgãos federais',
        'Interoperabilidade com sistemas governamentais'
      ],
      implementation: [
        '✅ Certificado tipo "a1" (software) e "a3" (hardware token)',
        '✅ Revogação de certificados em tempo real',
        '✅ Integração com Serasa/Notariado Digital',
        '✅ Assinatura com validade "ad eternum"'
      ]
    },
    {
      id: 6,
      title: 'SOC 2 Type II',
      country: '🌍 Internacional',
      icon: '✓',
      status: 'AUDITADO',
      description: 'Auditoria de Controles de Segurança e Privacidade',
      details: [
        'Auditoria externa anual de segurança e privacidade',
        'Certificação internacionalmente reconhecida',
        'Avaliação de controles operacionais',
        'Relatório auditado por empresa Big4'
      ],
      implementation: [
        '✅ Auditoria anual completa',
        '✅ Relatório de conformidade disponível',
        '✅ Controles de segurança verificados',
        '✅ Trust center com documentação pública'
      ]
    }
  ];

  const complianceStats = [
    { label: '4 Legislações', value: 'Lei 14.063, LGPD, GDPR, eIDAS', icon: '⚖️' },
    { label: 'Certificações', value: 'ICP-Brasil + SOC 2 Type II', icon: '🏆' },
    { label: 'Auditoria', value: 'Anual por empresa independente', icon: '🔍' },
    { label: 'Tribunais', value: 'Válido em qualquer tribunal BR/EU', icon: '⚔️' }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER */}
        <section className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-blue-600/10 rounded-2xl blur-3xl" />
          <div className="relative text-center space-y-3 py-8">
            <Shield className="w-12 h-12 mx-auto text-green-600" />
            <h1 className="text-5xl font-black">Conformidade Legal Total</h1>
            <p className={`text-xl ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Lei 14.063/2020 • LGPD • GDPR • eIDAS • ICP-Brasil • SOC 2 Type II
            </p>
          </div>
        </section>

        {/* STATS */}
        <div className="grid md:grid-cols-4 gap-4">
          {complianceStats.map((stat, idx) => (
            <Card key={idx} className={`text-center ${isDark ? 'bg-gray-800 border-gray-700' : 'border-gray-200'}`}>
              <CardContent className="pt-6">
                <p className="text-3xl mb-2">{stat.icon}</p>
                <p className={`text-sm font-semibold ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{stat.label}</p>
                <p className="font-bold mt-2">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* LAWS DETAIL */}
        <div className="space-y-6">
          {laws.map((law) => (
            <Card 
              key={law.id} 
              className={`border-2 ${
                law.status === 'COMPLIANT'
                  ? isDark 
                    ? 'bg-green-900/20 border-green-700'
                    : 'bg-green-50 border-green-400'
                  : isDark
                  ? 'bg-blue-900/20 border-blue-700'
                  : 'bg-blue-50 border-blue-400'
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{law.icon}</div>
                    <div>
                      <CardTitle className="text-2xl mb-1">{law.title}</CardTitle>
                      <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{law.country}</p>
                    </div>
                  </div>
                  <Badge className={law.status === 'COMPLIANT' ? 'bg-green-600' : 'bg-blue-600'}>
                    ✓ {law.status}
                  </Badge>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">{law.description}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold mb-3">Requisitos Legais:</p>
                  <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                    {law.details.map((detail, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-white'} border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                  <p className="font-semibold mb-3">Implementação em DocuChain:</p>
                  <ul className={`space-y-2 text-sm ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                    {law.implementation.map((impl, idx) => (
                      <li key={idx} className="font-semibold">
                        {impl}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* GUARANTEE */}
        <Card className={`${isDark ? 'bg-gradient-to-r from-purple-900/40 to-blue-900/40 border-purple-700' : 'bg-gradient-to-r from-purple-100 to-blue-100 border-purple-400'} border-2`}>
          <CardContent className="pt-8 space-y-4">
            <div className="flex items-start gap-4">
              <Award className="w-8 h-8 text-yellow-500 flex-shrink-0" />
              <div>
                <h3 className="text-2xl font-bold mb-3">🛡️ Garantia Jurídica Integral</h3>
                <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                  <strong>DocuChain oferece a máxima proteção legal:</strong> Documentos assinados e registrados em DocuChain são válidos em qualquer tribunal brasileiro, europeu e internacionalmente. Compliance total com Lei 14.063/2020 (Brasil), LGPD, GDPR (Europa), ICP-Brasil certificado, e auditoria SOC 2 Type II anual.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}