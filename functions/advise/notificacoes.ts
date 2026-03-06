/**
 * NotificacaoService
 * 
 * Gerencia envio de notificações através de múltiplos canais
 * - Email
 * - Push Notification
 * - SMS
 * - In-App
 */

class NotificacaoService {
  constructor(adviseClient, base44Client) {
    this.adviseClient = adviseClient;
    this.base44 = base44Client;
  }

  /**
   * Enviar Notificação Email
   * Envia notificação via email
   */
  async enviarEmail(destinatario, assunto, corpo, htmlCorpo = null) {
    try {
      const response = await this.base44.integrations.Core.SendEmail({
        to: destinatario,
        subject: assunto,
        body: htmlCorpo || corpo
      });
      return {
        success: true,
        messageId: response.messageId,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  /**
   * Enviar Notificação Push
   * Envia notificação push via integração
   */
  async enviarPush(usuarioId, titulo, mensagem, dados = {}) {
    try {
      // Simula envio de push (implementar conforme plataforma)
      console.log('Push enviado:', {
        usuarioId,
        titulo,
        mensagem,
        dados,
        timestamp: new Date()
      });

      return {
        success: true,
        tipo: 'push',
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Erro ao enviar push:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  /**
   * Enviar Notificação In-App
   * Cria notificação dentro da aplicação
   */
  async enviarInApp(usuarioId, titulo, mensagem, tipo = 'info', dados = {}) {
    try {
      // Salva notificação na entidade Notificacao
      const notificacao = await this.base44.entities.Notificacao.create({
        titulo,
        mensagem,
        tipo: 'in_app',
        destinatario: usuarioId,
        status: 'pendente',
        dataCriacao: new Date().toISOString(),
        parametrosEmail: dados
      });

      return {
        success: true,
        notificacaoId: notificacao.id,
        timestamp: new Date()
      };
    } catch (error) {
      console.error('Erro ao enviar notificação in-app:', error);
      return {
        success: false,
        error: error.message,
        timestamp: new Date()
      };
    }
  }

  /**
   * Enviar Notificação Multicanal
   * Envia por múltiplos canais simultâneos
   */
  async enviarMulticanal(usuarioId, config) {
    const {
      titulo,
      mensagem,
      htmlCorpo,
      canais = ['email', 'in_app'],
      destinatarios = {},
      dados = {}
    } = config;

    const resultados = {
      email: null,
      push: null,
      inApp: null,
      timestamp: new Date()
    };

    // Email
    if (canais.includes('email') && destinatarios.email) {
      resultados.email = await this.enviarEmail(
        destinatarios.email,
        titulo,
        mensagem,
        htmlCorpo
      );
    }

    // Push
    if (canais.includes('push')) {
      resultados.push = await this.enviarPush(
        usuarioId,
        titulo,
        mensagem,
        dados
      );
    }

    // In-App
    if (canais.includes('in_app')) {
      resultados.inApp = await this.enviarInApp(
        usuarioId,
        titulo,
        mensagem,
        'alerta',
        dados
      );
    }

    return resultados;
  }

  /**
   * Enviar Notificação de Alerta
   * Especialização para alertas do processo
   */
  async enviarAlerta(usuarioId, alerta, configuracao) {
    const { canais = ['email', 'in_app'], emailDestino = null } = configuracao;

    const tituloAlerta = `⚠️ ${alerta.titulo || 'Novo Alerta'}`;
    const mensagensAlerta = {
      prazo_vencimento: `O prazo para o processo ${alerta.numeroProcesso} vence em ${alerta.diasRestantes || 'breve'} dias.`,
      movimentacao_nova: `Nova movimentação registrada no processo ${alerta.numeroProcesso}.`,
      audiencia_proxima: `Audiência agendada para o processo ${alerta.numeroProcesso}.`,
      integracao_falha: `Falha na sincronização da integração: ${alerta.detalhes || 'Erro desconhecido'}.`
    };

    const mensagem = mensagensAlerta[alerta.tipo] || alerta.descricao;

    return await this.enviarMulticanal(usuarioId, {
      titulo: tituloAlerta,
      mensagem,
      canais,
      destinatarios: {
        email: emailDestino
      },
      dados: {
        alertaId: alerta.id,
        numeroProcesso: alerta.numeroProcesso,
        severidade: alerta.severidade,
        link: `/ProcessosAdvise?processId=${alerta.numeroProcesso}`
      }
    });
  }

  /**
   * Listar Notificações Pendentes
   * Retorna todas as notificações não entregues
   */
  async listarNotificacoesPendentes(usuarioId = null) {
    try {
      const query = usuarioId 
        ? { destinatario: usuarioId, status: 'pendente' }
        : { status: 'pendente' };
      
      const notificacoes = await this.base44.entities.Notificacao.filter(query);
      return notificacoes || [];
    } catch (error) {
      console.error('Erro ao listar notificações:', error);
      return [];
    }
  }

  /**
   * Marcar Notificação como Entregue
   */
  async marcarEntregue(notificacaoId) {
    try {
      const notificacao = await this.base44.entities.Notificacao.update(notificacaoId, {
        status: 'entregue',
        dataEntrega: new Date().toISOString()
      });
      return notificacao;
    } catch (error) {
      console.error('Erro ao marcar notificação como entregue:', error);
      throw error;
    }
  }
}

export { NotificacaoService };