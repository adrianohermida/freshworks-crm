import React, { useState, useEffect } from 'react';
import { TrendingUp, Users, Zap, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';
import Card from '@/components/aetherlab/Card';

export default function PartnerDashboard() {
  const [partners, setPartners] = useState([
    {
      id: 1,
      name: 'Tech Solutions Brasil',
      status: 'active',
      revenue: 45230,
      integrations: 12,
      users: 156,
      joinedDate: '2026-01-15'
    },
    {
      id: 2,
      name: 'Legal Tech Consulting',
      status: 'active',
      revenue: 28450,
      integrations: 8,
      users: 89,
      joinedDate: '2026-02-10'
    },
    {
      id: 3,
      name: 'StartUp Jurídico',
      status: 'pending',
      revenue: 0,
      integrations: 3,
      users: 0,
      joinedDate: '2026-03-01'
    }
  ]);

  const [expandedPartner, setExpandedPartner] = useState(null);

  const totalRevenue = partners.reduce((sum, p) => sum + (p.status === 'active' ? p.revenue : 0), 0);
  const activePartners = partners.filter(p => p.status === 'active').length;
  const totalUsers = partners.reduce((sum, p) => sum + p.users, 0);
  const totalIntegrations = partners.reduce((sum, p) => sum + p.integrations, 0);

  return (
    <div style={{ backgroundColor: 'var(--color-light)', minHeight: '100vh', padding: 'var(--spacing-xl)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* HEADER */}
        <div style={{ marginBottom: 'var(--spacing-2xl)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-lg)', marginBottom: 'var(--spacing-lg)' }}>
            <div style={{
              padding: 'var(--spacing-md)',
              backgroundColor: 'var(--color-primary)',
              borderRadius: 'var(--border-radius-lg)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Zap style={{ width: '24px', height: '24px', color: 'var(--color-white)' }} />
            </div>
            <div>
              <h1 style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-heading)', margin: 0 }}>
                🛍️ Marketplace Partner Dashboard
              </h1>
              <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: '0.5rem 0 0 0' }}>
                Gerencie integrações, receitas e parceiros
              </p>
            </div>
          </div>
        </div>

        {/* KPI CARDS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 'var(--spacing-lg)',
          marginBottom: 'var(--spacing-2xl)'
        }}>
          <Card variant="elevated" style={{ borderLeft: '4px solid var(--color-success)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase', fontWeight: 'var(--font-weight-semibold)' }}>
                  Receita Total
                </div>
                <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)' }}>
                  R$ {(totalRevenue / 1000).toFixed(1)}K
                </div>
              </div>
              <DollarSign style={{ width: '32px', height: '32px', color: 'var(--color-success)', opacity: 0.3 }} />
            </div>
          </Card>

          <Card variant="elevated" style={{ borderLeft: '4px solid var(--color-primary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase', fontWeight: 'var(--font-weight-semibold)' }}>
                  Parceiros Ativos
                </div>
                <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)' }}>
                  {activePartners}
                </div>
              </div>
              <Users style={{ width: '32px', height: '32px', color: 'var(--color-primary)', opacity: 0.3 }} />
            </div>
          </Card>

          <Card variant="elevated" style={{ borderLeft: '4px solid var(--color-info)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase', fontWeight: 'var(--font-weight-semibold)' }}>
                  Usuários Totais
                </div>
                <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-info)' }}>
                  {totalUsers}
                </div>
              </div>
              <TrendingUp style={{ width: '32px', height: '32px', color: 'var(--color-info)', opacity: 0.3 }} />
            </div>
          </Card>

          <Card variant="elevated" style={{ borderLeft: '4px solid var(--color-warning)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase', fontWeight: 'var(--font-weight-semibold)' }}>
                  Integrações
                </div>
                <div style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-warning)' }}>
                  {totalIntegrations}
                </div>
              </div>
              <Zap style={{ width: '32px', height: '32px', color: 'var(--color-warning)', opacity: 0.3 }} />
            </div>
          </Card>
        </div>

        {/* PARTNERS LIST */}
        <Card variant="elevated">
          <div style={{ marginBottom: 'var(--spacing-lg)' }}>
            <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0 }}>
              👥 Parceiros
            </h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-lg)' }}>
            {partners.map((partner) => (
              <div key={partner.id} style={{
                padding: 'var(--spacing-lg)',
                backgroundColor: 'var(--color-light)',
                borderRadius: 'var(--border-radius-md)',
                borderLeft: `4px solid ${partner.status === 'active' ? 'var(--color-success)' : 'var(--color-warning)'}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--spacing-md)' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-sm)' }}>
                      <h4 style={{ fontSize: 'var(--font-size-base)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0 }}>
                        {partner.name}
                      </h4>
                      <span style={{
                        fontSize: 'var(--font-size-xs)',
                        fontWeight: 'var(--font-weight-bold)',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        backgroundColor: partner.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                        color: partner.status === 'active' ? 'var(--color-success)' : 'var(--color-warning)'
                      }}>
                        {partner.status === 'active' ? '✓ Ativo' : '⏳ Pendente'}
                      </span>
                    </div>
                    <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-body)', margin: 0 }}>
                      Adicionado em {new Date(partner.joinedDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <button
                    onClick={() => setExpandedPartner(expandedPartner === partner.id ? null : partner.id)}
                    style={{
                      padding: 'var(--spacing-sm)',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--color-primary)',
                      fontSize: 'var(--font-size-base)'
                    }}
                  >
                    {expandedPartner === partner.id ? '▼' : '▶'}
                  </button>
                </div>

                {expandedPartner === partner.id && (
                  <div style={{
                    paddingTop: 'var(--spacing-lg)',
                    borderTop: '1px solid var(--color-border)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: 'var(--spacing-lg)'
                  }}>
                    <div>
                      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase', fontWeight: 'var(--font-weight-semibold)' }}>
                        Receita
                      </p>
                      <p style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-success)', margin: 0 }}>
                        R$ {partner.revenue.toLocaleString('pt-BR')}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase', fontWeight: 'var(--font-weight-semibold)' }}>
                        Usuários
                      </p>
                      <p style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-info)', margin: 0 }}>
                        {partner.users}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-body)', margin: 0, marginBottom: 'var(--spacing-sm)', textTransform: 'uppercase', fontWeight: 'var(--font-weight-semibold)' }}>
                        Integrações
                      </p>
                      <p style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-primary)', margin: 0 }}>
                        {partner.integrations}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* INTEGRATION GUIDE */}
        <Card variant="default" style={{ marginTop: 'var(--spacing-2xl)', borderLeft: '4px solid var(--color-info)' }}>
          <h3 style={{ fontSize: 'var(--font-size-lg)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-heading)', margin: 0, marginBottom: 'var(--spacing-lg)' }}>
            📋 Guia de Integração
          </h3>
          <ol style={{ margin: 0, paddingLeft: 'var(--spacing-lg)', color: 'var(--color-body)', fontSize: 'var(--font-size-sm)' }}>
            <li style={{ marginBottom: 'var(--spacing-sm)' }}>Gere API key na seção de credenciais</li>
            <li style={{ marginBottom: 'var(--spacing-sm)' }}>Configure webhook para sincronização em tempo real</li>
            <li style={{ marginBottom: 'var(--spacing-sm)' }}>Teste a integração com dados de exemplo</li>
            <li>Ative em produção após validação</li>
          </ol>
        </Card>
      </div>
    </div>
  );
}