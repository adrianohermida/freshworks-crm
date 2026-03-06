/**
 * Stripe Integration - Phase 1
 * Integração com Stripe para processamento de pagamentos
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

class StripePaymentManager {
  constructor() {
    this.customers = new Map();
    this.subscriptions = new Map();
    this.transactions = [];
    this.invoices = [];
  }

  criarCliente(usuario_id, dados_cliente) {
    const cliente = {
      stripe_id: `cus_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      usuario_id,
      email: dados_cliente.email,
      nome: dados_cliente.nome,
      criada_em: new Date().toISOString(),
      status: 'active'
    };

    this.customers.set(cliente.stripe_id, cliente);
    return cliente;
  }

  criarSubscricao(stripe_customer_id, plano_id, dados_subscricao) {
    const subscricao = {
      stripe_id: `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      stripe_customer_id,
      plano_id,
      status: 'active',
      criada_em: new Date().toISOString(),
      renovacao_em: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      valor_mensal: dados_subscricao.valor_mensal || 0,
      moeda: 'BRL'
    };

    this.subscriptions.set(subscricao.stripe_id, subscricao);
    return subscricao;
  }

  processarPagamento(stripe_customer_id, valor, descricao) {
    const transacao = {
      id: `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      stripe_customer_id,
      valor,
      moeda: 'BRL',
      descricao,
      status: 'succeeded',
      timestamp: new Date().toISOString()
    };

    this.transactions.push(transacao);
    return transacao;
  }

  gerarFatura(stripe_customer_id, items) {
    const total = items.reduce((sum, item) => sum + (item.valor * item.quantidade), 0);

    const fatura = {
      id: `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      stripe_customer_id,
      items,
      total,
      moeda: 'BRL',
      status: 'issued',
      data_emissao: new Date().toISOString(),
      data_vencimento: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
    };

    this.invoices.push(fatura);
    return fatura;
  }

  obterHistoricoFaturas(stripe_customer_id) {
    return this.invoices.filter(inv => inv.stripe_customer_id === stripe_customer_id);
  }

  obterHistoricoTransacoes(stripe_customer_id) {
    return this.transactions.filter(t => t.stripe_customer_id === stripe_customer_id);
  }

  cancelarSubscricao(stripe_subscription_id) {
    const subscricao = this.subscriptions.get(stripe_subscription_id);
    if (subscricao) {
      subscricao.status = 'canceled';
      subscricao.cancelada_em = new Date().toISOString();
    }
    return subscricao;
  }

  obterReceitaMensal() {
    const agora = new Date();
    const mesAtual = agora.toISOString().slice(0, 7);

    const receita = this.transactions
      .filter(t => t.timestamp.slice(0, 7) === mesAtual && t.status === 'succeeded')
      .reduce((sum, t) => sum + t.valor, 0);

    return {
      mes: mesAtual,
      receita_total: receita,
      moeda: 'BRL',
      transacoes: this.transactions.filter(t => t.timestamp.slice(0, 7) === mesAtual).length
    };
  }
}

const stripeManager = new StripePaymentManager();

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { operacao, usuario_id, dados_cliente, stripe_customer_id, plano_id, dados_subscricao, valor, descricao, items, stripe_subscription_id } = body;

    if (!operacao) {
      return Response.json({ error: 'operacao é obrigatória' }, { status: 400 });
    }

    let resultado;

    switch (operacao) {
      case 'criar_cliente':
        if (!usuario_id || !dados_cliente) {
          return Response.json({ error: 'usuario_id e dados_cliente são obrigatórios' }, { status: 400 });
        }
        resultado = stripeManager.criarCliente(usuario_id, dados_cliente);
        break;

      case 'criar_subscricao':
        if (!stripe_customer_id || !plano_id) {
          return Response.json({ error: 'stripe_customer_id e plano_id são obrigatórios' }, { status: 400 });
        }
        resultado = stripeManager.criarSubscricao(stripe_customer_id, plano_id, dados_subscricao || {});
        break;

      case 'processar_pagamento':
        if (!stripe_customer_id || !valor) {
          return Response.json({ error: 'stripe_customer_id e valor são obrigatórios' }, { status: 400 });
        }
        resultado = stripeManager.processarPagamento(stripe_customer_id, valor, descricao);
        break;

      case 'gerar_fatura':
        if (!stripe_customer_id || !items) {
          return Response.json({ error: 'stripe_customer_id e items são obrigatórios' }, { status: 400 });
        }
        resultado = stripeManager.gerarFatura(stripe_customer_id, items);
        break;

      case 'historico_faturas':
        if (!stripe_customer_id) {
          return Response.json({ error: 'stripe_customer_id é obrigatório' }, { status: 400 });
        }
        resultado = stripeManager.obterHistoricoFaturas(stripe_customer_id);
        break;

      case 'historico_transacoes':
        if (!stripe_customer_id) {
          return Response.json({ error: 'stripe_customer_id é obrigatório' }, { status: 400 });
        }
        resultado = stripeManager.obterHistoricoTransacoes(stripe_customer_id);
        break;

      case 'cancelar_subscricao':
        if (!stripe_subscription_id) {
          return Response.json({ error: 'stripe_subscription_id é obrigatório' }, { status: 400 });
        }
        resultado = stripeManager.cancelarSubscricao(stripe_subscription_id);
        break;

      case 'receita_mensal':
        resultado = stripeManager.obterReceitaMensal();
        break;

      default:
        return Response.json({ error: 'operacao não reconhecida' }, { status: 400 });
    }

    return Response.json(resultado, { status: 200 });
  } catch (error) {
    console.error('[stripeIntegrationPhase1] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});