/**
 * Freshdesk Service - Consulta tickets e gerencia operações
 */
export class FreshdeskService {
  constructor(client) {
    this.client = client;
  }

  /**
   * Consultar tickets com filtros
   */
  async consultarTickets(filtros = {}) {
    const {
      status = '2,3,4,5', // open, pending, resolved, closed
      page = 1,
      perPage = 100,
      orderBy = 'created_at',
      order = 'desc'
    } = filtros;

    const endpoint = `/tickets?status=${status}&page=${page}&per_page=${perPage}&order_by=${orderBy}&order_type=${order}`;
    return this.client.get(endpoint);
  }

  /**
   * Consultar um ticket específico
   */
  async consultarTicket(ticketId) {
    return this.client.get(`/tickets/${ticketId}`);
  }

  /**
   * Consultar conversas (comentários) de um ticket
   */
  async consultarConversas(ticketId, page = 1) {
    return this.client.get(`/tickets/${ticketId}/conversations?page=${page}&per_page=100`);
  }

  /**
   * Atualizar status de ticket
   */
  async atualizarStatus(ticketId, status) {
    // Freshdesk status: 2=open, 3=pending, 4=resolved, 5=closed
    return this.client.put(`/tickets/${ticketId}`, { status });
  }

  /**
   * Atualizar assignee de ticket
   */
  async atribuirTicket(ticketId, agentId) {
    return this.client.put(`/tickets/${ticketId}`, { responder_id: agentId });
  }

  /**
   * Atualizar prioridade de ticket
   */
  async atualizarPrioridade(ticketId, priority) {
    // Freshdesk priority: 1=low, 2=medium, 3=high, 4=urgent
    return this.client.put(`/tickets/${ticketId}`, { priority });
  }

  /**
   * Listar todos os agentes
   */
  async listarAgentes(page = 1) {
    return this.client.get(`/agents?page=${page}&per_page=100`);
  }

  /**
   * Listar todos os contatos
   */
  async listarContatos(page = 1) {
    return this.client.get(`/contacts?page=${page}&per_page=100`);
  }
}