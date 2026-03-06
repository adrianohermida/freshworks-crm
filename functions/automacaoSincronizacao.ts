/**
 * Automação de Sincronização - Setup de automação periódica
 * Webhook handlers, notificações e status dashboard
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

/**
 * Configurar automação de sincronização
 */
async function configurarAutomacao(base44, configuracao) {
  // Esta função seria chamada uma única vez para setup
  const { intervalo_minutos = 60, tribunais_ids, notificar = true } = configuracao;

  return {
    automacao_id: `sync_${Date.now()}`,
    status: 'ativada',
    configuracao: {
      intervalo_minutos,
      tribunais_ids,
      notificar,
      proxima_sincronizacao: new Date(Date.now() + intervalo_minutos * 60000).toISOString()
    }
  };
}

/**
 * Webhook handler para eventos de sincronização
 */async function procesarWebhookSincronizacao(evento) {
  const { tipo_evento, processo_id, status, erro } = evento;

  // Log do evento
  const registro = {
    id: `webhook_${Date.now()}`,
    tipo_evento,
    processo_id,
    status,
    erro: erro || null,
    timestamp: new Date().toISOString()
  };

  // Gerar notificação se necessário
  let notificacao = null;
  if (status === 'erro') {
    notificacao = {
      tipo: 'erro_sincronizacao',
      titulo: `Erro ao sincronizar processo ${processo_id}`,
      mensagem: erro,
      prioridade: 'alta'
    };
  } else if (status === 'sucesso') {
    notificacao = {
      tipo: 'sincronizacao_sucesso',
      titulo: `Processo ${processo_id} sincronizado com sucesso`,
      mensagem: 'Dados atualizados',
      prioridade: 'baixa'
    };
  }

  return { registro, notificacao };
}

/**
 * Status dashboard de sincronização
 */
function gerarStatusDashboard(sincronizacoes) {
  const total = sincronizacoes.length;
  const sucesso = sincronizacoes.filter(s => s.status === 'sucesso').length;
  const erro = sincronizacoes.filter(s => s.status === 'erro').length;
  const processando = sincronizacoes.filter(s => s.status === 'processando').length;

  const ultimaSincronizacao = sincronizacoes
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

  return {
    resumo: {
      total,
      sucesso,
      erro,
      processando,
      taxa_sucesso_pct: Math.round((sucesso / total) * 100)
    },
    ultima_sincronizacao: ultimaSincronizacao?.timestamp,
    proxima_sincronizacao: new Date(Date.now() + 60 * 60000).toISOString(),
    tempo_medio_ms: Math.round(
      sincronizacoes.reduce((acc, s) => acc + (s.duracao_ms || 0), 0) / total
    )
  };
}

/**
 * Backend function
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { acao, configuracao, webhook_evento, sincronizacoes } = body;

    if (!acao) {
      return Response.json({ error: 'acao é obrigatória' }, { status: 400 });
    }

    let resultado;

    switch (acao) {
      case 'configurar_automacao':
        resultado = await configurarAutomacao(base44, configuracao || {});
        break;

      case 'processar_webhook':
        if (!webhook_evento) {
          return Response.json({ error: 'webhook_evento é obrigatório' }, { status: 400 });
        }
        resultado = await procesarWebhookSincronizacao(webhook_evento);
        break;

      case 'status_dashboard':
        if (!sincronizacoes) {
          return Response.json({ error: 'sincronizacoes é obrigatório' }, { status: 400 });
        }
        resultado = gerarStatusDashboard(sincronizacoes);
        break;

      default:
        return Response.json({ error: 'acao não reconhecida' }, { status: 400 });
    }

    return Response.json(resultado, { status: 200 });
  } catch (error) {
    console.error('[automacaoSincronizacao] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});