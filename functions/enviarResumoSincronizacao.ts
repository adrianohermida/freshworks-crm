import { createClientFromRequest } from 'npm:@base44/sdk@0.8.20';
import { enviarEmailComTemplate } from './utils/emailTemplates.js';

/**
 * Enviar resumo diário de sincronizações por email
 * Acionada diariamente (automação)
 */

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Buscar sincronizações das últimas 24h
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const sincs = await base44.entities.TPUSincronizacao.list('-data_sincronizacao', 500);
    const sincsHoje = sincs.filter(s => new Date(s.data_sincronizacao) >= hoje);

    if (sincsHoje.length === 0) {
      return Response.json({
        status: 'ok',
        mensagem: 'Nenhuma sincronização hoje'
      });
    }

    // Calcular estatísticas
    const sucessos = sincsHoje.filter(s => s.status === 'sucesso').length;
    const erros = sincsHoje.filter(s => s.status === 'erro').length;
    const taxa_sucesso = Math.round((sucessos / sincsHoje.length) * 100);
    const movimentos = sincsHoje.reduce((sum, s) => sum + (s.total_movimentos_sincronizados || 0), 0);

    const stats = {
      total: sincsHoje.length,
      sucessos,
      erros,
      taxa_sucesso,
      movimentos
    };

    // Buscar todos os admins para enviar email
    const admins = await base44.entities.User.filter({ role: 'admin' }, null, 100);

    let enviados = 0;
    for (const admin of admins || []) {
      try {
        await enviarEmailComTemplate(
          base44,
          admin.email,
          'resumoSincronizacao',
          stats
        );
        enviados++;
      } catch (error) {
        console.warn(`Erro ao enviar email para ${admin.email}:`, error.message);
      }
    }

    return Response.json({
      status: 'sucesso',
      emails_enviados: enviados,
      stats
    });
  } catch (error) {
    console.error('[enviarResumoSincronizacao] Error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});