import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Award, CheckCircle2, Clock, Shield, AlertCircle } from 'lucide-react';

export default function CertificationsTracker() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const [selectedCert, setSelectedCert] = useState('soc2');

  const certifications = [
    {
      id: 'soc2',
      name: 'SOC 2 Type II',
      icon: '🔐',
      status: 'IN PROGRESS',
      progress: 60,
      startDate: 'Aug 2026',
      targetDate: 'Nov 2026',
      provider: 'Big4 Audit Firm',
      cost: '$45k',
      requirements: [
        'Security controls audit',
        'Availability & integrity verification',
        'Confidentiality review',
        '6-month observation period',
        'Annual recertification'
      ],
      impact: 'Enterprise trust + SLA guarantees',
      details: 'Auditoria independente de controles de segurança e privacidade reconhecida internacionalmente'
    },
    {
      id: 'iso27001',
      name: 'ISO 27001:2022',
      icon: '🛡️',
      status: 'PLANNED',
      progress: 20,
      startDate: 'Oct 2026',
      targetDate: 'Jun 2027',
      provider: 'ISO Certification Body',
      cost: '$35k',
      requirements: [
        'ISMS (Information Security Management System)',
        'Risk assessment & treatment',
        'Access control policies',
        'Incident management',
        'Compliance monitoring'
      ],
      impact: 'Global standard compliance',
      details: 'Certificação internacional de gerenciamento de segurança da informação'
    },
    {
      id: 'gdpr',
      name: 'GDPR Data Processing',
      icon: '📋',
      status: 'COMPLIANT',
      progress: 100,
      startDate: 'May 2026',
      targetDate: 'Aug 2026',
      provider: 'Internal + Legal',
      cost: '$20k',
      requirements: [
        'Data Processing Agreement (DPA)',
        'Standard Contractual Clauses (SCCs)',
        'GDPR privacy by design',
        'Data residency control',
        'DPIA documentation'
      ],
      impact: 'EU market access',
      details: 'Compliance total com regulação europeia de proteção de dados'
    },
    {
      id: 'icpbrasil',
      name: 'ICP-Brasil Certificação',
      icon: '🇧🇷',
      status: 'COMPLIANT',
      progress: 100,
      startDate: 'Jan 2026',
      targetDate: 'Aug 2026',
      provider: 'AC Credenciada',
      cost: '$15k',
      requirements: [
        'Certificado Digital Type A1/A3',
        'ICP-Brasil compliance audit',
        'Observatório Nacional timestamp',
        'CNJ integration',
        'Annual renewal'
      ],
      impact: 'Brasil market leadership',
      details: 'Certificação governamental brasileira de assinatura digital'
    },
    {
      id: 'sso',
      name: 'Single Sign-On (SAML/OIDC)',
      icon: '🔑',
      status: 'COMPLIANT',
      progress: 100,
      startDate: 'Feb 2026',
      targetDate: 'Aug 2026',
      provider: 'Internal Dev',
      cost: '$10k',
      requirements: [
        'SAML 2.0 implementation',
        'OpenID Connect support',
        'Enterprise IdP integration',
        'MFA support',
        'Session management'
      ],
      impact: 'Enterprise adoption',
      details: 'Implementação de autenticação centralizada para empresas'
    }
  ];

  const selectedCertData = certifications.find(c => c.id === selectedCert);

  const certificationsByStatus = {
    COMPLIANT: certifications.filter(c => c.status === 'COMPLIANT'),
    'IN PROGRESS': certifications.filter(c => c.status === 'IN PROGRESS'),
    PLANNED: certifications.filter(c => c.status === 'PLANNED')
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <section className={`p-8 rounded-lg border-2 ${isDark ? 'bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border-blue-700' : 'bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-400'}`}>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold flex items-center gap-2">
              <Award className="w-10 h-10 text-blue-600" />
              🏆 Certifications Tracker
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Rastreamento de certificações globais de segurança e conformidade
            </p>
          </div>
        </section>

        {/* SUMMARY STATS */}
        <div className="grid md:grid-cols-4 gap-4">
          <Card className={`${isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-400'} border-2`}>
            <CardContent className="pt-6 text-center">
              <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-600">{certificationsByStatus.COMPLIANT.length}</p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Ativas</p>
            </CardContent>
          </Card>
          <Card className={`${isDark ? 'bg-blue-900/20 border-blue-700' : 'bg-blue-50 border-blue-400'} border-2`}>
            <CardContent className="pt-6 text-center">
              <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-blue-600">{certificationsByStatus['IN PROGRESS'].length}</p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Em Andamento</p>
            </CardContent>
          </Card>
          <Card className={`${isDark ? 'bg-purple-900/20 border-purple-700' : 'bg-purple-50 border-purple-400'} border-2`}>
            <CardContent className="pt-6 text-center">
              <AlertCircle className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-purple-600">{certificationsByStatus.PLANNED.length}</p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Planejadas</p>
            </CardContent>
          </Card>
          <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
            <CardContent className="pt-6 text-center">
              <p className="text-2xl font-bold">$125k</p>
              <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Investimento Total</p>
            </CardContent>
          </Card>
        </div>

        {/* CERTIFICATIONS GRID */}
        <section>
          <h2 className="text-2xl font-bold mb-4">🏅 Todas as Certificações</h2>
          <div className="space-y-4">
            {certifications.map((cert) => (
              <Card
                key={cert.id}
                onClick={() => setSelectedCert(cert.id)}
                className={`border-2 cursor-pointer transition-all ${
                  selectedCert === cert.id
                    ? isDark
                      ? 'bg-blue-900/40 border-blue-700'
                      : 'bg-blue-50 border-blue-500'
                    : isDark
                    ? 'bg-gray-800 border-gray-700'
                    : 'border-gray-200'
                }`}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{cert.icon}</span>
                      <div>
                        <h3 className="font-bold text-lg">{cert.name}</h3>
                        <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{cert.provider}</p>
                      </div>
                    </div>
                    <Badge className={
                      cert.status === 'COMPLIANT'
                        ? 'bg-green-600'
                        : cert.status === 'IN PROGRESS'
                        ? 'bg-blue-600'
                        : 'bg-purple-600'
                    }>
                      {cert.status}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-semibold">Progresso</span>
                      <span className="text-xs font-bold">{cert.progress}%</span>
                    </div>
                    <Progress value={cert.progress} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CERT DETAILS */}
        {selectedCertData && (
          <section>
            <h2 className="text-2xl font-bold mb-4">📊 {selectedCertData.name} - Detalhes</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle>Timeline & Custos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-xs font-semibold">Início</p>
                    <p className="font-bold">{selectedCertData.startDate}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Target Date</p>
                    <p className="font-bold text-blue-600">{selectedCertData.targetDate}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold">Custo Estimado</p>
                    <p className="font-bold text-green-600">{selectedCertData.cost}</p>
                  </div>
                </CardContent>
              </Card>

              <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle>Impacto Estratégico</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                    {selectedCertData.impact}
                  </p>
                </CardContent>
              </Card>

              <Card className={`md:col-span-2 ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}>
                <CardHeader>
                  <CardTitle>Requisitos</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                    {selectedCertData.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* SUMMARY */}
        <Card className={`${isDark ? 'bg-gradient-to-r from-blue-900/60 to-indigo-900/60 border-blue-600' : 'bg-gradient-to-r from-blue-100 to-indigo-100 border-blue-600'} border-2`}>
          <CardContent className="pt-8 space-y-4">
            <h3 className="text-2xl font-bold">🎯 Certification Roadmap</h3>
            <div className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
              <p><strong>✅ Agora (Aug 2026):</strong> SOC 2 Type II + GDPR + ICP-Brasil + SSO (100% completo)</p>
              <p><strong>⏳ Q4 2026:</strong> ISO 27001 iniciado (compliance global)</p>
              <p><strong>📅 H1 2027:</strong> ISO 27001 finalizado (standard internacional)</p>
              <p className="text-lg font-bold mt-4">💎 Resultado: DocuChain com máximas certificações globais = Enterprise trust total</p>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}