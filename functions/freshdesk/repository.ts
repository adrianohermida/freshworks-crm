/**
 * Freshdesk Repository - Persiste dados no banco de dados
 */
export class FreshdeskRepository {
  constructor(base44Service) {
    this.base44 = base44Service;
  }

  /**
   * Validar dados essenciais de um ticket
   */
  validarTicket(ticket) {
    if (!ticket.id) throw new Error('Ticket sem ID');
    if (!ticket.subject) throw new Error('Ticket sem subject');
    if (!ticket.requester?.email) throw new Error('Ticket sem email do solicitante');

    return true;
  }

  /**
   * Mapear status Freshdesk para status local
   */
  mapearStatus(freshdeskStatus) {
    const mapa = {
      2: 'aberto',      // open
      3: 'pendente',    // pending
      4: 'resolvido',   // resolved
      5: 'fechado'      // closed
    };
    return mapa[freshdeskStatus] || 'aberto';
  }

  /**
   * Mapear prioridade Freshdesk para local
   */
  mapearPrioridade(freshdeskPriority) {
    const mapa = {
      1: 'baixa',
      2: 'media',
      3: 'alta',
      4: 'urgente'
    };
    return mapa[freshdeskPriority] || 'media';
  }

  /**
   * Transformar dados do Freshdesk para formato local
   */
  transformarTicket(freshdeskTicket) {
    return {
      idTicketFreshdesk: String(freshdeskTicket.id),
      numeroTicket: `#${freshdeskTicket.id}`,
      titulo: freshdeskTicket.subject,
      descricao: freshdeskTicket.description_text || freshdeskTicket.description,
      status: this.mapearStatus(freshdeskTicket.status),
      prioridade: this.mapearPrioridade(freshdeskTicket.priority),
      canal: this.mapearCanal(freshdeskTicket.source),
      solicitanteEmail: freshdeskTicket.requester?.email,
      solicitanteNome: freshdeskTicket.requester?.name,
      agenteeEmail: freshdeskTicket.responder?.email,
      agenteeNome: freshdeskTicket.responder?.name,
      grupo: freshdeskTicket.group?.name,
      tags: freshdeskTicket.tags || [],
      dataCriacao: freshdeskTicket.created_at,
      dataUltimaAtualizacao: freshdeskTicket.updated_at,
      dataResolucao: freshdeskTicket.resolved_at,
      dataFechamento: freshdeskTicket.closed_at,
      tempoResposta: freshdeskTicket.first_response_time_in_minutes,
      tempoResolucao: freshdeskTicket.resolution_time_in_minutes,
      respostasCount: freshdeskTicket.reply_count || 0,
      satisfacao: freshdeskTicket.satisfaction_rating?.rating,
      dataSincronizacao: new Date().toISOString()
    };
  }

  /**
   * Mapear source (canal) Freshdesk
   */
  mapearCanal(source) {
    const mapa = {
      1: 'email',      // Email
      2: 'portal',     // Portal
      3: 'phone',      // Phone
      4: 'chat',       // Chat
      5: 'social',     // Social media
      7: 'feedback'    // Feedback
    };
    return mapa[source] || 'email';
  }

  /**
   * Salvar batch de tickets
   */
  async salvarTickets(tickets) {
    const resultado = {
      saved: 0,
      skipped: 0,
      errors: []
    };

    for (const ticket of tickets) {
      try {
        this.validarTicket(ticket);
        const ticketLocal = this.transformarTicket(ticket);

        // Procurar ticket existente
        const existente = await this.base44.entities.Ticket.filter({
          idTicketFreshdesk: ticketLocal.idTicketFreshdesk
        });

        if (existente.length > 0) {
          // Atualizar existente
          await this.base44.entities.Ticket.update(existente[0].id, ticketLocal);
        } else {
          // Criar novo
          await this.base44.entities.Ticket.create(ticketLocal);
        }

        resultado.saved++;
      } catch (err) {
        resultado.skipped++;
        resultado.errors.push(`Ticket ${ticket.id}: ${err.message}`);
      }
    }

    return resultado;
  }

  /**
   * Atualizar status de um ticket
   */
  async atualizarTicket(idTicketFreshdesk, dados) {
    const existente = await this.base44.entities.Ticket.filter({
      idTicketFreshdesk
    });

    if (!existente.length) {
      throw new Error(`Ticket ${idTicketFreshdesk} não encontrado localmente`);
    }

    const ticketLocal = this.transformarTicket(dados);
    return this.base44.entities.Ticket.update(existente[0].id, ticketLocal);
  }
}