/**
 * Marketplace Foundation API
 * Sprint 37 - Base para marketplace de integrações e parceiros
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

class MarketplaceManager {
  constructor() {
    this.partners = new Map();
    this.apps = new Map();
    this.api_keys = new Map();
  }

  registrarParceiro(email, nome_empresa, tipo_parceiro) {
    const partner_id = `partner_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const parceiro = {
      id: partner_id,
      email,
      nome_empresa,
      tipo: tipo_parceiro, // integrator, reseller, technology, consulting
      status: 'pending_approval',
      criada_em: new Date().toISOString(),
      approved_at: null,
      revenue_share_percentage: 0
    };

    this.partners.set(partner_id, parceiro);
    return parceiro;
  }

  aprovarParceiro(partner_id, revenue_share_percentage = 20) {
    const partner = this.partners.get(partner_id);
    if (partner) {
      partner.status = 'active';
      partner.approved_at = new Date().toISOString();
      partner.revenue_share_percentage = revenue_share_percentage;
    }
    return partner;
  }

  criarAplicacao(partner_id, nome_app, descricao, categoria) {
    const app_id = `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const app = {
      id: app_id,
      partner_id,
      nome: nome_app,
      descricao,
      categoria,
      status: 'draft',
      criada_em: new Date().toISOString(),
      versao: '1.0.0',
      installacoes: 0,
      rating: 0
    };

    this.apps.set(app_id, app);
    return app;
  }

  gerarAPIKey(partner_id) {
    const api_key = `sk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const keyData = {
      id: api_key,
      partner_id,
      criada_em: new Date().toISOString(),
      ultima_usada: null,
      ativa: true
    };

    this.api_keys.set(api_key, keyData);
    return { api_key, partner_id };
  }

  instalarAplicacao(usuario_id, app_id) {
    const app = this.apps.get(app_id);
    if (app) {
      app.installacoes += 1;
    }

    return {
      usuario_id,
      app_id,
      instalada_em: new Date().toISOString(),
      status: 'active'
    };
  }

  calcularComissao(app_id, valor_transacao) {
    const app = this.apps.get(app_id);
    if (!app) return null;

    const partner = this.partners.get(app.partner_id);
    if (!partner) return null;

    const comissao = valor_transacao * (partner.revenue_share_percentage / 100);

    return {
      app_id,
      partner_id: app.partner_id,
      valor_transacao,
      taxa_comissao: partner.revenue_share_percentage,
      comissao: Math.round(comissao * 100) / 100
    };
  }

  obterDashboardParceiro(partner_id) {
    const partner = this.partners.get(partner_id);
    if (!partner) return null;

    const apps_parceiro = Array.from(this.apps.values()).filter(a => a.partner_id === partner_id);
    const total_installacoes = apps_parceiro.reduce((sum, a) => sum + a.installacoes, 0);

    return {
      partner_id,
      nome_empresa: partner.nome_empresa,
      status: partner.status,
      apps_publicadas: apps_parceiro.length,
      total_installacoes,
      revenue_share: partner.revenue_share_percentage,
      apps: apps_parceiro
    };
  }

  publicarAplicacao(app_id) {
    const app = this.apps.get(app_id);
    if (app) {
      app.status = 'published';
      return app;
    }
    return null;
  }

  obterMarketplaceStats() {
    return {
      total_partners: this.partners.size,
      partners_ativos: Array.from(this.partners.values()).filter(p => p.status === 'active').length,
      total_apps: this.apps.size,
      apps_publicadas: Array.from(this.apps.values()).filter(a => a.status === 'published').length,
      total_installacoes: Array.from(this.apps.values()).reduce((sum, a) => sum + a.installacoes, 0)
    };
  }
}

const marketplace = new MarketplaceManager();

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { operacao, email, nome_empresa, tipo_parceiro, partner_id, revenue_share_percentage, nome_app, descricao, categoria, app_id, usuario_id, valor_transacao } = body;

    if (!operacao) {
      return Response.json({ error: 'operacao é obrigatória' }, { status: 400 });
    }

    let resultado;

    switch (operacao) {
      case 'registrar_parceiro':
        if (!email || !nome_empresa || !tipo_parceiro) {
          return Response.json({ error: 'email, nome_empresa e tipo_parceiro são obrigatórios' }, { status: 400 });
        }
        resultado = marketplace.registrarParceiro(email, nome_empresa, tipo_parceiro);
        break;

      case 'aprovar_parceiro':
        if (!partner_id) {
          return Response.json({ error: 'partner_id é obrigatório' }, { status: 400 });
        }
        resultado = marketplace.aprovarParceiro(partner_id, revenue_share_percentage);
        break;

      case 'criar_app':
        if (!partner_id || !nome_app || !categoria) {
          return Response.json({ error: 'partner_id, nome_app e categoria são obrigatórios' }, { status: 400 });
        }
        resultado = marketplace.criarAplicacao(partner_id, nome_app, descricao, categoria);
        break;

      case 'gerar_api_key':
        if (!partner_id) {
          return Response.json({ error: 'partner_id é obrigatório' }, { status: 400 });
        }
        resultado = marketplace.gerarAPIKey(partner_id);
        break;

      case 'instalar_app':
        if (!usuario_id || !app_id) {
          return Response.json({ error: 'usuario_id e app_id são obrigatórios' }, { status: 400 });
        }
        resultado = marketplace.instalarAplicacao(usuario_id, app_id);
        break;

      case 'calcular_comissao':
        if (!app_id || valor_transacao === undefined) {
          return Response.json({ error: 'app_id e valor_transacao são obrigatórios' }, { status: 400 });
        }
        resultado = marketplace.calcularComissao(app_id, valor_transacao);
        break;

      case 'dashboard_parceiro':
        if (!partner_id) {
          return Response.json({ error: 'partner_id é obrigatório' }, { status: 400 });
        }
        resultado = marketplace.obterDashboardParceiro(partner_id);
        break;

      case 'publicar_app':
        if (!app_id) {
          return Response.json({ error: 'app_id é obrigatório' }, { status: 400 });
        }
        resultado = marketplace.publicarAplicacao(app_id);
        break;

      case 'stats':
        resultado = marketplace.obterMarketplaceStats();
        break;

      default:
        return Response.json({ error: 'operacao não reconhecida' }, { status: 400 });
    }

    return Response.json(resultado, { status: 200 });
  } catch (error) {
    console.error('[marketplaceFoundation] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});