import React, { useState } from 'react';
import { useTheme } from 'next-themes';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Briefcase, Zap, CheckCircle2, Users, TrendingUp, Clock } from 'lucide-react';
import { useI18n } from '@/components/i18nManager';
import { useTenant } from '@/components/TenantContext';
import { checkPermission } from '@/components/RoleBasedAccess';

export default function EnterprisePartnerships() {
  const { resolvedTheme, systemTheme } = useTheme();
  const isDark = (resolvedTheme || systemTheme) === 'dark';
  const [selectedPartner, setSelectedPartner] = useState('microsoft');
  const { t } = useI18n();
  const { tenantId } = useTenant();

  const partnerships = [
    {
      id: 'microsoft',
      name: 'Microsoft',
      logo: '🔷',
      status: 'IN PROGRESS',
      startDate: 'Sept 2026',
      endDate: 'Nov 2026',
      progress: 45,
      integrations: ['Microsoft 365', 'SharePoint', 'Teams', 'Outlook'],
      impact: 'Enterprise Sales',
      value: '$5M ARR',
      details: 'Native integration com Microsoft 365 para assinatura de documentos direto do SharePoint e Teams'
    },
    {
      id: 'google',
      name: 'Google',
      logo: '🔵',
      status: 'IN PROGRESS',
      startDate: 'Oct 2026',
      endDate: 'Jan 2027',
      progress: 30,
      integrations: ['Google Workspace', 'Drive', 'Docs', 'Classroom'],
      impact: 'Enterprise + Education',
      value: '$3M ARR',
      details: 'Integração com Google Workspace para educação e empresas'
    },
    {
      id: 'salesforce',
      name: 'Salesforce',
      logo: '☁️',
      status: 'PLANNED',
      startDate: 'Dec 2026',
      endDate: 'Mar 2027',
      progress: 0,
      integrations: ['Salesforce CRM', 'Flow', 'Lightning', 'Communities'],
      impact: 'Sales Automation',
      value: '$2M ARR',
      details: 'Automação de contratos e assinatura dentro do Salesforce CRM'
    },
    {
      id: 'docusign',
      name: 'DocuSign',
      logo: '📄',
      status: 'PLANNED',
      startDate: 'Jan 2027',
      endDate: 'Apr 2027',
      progress: 0,
      integrations: ['DocuSign API', 'eSignature', 'CLM', 'Migration'],
      impact: 'Market Consolidation',
      value: '$4M ARR',
      details: 'Partnership para migração de clientes DocuSign + integrações complementares'
    },
    {
      id: 'notary',
      name: 'Notary Digital',
      logo: '📋',
      status: 'PLANNED',
      startDate: 'Feb 2027',
      endDate: 'May 2027',
      progress: 0,
      integrations: ['Notariado Digital', 'CNJ Integration', 'Legal Vault'],
      impact: 'Legal Compliance',
      value: '$1.5M ARR',
      details: 'Partnership com plataformas de notariado digital para compliance Brasil'
    }
  ];

  const selectedPartnerData = partnerships.find(p => p.id === selectedPartner);

  const salesTargets = [
    { region: '🇧🇷 Brasil', target: '$8M', status: 'ON TRACK' },
    { region: '🌍 Europa', target: '$6M', status: 'PLANNED' },
    { region: '🇺🇸 USA', target: '$10M', status: 'PLANNED' },
    { region: '🌏 Global', target: '$24M', status: 'GOAL' }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-950' : 'bg-white'} p-6`}>
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <section className={`p-8 rounded-lg border-2 ${isDark ? 'bg-gradient-to-r from-purple-900/40 to-pink-900/40 border-purple-700' : 'bg-gradient-to-r from-purple-100 to-pink-100 border-purple-400'}`}>
          <div className="space-y-4">
            <h1 className="text-4xl font-bold flex items-center gap-2">
              <Briefcase className="w-10 h-10 text-purple-600" />
              🤝 Enterprise Partnerships
            </h1>
            <p className={`text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
              Parcerias estratégicas com líderes globais para expansão enterprise
            </p>
            <Badge className="bg-purple-600 px-4 py-2">🎯 $24M ARR Target</Badge>
          </div>
        </section>

        {/* REVENUE TARGETS */}
        <section>
          <h2 className="text-2xl font-bold mb-4">💰 Targets por Região</h2>
          <div className="grid md:grid-cols-4 gap-4">
            {salesTargets.map((target, idx) => (
              <Card key={idx} className={`${target.status === 'ON TRACK' ? (isDark ? 'bg-green-900/20 border-green-700' : 'bg-green-50 border-green-400') : (isDark ? 'bg-gray-800 border-gray-700' : 'border-gray-200')} border-2`}>
                <CardContent className="pt-4 text-center">
                  <p className="text-lg font-bold">{target.region}</p>
                  <p className="text-2xl font-bold text-green-600 mt-2">{target.target}</p>
                  <Badge className={`mt-3 ${target.status === 'ON TRACK' ? 'bg-green-600' : target.status === 'PLANNED' ? 'bg-blue-600' : 'bg-purple-600'}`}>
                    {target.status}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* PARTNERSHIPS GRID */}
        <section>
          <h2 className="text-2xl font-bold mb-4">🤝 Parcerias Ativas</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {partnerships.map((partner) => (
              <Card
                key={partner.id}
                onClick={() => setSelectedPartner(partner.id)}
                className={`border-2 cursor-pointer transition-all ${
                  selectedPartner === partner.id
                    ? isDark
                      ? 'bg-purple-900/40 border-purple-700'
                      : 'bg-purple-50 border-purple-500'
                    : isDark
                    ? 'bg-gray-800 border-gray-700'
                    : 'border-gray-200'
                }`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{partner.logo}</span>
                      <div>
                        <h3 className="font-bold text-lg">{partner.name}</h3>
                        <Badge className={
                          partner.status === 'IN PROGRESS'
                            ? 'bg-blue-600'
                            : partner.status === 'PLANNED'
                            ? 'bg-yellow-600'
                            : 'bg-green-600'
                        }>
                          {partner.status === 'IN PROGRESS' ? '⏳' : partner.status === 'PLANNED' ? '📅' : '✓'} {partner.status}
                        </Badge>
                      </div>
                    </div>
                    <span className="font-bold text-green-600">{partner.value}</span>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-xs font-semibold">Progresso</span>
                        <span className="text-xs font-bold">{partner.progress}%</span>
                      </div>
                      <Progress value={partner.progress} className="h-2" />
                    </div>

                    <div className={`p-2 rounded text-xs ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                      <p className="font-semibold">{partner.startDate} → {partner.endDate}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* PARTNER DETAILS */}
        {selectedPartnerData && (
          <section>
            <h2 className="text-2xl font-bold mb-4">📊 {selectedPartnerData.name} - Detalhes</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle>Descrição</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                    {selectedPartnerData.details}
                  </p>
                </CardContent>
              </Card>

              <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle>Integrações</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className={`space-y-2 ${isDark ? 'text-gray-300' : 'text-gray-800'}`}>
                    {selectedPartnerData.integrations.map((integration, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                        {integration}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle>Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Início</p>
                    <p className="font-bold">{selectedPartnerData.startDate}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Conclusão</p>
                    <p className="font-bold">{selectedPartnerData.endDate}</p>
                  </div>
                  <Button className="w-full mt-4">Detalhes Completos</Button>
                </CardContent>
              </Card>

              <Card className={isDark ? 'bg-gray-800 border-gray-700' : ''}>
                <CardHeader>
                  <CardTitle>Impacto & Receita</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Impacto</p>
                    <p className="font-bold">{selectedPartnerData.impact}</p>
                  </div>
                  <div>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>ARR Target</p>
                    <p className="font-bold text-green-600">{selectedPartnerData.value}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* SUMMARY */}
        <Card className={`${isDark ? 'bg-gradient-to-r from-green-900/60 to-blue-900/60 border-green-600' : 'bg-gradient-to-r from-green-100 to-blue-100 border-green-600'} border-2`}>
          <CardContent className="pt-8 space-y-4">
            <h3 className="text-2xl font-bold">🚀 Partnership Strategy</h3>
            <p className={isDark ? 'text-gray-300' : 'text-gray-800'}>
              5 parcerias enterprise alinhadas para gerar $24M ARR até 2027. Microsoft 365 + Google Workspace cobrem 70% do mercado enterprise global. Salesforce automação de contracts. DocuSign migração. Notary digital compliance Brasil.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <p className="font-bold text-green-600">2 Ativas</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Microsoft + Google</p>
              </div>
              <div>
                <p className="font-bold text-blue-600">3 Planned</p>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Salesforce + DocuSign + Notary</p>
              </div>
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}