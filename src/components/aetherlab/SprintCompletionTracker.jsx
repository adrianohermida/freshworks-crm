import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, TrendingUp, Calendar, AlertCircle } from 'lucide-react';

export default function SprintCompletionTracker() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';

  const [phases] = useState([
    {
      name: 'FASE 1: Fundação Técnica (Meses 1-4)',
      weight: '30%',
      sections: [
        {
          title: '1.1 Conformidade Técnica (ABNT NBR ISO/IEC 27037)',
          status: 'ACTIVE',
          completionRatio: [2, 3],
          items: [
            { name: '1.1.1 - ABNT 27037 (Sandbox Forense)', status: 'PLANNING', sprint: 'T' },
            { name: '1.1.2 - Captura Metadados (IP, User Agent, DNS, etc)', status: 'SPRINT_S', progress: 0 },
            { name: '1.1.3 - Relatório PDF/A-2B', status: 'SPRINT_S', progress: 20 }
          ]
        },
        {
          title: '1.2 Integração ICP/Brasil',
          status: 'ACTIVE',
          completionRatio: [1, 2],
          items: [
            { name: '1.2.1 - Certificado Digital A3 PJ (Autentique)', status: 'SPRINT_S', progress: 30 },
            { name: '1.2.2 - Carimbo Tempo RFC 3161 (Observatório Nacional)', status: 'SPRINT_T', progress: 0 }
          ]
        },
        {
          title: '1.3 Integridade de Dados (Hash)',
          status: 'ACTIVE',
          completionRatio: [2, 2],
          items: [
            { name: '1.3.1 - SHA512 + SHA3-512 (Duplo)', status: 'SPRINT_S', progress: 30 },
            { name: '1.3.2 - Validador Hash Online', status: 'SPRINT_T', progress: 0 }
          ]
        }
      ]
    },
    {
      name: 'FASE 2: Conformidade Jurídica (Meses 5-8)',
      weight: '40%',
      sections: [
        {
          title: '2.1 Cadeia de Custódia (CPP 158-A)',
          status: 'QUEUED',
          completionRatio: [0, 1],
          items: [
            { name: '2.1.1 - 5 Etapas de Coleta/Preservação/Apresentação', status: 'SPRINT_U', progress: 0 }
          ]
        },
        {
          title: '2.2 Compliance CPC (Art. 411-II)',
          status: 'QUEUED',
          completionRatio: [0, 2],
          items: [
            { name: '2.2.1 - Documento Eletrônico (Autenticidade + Integridade)', status: 'SPRINT_V', progress: 0 },
            { name: '2.2.2 - Art. 369 Disclaimer (Meios Legítimos)', status: 'SPRINT_V', progress: 0 }
          ]
        },
        {
          title: '2.3 Proteção Dados (LGPD)',
          status: 'ACTIVE',
          completionRatio: [1, 2],
          items: [
            { name: '2.3.1 - Privacy Policy + LGPD Compliance', status: 'SPRINT_S', progress: 40 },
            { name: '2.3.2 - Segurança Operacional (2FA + TLS + Criptografia)', status: 'SPRINT_S', progress: 50 }
          ]
        }
      ]
    },
    {
      name: 'FASE 3: Validação & Lançamento (Meses 9-12)',
      weight: '30%',
      sections: [
        {
          title: '3.1 Sistema de Validação (3x)',
          status: 'QUEUED',
          completionRatio: [0, 3],
          items: [
            { name: '3.1.1 - Validador Online (Upload + Verificação)', status: 'SPRINT_T', progress: 0 },
            { name: '3.1.2 - Validação Manual (PDF + ITI Gov)', status: 'SPRINT_U', progress: 0 },
            { name: '3.1.3 - Validação Especialista (Contato + Laudo)', status: 'SPRINT_V', progress: 0 }
          ]
        },
        {
          title: '3.2 Documentação Jurídica',
          status: 'QUEUED',
          completionRatio: [0, 3],
          items: [
            { name: '3.2.1 - Relatório Técnico (Metodologia + Limitações)', status: 'SPRINT_U', progress: 0 },
            { name: '3.2.2 - Termos de Uso Legais', status: 'SPRINT_S', progress: 40 },
            { name: '3.2.3 - Parecer Jurídico Formal (3º)', status: 'SPRINT_U', progress: 0 }
          ]
        },
        {
          title: '3.3 Testes & Certificações',
          status: 'QUEUED',
          completionRatio: [0, 3],
          items: [
            { name: '3.3.1 - Teste Admissibilidade Jurídica (Processo Piloto)', status: 'SPRINT_V', progress: 0 },
            { name: '3.3.2 - Auditoria Segurança (Terceiros)', status: 'SPRINT_V', progress: 0 },
            { name: '3.3.3 - ISO 27001 (Pós-Lançamento)', status: 'POST_LAUNCH', progress: 0 }
          ]
        }
      ]
    }
  ]);

  const sprintStatus = [
    { sprint: 'S', dates: 'Mar 5-22', status: 'ACTIVE', progress: 28, focus: 'Autentique + Hashing + LGPD' },
    { sprint: 'T', dates: 'Mar 24-Apr 6', status: 'QUEUED', progress: 0, focus: 'Assinatura + Validador' },
    { sprint: 'U', dates: 'Apr 8-May 5', status: 'QUEUED', progress: 0, focus: 'Cadeia Custódia + Parecer' },
    { sprint: 'V', dates: 'May 7-26', status: 'QUEUED', progress: 0, focus: 'Testes + Compliance Final' }
  ];

  const getStatusBadge = (status) => {
    const badgeStyles = {
      'SPRINT_S': 'bg-blue-100 text-blue-800',
      'SPRINT_T': 'bg-purple-100 text-purple-800',
      'SPRINT_U': 'bg-indigo-100 text-indigo-800',
      'SPRINT_V': 'bg-pink-100 text-pink-800',
      'PLANNING': 'bg-gray-100 text-gray-800',
      'QUEUED': 'bg-yellow-100 text-yellow-800',
      'ACTIVE': 'bg-green-100 text-green-800',
      'POST_LAUNCH': 'bg-slate-100 text-slate-800'
    };
    return badgeStyles[status] || 'bg-gray-100 text-gray-800';
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return 'bg-green-500';
    if (progress >= 50) return 'bg-blue-500';
    if (progress >= 25) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className={`p-6 ${isDark ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
            dOC Platform — Completion Tracker
          </h1>
          <div className="text-right">
            <p className="text-sm text-gray-600 dark:text-gray-400">Autentique-Powered Roadmap</p>
            <p className="text-2xl font-bold text-blue-600">9 Weeks (4 Sprints)</p>
          </div>
        </div>

        {/* Sprint Timeline */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Sprint Timeline
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {sprintStatus.map((s) => (
              <Card key={s.sprint} className={s.status === 'ACTIVE' ? 'border-green-300 bg-green-50 dark:bg-green-950' : isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Sprint {s.sprint}</CardTitle>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{s.dates}</p>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-semibold">{s.progress}%</span>
                      <Badge className={getStatusBadge(s.status)}>
                        {s.status === 'ACTIVE' ? '🔴 Active' : 'Queued'}
                      </Badge>
                    </div>
                    <Progress value={s.progress} className="h-2" />
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">{s.focus}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Detailed Phase Breakdown */}
        <div className="space-y-6">
          {phases.map((phase, phaseIdx) => (
            <Card key={phaseIdx} className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{phase.name}</CardTitle>
                  <Badge variant="outline">Weight: {phase.weight}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {phase.sections.map((section, sectionIdx) => (
                  <div key={sectionIdx} className={`p-4 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-semibold">{section.title}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{section.completionRatio[0]}/{section.completionRatio[1]}</span>
                        <div className="w-16 h-2 bg-gray-300 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getProgressColor((section.completionRatio[0] / section.completionRatio[1]) * 100)}`}
                            style={{ width: `${(section.completionRatio[0] / section.completionRatio[1]) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {section.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="flex items-center justify-between text-sm">
                          <div className="flex-1">
                            <p className={isDark ? 'text-gray-300' : 'text-gray-700'}>{item.name}</p>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge className={getStatusBadge(item.status)}>
                              {item.status.replace('_', ' ')}
                            </Badge>
                            {item.progress > 0 && (
                              <div className="w-12 h-2 bg-gray-300 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${getProgressColor(item.progress)}`}
                                  style={{ width: `${item.progress}%` }}
                                />
                              </div>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary */}
        <Card className="border-blue-300 bg-blue-50 dark:bg-blue-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              📊 Project Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>
              <span className="font-bold">Total Progress:</span> ~7% (Fase 1 kickoff + Sprint S starting)
            </p>
            <p>
              <span className="font-bold">Critical Path:</span> Autentique API Integration (Mar 10) → Cadeia de Custódia (May 5) → Final Validation (May 26)
            </p>
            <p>
              <span className="font-bold">Next Milestone:</span> Sprint S completion (Mar 22) — All basic infrastructure ready for Sprint T
            </p>
            <p>
              <span className="font-bold">Go-Live Date:</span> May 26, 2026 (9 weeks from start)
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}