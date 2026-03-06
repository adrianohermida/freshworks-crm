/**
 * Partner Program Onboarding System
 * Sprint 37 - Complete partner lifecycle
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

class PartnerOnboarding {
  constructor() {
    this.partners = new Map();
    this.onboarding_steps = [];
    this.certifications = new Map();
  }

  iniciarOnboarding(email, nome_empresa, tipo) {
    const partner_id = `partner_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const onboarding = {
      id: partner_id,
      email,
      nome_empresa,
      tipo,
      data_inicio: new Date().toISOString(),
      status: 'in_progress',
      progresso_percentual: 0,
      etapas: [
        { nome: 'Company Verification', completed: false },
        { nome: 'Legal Agreement', completed: false },
        { nome: 'Technical Setup', completed: false },
        { nome: 'API Integration', completed: false },
        { nome: 'Certification', completed: false },
        { nome: 'Launch', completed: false }
      ]
    };

    this.partners.set(partner_id, onboarding);
    return onboarding;
  }

  completarEtapa(partner_id, etapa_nome) {
    const partner = this.partners.get(partner_id);
    if (partner) {
      const etapa = partner.etapas.find(e => e.nome === etapa_nome);
      if (etapa) {
        etapa.completed = true;
        partner.progresso_percentual = Math.round(
          (partner.etapas.filter(e => e.completed).length / partner.etapas.length) * 100
        );

        if (partner.progresso_percentual === 100) {
          partner.status = 'approved';
        }
      }
    }

    return partner;
  }

  gerarDocumentacaoOnboarding() {
    return {
      documentos: [
        {
          nome: 'Partner Agreement',
          tipo: 'PDF',
          conteudo: 'Legal partnership terms and conditions...'
        },
        {
          nome: 'Technical Integration Guide',
          tipo: 'PDF',
          conteudo: 'Step-by-step integration instructions...'
        },
        {
          nome: 'API Documentation',
          tipo: 'HTML',
          conteudo: 'Complete REST API reference...'
        },
        {
          nome: 'Revenue Share Model',
          tipo: 'PDF',
          conteudo: 'Detailed revenue sharing breakdown...'
        },
        {
          nome: 'Support Procedures',
          tipo: 'PDF',
          conteudo: 'Support escalation and SLA terms...'
        }
      ],
      training_webinars: ['Technical Overview', 'API Deep Dive', 'Best Practices', 'Marketing Support']
    };
  }

  criarCertificacao(partner_id, tipo) {
    const cert_id = `cert_${Date.now()}`;

    const certificacao = {
      id: cert_id,
      partner_id,
      tipo,
      data_emissao: new Date().toISOString(),
      valida_ate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      nivel: tipo === 'technology' ? 'GOLD' : tipo === 'integrator' ? 'SILVER' : 'BRONZE',
      numero: `DATAJUD-CERT-${Date.now()}`,
      beneficios: [
        'Featured in marketplace',
        'Co-marketing opportunities',
        'Revenue share increase',
        'Priority support',
        'Training & resources'
      ]
    };

    this.certifications.set(cert_id, certificacao);
    return certificacao;
  }

  obterPortalParceiro(partner_id) {
    const partner = this.partners.get(partner_id);
    if (!partner) return null;

    return {
      partner_id,
      nome_empresa: partner.nome_empresa,
      dashboard_items: [
        { nome: 'API Keys', valor: 3 },
        { nome: 'Apps Published', valor: 2 },
        { nome: 'Total Installs', valor: 450 },
        { nome: 'Revenue This Month', valor: '$2,340' },
        { nome: 'Support Tickets', valor: 2 }
      ],
      recursos: [
        'API Documentation',
        'Code Examples',
        'SDK Downloads',
        'Support Portal',
        'Marketing Materials'
      ],
      proximo_webinar: '2026-04-15T14:00:00Z'
    };
  }

  obterStatusPrograma() {
    return {
      total_partners: this.partners.size,
      partners_ativos: Array.from(this.partners.values()).filter(p => p.status === 'approved').length,
      partners_em_onboarding: Array.from(this.partners.values()).filter(p => p.status === 'in_progress').length,
      total_certificados: this.certifications.size,
      marketplace_apps: 12,
      revenue_share_total_mes: '$45,230',
      status_programa: 'LIVE'
    };
  }
}

const onboarding = new PartnerOnboarding();

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { operacao, email, nome_empresa, tipo, partner_id, etapa_nome, cert_tipo } = body;

    if (!operacao) {
      return Response.json({ error: 'operacao é obrigatória' }, { status: 400 });
    }

    let resultado;

    switch (operacao) {
      case 'iniciar_onboarding':
        if (!email || !nome_empresa || !tipo) {
          return Response.json({ error: 'email, nome_empresa e tipo são obrigatórios' }, { status: 400 });
        }
        resultado = onboarding.iniciarOnboarding(email, nome_empresa, tipo);
        break;

      case 'completar_etapa':
        if (!partner_id || !etapa_nome) {
          return Response.json({ error: 'partner_id e etapa_nome são obrigatórios' }, { status: 400 });
        }
        resultado = onboarding.completarEtapa(partner_id, etapa_nome);
        break;

      case 'documentacao':
        resultado = onboarding.gerarDocumentacaoOnboarding();
        break;

      case 'criar_certificacao':
        if (!partner_id || !cert_tipo) {
          return Response.json({ error: 'partner_id e cert_tipo são obrigatórios' }, { status: 400 });
        }
        resultado = onboarding.criarCertificacao(partner_id, cert_tipo);
        break;

      case 'portal_parceiro':
        if (!partner_id) {
          return Response.json({ error: 'partner_id é obrigatório' }, { status: 400 });
        }
        resultado = onboarding.obterPortalParceiro(partner_id);
        break;

      case 'status_programa':
        resultado = onboarding.obterStatusPrograma();
        break;

      default:
        return Response.json({ error: 'operacao não reconhecida' }, { status: 400 });
    }

    return Response.json(resultado, { status: 200 });
  } catch (error) {
    console.error('[partnerOnboardingSystem] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});