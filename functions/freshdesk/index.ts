import { createClientFromRequest } from 'npm:@base44/sdk@0.8.6';
import { FreshdeskClient } from './utils/client.js';
import { FreshdeskService } from './service.js';
import { FreshdeskRepository } from './repository.js';

/**
 * Orquestrador Freshdesk Integration
 */
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (!user) {
      return Response.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const apiKey = Deno.env.get('FRESHDESK_API_KEY');
    if (!apiKey) {
      return Response.json({ error: 'FRESHDESK_API_KEY não configurado' }, { status: 500 });
    }

    const { action, payload } = await req.json();
    const client = new FreshdeskClient(apiKey);
    const service = new FreshdeskService(client);
    const repository = new FreshdeskRepository(base44);

    let result = {};

    // ============ SINCRONIZAÇÃO TICKETS ============
    if (action === 'tickets.sync') {
      try {
        const filtros = {
          status: payload?.status || '2,3,4,5',
          page: payload?.page || 1,
          perPage: payload?.perPage || 100
        };

        const ticketsResponse = await service.consultarTickets(filtros);
        const tickets = ticketsResponse.results || ticketsResponse;

        if (Array.isArray(tickets) && tickets.length > 0) {
          const saveResult = await repository.salvarTickets(tickets);
          result = {
            synced: saveResult.saved,
            skipped: saveResult.skipped,
            errors: saveResult.errors,
            message: `${saveResult.saved} tickets sincronizados, ${saveResult.skipped} ignorados`
          };
        } else {
          result = { synced: 0, message: 'Nenhum ticket encontrado' };
        }
      } catch (err) {
        console.error('[Freshdesk] Erro ao sincronizar tickets:', err.message);
        result = { error: true, message: err.message };
      }
    }

    // ============ CONSULTAR TICKET ============
    if (action === 'tickets.get') {
      const ticket = await service.consultarTicket(payload.ticketId);
      result = { ticket };
    }

    // ============ CONVERSAS ============
    if (action === 'tickets.conversas') {
      const conversas = await service.consultarConversas(payload.ticketId);
      result = { conversas };
    }

    // ============ ATUALIZAR STATUS ============
    if (action === 'tickets.updateStatus') {
      const updated = await service.atualizarStatus(payload.ticketId, payload.status);
      await repository.atualizarTicket(String(payload.ticketId), updated);
      result = { updated: true, ticket: updated };
    }

    // ============ ATRIBUIR AGENTE ============
    if (action === 'tickets.assign') {
      const updated = await service.atribuirTicket(payload.ticketId, payload.agentId);
      await repository.atualizarTicket(String(payload.ticketId), updated);
      result = { updated: true, ticket: updated };
    }

    // ============ ATUALIZAR PRIORIDADE ============
    if (action === 'tickets.updatePriority') {
      const updated = await service.atualizarPrioridade(payload.ticketId, payload.priority);
      await repository.atualizarTicket(String(payload.ticketId), updated);
      result = { updated: true, ticket: updated };
    }

    // ============ LISTAR AGENTES ============
    if (action === 'agents.list') {
      const agentes = await service.listarAgentes(payload?.page || 1);
      result = { agentes };
    }

    // ============ LISTAR CONTATOS ============
    if (action === 'contacts.list') {
      const contatos = await service.listarContatos(payload?.page || 1);
      result = { contatos };
    }

    return Response.json({
      success: !result?.error,
      action,
      data: result,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Erro na integração Freshdesk:', error);
    return Response.json({
      success: false,
      error: error.message || 'Erro desconhecido',
      details: error.toString()
    }, { status: 500 });
  }
});