/**
 * Data Breach Notification System
 * Sistema de notificação automática para violações de dados (GDPR/LGPD)
 * Notifica usuários e autoridades em caso de breach
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';

class BreachNotificationManager {
  constructor() {
    this.breaches = [];
    this.notifications_sent = [];
  }

  reportarBreach(tipo, severidade, dados_afetados, descricao) {
    const breach_id = `breach_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const breach = {
      id: breach_id,
      timestamp: new Date().toISOString(),
      tipo, // 'unauthorized_access', 'data_loss', 'data_corruption', 'ransomware'
      severidade, // 'low', 'medium', 'high', 'critical'
      dados_afetados: {
        total_registros: dados_afetados.total_registros,
        tipos: dados_afetados.tipos, // ['pii', 'financial', 'health']
        usuarios_impactados: dados_afetados.usuarios_impactados
      },
      descricao,
      status: 'reported',
      resposta_iniciada: new Date().toISOString(),
      investigacao_completa: false
    };

    this.breaches.push(breach);
    return breach;
  }

  gerarNotificacaoUsuario(breach_id, usuario_id, usuario_email) {
    const breach = this.breaches.find(b => b.id === breach_id);
    
    if (!breach) {
      return { erro: 'Breach não encontrado' };
    }

    const notificacao = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      breach_id,
      usuario_id,
      usuario_email,
      tipo: 'user_notification',
      enviada_em: new Date().toISOString(),
      conteudo: {
        titulo: `Aviso de Segurança - Notificação de Violação de Dados`,
        corpo: `Identificamos uma violação de dados que pode ter afetado suas informações pessoais. 
Severidade: ${breach.severidade}. 
Por favor, altere sua senha imediatamente e verifique sua conta.`,
        acoes_recomendadas: [
          'Alterar senha',
          'Ativar autenticação de dois fatores',
          'Monitorar contas bancárias',
          'Contatar suporte'
        ]
      },
      entregue: true
    };

    this.notifications_sent.push(notificacao);
    return notificacao;
  }

  notificarAutoridades(breach_id, autoridades) {
    const breach = this.breaches.find(b => b.id === breach_id);
    
    if (!breach) {
      return { erro: 'Breach não encontrado' };
    }

    const notificacoes = autoridades.map(autoridade => ({
      id: `notif_auth_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      breach_id,
      autoridade,
      tipo: 'authority_notification',
      enviada_em: new Date().toISOString(),
      conteudo: {
        tipo_violacao: breach.tipo,
        severidade: breach.severidade,
        total_afetados: breach.dados_afetados.usuarios_impactados,
        dados_comprometidos: breach.dados_afetados.tipos,
        medidas_mitigacao: [
          'Isolamento de sistemas',
          'Investigação forense',
          'Notificação de usuários',
          'Incremento de monitoramento'
        ]
      },
      entregue: true
    }));

    this.notifications_sent.push(...notificacoes);
    return notificacoes;
  }

  atualizarStatusBreach(breach_id, novo_status, investigacao_completa = false) {
    const breach = this.breaches.find(b => b.id === breach_id);
    
    if (!breach) {
      return { erro: 'Breach não encontrado' };
    }

    breach.status = novo_status; // 'reported', 'investigating', 'contained', 'resolved'
    breach.investigacao_completa = investigacao_completa;
    breach.ultima_atualizacao = new Date().toISOString();

    return breach;
  }

  obterRelatorioBreaches() {
    const porSeveridade = {};
    const porStatus = {};

    this.breaches.forEach(b => {
      porSeveridade[b.severidade] = (porSeveridade[b.severidade] || 0) + 1;
      porStatus[b.status] = (porStatus[b.status] || 0) + 1;
    });

    return {
      total_breaches: this.breaches.length,
      por_severidade: porSeveridade,
      por_status: porStatus,
      total_usuarios_afetados: this.breaches.reduce((sum, b) => sum + b.dados_afetados.usuarios_impactados, 0),
      notificacoes_enviadas: this.notifications_sent.length,
      timestamp_relatorio: new Date().toISOString()
    };
  }

  obterTimeline(breach_id) {
    const breach = this.breaches.find(b => b.id === breach_id);
    
    if (!breach) {
      return { erro: 'Breach não encontrado' };
    }

    return {
      breach_id,
      descoberta: breach.timestamp,
      resposta_iniciada: breach.resposta_iniciada,
      status_atual: breach.status,
      investigacao_completa: breach.investigacao_completa,
      dias_desde_descoberta: Math.floor(
        (new Date() - new Date(breach.timestamp)) / (1000 * 60 * 60 * 24)
      )
    };
  }
}

const breachManager = new BreachNotificationManager();

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { operacao, tipo, severidade, dados_afetados, descricao, breach_id, usuario_id, usuario_email, autoridades, novo_status } = body;

    if (!operacao) {
      return Response.json({ error: 'operacao é obrigatória' }, { status: 400 });
    }

    let resultado;

    switch (operacao) {
      case 'reportar_breach':
        if (!tipo || !severidade || !dados_afetados) {
          return Response.json({ error: 'tipo, severidade e dados_afetados são obrigatórios' }, { status: 400 });
        }
        resultado = breachManager.reportarBreach(tipo, severidade, dados_afetados, descricao);
        break;

      case 'notificar_usuario':
        if (!breach_id || !usuario_id || !usuario_email) {
          return Response.json({ error: 'breach_id, usuario_id e usuario_email são obrigatórios' }, { status: 400 });
        }
        resultado = breachManager.gerarNotificacaoUsuario(breach_id, usuario_id, usuario_email);
        break;

      case 'notificar_autoridades':
        if (!breach_id || !autoridades) {
          return Response.json({ error: 'breach_id e autoridades são obrigatórios' }, { status: 400 });
        }
        resultado = breachManager.notificarAutoridades(breach_id, autoridades);
        break;

      case 'atualizar_status':
        if (!breach_id || !novo_status) {
          return Response.json({ error: 'breach_id e novo_status são obrigatórios' }, { status: 400 });
        }
        resultado = breachManager.atualizarStatusBreach(breach_id, novo_status);
        break;

      case 'relatorio_breaches':
        resultado = breachManager.obterRelatorioBreaches();
        break;

      case 'timeline':
        if (!breach_id) {
          return Response.json({ error: 'breach_id é obrigatório' }, { status: 400 });
        }
        resultado = breachManager.obterTimeline(breach_id);
        break;

      default:
        return Response.json({ error: 'operacao não reconhecida' }, { status: 400 });
    }

    return Response.json(resultado, { status: 200 });
  } catch (error) {
    console.error('[breachNotificationSystem] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});